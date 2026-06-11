export function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

export function addBooking(booking) {
    const bookings = getBookings();

    bookings.push(booking);

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );
}