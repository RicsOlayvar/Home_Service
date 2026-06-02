const user = JSON.parse(localStorage.getItem("currentUser"));

// BLOCK IF NOT LOGGED IN
if (!user) {
    alert("Please login first!");
    window.location.href = "../Authentication/login.html";
}

// BLOCK IF NOT ADMIN
if (user.role !== "admin") {
    alert("Access denied: Admin only!");
    window.location.href = "../Home/view.html";
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

function goHome() {
    window.location.href = "../homepage/view.html";
}

window.goHome = goHome;

/* ================================= */
/* MAP SETUP */
/* ================================= */

let map = L.map("map").setView([9.7392, 118.7353], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let marker;

/* ================================= */
/* LOAD BOOKINGS */
/* ================================= */

function loadBookings() {

    let bookings = getBookings();

    const filter = document
        .getElementById("filterService")
        ?.value || "All";

    /* ----------------------------- */
    /* FILTER SERVICE */
    /* ----------------------------- */
    if (filter !== "All") {
        bookings = bookings.filter(
            b => b.service === filter
        );
    }

    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    /* ----------------------------- */
    /* EMPTY STATE */
    /* ----------------------------- */
    if (bookings.length === 0) {
        list.innerHTML =
            "<p style='text-align:center;'>No bookings found.</p>";
        return;
    }

    /* ----------------------------- */
    /* RENDER BOOKINGS */
    /* ----------------------------- */
    bookings.forEach((b) => {

        const div = document.createElement("div");
        div.className = "booking-card";

        div.innerHTML = `
            <h3>${b.service}</h3>

            <p><b>Name:</b> ${b.name}</p>
            <p><b>Phone:</b> ${b.phone}</p>
            <p><b>Date:</b> ${b.date} | ${b.time}</p>
            <p><b>Address:</b> ${b.address}</p>

            <p><b>Service Fee:</b> ₱${b.totalPrice || 0}</p>

            <p><b>Payment:</b> 
                <span>${b.paymentStatus || "Unpaid"}</span>
            </p>

            <p><b>Status:</b> ${b.status || "Pending"}</p>

            <button onclick="showMap(${b.latitude}, ${b.longitude})">📍 View Location</button>

            <button onclick="markPaid(${b.id})">💰 Mark Paid</button>

            <button onclick="markDone(${b.id})">✅ Done</button>

            <button onclick="deleteBooking(${b.id})">❌ Delete</button>
        `;

        list.appendChild(div);
    });
}

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings) {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// 💰 MARK AS PAID
function markPaid(id) {

    let bookings = getBookings();

    bookings = bookings.map(b => {
        if (b.id === id) {
            b.paymentStatus = "Paid";
        }
        return b;
    });

    saveBookings(bookings);
    loadBookings();
    updateDashboard();
}

// ✅ MARK AS DONE
function markDone(id) {

    let bookings = getBookings();

    bookings = bookings.map(b => {
        if (b.id === id) {
            b.status = "Done";
        }
        return b;
    });

    saveBookings(bookings);
    loadBookings();
    updateDashboard();
}

// ❌ DELETE
function deleteBooking(id) {

    let bookings = getBookings();

    bookings = bookings.filter(b => b.id !== id);

    saveBookings(bookings);
    loadBookings();
    updateDashboard();
}

/* ================================= */
/* SHOW LOCATION ON MAP */
/* ================================= */

function showMap(lat, lng) {

    if (!lat || !lng) {
        alert("Location not available");
        return;
    }

    map.setView([lat, lng], 16);

    if (marker) {
        marker.remove();
    }

    marker = L.marker([lat, lng]).addTo(map);
}

/* ================================= */
/* DELETE BOOKING */
/* ================================= */

function deleteBooking(id) {

    let bookings = getBookings();

    bookings = bookings.filter(
        b => b.id !== id
    );

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );

    loadBookings();
    updateDashboard();
}

/* ================================= */
/* DASHBOARD COUNTERS */
/* ================================= */

function updateDashboard() {

    const bookings = getBookings();

    const total = bookings.length;

    const pending = bookings.filter(
        b => b.status === "Pending"
    ).length;

    const completed = bookings.filter(
        b => b.status === "Completed"
    ).length;

    const revenue = bookings.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
    );

    const totalEl = document.getElementById("total");
    const pendingEl = document.getElementById("pending");
    const completedEl = document.getElementById("completed");
    const revenueEl = document.getElementById("revenue");

    if (totalEl) totalEl.textContent = total;
    if (pendingEl) pendingEl.textContent = pending;
    if (completedEl) completedEl.textContent = completed;
    if (revenueEl) revenueEl.textContent = "₱" + revenue;
}

/* ================================= */
/* FILTER CHANGE */
/* ================================= */

window.changeFilter = function () {
    loadBookings();
};

/* ================================= */
/* GLOBAL FUNCTIONS */
/* ================================= */

window.loadBookings = loadBookings;
window.showMap = showMap;
window.deleteBooking = deleteBooking;

/* ================================= */
/* INITIAL LOAD */
/* ================================= */

loadBookings();
updateDashboard();

/* ================================= */
/* LIVE UPDATE */
/* ================================= */

window.addEventListener("storage", () => {
    loadBookings();
    updateDashboard();
});