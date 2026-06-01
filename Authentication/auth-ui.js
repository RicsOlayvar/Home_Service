import { getUser, logout } from "./auth.js";

const user = getUser();

const userInfo = document.getElementById("user-info");
const adminNav = document.getElementById("admin-nav");

// SHOW USER
if (user) {
    userInfo.textContent = `${user.email} (${user.role})`;
}

// LOGOUT
document.getElementById("logout-btn").addEventListener("click", logout);

// HIDE ADMIN IF NOT ADMIN
if (!user || user.role !== "admin") {
    if (adminNav) adminNav.style.display = "none";
}