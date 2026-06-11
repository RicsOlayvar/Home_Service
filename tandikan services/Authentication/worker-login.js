import { loginWorker } from "./worker-auth.js";

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Fill all fields!");
        return;
    }

    const result = loginWorker(email, password);

    if (!result.success) {
        alert(result.message);
        return;
    }

    alert("Login successful!");

    window.location.href = "../worker/worker-dashboard.html";
}

window.loginWorker = login;