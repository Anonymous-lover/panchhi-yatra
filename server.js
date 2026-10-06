const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. DATA MANAGEMENT: TRIPS / ITINERARIES
// To add a new trip, just add an object to this array!
// ==========================================
const trips = [
  {
    id: "kedarnath-badrinath",
    title: "Do Dham Yatra (Kedarnath & Badrinath)",
    tagline: "Sacred Himalayan pilgrimage with helicopter & trekking options",
    category: "Spiritual",
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    price: 18500,
    duration: "6 Days / 5 Nights",
    rating: 4.9,
    reviewsCount: 142,
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
    ],
    overview: "Embark on a divine expedition into the Garhwal Himalayas. Panchhi Yatra ensures priority darshan, certified local guides, hygienic sattvic meals, and warm mountain stays.",
    inclusions: [
      "Haridwar to Haridwar transport in sanitized AC Tempo / Sumo",
      "5 nights hotel/campsite accommodation on twin/triple sharing",
      "Daily breakfast & dinner (pure vegetarian)",
      "Experienced trek leader & biometric registration assistance"
    ],
    exclusions: [
      "Helicopter / Pony / Palki tickets (can be arranged on request)",
      "Personal expenses & porter charges",
      "Lunch and snacks en route"
    ],
    itinerary: [
      { day: 1, title: "Haridwar to Guptkashi", desc: "Scenic drive along the Mandakini river via Devprayag confluence. Check-in and evening brief." },
      { day: 2, title: "Guptkashi to Kedarnath Base & Trek", desc: "Early transfer to Gaurikund. Begin the 16km spiritual trek to Kedarnath temple. Evening aarti attendance." },
      { day: 3, title: "Morning Darshan & Descent to Guptkashi", desc: "Witness holy sunrise darshan at Kedarnath Shrine. Trek back to Gaurikund and night halt at Guptkashi." },
      { day: 4, title: "Guptkashi to Badrinath", desc: "Scenic highway through Joshimath. Evening visit to Mana village (the first Indian village) and Badrinath shrine." },
      { day: 5, title: "Badrinath to Rudraprayag", desc: "Morning Tapt Kund holy bath and temple darshan. Scenic return journey to Rudraprayag." },
      { day: 6, title: "Rudraprayag to Haridwar Drop", desc: "Return drive with unforgettable memories. Drop-off at Haridwar railway station by evening." }
    ]
  },
  {
    id: "spiti-valley-circuit",
    title: "Spiti Valley Road Trip",
    tagline: "Rugged trans-Himalayan wilderness, ancient monasteries, and starry skies",
    category: "Adventure",
    coverImage: "https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?auto=format&fit=crop&w=800&q=80",
    price: 24999,
    duration: "8 Days / 7 Nights",
    rating: 4.8,
    reviewsCount: 98,
    gallery: [
      "https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80"
    ],
    overview: "A dream journey across the cold desert of Himachal Pradesh. Cross Kunzum Pass, visit the highest post office at Hikkim, and gaze at the turquoise Chandratal Lake.",
    inclusions: [
      "Experienced mountain driver & 4x4 / Force Urbania vehicle",
      "Homestay & Swiss tent accommodation with bonfire",
      "Breakfast and hearty dinners",
      "Inner line permits & oxygen cylinders support"
    ],
    exclusions: [
      "Flight/train tickets to Shimla or Chandigarh",
      "Monastery entry fees & camera permits",
      "Personal riding gear or tips"
    ],
    itinerary: [
      { day: 1, title: "Shimla to Kalpa", desc: "Drive along Sutlej river and marvel at Kinnaur Kailash peaks." },
      { day: 2, title: "Kalpa to Kaza via Nako & Tabo", desc: "Visit the 1000-year-old Tabo monastery and Mummy village of Gue." },
      { day: 3, title: "Kaza Local: Key, Kibber, Chicham Bridge", desc: "Explore highest motorable suspension bridge and snow leopard territory." },
      { day: 4, title: "Highest Villages: Hikkim, Komic, Langza", desc: "Send postcards from Hikkim, see prehistoric fossils in Langza." },
      { day: 5, title: "Kaza to Chandratal Lake", desc: "Traverse high altitude Kunzum Pass and camp near mystical moon lake." },
      { day: 6, title: "Chandratal to Manali & Departure", desc: "Cross Atal Tunnel into lush Kullu valley. Farewell dinner." }
    ]
  },
  {
    id: "kerala-backwaters",
    title: "Serene Kerala & Munnar Hills",
    tagline: "Tea gardens, aromatic spice plantations, and tranquil houseboat cruises",
    category: "Relaxation",
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    price: 15999,
    duration: "5 Days / 4 Nights",
    rating: 4.9,
    reviewsCount: 110,
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80"
    ],
    overview: "A calming tropical getaway. Experience mist-covered tea gardens of Munnar, martial art performances, and an overnight private houseboat in Alleppey backwaters.",
    inclusions: [
      "Private AC Sedan/Innova for all transfers & sightseeing",
      "1 Night luxury houseboat stay with all meals included",
      "3 Nights 4-star resort stays in Munnar & Thekkady",
      "Spice plantation guided tour"
    ],
    exclusions: [
      "Airfare to Cochin Airport (COK)",
      "Ayurvedic massage charges",
      "Optional boating fees in Periyar lake"
    ],
    itinerary: [
      { day: 1, title: "Cochin to Munnar", desc: "Scenic drive passing Cheeyappara waterfalls. Check into plantation resort." },
      { day: 2, title: "Munnar Sightseeing", desc: "Eravikulam National Park (Nilgiri Tahr), Tea Museum, and Mattupetty Dam." },
      { day: 3, title: "Munnar to Thekkady", desc: "Spice garden walk and evening Kathakali and Kalaripayattu martial art show." },
      { day: 4, title: "Thekkady to Alleppey Houseboat", desc: "Board traditional Kettuvallam houseboat. Cruise through lush canals and paddy fields." },
      { day: 5, title: "Alleppey to Cochin Drop", desc: "Breakfast on water, visit Fort Kochi Chinese fishing nets, airport transfer." }
    ]
  }
];

