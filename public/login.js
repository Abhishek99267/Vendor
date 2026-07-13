// ==========================================
// VendorLink Login
// Relies on common.js for showToast / showLoading / hideLoading
// ==========================================

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const LOGIN_API_URL = `${API_BASE}/auth/login`;

// ==========================================
// Show / Hide Password
// ==========================================

togglePassword.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    togglePassword.innerHTML = isHidden ? "🙈" : "👁";
});

// ==========================================
// Login Form Submit
// ==========================================

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        showToast("Please enter email and password.", "error");
        return;
    }

    try {
        showLoading();

        const response = await fetch(LOGIN_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailValue, password: passwordValue })
        });

        const data = await response.json();

        hideLoading();

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            showToast("Login successful", "success");

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        } else {
            showToast(data.message || "Login failed.", "error");
        }
    } catch (error) {
        hideLoading();
        console.error(error);
        showToast("Unable to connect to server.", "error");
    }
});

// ==========================================
// Redirect if already logged in
// ==========================================

if (localStorage.getItem("token")) {
    window.location.href = "/dashboard";
}
