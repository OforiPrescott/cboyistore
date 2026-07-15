// Comprehensive chatbot engine for Cboyistore.
// Covers phones, laptops, appliances, location, installment, delivery,
// warranty, trade-in, repair, payments, account help and more.

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
  "Installment plan",
  "iPhone 17 vs Samsung S25",
  "Best phone for gaming",
  "Which fridge do you have?",
  "Warranty claim process",
];

const INTENTS = [
  {
    id: "greeting",
    priority: 10,
    keywords: { hello: 3, hi: 3, hey: 3, good_morning: 4, good_afternoon: 4, good_evening: 4, yo: 2, sup: 2 },
    reply: () => {
      const h = new Date().getHours();
      const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
      return `${greet}! I'm Unplug Ur Plug, your Cboyistore assistant. Ask me about phones, laptops, appliances, delivery, trade-in, warranty, installment — or tap a quick question below.`;
    },
  },
  {
    id: "what-sell",
    priority: 5,
    keywords: { what_do_you_sell: 5, what_do_you_have: 5, catalogue: 4, catalog: 4, products: 3, stock: 2, selling: 2, offer: 2, inventory: 4, available: 2, what_do_you_stock: 5, items: 2 },
    reply:
      "We stock brand-new and UK-used iPhones, Samsung & Google phones, MacBooks, iPads, smartwatches, gaming consoles (PS5, Xbox, Switch), appliances (fridges, TVs, ACs, washing machines, freezers, microwaves) and accessories. Browse the full catalogue above.",
  },
  {
    id: "location",
    priority: 8,
    keywords: { location: 5, address: 5, where: 4, direction: 4, map: 3, kumasi: 4, tafo: 4, mampong: 4, find_you: 3, gps: 6, coordinates: 5, landmark: 4, near: 3, shop: 2, store: 2, visit: 3, where_is_shop: 5, how_to_get_there: 5, directions: 4, navigate: 3 },
    reply:
      "We're at Tafo American Building, Mampong Rd, Kumasi — look for the Cboyistore sign on the ground floor. GPS: 6.7146, -1.6173. Open daily 7:00 AM – 9:00 PM. Tap 'Get directions' on the map below for navigation, or message us on WhatsApp if you get lost.",
  },
  {
    id: "location-details",
    priority: 7,
    keywords: { tafo_american: 5, mampong_road: 5, kumasi_central: 4, nearest_town: 3, landmark_nearby: 4, bus_stop: 3, taxi_rank: 3, how_far: 3, distance: 2 },
    reply:
      "We're at Tafo American Building on Mampong Rd, Kumasi. It's close to the Tafo market area and easy to reach by taxi or trotro from Kumasi Central. If you get lost, call or WhatsApp 0541 533 365 and we'll guide you.",
  },
  {
    id: "hours",
    priority: 6,
    keywords: { hours: 5, open: 3, close: 3, time: 2, today: 2, operating_hours: 4, week: 2, weekend: 3, sunday: 3, saturday: 3, what_time_do_you_open: 5, what_time_do_you_close: 5 },
    reply: "We're open every day, 7:00 AM – 9:00 PM — including weekends and public holidays.",
  },
  {
    id: "contact",
    priority: 7,
    keywords: { whatsapp: 5, chat: 3, call: 3, contact: 4, reach: 4, number: 3, phone_number: 4, talk_to_human: 5, agent: 3, email: 4, instagram: 3, tiktok: 3, social: 2, facebook: 3, phone: 2 },
    reply:
      "Chat/Call/WhatsApp: 0541 533 365 (preferred)\nEmail: wisede63@gmail.com\nInstagram: @Cboyistore\nTikTok: @Cboyistore\nFacebook: Cboyistore\nWe reply fast during shop hours (7 AM – 9 PM daily). For orders and installment questions, WhatsApp is the fastest.",
  },
  {
    id: "iphone",
    priority: 7,
    keywords: { iphone: 5, iphones: 5, apple_phone: 4, ios: 3, 17: 3, "16_pro": 4, "15_pro": 4, 14: 2, 13: 2, se: 2, apple: 3, iphone_17: 5, iphone_16: 4, iphone_15: 4, iphone_14: 3 },
    reply:
      "We carry the full iPhone line — iPhone 17, 17 Air, 17 Pro, 17 Pro Max, plus 16/15/14/13 series and iPhone SE. Every iPhone lets you pick storage (128GB–1TB) and colour at checkout. Need help choosing? Tell me your budget and use case and I'll suggest the right model.",
  },
  {
    id: "iphone-17",
    priority: 8,
    keywords: { iphone_17: 8, iphone_17_pro: 7, iphone_17_pro_max: 7, iphone_17_air: 7, new_iphone: 6, latest_iphone: 6 },
    reply:
      "iPhone 17 series is here! We stock:\n• iPhone 17 — great all-rounder, A19 chip, 48MP camera\n• iPhone 17 Air — ultra-thin, lightweight, perfect for one-hand use\n• iPhone 17 Pro — titanium, A19 Pro, pro camera system\n• iPhone 17 Pro Max — biggest screen, best battery, pro cameras\nAll available in multiple storage sizes and colours. Ask about current stock on WhatsApp.",
  },
  {
    id: "iphone-comparison",
    priority: 7,
    keywords: { iphone_17_vs: 6, iphone_16_vs: 6, iphone_15_vs: 6, compare_iphone: 5, which_iphone: 5, difference_between_iphone: 5, iphone_16_pro_vs_17: 5 },
    reply:
      "Quick iPhone comparisons:\n• 17 vs 16 Pro: 17 has A19 chip, 16 Pro has A18 Pro + more mature camera — both excellent\n• 17 Pro Max vs 16 Pro Max: 17 Pro Max has bigger screen and battery, 16 Pro Max still has best-in-class video\n• 17 Air vs 17: Air is thinner and lighter, 17 has more battery and lower price\n• 17 vs 15: 17 has better chip, camera and USB-C\nFor exact pricing and availability, ask us on WhatsApp.",
  },
  {
    id: "samsung",
    priority: 7,
    keywords: { samsung: 5, galaxy: 4, s24: 4, s23: 4, z_fold: 4, z_flip: 4, a55: 3, a35: 3, s25: 4, android: 2, samsung_s25: 6, samsung_s24: 5, samsung_s23: 4, samsung_z_fold: 5, samsung_z_flip: 5 },
    reply:
      "We have Samsung Galaxy S25 Ultra, S24 Ultra/S24+/S24, S23 Ultra, the foldables (Z Fold6, Z Flip6) and the A-series (A55, A35). Brand new, with storage options at checkout.",
  },
  {
    id: "samsung-foldables",
    priority: 7,
    keywords: { z_fold: 6, z_flip: 6, foldable: 5, fold: 4, flip: 4, foldable_phone: 5, samsung_fold: 5, samsung_flip: 5 },
    reply:
      "Samsung foldables we stock:\n• Galaxy Z Fold6 — 7.6\" inner screen, productivity powerhouse\n• Galaxy Z Flip6 — compact flip phone, 6.7\" main display, stylish\nBoth are brand new with full warranty. Ask us about availability and pricing on WhatsApp.",
  },
  {
    id: "google-pixel",
    priority: 6,
    keywords: { pixel: 5, google: 4, pixel_9: 4, pixel_8: 4, pixel_9_pro: 5, pixel_8a: 3, pixel_9a: 4, google_phone: 4 },
    reply:
      "We stock Google Pixel 9 Pro, Pixel 9 and Pixel 8a — class-leading cameras, clean Android, excellent value for money. The Pixel 9 Pro is our top pick for photography lovers.",
  },
  {
    id: "phone-camera",
    priority: 7,
    keywords: { camera_phone: 5, best_camera: 5, photo: 4, photography: 5, videography: 4, selfie: 3, video: 3, best_phone_for_photos: 6, best_phone_for_video: 6, camera_quality: 4 },
    reply:
      "Best camera phones right now:\n• iPhone 16 Pro / 15 Pro — best video, natural colours, proRes\n• Google Pixel 9 Pro — best point-and-shoot stills, Night Sight\n• Samsung Galaxy S24 Ultra — versatile zoom (100x Space Zoom)\n• iPhone 17 Pro Max — updated camera system for 2025\nTell me your budget and I'll match you to the right model.",
  },
  {
    id: "phone-gaming",
    priority: 7,
    keywords: { gaming_phone: 5, phone_for_gaming: 5, best_gaming_phone: 5, game_on_phone: 4, mobile_gaming: 4, fps: 3, best_phone_for_games: 5, gaming_performance: 4 },
    reply:
      "For gaming on a phone, go for:\n• iPhone 15/16 Pro Max — great sustained performance, A-series chip\n• Samsung Galaxy S24 Ultra / S25 Ultra — top Android pick\n• RedMagic / ROG Phone — gaming-specific, ask us about availability\nPair with a PS5 or Xbox for the full experience. Ask about current stock on WhatsApp.",
  },
  {
    id: "phone-battery",
    priority: 6,
    keywords: { battery: 5, battery_life: 5, long_battery: 4, last_long: 4, charge: 3, charging: 3, power: 2, best_battery: 4, battery_backup: 3 },
    reply:
      "If battery life matters most:\n• iPhone 15 Pro Max — all-day easily, 17+ hours video\n• Samsung Galaxy S24 Ultra / S25 Ultra — strong endurance\n• iPhone 17 Pro Max — biggest battery in iPhone lineup\n• iPhone SE — smaller battery but reliable for light use\nConsider a high-wattage charger and a power bank — we stock both.",
  },
  {
    id: "phone-comparison",
    priority: 7,
    keywords: { iphone_vs_samsung: 6, samsung_vs_iphone: 6, compare_phones: 5, which_phone_is_better: 5, difference_between_iphone_and_samsung: 6 },
    reply:
      "iPhone vs Samsung quick take:\n• iPhone: better video quality, longer software support (5-7 years), simpler interface, higher resale value\n• Samsung: more customisation, better zoom cameras, lower price for similar specs, foldable options\n• Both have excellent performance and build quality\nFor specific model comparisons (e.g. 17 Pro vs S25 Ultra), ask us on WhatsApp with your budget and priorities.",
  },
  {
    id: "laptop",
    priority: 7,
    keywords: { laptop: 5, macbook: 5, notebook: 4, computer: 3, pc: 2, dell: 3, hp: 3, lenovo: 3, asus: 3, thinkpad: 3, xps: 3, macbook_air: 4, macbook_pro: 4, best_laptop: 4 },
    reply:
      "MacBooks (Air & Pro, M1–M4) plus Windows laptops from HP, Dell, Lenovo and Asus. Tell me your use case (school, work, gaming, design) and budget and I'll narrow it down.",
  },
  {
    id: "laptop-student",
    priority: 7,
    keywords: { laptop_for_student: 6, best_laptop_for_school: 6, student_laptop: 5, school_laptop: 5, laptop_for_school: 5, light_laptop: 4, portable_laptop: 4 },
    reply:
      "Best student laptops right now:\n• MacBook Air M2/M3 — light, all-day battery, perfect for note-taking\n• Dell XPS 13 — premium Windows pick, ultra-portable\n• HP Pavilion 15 — great value, solid performance for assignments\n• Lenovo ThinkPad E14 — rugged, great keyboard, business-ready\nFor engineering or design students, consider MacBook Pro or a laptop with dedicated graphics. Ask us about current stock.",
  },
  {
    id: "laptop-gaming",
    priority: 7,
    keywords: { gaming_laptop: 6, laptop_for_gaming: 6, best_gaming_laptop: 5, game_laptop: 4, gaming_pc: 5 },
    reply:
      "Best gaming laptops:\n• MacBook Pro M3 Pro/Max — great for creative games, long battery\n• ASUS Vivobook 15 — solid budget gaming pick\n• Dell XPS 15 — good balance of power and portability\n• HP Pavilion Gaming — value-focused, decent GPU\nFor serious gaming, pair with a PS5 or Xbox. Ask about availability on WhatsApp.",
  },
  {
    id: "ipad",
    priority: 5,
    keywords: { ipad: 5, tablet: 3, ipad_pro: 4, ipad_air: 4, apple_tablet: 3, ipad_10th: 4, ipad_11: 4 },
    reply:
      "We have iPad Pro, iPad Air and iPad in stock — perfect for school, drawing, note-taking and everyday use. Ask about specific models and storage options.",
  },
  {
    id: "watch",
    priority: 5,
    keywords: { watch: 4, smartwatch: 5, apple_watch: 5, galaxy_watch: 4, wearable: 3, fitness_tracker: 3, best_smartwatch: 4 },
    reply:
      "We stock Apple Watch (Series 9, Ultra 2, SE) and Galaxy Watch — great for fitness tracking, notifications and staying connected. Ask us about sizes, bands and pricing.",
  },
  {
    id: "gaming",
    priority: 5,
    keywords: { gaming: 4, ps5: 5, xbox: 5, switch: 4, console: 4, playstation: 4, nintendo: 3, gamer: 3, ps5_price: 4, xbox_price: 4, switch_price: 3 },
    reply:
      "We have PS5 (disc & digital), Xbox Series X/S and Nintendo Switch OLED in stock — new and UK-used units available. Ask for current pricing and availability.",
  },
  {
    id: "appliance",
    priority: 4,
    keywords: { fridge: 3, tv: 2, television: 3, ac: 2, air_conditioner: 4, washing_machine: 4, appliance: 4, freezer: 3, fridge_freezer: 3, smart_tv: 3, microwave: 4, iron: 3, standing_fan: 3 },
    reply:
      "We stock fridges (single-door, double-door, chest freezers), smart TVs, air conditioners, washing machines, microwaves and other home appliances — ask about specific brands, sizes and pricing.",
  },
  {
    id: "fridge",
    priority: 6,
    keywords: { fridge: 6, refrigerator: 5, chest_freezer: 5, deep_freezer: 5, fridge_freezer: 5, double_door_fridge: 5, single_door_fridge: 4, best_fridge: 4 },
    reply:
      "Fridges & freezers we stock:\n• Single-door fridges — compact, great for small spaces\n• Double-door fridges — spacious, separate freezer compartment\n• Chest freezers — bulk storage, ideal for businesses\nAll sizes and brands available. Ask us about current stock and pricing on WhatsApp.",
  },
  {
    id: "tv",
    priority: 6,
    keywords: { tv: 6, television: 6, smart_tv: 6, samsung_tv: 5, lg_tv: 5, tv_size: 4, best_tv: 4, "43_inch_tv": 4, "50_inch_tv": 4, "55_inch_tv": 4, "65_inch_tv": 4 },
    reply:
      "Smart TVs we stock:\n• Samsung QLED / Crystal UHD — great colours, smart features\n• LG OLED / NanoCell — stunning blacks, wide viewing angles\n• Various sizes from 43\" to 65\"+\nAsk us about current sizes, brands and prices on WhatsApp.",
  },
  {
    id: "washing-machine",
    priority: 6,
    keywords: { washing_machine: 6, washer: 5, laundry: 4, washing: 4, best_washing_machine: 4, front_load: 4, top_load: 4 },
    reply:
      "Washing machines we stock:\n• Top-load washing machines — affordable, easy to use\n• Front-load washing machines — efficient, gentle on clothes\nVarious capacities (6kg–10kg+) from trusted brands. Ask us about pricing and availability.",
  },
  {
    id: "ac",
    priority: 6,
    keywords: { ac: 6, air_conditioner: 6, aircon: 5, split_ac: 5, window_ac: 4, best_ac: 4, cooling: 3 },
    reply:
      "Air conditioners we stock:\n• Split AC units — quiet, efficient, ideal for bedrooms/lounges\n• Window AC units — compact, easy to install\nVarious BTU sizes for different room sizes. Ask us about pricing, installation and after-sales support.",
  },
  {
    id: "microwave",
    priority: 5,
    keywords: { microwave: 5, oven: 3, microwave_oven: 4, best_microwave: 3 },
    reply:
      "We stock microwave ovens from trusted brands. Various capacities and grill/solo options. Ask us about current models and prices on WhatsApp.",
  },
  {
    id: "accessories",
    priority: 4,
    keywords: { accessory: 4, accessories: 5, charger: 4, cable: 3, case: 3, screen_protector: 4, earphones: 3, airpods: 4, power_bank: 3, adapter: 2, phone_case: 4, screen_glass: 3, car_charger: 3, wireless_charger: 3 },
    reply:
      "We carry chargers, cables, cases, screen protectors, AirPods, earphones, power banks and more — all compatible with the phones and laptops we sell. Ask about specific accessories for your device.",
  },
  {
    id: "airpods",
    priority: 5,
    keywords: { airpods: 5, airpods_pro: 5, airpods_max: 4, airpods_4: 4, best_earbuds: 4, wireless_earbuds: 4 },
    reply:
      "AirPods we stock:\n• AirPods 4 — latest model, great sound, compact\n• AirPods Pro 2 — active noise cancellation, perfect for calls\n• AirPods Max — over-ear, premium sound\nAll are brand new with warranty. Ask for pricing and availability.",
  },
  {
    id: "power-bank",
    priority: 5,
    keywords: { power_bank: 5, portable_charger: 5, external_battery: 4, fast_charging: 3, anker: 3 },
    reply:
      "We stock power banks from Anker and other trusted brands — 10,000mAh, 20,000mAh and higher capacities. Fast charging supported. Ask us about current stock and prices.",
  },
  {
    id: "phone-case",
    priority: 5,
    keywords: { phone_case: 5, case_for_iphone: 5, case_for_samsung: 5, phone_cover: 4, protective_case: 4 },
    reply:
      "We have phone cases for iPhone, Samsung, Google Pixel and other models — clear cases, rugged cases, wallet cases and screen protectors. Ask about availability for your specific model.",
  },
  {
    id: "tradein",
    priority: 7,
    keywords: { trade: 4, trade_in: 5, tradein: 5, swap: 4, iswap: 5, sell_my: 5, old_phone: 4, exchange: 4, upgrade: 3, give_old: 3, how_does_tradein_work: 6, tradein_process: 5 },
    reply:
      "Our iSwap trade-in:\n1. Pick your old device and condition on the Trade-In page\n2. Get an instant online estimate\n3. Bring it to the shop or request pickup\n4. We verify the condition and apply credit toward your new device\nYou can also swap outright for cash.",
  },
  {
    id: "repair",
    priority: 7,
    keywords: { repair: 5, ifix: 5, fix: 3, screen: 3, battery: 3, broken: 3, faulty: 2, service: 2, crack: 3, dead: 2, water_damage: 3, screen_replacement: 4, battery_replacement: 4, phone_repair: 4 },
    reply:
      "We offer iFix repair services:\n• Screen replacement (all major brands)\n• Battery replacement\n• Charging port / speaker fixes\n• General diagnostics\nWalk in or message us on WhatsApp with photos and we'll give a quick estimate.",
  },
  {
    id: "delivery",
    priority: 7,
    keywords: { delivery: 5, deliver: 4, ship: 4, shipping: 5, dispatch: 4, nationwide: 5, region: 2, courier: 3, send: 2, receive: 2, arrival: 2, how_long: 3, days: 2, delivery_time: 4 },
    reply:
      "We deliver nationwide across Ghana via VIP, STC and DHL:\n• Kumasi metro: same-day or next-day\n• Other regions: 1–3 working days\n• You'll get a call to confirm address before dispatch\n• Pickup is also free at our Tafo shop",
  },
  {
    id: "pickup",
    priority: 5,
    keywords: { pickup: 5, pick_up: 5, collect: 4, store_visit: 4, visit_shop: 4, come_to_shop: 4, collect_myself: 3, self_collection: 3 },
    reply:
      "Free pickup at our shop: Tafo American Building, Mampong Rd, Kumasi. Open daily 7:00 AM – 9:00 PM. Just bring your order reference and ID.",
  },
  {
    id: "payment",
    priority: 7,
    keywords: { pay: 3, payment: 4, paystack: 5, cedi: 3, ghs: 3, momo: 4, mobile_money: 5, card: 3, visa: 3, mastercard: 3, mtn: 3, vodafone: 3, airtel_tigo: 3, how_to_pay: 5 },
    reply:
      "Pay securely at checkout with Paystack:\n• Cards: Visa, Mastercard\n• Mobile Money: MTN MoMo, Vodafone Cash, AirtelTigo Money\n• All prices in Cedis (GHS)\nWe never see or store your card details. Installment plans available — ask on WhatsApp.",
  },
  {
    id: "installment",
    priority: 8,
    keywords: { installment: 5, installments: 5, pay_later: 5, monthly: 4, credit: 4, finance: 4, lay_out: 3, part_payment: 4, hire_purchase: 4, how_does_installment_work: 6, installment_plan: 5, pay_in_installments: 5, pay_monthly: 5 },
    reply:
      "Flexible installment plans are available for qualified buyers. Typical terms: 20–30% deposit, balance split over 1–6 months. For exact terms, availability and to start an application, message us directly on WhatsApp at 0541 533 365 — our team will guide you through the process.",
  },
  {
    id: "warranty",
    priority: 6,
    keywords: { warranty: 5, guarantee: 4, return: 3, refund: 4, replace: 3, defect: 3, faulty: 2, exchange_policy: 4, money_back: 3, warranty_period: 4, warranty_claim: 4 },
    reply:
      "Warranty by product type:\n• New phones/laptops: 3–12 months\n• UK-used devices: 7–30 days\n• Accessories: 7–14 days\n• Appliances: 3–6 months\nTo make a claim: message us on WhatsApp with photos and your order ref — we'll arrange repair, replacement or refund.",
  },
  {
    id: "price",
    priority: 5,
    keywords: { price: 5, cost: 4, how_much: 5, cheap: 3, discount: 4, deal: 3, promo: 3, budget: 3, expensive: 2, affordable: 3, offer: 2, pricing: 3 },
    reply:
      "Prices are listed per product in Cedis (GHS). We keep fair prices and run New Arrival / Best Seller deals — check the badges on the cards. UK-used models cost less than new. Ask us about current promos on WhatsApp.",
  },
  {
    id: "recommendation",
    priority: 7,
    keywords: { recommend: 5, best_for: 4, help_choosing: 5, which_phone: 5, which_laptop: 5, good_for: 4, suggest: 4, buying: 3, advice: 4, need_phone: 4, need_laptop: 4, under: 2, suggest_phone: 5, suggest_laptop: 5 },
    reply:
      "Tell me your budget and main use (gaming, camera, battery, work, school) and I'll suggest the best pick. Quick picks:\n• Student / school: MacBook Air or light Dell/HP laptop\n• Content creation: iPhone 15/16 Pro or MacBook Pro\n• Business: Samsung Galaxy S24 Ultra or ThinkPad\n• Gaming: PS5 or high-spec laptop with dedicated GPU\n• Camera: iPhone 15/16 Pro or Google Pixel 9 Pro",
  },
  {
    id: "new-vs-ukused",
    priority: 6,
    keywords: { new: 3, uk_used: 4, ukused: 4, used: 3, refurbished: 4, pre_owned: 3, difference: 3, grade: 2, new_vs_uk: 4, which_is_better: 3 },
    reply:
      "New = sealed, full warranty, original accessories.\nUK-used = pre-owned units imported from the UK, graded A/B (like-new / very good), 7–30 day warranty, lower price.\nBoth are quality-checked before listing. UK-used is the smart pick for value without the new price tag.",
  },
  {
    id: "storage-advice",
    priority: 6,
    keywords: { storage: 5, "128gb": 4, "256gb": 4, "512gb": 4, "1tb": 4, gb: 3, space: 3, full: 2, storage_space: 4, need_more_storage: 3 },
    reply:
      "Quick storage guide:\n• 128GB — fine for light use, WhatsApp, photos, a few apps\n• 256GB — comfortable for most people, photos + apps + some offline video\n• 512GB — power users, 4K video, large games\n• 1TB — pros who never want to manage space\nYou can't expand storage on most modern phones, so buy for the next 2–3 years.",
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
    keywords: { order: 5, ordering: 5, how_to_order: 5, place_order: 4, buy_now: 4, checkout: 4, process: 2, steps: 2, how_do_i_order: 5 },
    reply:
      "How to order:\n1. Browse the catalogue and tap a product\n2. Choose storage and colour (if available)\n3. Tap 'Add to cart' or 'Buy now'\n4. Fill in your name, phone and delivery address\n5. Pay securely with Paystack (card or mobile money)\n6. You'll get order confirmation and tracking info\nOr message us on WhatsApp and we'll take your order manually.",
  },
  {
    id: "track-order",
    priority: 7,
    keywords: { track: 5, tracking: 5, order_status: 5, where_is_my: 4, dispatched: 4, delivery_status: 5, shipped: 3, arrived: 2, where_is_order: 5, order_tracking: 5 },
    reply:
      "To track your order:\n• Log in and go to Orders — you'll see status updates\n• Or message us on WhatsApp with your order reference (e.g. CBOY-XXXX)\nTypical timeline: confirmed → paid → fulfilled → dispatched → delivered.",
  },
  {
    id: "cancel-return",
    priority: 5,
    keywords: { cancel: 5, cancellation: 5, return: 5, return_policy: 5, send_back: 3, wrong_item: 4, damaged: 3, how_to_return: 4, return_process: 4 },
    reply:
      "Cancellations: contact us within 24 hours of ordering for a full refund.\nReturns: if the item is faulty or not as described, message us on WhatsApp with photos within the warranty period. We'll arrange repair, replacement or refund. Change of mind returns are accepted within 3 days if the item is unopened.",
  },
  {
    id: "about-us",
    priority: 5,
    keywords: { about: 5, who: 3, story: 3, mission: 3, why_choose: 4, trust: 3, reliable: 2, best: 2, about_cboyistore: 5 },
    reply:
      "Cboyistore is a premium reseller based in Kumasi, Ghana. We specialise in brand-new and UK-used smartphones, laptops, smartwatches, gaming consoles and home appliances. Our three pillars: iBuy (quality products), iSwap (trade-in credit), iFix (repairs). Every device is quality-checked before it leaves our shop.",
  },
  {
    id: "bulk-order",
    priority: 4,
    keywords: { bulk: 5, bulk_order: 5, corporate: 4, wholesale: 5, many_phones: 3, multiple: 2, team: 2, bulk_purchase: 4 },
    reply:
      "We handle bulk and corporate orders — message us on WhatsApp with quantities and preferred models. Pricing, delivery timelines and invoicing can be arranged.",
  },
  {
    id: "gift",
    priority: 4,
    keywords: { gift: 5, present: 4, birthday: 3, wedding: 2, christmas: 3, valentine: 2, surprise: 2, gift_ideas: 4 },
    reply:
      "Popular gifts right now: AirPods, smartwatches, phone cases + screen protectors bundles, and PS5. We can also add a gift note — message us on WhatsApp.",
  },
  {
    id: "promo",
    priority: 5,
    keywords: { promo: 5, promotion: 5, discount: 5, deal: 4, offer: 4, sale: 5, flash_sale: 4, new_arrival: 3, best_seller: 3, current_promo: 4, any_deals: 4 },
    reply:
      "Look for the badges on product cards — New Arrival, Best Seller and Save badges show active deals. For exclusive promos, follow us on Instagram @Cboyistore and TikTok @Cboyistore, or message us on WhatsApp.",
  },
  {
    id: "refund",
    priority: 6,
    keywords: { refund: 5, money_back: 5, return_policy: 4, dissatisfaction: 3, unhappy: 3, issue: 2, problem: 2, how_to_refund: 4, refund_process: 4 },
    reply:
      "If you're unhappy with your purchase:\n1. Message us on WhatsApp within your warranty period\n2. Share photos/video of the issue\n3. We'll verify and arrange repair, replacement or refund\nFor change of mind: unopened items can be returned within 3 days for a refund or exchange.",
  },
  {
    id: "social-proof",
    priority: 4,
    keywords: { review: 5, reviews: 5, feedback: 4, testimonial: 4, rating: 3, star: 2, trusted: 3, customer_reviews: 4 },
    reply:
      "We're proud of our 4.5/5 customer rating. Shoppers consistently mention our fair prices, quality-checked devices and fast delivery. Follow @Cboyistore on Instagram and TikTok for real customer photos and unboxings.",
  },
  {
    id: "security",
    priority: 5,
    keywords: { secure: 5, safety: 4, safe: 3, scam: 3, legit: 3, trust: 3, protect: 2, is_it_safe: 4, is_legit: 4 },
    reply:
      "Your safety matters:\n• Payments are processed by Paystack (PCI-DSS compliant)\n• We never ask for your card PIN or OTP\n• All devices are quality-checked before sale\n• Physical shop you can visit: Tafo American Building, Mampong Rd, Kumasi\n• WhatsApp verified business: 0541 533 365",
  },
  {
    id: "repair-warranty",
    priority: 6,
    keywords: { repair_warranty: 5, screen_cracked: 5, battery_drain: 4, phone_not_turning_on: 4, slow: 2, lag: 2, cracked_screen: 5, phone_wont_turn_on: 4 },
    reply:
      "Common fixes:\n• Cracked screen: we replace with quality parts, same-day service for most models\n• Battery drain: battery replacement restores hours of life\n• Phone not turning on: free diagnostic, we quote before fixing\n• Water damage: bring it in ASAP — don't charge it\nMessage us on WhatsApp with photos for a quick estimate.",
  },
  {
    id: "delivery-details",
    priority: 6,
    keywords: { delivery_fee: 5, shipping_cost: 5, free_delivery: 4, how_much_delivery: 5, courier_fee: 3, dispatch_fee: 3, delivery_price: 4, shipping_fee: 4 },
    reply:
      "Delivery fees (approximate, confirmed at checkout):\n• Kumasi metro: GHS 20–50 (free on orders over GHS 5,000)\n• Accra / Tema: GHS 30–60\n• Other regions: GHS 40–100 via VIP/STC/DHL\n• Free pickup at our Tafo shop always available",
  },
  {
    id: "delivery-tracking",
    priority: 6,
    keywords: { track_delivery: 5, delivery_tracking: 5, where_is_my_delivery: 5, delivery_update: 4, shipment_tracking: 4, tracking_number: 3 },
    reply:
      "To track your delivery:\n• You'll receive a tracking number via WhatsApp/SMS once dispatched\n• We use VIP, STC and DHL — you can track on their websites\n• For exact delivery timing, message us on WhatsApp with your order reference",
  },
  {
    id: "new-arrival",
    priority: 5,
    keywords: { new_arrival: 5, latest: 4, just_in: 4, fresh: 2, trending: 3, hot: 2, new_products: 4 },
    reply:
      "Check the 'New Arrival' badges on product cards for the latest stock. We update the catalogue weekly — follow @Cboyistore on Instagram and TikTok for first looks and unboxing videos.",
  },
  {
    id: "why-us",
    priority: 5,
    keywords: { why_choose: 5, why_buy: 4, advantage: 4, different: 3, unique: 3, special: 2, why_should_i_buy_from_you: 5 },
    reply:
      "Why Cboyistore:\n• Quality-checked new and UK-used devices\n• Fair Cedi prices with genuine discounts\n• Three services in one place: buy, trade-in, repair\n• Fast nationwide delivery\n• Trusted by thousands of customers in Ghana\n• Physical shop you can visit in Kumasi",
  },
  {
    id: "iphone-16-pro-max",
    priority: 8,
    keywords: { iphone_16_pro_max: 8, iphone_16_pro: 7, iphone_16: 6, iphone_16_plus: 6, iphone_16e: 5 },
    reply:
      "iPhone 16 series specs & pricing:\n• iPhone 16 Pro Max: 6.9\" Super Retina XDR, A18 Pro chip, 48MP camera, titanium, up to 1TB — our top seller\n• iPhone 16 Pro: 6.3\" display, A18 Pro, 48MP camera, titanium\n• iPhone 16: 6.1\" display, A18 chip, 48MP camera, aluminum\n• iPhone 16 Plus: 6.7\" display, A18 chip, great battery\nAll available in multiple colours and storage sizes. Ask for exact pricing on WhatsApp.",
  },
  {
    id: "samsung-s25-ultra",
    priority: 8,
    keywords: { samsung_s25_ultra: 8, s25_ultra: 7, samsung_s25: 7, s25_plus: 6, galaxy_s25: 7 },
    reply:
      "Samsung Galaxy S25 series:\n• S25 Ultra: 6.9\" Dynamic AMOLED, Snapdragon 8 Elite, 200MP camera, S Pen, titanium\n• S25+: 6.7\" display, same powerful chip, great for media\n• S25: 6.2\" compact flagship, excellent performance\nAll brand new with full warranty. Ask for pricing and availability.",
  },
  {
    id: "samsung-z-fold",
    priority: 7,
    keywords: { z_fold6: 7, z_flip6: 7, galaxy_z_fold: 6, galaxy_z_flip: 6, fold6: 6, flip6: 6 },
    reply:
      "Samsung foldables:\n• Galaxy Z Fold6: 7.6\" inner display, Snapdragon 8 Gen 3, multitasking powerhouse\n• Galaxy Z Flip6: 6.7\" main display, 3.4\" cover screen, stylish flip design\nBoth brand new with full warranty. Ask about pricing and colour options on WhatsApp.",
  },
  {
    id: "macbook",
    priority: 7,
    keywords: { macbook_air: 6, macbook_pro: 6, macbook_m3: 5, macbook_m4: 5, macbook_m2: 5, macbook_m1: 4, best_macbook: 5 },
    reply:
      "MacBooks we stock:\n• MacBook Air M2/M3 — light, all-day battery, perfect for students\n• MacBook Air 15\" — bigger screen, still light\n• MacBook Pro 14\"/16\" M3/M4 — pro performance for creators\nAll brand new with full Apple warranty. Ask about specific models and pricing.",
  },
  {
    id: "macbook-recommendation",
    priority: 7,
    keywords: { which_macbook: 6, best_macbook_for: 5, macbook_for_students: 5, macbook_for_video: 5, macbook_for_coding: 4 },
    reply:
      "MacBook recommendations:\n• Students: MacBook Air M2/M3 — light, battery lasts all day\n• Video editing / design: MacBook Pro 14\" or 16\" M3/M4 Pro\n• General use: MacBook Air M2 — best value\n• Travel: MacBook Air 13\" — ultra-portable\nAsk us about current stock and student discounts on WhatsApp.",
  },
  {
    id: "playstation",
    priority: 6,
    keywords: { ps5: 6, playstation_5: 6, playstation: 5, ps5_digital: 5, ps5_disc: 5, ps5_slim: 5 },
    reply:
      "PlayStation 5:\n• PS5 Disc Edition — plays physical games, also digital\n• PS5 Digital Edition — all-digital, slightly cheaper\nBoth brand new with warranty. Ask for pricing and game bundle availability on WhatsApp.",
  },
  {
    id: "xbox",
    priority: 6,
    keywords: { xbox: 6, xbox_series_x: 5, xbox_series_s: 5, xbox_game_pass: 4 },
    reply:
      "Xbox Series X/S in stock:\n• Xbox Series X — 4K gaming, 1TB storage, most powerful\n• Xbox Series S — 1080p/1440p gaming, 512GB/1TB, great value\nBoth brand new with full warranty. Ask about pricing and Game Pass bundles.",
  },
  {
    id: "nintendo-switch",
    priority: 6,
    keywords: { nintendo_switch: 6, switch_oled: 5, switch_standard: 4 },
    reply:
      "Nintendo Switch OLED in stock — 7\" OLED screen, enhanced audio, 64GB storage. Great for family gaming, portable and dockable. Brand new with warranty. Ask for pricing.",
  },
  {
    id: "apple-watch",
    priority: 6,
    keywords: { apple_watch: 6, apple_watch_series_9: 5, apple_watch_ultra: 5, apple_watch_se: 4, best_apple_watch: 4 },
    reply:
      "Apple Watch we stock:\n• Apple Watch Series 9 — great all-rounder, always-on display\n• Apple Watch Ultra 2 — adventure-ready, titanium, longest battery\n• Apple Watch SE — affordable, essential features\nAll sizes and band options available. Ask for pricing.",
  },
  {
    id: "samsung-tv",
    priority: 6,
    keywords: { samsung_tv: 6, samsung_smart_tv: 5, samsung_qled: 5, samsung_crystal: 4 },
    reply:
      "Samsung TVs we stock:\n• Samsung QLED — best colours, Quantum Dot technology\n• Samsung Crystal UHD — great value, 4K smart TV\nSizes from 43\" to 65\"+. Ask about current models, sizes and prices on WhatsApp.",
  },
  {
    id: "lg-tv",
    priority: 5,
    keywords: { lg_tv: 5, lg_oled: 5, lg_nanocell: 4 },
    reply:
      "LG TVs we stock:\n• LG OLED — stunning blacks, infinite contrast, perfect for movies\n• LG NanoCell — bright, accurate colours, great for bright rooms\nSizes from 43\" to 65\"+. Ask about current pricing on WhatsApp.",
  },
  {
    id: "washing-machine",
    priority: 6,
    keywords: { washing_machine: 6, washer: 5, laundry_machine: 4, best_washing_machine: 4 },
    reply:
      "Washing machines we stock:\n• Top-load — affordable, easy to use, 6kg–10kg capacities\n• Front-load — efficient, gentle on clothes, 7kg–10kg\nVarious brands available. Ask about pricing, delivery and installation on WhatsApp.",
  },
  {
    id: "air-conditioner",
    priority: 6,
    keywords: { air_conditioner: 6, ac_unit: 5, split_ac: 5, window_ac: 4, best_ac: 4, cooling_system: 3 },
    reply:
      "Air conditioners we stock:\n• Split AC — quiet, efficient, ideal for bedrooms and offices\n• Window AC — compact, easy to install, great for small rooms\nVarious BTU sizes for different room sizes. Ask about pricing, installation and after-sales support on WhatsApp.",
  },
  {
    id: "chest-freezer",
    priority: 5,
    keywords: { chest_freezer: 5, deep_freezer: 5, freezer: 4, best_freezer: 3 },
    reply:
      "Chest freezers we stock — various sizes from small to large capacity. Great for bulk storage, businesses and homes. Ask about available sizes, brands and prices on WhatsApp.",
  },
  {
    id: "microwave",
    priority: 5,
    keywords: { microwave: 5, microwave_oven: 5, best_microwave: 3 },
    reply:
      "Microwave ovens we stock from trusted brands. Various capacities and grill/solo options. Ask about current models and prices on WhatsApp.",
  },
  {
    id: "tradein-process",
    priority: 7,
    keywords: { how_does_tradein_work: 6, tradein_process: 5, tradein_steps: 5, how_to_tradein: 5, tradein_how: 4 },
    reply:
      "iSwap trade-in steps:\n1. Visit our Trade-In page or come to the shop\n2. Choose your old device make and model\n3. Select its condition (Excellent / Good / Fair / Faulty)\n4. Get an instant online estimate\n5. Bring it in for a quick in-store check\n6. We confirm the final value and apply credit toward your new device\nYou can also swap outright for cash. WhatsApp 0541 533 365 for guidance.",
  },
  {
    id: "repair-services",
    priority: 7,
    keywords: { repair_services: 5, what_do_you_repair: 5, repair_types: 4, screen_repair: 4, battery_repair: 4, phone_fix: 3 },
    reply:
      "iFix repair services:\n• Screen replacement (all major brands: iPhone, Samsung, etc.)\n• Battery replacement — restores hours of life\n• Charging port / speaker fixes\n• Water damage recovery\n• General diagnostics\nBring your device to the shop or message us on WhatsApp with photos for a quick estimate.",
  },
  {
    id: "warranty-claim",
    priority: 6,
    keywords: { how_to_claim_warranty: 5, warranty_claim_process: 5, make_warranty_claim: 5, claim_warranty: 4 },
    reply:
      "To make a warranty claim:\n1. Message us on WhatsApp with your order reference\n2. Share photos/video of the issue\n3. We verify and arrange repair, replacement or refund\n• New phones/laptops: 3–12 months warranty\n• UK-used devices: 7–30 days\n• Accessories: 7–14 days\nWe aim to resolve all warranty claims within 48 hours.",
  },
  {
    id: "order-status",
    priority: 7,
    keywords: { order_status: 5, what_is_my_order_status: 5, is_my_order_ready: 4, has_my_order_been_dispatched: 5, order_update: 4 },
    reply:
      "Order statuses:\n• pending — order received, awaiting payment\n• paid — payment confirmed\n• fulfilled — ready for dispatch/pickup\n• cancelled — order cancelled\nTo check your specific order: log in and go to Orders, or message us on WhatsApp with your reference (CBOY-XXXX).",
  },
  {
    id: "change-address",
    priority: 5,
    keywords: { change_address: 5, update_address: 5, wrong_address: 4, modify_order: 4, edit_order: 3 },
    reply:
      "To change your delivery address:\n• Message us on WhatsApp immediately with your order reference and new address\n• If the order hasn't been dispatched yet, we'll update it for free\n• If already dispatched, we'll do our best to redirect with the courier\nAct fast — once an order is out for delivery, address changes may incur extra fees.",
  },
  {
    id: "bulk-discount",
    priority: 4,
    keywords: { bulk_discount: 5, discount_for_bulk: 4, corporate_pricing: 4, wholesale_price: 4, negotiate_price: 3 },
    reply:
      "Yes! We offer bulk/corporate pricing for orders of 5+ units. Message us on WhatsApp with:\n• Product(s) and quantities\n• Delivery address\n• Any specific requirements\nWe'll send a custom quote within 24 hours.",
  },
  {
    id: "refurbished-quality",
    priority: 5,
    keywords: { is_uk_used_good: 5, uk_used_quality: 5, are_uk_used_phones_good: 5, quality_of_uk_used: 4, is_it_worth_buying_uk_used: 5 },
    reply:
      "Yes! Our UK-used devices are:\n• Imported from the UK in excellent condition\n• Graded A (like-new) or B (very good)\n• Fully tested and quality-checked in our shop\n• Come with 7–30 day warranty\n• Priced 20–40% below new\nUK-used is the smart pick if you want premium quality without the new price tag.",
  },
  {
    id: "student-discount",
    priority: 5,
    keywords: { student_discount: 5, discount_for_students: 5, student_offer: 4, school_package: 3 },
    reply:
      "We offer student-friendly pricing on selected laptops and accessories. Bring your student ID to the shop or message us on WhatsApp with your course and device needs — we'll suggest the best package for your budget.",
  },
  {
    id: "gift-wrapping",
    priority: 4,
    keywords: { gift_wrapping: 5, gift_packaging: 4, wrap_my_gift: 4, gift_box: 3 },
    reply:
      "Yes! We offer gift wrapping and packaging services. Select the gift option at checkout or message us on WhatsApp with your order reference and a gift note. Small fee applies.",
  },
  {
    id: "tracking-number",
    priority: 6,
    keywords: { tracking_number: 5, tracking_id: 5, shipment_id: 4, courier_tracking: 4 },
    reply:
      "You'll receive your tracking number via WhatsApp or SMS once your order is dispatched. We use VIP, STC and DHL — you can track directly on their websites using that number. If you haven't received it, message us on WhatsApp.",
  },
  {
    id: "payment-issue",
    priority: 6,
    keywords: { payment_failed: 5, payment_not_going_through: 5, card_declined: 4, momo_not_working: 4, paystack_error: 4 },
    reply:
      "If your payment fails:\n1. Check your card/MoMo balance and network\n2. Try again or use a different payment method\n3. If it still fails, message us on WhatsApp — we'll help manually\nWe never see or store your card details. All payments go through Paystack.",
  },
  {
    id: "installment-details",
    priority: 7,
    keywords: { how_installment_works: 6, installment_terms: 5, installment_requirements: 5, qualify_for_installment: 5, installment_down_payment: 5 },
    reply:
      "Installment plan details:\n• Down payment: 20–30% of total price\n• Balance: split over 1–6 months\n• Eligible for: employees, students, self-employed with ID\n• To apply: message us on WhatsApp at 0541 533 365 with:\n  - Product you want\n  - Your ID type (Ghana Card, Voter ID, etc.)\n  - Employment/student status\nWe'll confirm eligibility and exact terms within 24 hours.",
  },
  {
    id: "delivery-partners",
    priority: 6,
    keywords: { delivery_partners: 5, which_courier: 5, vip_transport: 4, stc_transport: 4, dhl_ghana: 4 },
    reply:
      "We deliver via trusted Ghana couriers:\n• VIP Transport — fast, reliable, nationwide\n• STC — affordable, regular schedules to all regions\n• DHL — express delivery for urgent orders\nCourier choice depends on your location and urgency. We'll confirm the best option at checkout.",
  },
  {
    id: "pickup-requirements",
    priority: 5,
    keywords: { pickup_requirements: 5, what_to_bring_for_pickup: 5, collect_order_in_person: 4 },
    reply:
      "To collect your order in person:\n• Bring your order reference (CBOY-XXXX)\n• Bring a valid ID (Ghana Card, Voter ID, driver's licence)\n• The name on the ID must match the order name\n• Our shop: Tafo American Building, Mampong Rd, Kumasi\n• Hours: 7:00 AM – 9:00 PM daily",
  },
  {
    id: "return-policy",
    priority: 6,
    keywords: { return_policy: 5, can_i_return: 4, return_item: 4, return_instructions: 4, how_long_to_return: 3 },
    reply:
      "Return policy:\n• Faulty/not as described: return within warranty period with photos\n• Change of mind: return within 3 days if item is unopened\n• To return: message us on WhatsApp with your order ref and reason\n• We'll arrange pickup or provide the shop address\nRefunds processed within 7–14 days after inspection.",
  },
  {
    id: "warranty-coverage",
    priority: 6,
    keywords: { what_does_warranty_cover: 5, warranty_coverage: 5, covered_under_warranty: 4, warranty_does_not_cover: 4 },
    reply:
      "Warranty covers:\n• Manufacturing defects\n• Battery issues (if within capacity threshold)\n• Software issues covered by the manufacturer\nWarranty does NOT cover:\n• Physical damage (cracks, water damage from misuse)\n• Unauthorized repairs\n• Accessories (unless specified)\nMessage us on WhatsApp with your issue and we'll advise.",
  },
  {
    id: "specific-phone-advice",
    priority: 7,
    keywords: { which_phone_should_i_buy: 6, best_phone_under: 5, phone_suggestion: 5, recommend_phone: 5, phone_advice: 4 },
    reply:
      "Tell me your budget and priorities (camera, battery, gaming, brand, storage) and I'll recommend the best pick. For example:\n• Under GHS 8,000: iPhone 13 / Samsung S23 / Google Pixel 8a\n• Under GHS 15,000: iPhone 15 / Samsung S24 / iPhone 14 Pro\n• Over GHS 20,000: iPhone 16 Pro / Samsung S24 Ultra / iPhone 17\nMessage us on WhatsApp for personalised advice.",
  },
  {
    id: "specific-laptop-advice",
    priority: 7,
    keywords: { which_laptop_should_i_buy: 6, best_laptop_under: 5, laptop_suggestion: 5, recommend_laptop: 5, laptop_advice: 4 },
    reply:
      "Tell me your budget and use (school, work, gaming, design) and I'll recommend the best laptop. For example:\n• Students under GHS 12,000: MacBook Air M2 or Dell Inspiron\n• Design/Video under GHS 25,000: MacBook Pro M3 or Dell XPS\n• Gaming under GHS 30,000: ASUS Vivobook with dedicated GPU\nMessage us on WhatsApp for personalised advice.",
  },
  {
    id: "tradein-estimate",
    priority: 6,
    keywords: { tradein_estimate: 5, how_much_is_my_phone_worth: 5, tradein_value: 5, estimate_my_phone: 4 },
    reply:
      "To get an instant trade-in estimate:\n1. Go to our Trade-In page on the website\n2. Select your device make and model\n3. Choose its condition (Excellent / Good / Fair / Faulty)\n4. You'll see an instant estimate\nFinal offer is confirmed in-store after a quick check. For guidance, WhatsApp 0541 533 365.",
  },
  {
    id: "order-issues",
    priority: 6,
    keywords: { problem_with_order: 5, order_issue: 5, wrong_item: 5, damaged_item: 5, item_not_as_described: 5 },
    reply:
      "If there's an issue with your order:\n1. Don't use or open the item if it's wrong/damaged\n2. Message us on WhatsApp immediately with your order ref\n3. Share photos of the issue\n4. We'll arrange a replacement, repair or refund\nFor urgent issues, call 0541 533 365.",
  },
  {
    id: "delivery-time",
    priority: 6,
    keywords: { how_long_does_delivery_take: 6, delivery_days: 5, when_will_i_receive: 5, delivery_duration: 4, estimated_delivery: 4 },
    reply:
      "Delivery times:\n• Kumasi metro: same-day or next-day\n• Accra / Tema: 1–2 working days\n• Other regions (Tamale, Cape Coast, etc.): 2–3 working days\n• Remote areas: 3–5 working days\nYou'll get a tracking number and WhatsApp update once dispatched. For exact timing, message us with your address.",
  },
  {
    id: "payment-methods",
    priority: 7,
    keywords: { what_payment_methods: 5, can_i_pay_with: 5, payment_options: 5, pay_with_cash: 3, pay_with_momo: 4 },
    reply:
      "Payment methods:\n• Mobile Money: MTN MoMo, Vodafone Cash, AirtelTigo Money\n• Cards: Visa, Mastercard (via Paystack)\n• Cash: available for in-store pickup only\n• Installment plans: 20–30% deposit, balance split over 1–6 months — message us on WhatsApp to apply\nAll prices in Cedis (GHS).",
  },
  {
    id: "shop-location-details",
    priority: 7,
    keywords: { exact_address: 5, full_address: 5, gps_coordinates: 5, google_maps_link: 4, how_to_reach: 4 },
    reply:
      "Exact shop details:\nCboyistore\nTafo American Building, Mampong Rd\nKumasi, Ghana\nGPS: 6.7146, -1.6173\nHours: 7:00 AM – 9:00 PM daily\nCall/WhatsApp: 0541 533 365\nWe're on the ground floor — look for the Cboyistore sign. Tap 'Get directions' on the map below.",
  },
  {
    id: "contact-installment",
    priority: 8,
    keywords: { installment_contact: 5, installment_whatsapp: 5, call_for_installment: 5, installment_phone: 4, installment_number: 4 },
    reply:
      "For installment plans, contact us directly on WhatsApp: 0541 533 365\nWe'll discuss:\n• Available products for installment\n• Down payment amount (usually 20–30%)\n• Payment duration (1–6 months)\n• Required documents (Ghana Card, etc.)\n• Your eligibility\nMessage us now to get started.",
  },
  {
    id: "delivery-cost",
    priority: 6,
    keywords: { delivery_cost: 5, how_much_is_delivery: 5, delivery_charge: 5, shipping_price: 4 },
    reply:
      "Approximate delivery costs:\n• Kumasi metro: GHS 20–50 (FREE on orders over GHS 5,000)\n• Accra / Tema: GHS 30–60\n• Other regions: GHS 40–100 (VIP/STC/DHL)\nExact cost is confirmed at checkout based on your address. Free pickup always available at our Tafo shop.",
  },
  {
    id: "warranty-period",
    priority: 6,
    keywords: { how_long_is_warranty: 5, warranty_length: 5, warranty_duration: 4 },
    reply:
      "Warranty periods:\n• New phones: 3–12 months (varies by brand)\n• New laptops: 6–12 months\n• UK-used phones/laptops: 7–30 days\n• Accessories: 7–14 days\n• Appliances: 3–6 months\nFor exact warranty on a specific product, ask us on WhatsApp or check the product page.",
  },
  {
    id: "tradein-cash",
    priority: 6,
    keywords: { tradein_for_cash: 5, can_i_get_cash_for_my_old_phone: 5, swap_for_cash: 4, sell_old_phone_for_cash: 5 },
    reply:
      "Yes! With iSwap you can:\n1. Trade in your old device for credit toward a new one, OR\n2. Swap outright for cash\nBring your device to the shop for a free valuation — we'll check the condition and give you an instant offer. WhatsApp 0541 533 365 to book a visit.",
  },
  {
    id: "accessories-for-iphone",
    priority: 5,
    keywords: { iphone_accessories: 5, case_for_iphone: 4, charger_for_iphone: 4, screen_protector_for_iphone: 4 },
    reply:
      "iPhone accessories we stock:\n• Cases: clear, rugged, leather, wallet styles\n• Screen protectors: tempered glass, privacy filters\n• Chargers: 20W, 30W, MagSafe chargers\n• Cables: USB-C, Lightning\n• AirPods: 4, Pro 2, Max\nAsk us about availability for your specific iPhone model.",
  },
  {
    id: "accessories-for-samsung",
    priority: 5,
    keywords: { samsung_accessories: 5, case_for_samsung: 4, charger_for_samsung: 4, screen_protector_for_samsung: 4 },
    reply:
      "Samsung accessories we stock:\n• Cases: clear, rugged, wallet styles for Galaxy S/A/Z series\n• Screen protectors: tempered glass for all models\n• Chargers: 25W, 45W fast chargers\n• Cables: USB-C\nAsk us about availability for your specific Samsung model.",
  },
  {
    id: "order-confirmation",
    priority: 6,
    keywords: { order_confirmation: 5, did_my_order_go_through: 5, order_successful: 4, confirmation_email: 3 },
    reply:
      "After placing an order:\n• You'll see an on-screen confirmation with your reference (CBOY-XXXX)\n• We'll send you a WhatsApp/SMS confirmation\n• You'll get updates as your order moves through the stages\nIf you don't receive confirmation within 10 minutes, message us on WhatsApp with your details.",
  },
  {
    id: "change-order",
    priority: 5,
    keywords: { change_order: 5, modify_order: 5, add_item_to_order: 4, remove_item_from_order: 4, edit_my_order: 4 },
    reply:
      "To change your order:\n• Message us on WhatsApp immediately with your order reference\n• If the order hasn't been dispatched yet, we can modify it\n• Changes after dispatch may not be possible\nFor fastest response, call 0541 533 365.",
  },
  {
    id: "product-availability",
    priority: 6,
    keywords: { is_product_available: 5, is_it_in_stock: 5, do_you_have: 4, stock_check: 4, check_availability: 4 },
    reply:
      "To check if a specific product is in stock:\n• Browse the catalogue — out-of-stock items are marked\n• Message us on WhatsApp with the product name\n• We confirm availability and can reserve items for 24–48 hours\nStock updates frequently, so check often or ask us directly.",
  },
  {
    id: "reserve-product",
    priority: 5,
    keywords: { reserve_product: 5, can_you_reserve: 4, hold_item: 4, put_aside: 3, reserve_for_me: 4 },
    reply:
      "Yes! We can reserve items for 24–48 hours with a small deposit (usually GHS 50–200 depending on the item). Message us on WhatsApp with the product name, and we'll confirm availability and hold it for you. Deposit goes toward the final purchase.",
  },
  {
    id: "gst-vat",
    priority: 4,
    keywords: { vat: 4, tax: 3, gst: 4, is_tax_included: 3, price_includes_tax: 3 },
    reply:
      "All prices displayed include applicable taxes (VAT). The price you see is the price you pay — no hidden charges.",
  },
  {
    id: "financing",
    priority: 5,
    keywords: { financing: 5, loan: 4, borrow_to_buy: 3, buy_now_pay_later: 4, bnpl: 3 },
    reply:
      "We offer flexible installment plans:\n• 20–30% deposit, balance over 1–6 months\n• Available for employees, students, self-employed\n• Requires valid ID (Ghana Card, Voter ID, driver's licence)\nTo apply or get more info, message us on WhatsApp at 0541 533 365.",
  },
  {
    id: "contact-general",
    priority: 7,
    keywords: { phone: 3, call: 3, call_me: 2, call_back: 3, request_call: 3 },
    reply:
      "You can reach us by:\n• WhatsApp: 0541 533 365 (fastest response)\n• Phone call: 0541 533 365\n• Email: wisede63@gmail.com\n• Instagram: @Cboyistore\n• TikTok: @Cboyistore\nWe're available daily 7:00 AM – 9:00 PM. Leave a message outside hours and we'll reply first thing in the morning.",
  },
  {
    id: "shop-directions",
    priority: 7,
    keywords: { get_directions: 5, navigate_to_shop: 5, how_do_i_get_there: 5, directions_to_cboyistore: 5, map_to_shop: 4 },
    reply:
      "To get to our shop:\n1. Open Google Maps on your phone\n2. Search for 'Cboyistore, Tafo American Building, Mampong Rd, Kumasi'\n3. Tap 'Directions' and choose your starting point\n4. We're on the ground floor of Tafo American Building\nGPS coordinates: 6.7146, -1.6173\nIf you get lost, call/WhatsApp 0541 533 365.",
  },
  {
    id: "nearby-landmarks",
    priority: 5,
    keywords: { nearby: 4, close_to: 4, near_me: 3, landmarks: 4, what_is_nearby: 3 },
    reply:
      "We're at Tafo American Building on Mampong Rd, Kumasi — close to Tafo market and the main trotro/taxi routes. If you're coming from Kumasi Central, it's a quick 5–10 minute taxi ride. Call 0541 533 365 if you need directions.",
  },
  {
    id: "order-timeline",
    priority: 6,
    keywords: { order_timeline: 5, how_long_until_delivery: 5, delivery_timeline: 4, when_will_my_order_arrive: 5 },
    reply:
      "Typical order timeline:\n1. Order placed → confirmation within minutes\n2. Payment confirmed → status changes to 'paid'\n3. Order prepared and packed (1–2 hours)\n4. Dispatched via courier → tracking number sent\n5. Delivered to your address\nKumasi: same-day/next-day | Other regions: 1–3 days",
  },
  {
    id: "exchange-policy",
    priority: 5,
    keywords: { exchange: 5, exchange_policy: 5, can_i_exchange: 4, swap_product: 3, exchange_item: 4 },
    reply:
      "Exchange policy:\n• If the item is faulty or not as described: free exchange within warranty period\n• Change of mind: exchange within 3 days if item is unopened\n• To exchange: message us on WhatsApp with your order ref and reason\n• We'll arrange pickup or provide shop address\nExchanges processed within 48 hours of receiving the returned item.",
  },
  {
    id: "repair-cost",
    priority: 5,
    keywords: { repair_cost: 5, how_much_for_repair: 5, repair_price: 4, screen_repair_cost: 4, battery_replacement_cost: 4 },
    reply:
      "Approximate repair costs (final quote after inspection):\n• Screen replacement: GHS 200–800 (depends on model)\n• Battery replacement: GHS 150–400\n• Charging port repair: GHS 150–300\n• Water damage: from GHS 300 (diagnostic first)\nMessage us on WhatsApp with your device model and issue for a quick estimate.",
  },
  {
    id: "tradein-devices",
    priority: 6,
    keywords: { what_devices_for_tradein: 5, eligible_devices: 4, can_i_tradein_my: 5, tradein_my_phone: 4 },
    reply:
      "We accept trade-ins for:\n• iPhones (all models, any condition)\n• Samsung Galaxy phones\n• Google Pixel\n• Other smartphones (call to check)\nCondition affects the offer:\n• Excellent: up to 85% of original value\n• Good: up to 70%\n• Fair: up to 50%\n• Faulty: up to 25%\nBring your device to the shop for a free valuation.",
  },
  {
    id: "contact-hours",
    priority: 6,
    keywords: { contact_hours: 5, support_hours: 4, when_are_you_available: 4, can_i_call_you: 3 },
    reply:
      "Contact hours: 7:00 AM – 9:00 PM, every day including weekends and public holidays.\n• WhatsApp: 0541 533 365 (preferred, fastest response)\n• Phone call: 0541 533 365\n• Email: wisede63@gmail.com\nOutside hours: leave a WhatsApp message and we'll reply first thing in the morning.",
  },
  {
    id: "laptop-brand",
    priority: 6,
    keywords: { which_laptop_brand: 4, best_laptop_brand: 4, hp_vs_dell: 3, dell_vs_hp: 3, laptop_brands: 3 },
    reply:
      "Laptop brands we stock:\n• Apple MacBook — premium build, excellent battery, great for creative work\n• Dell XPS — premium Windows, ultra-portable, great displays\n• HP Pavilion/ProBook — great value, solid performance\n• Lenovo ThinkPad — legendary keyboard, business-ready, durable\n• ASUS Vivobook — good specs for price, gaming options\nTell me your use case and budget for a specific recommendation.",
  },
  {
    id: "apple-vs-android",
    priority: 6,
    keywords: { apple_vs_android: 6, iphone_vs_android: 6, which_is_better_apple_or_android: 5, ios_vs_android: 5 },
    reply:
      "Apple iOS vs Android:\n• iOS: simpler, longer software updates (5–7 years), better resale value, seamless Apple ecosystem\n• Android: more customisation, wider price range, more device choices, foldables available\n• Both excellent — choice depends on budget, preferences and ecosystem\nFor specific comparisons (iPhone 17 vs Samsung S25), ask us on WhatsApp.",
  },
  {
    id: "phone-for-work",
    priority: 6,
    keywords: { best_phone_for_work: 5, phone_for_business: 5, business_phone: 4, professional_phone: 4 },
    reply:
      "Best phones for work:\n• Samsung Galaxy S24 Ultra / S25 Ultra — Android productivity, S Pen, DeX mode\n• iPhone 15 Pro / 16 Pro — seamless with Mac/ iPad, great security\n• Google Pixel 9 Pro — clean Android, excellent camera for documents\nConsider storage (256GB+ for work files) and battery life. Ask us for pricing.",
  },
  {
    id: "phone-for-kids",
    priority: 5,
    keywords: { phone_for_kids: 5, best_phone_for_children: 4, kid_friendly_phone: 4, phone_for_teenager: 4 },
    reply:
      "Phones for kids/teens:\n• iPhone SE — compact, durable, easy to use\n• Samsung Galaxy A55 — good battery, affordable\n• iPhone 13/14 — solid build, will last years\nConsider screen time controls, durability and budget. Ask us about family-friendly options on WhatsApp.",
  },
  {
    id: "laptop-for-design",
    priority: 6,
    keywords: { laptop_for_design: 5, laptop_for_graphic_design: 5, laptop_for_video_editing: 5, laptop_for_creative: 4 },
    reply:
      "Best laptops for design/video editing:\n• MacBook Pro 14\" / 16\" M3/M4 — best-in-class display, M-series performance\n• Dell XPS 15 — stunning 4K display, powerful Intel/AMD\n• ASUS Vivobook 15 — great value with dedicated GPU\nFor 4K video editing: MacBook Pro M3 Pro/Max or Dell XPS with RTX graphics. Ask us about current stock.",
  },
  {
    id: "warranty-claim-process",
    priority: 6,
    keywords: { how_to_claim: 5, warranty_process: 5, claim_process: 4 },
    reply:
      "Warranty claim process:\n1. Message us on WhatsApp with order ref and photos/video of the issue\n2. We verify your purchase and warranty status\n3. We'll arrange:\n   - In-store repair (same-day for most issues), OR\n   - Replacement (if repair isn't possible), OR\n   - Refund (if the issue is serious)\nWe aim to resolve within 48 hours. For urgent issues, visit the shop directly.",
  },
  {
    id: "tradein-online",
    priority: 6,
    keywords: { tradein_online: 5, tradein_website: 4, can_i_tradein_online: 5, online_tradein: 4 },
    reply:
      "Yes! You can start your trade-in online:\n1. Visit our Trade-In page on the website\n2. Select your device and condition\n3. Get an instant estimate\n4. Bring it to the shop for final valuation\nOr message us on WhatsApp with your device details and photos.",
  },
  {
    id: "installment-requirements",
    priority: 6,
    keywords: { installment_requirements: 5, what_do_i_need_for_installment: 5, documents_for_installment: 5 },
    reply:
      "To apply for installment:\n1. Message us on WhatsApp: 0541 533 365\n2. Provide:\n   - Valid Ghana Card / Voter ID / Driver's Licence\n   - Proof of income (payslip, business registration, etc.)\n   - Contact details (phone, email, address)\n3. We'll assess and confirm within 24 hours\n4. Sign agreement and pay deposit\n5. Take your product home!\nContact us on WhatsApp to start your application.",
  },
  {
    id: "laptop-for-business",
    priority: 6,
    keywords: { laptop_for_business: 5, best_laptop_for_work: 5, business_laptop: 5, professional_laptop: 4 },
    reply:
      "Best laptops for business:\n• Lenovo ThinkPad E14/X1 — legendary keyboard, durable, business-ready\n• Dell XPS 13/15 — premium, lightweight, great for presentations\n• MacBook Air M2/M3 — sleek, all-day battery, seamless productivity\n• HP EliteBook — enterprise-grade security, reliable\nAsk us about bulk pricing for business orders on WhatsApp.",
  },
  {
    id: "phone-for-camera",
    priority: 7,
    keywords: { best_phone_for_photos: 6, best_phone_for_camera: 6, phone_for_instagram: 5, phone_for_photography: 6, camera_phone: 5 },
    reply:
      "Best camera phones:\n• iPhone 16 Pro / 15 Pro — best video, natural colours, proRes\n• Google Pixel 9 Pro — best point-and-shoot stills, Night Sight\n• Samsung Galaxy S24 Ultra — versatile zoom (100x Space Zoom)\n• iPhone 17 Pro Max — updated camera system for 2025\nTell me your budget and I'll match you to the right model.",
  },
  {
    id: "tradein-cash-option",
    priority: 6,
    keywords: { can_i_get_cash: 5, tradein_for_cash_only: 4, cash_for_old_phone: 5, sell_old_phone_for_cash: 5 },
    reply:
      "Yes! With iSwap you can swap your old device outright for cash — no need to buy a new device. Bring it to the shop for a free valuation. We'll check the condition and give you an instant cash offer. WhatsApp 0541 533 365 to book a visit.",
  },
  {
    id: "delivery-areas",
    priority: 6,
    keywords: { do_you_deliver_to: 5, delivery_areas: 5, can_you_deliver_to: 5, do_you_deliver_in: 4 },
    reply:
      "We deliver nationwide across Ghana:\n• Greater Accra (Accra, Tema, etc.)\n• Ashanti Region (Kumasi, Konongo, etc.)\n• Bono, Bono East, Ahafo\n• Northern, Savannah, North East\n• Upper East, Upper West\n• Volta, Oti\n• Central, Western, Western North\n• Eastern Region\nUse the WhatsApp cart link to get a delivery quote for your exact address.",
  },
  {
    id: "repair-warranty",
    priority: 6,
    keywords: { repair_warranty: 5, screen_cracked: 5, battery_drain: 4, phone_not_turning_on: 4, slow: 2, lag: 2, cracked_screen: 5, phone_wont_turn_on: 4 },
    reply:
      "Common repairs:\n• Cracked screen: we replace with quality parts, same-day service for most models\n• Battery drain: battery replacement restores hours of life\n• Phone not turning on: free diagnostic, we quote before fixing\n• Water damage: bring it in ASAP — don't charge it\nMessage us on WhatsApp with photos for a quick estimate.",
  },
  {
    id: "payment-security",
    priority: 5,
    keywords: { is_payment_safe: 5, is_it_safe_to_pay: 4, payment_security: 4, secure_checkout: 3 },
    reply:
      "Yes, your payment is 100% safe:\n• All payments are processed by Paystack (PCI-DSS compliant)\n• We never see or store your card PIN or OTP\n• Your card details never touch our servers\n• Mobile Money payments are also secure\nFor any concerns, message us on WhatsApp before placing your order.",
  },
  {
    id: "account-deletion",
    priority: 4,
    keywords: { delete_account: 5, remove_account: 4, close_account: 4, delete_my_account: 5 },
    reply:
      "To delete your account:\n• Go to Orders page → scroll to 'Danger zone'\n• Type 'DELETE' to confirm\n• Click 'Permanently delete my account'\nThis action is permanent and will remove all your data. For help, message us on WhatsApp.",
  },
  {
    id: "product-warranty",
    priority: 6,
    keywords: { product_warranty: 5, does_this_product_have_warranty: 5, warranty_on_this_item: 4 },
    reply:
      "Warranty varies by product:\n• New phones/laptops: 3–12 months\n• UK-used devices: 7–30 days\n• Accessories: 7–14 days\n• Appliances: 3–6 months\nCheck the product page for exact warranty, or message us on WhatsApp with the product name.",
  },
  {
    id: "installment-contact",
    priority: 8,
    keywords: { installment_contact: 5, installment_whatsapp: 5, call_for_installment: 5, installment_phone: 4, installment_number: 4, installment_apply: 5 },
    reply:
      "To apply for an installment plan, contact us directly on WhatsApp: 0541 533 365\nWe'll discuss:\n• Available products for installment\n• Down payment amount (usually 20–30%)\n• Payment duration (1–6 months)\n• Required documents (Ghana Card, etc.)\n• Your eligibility\nMessage us now to get started.",
  },
  {
    id: "laptop-specs",
    priority: 6,
    keywords: { laptop_specs: 5, laptop_specifications: 5, laptop_ram: 4, laptop_storage: 4, laptop_processor: 4 },
    reply:
      "Laptop specs vary by model. Common configurations:\n• MacBook Air M2/M3: 8–16GB RAM, 256GB–1TB SSD, Apple M2/M3 chip\n• Dell XPS 13: 8–32GB RAM, 256GB–1TB SSD, Intel Core i5/i7\n• HP Pavilion 15: 8–16GB RAM, 512GB–1TB SSD, Intel Core i5/i7\n• Lenovo ThinkPad E14: 8–16GB RAM, 256GB–1TB SSD, Intel Core i5/i7\nFor exact specs on a specific model, ask us on WhatsApp or check the product page.",
  },
  {
    id: "phone-specs",
    priority: 6,
    keywords: { phone_specs: 5, phone_specifications: 5, phone_ram: 4, phone_storage: 4, phone_processor: 4, phone_screen_size: 4 },
    reply:
      "Phone specs vary by model. Common configurations:\n• iPhone 17 Pro Max: 6.9\" display, A19 Pro chip, 8GB RAM, 256GB–1TB\n• Samsung S25 Ultra: 6.9\" Dynamic AMOLED, Snapdragon 8 Elite, 12GB RAM, 256GB–1TB\n• Google Pixel 9 Pro: 6.3\" OLED, Tensor G4, 16GB RAM, 128GB–1TB\nFor exact specs on a specific model, ask us on WhatsApp or check the product page.",
  },
  {
    id: "refund-policy",
    priority: 6,
    keywords: { refund_policy: 5, how_to_get_refund: 5, refund_conditions: 4, refund_eligible: 4 },
    reply:
      "Refund policy:\n• Faulty/not as described: full refund within warranty period\n• Change of mind: refund within 3 days if item is unopened\n• To request: message us on WhatsApp with order ref and reason\n• Refunds processed within 7–14 days after inspection\n• Refund via original payment method (Paystack) or store credit",
  },
  {
    id: "repair-turnaround",
    priority: 5,
    keywords: { repair_turnaround: 5, how_long_for_repair: 5, repair_time: 4, same_day_repair: 4 },
    reply:
      "Repair turnaround:\n• Screen replacement: same-day for most models (2–3 hours)\n• Battery replacement: 1–2 hours\n• Charging port/speaker: 1–2 hours\n• Water damage: 24–48 hours (diagnostic first)\n• Other issues: 1–3 days\nWe'll give you a time estimate when you bring it in. For urgent repairs, message us on WhatsApp first.",
  },
  {
    id: "tradein-in-store",
    priority: 6,
    keywords: { tradein_in_store: 5, can_i_do_tradein_in_store: 5, in_store_tradein: 4 },
    reply:
      "Yes! In-store trade-ins:\n1. Bring your old device to our shop (Tafo American Building, Mampong Rd, Kumasi)\n2. Our technicians inspect it on the spot\n3. We give you an instant offer\n4. You can apply the credit toward a new device or get cash\nOpen daily 7:00 AM – 9:00 PM. No appointment needed.",
  },
  {
    id: "warranty-extension",
    priority: 5,
    keywords: { warranty_extension: 5, extend_warranty: 4, can_i_extend_warranty: 4 },
    reply:
      "Warranty extension options:\n• Some products allow extended warranty at purchase (ask at checkout)\n• For existing purchases: contact us on WhatsApp with your order ref\n• Extended warranty terms vary by product type\nWe'll advise on what's available for your specific device.",
  },
  {
    id: "product-comparison",
    priority: 7,
    keywords: { compare: 4, comparison: 4, difference: 3, vs: 3, which_is_better: 4, iphone_vs_samsung: 5, macbook_vs_dell: 4 },
    reply:
      "For product comparisons, tell me which two products you're comparing and I'll break it down. For example:\n• iPhone 17 Pro vs Samsung S25 Ultra\n• MacBook Air vs Dell XPS\n• iPhone 16 vs iPhone 17\nOr message us on WhatsApp for a detailed side-by-side comparison with pricing.",
  },
  {
    id: "order-modification",
    priority: 5,
    keywords: { modify_order: 5, change_order: 5, edit_order: 4, add_to_order: 4, remove_from_order: 4 },
    reply:
      "To modify your order:\n• Message us on WhatsApp immediately with your order reference\n• Tell us what you want to change (add/remove items, change address, etc.)\n• If the order hasn't been dispatched yet, we'll update it\n• Changes after dispatch may not be possible or may incur extra fees\nAct fast — call 0541 533 365 for urgent changes.",
  },
  {
    id: "order-cancellation",
    priority: 6,
    keywords: { cancel_order: 5, cancel_my_order: 5, how_to_cancel_order: 5, order_cancellation: 4 },
    reply:
      "To cancel your order:\n• Message us on WhatsApp within 24 hours of placing the order\n• Provide your order reference (CBOY-XXXX)\n• If payment was made, refund will be processed within 7–14 days\n• If order hasn't been dispatched yet, we'll cancel immediately\nAfter 24 hours, cancellation may not be possible if the order is already fulfilled.",
  },
  {
    id: "delivery-schedule",
    priority: 5,
    keywords: { delivery_schedule: 5, schedule_delivery: 4, choose_delivery_time: 3, delivery_date: 4 },
    reply:
      "Delivery scheduling:\n• We'll call/WhatsApp you to confirm delivery time\n• You can request a specific date/time in the delivery notes at checkout\n• Same-day delivery available for Kumasi metro (order before 12 PM)\n• For scheduled deliveries, we'll confirm availability\nMessage us on WhatsApp for special delivery requests.",
  },
  {
    id: "product-qa",
    priority: 6,
    keywords: { product_question: 5, question_about_product: 5, ask_about_product: 4, more_info_on: 4 },
    reply:
      "For specific product questions:\n• Browse the catalogue and tap a product for full specs\n• Message us on WhatsApp with the product name and your question\n• We'll reply with details, availability and pricing\nCommon questions: specs, warranty, availability, colour options, storage options.",
  },
  {
    id: "warranty-claim-help",
    priority: 6,
    keywords: { help_with_warranty: 5, warranty_support: 4, warranty_assistance: 4 },
    reply:
      "For warranty claim help:\n1. Message us on WhatsApp with your order reference\n2. Share photos/video of the issue\n3. We'll guide you through the claim process\n4. We'll arrange repair, replacement or refund\nFor in-person help, visit our shop at Tafo American Building, Mampong Rd, Kumasi.",
  },
  {
    id: "contact-whatsapp",
    priority: 7,
    keywords: { whatsapp_number: 5, whatsapp_contact: 5, message_me_on_whatsapp: 4, chat_on_whatsapp: 4, whatsapp_link: 4 },
    reply:
      "WhatsApp us directly: 0541 533 365\nOr tap here: https://wa.me/233541533365\nWe respond fast during shop hours (7 AM – 9 PM daily). For orders, installment, trade-in, warranty and general questions — WhatsApp is the best way to reach us.",
  },
  {
    id: "contact-email",
    priority: 5,
    keywords: { email: 5, email_address: 4, send_email: 3, email_us: 3, email_contact: 4 },
    reply:
      "Email us at: wisede63@gmail.com\nFor faster response, use WhatsApp: 0541 533 365\nEmail is best for non-urgent queries like bulk orders, partnerships or feedback. We aim to reply within 24 hours.",
  },
  {
    id: "contact-social",
    priority: 5,
    keywords: { instagram: 4, tiktok: 4, facebook: 4, social_media: 4, follow_us: 3 },
    reply:
      "Follow us on social media:\n• Instagram: @Cboyistore\n• TikTok: @Cboyistore\n• Facebook: Cboyistore\nWe post new arrivals, deals, customer photos and unboxing videos. For orders and support, WhatsApp 0541 533 365 is faster.",
  },
  {
    id: "contact-phone",
    priority: 7,
    keywords: { call_me: 4, call_us: 4, phone_call: 4, call_our_phone: 4, telephone: 3 },
    reply:
      "Call or WhatsApp us: 0541 533 365\nAvailable daily 7:00 AM – 9:00 PM.\nFor fastest response, WhatsApp is preferred — we can send photos, links and quotes instantly.",
  },
  {
    id: "shop-visit",
    priority: 6,
    keywords: { can_i_visit_shop: 5, visit_shop: 4, come_to_shop: 4, in_store: 4, walk_in: 3, shop_address: 5 },
    reply:
      "Yes! Visit our shop:\nCboyistore\nTafo American Building, Mampong Rd\nKumasi, Ghana\nHours: 7:00 AM – 9:00 PM daily\nWalk in anytime — no appointment needed. See products in person, ask questions, and take your order home the same day.",
  },
  {
    id: "contact-response-time",
    priority: 5,
    keywords: { response_time: 5, how_long_to_reply: 4, reply_time: 4, when_will_you_reply: 4 },
    reply:
      "Response times:\n• WhatsApp: within minutes during shop hours (7 AM – 9 PM)\n• Phone call: immediate during shop hours\n• Email: within 24 hours\n• Instagram/TikTok DMs: within 24 hours\nOutside shop hours: we'll reply first thing in the morning. For urgent orders, call 0541 533 365.",
  },
  {
    id: "order-placement",
    priority: 6,
    keywords: { how_do_i_place_order: 5, placing_order: 4, order_steps: 4, steps_to_order: 4 },
    reply:
      "Steps to place an order:\n1. Browse products and tap what you want\n2. Choose storage and colour (if available)\n3. Tap 'Add to cart' or 'Buy now'\n4. Fill in your name, phone and delivery address\n5. Pay with Paystack (card or mobile money)\n6. Get confirmation and tracking info\nOr message us on WhatsApp and we'll take your order manually.",
  },
  {
    id: "checkout-process",
    priority: 6,
    keywords: { checkout: 5, checkout_process: 5, how_to_checkout: 5, payment_process: 4 },
    reply:
      "Checkout process:\n1. Review your cart\n2. Tap 'Checkout with Paystack'\n3. Enter your email and delivery details\n4. Choose payment method (card or mobile money)\n5. Complete payment securely via Paystack\n6. You'll receive order confirmation and WhatsApp update\nAll payments are encrypted and secure.",
  },
  {
    id: "installment-eligibility",
    priority: 6,
    keywords: { installment_eligibility: 5, can_i_get_installment: 5, qualify_for_installment: 5, installment_qualification: 4 },
    reply:
      "Installment eligibility:\n• Must have valid Ghana ID (Ghana Card, Voter ID, driver's licence)\n• Proof of income or employment (payslip, business registration, student ID)\n• Minimum deposit: 20–30% of total price\n• Maximum duration: 6 months\nTo check eligibility, message us on WhatsApp: 0541 533 365 with your details.",
  },
  {
    id: "delivery-accra",
    priority: 6,
    keywords: { delivery_to_accra: 5, accra_delivery: 5, do_you_deliver_to_accra: 5, accra_shipping: 4 },
    reply:
      "Yes, we deliver to Accra and Tema:\n• Delivery fee: GHS 30–60\n• Delivery time: 1–2 working days\n• You'll get a tracking number once dispatched\n• Free delivery on orders over GHS 5,000\nFor exact pricing and timing, message us on WhatsApp with your address.",
  },
  {
    id: "delivery-kumasi",
    priority: 6,
    keywords: { delivery_to_kumasi: 5, kumasi_delivery: 5, do_you_deliver_to_kumasi: 5, kumasi_shipping: 4, same_day_delivery_kumasi: 5 },
    reply:
      "Yes, we deliver across Kumasi:\n• Metro areas: same-day or next-day delivery\n• Delivery fee: GHS 20–50 (FREE on orders over GHS 5,000)\n• You'll get a call to confirm address before dispatch\n• Free pickup at our Tafo shop always available\nMessage us on WhatsApp for same-day delivery (order before 12 PM).",
  },
  {
    id: "delivery-regions",
    priority: 5,
    keywords: { do_you_deliver_outside_kumasi: 5, outside_kumasi: 4, regional_delivery: 4, nationwide_delivery: 5 },
    reply:
      "Yes, we deliver nationwide:\n• Ashanti Region (Kumasi, Konongo, Obuasi, etc.)\n• Greater Accra (Accra, Tema, etc.)\n• Bono, Bono East, Ahafo\n• Northern, Savannah, North East\n• Upper East, Upper West\n• Volta, Oti\n• Central, Western, Western North\n• Eastern Region\nDelivery fees vary by region. Ask us for a quote on WhatsApp.",
  },
  {
    id: "delivery-time-accra",
    priority: 5,
    keywords: { how_long_to_accra: 4, accra_delivery_time: 5, delivery_days_to_accra: 4 },
    reply:
      "Accra delivery time: 1–2 working days via VIP/STC/DHL.\n• Order before 12 PM for same-day dispatch\n• You'll get a tracking number via WhatsApp/SMS\n• For urgent Accra deliveries, message us on WhatsApp — we may arrange express delivery.",
  },
  {
    id: "delivery-time-regions",
    priority: 5,
    keywords: { how_long_to_regions: 4, regional_delivery_time: 5, delivery_days_to: 4 },
    reply:
      "Regional delivery times:\n• Kumasi metro: same-day / next-day\n• Accra / Tema: 1–2 working days\n• Other regions (Tamale, Cape Coast, etc.): 2–3 working days\n• Remote areas: 3–5 working days\nWe use VIP, STC and DHL for reliable nationwide delivery.",
  },
  {
    id: "delivery-policy",
    priority: 5,
    keywords: { delivery_policy: 5, delivery_terms: 4, delivery_conditions: 4 },
    reply:
      "Delivery policy:\n• Delivery fees confirmed at checkout\n• Free delivery on orders over GHS 5,000 (Kumasi metro)\n• You must be available to receive the package\n• If you're not available, the courier will contact you to reschedule\n• Failed deliveries may incur re-delivery fees\nFor special delivery instructions, add a note at checkout or message us on WhatsApp.",
  },
  {
    id: "order-issues-general",
    priority: 6,
    keywords: { problem_with_order: 5, order_issue: 5, issue_with_order: 5, order_problem: 5, help_with_order: 4 },
    reply:
      "For any order issue:\n1. Message us on WhatsApp with your order reference (CBOY-XXXX)\n2. Describe the problem clearly\n3. Share photos/video if applicable\n4. We'll respond within hours and resolve\nFor urgent issues, call 0541 533 365. We're here to help.",
  },
  {
    id: "product-quality",
    priority: 5,
    keywords: { product_quality: 5, quality_check: 4, is_the_quality_good: 4, quality_assurance: 4 },
    reply:
      "Quality assurance:\n• All devices are physically inspected before listing\n• UK-used devices are graded (A/B) and tested\n• New devices come with manufacturer warranty\n• We test screens, batteries, cameras, speakers, ports\n• Photos in the catalogue are of the actual device\nWe stand behind every product we sell.",
  },
  {
    id: "shop-visit-hours",
    priority: 5,
    keywords: { can_i_visit_today: 4, visit_shop_today: 4, shop_open_now: 4, are_you_open_now: 3 },
    reply:
      "Yes, we're open today! Hours: 7:00 AM – 9:00 PM every day including weekends and public holidays. Visit us at Tafo American Building, Mampong Rd, Kumasi. No appointment needed.",
  },
  {
    id: "product-category",
    priority: 5,
    keywords: { what_categories: 4, product_categories: 4, types_of_products: 4, what_types: 3 },
    reply:
      "Our product categories:\n• Phones — iPhones, Samsung, Google Pixel\n• Laptops — MacBooks, Dell, HP, Lenovo, ASUS\n• Tablets — iPad Pro, iPad Air, iPad\n• Smartwatches — Apple Watch, Galaxy Watch\n• Gaming — PS5, Xbox, Nintendo Switch\n• Appliances — fridges, TVs, ACs, washing machines, freezers, microwaves\n• Accessories — chargers, cases, screen protectors, AirPods, power banks\nBrowse the catalogue above to see all products.",
  },
  {
    id: "contact-urgent",
    priority: 7,
    keywords: { urgent: 5, emergency: 4, urgent_order: 4, urgent_delivery: 4, urgent_help: 3 },
    reply:
      "For urgent matters:\n• Call/WhatsApp: 0541 533 365 (available 7 AM – 9 PM daily)\n• For urgent delivery in Kumasi: message us before 12 PM for same-day dispatch\n• For urgent repairs: bring device to shop or WhatsApp photos first\nWe prioritise urgent customer requests.",
  },
  {
    id: "product-stock",
    priority: 6,
    keywords: { stock_status: 5, is_it_in_stock: 5, available_now: 4, in_stock: 4, out_of_stock: 4 },
    reply:
      "Stock status:\n• Browse the catalogue — out-of-stock items are marked\n• Message us on WhatsApp with the product name for real-time stock check\n• We restock frequently — join our WhatsApp list for restock alerts\n• We can also reserve items for 24–48 hours with a small deposit",
  },
  {
    id: "product-restock",
    priority: 5,
    keywords: { restock: 5, when_will_it_be_back: 5, back_in_stock: 4, restock_alert: 3 },
    reply:
      "Restock info:\n• We restock weekly — follow @Cboyistore on Instagram/TikTok for alerts\n• Message us on WhatsApp with the product name and we'll notify you when it's back\n• Join our WhatsApp broadcast list for restock and deal alerts\nWe prioritise restocking popular items faster.",
  },
  {
    id: "product-color",
    priority: 5,
    keywords: { what_colors: 4, available_colours: 4, colour_options: 4, color_options: 4, which_colours: 3 },
    reply:
      "Colour options vary by product. Common colours:\n• iPhones: Black, White, Blue, Green, Pink, Titanium (natural/blue/black)\n• Samsung: Phantom Black, White, Violet, Green, Silver\n• Accessories: various colours\nCheck the product page or ask us on WhatsApp for specific colour availability.",
  },
  {
    id: "product-storage",
    priority: 5,
    keywords: { what_storage: 4, storage_options: 4, storage_sizes: 4, which_storage: 3 },
    reply:
      "Storage options vary by product. Common sizes:\n• Phones: 128GB, 256GB, 512GB, 1TB\n• Laptops: 256GB SSD, 512GB SSD, 1TB SSD, 2TB SSD\n• iPads: 128GB, 256GB, 512GB, 1TB\nChoose storage at checkout — the price updates automatically. Need help deciding? Tell me your use case.",
  },
  {
    id: "shop-policies",
    priority: 5,
    keywords: { shop_policies: 4, store_policies: 4, terms_and_conditions: 3, terms: 2 },
    reply:
      "Key shop policies:\n• Prices in GHS, include VAT\n• Payments via Paystack (cards, mobile money)\n• Delivery: 1–3 days nationwide, free pickup in Kumasi\n• Returns: 3 days for change of mind (unopened), warranty period for faulty items\n• Warranty: 7 days–12 months depending on product\n• Trade-in: free valuation, instant offer\nFor full terms, message us on WhatsApp.",
  },
  {
    id: "installment-how",
    priority: 8,
    keywords: { how_does_installment_work: 7, how_installment: 6, installment_explained: 5, explain_installment: 5 },
    reply:
      "How installment works:\n1. Browse products and choose what you want\n2. Message us on WhatsApp: 0541 533 365 with the product\n3. We'll confirm eligibility and terms\n4. Pay 20–30% deposit\n5. Take the product home\n6. Pay the balance over 1–6 months via mobile money or bank transfer\nNo hidden fees, no surprises. Contact us on WhatsApp to start your application today.",
  },
  {
    id: "delivery-address-change",
    priority: 5,
    keywords: { change_delivery_address: 5, update_delivery_address: 5, wrong_delivery_address: 4, modify_delivery_address: 4 },
    reply:
      "To change your delivery address:\n• Message us on WhatsApp immediately with your order reference\n• Tell us the correct address\n• If not yet dispatched: we'll update for free\n• If dispatched: we'll try to redirect (may incur fee)\nAct fast — call 0541 533 365 for urgent changes.",
  },
  {
    id: "order-delayed",
    priority: 6,
    keywords: { order_delayed: 5, delivery_delayed: 5, why_is_my_order_late: 5, order_not_arrived: 4 },
    reply:
      "If your order is delayed:\n1. Message us on WhatsApp with your order reference\n2. We'll check the status with the courier\n3. Common reasons: address issues, payment verification, courier delays\n4. We'll escalate with the courier if needed\nWe aim for all orders to arrive within the estimated timeframe. Sorry for any inconvenience.",
  },
  {
    id: "installment-late-payment",
    priority: 5,
    keywords: { late_payment: 4, missed_payment: 4, installment_late: 4, pay_installment_late: 3 },
    reply:
      "If you miss an installment payment:\n• Message us on WhatsApp immediately: 0541 533 365\n• We'll discuss options: extend term, adjust payment, or settle early\n• Late payments may incur small penalties per the agreement\n• We're flexible — just communicate with us early\nDon't wait until the next payment is due — contact us now.",
  },
  {
    id: "installment-early-payment",
    priority: 5,
    keywords: { early_payment: 4, pay_installment_early: 4, settle_installment_early: 4, pay_off_early: 3 },
    reply:
      "Yes, you can pay off your installment early!\n• No penalty for early settlement\n• Message us on WhatsApp for the remaining balance\n• We'll send payment details\n• Once paid, your ownership is confirmed\nEarly payment saves you potential interest/fees.",
  },
  {
    id: "installment-eligibility-requirements",
    priority: 6,
    keywords: { installment_eligibility_requirements: 5, what_is_needed_for_installment: 5, requirements_for_installment: 5 },
    reply:
      "Installment requirements:\n• Valid Ghana ID (Ghana Card, Voter ID, driver's licence)\n• Proof of income (payslip, business registration, student ID)\n• Contact details (phone, email, address)\n• Down payment: 20–30% of total\n• Minimum order value: usually GHS 1,000+\nMessage us on WhatsApp to check your eligibility.",
  },
  {
    id: "installment-down-payment",
    priority: 6,
    keywords: { down_payment: 5, deposit: 4, how_much_deposit: 5, installment_deposit: 5 },
    reply:
      "Down payment for installments:\n• Typically 20–30% of the total price\n• Example: GHS 10,000 phone → GHS 2,000–3,000 deposit\n• Remaining balance split over 1–6 months\n• Exact amount depends on the product and your profile\nMessage us on WhatsApp for exact terms.",
  },
  {
    id: "installment-duration",
    priority: 6,
    keywords: { installment_duration: 5, how_long_is_installment: 5, installment_period: 5, months_to_pay: 4 },
    reply:
      "Installment duration:\n• Minimum: 1 month\n• Maximum: 6 months\n• Common plans: 3 months, 6 months\n• You can choose the duration that suits your budget\n• Longer duration = smaller monthly payments\nMessage us on WhatsApp to discuss options.",
  },
  {
    id: "installment-apply",
    priority: 8,
    keywords: { apply_for_installment: 6, start_installment: 5, begin_installment: 4, get_installment: 5 },
    reply:
      "To apply for an installment plan:\n1. Message us on WhatsApp: 0541 533 365\n2. Tell us which product you want\n3. Provide your ID and income details\n4. We'll confirm eligibility within 24 hours\n5. Pay deposit and take the product home\n6. Pay the balance over 1–6 months\nContact us now to get started!",
  },
  {
    id: "installment-contact-whatsapp",
    priority: 8,
    keywords: { installment_whatsapp: 6, installment_call: 5, installment_phone: 5, contact_for_installment: 5, installment_number: 5 },
    reply:
      "For installment plans, contact us on WhatsApp: 0541 533 365\nWe'll guide you through:\n• Available products for installment\n• Down payment and monthly amounts\n• Required documents\n• Application process\n• Your eligibility\nMessage us now — we're ready to help!",
  },
  {
    id: "installment-contact-call",
    priority: 7,
    keywords: { call_for_installment: 5, installment_call_me: 4, installment_phone_call: 4, call_installment: 4 },
    reply:
      "You can call us for installment inquiries: 0541 533 365\nOr message us on WhatsApp with:\n• Product you want\n• Your ID type\n• Employment/student status\nWe'll discuss options and get your application started.",
  },
  {
    id: "installment-faq",
    priority: 6,
    keywords: { installment_faq: 5, installment_questions: 5, installment_info: 4, learn_about_installment: 4 },
    reply:
      "Installment FAQ:\nQ: Do I need a down payment?\nA: Yes, 20–30% deposit required.\n\nQ: How long is the payment period?\nA: 1–6 months, you choose.\n\nQ: What documents do I need?\nA: Valid ID (Ghana Card, Voter ID, driver's licence) + proof of income.\n\nQ: Can I pay early?\nA: Yes, no penalty for early settlement.\n\nQ: What if I miss a payment?\nA: Message us immediately — we'll discuss options.\n\nFor more info, WhatsApp 0541 533 365.",
  },
  {
    id: "installment-terms",
    priority: 7,
    keywords: { installment_terms: 6, installment_conditions: 5, terms_and_conditions_installment: 5 },
    reply:
      "Installment terms:\n• Down payment: 20–30% of total price\n• Payment duration: 1–6 months\n• Eligible: employees, students, self-employed with valid ID\n• Required: Ghana Card / Voter ID / driver's licence + proof of income\n• No hidden fees — all costs disclosed upfront\n• Early settlement allowed without penalty\n• Late payments may incur small penalties\nFor full terms, message us on WhatsApp.",
  },
  {
    id: "installment-requirements-student",
    priority: 6,
    keywords: { installment_for_students: 5, student_installment: 5, can_students_get_installment: 5 },
    reply:
      "Yes, students can apply for installment plans!\n• Student ID accepted as proof\n• Usually requires a guarantor (parent/guardian) for minors\n• Popular plans: 3–6 months\n• Minimum order: GHS 1,000+\nMessage us on WhatsApp with your student ID and the product you want.",
  },
  {
    id: "installment-requirements-employee",
    priority: 6,
    keywords: { installment_for_employees: 5, employee_installment: 5, can_employees_get_installment: 5, payroll_installment: 4 },
    reply:
      "Yes, employees can apply for installment plans:\n• Payslip or employment letter as proof of income\n• Valid ID required\n• Popular plans: 3–6 months\n• Salary deduction or mobile money auto-pay available\nMessage us on WhatsApp with your employment details and the product you want.",
  },
  {
    id: "installment-requirements-self-employed",
    priority: 6,
    keywords: { installment_for_self_employed: 5, self_employed_installment: 5, can_self_employed_get_installment: 5, business_installment: 4 },
    reply:
      "Yes, self-employed individuals can apply:\n• Business registration or tax ID as proof\n• Valid ID required\n• Popular plans: 3–6 months\n• We may ask for bank statements or business photos\nMessage us on WhatsApp with your business details and the product you want.",
  },
  {
    id: "installment-documents",
    priority: 6,
    keywords: { installment_documents: 5, documents_for_installment: 5, what_documents_for_installment: 5, paperwork_for_installment: 4 },
    reply:
      "Documents needed for installment:\n1. Valid Ghana ID (Ghana Card, Voter ID, driver's licence)\n2. Proof of income:\n   - Employees: payslip or employment letter\n   - Students: student ID + guarantor details\n   - Self-employed: business registration or tax ID\n3. Contact details: phone, email, address\nMessage us on WhatsApp to confirm exact requirements.",
  },
  {
    id: "installment-approval-time",
    priority: 5,
    keywords: { installment_approval_time: 5, how_long_for_approval: 4, approval_time: 4 },
    reply:
      "Installment approval time:\n• Usually within 24 hours of submitting your application\n• Simple cases (students with guarantor): same-day approval possible\n• Complex cases (self-employed): may take 1–2 days\nWe'll notify you via WhatsApp once approved. Message us to start your application.",
  },
  {
    id: "installment-down-payment-amount",
    priority: 6,
    keywords: { how_much_down_payment: 5, down_payment_amount: 5, deposit_amount: 4 },
    reply:
      "Down payment amount:\n• Typically 20–30% of the total price\n• Example: GHS 10,000 product → GHS 2,000–3,000 deposit\n• Some products have minimum deposit amounts\n• Exact amount confirmed when you apply\nMessage us on WhatsApp for exact terms on the product you want.",
  },
  {
    id: "installment-monthly-payment",
    priority: 6,
    keywords: { monthly_payment: 5, how_much_per_month: 5, installment_per_month: 5, monthly_cost: 4 },
    reply:
      "Monthly installment amount:\n• Depends on total price, down payment and duration\n• Example: GHS 10,000 product, 30% deposit (GHS 3,000), 3 months → ~GHS 2,333/month\n• Use our WhatsApp calculator or message us for exact amounts\nWe'll break down the costs clearly before you commit.",
  },
  {
    id: "installment-penalty",
    priority: 5,
    keywords: { installment_penalty: 4, late_fee: 4, penalty_for_late_payment: 4, late_payment_fee: 3 },
    reply:
      "Late payment policy:\n• Small penalty may apply for payments >7 days late\n• We're flexible — message us early if you anticipate a delay\n• We can adjust your payment schedule\n• Repeated late payments may affect future eligibility\nCommunication is key — WhatsApp us before the due date if you need help.",
  },
  {
    id: "installment-early-settlement",
    priority: 5,
    keywords: { early_settlement: 4, pay_off_early: 4, settle_early: 3 },
    reply:
      "Early settlement:\n• You can pay off your installment early with no penalty\n• Message us on WhatsApp for the remaining balance\n• We'll send payment details\n• Once paid, ownership is confirmed immediately\nEarly settlement saves you potential interest/fees.",
  },
  {
    id: "installment-default",
    priority: 5,
    keywords: { default_on_installment: 4, what_if_i_cannot_pay: 4, installment_default: 3 },
    reply:
      "If you can't make a payment:\n• Message us on WhatsApp immediately — don't wait\n• We'll discuss options: extend term, adjust payment, or settle\n• We're flexible and want to help you succeed\n• Ignoring payments may lead to collection or legal action\nContact us early — we're here to work with you.",
  },
  {
    id: "installment-reschedule",
    priority: 5,
    keywords: { reschedule_installment: 4, change_installment_date: 3, move_payment_date: 3 },
    reply:
      "To reschedule an installment payment:\n• Message us on WhatsApp before the due date\n• We'll discuss options: extend by a few days, adjust the amount, or skip a month (case by case)\n• Early communication helps us help you\nDon't wait until after the due date — contact us first.",
  },
  {
    id: "installment-eligibility-check",
    priority: 6,
    keywords: { check_eligibility: 4, am_i_eligible: 4, can_i_qualify: 3 },
    reply:
      "To check your installment eligibility:\n• Message us on WhatsApp: 0541 533 365\n• Provide: ID type, income source, desired product and duration\n• We'll assess and confirm within 24 hours\n• No hard credit check — we work with you directly\nWe're happy to help you get the product you need.",
  },
  {
    id: "installment-apply-online",
    priority: 6,
    keywords: { apply_for_installment_online: 5, online_installment_application: 5, installment_online: 4 },
    reply:
      "Installment applications are handled via WhatsApp for faster service:\n1. Message us: 0541 533 365\n2. Share your ID and income details\n3. We'll confirm eligibility and send the agreement\n4. Sign and pay deposit\n5. Take your product home\nNo lengthy online forms — we keep it simple and personal.",
  },
  {
    id: "installment-contact-in-store",
    priority: 6,
    keywords: { installment_in_store: 5, apply_for_installment_in_shop: 4, installment_at_shop: 4 },
    reply:
      "You can apply for installment in-store:\n• Visit: Tafo American Building, Mampong Rd, Kumasi\n• Hours: 7:00 AM – 9:00 PM daily\n• Bring: valid ID, proof of income\n• We'll process your application on the spot\n• If approved, pay deposit and take the product home\nWalk-ins welcome — no appointment needed.",
  },
  {
    id: "thanks",
    priority: 3,
    keywords: { thank: 3, thanks: 3, appreciat: 2, cheers: 2, nice: 1, helpful: 2, thank_you: 3, thanks_a_lot: 2 },
    reply: "Anytime! Reach out anytime you need help. For orders, installment or trade-in, WhatsApp 0541 533 365.",
  },
];

const FALLBACK =
  "Hmm, I'm not 100% sure about that one. The fastest way to get a solid answer is our WhatsApp line — https://wa.me/233541533365 (0541 533 365). For installment, delivery, product questions or trade-in, just message us and we'll reply fast. Want me to open WhatsApp?";

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