// ==========================================
// 2. CUSTOMER REVIEWS & FEEDBACK DATA
// ==========================================
let reviews = [
  {
    name: "Rohit Sharma",
    trip: "Do Dham Yatra",
    rating: 5,
    comment: "Panchhi Yatra made our Kedarnath darshan so effortless! With elderly parents, we were worried, but the team took care of everything.",
    date: "May 2026"
  },
  {
    name: "Pooja Verma",
    trip: "Spiti Valley Circuit",
    rating: 5,
    comment: "The slogan 'Pankh Aapke, Safar Humara' truly reflects their service. Safe driver, warm homestays, and transparent pricing. 10/10 recommended!",
    date: "June 2026"
  },
  {
    name: "Anand Menon",
    trip: "Kerala Backwaters",
    rating: 5,
    comment: "The Alleppey houseboat experience was magical. Fresh Karimeen fish and very polite staff. Will book again!",
    date: "July 2026"
  }
];

// ==========================================
// 3. API ENDPOINTS
// ==========================================

// GET all trips (cards overview)
app.get('/api/trips', (req, res) => {
  const cards = trips.map(t => ({
    id: t.id,
    title: t.title,
    category: t.category,
    coverImage: t.coverImage,
    price: t.price,
    duration: t.duration,
    rating: t.rating
  }));
  res.json(cards);
});

// GET trip details by ID (for full modal popup)
app.get('/api/trips/:id', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: "Trip not found" });
  res.json(trip);
});

// GET customer reviews
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// POST new customer review
app.post('/api/reviews', (req, res) => {
  const { name, trip, rating, comment } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: "Name, rating, and comment are required." });
  }
  const newReview = {
    name,
    trip: trip || "Custom Journey",
    rating: parseInt(rating),
    comment,
    date: "Just now"
  };
  reviews.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// POST customer enquiry -> Forwards to Google Sheets Webhook
// REPLACE THIS URL with your own Google Apps Script Web App URL!
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzBLb7OkUty6xjZrr3fFoYyEY4os2xynlmOrn31W3jUhu6jl8eGjf-3EsJg3v9ONVywNQ/exec";
app.post('/api/enquiry', async (req, res) => {
  const enquiry = {
    ...req.body,
    createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  };

  console.log("New Enquiry Received:", enquiry);

  // If you configured the Google Sheet Webhook URL:
  if (GOOGLE_SHEET_WEBHOOK_URL && !GOOGLE_SHEET_WEBHOOK_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry)
      });
    } catch (err) {
      console.error("Failed to push to Google Sheet:", err);
    }
  }

  res.json({
    success: true,
    message: "Dhanyawaad! Your enquiry has been registered. Our team will contact you shortly."
  });
});

app.listen(PORT, (3000) => {
  console.log(`Panchhi Yatra server is live at http://localhost:${3000}`);
});
// 
// 
