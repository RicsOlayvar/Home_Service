import { getUser } from "../Authentication/auth.js";

const container = document.getElementById("historyList");

/* ================================= */
/* GET BOOKINGS */
/* ================================= */

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

/* ================================= */
/* CANCEL BOOKING */
/* ================================= */

window.cancelBooking = function (id) {

    let bookings = getBookings();

    bookings = bookings.map(b => {

        if (b.id === id) {

            return {
                ...b,
                status: "Cancelled"
            };
        }

        return b;
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));

    loadHistory();
};

/* ================================= */
/* LOAD HISTORY */
/* ================================= */

window.loadHistory = function () {

    const user = getUser();

    const phoneInput = document
        .getElementById("phoneSearch")
        ?.value
        ?.trim() || "";

    let bookings = getBookings();

    /* ----------------------------- */
    /* FILTER BY USER */
    /* ----------------------------- */
    if (user) {
        bookings = bookings.filter(
            b => b.userEmail === user.email
        );
    }

    /* ----------------------------- */
    /* FILTER BY PHONE */
    /* ----------------------------- */
    if (phoneInput) {
        bookings = bookings.filter(
            b => b.phone === phoneInput
        );
    }

    /* ----------------------------- */
    /* EMPTY STATE */
    /* ----------------------------- */
    if (bookings.length === 0) {
        container.innerHTML =
            "<p style='text-align:center;'>No bookings found.</p>";
        return;
    }

    /* ----------------------------- */
    /* RENDER CARDS */
    /* ----------------------------- */
    container.innerHTML = bookings.map(b => `

        <div class="card">

            <h3>${b.service}</h3>

            <p><b>Name:</b> ${b.name}</p>
            <p><b>Phone:</b> ${b.phone}</p>

            <p><b>Date:</b> ${b.date}</p>
            <p><b>Time:</b> ${b.time}</p>

            <p><b>Payment Method:</b> ${b.paymentMethod || "Cash"}</p>

            <p><b>Service Fee:</b> ₱${b.totalPrice || 0}</p>

            <p>
                <b>Payment Status:</b>
                <span class="${b.paymentStatus === "Paid" ? "paid" : "unpaid"}">
                    ${b.paymentStatus || "Unpaid"}
                </span>
            </p>

            <p>
                <b>Status:</b>
                <span class="${b.status === "Cancelled" ? "cancelled" : ""}">
                    ${b.status || "Pending"}
                </span>
            </p>

            <button onclick="cancelBooking(${b.id})">
                ❌ Cancel Booking
            </button>

        </div>

    `).join("");
};

/* ================================= */
/* AUTO LOAD */
/* ================================= */

loadHistory();