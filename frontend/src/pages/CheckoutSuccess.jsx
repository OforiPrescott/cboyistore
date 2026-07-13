import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyPayment } from "../lib/api.js";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [state, setState] = useState("checking");

  useEffect(() => {
    if (!reference) {
      setState("missing");
      return;
    }
    verifyPayment(reference)
      .then((data) => setState(data.status === "success" ? "success" : "failed"))
      .catch(() => setState("failed"));
  }, [reference]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      {state === "checking" && <p className="text-ink/60">Confirming your payment…</p>}
      {state === "success" && (
        <>
          <h1 className="font-display text-3xl font-700 text-ink">Payment confirmed 🎉</h1>
          <p className="mt-2 text-ink/60">Reference: {reference}</p>
        </>
      )}
      {state === "failed" && (
        <>
          <h1 className="font-display text-3xl font-700 text-signal">We couldn't confirm that payment</h1>
          <p className="mt-2 text-ink/60">Contact us on WhatsApp with reference {reference}.</p>
        </>
      )}
      {state === "missing" && <p className="text-ink/60">No payment reference found.</p>}
      <Link to="/" className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-600 text-cream">
        Back to shop
      </Link>
    </div>
  );
}
