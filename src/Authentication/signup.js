
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

    /* 🚫 prevent duplicate email */
    const exists = users.some(u => u.email === email);

    if (exists) {
        alert("Account already exists!");
        return;
    }

    /* =================================
       ROLE SYSTEM
       - admin (ONLY ONE)
       - worker (can apply later)
       - customer (default)
    ================================= */

    const isAdminEmail = email.toLowerCase() === "admin@gmail.com";

    if (isAdminEmail) {
        const adminExists = users.some(u => u.role === "admin");

        if (adminExists) {
            alert("Admin account already exists!");
            return;
        }
    }

    const newUser = {
        email,
        password,

        // role assignment
        role: isAdminEmail ? "admin" : "user",

        // worker support (future use)
        isWorker: false,
        skills: [],
        available: false
    };

    users.push(newUser);
    saveUsers(users);

    alert("Signup successful!");

    window.location.href = "login.html";
}

/* =================================
   FIX BUTTON ISSUE (SAFE BINDING)
================================= */

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("signupBtn");

    if (btn) {
        btn.addEventListener("click", signup);
    }
});

/* =================================
   OPTIONAL: MAKE GLOBAL ACCESS
================================= */

window.signup = signup;