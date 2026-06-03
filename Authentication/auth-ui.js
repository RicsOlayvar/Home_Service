import { getUser } from "./auth.js";

/* =================================
   CURRENT ACCOUNTS
================================= */

const user = getUser();

const worker =
    JSON.parse(
        localStorage.getItem("currentWorker")
    );

/* =================================
   ELEMENTS
================================= */

const adminNav =
    document.getElementById("admin-nav");

const workerNav =
    document.getElementById("worker-nav");

const adminHero =
    document.getElementById("admin-hero");

const workerHero =
    document.getElementById("worker-hero");

const userInfo =
    document.getElementById("user-info");

const logoutBtn =
    document.getElementById("logout-btn");

const loginLink =
    document.getElementById("login-link");

/* =================================
   UI INIT
================================= */

function initUI() {

    const applyWorkerLink =
    document.getElementById("apply-worker-link");

    /* -----------------------------
       CUSTOMER LOGIN
    ----------------------------- */

    if (user) {

        if (userInfo) {

            userInfo.textContent =
                `Hello, ${user.name || user.email}`;
        }

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (logoutBtn) {
            logoutBtn.style.display =
                "inline-block";
        }

        if (
            adminNav &&
            user.role === "admin"
        ) {

            adminNav.style.display =
                "inline-block";
        }

        if (
            adminHero &&
            user.role === "admin"
        ) {

            adminHero.style.display =
                "inline-block";
        }
    }

    /* -----------------------------
       WORKER LOGIN
    ----------------------------- */

    if (worker) {

        if (userInfo) {

            userInfo.textContent =
                `👷 ${worker.name || worker.email}`;
        }

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (logoutBtn) {
            logoutBtn.style.display =
                "inline-block";
        }

        if (workerNav) {
            workerNav.style.display =
                "inline-block";
        }

        if (workerHero) {
            workerHero.style.display =
                "inline-block";
        }
    }

    /* -----------------------------
       NO LOGIN
    ----------------------------- */

    if (!user && !worker) {

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }

        if (loginLink) {
            loginLink.style.display =
                "inline-block";
        }

        if (userInfo) {
            userInfo.textContent = "";
        }
    }
}

/* =================================
   LOGOUT
================================= */

function setupLogout() {

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "currentWorker"
        );

        alert(
            "Logged out successfully!"
        );

        window.location.href =
            "../homepage/view.html";
    });
}

/* =================================
   PROTECTED LINKS
================================= */

const bookLink =
    document.getElementById("book-link");

const historyLink =
    document.getElementById("history-link");

const applyWorkerLink =
    document.getElementById("apply-worker-link");

function requireLogin(event) {

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    const currentWorker =
        JSON.parse(
            localStorage.getItem("currentWorker")
        );

    if (!currentUser && !currentWorker) {

        event.preventDefault();

        alert("Please login first.");

        window.location.href =
            "../Authentication/login.html";

        return;
    }

    /* APPLY AS WORKER = CUSTOMER ONLY */

    if (
        event.currentTarget.id ===
        "apply-worker-link"
    ) {

        if (currentWorker) {

            event.preventDefault();

            alert(
                "Workers cannot apply as workers."
            );
        }

        if (
            currentUser &&
            currentUser.role === "admin"
        ) {

            event.preventDefault();

            alert(
                "Admins cannot apply as workers."
            );
        }
    }
}

if (bookLink) {
    bookLink.addEventListener(
        "click",
        requireLogin
    );
}

if (historyLink) {
    historyLink.addEventListener(
        "click",
        requireLogin
    );
}

if (applyWorkerLink) {
    applyWorkerLink.addEventListener(
        "click",
        requireLogin
    );
}

/* =================================
   INIT
================================= */

initUI();
setupLogout();