// AUTH SYSTEM (LOCAL STORAGE)

export function login(email, role) {
    const user = {
        email,
        role // "admin" | "user"
    };

    localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem("user");
    window.location.href = "../Authentication/login.html";
}

export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

export function isAdmin() {
    const user = getUser();
    return user && user.role === "admin";
}