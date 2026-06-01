import { saveBooking } from "./booking-storage.js"; 
import { getUser } from "../Authentication/auth.js";

const form = document.getElementById("bookingForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = getUser();

    const booking = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        service: document.querySelector("input[name='service']:checked").value,
        date: document.querySelector("input[name='date']").value,
        time: document.querySelector("input[name='time']").value,
        userEmail: user ? user.email : "guest"
    };

    saveBooking(booking);

    alert("Booking saved successfully!");

    form.reset();
});