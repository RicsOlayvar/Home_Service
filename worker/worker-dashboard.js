import { getWorker, logoutWorker } from "./worker-auth.js";

/* =================================
   AUTH CHECK
================================= */

const worker = getWorker();

if (!worker) {
    alert("Please login first!");
    window.location.href = "worker-login.html";
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
   DASHBOARD COUNTERS
================================= */

function updateDashboard() {

    const jobs = getBookings().filter(
        b => b.assignedWorker === worker.email
    );

    const totalJobs = jobs.length;

    const pendingJobs = jobs.filter(
        j => j.status === "Pending"
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

    const pendingEl =
        document.getElementById("pendingJobs");

    const completedEl =
        document.getElementById("completedJobs");

    const cancelledEl =
        document.getElementById("cancelledJobs");

    if (totalEl) totalEl.textContent = totalJobs;
    if (pendingEl) pendingEl.textContent = pendingJobs;
    if (completedEl) completedEl.textContent = completedJobs;
    if (cancelledEl) cancelledEl.textContent = cancelledJobs;
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

            <p><b>Phone:</b> ${job.phone || "N/A"}</p>

            <p><b>Address:</b> ${job.address}</p>

            <p><b>Date:</b> ${job.date}</p>

            <p><b>Time:</b> ${job.time}</p>

            <p><b>Payment:</b>
                ${job.paymentStatus || "Unpaid"}
            </p>

            <p><b>Status:</b>
                ${job.status || "Pending"}
            </p>

            <p><b>Fee:</b>
                ₱${job.totalPrice || 0}
            </p>

            <div class="job-actions">

                ${
                    job.status !== "Done" &&
                    job.status !== "Completed"
                    ? `
                    <button
                        class="done"
                        onclick="markDone(${job.id})">
                        ✅ Done
                    </button>
                    `
                    : ""
                }

                ${
                    job.status !== "Cancelled" &&
                    job.status !== "Done" &&
                    job.status !== "Completed"
                    ? `
                    <button
                        class="cancel"
                        onclick="cancelJob(${job.id})">
                        ❌ Cancel
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
   MARK JOB DONE
================================= */

function markDone(id) {

    let bookings = getBookings();

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.status = "Done";

            b.completedBy = worker.email;

            b.completedAt =
                new Date().toISOString();
        }

        return b;
    });

    saveBookings(bookings);

    alert("Job marked as completed.");

    loadJobs();
    updateDashboard();
}

/* =================================
   CANCEL JOB
================================= */

function cancelJob(id) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this job?"
        );

    if (!confirmCancel) return;

    let bookings = getBookings();

    bookings = bookings.map(b => {

        if (b.id === id) {

            b.status = "Cancelled";

            b.cancelledBy = worker.email;

            b.cancelledAt =
                new Date().toISOString();
        }

        return b;
    });

    saveBookings(bookings);

    alert("Job cancelled.");

    loadJobs();
    updateDashboard();
}

/* =================================
   LOGOUT
================================= */

function logout() {

    logoutWorker();

    alert("Logged out successfully.");

    window.location.href =
        "../homepage/view.html";
}

/* =================================
   SHOW WORKER INFO
================================= */

function loadWorkerInfo() {

    const workerName =
        document.getElementById("workerName");

    const workerService =
        document.getElementById("workerService");

    if (workerName) {
        workerName.textContent =
            worker.email;
    }

    if (workerService) {
        workerService.textContent =
            worker.service || "General Worker";
    }
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

/* =================================
   LIVE SYNC
================================= */

window.addEventListener("storage", () => {
    loadJobs();
    updateDashboard();
});