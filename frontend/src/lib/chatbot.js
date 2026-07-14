// Lightweight, fully client-side FAQ assistant for Cboyistore.
// "Unplug Ur Plug" answers common questions about what we sell and, when it
// can't help, points the customer to our WhatsApp line.

export const WHATSAPP_NUMBER = "233541533365";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// Each intent: keywords the customer might use + a reply (string or function
// receiving the matched context). Higher keyword weight = stronger signal.
const INTENTS = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "yo", "sup"],
    reply: () => {
      const h = new Date().getHours();
      const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
      return `${greet}! I'm Unplug Ur Plug, your Cboyistore assistant. Ask me about iPhones, MacBooks, delivery, trade-in or anything in the shop — or hit a quick question below.`;
    },
  },
  {
    id: "what-sell",
    keywords: ["sell", "selling", "products", "catalogue", "catalog", "shop", "store", "offer", "buy", "stock", "have"],
    reply:
      "We stock brand-new and UK-used iPhones, Samsung & Google phones, MacBooks, iPads, smartwatches, gaming consoles (PS5, Xbox, Switch), appliances (fridges, TVs, ACs, washing machines) and accessories. Browse it all in the catalogue above.",
  },
  {
    id: "iphone",
    keywords: ["iphone", "ios", "apple phone", "17", "16 pro", "15 pro", "14", "13"],
    reply:
      "We carry the full iPhone line — including the new iPhone 17, 17 Air, 17 Pro and 17 Pro Max, plus 16/15/14/13 series. Every iPhone lets you pick storage (128GB–1TB) and colour at checkout. Want the latest? Tap an iPhone in the catalogue.",
  },
  {
    id: "storage-color",
    keywords: ["storage", "gb", "256", "512", "1tb", "colour", "color", "colors", "variant", "option"],
    reply:
      "Yes! On each phone's quick view you can choose your storage (e.g. 128GB / 256GB / 512GB / 1TB) and colour. The price updates with the storage you pick, and your choice rides along into the cart and order.",
  },
  {
    id: "samsung",
    keywords: ["samsung", "galaxy", "s24", "s23", "z fold", "z flip", "a55", "a35"],
    reply:
      "We have Samsung Galaxy S24 Ultra/S24+/S24, S23 Ultra, the foldables (Z Fold6, Z Flip6) and the A-series. Brand new, with storage options at checkout.",
  },
  {
    id: "laptop",
    keywords: ["laptop", "macbook", "notebook", "computer", "pc", "dell", "hp", "lenovo", "asus", "thinkpad", "xps"],
    reply:
      "MacBooks (Air & Pro, M1–M3) plus Windows laptops from HP, Dell, Lenovo and Asus are in stock. Great for school, work and content creation.",
  },
  {
    id: "tradein",
    keywords: ["trade", "trade-in", "tradein", "swap", "iswap", "sell my", "old phone", "exchange", "upgrade"],
    reply:
      "Our iSwap trade-in lets you swap your old phone for credit toward a new one. Head to the Trade-In page, pick your device and condition, and we'll estimate your value instantly.",
  },
  {
    id: "repair",
    keywords: ["repair", "ifix", "fix", "screen", "battery", "broken", "faulty", "service"],
    reply:
      "We offer iFix repair services — screen, battery and general fixes. Bring the device to the shop or ask on WhatsApp and we'll advise on the fix and price.",
  },
  {
    id: "delivery",
    keywords: ["delivery", "deliver", "ship", "shipping", "dispatch", "nationwide", "region", "send", "courier"],
    reply:
      "We deliver nationwide across Ghana (VIP/STC/DHL). Most orders go out within 1–2 working days; you'll get a call on your number to confirm the address.",
  },
  {
    id: "pickup",
    keywords: ["pickup", "pick up", "collect", "store visit", "visit shop", "come to shop"],
    reply:
      "You can pick up at our shop: Tafo American Building, Mampong Rd, Kumasi. Open every day, 7:00 AM – 9:00 PM.",
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "paystack", "cedi", "ghs", "momo", "mobile money", "card", "visa", "mastercard", "installment", "credit"],
    reply:
      "Pay securely at checkout with Paystack — cards (Visa/Mastercard) and mobile money, all in Cedis (GHS). We never see or store your card details.",
  },
  {
    id: "warranty",
    keywords: ["warranty", "guarantee", "faulty", "defect", "return", "refund", "replace"],
    reply:
      "Every device comes with a 3–30 day warranty depending on the product. If something's wrong, reach us on WhatsApp and we'll sort a repair, replacement or refund.",
  },
  {
    id: "price",
    keywords: ["price", "cost", "how much", "cheap", "discount", "deal", "promo", "budget"],
    reply:
      "Prices are listed on each product in Cedis (GHS). We keep fair Cedi prices and run New Arrival / Best Seller deals — check the badges on the cards.",
  },
  {
    id: "recommendation",
    keywords: ["recommend", "best for", "help choosing", "which phone", "which laptop", "good for", "suggest", "buying"],
    reply:
      "I can help narrow it down. For students, the MacBook Air or a lightweight Dell/HP laptop is great. For creators, the iPhone 15/16 Pro or a MacBook Pro is strong. For business use, the Samsung Galaxy S24 Ultra or a ThinkPad-style laptop is a solid pick.",
  },
  {
    id: "installment",
    keywords: ["installment", "installments", "pay later", "monthly", "credit", "finance"],
    reply:
      "We can discuss flexible payment options for qualified buyers. For the fastest answer, message us on WhatsApp and we’ll confirm availability and terms for your order.",
  },
  {
    id: "location",
    keywords: ["location", "address", "where", "direction", "map", "kumasi", "tafo", "mampong", "find you"],
    reply:
      "We're at Tafo American Building, Mampong Rd, Kumasi (near the map on this page). Open daily 7:00 AM – 9:00 PM. Tap 'Get directions' on the map for navigation.",
  },
  {
    id: "hours",
    keywords: ["hours", "open", "close", "time", "today"],
    reply: "Our shop is open every day, 7:00 AM – 9:00 PM.",
  },
  {
    id: "whatsapp",
    keywords: ["whatsapp", "chat", "call", "contact", "reach", "number", "phone number", "talk to human", "agent"],
    reply:
      "Sure — chat with the team directly on WhatsApp: https://wa.me/233541533365 (0541 533 365). We reply fast during shop hours.",
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "appreciate", "cheers", "nice"],
    reply: "Anytime! Reach out anytime you need help.",
  },
];

const FALLBACK =
  "Hmm, I'm not 100% sure about that one. The fastest way to get a solid answer is our WhatsApp line — https://wa.me/233541533365 (0541 533 365). Want me to open it for you?";

export const SUGGESTED = [
  "What do you sell?",
  "Tell me about the iPhone 17",
  "How does trade-in work?",
  "Do you deliver nationwide?",
  "How can I pay?",
  "Where is the shop?",
  "I need help choosing a laptop",
  "Can I buy on installment?",
];

function scoreIntent(message, intent) {
  const text = message.toLowerCase();
  let score = 0;
  for (const kw of intent.keywords) {
    if (text.includes(kw)) score += 1;
  }
  return score;
}

export function answer(message) {
  const text = (message || "").trim();
  if (!text) return FALLBACK;

  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const s = scoreIntent(text, intent);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }

  // Threshold: require at least one real keyword hit, and avoid matching on
  // ultra-generic words alone.
  if (best && bestScore >= 1) {
    return typeof best.reply === "function" ? best.reply() : best.reply;
  }
  return FALLBACK;
}
