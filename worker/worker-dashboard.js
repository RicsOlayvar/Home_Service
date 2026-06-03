import {
    getWorker,
    logoutWorker
} from "../Authentication/worker-auth.js";

/* =================================
   AUTH CHECK
================================= */

const worker = getWorker();

console.log("Current Worker:", worker);

if (!worker) {

    alert("Please login first!");

    window.location.href =
        "../Authentication/worker-login.html";

    throw new Error("Worker not logged in");
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

function getWorkers() {
    return JSON.parse(localStorage.getItem("workers")) || [];
}

function saveWorkers(workers) {
    localStorage.setItem(
        "workers",
        JSON.stringify(workers)
    );
}

/* =================================
   DASHBOARD COUNTERS
================================= */

function updateDashboard() {

    const jobs = getBookings().filter(
        b => b.assignedWorker === worker.email
    );

    const totalJobs = jobs.length;

    const assignedJobs = jobs.filter(
        j => j.status === "Assigned"
    ).length;

    const completedJobs = jobs.filter(
        j =>
            j.status === "Done" ||
            j.status === "Completed"
    ).length;

    const cancelledJobs = jobs.filter(
        j => j.status === "Cancelled"
    ).length;

    const totalEl =
        document.getElementById("totalJobs");

    const assignedEl =
        document.getElementById("assignedJobs");

    const completedEl =
        document.getElementById("completedJobs");

    const cancelledEl =
        document.getElementById("cancelledJobs");

    if (totalEl) totalEl.textContent = totalJobs;

    if (assignedEl) assignedEl.textContent =
        assignedJobs;

    if (completedEl) completedEl.textContent =
        completedJobs;

    if (cancelledEl) cancelledEl.textContent =
        cancelledJobs;

    /* PERFORMANCE SUMMARY */

    const summaryAssigned =
        document.getElementById("summaryAssigned");

    const summaryCompleted =
        document.getElementById("summaryCompleted");

    const summaryCancelled =
        document.getElementById("summaryCancelled");

    if (summaryAssigned) {
        summaryAssigned.textContent =
            assignedJobs;
    }

    if (summaryCompleted) {
        summaryCompleted.textContent =
            completedJobs;
    }

    if (summaryCancelled) {
        summaryCancelled.textContent =
            cancelledJobs;
    }
}

/* =================================
   LOAD ASSIGNED JOBS
================================= */

function loadJobs() {

    const bookings = getBookings().filter(
        b => b.assignedWorker === worker.email
    );

    const container =
        document.getElementById("jobList");

    if (!container) return;

    container.innerHTML = "";

    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="job-card">
                <h3>No Assigned Jobs</h3>
                <p>You currently have no assigned work.</p>
            </div>
        `;

        return;
    }

    bookings.forEach(job => {

        const div = document.createElement("div");

        div.className = "job-card";

        div.innerHTML = `

            <h3>${job.service}</h3>

            <p><b>Customer:</b> ${job.name}</p>

            <p><b>Phone:</b>
                ${job.phone || "N/A"}
            </p>

            <p><b>Address:</b>
                ${job.address}
            </p>

            <p><b>Date:</b>
                ${job.date}
            </p>

            <p><b>Time:</b>
                ${job.time}
            </p>

            <p><b>Payment:</b>
                ${job.paymentStatus || "Unpaid"}
            </p>

            <p><b>Status:</b>
                ${job.status || "Assigned"}
            </p>

            <p><b>Service Fee:</b>
                ₱${job.totalPrice || 0}
            </p>

            <div class="job-actions">

                ${
                    job.status === "Assigned"
                    ? `
                    <button
                        class="done"
                        onclick="markDone(${job.id})">
                        ✅ Complete Job
                    </button>

                    <button
                        class="cancel"
                        onclick="cancelJob(${job.id})">
                        ❌ Cancel Job
                    </button>
                    `
                    : ""
                }

            </div>
        `;

        container.appendChild(div);
    });
}

/* =================================
   COMPLETE JOB
================================= */

function markDone(id) {

    let bookings = getBookings();
    let workers = getWorkers();

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.status = "Done";

            b.completedBy = worker.email;

            b.completedAt =
                new Date().toLocaleString();

            const assignedWorker =
                workers.find(
                    w => w.email === worker.email
                );

            if (assignedWorker) {
                assignedWorker.availability =
                    "Available";
                localStorage.setItem(
                    "currentWorker",
                    JSON.stringify(assignedWorker)
                );
            }
        }

        return b;
    });

    saveBookings(bookings);
    saveWorkers(workers);

    alert("Job completed successfully.");

    loadJobs();
    updateDashboard();
}

/* =================================
   CANCEL JOB
================================= */

function cancelJob(id) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this job?"
    );

    if (!confirmCancel) return;

    let bookings = getBookings();
    let workers = getWorkers();

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.status = "Cancelled";

            b.cancelledBy = worker.email;

            b.cancelledAt =
                new Date().toLocaleString();

            const assignedWorker =
                workers.find(
                    w => w.email === worker.email
                );

            if (assignedWorker) {
                assignedWorker.availability =
                    "Available";
                localStorage.setItem(
                    "currentWorker",
                    JSON.stringify(assignedWorker)
                );
            }
        }

        return b;
    });

    saveBookings(bookings);
    saveWorkers(workers);

    alert("Job cancelled.");

    loadJobs();
    updateDashboard();
}

/* =================================
   LOGOUT
================================= */

function logout() {

    localStorage.removeItem("currentWorker");

    logoutWorker();

    alert("Logged out successfully.");

    window.location.href =
        "../Authentication/worker-login.html";
}

/* =================================
   WORKER INFO
================================= */

function loadWorkerInfo() {

    const workers = getWorkers();

    const currentWorker =
        workers.find(
            w => w.email === worker.email
        ) || worker;

    const jobs = getBookings().filter(
        b => b.assignedWorker === currentWorker.email
    );

    const completedJobs = jobs.filter(
        j =>
            j.status === "Done" ||
            j.status === "Completed"
    ).length;

    document.getElementById("workerName").textContent =
        currentWorker.name ||
        "Unknown Worker";

    document.getElementById("workerEmail").textContent =
        currentWorker.email ||
        "No Email";

    document.getElementById("workerService").textContent =
        currentWorker.specialty ||
        "General Worker";

    document.getElementById("workerCompleted").textContent =
        completedJobs;

    const availability =
        currentWorker.availability ||
        "Available";

    document.getElementById(
        "workerAvailability"
    ).innerHTML = `

        <span class="badge ${
            availability === "Busy"
                ? "busy"
                : availability === "On Leave"
                ? "leave"
                : "available"
        }">

            ${availability}

        </span>
    `;
}

/* =================================
   GLOBALS
================================= */

window.markDone = markDone;
window.cancelJob = cancelJob;
window.logout = logout;

/* =================================
   INIT
================================= */

loadWorkerInfo();
loadJobs();
updateDashboard();

window.addEventListener("storage", () => {

    loadWorkerInfo();
    loadJobs();
    updateDashboard();

});

/* =================================
   LIVE SYNC
================================= */

window.addEventListener("storage", () => {

    loadJobs();
    updateDashboard();

});