// ============================================
// VendorLink - Vendors Module
// API_BASE, token, and headers are already declared in common.js
// ============================================

if (!token) {

    window.location.href = "/login";

}

// ============================
// DOM Elements
// ============================

const vendorTable =
    document.getElementById("vendorTable");

const vendorForm =
    document.getElementById("vendorForm");

const searchInput =
    document.getElementById("searchVendor");

const searchBtn =
    document.getElementById("searchBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const sidebarLogout =
    document.getElementById("sidebarLogout");

// Statistics

const vendorCount =
    document.getElementById("vendorCount");

const activeVendorCount =
    document.getElementById("activeVendorCount");

const inactiveVendorCount =
    document.getElementById("inactiveVendorCount");

const averageVendorRating =
    document.getElementById("averageVendorRating");

// ============================
// Helper Functions
// ============================

async function apiFetch(
    url,
    options = {}
) {

    const response = await fetch(url, {

        headers,

        ...options

    });

    return response.json();

}

// ============================
// Logout
// ============================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "/login";

}

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );

}

if (sidebarLogout) {

    sidebarLogout.addEventListener(
        "click",
        logout
    );

}

// ============================
// Toast
// ============================

function showToast(
    message,
    color = "#2563eb"
) {

    let toast =
        document.getElementById("toast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";

        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.padding = "15px";
        toast.style.borderRadius = "8px";
        toast.style.color = "#fff";
        toast.style.zIndex = "9999";

        document.body.appendChild(toast);

    }

    toast.style.background = color;

    toast.innerHTML = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}

// ============================
// Loading Spinner
// ============================

function showLoading() {

    document.body.style.cursor =
        "wait";

}

function hideLoading() {

    document.body.style.cursor =
        "default";

}




// ============================================
// Load All Vendors
// ============================================

async function loadVendors() {

    try {

        showLoading();

        const result = await apiFetch(
            `${API_BASE}/vendors`
        );

        hideLoading();

        if (!result.success) {

            showToast(
                result.message,
                "#dc2626"
            );

            return;

        }

        renderVendorTable(result.data);

        updateVendorStatistics(result.data);

    }

    catch (error) {

        hideLoading();

        console.error(error);

        showToast(
            "Unable to load vendors.",
            "#dc2626"
        );

    }

}

// ============================================
// Render Vendor Table
// ============================================

function renderVendorTable(vendors) {

    if (!vendorTable) return;

    if (vendors.length === 0) {

        vendorTable.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;">
                    No Vendors Found
                </td>
            </tr>
        `;

        return;

    }

    vendorTable.innerHTML = "";

    vendors.forEach((vendor) => {

        vendorTable.innerHTML += `

        <tr>

            <td>${vendor.vendorName}</td>

            <td>${vendor.companyName}</td>

            <td>${vendor.email}</td>

            <td>${vendor.phone}</td>

            <td>

                <span class="badge
                    ${
                        vendor.status === "Active"
                        ? "badge-success"
                        : vendor.status === "Inactive"
                        ? "badge-warning"
                        : "badge-danger"
                    }">

                    ${vendor.status}

                </span>

            </td>

            <td>

                ⭐ ${vendor.rating}

            </td>

            <td>

                <button
                    class="btn-edit"
                    onclick="editVendor('${vendor._id}')">

                    Edit

                </button>

                <button
                    class="btn-delete"
                    onclick="deleteVendor('${vendor._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ============================================
// Vendor Statistics
// ============================================

function updateVendorStatistics(vendors) {

    if (vendorCount)
        vendorCount.innerText = vendors.length;

    if (activeVendorCount)
        activeVendorCount.innerText =
            vendors.filter(
                v => v.status === "Active"
            ).length;

    if (inactiveVendorCount)
        inactiveVendorCount.innerText =
            vendors.filter(
                v => v.status === "Inactive"
            ).length;

    if (averageVendorRating) {

        const total =
            vendors.reduce(
                (sum, vendor) =>
                    sum + Number(vendor.rating),
                0
            );

        averageVendorRating.innerText =
            vendors.length
                ? (total / vendors.length)
                    .toFixed(2)
                : "0";

    }

}

// ============================================
// Auto Load
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    loadVendors
);







// ============================================
// Search Vendors
// ============================================

async function searchVendors() {

    if (!searchInput) return;

    const keyword = searchInput.value.trim();

    try {

        showLoading();

        const result = await apiFetch(
            `${API_BASE}/vendors/search?keyword=${encodeURIComponent(keyword)}`
        );

        hideLoading();

        if (result.success) {

            renderVendorTable(result.data);

            updateVendorStatistics(result.data);

        } else {

            showToast(
                result.message,
                "#dc2626"
            );

        }

    } catch (error) {

        hideLoading();

        console.error(error);

        showToast(
            "Search failed.",
            "#dc2626"
        );

    }

}

// Search Button

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchVendors
    );

}

