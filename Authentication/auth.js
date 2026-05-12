// ==========================
// FIREBASE IMPORTS
// ==========================
console.log("auth.js loaded successfully");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ==========================
// CONFIG
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyCyv0hbE6DVNjVbtfZmq0r-Jy7Z2puz2KM",
  authDomain: "tandikan-services.firebaseapp.com",
  projectId: "tandikan-services",
  storageBucket: "tandikan-services.firebasestorage.app",
  messagingSenderId: "523415703318",
  appId: "1:523415703318:web:0591eec9f683316bd38a37",
  measurementId: "G-F4R0DK6PB5"
};

// ==========================
// INIT FIREBASE
// ==========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================
// DETECT CURRENT PAGE
// ==========================
const path = window.location.pathname;

// ==========================
// SIGNUP HANDLER
// ==========================
const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Account created successfully!");
                window.location.href = "login.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// ==========================
// LOGIN HANDLER
// ==========================
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Login successful!");
                window.location.href = "../homepage/view.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// ==========================
// SHOW USER ON HOMEPAGE
// ==========================
onAuthStateChanged(auth, (user) => {
    const userDisplay = document.getElementById("user-info");

    if (user && userDisplay) {
        userDisplay.textContent = "Welcome, " + user.email;
    }
});

// ==========================
// PROTECT BOOKING PAGE
// ==========================
if (path.includes("booking")) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert("Please login first!");
            window.location.href = "../Authentication/login.html";
        }
    });
}

// ==========================
// LOGOUT
// ==========================
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            alert("Logged out!");
            window.location.href = "../homepage/view.html";
        });
    });
}