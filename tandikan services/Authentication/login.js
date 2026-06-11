/* =================================
   USERS STORAGE
================================= */

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function getWorkers() {
    return JSON.parse(localStorage.getItem("workers")) || [];
}

/* =================================
   LOGIN FUNCTION
================================= */

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    /* =================================
       CHECK CUSTOMER / ADMIN USERS
    ================================= */

    const users = getUsers();

    let account = users.find(u =>
        u.email === email &&
        u.password === password
    );

    /* =================================
       CHECK WORKERS
    ================================= */

    if (!account) {

        const workers = getWorkers();

        account = workers.find(w =>
            w.email === email &&
            w.password === password
        );
    }

    /* =================================
       INVALID LOGIN
    ================================= */

    if (!account) {
        alert("Invalid email or password!");
        return;
    }

    /* =================================
       SAVE SESSION
    ================================= */

    localStorage.setItem(
        "currentUser",
        JSON.stringify(account)
    );

    alert("Login successful!");

    /* =================================
       ROLE REDIRECT SYSTEM
    ================================= */

    switch (account.role) {

        case "admin":
            window.location.href =
                "../Admin/admin.html";
            break;

        case "worker":
            window.location.href =
                "../worker/worker-dashboard.html";
            break;

        case "customer":
        case "user":
        default:
            window.location.href =
                "../homepage/view.html";
            break;
    }
}

/* =================================
   ENTER KEY SUPPORT
================================= */

document.addEventListener("DOMContentLoaded", () => {

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");

    if (email) {
        email.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                login();
            }
        });
    }

    if (password) {
        password.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                login();
            }
        });
    }
});

/* =================================
   GLOBAL
================================= */

window.login = login;