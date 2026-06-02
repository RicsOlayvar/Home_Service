import { getUser } from "./auth.js";

const user = getUser();

/* ================================= */
/* ELEMENTS */
/* ================================= */

const adminNav = document.getElementById("admin-nav");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");

/* ================================= */
/* IF USER LOGGED IN */
/* ================================= */

if (user) {

    // show username
    if (userInfo) {
        userInfo.textContent = `Hello, ${user.email}`;
    }

    // SHOW ADMIN LINK ONLY FOR ADMIN
    if (user.role === "admin") {
        if (adminNav) adminNav.style.display = "inline-block";
    } else {
        if (adminNav) adminNav.style.display = "none";
    }

} else {
    // no user
    if (adminNav) adminNav.style.display = "none";
}

/* ================================= */
/* LOGOUT */
/* ================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("currentUser");

        window.location.href = "../Authentication/login.html";
    });
}

const adminHero = document.getElementById("admin-hero");

if (!user || user.role !== "admin") {
    if (adminHero) adminHero.style.display = "none";
}