// Unified chatbot engine for Cboyistore.
// Powers both the Support assistant and the Shop assistant modes.

export const WHATSAPP_NUMBER = "233541533365";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

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

const INTENTS = [
  {
    id: "greeting",
    priority: 10,
    keywords: { hello: 3, hi: 3, hey: 3, good_morning: 4, good_afternoon: 4, good_evening: 4, yo: 2, sup: 2 },
    reply: () => {
      const h = new Date().getHours();
      const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
      return `${greet}! I'm Unplug Ur Plug, your Cboyistore assistant. Ask me about iPhones, MacBooks, delivery, trade-in or anything in the shop — or hit a quick question below.`;
    },
  },
  {
    id: "what-sell",
    priority: 5,
    keywords: { what_do_you_sell: 5, what_do_you_have: 5, catalogue: 4, catalog: 4, products: 3, shop: 2, store: 2, stock: 2, selling: 2, offer: 2 },
    reply:
      "We stock brand-new and UK-used iPhones, Samsung & Google phones, MacBooks, iPads, smartwatches, gaming consoles (PS5, Xbox, Switch), appliances (fridges, TVs, ACs, washing machines) and accessories. Browse it all in the catalogue above.",
  },
  {
    id: "iphone",
    priority: 6,
    keywords: { iphone: 5, iphones: 5, apple_phone: 4, ios: 3, 17: 3, "16_pro": 4, "15_pro": 4, 14: 2, 13: 2, se: 2 },
    reply:
      "We carry the full iPhone line — including the new iPhone 17, 17 Air, 17 Pro and 17 Pro Max, plus 16/15/14/13 series. Every iPhone lets you pick storage (128GB–1TB) and colour at checkout. Want the latest? Tap an iPhone in the catalogue.",
  },
  {
    id: "samsung",
    priority: 6,
    keywords: { samsung: 5, galaxy: 4, s24: 4, s23: 4, z_fold: 4, z_flip: 4, a55: 3, a35: 3, s25: 4 },
    reply:
      "We have Samsung Galaxy S24 Ultra/S24+/S24, S23 Ultra, the foldables (Z Fold6, Z Flip6) and the A-series. Brand new, with storage options at checkout.",
  },
  {
    id: "google-pixel",
    priority: 6,
    keywords: { pixel: 5, google: 4, pixel_9: 4, pixel_8: 4 },
    reply:
      "We stock Google Pixel 9 Pro, Pixel 9 and Pixel 8a — great cameras, clean Android, excellent value.",
  },
  {
    id: "laptop",
    priority: 6,
    keywords: { laptop: 5, macbook: 5, notebook: 4, computer: 3, pc: 2, dell: 3, hp: 3, lenovo: 3, asus: 3, thinkpad: 3, xps: 3 },
    reply:
      "MacBooks (Air & Pro, M1–M4) plus Windows laptops from HP, Dell, Lenovo and Asus are in stock. Great for school, work and content creation.",
  },
  {
    id: "ipad",
    priority: 5,
    keywords: { ipad: 5, tablet: 3, ipad_pro: 4, ipad_air: 4 },
    reply:
      "We have iPad Pro, iPad Air and iPad in stock. Perfect for school, drawing and everyday use.",
  },
  {
    id: "watch",
    priority: 5,
    keywords: { watch: 4, smartwatch: 5, apple_watch: 5, galaxy_watch: 4, wearable: 3 },
    reply:
      "We stock Apple Watch and Galaxy Watch — great for fitness, notifications and staying connected.",
  },
  {
    id: "gaming",
    priority: 5,
    keywords: { gaming: 4, ps5: 5, xbox: 5, switch: 4, console: 4, playstation: 4, nintendo: 3 },
    reply:
      "We have PS5, Xbox Series X/S and Nintendo Switch in stock — new and UK-used units available.",
  },
  {
    id: "appliance",
    priority: 4,
    keywords: { fridge: 3, tv: 2, television: 3, ac: 2, air_conditioner: 4, washing_machine: 4, appliance: 4, freezer: 3 },
    reply:
      "We stock fridges, TVs, air conditioners, washing machines and other home appliances.",
  },
  {
    id: "tradein",
    priority: 6,
    keywords: { trade: 4, trade_in: 5, tradein: 5, swap: 4, iswap: 5, sell_my: 5, old_phone: 4, exchange: 4, upgrade: 3 },
    reply:
      "Our iSwap trade-in lets you swap your old phone for credit toward a new one. Head to the Trade-In page, pick your device and condition, and we'll estimate your value instantly.",
  },
  {
    id: "repair",
    priority: 6,
    keywords: { repair: 5, ifix: 5, fix: 3, screen: 3, battery: 3, broken: 3, faulty: 2, service: 2 },
    reply:
      "We offer iFix repair services — screen, battery and general fixes. Bring the device to the shop or ask on WhatsApp and we'll advise on the fix and price.",
  },
  {
    id: "delivery",
    priority: 6,
    keywords: { delivery: 5, deliver: 4, ship: 4, shipping: 5, dispatch: 4, nationwide: 5, region: 2, courier: 3, send: 2 },
    reply:
      "We deliver nationwide across Ghana (VIP/STC/DHL). Most orders go out within 1–2 working days; you'll get a call on your number to confirm the address.",
  },
  {
    id: "pickup",
    priority: 5,
    keywords: { pickup: 5, pick_up: 5, collect: 4, store_visit: 4, visit_shop: 4, come_to_shop: 4 },
    reply:
      "You can pick up at our shop: Tafo American Building, Mampong Rd, Kumasi. Open every day, 7:00 AM – 9:00 PM.",
  },
  {
    id: "payment",
    priority: 6,
    keywords: { pay: 3, payment: 4, paystack: 5, cedi: 3, ghs: 3, momo: 4, mobile_money: 5, card: 3, visa: 3, mastercard: 3 },
    reply:
      "Pay securely at checkout with Paystack — cards (Visa/Mastercard) and mobile money, all in Cedis (GHS). We never see or store your card details.",
  },
  {
    id: "warranty",
    priority: 5,
    keywords: { warranty: 5, guarantee: 4, return: 3, refund: 4, replace: 3, defect: 3 },
    reply:
      "Every device comes with a 3–30 day warranty depending on the product. If something's wrong, reach us on WhatsApp and we'll sort a repair, replacement or refund.",
  },
  {
    id: "price",
    priority: 5,
    keywords: { price: 5, cost: 4, how_much: 5, cheap: 3, discount: 4, deal: 3, promo: 3, budget: 3 },
    reply:
      "Prices are listed on each product in Cedis (GHS). We keep fair Cedi prices and run New Arrival / Best Seller deals — check the badges on the cards.",
  },
  {
    id: "recommendation",
    priority: 6,
    keywords: { recommend: 5, best_for: 4, help_choosing: 5, which_phone: 5, which_laptop: 5, good_for: 4, suggest: 4, buying: 3 },
    reply:
      "I can help narrow it down. For students, the MacBook Air or a lightweight Dell/HP laptop is great. For creators, the iPhone 15/16 Pro or a MacBook Pro is strong. For business use, the Samsung Galaxy S24 Ultra or a ThinkPad-style laptop is a solid pick.",
  },
  {
    id: "installment",
    priority: 5,
    keywords: { installment: 5, installments: 5, pay_later: 5, monthly: 4, credit: 4, finance: 4 },
    reply:
      "We can discuss flexible payment options for qualified buyers. For the fastest answer, message us on WhatsApp and we'll confirm availability and terms for your order.",
  },
  {
    id: "location",
    priority: 6,
    keywords: { location: 5, address: 5, where: 4, direction: 4, map: 3, kumasi: 4, tafo: 4, mampong: 4, find_you: 3 },
    reply:
      "We're at Tafo American Building, Mampong Rd, Kumasi (near the map on this page). Open daily 7:00 AM – 9:00 PM. Tap 'Get directions' on the map for navigation.",
  },
  {
    id: "hours",
    priority: 5,
    keywords: { hours: 5, open: 3, close: 3, time: 2, today: 2 },
    reply: "Our shop is open every day, 7:00 AM – 9:00 PM.",
  },
  {
    id: "contact",
    priority: 5,
    keywords: { whatsapp: 5, chat: 3, call: 3, contact: 4, reach: 4, number: 3, phone_number: 4, talk_to_human: 5, agent: 3 },
    reply:
      "Sure — chat with the team directly on WhatsApp: https://wa.me/233541533365 (0541 533 365). We reply fast during shop hours.",
  },
  {
    id: "account",
    priority: 4,
    keywords: { account: 4, sign_in: 4, login: 4, register: 4, orders: 3, my_order: 4, track: 3, tracking: 3 },
    reply:
      "Use the Sign in button at the top right to create an account or log in. Once signed in, go to Orders to track your purchases.",
  },
  {
    id: "thanks",
    priority: 3,
    keywords: { thank: 3, thanks: 3, appreciat: 2, cheers: 2, nice: 1 },
    reply: "Anytime! Reach out anytime you need help.",
  },
];

const FALLBACK =
  "Hmm, I'm not 100% sure about that one. The fastest way to get a solid answer is our WhatsApp line — https://wa.me/233541533365 (0541 533 365). Want me to open it for you?";

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text).split(" ").filter(Boolean);
}

function scoreIntent(message, intent) {
  const tokens = tokenize(message);
  if (tokens.length === 0) return 0;

  let score = 0;
  const keywordTokens = Object.keys(intent.keywords);

  for (const token of tokens) {
    for (const kw of keywordTokens) {
      if (token === kw || token.includes(kw) || kw.includes(token)) {
        const weight = intent.keywords[kw] || 1;
        score += weight;
      }
    }
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
    const weightedScore = s * intent.priority;
    if (weightedScore > bestScore) {
      bestScore = weightedScore;
      best = intent;
    }
  }

  if (best && bestScore >= 3) {
    return typeof best.reply === "function" ? best.reply() : best.reply;
  }

  return FALLBACK;
}
