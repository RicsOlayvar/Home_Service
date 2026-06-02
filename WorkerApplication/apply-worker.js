const form = document.getElementById("workerForm");

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