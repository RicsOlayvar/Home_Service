
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
   DEFAULT ADMIN ACCOUNT
================================= */

const users = getUsers();

const adminExists = users.some(
    user => user.email === "admin@tandikan.com"
);

if (!adminExists) {

    users.push({

        id: Date.now(),

        name: "Admin Lenneth Arenio",

        email: "admin@tandikan.com",

        password: "admin123",

        role: "admin"
    });

    saveUsers(users);
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
   ROLES:
   - admin (ONLY ONE)
   - worker (optional)
   - user (customer default)
================================= */

export function registerUser(newUser) {

    const users = getUsers();

    // default role
    if (!newUser.role) {
        newUser.role = "user";
    }

    /* 🚫 ONLY ONE ADMIN */
    if (newUser.role === "admin") {
        const adminExists = users.some(u => u.role === "admin");

        if (adminExists) {
            return {
                success: false,
                message: "Admin already exists!"
            };
        }
    }

    /* 🚫 ONLY ONE EMAIL */
    const emailExists = users.some(
        u => u.email === newUser.email
    );

    if (emailExists) {
        return {
            success: false,
            message: "Email already registered!"
        };
    }

    /* 👷 WORKER DEFAULT DATA */
    if (newUser.role === "worker") {
        newUser.available = true;
        newUser.assignedJobs = [];
        newUser.skills = newUser.skills || [];
    }

    users.push(newUser);
    saveUsers(users);

    return {
        success: true,
        message: "Registration successful!"
    };
}

/* =================================
   LOGIN USER (ADMIN / USER / WORKER)
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

export function isWorker() {
    const user = getUser();
    return user && user.role === "worker";
}

export function isUser() {
    const user = getUser();
    return user && user.role === "user";
}