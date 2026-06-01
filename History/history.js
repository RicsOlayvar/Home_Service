import { getUser } from "../Authentication/auth.js";

const container = document.getElementById("historyList");

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

window.loadHistory = function () {

    const user = getUser();
    const phoneInput = document.getElementById("phoneSearch").value.trim();

    let bookings = getBookings();

    // FILTER BY USER OR PHONE
    if (user) {
        bookings = bookings.filter(b => b.userEmail === user.email);
    }

    if (phoneInput) {
        bookings = bookings.filter(b => b.phone === phoneInput);
    }

    if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings found.</p>";
        return;
    }

    container.innerHTML = bookings.map(b => `
        <div class="card">
            <h3>${b.service}</h3>
            <p><b>Name:</b> ${b.name}</p>
            <p><b>Phone:</b> ${b.phone}</p>
            <p><b>Date:</b> ${b.date}</p>
            <p><b>Time:</b> ${b.time}</p>
            <p class="status">Status: ${b.status || "pending"}</p>
        </div>
    `).join("");
};

// AUTO LOAD ON PAGE OPEN
loadHistory();