import axios from "axios";

// Builds a wa.me deep link pre-filled with an order summary. Real WhatsApp
// Business API access requires Meta approval and a paid provider, which is
// overkill for a single shop — a wa.me link that opens WhatsApp with the
// message ready to send is the same pattern most Ghanaian shops actually use.
export function buildWhatsappLink(order) {
  const shopNumber = process.env.SHOP_WHATSAPP || "233541533365";
  const lines = [
    `New order ${order.reference}`,
    `Customer: ${order.customer.name} (${order.customer.phone})`,
    order.customer.address ? `Delivery: ${order.customer.address}` : null,
    "",
    ...order.items.map((i) => `${i.qty}x ${i.name} — GHS ${i.price * i.qty}`),
    "",
    `Total: GHS ${order.total}`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${shopNumber}?text=${text}`;
}

// Optional SMS alert to the shop owner via Arkesel (arkesel.com). Silently
// no-ops if ARKESEL_API_KEY isn't set, so the rest of the app works fine
// without it — this is a nice-to-have, not a dependency.
export async function notifyShopBySms(order) {
  const apiKey = process.env.ARKESEL_API_KEY;
  const to = process.env.SHOP_NOTIFY_PHONE;
  if (!apiKey || !to) return { sent: false, reason: "SMS not configured" };

  const message = `Cboyistore: new order ${order.reference} from ${order.customer.name}, GHS ${order.total}. Check the admin dashboard.`;

  try {
    await axios.post(
      "https://sms.arkesel.com/api/v2/sms/send",
      {
        sender: process.env.ARKESEL_SENDER_ID || "Cboyistore",
        message,
        recipients: [to],
      },
      { headers: { "api-key": apiKey } }
    );
    return { sent: true };
  } catch (err) {
    console.error("Arkesel SMS failed:", err.response?.data || err.message);
    return { sent: false, reason: "SMS provider error" };
  }
}
