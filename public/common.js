// =============================================
// VendorLink Common Utility File
// =============================================

// =============================================
// API Configuration
// =============================================

const API_BASE = "/api";

const token = localStorage.getItem("token");

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

// =============================================
// Authentication
// =============================================

const PUBLIC_PAGES = ["/login", "/register", "/"];

function checkAuth() {
    if (!token && !PUBLIC_PAGES.includes(window.location.pathname)) {
        window.location.href = "/login";
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
}

// =============================================
// API Helper
// =============================================

async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        headers,
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request Failed");
    }

    return data;
}

// =============================================
// Toast Notification
// =============================================

function showToast(message, type = "info") {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// =============================================
// Loading Overlay
// =============================================

function showLoading() {
    let loader = document.getElementById("globalLoader");

    if (!loader) {
        loader = document.createElement("div");
        loader.id = "globalLoader";
        loader.className = "page-loader";
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }

    loader.style.display = "flex";
}

function hideLoading() {
    const loader = document.getElementById("globalLoader");

    if (loader) {
        loader.style.display = "none";
    }
}

// =============================================
// Formatters
// =============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function confirmAction(message) {
    return window.confirm(message);
}

// =============================================
// Global Initialization
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
