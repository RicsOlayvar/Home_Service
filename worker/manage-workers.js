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

    return JSON.parse(
        localStorage.getItem("workers")
    ) || [];
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
        document.getElementById(
            "workerName"
        ).value.trim();

    const email =
        document.getElementById(
            "workerEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "workerPassword"
        ).value.trim();

    const specialty =
        document.getElementById(
            "workerSpecialty"
        ).value;

    const availability =
        document.getElementById(
            "workerAvailability"
        ).value;

    if (
        !name ||
        !email ||
        !password ||
        !specialty
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }

    let workers = getWorkers();

    const exists = workers.some(
        w => w.email === email
    );

    if (exists) {

        alert(
            "Worker already exists."
        );

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

    /* ADD TO USERS */

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    users.push({

        email,

        password,

        role: "worker",

        name
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert(
        "Worker added successfully!"
    );

    document.getElementById(
        "workerName"
    ).value = "";

    document.getElementById(
        "workerEmail"
    ).value = "";

    document.getElementById(
        "workerPassword"
    ).value = "";

    loadWorkers();
}

window.addWorker = addWorker;

/* =================================
   LOAD WORKERS
================================= */

function loadWorkers() {

    let workers = getWorkers();

    const search =
        document.getElementById(
            "searchWorker"
        )?.value
        ?.toLowerCase() || "";

    const availabilityFilter =
        document.getElementById(
            "filterAvailability"
        )?.value || "All";

    if (search) {

        workers = workers.filter(w =>

            w.name
                ?.toLowerCase()
                .includes(search)

            ||

            w.email
                ?.toLowerCase()
                .includes(search)

            ||

            w.specialty
                ?.toLowerCase()
                .includes(search)
        );
    }

    if (
        availabilityFilter !== "All"
    ) {

        workers = workers.filter(
            w =>
                w.availability ===
                availabilityFilter
        );
    }

    updateSummary();

    const list =
        document.getElementById(
            "workerList"
        );

    list.innerHTML = "";

    if (workers.length === 0) {

        list.innerHTML =
            "<p>No workers found.</p>";

        return;
    }

    workers.forEach(worker => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "worker-card";

        div.innerHTML = `

            <h3>
                ${worker.name}
            </h3>

            <p>
                <b>Email:</b>
                ${worker.email}
            </p>

            <p>
                <b>Specialty:</b>
                ${worker.specialty}
            </p>

            <p>
                <b>Availability:</b>
                ${worker.availability}
            </p>

            <div class="actions">

                <button
                    class="available"
                    onclick="
                    changeAvailability(
                    ${worker.id},
                    'Available'
                    )">
                    Available
                </button>

                <button
                    class="busy"
                    onclick="
                    changeAvailability(
                    ${worker.id},
                    'Busy'
                    )">
                    Busy
                </button>

                <button
                    class="leave"
                    onclick="
                    changeAvailability(
                    ${worker.id},
                    'On Leave'
                    )">
                    On Leave
                </button>

                <button
                    onclick="
                    openEditModal(
                    ${worker.id}
                    )">
                    ✏️ Edit
                </button>

                <button
                    class="delete"
                    onclick="
                    deleteWorker(
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
   SUMMARY
================================= */

function updateSummary() {

    const workers =
        getWorkers();

    document.getElementById(
        "totalWorkers"
    ).textContent =
        workers.length;

    document.getElementById(
        "availableWorkers"
    ).textContent =
        workers.filter(
            w =>
                w.availability ===
                "Available"
        ).length;

    document.getElementById(
        "busyWorkers"
    ).textContent =
        workers.filter(
            w =>
                w.availability ===
                "Busy"
        ).length;

    document.getElementById(
        "leaveWorkers"
    ).textContent =
        workers.filter(
            w =>
                w.availability ===
                "On Leave"
        ).length;
}

/* =================================
   CHANGE AVAILABILITY
================================= */

function changeAvailability(
    id,
    status
) {

    let workers =
        getWorkers();

    workers = workers.map(
        worker => {

            if (
                worker.id === id
            ) {

                worker.availability =
                    status;
            }

            return worker;
        }
    );

    saveWorkers(workers);

    loadWorkers();
}

window.changeAvailability =
    changeAvailability;

/* =================================
   OPEN EDIT MODAL
================================= */

function openEditModal(id) {

    const worker =
        getWorkers().find(
            w => w.id === id
        );

    if (!worker) return;

    document.getElementById(
        "editWorkerId"
    ).value = worker.id;

    document.getElementById(
        "editName"
    ).value = worker.name;

    document.getElementById(
        "editEmail"
    ).value = worker.email;

    document.getElementById(
        "editPassword"
    ).value = worker.password;

    document.getElementById(
        "editSpecialty"
    ).value = worker.specialty;

    document.getElementById(
        "editAvailability"
    ).value =
        worker.availability;

    document.getElementById(
        "editModal"
    ).style.display =
        "flex";
}

window.openEditModal =
    openEditModal;

/* =================================
   SAVE EDIT
================================= */

function saveWorkerEdit() {

    const id =
        Number(
            document.getElementById(
                "editWorkerId"
            ).value
        );

    let workers =
        getWorkers();

    const worker =
        workers.find(
            w => w.id === id
        );

    if (!worker) return;

    const oldEmail =
        worker.email;

    worker.name =
        document.getElementById(
            "editName"
        ).value;

    worker.email =
        document.getElementById(
            "editEmail"
        ).value;

    worker.password =
        document.getElementById(
            "editPassword"
        ).value;

    worker.specialty =
        document.getElementById(
            "editSpecialty"
        ).value;

    worker.availability =
        document.getElementById(
            "editAvailability"
        ).value;

    saveWorkers(workers);

    /* UPDATE USERS */

    let users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

    users = users.map(u => {

        if (
            u.role === "worker" &&
            u.email === oldEmail
        ) {

            u.name =
                worker.name;

            u.email =
                worker.email;

            u.password =
                worker.password;
        }

        return u;
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    closeModal();

    loadWorkers();

    alert(
        "Worker updated successfully!"
    );
}

window.saveWorkerEdit =
    saveWorkerEdit;

/* =================================
   CLOSE MODAL
================================= */

function closeModal() {

    document.getElementById(
        "editModal"
    ).style.display =
        "none";
}

window.closeModal =
    closeModal;

/* =================================
   DELETE WORKER
================================= */

function deleteWorker(id) {

    if (
        !confirm(
            "Delete this worker?"
        )
    ) {
        return;
    }

    let workers =
        getWorkers();

    const worker =
        workers.find(
            w => w.id === id
        );

    workers = workers.filter(
        w => w.id !== id
    );

    saveWorkers(workers);

    /* DELETE USER */

    let users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

    users = users.filter(
        u =>
            u.email !==
            worker.email
    );

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    loadWorkers();
}

window.deleteWorker =
    deleteWorker;

/* =================================
   INIT
================================= */

loadWorkers();
updateSummary();