// auth.js

/* =================================
   USERS STORAGE
================================= */

export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

/* =================================
   CURRENT USER SESSION
================================= */

export function getUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

export function logoutUser() {
    localStorage.removeItem("currentUser");
}

/* =================================
   REGISTER USER (SIGNUP)
   - multiple customers allowed
   - ONLY ONE admin allowed
   - no duplicate emails
================================= */

export function registerUser(newUser) {
    const users = getUsers();

    // Ensure role exists
    if (!newUser.role) {
        newUser.role = "user";
    }

    // 🚫 Only ONE admin allowed
    if (newUser.role === "admin") {
        const adminExists = users.some(u => u.role === "admin");

        if (adminExists) {
            return {
                success: false,
                message: "Admin account already exists!"
            };
        }
    }

    // 🚫 Prevent duplicate email
    const emailExists = users.some(
        u => u.email === newUser.email
    );

    if (emailExists) {
        return {
            success: false,
            message: "Email already registered!"
        };
    }

    users.push(newUser);
    saveUsers(users);

    return {
        success: true,
        message: "Registration successful!"
    };
}

/* =================================
   LOGIN USER
   - checks email + password
   - stores session
================================= */

export function loginUser(email, password) {
    const users = getUsers();

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password!"
        };
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    return {
        success: true,
        user
    };
}

/* =================================
   ROLE HELPERS
================================= */

export function isAdmin() {
    const user = getUser();
    return user && user.role === "admin";
}

export function isUser() {
    const user = getUser();
    return user && user.role === "user";
}