/* =================================
   AUTH CHECK (ADMIN ONLY)
================================= */

const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    alert("Please login first!");
    window.location.href = "../Authentication/login.html";
}

if (user.role !== "admin") {
    alert("Access denied: Admin only!");
    window.location.href = "../homepage/view.html";
}

/* =================================
   GO HOME
================================= */

function goHome() {
    window.location.href = "../homepage/view.html";
}
window.goHome = goHome;

/* =================================
   STORAGE
================================= */

function getBookings() {
    return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings) {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

function getWorkers() {
    return JSON.parse(localStorage.getItem("workers")) || [];
}

function saveWorkers(workers) {
    localStorage.setItem("workers", JSON.stringify(workers));
}

function getApplications() {
    return JSON.parse(
        localStorage.getItem("workerApplications")
    ) || [];
}

function saveApplications(apps) {
    localStorage.setItem(
        "workerApplications",
        JSON.stringify(apps)
    );
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

/* =================================
   MAP
================================= */

let map = L.map("map").setView([9.7392, 118.7353], 12);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

let marker;

/* =================================
   LOAD BOOKINGS
================================= */

function loadBookings() {

    let bookings = getBookings();

const filter =
    document.getElementById("filterService")
    ?.value || "All";

const search =
    document.getElementById("searchBooking")
    ?.value
    ?.toLowerCase() || "";

if (search) {

    bookings = bookings.filter(b =>

        b.name?.toLowerCase().includes(search) ||

        b.phone?.toLowerCase().includes(search) ||

        b.service?.toLowerCase().includes(search)
    );
}

    if (filter !== "All") {
        bookings = bookings.filter(
            b => b.service === filter
        );
    }

    const workers = getWorkers();

    const list =
        document.getElementById("bookingList");

    list.innerHTML = "";

    if (bookings.length === 0) {
        list.innerHTML =
            "<p>No bookings found.</p>";
        return;
    }

    bookings.forEach(b => {

        const availableWorkers = workers.filter(w =>
    w.specialty === b.service &&
    w.availability === "Available"
);


        const workerOptions =
            availableWorkers.map(w => `
                <option
                    value="${w.email}"
                    ${
                        b.assignedWorker === w.email
                        ? "selected"
                        : ""
                    }
                >
                    ${w.name}
                    (${w.availability})
                </option>
            `).join("");

        const div =
            document.createElement("div");

        div.className = "booking-card";

        div.innerHTML = `

            <h3>${b.service}</h3>

            <p><b>Name:</b> ${b.name}</p>
            <p><b>Phone:</b> ${b.phone}</p>
            <p><b>Date:</b> ${b.date}</p>
            <p><b>Time:</b> ${b.time}</p>
            <p><b>Address:</b> ${b.address}</p>

            <p>
                <b>Created:</b>
                ${
                    b.createdAt
                    ? new Date(b.createdAt).toLocaleDateString()
                    : "N/A"
                }
            </p>

            <p>
                <b>Worker:</b>
                ${
                    workers.find(
                        w => w.email === b.assignedWorker
                    )?.name || "Not Assigned"
                }
            </p>

            <p>
                <b>Payment:</b>

                <span class="badge ${String(
                    b.paymentStatus || "Unpaid"
                ).toLowerCase()}">

                    ${b.paymentStatus || "Unpaid"}

                </span>
            </p>

            <p>
                <b>Status:</b>

                <span class="badge ${String(
                    b.status || "Pending"
                ).toLowerCase()}">

                    ${b.status || "Pending"}

                </span>
            </p>

            <p>
                <b>Price:</b>
                ₱${b.totalPrice || 0}
            </p>

            <select id="worker-${b.id}">
                <option value="">
                    Select Worker
                </option>

                ${workerOptions}
            </select>

            <button onclick="assignWorker(${b.id})">
                Assign Worker
            </button>

            <button onclick="showMap(${b.latitude},${b.longitude})">
                📍 Location
            </button>

            <button onclick="markPaid(${b.id})">
                💰 Paid
            </button>

            <button onclick="markDone(${b.id})">
                ✅ Done
            </button>

            <button onclick="deleteBooking(${b.id})">
                ❌ Delete
            </button>

        `;

        list.appendChild(div);
    });
}

/* =================================
   ASSIGN WORKER
================================= */

function assignWorker(id) {

    const select = document.getElementById(`worker-${id}`);
    const workerEmail = select.value;

    if (!workerEmail) {
        alert("Select worker first.");
        return;
    }

    let bookings = getBookings();
    let workers = getWorkers();

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.assignedWorker = workerEmail;
            b.status = "Assigned";

            const worker = workers.find(
                w => w.email === workerEmail
            );

            if (worker) {
                worker.availability = "Busy";
            }
        }

        return b;
    });

    saveBookings(bookings);
    saveWorkers(workers);

    alert("Worker assigned successfully!");

    loadBookings();
    updateDashboard();
}

window.assignWorker = assignWorker;

/* =================================
   MARK PAID
================================= */

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

window.markPaid = markPaid;

/* =================================
   MARK DONE
================================= */

