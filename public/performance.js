

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

const addEvaluationBtn =
    document.getElementById("addEvaluationBtn");



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



if (addEvaluationBtn) {

    addEvaluationBtn.addEventListener(

        "click",

        () => {

            window.location.href =

                "/addPerformance";

        }

    );

}



function calculateOverall() {

    if (!overallInput) return;

    const quality =
        Number(qualityInput?.value) || 0;

    const delivery =
        Number(deliveryInput?.value) || 0;

    const cost =
        Number(costInput?.value) || 0;

    const communication =
        Number(communicationInput?.value) || 0;

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

].forEach(input => {

    if (input) {

        input.addEventListener(

            "input",

            calculateOverall

        );

    }

});



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

            "error"

        );

    }

}



let performanceData = [];



async function loadPerformance() {

    if (!performanceTable) return;

    try {

        showLoading();

        const result = await apiFetch(
            `${API_BASE}/performance`
        );

        hideLoading();

        performanceData = result.data || [];

        renderPerformanceTable(performanceData);

        updateStatistics(performanceData);

    }

    catch (error) {

        hideLoading();

        console.error(error);

        showToast(
            "Unable to load performance records.",
            "error"
        );

    }

}



function renderPerformanceTable(records) {

    if (!performanceTable) return;

    if (!records || records.length === 0) {

        performanceTable.innerHTML = `

        <tr>

            <td colspan="7" style="text-align:center;">

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

                ${record.vendor?.vendorName || "-"}

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



function getRatingBadge(rating) {

    rating = Number(rating);

    if (rating >= 9) {

        return `
            <span class="badge badge-success">
                ${rating.toFixed(1)}
            </span>
        `;

    }

    if (rating >= 7) {

        return `
            <span class="badge badge-primary">
                ${rating.toFixed(1)}
            </span>
        `;

    }

    if (rating >= 5) {

        return `
            <span class="badge badge-warning">
                ${rating.toFixed(1)}
            </span>
        `;

    }

    return `
        <span class="badge badge-danger">
            ${rating.toFixed(1)}
        </span>
    `;

}



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

        totalEvaluations.innerText =
            records.length;

    }

    if (!records.length) {

        if (averageRating)
            averageRating.innerText = "0.0";

        if (bestVendor)
            bestVendor.innerText = "-";

        if (lowPerformance)
            lowPerformance.innerText = "0";

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

            sorted[0].vendor?.vendorName || "-";

    }

    if (lowPerformance) {

        lowPerformance.innerText =

            records.filter(

                record =>

                    Number(record.overall) < 5

            ).length;

    }

    renderTopVendors(sorted);

    renderRecentEvaluations(records);

}



function renderTopVendors(records) {

    const table =

        document.getElementById(
            "topVendorTable"
        );

    if (!table) return;

    table.innerHTML = "";

    records
        .slice(0, 5)
        .forEach((record, index) => {

            table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>

                    ${record.vendor?.vendorName || "-"}

                </td>

                <td>

                    ${Number(record.overall).toFixed(2)}

                </td>

            </tr>

            `;

        });

}



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

                    ${Number(record.overall).toFixed(2)}

                </td>

                <td>

                    ${record.comments || "-"}

                </td>

            </tr>

            `;

        });

}




function searchPerformance() {

    let filtered = [...performanceData];

    const keyword =
        searchInput?.value
        .trim()
        .toLowerCase();

    if (keyword) {

        filtered = filtered.filter(record =>

            (record.vendor?.vendorName || "")
                .toLowerCase()
                .includes(keyword)

        );

    }

    renderPerformanceTable(filtered);

    updateStatistics(filtered);

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


if (performanceForm) {

    performanceForm.addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();

            // Validation

            if (!vendorSelect.value) {

                showToast(

                    "Please select vendor.",

                    "warning"

                );

                return;

            }

            const performance = {

                vendor:
                    vendorSelect.value,

                quality:
                    Number(
                        qualityInput.value
                    ),

                delivery:
                    Number(
                        deliveryInput.value
                    ),

                cost:
                    Number(
                        costInput.value
                    ),

                communication:
                    Number(
                        communicationInput.value
                    ),

                overall:
                    Number(
                        overallInput.value
                    ),

                comments:
                    document
                    .getElementById("comments")
                    .value
                    .trim()

            };

            const editData = JSON.parse(

                localStorage.getItem(
                    "editPerformance"
                )

            );

            const editMode =

                window.location.search.includes(
                    "edit=true"
                )

                &&

                editData;

            try {

                showLoading();

                let response;

                if (editMode) {

                    response = await fetch(

                        `${API_BASE}/performance/${editData._id}`,

                        {

                            method: "PUT",

                            headers,

                            body: JSON.stringify(

                                performance

                            )

                        }

                    );

                }

                else {

                    response = await fetch(

                        `${API_BASE}/performance`,

                        {

                            method: "POST",

                            headers,

                            body: JSON.stringify(

                                performance

                            )

                        }

                    );

                }

                const result =
                    await response.json();

                hideLoading();

                if (result.success) {

                    showToast(

                        editMode

                        ?

                        "Performance Updated Successfully"

                        :

                        "Performance Saved Successfully",

                        "success"

                    );

                    localStorage.removeItem(

                        "editPerformance"

                    );

                    performanceForm.reset();

                    setTimeout(() => {

                        window.location.href =
                            "/performance";

                    }, 800);

                }

                else {

                    showToast(

                        result.message,

                        "error"

                    );

                }

            }

            catch (error) {

                hideLoading();

                console.error(error);

                showToast(

                    "Unable to save evaluation.",

                    "error"

                );

            }

        }

    );

}




async function deletePerformance(id) {

    if (!confirmAction("Delete this evaluation?")) {

        return;

    }

    try {

        showLoading();

        const response = await fetch(

            `${API_BASE}/performance/${id}`,

            {

                method: "DELETE",

                headers

            }

        );

        const result = await response.json();

        hideLoading();

        if (result.success) {

            showToast(

                "Evaluation Deleted Successfully",

                "success"

            );

            await loadPerformance();

        }

        else {

            showToast(

                result.message,

                "error"

            );

        }

    }

    catch (error) {

        hideLoading();

        console.error(error);

        showToast(

            "Unable to delete evaluation.",

            "error"

        );

    }

}



async function editPerformance(id) {

    try {

        showLoading();

        const result = await apiFetch(

            `${API_BASE}/performance/${id}`

        );

        hideLoading();

        localStorage.setItem(

            "editPerformance",

            JSON.stringify(result.data)

        );

        // Clean Route (NO .html)

        window.location.href =

            "/addPerformance?edit=true";

    }

    catch (error) {

        hideLoading();

        console.error(error);

        showToast(

            "Unable to load evaluation.",

            "error"

        );

    }

}



function initializeEditMode() {

    if (!performanceForm) return;

    const record = JSON.parse(

        localStorage.getItem("editPerformance")

    );

    if (!record) return;

    document.title =
        "Update Evaluation | VendorLink";

    const heading =
        document.getElementById("pageHeading");

    if (heading) {

        heading.innerText =
            "Update Evaluation";

    }

    const submitBtn =
        performanceForm.querySelector(
            "button[type='submit']"
        );

    if (submitBtn) {

        submitBtn.innerText =
            "Update Evaluation";

    }

    document.getElementById("vendor").value =
        record.vendor?._id || record.vendor;

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



function resetPerformanceForm() {

    if (!performanceForm) return;

    performanceForm.reset();

    localStorage.removeItem(

        "editPerformance"

    );

}



document.addEventListener(

    "DOMContentLoaded",

    async () => {

        try {

            if (vendorSelect) {

                await loadVendors();

                initializeEditMode();

            }

            if (performanceTable) {

                await loadPerformance();

            }

        }

        catch (error) {

            console.error(error);

        }

    }

);


window.editPerformance =
    editPerformance;

window.deletePerformance =
    deletePerformance;








