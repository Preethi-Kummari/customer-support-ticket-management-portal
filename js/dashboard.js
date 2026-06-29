// Global Variables

let tickets = [];
let activities = [];
let chart;

// Load Dashboard

async function loadDashboard() {

    try {

        tickets = await getTickets();

        loadDashboardCounts();

        loadRecentTickets();

        loadActivities();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load dashboard.");

    }

}

// Dashboard Counts

function loadDashboardCounts() {

    const total = tickets.length;

    const open = tickets.filter(ticket =>
        ticket.status === "Open").length;

    const progress = tickets.filter(ticket =>
        ticket.status === "In Progress").length;

    const closed = tickets.filter(ticket =>
        ticket.status === "Closed").length;

    document.getElementById("totalTickets").innerText = total;
    document.getElementById("openTickets").innerText = open;
    document.getElementById("progressTickets").innerText = progress;
    document.getElementById("closedTickets").innerText = closed;

    loadChart(open, progress, closed);

}

// Chart

function loadChart(open, progress, closed) {

    const ctx = document.getElementById("ticketChart");

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Open",
                "In Progress",
                "Closed"

            ],

            datasets: [{

                data: [

                    open,
                    progress,
                    closed

                ],

                backgroundColor: [

                    "#dc3545",
                    "#ffc107",
                    "#198754"

                ]

            }]

        }

    });

}

// Recent Activity

function loadActivities() {

    const activityList = document.getElementById("activityList");

    if (!activityList) return;

    const activities =
        JSON.parse(localStorage.getItem("activities")) || [];

    activityList.innerHTML = "";

    if (activities.length === 0) {

        activityList.innerHTML = `
            <li class="list-group-item text-center">
                No Recent Activity
            </li>
        `;

        return;

    }

    activities.slice(0, 5).forEach(activity => {

        activityList.innerHTML += `
            <li class="list-group-item">
                ${activity}
            </li>
        `;

    });

}

// Recent Tickets

function loadRecentTickets(sortType = "latest") {

    const table =
        document.getElementById("recentTickets");

    if (!table) return;

    table.innerHTML = "";

    let recent = [...tickets];

    // Sorting

    if (sortType === "customer") {

        recent.sort((a, b) =>

            a.customer.localeCompare(b.customer)

        );

    }

    else if (sortType === "oldest") {

        recent.sort((a, b) =>

            Number(a.id) - Number(b.id)

        );

    }

    else {

        recent.sort((a, b) =>

            Number(b.id) - Number(a.id)

        );

    }

    recent = recent.slice(0, 5);

    if (recent.length === 0) {

        table.innerHTML =

            `<tr>

                <td colspan="5"
                    class="text-center">

                    No Tickets Available

                </td>

            </tr>`;

        return;

    }

    recent.forEach(ticket => {

        let priorityBadge = "";

        if (ticket.priority === "High") {

            priorityBadge =

                `<span class="badge bg-danger">

                    High

                </span>`;

        }

        else if (ticket.priority === "Medium") {

            priorityBadge =

                `<span class="badge bg-warning text-dark">

                    Medium

                </span>`;

        }

        else {

            priorityBadge =

                `<span class="badge bg-success">

                    Low

                </span>`;

        }

        let statusBadge = "";

        if (ticket.status === "Open") {

            statusBadge =

                `<span class="badge bg-danger">

                    Open

                </span>`;

        }

        else if (ticket.status === "In Progress") {

            statusBadge =

                `<span class="badge bg-warning text-dark">

                    In Progress

                </span>`;

        }

        else {

            statusBadge =

                `<span class="badge bg-success">

                    Closed

                </span>`;

        }

        table.innerHTML +=

            `<tr>

                <td>${ticket.id}</td>

                <td>${ticket.customer}</td>

                <td>${ticket.subject}</td>

                <td>${priorityBadge}</td>

                <td>${statusBadge}</td>

            </tr>`;

    });

}

// Sorting

const sortDropdown =
document.getElementById("sortTickets");

if (sortDropdown) {

    sortDropdown.addEventListener("change", function () {

        loadRecentTickets(this.value);

    });

}

// Network Status

window.addEventListener("offline", () => {

    alert("Internet connection lost.");

});

window.addEventListener("online", () => {

    alert("Connection restored.");

});

// Initial Load

loadDashboard();
