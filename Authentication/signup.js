
/* =================================
   USERS STORAGE
================================= */

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

/* =================================
   SIGNUP FUNCTION
================================= */

function signup() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    let users = getUsers();

    // 🚫 prevent duplicate email
    const exists = users.some(u => u.email === email);

    if (exists) {
        alert("Account already exists!");
        return;
    }

    // 🚫 OPTIONAL SAFETY: block extra admin creation
    const isAdminEmail = email.toLowerCase() === "admin@gmail.com";

    if (isAdminEmail) {
        const adminExists = users.some(u => u.role === "admin");

        if (adminExists) {
            alert("Admin account already exists!");
            return;
        }
    }

    // default role = customer
    const newUser = {
        email,
        password,
        role: isAdminEmail ? "admin" : "customer"
    };

    users.push(newUser);
    saveUsers(users);

    alert("Signup successful!");

    window.location.href = "login.html";
}

/* =================================
   FIX: WAIT FOR DOM LOAD (IMPORTANT)
   This fixes your "button does nothing"
================================= */

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("signupBtn");

    if (btn) {
        btn.addEventListener("click", signup);
    }
});