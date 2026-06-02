/* =================================
   WORKERS STORAGE
================================= */

export function getWorkers() {
    return JSON.parse(localStorage.getItem("workers")) || [];
}

export function saveWorkers(workers) {
    localStorage.setItem("workers", JSON.stringify(workers));
}

/* =================================
   WORKER REGISTRATION
   (Admin creates workers OR signup as worker)
================================= */

export function registerWorker(newWorker) {
    const workers = getWorkers();

    // prevent duplicate email
    const exists = workers.some(w => w.email === newWorker.email);

    if (exists) {
        return { success: false, message: "Worker already exists!" };
    }

    workers.push(newWorker);
    saveWorkers(workers);

    return { success: true };
}

/* =================================
   WORKER LOGIN
================================= */

export function loginWorker(email, password) {
    const workers = getWorkers();

    const worker = workers.find(
        w => w.email === email && w.password === password
    );

    if (!worker) {
        return { success: false, message: "Invalid credentials!" };
    }

    localStorage.setItem("currentWorker", JSON.stringify(worker));

    return { success: true, worker };
}

/* =================================
   SESSION HELPERS
================================= */

export function getWorker() {
    return JSON.parse(localStorage.getItem("currentWorker"));
}

export function logoutWorker() {
    localStorage.removeItem("currentWorker");
}