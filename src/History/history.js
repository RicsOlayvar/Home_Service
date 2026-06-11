import { getUser } from "../Authentication/auth.js";

const container = document.getElementById("historyList");

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

if (!currentUser) {

    alert("Please login first.");

    window.location.href =
        "../Authentication/login.html";
}

/* =================================
   STORAGE
================================= */

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings) {
    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );
}

/* =================================
   CANCEL BOOKING
================================= */

window.cancelBooking = function (id) {

    let bookings = getBookings();

    const booking = bookings.find(
        b => b.id === id
    );

    if (!booking) return;

    if (
        booking.status === "Done" ||
        booking.status === "Completed"
    ) {
        alert(
            "Completed bookings cannot be cancelled."
        );
        return;
    }

    const confirmCancel = confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.status = "Cancelled";

            b.cancelledAt =
                new Date().toISOString();
        }

        return b;
    });

    saveBookings(bookings);

    alert("Booking cancelled.");

    loadHistory();
};

/* =================================
   STATUS CLASS
================================= */

function getStatusClass(status) {

    switch (status) {

        case "Done":
        case "Completed":
            return "completed";

        case "Assigned":
            return "assigned";

        case "Cancelled":
            return "cancelled";

        default:
            return "pending";
    }
}

/* =================================
   LOAD HISTORY
================================= */

window.loadHistory = function () {

    const user = getUser();

    const phoneInput =
        document
            .getElementById("phoneSearch")
            ?.value
            ?.trim() || "";

    let bookings = getBookings();

    /* =================================
       USER FILTER
    ================================= */

    if (user) {

        bookings = bookings.filter(
            b => b.userEmail === user.email
        );
    }

    /* =================================
       PHONE FILTER
    ================================= */

    if (phoneInput) {

        bookings = bookings.filter(
            b => b.phone === phoneInput
        );
    }

    /* =================================
       SORT NEWEST FIRST
    ================================= */

    bookings.sort(
        (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
    );

    /* =================================
       EMPTY STATE
    ================================= */

    if (bookings.length === 0) {

        container.innerHTML = `
            <p style="text-align:center;">
                No bookings found.
            </p>
        `;

        return;
    }

    /* =================================
       RENDER BOOKINGS
    ================================= */

    container.innerHTML = bookings.map(b => `

        <div class="card">

            <h3>${b.service}</h3>

            <p>
                <b>Name:</b>
                ${b.name}
            </p>

            <p>
                <b>Phone:</b>
                ${b.phone}
            </p>

            <p>
                <b>Address:</b>
                ${b.address}
            </p>

            <p>
                <b>Date:</b>
                ${b.date}
            </p>

            <p>
                <b>Time:</b>
                ${b.time}
            </p>

            <p>
                <b>Service Fee:</b>
                ₱${b.totalPrice || 0}
            </p>

            <p>
                <b>Payment Method:</b>
                ${b.paymentMethod || "Cash"}
            </p>

            <p>
                <b>Payment Status:</b>

                <span class="${
                    b.paymentStatus === "Paid"
                        ? "paid"
                        : "unpaid"
                }">

                    ${b.paymentStatus || "Unpaid"}

                </span>
            </p>

            <p>
                <b>Assigned Worker:</b>
                ${
                    b.assignedWorker
                        ? b.assignedWorker
                        : "Waiting for assignment"
                }
            </p>

            <p>
                <b>Status:</b>

                <span class="${getStatusClass(
                    b.status
                )}">

                    ${b.status || "Pending"}

                </span>
            </p>

            <p>
                <b>Booked On:</b>
                ${
                    b.createdAt
                        ? new Date(
                              b.createdAt
                          ).toLocaleString()
                        : "N/A"
                }
            </p>

            ${
                b.status !== "Cancelled" &&
                b.status !== "Done" &&
                b.status !== "Completed"
                    ? `
                    <button
                        onclick="cancelBooking(${b.id})">
                        ❌ Cancel Booking
                    </button>
                `
                    : ""
            }

        </div>

    `).join("");
};

/* =================================
   LIVE UPDATE
================================= */

window.addEventListener("storage", () => {
    loadHistory();
});

/* =================================
   INIT
================================= */

loadHistory();