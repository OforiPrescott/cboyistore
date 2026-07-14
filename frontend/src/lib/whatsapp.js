import { formatGHS } from "./format.js";

const SHOP_NUMBER = "233541533365";

export function whatsAppProductLink(product, variant) {
  const storage = variant?.storage ? ` (${variant.storage})` : "";
  const color = variant?.color ? ` - ${variant.color.name}` : "";
  const text = encodeURIComponent(
    `Hi Cboyistore, I'm interested in the ${product.name}${storage}${color} — ${formatGHS(variant?.price || product.price)}. Is it still available?`
  );
  return `https://wa.me/${SHOP_NUMBER}?text=${text}`;
}

export function whatsAppCartLink(items, total) {
  const lines = items
    .map(
      (i) =>
        `- ${i.name}${i.storage ? ` (${i.storage})` : ""}${i.color ? ` - ${i.color.name}` : ""}: ${formatGHS(i.price)} x ${i.qty}`
    )
    .join("\n");
  const text = encodeURIComponent(
    `Hi Cboyistore, I'd like to place an order:\n\n${lines}\n\nTotal: ${formatGHS(total)}\n\nMy details:\nName:\nPhone:\nDelivery:`
  );
  return `https://wa.me/${SHOP_NUMBER}?text=${text}`;
}

export function whatsAppOrderStatus(reference) {
  const text = encodeURIComponent(
    `Hi Cboyistore, I'd like to check the status of my order: ${reference}`
  );
  return `https://wa.me/${SHOP_NUMBER}?text=${text}`;
}

export function whatsAppTradeIn(deviceName, condition, estimate) {
  const text = encodeURIComponent(
    `Hi Cboyistore, I'd like to trade in my ${deviceName} (condition: ${condition}). The online estimate was ${formatGHS(estimate)}. Can I book a visit?`
  );
  return `https://wa.me/${SHOP_NUMBER}?text=${text}`;
}
