// =====================================================
// VendorLink - Performance Module
// =====================================================

// =====================================================
// DOM Elements
// =====================================================

const performanceForm =
    document.getElementById("performanceForm");

const performanceTable =
    document.getElementById("performanceTable");

const vendorSelect =
    document.getElementById("vendor");

const qualityInput =
    document.getElementById("quality");

const deliveryInput =
    document.getElementById("delivery");

const costInput =
    document.getElementById("cost");

const communicationInput =
    document.getElementById("communication");

const overallInput =
    document.getElementById("overall");

const searchInput =
    document.getElementById("searchPerformance");

const searchBtn =
    document.getElementById("searchBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const sidebarLogout =
    document.getElementById("sidebarLogout");

// =====================================================
// Logout
// =====================================================

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

// =====================================================
// Calculate Overall Rating
// =====================================================

function calculateOverall() {

    if (!overallInput) return;

    const quality =
        Number(qualityInput?.value || 0);

    const delivery =
        Number(deliveryInput?.value || 0);

    const cost =
        Number(costInput?.value || 0);

    const communication =
        Number(communicationInput?.value || 0);

    const overall =

        (

            quality +

            delivery +

            cost +

            communication

        ) / 4;

    overallInput.value =
        overall.toFixed(2);

}

[
    qualityInput,
    deliveryInput,
    costInput,
    communicationInput
]

.forEach(input => {

    if (input) {

        input.addEventListener(

            "input",

            calculateOverall

        );

    }

});

// =====================================================
// Load Vendor Dropdown
// =====================================================

async function loadVendors() {

    if (!vendorSelect) return;

    try {

        const result =
            await apiFetch(

                `${API_BASE}/vendors`

            );

        vendorSelect.innerHTML =

            `<option value="">Select Vendor</option>`;

        result.data.forEach(vendor => {

            vendorSelect.innerHTML += `

            <option value="${vendor._id}">

                ${vendor.vendorName}

                (${vendor.companyName})

            </option>

            `;

        });

    }

    catch (error) {

        console.error(error);

        showToast(

            "Unable to load vendors.",

            "#dc2626"

        );

    }

}

// =====================================================
// Load Performance Records
// =====================================================

async function loadPerformance() {

    if (!performanceTable) return;

    try {

        showLoading();

        const result =
            await apiFetch(

                `${API_BASE}/performance`

            );

        hideLoading();

        renderPerformanceTable(

            result.data

        );

        updateStatistics(

            result.data

        );

    }

    catch (error) {

        hideLoading();

        console.error(error);

        showToast(

            "Unable to load records.",

            "#dc2626"

        );

    }

}



// =====================================================
// Render Performance Table
// =====================================================

let performanceData = [];

function renderPerformanceTable(records) {

    performanceData = records;

    if (!performanceTable) return;

    if (!records || records.length === 0) {

        performanceTable.innerHTML = `

        <tr>

            <td colspan="7"
                style="text-align:center;">

                No Performance Records Found

            </td>

        </tr>

        `;

        return;

    }

    performanceTable.innerHTML = "";

    records.forEach(record => {

        performanceTable.innerHTML += `

        <tr>

            <td>

                ${record.vendor?.vendorName || "N/A"}

            </td>

            <td>${record.quality}</td>

            <td>${record.delivery}</td>

            <td>${record.cost}</td>

            <td>${record.communication}</td>

            <td>

                ${getRatingBadge(record.overall)}

            </td>

            <td>

                <button
                    class="btn btn-primary btn-sm"
                    onclick="editPerformance('${record._id}')">

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deletePerformance('${record._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// =====================================================
// Rating Badge
// =====================================================

function getRatingBadge(rating) {

    if (rating >= 9) {

        return `<span class="badge badge-success">${rating}</span>`;

    }

    if (rating >= 7) {

        return `<span class="badge badge-primary">${rating}</span>`;

    }

    if (rating >= 5) {

        return `<span class="badge badge-warning">${rating}</span>`;

    }

    return `<span class="badge badge-danger">${rating}</span>`;

}

// =====================================================
// Statistics
// =====================================================

function updateStatistics(records) {

    const totalEvaluations =
        document.getElementById("totalEvaluations");

    const averageRating =
        document.getElementById("averageRating");

    const bestVendor =
        document.getElementById("bestVendor");

    const lowPerformance =
        document.getElementById("lowPerformance");

    if (totalEvaluations) {

        totalEvaluations.innerText = records.length;

    }

    if (records.length === 0) {

        return;

    }

    const average =

        records.reduce(

            (sum, record) =>

                sum + Number(record.overall),

            0

        ) / records.length;

    if (averageRating) {

        averageRating.innerText =
            average.toFixed(2);

    }

    const sorted = [...records].sort(

        (a, b) =>

            b.overall - a.overall

    );

    if (bestVendor) {

        bestVendor.innerText =

            sorted[0].vendor?.vendorName ||

            "-";

    }

    if (lowPerformance) {

        lowPerformance.innerText =

            records.filter(

                record =>

                    record.overall < 5

            ).length;

    }

    renderTopVendors(sorted);

    renderRecentEvaluations(records);

}

// =====================================================
// Top Vendors
// =====================================================

function renderTopVendors(records) {

    const table =

        document.getElementById("topVendorTable");

    if (!table) return;

    table.innerHTML = "";

    records.slice(0, 5).forEach((record, index) => {

        table.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>

                ${record.vendor?.vendorName || "-"}

            </td>

            <td>

                ${record.overall.toFixed(2)}

            </td>

        </tr>

        `;

    });

}

// =====================================================
// Recent Evaluations
// =====================================================

function renderRecentEvaluations(records) {

    const table =

        document.getElementById(

            "recentEvaluationTable"

        );

    if (!table) return;

    table.innerHTML = "";

    records
        .slice()
        .reverse()
        .slice(0, 5)
        .forEach(record => {

            table.innerHTML += `

            <tr>

                <td>

                    ${formatDate(record.createdAt)}

                </td>

                <td>

                    ${record.vendor?.vendorName || "-"}

                </td>

                <td>

                    ${record.overall}

                </td>

                <td>

                    ${record.comments || "-"}

                </td>

            </tr>

            `;

        });

}

// =====================================================
// Search
// =====================================================

function searchPerformance() {

    const keyword =

        searchInput.value
        .trim()
        .toLowerCase();

    if (!keyword) {

        renderPerformanceTable(

            performanceData

        );

        return;

    }

    const filtered =

        performanceData.filter(record =>

            (record.vendor?.vendorName || "")

            .toLowerCase()

            .includes(keyword)

        );

    renderPerformanceTable(filtered);

}

if (searchBtn) {

    searchBtn.addEventListener(

        "click",

        searchPerformance

    );

}

if (searchInput) {

    searchInput.addEventListener(

        "keyup",

        searchPerformance

    );

}



// =====================================================
// Add / Update Performance
// =====================================================

if (performanceForm) {

    performanceForm.addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();

            const performance = {

                vendor:
                    document.getElementById("vendor").value,

                quality:
                    Number(document.getElementById("quality").value),

                delivery:
                    Number(document.getElementById("delivery").value),

                cost:
                    Number(document.getElementById("cost").value),

                communication:
                    Number(document.getElementById("communication").value),

                overall:
                    Number(document.getElementById("overall").value),

                comments:
                    document.getElementById("comments").value.trim()

            };

            const editPerformance = JSON.parse(

                localStorage.getItem("editPerformance")

            );

            const isEdit =

                window.location.search.includes("edit=true")

                &&

                editPerformance;

            try {

                showLoading();

                let response;

                if (isEdit) {

                    response = await fetch(

                        `${API_BASE}/performance/${editPerformance._id}`,

                        {

                            method: "PUT",

                            headers,

                            body: JSON.stringify(performance)

                        }

                    );

                }

                else {

                    response = await fetch(

                        `${API_BASE}/performance`,

                        {

                            method: "POST",

                            headers,

                            body: JSON.stringify(performance)

                        }

                    );

                }

                const result =
                    await response.json();

                hideLoading();

                if (result.success) {

                    showToast(

                        isEdit

                        ?

                        "Performance Updated"

                        :

                        "Performance Saved",

                        "#16a34a"

                    );

                    localStorage.removeItem(

                        "editPerformance"

                    );

                    performanceForm.reset();

                    setTimeout(() => {

                        window.location.href =

                            "/performance";

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

                    "Unable to save record.",

                    "#dc2626"

                );

            }

        }

    );

}

// =====================================================
// Delete Performance
// =====================================================

async function deletePerformance(id) {

    if (

        !confirmAction(

            "Delete this evaluation?"

        )

    ) return;

    try {

        showLoading();

        const response = await fetch(

            `${API_BASE}/performance/${id}`,

            {

                method: "DELETE",

                headers

            }

        );

        const result =
            await response.json();

        hideLoading();

        if (result.success) {

            showToast(

                "Evaluation Deleted",

                "#16a34a"

            );

            loadPerformance();

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

            "Delete failed.",

            "#dc2626"

        );

    }

}

// =====================================================
// Edit Performance
// =====================================================

async function editPerformance(id) {

    try {

        const result = await apiFetch(

            `${API_BASE}/performance/${id}`

        );

        localStorage.setItem(

            "editPerformance",

            JSON.stringify(result.data)

        );

        window.location.href =

            "/addPerformance.html?edit=true";

    }

    catch (error) {

        console.error(error);

        showToast(

            "Unable to load evaluation.",

            "#dc2626"

        );

    }

}

// =====================================================
// Initialize Edit Mode
// =====================================================

function initializeEditMode() {

    if (!performanceForm) return;

    const record = JSON.parse(

        localStorage.getItem(

            "editPerformance"

        )

    );

    if (!record) return;

    document.title =

        "Update Evaluation | VendorLink";

    document.getElementById(

        "pageHeading"

    ).innerText =

        "Update Evaluation";

    performanceForm.querySelector(

        "button[type='submit']"

    ).innerText =

        "Update Evaluation";

    document.getElementById("vendor").value =
        record.vendor._id || record.vendor;

    document.getElementById("quality").value =
        record.quality;

    document.getElementById("delivery").value =
        record.delivery;

    document.getElementById("cost").value =
        record.cost;

    document.getElementById("communication").value =
        record.communication;

    document.getElementById("overall").value =
        record.overall;

    document.getElementById("comments").value =
        record.comments || "";

}

// =====================================================
// Initialize
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (vendorSelect) {

            await loadVendors();

            initializeEditMode();

        }

        if (performanceTable) {

            loadPerformance();

        }

    }

);



