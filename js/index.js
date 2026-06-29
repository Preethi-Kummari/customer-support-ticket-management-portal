const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    emailError.innerHTML = "";
    passwordError.innerHTML = "";

    let valid = true;

    // Email Validation
    if (email === "") {
        emailError.innerHTML = "Email is required";
        valid = false;
    }
    else if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
        emailError.innerHTML = "Invalid email format";
        valid = false;
    }

    // Password Validation
    if (password === "") {
        passwordError.innerHTML = "Password is required";
        valid = false;
    }

    if (!valid) return;

    document.getElementById("spinner").classList.remove("d-none");

    setTimeout(function(){

        document.getElementById("spinner").classList.add("d-none");

        document.getElementById("successMsg").classList.remove("d-none");

        setTimeout(function(){

            window.location.href = "dashboard.html";

        },1000);

    },1500);

});