function markDone(id) {

    let bookings = getBookings();
    let workers = getWorkers();

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.status = "Done";

            if (b.assignedWorker) {

                const worker = workers.find(
                    w => w.email === b.assignedWorker
                );

                if (worker) {
                    worker.availability = "Available";
                }
            }
        }

        return b;
    });

    saveBookings(bookings);
    saveWorkers(workers);

    loadBookings();
    updateDashboard();
}

window.markDone = markDone;

/* =================================
   DELETE
================================= */

function deleteBooking(id) {

    let bookings = getBookings();

    bookings =
        bookings.filter(b => b.id !== id);

    saveBookings(bookings);

    loadBookings();
    updateDashboard();
}

window.deleteBooking = deleteBooking;

/* =================================
   MAP
================================= */

function showMap(lat, lng) {

    if (!lat || !lng) {
        alert("Location unavailable.");
        return;
    }

    map.setView([lat, lng], 16);

    if (marker) {
        marker.remove();
    }

    marker =
        L.marker([lat, lng]).addTo(map);
}

window.showMap = showMap;

/* =================================
   WORKER APPLICATIONS
================================= */

function loadWorkerApplications() {

    const container =
        document.getElementById(
            "workerApplications"
        );

    if (!container) return;

    const applications =
        getApplications();

    container.innerHTML = "";

    applications.forEach(app => {

        if (app.status !== "Pending")
            return;

        container.innerHTML += `

            <div class="booking-card">

                <h3>${app.name}</h3>

                <p>Email: ${app.email}</p>

                <p>Phone: ${app.phone}</p>

                <p>Specialty: ${app.specialty}</p>

                <p>${app.experience}</p>

                <button onclick="approveWorker(${app.id})">
                    ✅ Approve
                </button>

                <button onclick="rejectWorker(${app.id})">
                    ❌ Reject
                </button>

            </div>

        `;
    });
}

/* =================================
   APPROVE WORKER
================================= */

function approveWorker(id) {

    const apps =
        getApplications();

    const application =
        apps.find(a => a.id === id);

    if (!application) return;

    let workers = getWorkers();

    workers.push({

        id: Date.now(),

        name: application.name,

        email: application.email,

        password: "worker123",

        specialty: application.specialty,

        availability: "Available"
    });

    saveWorkers(workers);

    let users = getUsers();

    users.push({

        email: application.email,

        password: "worker123",

        role: "worker",

        name: application.name
    });

    saveUsers(users);

    application.status = "Approved";

    saveApplications(apps);

    alert(
        "Worker approved.\nDefault password: worker123"
    );

    loadWorkerApplications();
}

window.approveWorker = approveWorker;

/* =================================
   REJECT WORKER
================================= */

function rejectWorker(id) {

    let apps = getApplications();

    apps = apps.map(a => {

        if (a.id === id) {
            a.status = "Rejected";
        }

        return a;
    });

    saveApplications(apps);

    loadWorkerApplications();
}

window.rejectWorker = rejectWorker;

/* =================================
   DASHBOARD
================================= */

function updateDashboard() {

    const bookings = getBookings();
    const workers = getWorkers();

    const total = bookings.length;

    const pending = bookings.filter(
        b => b.status === "Pending"
    ).length;

    const assigned = bookings.filter(
        b => b.status === "Assigned"
    ).length;

    const completed = bookings.filter(
        b => b.status === "Done"
    ).length;

    const cancelled = bookings.filter(
        b => b.status === "Cancelled"
    ).length;

    const revenue = bookings.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
    );

    const workersCount = workers.length;

    document.getElementById("total").textContent =
        total;

    document.getElementById("pending").textContent =
        pending;

    document.getElementById("completed").textContent =
        completed;

    document.getElementById("revenue").textContent =
        "₱" + revenue;

    document.getElementById("workersCount").textContent =
        workersCount;

    /* CHART DATA */

    const chartPending =
        document.getElementById("chartPending");

    const chartAssigned =
        document.getElementById("chartAssigned");

    const chartDone =
        document.getElementById("chartDone");

    const chartCancelled =
        document.getElementById("chartCancelled");

    if (chartPending)
        chartPending.textContent = pending;

    if (chartAssigned)
        chartAssigned.textContent = assigned;

    if (chartDone)
        chartDone.textContent = completed;

    if (chartCancelled)
        chartCancelled.textContent = cancelled;
}

function goWorkers() {
    window.location.href =
        "../Worker/manage-workers.html";
}

window.goWorkers = goWorkers;

/* =================================
   FILTER
================================= */

window.changeFilter = function () {
    loadBookings();
};

/* =================================
   CHART DATA
================================= */

function generateChartData() {

    const bookings = getBookings();

    const services = {};

    bookings.forEach(b => {

        services[b.service] =
            (services[b.service] || 0) + 1;
    });

    console.log("Chart Data:", services);

    return services;
}


/* =================================
   INIT
================================= */

loadBookings();
loadWorkerApplications();
updateDashboard();

window.addEventListener("storage", () => {

    loadBookings();
    loadWorkerApplications();
    updateDashboard();
});