// Live Search

if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        searchVendors
    );

}

// ============================================
// Delete Vendor
// ============================================

let selectedVendorId = null;

const deleteModal =
    document.getElementById("deleteModal");

const confirmDelete =
    document.getElementById("confirmDelete");

const cancelDelete =
    document.getElementById("cancelDelete");

const closeModal =
    document.getElementById("closeModal");

// Open Modal

function deleteVendor(id) {

    selectedVendorId = id;

    if (deleteModal) {

        deleteModal.style.display = "flex";

    }

}

// Close Modal

function closeDeleteModal() {

    selectedVendorId = null;

    if (deleteModal) {

        deleteModal.style.display = "none";

    }

}

if (cancelDelete) {

    cancelDelete.addEventListener(
        "click",
        closeDeleteModal
    );

}

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeDeleteModal
    );

}

// Delete Request

if (confirmDelete) {

    confirmDelete.addEventListener(
        "click",
        async () => {

            if (!selectedVendorId) return;

            try {

                showLoading();

                const response =
                    await fetch(

                        `${API_BASE}/vendors/${selectedVendorId}`,

                        {

                            method: "DELETE",

                            headers

                        }

                    );

                const result =
                    await response.json();

                hideLoading();

                closeDeleteModal();

                if (result.success) {

                    showToast(
                        "Vendor deleted successfully.",
                        "#16a34a"
                    );

                    loadVendors();

                } else {

                    showToast(
                        result.message,
                        "#dc2626"
                    );

                }

            } catch (error) {

                hideLoading();

                console.error(error);

                showToast(
                    "Delete failed.",
                    "#dc2626"
                );

            }

        }

    );

}





// ============================================
// Add Vendor
// ============================================

// if (vendorForm) {

//     vendorForm.addEventListener(
//         "submit",
//         async (e) => {

//             e.preventDefault();

//             const vendorData = {

//                 vendorName:
//                     document.getElementById("vendorName").value.trim(),

//                 companyName:
//                     document.getElementById("companyName").value.trim(),

//                 email:
//                     document.getElementById("email").value.trim(),

//                 phone:
//                     document.getElementById("phone").value.trim(),

//                 address:
//                     document.getElementById("address").value.trim(),

//                 city:
//                     document.getElementById("city").value.trim(),

//                 state:
//                     document.getElementById("state").value.trim(),

//                 country:
//                     document.getElementById("country").value.trim(),

//                 pincode:
//                     document.getElementById("pincode").value.trim(),

//                 gstNumber:
//                     document.getElementById("gstNumber").value.trim(),

//                 category:
//                     document.getElementById("category").value,

//                 status:
//                     document.getElementById("status").value,

//                 notes:
//                     document.getElementById("notes").value.trim()

//             };

//             try {

//                 showLoading();

//                 const response =
//                     await fetch(
//                         `${API_BASE}/vendors`,
//                         {
//                             method: "POST",
//                             headers,
//                             body: JSON.stringify(vendorData)
//                         }
//                     );

//                 const result =
//                     await response.json();

//                 hideLoading();

//                 if (result.success) {

//                     showToast(
//                         "Vendor added successfully.",
//                         "#16a34a"
//                     );

//                     vendorForm.reset();

//                     setTimeout(() => {

//                         window.location.href =
//                             "/vendors";

//                     }, 1200);

//                 } else {

//                     showToast(
//                         result.message,
//                         "#dc2626"
//                     );

//                 }

//             } catch (error) {

//                 hideLoading();

