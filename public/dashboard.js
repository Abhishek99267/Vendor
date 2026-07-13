

const currentUser = JSON.parse(
    localStorage.getItem("user")
);


if (!token) {

    window.location.href = "/login";

}



async function apiFetch(url) {

    const response = await fetch(url, {

        headers

    });

    if (!response.ok) {

        throw new Error("Request Failed");

    }

    return response.json();

}



function loadUser() {

    const userName =
        document.getElementById("userName");

    if (userName && currentUser) {

        userName.innerHTML =
            `Welcome, ${currentUser.name}`;

    }

}



async function loadVendorStats() {

    try {

        const result =
            await apiFetch(
                `${API_BASE}/vendors/stats`
            );

        document.getElementById(
            "totalVendors"
        ).innerText =
            result.data.totalVendors;

        document.getElementById(
            "activeVendors"
        ).innerText =
            result.data.activeVendors;

        document.getElementById(
            "vendorRating"
        ).innerText =
            result.data.averageRating;

    }

    catch (error) {

        console.log(error);

    }

}


async function loadPurchaseStats() {

    try {

        const result = await apiFetch(
            `${API_BASE}/orders/stats`
        );

        document.getElementById("totalOrders").innerText =
            result.data.totalOrders;

        document.getElementById("pendingOrders").innerText =
            result.data.pendingOrders;

        document.getElementById("completedOrders").innerText =
            result.data.deliveredOrders;

        document.getElementById("purchaseAmount").innerText =
            "₹ " + result.data.totalPurchase;

    } catch (error) {

        console.error(error);

    }

}



async function loadPerformanceStats() {

    try {

        const result = await apiFetch(
            `${API_BASE}/performance/stats`
        );

        document.getElementById("overallRating").innerText =
            Number(
                result.data.averageRatings.avgOverall
            ).toFixed(2);

    } catch (error) {

        console.error(error);

    }

}


async function loadMessageStats() {

    try {

        const result = await apiFetch(
            `${API_BASE}/messages/stats`
        );

        document.getElementById("totalMessages").innerText =
            result.data.totalMessages;

        document.getElementById("unreadMessages").innerText =
            result.data.unreadMessages;

    } catch (error) {

        console.error(error);

    }

}



function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

}



document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadVendorStats();

    loadPurchaseStats();

    loadPerformanceStats();

    loadMessageStats();

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }

});