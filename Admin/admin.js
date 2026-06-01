let map = L.map("map").setView([9.7392, 118.7353], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let marker;

// LOAD BOOKINGS
function loadBookings() {

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const filter = document.getElementById("filterService").value;

    if (filter !== "All") {
        bookings = bookings.filter(b => b.service === filter);
    }

    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    bookings.forEach((b) => {

        const div = document.createElement("div");
        div.className = "booking-card";

        div.innerHTML = `
            <h3>${b.service}</h3>
            <p><b>Name:</b> ${b.name}</p>
            <p><b>Phone:</b> ${b.phone}</p>
            <p><b>Date:</b> ${b.date} | ${b.time}</p>
            <p><b>Address:</b> ${b.address}</p>
            <p><b>Status:</b> ${b.status}</p>

            <button onclick="showMap(${b.latitude}, ${b.longitude})">
                📍 View Location
            </button>

            <button onclick="deleteBooking(${b.id})">
                ❌ Delete
            </button>
        `;

        list.appendChild(div);
    });
}

// SHOW LOCATION ON MAP
function showMap(lat, lng) {

    map.setView([lat, lng], 16);

    if (marker) {
        marker.remove();
    }

    marker = L.marker([lat, lng]).addTo(map);
}

// DELETE BOOKING
function deleteBooking(id) {

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings = bookings.filter(b => b.id !== id);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    loadBookings();
}

// INITIAL LOAD
loadBookings();

import { getBookings } from "../Bookings/booking.js";

function updateDashboard() {
    const bookings = getBookings();

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === "pending").length;
    const completed = bookings.filter(b => b.status === "completed").length;

    document.getElementById("total").textContent = total;
    document.getElementById("pending").textContent = pending;
    document.getElementById("completed").textContent = completed;
}

updateDashboard();

// LIVE UPDATE
window.addEventListener("storage", updateDashboard);