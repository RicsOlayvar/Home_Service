import { getUser } from "../Authentication/auth.js";
import { addBooking } from "./storage.js";

const form = document.getElementById("bookingForm");

/* ================================= */
/* SERVICE PRICES */
/* ================================= */

const servicePrices = {
    "Cleaning": 500,
    "Plumbing": 700,
    "Electrical": 800,
    "Gardening": 600,
    "Painting": 1200,
    "Appliance Repair": 900,
    "Aircon Cleaning": 1500,
    "Carpentry": 1000
};

/* ================================= */
/* LIVE PRICE DISPLAY */
/* ================================= */

const serviceRadios = document.querySelectorAll("input[name='service']");

serviceRadios.forEach(radio => {
    radio.addEventListener("change", () => {

        const priceDisplay = document.getElementById("priceDisplay");

        if (!priceDisplay) return;

        const price = servicePrices[radio.value] || 0;

        priceDisplay.textContent = `₱${price}`;
    });
});

/* ================================= */
/* FORM SUBMIT */
/* ================================= */

if (form) {

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const user = getUser();

        /* ----------------------------- */
        /* SERVICE CHECK */
        /* ----------------------------- */
        const selectedService = document.querySelector(
            "input[name='service']:checked"
        );

        if (!selectedService) {
            alert("Please select a service.");
            return;
        }

        const serviceName = selectedService.value;

        /* ----------------------------- */
        /* PAYMENT METHOD CHECK */
        /* ----------------------------- */
        const paymentMethodElement = document.querySelector(
            "input[name='paymentMethod']:checked"
        );

        if (!paymentMethodElement) {
            alert("Please select a payment method.");
            return;
        }

        const paymentMethod = paymentMethodElement.value;

        /* ----------------------------- */
        /* PRICE CALCULATION */
        /* ----------------------------- */
        const totalPrice = servicePrices[serviceName] || 0;

        /* ----------------------------- */
        /* BOOKING OBJECT */
        /* ----------------------------- */
        const booking = {
            id: Date.now(),

            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),

            latitude: document.getElementById("latitude").value,
            longitude: document.getElementById("longitude").value,

            service: serviceName,

            totalPrice: totalPrice,

            paymentMethod: paymentMethod,

            paymentStatus: "Unpaid",

            date: document.getElementById("date").value,
            time: document.getElementById("time").value,

            userEmail: user ? user.email : "guest",

            status: "Pending",

            createdAt: new Date().toISOString()
        };

        /* ----------------------------- */
        /* SAVE BOOKING */
        /* ----------------------------- */
        addBooking(booking);

        /* ----------------------------- */
        /* SUCCESS MESSAGE */
        /* ----------------------------- */
        alert(
            `Booking saved!\n\nService: ${serviceName}\nPayment: ${paymentMethod}\nTotal: ₱${totalPrice}`
        );

        /* ----------------------------- */
        /* RESET FORM */
        /* ----------------------------- */
        form.reset();

        const priceDisplay = document.getElementById("priceDisplay");
        if (priceDisplay) {
            priceDisplay.textContent = "₱0";
        }

        /* ----------------------------- */
        /* REDIRECT */
        /* ----------------------------- */
        window.location.href = "../History/history.html";
    });
}