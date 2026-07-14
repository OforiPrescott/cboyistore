// Comprehensive chatbot engine for Cboyistore.
// Covers location, product advice, ordering, shipping, warranty, trade-in,
// repair, payments, account help and more.

export const WHATSAPP_NUMBER = "233541533365";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const SHOP_LAT = "6.7146";
export const SHOP_LNG = "-1.6173";

export const SUGGESTED = [
  "Where are you located?",
  "Best phone for photography",
  "Best laptop for students",
  "How does trade-in work?",
  "Do you deliver nationwide?",
  "What payment methods?",
  "Track my order",
  "New vs UK-used difference",
];

const INTENTS = [
  {
    id: "greeting",
    priority: 10,
    keywords: { hello: 3, hi: 3, hey: 3, good_morning: 4, good_afternoon: 4, good_evening: 4, yo: 2, sup: 2 },
    reply: () => {
      const h = new Date().getHours();
      const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
      return `${greet}! I'm Unplug Ur Plug, your Cboyistore assistant. Ask me about phones, laptops, delivery, trade-in, warranty, ordering — or hit a quick question below.`;
    },
  },
  {
    id: "what-sell",
    priority: 5,
    keywords: { what_do_you_sell: 5, what_do_you_have: 5, catalogue: 4, catalog: 4, products: 3, stock: 2, selling: 2, offer: 2, inventory: 4, available: 2 },
    reply:
      "We stock brand-new and UK-used iPhones, Samsung & Google phones, MacBooks, iPads, smartwatches, gaming consoles (PS5, Xbox, Switch), appliances (fridges, TVs, ACs, washing machines) and accessories. Browse the full catalogue above.",
  },
  {
    id: "location",
    priority: 8,
    keywords: { location: 5, address: 5, where: 4, direction: 4, map: 3, kumasi: 4, tafo: 4, mampong: 4, find_you: 3, gps: 3, coordinates: 3, landmark: 3, near: 2, shop: 2, store: 2, visit: 2 },
    reply:
      "We're at Tafo American Building, Mampong Rd, Kumasi — look for the Cboyistore sign. Open daily 7:00 AM – 9:00 PM. Tap 'Get directions' on the map below for navigation, or message us on WhatsApp if you get lost.",
  },
  {
    id: "hours",
    priority: 6,
    keywords: { hours: 5, open: 3, close: 3, time: 2, today: 2, operating_hours: 4, week: 2, weekend: 3, sunday: 3, saturday: 3 },
    reply: "We're open every day, 7:00 AM – 9:00 PM — including weekends and public holidays.",
  },
  {
    id: "contact",
    priority: 7,
    keywords: { whatsapp: 5, chat: 3, call: 3, contact: 4, reach: 4, number: 3, phone_number: 4, talk_to_human: 5, agent: 3, email: 4, instagram: 3, tiktok: 3, social: 2, facebook: 3 },
    reply:
      "Chat/Call: 0541 533 365 (WhatsApp preferred)\nEmail: wisede63@gmail.com\nInstagram: @Cboyistore\nTikTok: @Cboyistore\nWe reply fast during shop hours (7 AM – 9 PM daily).",
  },
  {
    id: "iphone",
    priority: 7,
    keywords: { iphone: 5, iphones: 5, apple_phone: 4, ios: 3, 17: 3, "16_pro": 4, "15_pro": 4, 14: 2, 13: 2, se: 2, apple: 3 },
    reply:
      "We carry the full iPhone line — iPhone 17, 17 Air, 17 Pro, 17 Pro Max, plus 16/15/14/13 series. Every iPhone lets you pick storage (128GB–1TB) and colour at checkout. Need help choosing? Tell me your budget and use case and I'll suggest the right model.",
  },
  {
    id: "samsung",
    priority: 7,
    keywords: { samsung: 5, galaxy: 4, s24: 4, s23: 4, z_fold: 4, z_flip: 4, a55: 3, a35: 3, s25: 4, android: 2 },
    reply:
      "We have Samsung Galaxy S25 Ultra, S24 Ultra/S24+/S24, S23 Ultra, the foldables (Z Fold6, Z Flip6) and the A-series (A55, A35). Brand new, with storage options at checkout.",
  },
  {
    id: "google-pixel",
    priority: 6,
    keywords: { pixel: 5, google: 4, pixel_9: 4, pixel_8: 4, pixel_9_pro: 5, pixel_8a: 3 },
    reply:
      "We stock Google Pixel 9 Pro, Pixel 9 and Pixel 8a — class-leading cameras, clean Android, excellent value for money.",
  },
  {
    id: "laptop",
    priority: 7,
    keywords: { laptop: 5, macbook: 5, notebook: 4, computer: 3, pc: 2, dell: 3, hp: 3, lenovo: 3, asus: 3, thinkpad: 3, xps: 3 },
    reply:
      "MacBooks (Air & Pro, M1–M4) plus Windows laptops from HP, Dell, Lenovo and Asus. Tell me your use case (school, work, gaming, design) and budget and I'll narrow it down.",
  },
  {
    id: "ipad",
    priority: 5,
    keywords: { ipad: 5, tablet: 3, ipad_pro: 4, ipad_air: 4, apple_tablet: 3 },
    reply:
      "We have iPad Pro, iPad Air and iPad in stock — perfect for school, drawing, note-taking and everyday use.",
  },
  {
    id: "watch",
    priority: 5,
    keywords: { watch: 4, smartwatch: 5, apple_watch: 5, galaxy_watch: 4, wearable: 3, fitness_tracker: 3 },
    reply:
      "We stock Apple Watch (Series 9/Ultra) and Galaxy Watch — great for fitness tracking, notifications and staying connected.",
  },
  {
    id: "gaming",
    priority: 5,
    keywords: { gaming: 4, ps5: 5, xbox: 5, switch: 4, console: 4, playstation: 4, nintendo: 3, gamer: 3 },
    reply:
      "We have PS5 (disc & digital), Xbox Series X/S and Nintendo Switch OLED in stock — new and UK-used units available.",
  },
  {
    id: "appliance",
    priority: 4,
    keywords: { fridge: 3, tv: 2, television: 3, ac: 2, air_conditioner: 4, washing_machine: 4, appliance: 4, freezer: 3, fridge_freezer: 3, smart_tv: 3 },
    reply:
      "We stock fridges, smart TVs, air conditioners, washing machines and other home appliances — ask about specific brands and sizes.",
  },
  {
    id: "accessories",
    priority: 4,
    keywords: { accessory: 4, accessories: 5, charger: 4, cable: 3, case: 3, screen_protector: 4, earphones: 3, airpods: 4, power_bank: 3, adapter: 2 },
    reply:
      "We carry chargers, cables, cases, screen protectors, AirPods, earphones, power banks and more — all compatible with the phones and laptops we sell.",
  },
  {
    id: "tradein",
    priority: 7,
    keywords: { trade: 4, trade_in: 5, tradein: 5, swap: 4, iswap: 5, sell_my: 5, old_phone: 4, exchange: 4, upgrade: 3, give_old: 3 },
    reply:
      "Our iSwap trade-in:\n1. Pick your old device and condition on the Trade-In page\n2. Get an instant online estimate\n3. Bring it to the shop or request pickup\n4. We verify the condition and apply credit toward your new device\nYou can also swap outright for cash.",
  },
  {
    id: "repair",
    priority: 7,
    keywords: { repair: 5, ifix: 5, fix: 3, screen: 3, battery: 3, broken: 3, faulty: 2, service: 2, crack: 3, dead: 2, water_damage: 3 },
    reply:
      "We offer iFix repair services:\n• Screen replacement (all major brands)\n• Battery replacement\n• Charging port / speaker fixes\n• General diagnostics\nWalk in or message us on WhatsApp with photos and we'll give a quick estimate.",
  },
  {
    id: "delivery",
    priority: 7,
    keywords: { delivery: 5, deliver: 4, ship: 4, shipping: 5, dispatch: 4, nationwide: 5, region: 2, courier: 3, send: 2, receive: 2, arrival: 2, how_long: 3, days: 2 },
    reply:
      "We deliver nationwide across Ghana via VIP, STC and DHL:\n• Kumasi metro: same-day or next-day\n• Other regions: 1–3 working days\n• You'll get a call to confirm address before dispatch\n• Pickup is also free at our Tafo shop",
  },
  {
    id: "pickup",
    priority: 5,
    keywords: { pickup: 5, pick_up: 5, collect: 4, store_visit: 4, visit_shop: 4, come_to_shop: 4, collect_myself: 3 },
    reply:
      "Free pickup at our shop: Tafo American Building, Mampong Rd, Kumasi. Open daily 7:00 AM – 9:00 PM. Just bring your order reference and ID.",
  },
  {
    id: "payment",
    priority: 7,
    keywords: { pay: 3, payment: 4, paystack: 5, cedi: 3, ghs: 3, momo: 4, mobile_money: 5, card: 3, visa: 3, mastercard: 3, mtn: 3, vodafone: 3, airtel_tigo: 3 },
    reply:
      "Pay securely at checkout with Paystack:\n• Cards: Visa, Mastercard\n• Mobile Money: MTN MoMo, Vodafone Cash, AirtelTigo Money\n• All prices in Cedis (GHS)\nWe never see or store your card details. Installment plans available — ask on WhatsApp.",
  },
  {
    id: "warranty",
    priority: 6,
    keywords: { warranty: 5, guarantee: 4, return: 3, refund: 4, replace: 3, defect: 3, faulty: 2, exchange_policy: 4, money_back: 3 },
    reply:
      "Warranty by product type:\n• New phones/laptops: 3–12 months\n• UK-used devices: 7–30 days\n• Accessories: 7–14 days\nIf something's wrong, message us on WhatsApp with photos and your order ref — we'll arrange repair, replacement or refund.",
  },
  {
    id: "price",
    priority: 5,
    keywords: { price: 5, cost: 4, how_much: 5, cheap: 3, discount: 4, deal: 3, promo: 3, budget: 3, expensive: 2, affordable: 3, offer: 2 },
    reply:
      "Prices are listed per product in Cedis (GHS). We keep fair prices and run New Arrival / Best Seller deals — check the badges on the cards. UK-used models cost less than new. Ask us about current promos on WhatsApp.",
  },
  {
    id: "recommendation",
    priority: 7,
    keywords: { recommend: 5, best_for: 4, help_choosing: 5, which_phone: 5, which_laptop: 5, good_for: 4, suggest: 4, buying: 3, advice: 4, need_phone: 4, need_laptop: 4, under: 2 },
    reply:
      "Tell me your budget and main use (gaming, camera, battery, work, school) and I'll suggest the best pick. Quick picks:\n• Student / school: MacBook Air or light Dell/HP laptop\n• Content creation: iPhone 15/16 Pro or MacBook Pro\n• Business: Samsung Galaxy S24 Ultra or ThinkPad\n• Gaming: PS5 or high-spec laptop with dedicated GPU\n• Camera: iPhone 15/16 Pro or Google Pixel 9 Pro",
  },
  {
    id: "phone-gaming",
    priority: 7,
    keywords: { gaming_phone: 5, phone_for_gaming: 5, best_gaming_phone: 5, game_on_phone: 4, mobile_gaming: 4, fps: 3 },
    reply:
      "For gaming on a phone, go for:\n• iPhone 15/16 Pro Max — great sustained performance\n• Samsung Galaxy S24 Ultra — top Android pick\n• RedMagic / ROG Phone — ask us about availability\nPair with a PS5 or Xbox for the full experience. Ask about current stock on WhatsApp.",
  },
  {
    id: "phone-camera",
    priority: 7,
    keywords: { camera_phone: 5, best_camera: 5, photo: 4, photography: 5, videography: 4, selfie: 3, video: 3 },
    reply:
      "Best camera phones right now:\n• iPhone 16 Pro / 15 Pro — best video, natural colours\n• Google Pixel 9 Pro — best point-and-shoot stills\n• Samsung Galaxy S24 Ultra — versatile zoom\nTell me your budget and I'll match you to the right model.",
  },
  {
    id: "phone-battery",
    priority: 6,
    keywords: { battery: 5, battery_life: 5, long_battery: 4, last_long: 4, charge: 3, charging: 3, power: 2 },
    reply:
      "If battery life matters most:\n• iPhone 15 Pro Max — all-day easily\n• Samsung Galaxy S24 Ultra — strong endurance\n• iPhone SE — smaller battery but reliable\nConsider a high-wattage charger and a power bank — we stock both.",
  },
  {
    id: "new-vs-ukused",
    priority: 6,
    keywords: { new: 3, uk_used: 4, ukused: 4, used: 3, refurbished: 4, pre_owned: 3, difference: 3, grade: 2 },
    reply:
      "New = sealed, full warranty, original accessories.\nUK-used = pre-owned units imported from the UK, graded A/B (like-new / very good), 7–30 day warranty, lower price.\nBoth are quality-checked before listing. UK-used is the smart pick for value without the new price tag.",
  },
  {
    id: "storage-advice",
    priority: 6,
    keywords: { storage: 5, "128gb": 4, "256gb": 4, "512gb": 4, "1tb": 4, gb: 3, space: 3, full: 2 },
    reply:
      "Quick storage guide:\n• 128GB — fine for light use, WhatsApp, photos, a few apps\n• 256GB — comfortable for most people, photos + apps + some offline video\n• 512GB — power users, 4K video, large games\n• 1TB — pros who never want to manage space\nYou can't expand storage on most modern phones, so buy for the next 2–3 years.",
  },
  {
    id: "installment",
    priority: 5,
    keywords: { installment: 5, installments: 5, pay_later: 5, monthly: 4, credit: 4, finance: 4, lay_out: 3, part_payment: 4 },
    reply:
      "Flexible payment plans are available for qualified buyers. Typical terms: 20–30% deposit, balance split over 1–6 months. Message us on WhatsApp with the product you want and we'll confirm availability and exact terms.",
  },
  {
    id: "account",
    priority: 4,
    keywords: { account: 4, sign_in: 4, login: 4, register: 4, orders: 3, my_order: 4, track: 3, tracking: 3, password: 3, forgot: 2 },
    reply:
      "Use the Sign in button at the top right to create an account or log in. Once signed in, visit Orders to track your purchases. Forgot password? Message us on WhatsApp and we'll reset it for you.",
  },
  {
    id: "order-process",
    priority: 6,
    keywords: { order: 5, ordering: 5, how_to_order: 5, place_order: 4, buy_now: 4, checkout: 4, process: 2, steps: 2 },
    reply:
      "How to order:\n1. Browse the catalogue and tap a product\n2. Choose storage and colour (if available)\n3. Tap 'Add to cart' or 'Buy now'\n4. Fill in your name, phone and delivery address\n5. Pay securely with Paystack (card or mobile money)\n6. You'll get order confirmation and tracking info\nOr message us on WhatsApp and we'll take your order manually.",
  },
  {
    id: "track-order",
    priority: 7,
    keywords: { track: 5, tracking: 5, order_status: 5, where_is_my: 4, dispatched: 4, delivery_status: 5, shipped: 3, arrived: 2, arrived: 2 },
    reply:
      "To track your order:\n• Log in and go to Orders — you'll see status updates\n• Or message us on WhatsApp with your order reference (e.g. ORD-XXXX)\nTypical timeline: confirmed → paid → fulfilled → dispatched → delivered.",
  },
  {
    id: "cancel-return",
    priority: 5,
    keywords: { cancel: 5, cancellation: 5, return: 5, return_policy: 5, send_back: 3, wrong_item: 4, damaged: 3 },
    reply:
      "Cancellations: contact us within 24 hours of ordering for a full refund.\nReturns: if the item is faulty or not as described, message us on WhatsApp with photos within the warranty period. We'll arrange repair, replacement or refund. Change of mind returns are accepted within 3 days if the item is unopened.",
  },
  {
    id: "about-us",
    priority: 5,
    keywords: { about: 5, who: 3, story: 3, mission: 3, why_choose: 4, trust: 3, reliable: 2, best: 2 },
    reply:
      "Cboyistore is a premium reseller based in Kumasi, Ghana. We specialise in brand-new and UK-used smartphones, laptops, smartwatches, gaming consoles and home appliances. Our three pillars: iBuy (quality products), iSwap (trade-in credit), iFix (repairs). Every device is quality-checked before it leaves our shop.",
  },
  {
    id: "bulk-order",
    priority: 4,
    keywords: { bulk: 5, bulk_order: 5, corporate: 4, wholesale: 5, many_phones: 3, multiple: 2, team: 2 },
    reply:
      "We handle bulk and corporate orders — message us on WhatsApp with quantities and preferred models. Pricing, delivery timelines and invoicing can be arranged.",
  },
  {
    id: "gift",
    priority: 4,
    keywords: { gift: 5, present: 4, birthday: 3, wedding: 2, christmas: 3, valentine: 2, surprise: 2 },
    reply:
      "Popular gifts right now: AirPods, smartwatches, phone cases + screen protectors bundles, and PS5. We can also add a gift note — message us on WhatsApp.",
  },
  {
    id: "promo",
    priority: 5,
    keywords: { promo: 5, promotion: 5, discount: 5, deal: 4, offer: 4, sale: 5, flash_sale: 4, new_arrival: 3, best_seller: 3 },
    reply:
      "Look for the badges on product cards — New Arrival, Best Seller and Save badges show active deals. For exclusive promos, follow us on Instagram @Cboyistore and TikTok @Cboyistore, or message us on WhatsApp.",
  },
  {
    id: "refund",
    priority: 6,
    keywords: { refund: 5, money_back: 5, return_policy: 4, dissatisfaction: 3, unhappy: 3, issue: 2, problem: 2 },
    reply:
      "If you're unhappy with your purchase:\n1. Message us on WhatsApp within your warranty period\n2. Share photos/video of the issue\n3. We'll verify and arrange repair, replacement or refund\nFor change of mind: unopened items can be returned within 3 days for a refund or exchange.",
  },
  {
    id: "social-proof",
    priority: 4,
    keywords: { review: 5, reviews: 5, feedback: 4, testimonial: 4, rating: 3, star: 2, trusted: 3 },
    reply:
      "We're proud of our 4.5/5 customer rating. Shoppers consistently mention our fair prices, quality-checked devices and fast delivery. Follow @Cboyistore on Instagram and TikTok for real customer photos and unboxings.",
  },
  {
    id: "security",
    priority: 5,
    keywords: { secure: 5, safety: 4, safe: 3, scam: 3, legit: 3, trust: 3, protect: 2 },
    reply:
      "Your safety matters:\n• Payments are processed by Paystack (PCI-DSS compliant)\n• We never ask for your card PIN or OTP\n• All devices are quality-checked before sale\n• Physical shop you can visit: Tafo American Building, Mampong Rd, Kumasi\n• WhatsApp verified business: 0541 533 365",
  },
  {
    id: "repair-warranty",
    priority: 6,
    keywords: { repair_warranty: 5, screen_cracked: 5, battery_drain: 4, phone_not_turning_on: 4, slow: 2, lag: 2 },
    reply:
      "Common fixes:\n• Cracked screen: we replace with quality parts, same-day service for most models\n• Battery drain: battery replacement restores hours of life\n• Phone not turning on: free diagnostic, we quote before fixing\n• Water damage: bring it in ASAP — don't charge it\nMessage us on WhatsApp with photos for a quick estimate.",
  },
  {
    id: "delivery-details",
    priority: 6,
    keywords: { delivery_fee: 5, shipping_cost: 5, free_delivery: 4, how_much_delivery: 5, courier_fee: 3, dispatch_fee: 3 },
    reply:
      "Delivery fees (approximate, confirmed at checkout):\n• Kumasi metro: GHS 20–50 (free on orders over GHS 5,000)\n• Accra / Tema: GHS 30–60\n• Other regions: GHS 40–100 via VIP/STC/DHL\n• Free pickup at our Tafo shop always available",
  },
  {
    id: "new-arrival",
    priority: 5,
    keywords: { new_arrival: 5, latest: 4, just_in: 4, fresh: 2, trending: 3, hot: 2 },
    reply:
      "Check the 'New Arrival' badges on product cards for the latest stock. We update the catalogue weekly — follow @Cboyistore on Instagram and TikTok for first looks and unboxing videos.",
  },
  {
    id: "why-us",
    priority: 5,
    keywords: { why_choose: 5, why_buy: 4, advantage: 4, different: 3, unique: 3, special: 2 },
    reply:
      "Why Cboyistore:\n• Quality-checked new and UK-used devices\n• Fair Cedi prices with genuine discounts\n• Three services in one place: buy, trade-in, repair\n• Fast nationwide delivery\n• Trusted by thousands of customers in Ghana\n• Physical shop you can visit in Kumasi",
  },
  {
    id: "thanks",
    priority: 3,
    keywords: { thank: 3, thanks: 3, appreciat: 2, cheers: 2, nice: 1, helpful: 2 },
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
