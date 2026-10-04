// Panchhi Yatra - Client Script
const WHATSAPP_NUMBER = "919211398228";
let allTrips = [];

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTrips();
  loadReviews();
  setupFilterListeners();
  setupEnquiryForm();
  setupReviewForm();
});

// ==========================================
// 1. FETCH & RENDER TRIPS (Compact Cards)
// ==========================================
async function loadTrips() {
  const container = document.getElementById("trips-grid");
  try {
    const res = await fetch("/api/trips");
    allTrips = await res.json();
    renderTrips(allTrips);
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Error loading trips. Make sure the Node server is running!</p>`;
  }
}

function renderTrips(trips) {
  const container = document.getElementById("trips-grid");
  container.innerHTML = "";

  trips.forEach(trip => {
    const card = document.createElement("div");
    card.className = "trip-card";
    card.onclick = () => openTripModal(trip.id);

    card.innerHTML = `
      <div class="trip-card-img-wrapper">
        <img class="trip-card-img" src="${trip.coverImage}" alt="${trip.title}" loading="lazy">
        <span class="trip-category-badge">${trip.category}</span>
      </div>
      <div class="trip-card-body">
        <div>
          <h3 class="trip-card-title">${trip.title}</h3>
          <div class="trip-card-meta">
            <span>⏱️ ${trip.duration}</span>
            <span>⭐ ${trip.rating}</span>
          </div>
        </div>
        <div class="trip-card-footer">
          <div>
            <div style="font-size:0.75rem; color:#64748b;">Starting from</div>
            <div class="trip-price-val">₹${trip.price.toLocaleString("en-IN")}</div>
          </div>
          <span class="trip-view-btn">View Details &rarr;</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Filter trips by category
function setupFilterListeners() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        renderTrips(allTrips);
      } else {
        const filtered = allTrips.filter(t => t.category === filter);
        renderTrips(filtered);
      }
    });
  });
}

// ==========================================
// 2. OPEN DETAILED MODAL (Multiple photos & Day-by-Day)
// ==========================================
async function openTripModal(tripId) {
  const modal = document.getElementById("trip-modal");
  const content = document.getElementById("trip-modal-content");
  
  content.innerHTML = `<p style="padding:40px; text-align:center;">Loading itinerary...</p>`;
  modal.classList.add("open");

  try {
    const res = await fetch(`/api/trips/${tripId}`);
    const trip = await res.json();

    const galleryHTML = trip.gallery.map(img => `<img src="${img}" alt="${trip.title}">`).join("");
    
    const itineraryHTML = trip.itinerary.map(item => `
      <div class="timeline-item">
        <div class="timeline-day">DAY ${item.day}</div>
        <div class="timeline-title">${item.title}</div>
        <p style="color:#475569; font-size:0.95rem;">${item.desc}</p>
      </div>
    `).join("");

    const inclusionsHTML = trip.inclusions.map(inc => `<li>✓ ${inc}</li>`).join("");
    const exclusionsHTML = trip.exclusions.map(exc => `<li>✗ ${exc}</li>`).join("");

    const whatsappDirectLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Namaste Panchhi Yatra! I am interested in booking: ${trip.title} (₹${trip.price}). Please send details.`
    )}`;

    content.innerHTML = `
      <div class="modal-gallery">
        ${galleryHTML}
      </div>
      <div class="modal-body">
        <span class="trip-category-badge" style="position:static; margin-bottom:8px; display:inline-block;">${trip.category}</span>
        <h2 style="font-size:2rem; margin-bottom:8px;">${trip.title}</h2>
        <p style="color:#64748b; font-size:1.05rem; margin-bottom:16px;">${trip.tagline}</p>
        
        <div style="display:flex; gap:20px; align-items:center; margin-bottom:24px; padding:12px; background:#f8fafc; border-radius:8px;">
          <div><strong>Duration:</strong> ${trip.duration}</div>
          <div><strong>Price:</strong> <span style="color:var(--primary); font-size:1.3rem; font-weight:800;">₹${trip.price.toLocaleString("en-IN")}</span> / person</div>
          <div><strong>Rating:</strong> ⭐ ${trip.rating} (${trip.reviewsCount} reviews)</div>
        </div>

        <h3>Overview</h3>
        <p style="color:#334155; margin-bottom:24px;">${trip.overview}</p>

        <h3>Day-by-Day Itinerary</h3>
        <div class="timeline">
          ${itineraryHTML}
        </div>

        <div class="inc-exc-grid">
          <div class="inc-box">
            <h4 style="color:#065f46; margin-bottom:10px;">Inclusions</h4>
            <ul style="list-style:none; font-size:0.9rem;">${inclusionsHTML}</ul>
          </div>
          <div class="exc-box">
            <h4 style="color:#991b1b; margin-bottom:10px;">Exclusions</h4>
            <ul style="list-style:none; font-size:0.9rem;">${exclusionsHTML}</ul>
          </div>
        </div>

        <div style="display:flex; gap:16px; margin-top:30px; flex-wrap:wrap;">
          <a href="${whatsappDirectLink}" target="_blank" class="btn btn-whatsapp" style="flex:1;">
            Book via WhatsApp 💬
          </a>
          <button onclick="selectPackageForEnquiry('${trip.title}')" class="btn btn-primary" style="flex:1;">
            Request Custom Quote
          </button>
        </div>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<p style="padding:40px; color:red;">Failed to fetch trip details.</p>`;
  }
}

