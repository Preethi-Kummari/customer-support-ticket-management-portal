// MockAPI URL

const API_URL = "https://6a40c3181ff1d27becc0f39d.mockapi.io/api/tm/tickets";

// GET ALL TICKETS

async function getTickets() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch tickets.");
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

        return [];

    }
}

// GET SINGLE TICKET

async function getTicketById(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {

            throw new Error("Ticket not found");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        alert("Unable to load ticket.");

        return null;

    }

}

// CREATE TICKET

async function createTicket(ticket) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(ticket)

        });

        if (!response.ok) {

            throw new Error("Create Failed");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        alert("Unable to create ticket.");

    }

}

// UPDATE TICKET

async function updateTicket(id, ticket) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(ticket)

        });

        if (!response.ok) {

            throw new Error("Update Failed");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        alert("Unable to update ticket.");

    }

}

// DELETE TICKET

async function deleteTicket(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Delete Failed");

        }

        return true;

    } catch (error) {

        console.error(error);

        alert("Unable to delete ticket.");

        return false;

    }

}

// Network Status

window.addEventListener("offline", () => {

    alert("Internet connection lost.");

});

window.addEventListener("online", () => {

    alert("Connection restored.");

});