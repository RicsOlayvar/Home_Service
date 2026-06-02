import { getUser } from "./auth.js";

const user = getUser();

/* =================================
   ELEMENTS
================================= */

const adminNav = document.getElementById("admin-nav");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");

/* =================================
   UI INIT
================================= */

function initUI() {

    /* -----------------------------
       USER INFO DISPLAY
    ----------------------------- */
    if (user && userInfo) {
        userInfo.textContent = `Hello, ${user.email}`;
    }

    /* -----------------------------
       ADMIN NAV CONTROL
    ----------------------------- */
    if (adminNav) {
        adminNav.style.display =
            (user && user.role === "admin") ? "inline-block" : "none";
    }

    /* -----------------------------
       ADMIN HERO CONTROL (optional section)
    ----------------------------- */
    const adminHero = document.getElementById("admin-hero");

    if (adminHero) {
        adminHero.style.display =
            (user && user.role === "admin") ? "block" : "none";
    }
}

/* =================================
   LOGOUT
================================= */

function setupLogout() {

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("currentUser");

        window.location.href = "../Authentication/login.html";
    });
}

/* =================================
   INIT
================================= */

initUI();
setupLogout();