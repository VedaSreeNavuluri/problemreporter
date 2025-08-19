document.getElementById("save-problem").addEventListener("click", function () {
    const title = document.getElementById("problem-title").value.trim();
    const location = document.getElementById("problem-location").value.trim();
    const category = document.getElementById("problem-category").value;
    const description = document.getElementById("problem-description").value.trim();

    if (!title || !location || !category || !description) {
        alert("Please fill all fields.");
        return;
    }

    // Get existing problems from localStorage or empty array
    let problems = JSON.parse(localStorage.getItem("problems")) || [];

    // Create new problem object
    let newProblem = {
        id: Date.now(),   // unique id
        title,
        location,
        category,
        description,
        status: "unresolved",
        time: new Date().toISOString()
    };

    // Add new problem to array
    problems.push(newProblem);

    // Save updated array back to localStorage
    localStorage.setItem("problems", JSON.stringify(problems));

    alert("Problem reported successfully!");

    // Optionally clear form fields
    document.getElementById("problem-title").value = "";
    document.getElementById("problem-location").value = "";
    document.getElementById("problem-category").value = "";
    document.getElementById("problem-description").value = "";

    // Redirect back to main page or show a message
    window.location.href = "index.html"; // or your main page filename
});

function loadProblems() {
    const problems = JSON.parse(localStorage.getItem("problems")) || [];
    const problemsSection = document.querySelector(".problems-section");

    // Remove previously rendered problems, keep the heading only
    problemsSection.querySelectorAll(".problem-card").forEach(card => card.remove());

    problems.forEach(problem => {
        const card = document.createElement("div");
        card.classList.add("problem-card", problem.category);

        card.innerHTML = `
            <img src="../Assets/default.jpg" alt="${problem.category} Image" />
            <div class="problem-info">
                <h3>${problem.title} <span class="status ${problem.status}">${capitalize(problem.status)}</span></h3>
                <p>${problem.description}</p>
                <small>📍 ${problem.location} • ${timeAgo(problem.time)}</small>
            </div>
        `;

        // Status click toggles status and updates storage
        card.querySelector(".status").addEventListener("click", () => {
            if (problem.status === "unresolved") problem.status = "in-progress";
            else if (problem.status === "in-progress") problem.status = "resolved";
            else problem.status = "unresolved";

            localStorage.setItem("problems", JSON.stringify(problems));
            loadProblems(); // Refresh display
        });

        problemsSection.appendChild(card);
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).replace("-", " ");
}

function timeAgo(timeISO) {
    const now = new Date();
    const time = new Date(timeISO);
    const diffMs = now - time;

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";

    const days = Math.floor(hours / 24);
    return days + "d ago";
}

window.addEventListener("DOMContentLoaded", loadProblems);
