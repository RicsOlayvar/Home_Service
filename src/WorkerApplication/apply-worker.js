const form = document.getElementById("workerForm");

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

const currentWorker =
    JSON.parse(
        localStorage.getItem("currentWorker")
    );

/* NOT LOGGED IN */

if (!currentUser && !currentWorker) {

    alert("Please login first.");

    window.location.href =
        "../Authentication/login.html";
}

/* ADMIN CANNOT APPLY */

if (
    currentUser &&
    currentUser.role === "admin"
) {

    alert(
        "Administrators cannot apply as workers."
    );

    window.location.href =
        "../homepage/view.html";
}

/* EXISTING WORKERS CANNOT REAPPLY */

if (currentWorker) {

    alert(
        "You already have a worker account."
    );

    window.location.href =
        "../Worker/worker-dashboard.html";
}


if (!currentUser) {

    alert("Please login first.");

    window.location.href =
        "../Authentication/login.html";
}

function getApplications() {
    return JSON.parse(
        localStorage.getItem("workerApplications")
    ) || [];
}

function saveApplications(applications) {
    localStorage.setItem(
        "workerApplications",
        JSON.stringify(applications)
    );
}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name =
        document.getElementById("name")
        .value
        .trim();

    const email =
        document.getElementById("email")
        .value
        .trim();

    const phone =
        document.getElementById("phone")
        .value
        .trim();

    const specialty =
        document.getElementById("specialty")
        .value;

    const experience =
        document.getElementById("experience")
        .value
        .trim();

    let applications = getApplications();

    const alreadyApplied =
        applications.some(
            a =>
                a.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (alreadyApplied) {

        alert(
            "You already submitted an application."
        );

        return;
    }

    const application = {

        id: Date.now(),

        name,

        email,

        phone,

        specialty,

        experience,

        status: "Pending",

        createdAt:
            new Date().toISOString()
    };

    applications.push(application);

    saveApplications(applications);

    alert(
        "Application submitted successfully!\n\nPlease wait for admin approval."
    );

    form.reset();

    window.location.href =
        "../homepage/view.html";
});