function closeTripModal() {
  document.getElementById("trip-modal").classList.remove("open");
}

window.onclick = function(event) {
  const modal = document.getElementById("trip-modal");
  if (event.target === modal) {
    closeTripModal();
  }
};

function selectPackageForEnquiry(packageTitle) {
  closeTripModal();
  const input = document.getElementById("cust-dest");
  if (input) {
    input.value = packageTitle;
  }
  document.getElementById("enquiry-section").scrollIntoView({ behavior: "smooth" });
}

// ==========================================
// 3. ENQUIRY FORM SUBMISSION (Database)
// ==========================================
function setupEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  const status = document.getElementById("enquiry-status");
  const btn = document.getElementById("submit-enquiry-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerText = "Submitting...";

    const payload = {
      name: document.getElementById("cust-name").value,
      phone: document.getElementById("cust-phone").value,
      destination: document.getElementById("cust-dest").value,
      people: document.getElementById("cust-people").value,
      travelDate: document.getElementById("cust-date").value,
      notes: document.getElementById("cust-notes").value
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      status.style.color = "green";
      status.innerText = "✓ " + data.message;
      form.reset();
    } catch (err) {
      status.style.color = "red";
      status.innerText = "Enquiry submission failed. Please WhatsApp us directly at +91 9211398228.";
    } finally {
      btn.disabled = false;
      btn.innerText = "Submit Enquiry";
    }
  });
}

// ==========================================
// 4. REVIEWS & RATINGS SYSTEM
// ==========================================
async function loadReviews() {
  const container = document.getElementById("reviews-grid");
  try {
    const res = await fetch("/api/reviews");
    const reviews = await res.json();
    
    container.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-stars">${"⭐".repeat(r.rating)}</div>
        <p class="review-comment">"${r.comment}"</p>
        <div class="review-author">${r.name}</div>
        <div class="review-trip-tag">${r.trip} • ${r.date}</div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Could not load reviews", err);
  }
}

function toggleReviewForm() {
  const form = document.getElementById("review-form");
  form.classList.toggle("hidden");
}

function setupReviewForm() {
  const form = document.getElementById("review-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById("rev-name").value,
      trip: document.getElementById("rev-trip").value,
      rating: document.getElementById("rev-rating").value,
      comment: document.getElementById("rev-comment").value
    };

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      form.reset();
      toggleReviewForm();
      loadReviews();
    } catch (err) {
      alert("Could not post review right now.");
    }
  });
}
