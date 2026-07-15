import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendWelcomeEmail(user) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: "Welcome to Cboyistore",
    html: `
      <h2>Welcome to Cboyistore</h2>
      <p>Hi ${user.name},</p>
      <p>Your account has been created successfully. You can now sign in and track your orders.</p>
      <p>We'll keep you updated on your purchases and special offers.</p>
    `,
  });
}

export async function sendOrderConfirmationEmail(order) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  const customerEmail = order.customer?.email || order.userEmail;
  if (!customerEmail) return;

  const itemsList = order.items
    .map(
      (i) =>
        `<li>${i.qty}x ${i.name}${i.storage ? ` (${i.storage})` : ""}${i.color ? ` — ${i.color}` : ""} — GHS ${(i.price * i.qty).toLocaleString()}</li>`
    )
    .join("");

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: customerEmail,
    subject: `Order confirmed: ${order.reference}`,
    html: `
      <h2>Order confirmed</h2>
      <p>Thank you for your order!</p>
      <p><strong>Reference:</strong> ${order.reference}</p>
      <p><strong>Total:</strong> GHS ${order.total.toLocaleString()}</p>
      <h3>Items</h3>
      <ul>${itemsList}</ul>
      ${order.customer?.address ? `<p><strong>Delivery address:</strong> ${order.customer.address}</p>` : ""}
      <p>We'll send you updates as your order progresses. For any questions, reply to this email or WhatsApp 0541 533 365.</p>
    `,
  });
}

export async function sendAdminNotification(customer) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: "New customer registered",
    html: `
      <h3>New customer registration</h3>
      <p>Name: ${customer.name}</p>
      <p>Email: ${customer.email}</p>
      <p>Phone: ${customer.phone || "—"}</p>
      <p>Location: ${customer.location || "—"}</p>
    `,
  });
}
