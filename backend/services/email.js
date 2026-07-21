import nodemailer from "nodemailer";

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "Cboyistore <noreplycboyistore@gmail.com>";

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });
    console.info("[email] transporter created user=%s pass_set=%s", !!process.env.SMTP_USER, !!process.env.SMTP_PASS);
  }
  return transporter;
}

function wrap(base) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${base.title}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f6f5f2; color: #0b0b12; }
    .container { max-width: 640px; margin: 0 auto; padding: 24px; }
    .card { background: #ffffff; border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 18px; }
    .logo-icon { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #FF5A36 0%, #FF8A3D 100%); display: inline-flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 16px; }
    .eyebrow { text-transform: uppercase; letter-spacing: 0.18em; font-size: 11px; font-weight: 700; color: #6C3CE0; margin: 0 0 6px; }
    h1 { font-family: "Space Grotesk", Inter, sans-serif; font-size: 24px; font-weight: 700; margin: 0 0 10px; line-height: 1.2; }
    p { margin: 0 0 12px; line-height: 1.55; font-size: 14px; color: #3a3a45; }
    .muted { color: #6e6e7a; font-size: 13px; }
    .btn { display: inline-block; text-decoration: none; padding: 12px 20px; border-radius: 999px; background: linear-gradient(135deg, #FF5A36 0%, #FF8A3D 100%); color: #fff; font-weight: 700; font-size: 14px; box-shadow: 0 8px 20px rgba(255,90,54,0.25); }
    .divider { height: 1px; background: #ececec; border: none; margin: 18px 0; }
    .item { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
    .item:last-child { border-bottom: none; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #FFF8F0; color: #0b0b12; font-weight: 700; font-size: 12px; border: 1px solid rgba(0,0,0,0.06); }
    .footer { margin-top: 24px; font-size: 12px; color: #9a9aa6; text-align: center; }
    a { color: #FF5A36; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      ${base.header}
      <hr class="divider" />
      ${base.body}
      ${base.footer ? `<div class=\"footer\">${base.footer}</div>` : ""}
    </div>
  </div>
</body>
</html>`;
}

const templates = {
  welcome: (user) =>
    wrap({
      title: "Welcome to Cboyistore",
      header: `
        <div class="logo">
          <span class="logo-icon">C</span>
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px;">Cboyistore</span>
        </div>
        <p class="eyebrow">Account created</p>
        <h1>Welcome, ${user.name || "friend"}!</h1>
      `,
      body: `
        <p>Your Cboyistore account has been created successfully. You can now sign in, browse our catalogue, and track your orders in real time.</p>
        <p style="margin-top: 14px;">
          <span class="badge">New account</span>
          <span class="badge" style="margin-left: 6px;">Free pickup in Kumasi</span>
          <span class="badge" style="margin-left: 6px;">Nationwide delivery</span>
        </p>
        <p style="margin-top: 16px;">Need help? Reply to this email or WhatsApp us at <a href="https://wa.me/233541533365">0541 533 365</a>.</p>
      `,
      footer: `Cboyistore &middot; Tafo American Building, Mampong Rd, Kumasi &middot; Open daily 7 AM – 9 PM`,
    }),

  orderConfirmation: (order) => {
    const itemsList = order.items
      .map(
        (i) =>
          `<div class="item">
            <div>
              <div style="font-weight:600; color:#0b0b12;">${i.name}</div>
              <div class="muted">${i.storage ? `${i.storage}` : ""}${i.storage && i.color ? " · " : ""}${i.color || ""}${i.colorHex ? ` <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${i.colorHex};vertical-align:middle;margin-left:4px;"></span>` : ""}</div>
            </div>
            <div style="font-weight:700; color:#0b0b12;">GHS ${(i.price * i.qty).toLocaleString()}</div>
          </div>`
      )
      .join("");

    const discountLine =
      order.discount > 0
        ? `<div class="item">
            <div style="color:#16a34a; font-weight:600;">Coupon ${order.couponCode || ""}</div>
            <div style="color:#16a34a; font-weight:700;">-GHS ${order.discount.toLocaleString()}</div>
          </div>`
        : "";

    return wrap({
      title: `Order ${order.reference} confirmed`,
      header: `
        <div class="logo">
          <span class="logo-icon">C</span>
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px;">Cboyistore</span>
        </div>
        <p class="eyebrow">Order confirmed</p>
        <h1>Thanks for your order, ${order.customer?.name || "customer"}!</h1>
      `,
      body: `
        <p>We've received your order and it's being prepared. Here's your receipt:</p>
        <div style="background:#FFF8F0; border-radius:16px; padding:14px 16px; margin: 14px 0;">
          <div class="item" style="border-bottom:1px solid #ffe6d9;">
            <div style="font-weight:600;">Reference</div>
            <div style="font-weight:700; color:#0b0b12;">${order.reference}</div>
          </div>
          <div class="item" style="border-bottom:1px solid #ffe6d9;">
            <div style="font-weight:600;">Date</div>
            <div style="color:#3a3a45;">${new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div class="item" style="border-bottom:1px solid #ffe6d9;">
            <div style="font-weight:600;">Payment</div>
            <div style="color:#16a34a; font-weight:700;">Paid ✓</div>
          </div>
          ${order.customer?.deliveryMethod === "pickup" ? `<div class="item"><div style="font-weight:600;">Delivery</div><div style="color:#3a3a45;">Pickup at Tafo American Building</div></div>` : ""}
        </div>
        <p style="font-weight:700; margin: 0 0 6px;">Items</p>
        <div style="border:1px solid #f0f0f0; border-radius:16px; padding: 10px 14px; background:#fafafa;">${itemsList}</div>
        ${discountLine}
        <div class="item" style="font-weight:800; font-size:15px; margin-top:4px;">
          <div>Total</div>
          <div style="color:#0b0b12;">GHS ${order.total.toLocaleString()}</div>
        </div>
        <p style="margin-top:14px;">We'll send you updates as your order moves from <strong>fulfilled</strong> to <strong>dispatched</strong> to <strong>delivered</strong>. For any questions, reply to this email or WhatsApp <a href="https://wa.me/233541533365">0541 533 365</a>.</p>
      `,
      footer: `Cboyistore &middot; Tafo American Building, Mampong Rd, Kumasi &middot; Open daily 7 AM – 9 PM`,
    });
  },

  passwordReset: (user, resetUrl) =>
    wrap({
      title: "Reset your password",
      header: `
        <div class="logo">
          <span class="logo-icon">C</span>
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px;">Cboyistore</span>
        </div>
        <p class="eyebrow">Password reset</p>
        <h1>Reset your password</h1>
      `,
      body: `
        <p>Hi ${user.name || "there"},</p>
        <p>We received a request to reset the password for your Cboyistore account. Tap the button below to choose a new password:</p>
        <p style="margin-top:16px;">
          <a class="btn" href="${resetUrl}">Reset password</a>
        </p>
        <p class="muted" style="margin-top:14px;">This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email — your password won't change.</p>
        <p class="muted">Need help? WhatsApp <a href="https://wa.me/233541533365">0541 533 365</a>.</p>
      `,
      footer: `Cboyistore &middot; Tafo American Building, Mampong Rd, Kumasi &middot; Open daily 7 AM – 9 PM`,
    }),

  passwordChanged: (user) =>
    wrap({
      title: "Password changed",
      header: `
        <div class="logo">
          <span class="logo-icon">C</span>
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px;">Cboyistore</span>
        </div>
        <p class="eyebrow">Security notice</p>
        <h1>Password updated</h1>
      `,
      body: `
        <p>Hi ${user.name || "there"},</p>
        <p>Your Cboyistore account password was changed successfully. If you made this change, no further action is needed.</p>
        <p>If you did <strong>not</strong> change your password, reset it immediately or contact us on WhatsApp <a href="https://wa.me/233541533365">0541 533 365</a>.</p>
      `,
      footer: `Cboyistore &middot; Tafo American Building, Mampong Rd, Kumasi &middot; Open daily 7 AM – 9 PM`,
    }),
};

export async function sendWelcomeEmail(user) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured; skipping welcome email for %s", user?.email);
    return;
  }
  try {
    await getTransporter().sendMail({ from: FROM, to: user.email, subject: "Welcome to Cboyistore", html: templates.welcome(user) });
    console.info("[email] welcome email sent to %s", user?.email);
  } catch (err) {
    console.error("[email] welcome email failed for %s: %s", user?.email, err.message);
    throw err;
  }
}

export async function sendOrderConfirmationEmail(order) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured; skipping order confirmation email for order %s", order?.reference);
    return;
  }
  const customerEmail = order.customer?.email || order.userEmail;
  if (!customerEmail) return;
  try {
    await getTransporter().sendMail({ from: FROM, to: customerEmail, subject: `Order ${order.reference} confirmed`, html: templates.orderConfirmation(order) });
  } catch (err) {
    console.error("[email] order confirmation failed for %s on order %s: %s", customerEmail, order?.reference, err.message);
    throw err;
  }
}

export async function sendAdminNotification(customer) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured; skipping admin notification for %s", customer?.email);
    return;
  }
  try {
    await getTransporter().sendMail({ from: FROM, to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, subject: "New customer registered", html: `
      <h2>New customer registration</h2>
      <p><strong>Name:</strong> ${customer.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Phone:</strong> ${customer.phone || "—"}</p>
      <p><strong>Location:</strong> ${customer.location || "—"}</p>
    `});
  } catch (err) {
    console.error("[email] admin notification failed for %s: %s", customer?.email, err.message);
    throw err;
  }
}

export async function sendPasswordResetEmail(user, resetUrl) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured; skipping password reset email for %s", user?.email);
    return;
  }
  if (!user.email) return;
  try {
    await getTransporter().sendMail({ from: FROM, to: user.email, subject: "Reset your Cboyistore password", html: templates.passwordReset(user, resetUrl) });
  } catch (err) {
    console.error("[email] password reset email failed for %s: %s", user?.email, err.message);
    throw err;
  }
}

export async function sendPasswordChangedEmail(user) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured; skipping password changed email for %s", user?.email);
    return;
  }
  if (!user.email) return;
  try {
    await getTransporter().sendMail({ from: FROM, to: user.email, subject: "Your Cboyistore password was changed", html: templates.passwordChanged(user) });
  } catch (err) {
    console.error("[email] password changed email failed for %s: %s", user?.email, err.message);
    throw err;
  }
}
