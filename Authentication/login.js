/* =================================
   GET USERS
================================= */

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
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

    const users = getUsers();

    const user = users.find(u =>
        u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    // Save session
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Login successful!");

    // ROLE REDIRECT
    if (user.role === "admin") {
        window.location.href = "../Admin/admin.html";
    } else {
        window.location.href = "../Home/view.html";
    }
}

/* =================================
   MAKE FUNCTION GLOBAL
================================= */

window.login = login;