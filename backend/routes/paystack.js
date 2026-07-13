import express, { Router } from "express";
import axios from "axios";
import crypto from "crypto";
import { markOrderPaid } from "./orders.js";

const router = Router();

const paystackApi = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// POST /api/paystack/initialize
// body: { email, amount (in GHS, major units), reference }
router.post("/initialize", async (req, res, next) => {
  try {
    const { email, amount, reference, metadata } = req.body;
    if (!email || !amount || !reference) {
      return res.status(400).json({ error: "email, amount and reference are required" });
    }

    const response = await paystackApi.post("/transaction/initialize", {
      email,
      amount: Math.round(amount * 100), // Paystack expects the smallest currency unit (pesewas)
      currency: "GHS",
      reference,
      metadata,
      callback_url: `${process.env.CLIENT_URL}/checkout/success`,
    });

    res.json(response.data.data); // { authorization_url, access_code, reference }
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

// GET /api/paystack/verify/:reference
router.get("/verify/:reference", async (req, res, next) => {
  try {
    const { reference } = req.params;
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    const data = response.data.data;

    if (data.status === "success") {
      await markOrderPaid(reference);
    }

    res.json(data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

// POST /api/paystack/webhook
// Configure this URL in your Paystack dashboard for production reliability
// (verification shouldn't rely on the client redirect alone).
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["x-paystack-signature"];
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());
    if (event.event === "charge.success") {
      await markOrderPaid(event.data.reference);
    }

    res.sendStatus(200);
  }
);

export default router;
