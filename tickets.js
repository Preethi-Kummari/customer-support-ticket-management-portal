// Get Elements

const ticketTable = document.getElementById("ticketTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortTickets = document.getElementById("sortTickets");
const pagination = document.getElementById("pagination");
const spinner = document.getElementById("spinner");
const emptyState = document.getElementById("emptyState");

// Variables

let tickets = [];

let currentPage = 1;

const rowsPerPage = 5;

// Load Tickets

async function loadTickets() {

    spinner.classList.remove("d-none");

    tickets = await getTickets();

    console.log("Tickets:", tickets);

    spinner.classList.add("d-none");

    renderTable();

}

// Render Table

function renderTable() {

    let filteredTickets = [...tickets];

    // Search

    const search = searchInput.value.toLowerCase();

    filteredTickets = filteredTickets.filter(ticket =>

        ticket.customer.toLowerCase().includes(search) ||

        ticket.subject.toLowerCase().includes(search) ||

        ticket.email.toLowerCase().includes(search)

    );

    // Status Filter

    if (statusFilter.value !== "All") {

        filteredTickets = filteredTickets.filter(ticket =>

            ticket.status === statusFilter.value

        );

    }

    // Sorting

    if (sortTickets.value === "customer") {

        filteredTickets.sort((a, b) =>

            a.customer.localeCompare(b.customer)

        );

    }

    else if (sortTickets.value === "oldest") {

        filteredTickets.sort((a, b) =>

            Number(a.id) - Number(b.id)

        );

    }

    else {

        filteredTickets.sort((a, b) =>

            Number(b.id) - Number(a.id)

        );

    }

    // Empty State

    if (filteredTickets.length === 0) {

        ticketTable.innerHTML = `

        <tr>

            <td colspan="8" class="text-center">

                No Tickets Available

            </td>

        </tr>

        `;

        emptyState.classList.remove("d-none");

        pagination.innerHTML = "";

        return;

    }

    emptyState.classList.add("d-none");

    // Pagination

    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    const paginatedTickets = filteredTickets.slice(start, end);

    ticketTable.innerHTML = "";

    // Display Tickets

    paginatedTickets.forEach(ticket => {

        let priorityBadge = "success";

        if (ticket.priority === "Medium") {

            priorityBadge = "warning";

        }

        else if (ticket.priority === "High") {

            priorityBadge = "danger";

        }

        let statusBadge = "secondary";

        if (ticket.status === "Open") {

            statusBadge = "danger";

        }

        else if (ticket.status === "In Progress") {

            statusBadge = "warning";

        }

        else {

            statusBadge = "success";

        }

        ticketTable.innerHTML += `

        <tr>

            <td>${ticket.id}</td>

            <td>${ticket.customer}</td>

            <td>${ticket.email}</td>

            <td>${ticket.subject}</td>

            <td>

                <span class="badge bg-${priorityBadge}">

                    ${ticket.priority}

                </span>

            </td>

            <td>

                <span class="badge bg-${statusBadge}">

                    ${ticket.status}

                </span>

            </td>

            <td>${ticket.createdDate}</td>

            <td>

                <a href="ticket-details.html?id=${ticket.id}"

                class="btn btn-info btn-sm">

                View

                </a>

                <a href="edit-ticket.html?id=${ticket.id}"

                class="btn btn-warning btn-sm">

                Edit

                </a>

                <button

                class="btn btn-danger btn-sm"

                onclick="deleteTicketHandler('${ticket.id}')">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

    renderPagination(filteredTickets.length);

}

// Pagination

function renderPagination(totalRows) {

    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

        <li class="page-item ${currentPage === i ? "active" : ""}">

            <a class="page-link"

               href="#"

               onclick="changePage(${i})">

               ${i}

            </a>

        </li>

        `;

    }

}

// Change Page

function changePage(page) {

    currentPage = page;

    renderTable();

}

// Delete Ticket

async function deleteTicketHandler(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    spinner.classList.remove("d-none");

    const deleted = await deleteTicket(id);

    spinner.classList.add("d-none");

    if (deleted) {

        alert("Ticket deleted successfully.");

        loadTickets();

    }

}

// Search

searchInput.addEventListener("keyup", () => {

    currentPage = 1;

    renderTable();

});


// Status Filter

statusFilter.addEventListener("change", () => {

    currentPage = 1;

    renderTable();

});

// Sorting

sortTickets.addEventListener("change", () => {

    currentPage = 1;

    renderTable();

});

// Initial Load

loadTickets();

// Internet Status

window.addEventListener("offline", () => {

    alert("Internet connection lost.");

});

window.addEventListener("online", () => {

    alert("Connection restored.");

});