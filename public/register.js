// ==========================================
// VendorLink Register
// Relies on common.js for showToast / showLoading / hideLoading
// ==========================================

const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const REGISTER_API_URL = `${API_BASE}/auth/register`;

// ==========================================
// Validate Email
// ==========================================

function validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
}

// ==========================================
// Register Form Submit
// ==========================================

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const company = companyInput.value.trim();
    const role = roleInput.value;

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        showToast("Please fill all required fields.", "error");
        return;
    }

    if (!validateEmail(email)) {
        showToast("Please enter a valid email.", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    try {
        showLoading();

        const response = await fetch(REGISTER_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, phone, company, role })
        });

        const data = await response.json();

        hideLoading();

        if (data.success) {
            showToast("Registration successful", "success");
            registerForm.reset();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1200);
        } else {
            showToast(data.message || "Registration failed.", "error");
        }
    } catch (error) {
        hideLoading();
        console.error(error);
        showToast("Unable to connect to server.", "error");
    }
});

// ==========================================
// Clear any stale session before registering
// ==========================================

localStorage.removeItem("token");
localStorage.removeItem("user");