//                 console.error(error);

//                 showToast(
//                     "Unable to add vendor.",
//                     "#dc2626"
//                 );

//             }

//         }

//     );

// }

// ============================================
// Edit Vendor
// ============================================


// ============================================
// Add / Update Vendor
// ============================================

if (vendorForm) {

    vendorForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const vendorData = {

            vendorName: document.getElementById("vendorName").value.trim(),
            companyName: document.getElementById("companyName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            city: document.getElementById("city").value.trim(),
            state: document.getElementById("state").value.trim(),
            country: document.getElementById("country").value.trim(),
            pincode: document.getElementById("pincode").value.trim(),
            gstNumber: document.getElementById("gstNumber").value.trim(),
            category: document.getElementById("category").value,
            status: document.getElementById("status").value,
            notes: document.getElementById("notes").value.trim()

        };

        const editVendor =
            JSON.parse(
                localStorage.getItem("editVendor")
            );

        const isEditMode =
            window.location.search.includes("edit=true") &&
            editVendor;

        try {

            showLoading();

            let response;

            if (isEditMode) {

                response = await fetch(

                    `${API_BASE}/vendors/${editVendor._id}`,

                    {

                        method: "PUT",

                        headers,

                        body: JSON.stringify(vendorData)

                    }

                );

            }

            else {

                response = await fetch(

                    `${API_BASE}/vendors`,

                    {

                        method: "POST",

                        headers,

                        body: JSON.stringify(vendorData)

                    }

                );

            }

            const result = await response.json();

            hideLoading();

            if (result.success) {

                showToast(

                    isEditMode
                        ? "Vendor updated successfully."
                        : "Vendor added successfully.",

                    "#16a34a"

                );

                vendorForm.reset();

                localStorage.removeItem("editVendor");

                setTimeout(() => {

                    window.location.href =
                        "/vendors";

                }, 1000);

            }

            else {

                showToast(
                    result.message,
                    "#dc2626"
                );

            }

        }

        catch (error) {

            hideLoading();

            console.error(error);

            showToast(
                "Something went wrong.",
                "#dc2626"
            );

        }

    });

}



async function editVendor(id) {

    try {

        const result =
            await apiFetch(
                `${API_BASE}/vendors/${id}`
            );

        if (!result.success) {

            showToast(
                result.message,
                "#dc2626"
            );

            return;

        }

        // Save selected vendor
        localStorage.setItem(
            "editVendor",
            JSON.stringify(result.data)
        );

        window.location.href =
            "/addVendor.html?edit=true";

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to load vendor.",
            "#dc2626"
        );

    }

}

// ============================================
// Edit Mode
// ============================================

async function initializeEditMode() {

    if (!vendorForm) return;

    const params =
        new URLSearchParams(
            window.location.search
        );

    if (!params.has("edit")) return;

    const vendor =
        JSON.parse(
            localStorage.getItem("editVendor")
        );

    if (!vendor) return;

    document.getElementById("vendorName").value =
        vendor.vendorName;

    document.getElementById("companyName").value =
        vendor.companyName;

    document.getElementById("email").value =
        vendor.email;

    document.getElementById("phone").value =
        vendor.phone;

    document.getElementById("address").value =
        vendor.address;

    document.getElementById("city").value =
        vendor.city;

    document.getElementById("state").value =
        vendor.state;

    document.getElementById("country").value =
        vendor.country;

    document.getElementById("pincode").value =
        vendor.pincode;

    document.getElementById("gstNumber").value =
        vendor.gstNumber;

    document.getElementById("category").value =
        vendor.category;

    document.getElementById("status").value =
        vendor.status;

    document.getElementById("notes").value =
        vendor.notes;

    // Change button text
    const submitBtn =
        vendorForm.querySelector(
            "button[type='submit']"
        );

    submitBtn.innerText =
        "Update Vendor";



   document.title = "Update Vendor | VendorLink";     
const heading = document.querySelector(".topbar h2");

if (heading) {

    heading.innerText = "Update Vendor";

}

const pageHeading = document.getElementById("pageHeading");

if (pageHeading) {

    pageHeading.innerText = "Update Vendor";

}
}

// ============================================
// Initialize
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEditMode();

    }
);


