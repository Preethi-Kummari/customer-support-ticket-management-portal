// Get Ticket ID

const params = new URLSearchParams(window.location.search);

const ticketId = params.get("id");

// Load Ticket Details

async function loadTicket() {

    const spinner = document.getElementById("spinner");

    spinner.classList.remove("d-none");

    try {

        const response = await fetch(`${API_URL}/${ticketId}`);

        if (!response.ok) {

            throw new Error("Ticket not found");

        }

        const ticket = await response.json();

        document.getElementById("customer").innerText =
            ticket.customer;

        document.getElementById("email").innerText =
            ticket.email;

        document.getElementById("subject").innerText =
            ticket.subject;

        document.getElementById("description").innerText =
            ticket.description;

        document.getElementById("priority").innerText =
            ticket.priority;

        document.getElementById("status").innerText =
            ticket.status;

        document.getElementById("createdDate").innerText =
            ticket.createdDate;

    }

    catch (error) {

        console.error(error);

        alert("Unable to load ticket details.");

    }

    spinner.classList.add("d-none");

}

// Load Page

loadTicket();