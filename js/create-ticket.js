// Get Elements

const form = document.getElementById("ticketForm");

const customer = document.getElementById("customerName");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const description = document.getElementById("description");
const priority = document.getElementById("priority");

const spinner = document.getElementById("spinner");
const successToast = document.getElementById("successToast");

const customerError = document.getElementById("customerError");
const emailError = document.getElementById("emailError");
const subjectError = document.getElementById("subjectError");
const descriptionError = document.getElementById("descriptionError");

const charCount = document.getElementById("charCount");

// Character Counter

description.addEventListener("input", () => {

    charCount.innerHTML = `${description.value.length} / 500 Characters`;

});

// Validation

function validateForm() {

    let valid = true;

    customerError.innerHTML = "";
    emailError.innerHTML = "";
    subjectError.innerHTML = "";
    descriptionError.innerHTML = "";

    if (customer.value.trim() === "") {

        customerError.innerHTML = "Customer name is required";
        valid = false;

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {

        emailError.innerHTML = "Email is required";
        valid = false;

    }
    else if (!emailRegex.test(email.value)) {

        emailError.innerHTML = "Invalid email";
        valid = false;

    }

    if (subject.value.trim() === "") {

        subjectError.innerHTML = "Subject is required";
        valid = false;

    }

    if (description.value.trim().length < 10) {

        descriptionError.innerHTML = "Minimum 10 characters";
        valid = false;

    }

    return valid;

}

// Create Ticket

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!validateForm()) return;

    spinner.classList.remove("d-none");

    const ticket = {

        customer: customer.value.trim(),

        email: email.value.trim(),

        subject: subject.value.trim(),

        description: description.value.trim(),

        priority: priority.value,

        status: "Open",

        createdDate: new Date().toLocaleDateString()

    };

    try {

        const result = await createTicket(ticket);

        spinner.classList.add("d-none");

        if (result) {

            // Save Recent Activity

            let activities =
                JSON.parse(localStorage.getItem("activities")) || [];

            const ticketId =
                result.id || Date.now();

            activities.unshift(
                `Ticket #${ticketId} created by ${ticket.customer}`
            );

            // Keep only latest 20 activities
            activities = activities.slice(0, 20);

            localStorage.setItem(
                "activities",
                JSON.stringify(activities)
            );

            // Success Toast

            const toast =
                new bootstrap.Toast(successToast);

            toast.show();

            form.reset();

            charCount.innerHTML = "0 / 500 Characters";

            // Redirect

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 2000);

        }

    }
    catch (error) {

        spinner.classList.add("d-none");

        alert("Unable to create ticket.");

        console.error(error);

    }

});
