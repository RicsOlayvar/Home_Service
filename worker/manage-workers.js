/* =================================
   ADMIN CHECK
================================= */

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    alert("Please login first!");
    window.location.href =
        "../Authentication/login.html";
}

if (currentUser.role !== "admin") {
    alert("Admin access only!");
    window.location.href =
        "../homepage/view.html";
}

/* =================================
   STORAGE
================================= */

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
   GO BACK
================================= */

function goAdmin() {
    window.location.href =
        "../Admin/admin.html";
}

window.goAdmin = goAdmin;

/* =================================
   ADD WORKER
================================= */

function addWorker() {

    const name =
        document.getElementById("workerName").value.trim();

    const email =
        document.getElementById("workerEmail").value.trim();

    const password =
        document.getElementById("workerPassword").value.trim();

    const specialty =
        document.getElementById("workerSpecialty").value;

    const availability =
        document.getElementById("workerAvailability").value;

    if (
        !name ||
        !email ||
        !password ||
        !specialty
    ) {
        alert("Please fill all fields.");
        return;
    }

    let workers = getWorkers();

    const exists = workers.some(
        w => w.email === email
    );

    if (exists) {
        alert("Worker already exists.");
        return;
    }

    const worker = {
        id: Date.now(),
        name,
        email,
        password,
        role: "worker",
        specialty,
        availability
    };

    workers.push(worker);

    saveWorkers(workers);

    alert("Worker added successfully!");

    document.getElementById("workerName").value = "";
    document.getElementById("workerEmail").value = "";
    document.getElementById("workerPassword").value = "";

    loadWorkers();
}

window.addWorker = addWorker;

/* =================================
   LOAD WORKERS
================================= */

function loadWorkers() {

    const workers = getWorkers();

    const list =
        document.getElementById("workerList");

    list.innerHTML = "";

    if (workers.length === 0) {

        list.innerHTML =
            "<p>No workers available.</p>";

        return;
    }

    workers.forEach(worker => {

        const div =
            document.createElement("div");

        div.className = "worker-card";

        div.innerHTML = `
            <h3>${worker.name}</h3>

            <p><b>Email:</b> ${worker.email}</p>

            <p><b>Specialty:</b>
            ${worker.specialty}</p>

            <p><b>Availability:</b>
            ${worker.availability}</p>

            <div class="actions">

                <button
                class="available"
                onclick="changeAvailability(
                ${worker.id},
                'Available'
                )">
                Available
                </button>

                <button
                class="busy"
                onclick="changeAvailability(
                ${worker.id},
                'Busy'
                )">
                Busy
                </button>

                <button
                class="leave"
                onclick="changeAvailability(
                ${worker.id},
                'On Leave'
                )">
                On Leave
                </button>

                <button
                class="delete"
                onclick="deleteWorker(
                ${worker.id}
                )">
                Delete
                </button>

            </div>
        `;

        list.appendChild(div);
    });
}

/* =================================
   CHANGE AVAILABILITY
================================= */

function changeAvailability(id, status) {

    let workers = getWorkers();

    workers = workers.map(worker => {

        if (worker.id === id) {
            worker.availability = status;
        }

        return worker;
    });

    saveWorkers(workers);

    loadWorkers();
}

window.changeAvailability =
    changeAvailability;

/* =================================
   DELETE WORKER
================================= */

function deleteWorker(id) {

    if (!confirm(
        "Delete this worker?"
    )) {
        return;
    }

    let workers = getWorkers();

    workers = workers.filter(
        worker => worker.id !== id
    );

    saveWorkers(workers);

    loadWorkers();
}

window.deleteWorker = deleteWorker;

/* =================================
   INIT
================================= */

loadWorkers();