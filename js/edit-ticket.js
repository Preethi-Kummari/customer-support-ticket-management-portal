// Get Elements

const form = document.getElementById("editForm");

const customerName = document.getElementById("customerName");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const description = document.getElementById("description");
const priority = document.getElementById("priority");
const status = document.getElementById("status");

const spinner = document.getElementById("spinner");
const successToast = document.getElementById("successToast");

const customerError = document.getElementById("customerError");
const emailError = document.getElementById("emailError");

const charCount = document.getElementById("charCount");

// Get Ticket ID

const params = new URLSearchParams(window.location.search);

const ticketId = params.get("id");

// Load Ticket

async function loadTicket() {

    spinner.classList.remove("d-none");

    const ticket = await getTicketById(ticketId);

    spinner.classList.add("d-none");

    if (!ticket) {

        alert("Ticket not found.");

        window.location.href = "tickets.html";

        return;

    }

    customerName.value = ticket.customer;
    email.value = ticket.email;
    subject.value = ticket.subject;
    description.value = ticket.description;
    priority.value = ticket.priority;
    status.value = ticket.status;

    charCount.innerHTML =
        `${description.value.length} / 500 Characters`;

}

loadTicket();

// Character Counter

description.addEventListener("input", () => {

    charCount.innerHTML =
        `${description.value.length} / 500 Characters`;

});

// Validation

function validateForm() {

    let valid = true;

    customerError.innerHTML = "";
    emailError.innerHTML = "";

    if (customerName.value.trim() === "") {

        customerError.innerHTML =
            "Customer Name is required";

        valid = false;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {

        emailError.innerHTML =
            "Email is required";

        valid = false;

    }

    else if (!emailRegex.test(email.value.trim())) {

        emailError.innerHTML =
            "Enter a valid email";

        valid = false;

    }

    if (subject.value.trim() === "") {

        alert("Subject is required");

        valid = false;

    }

    if (description.value.trim().length < 10) {

        alert("Description should contain at least 10 characters");

        valid = false;

    }

    return valid;

}

// Update Ticket

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!validateForm()) return;

    spinner.classList.remove("d-none");

    const updatedTicket = {

        customer: customerName.value.trim(),

        email: email.value.trim(),

        subject: subject.value.trim(),

        description: description.value.trim(),

        priority: priority.value,

        status: status.value,

        createdDate: new Date().toLocaleDateString()

    };

    try {

        const result = await updateTicket(ticketId, updatedTicket);

        spinner.classList.add("d-none");

        if (result) {

            // Save Recent Activity

            let activities =
                JSON.parse(localStorage.getItem("activities")) || [];

            activities.unshift(
                `Ticket #${ticketId} updated by ${updatedTicket.customer}`
            );

            // If status changed, record it too
            activities.unshift(
                `Ticket #${ticketId} status changed to ${updatedTicket.status}`
            );

            // Keep only latest 20 activities
            activities = activities.slice(0, 20);

            localStorage.setItem(
                "activities",
                JSON.stringify(activities)
            );

            // Success Toast

            const toast = new bootstrap.Toast(successToast);

            toast.show();

            setTimeout(() => {

                window.location.href = "tickets.html";

            }, 2000);

        }

    }
    catch (error) {

        spinner.classList.add("d-none");

        alert("Unable to update ticket.");

        console.error(error);

    }

});
