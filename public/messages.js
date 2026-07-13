

const messageForm = document.getElementById("messageForm");
const messageTable = document.getElementById("messageTable");

const vendorSelect = document.getElementById("vendor");

const searchInput = document.getElementById("searchMessage");
const searchBtn = document.getElementById("searchBtn");

const logoutBtn = document.getElementById("logoutBtn");
const sidebarLogout = document.getElementById("sidebarLogout");


if (logoutBtn) {

    logoutBtn.addEventListener("click", logout);

}

if (sidebarLogout) {

    sidebarLogout.addEventListener("click", logout);

}



async function loadVendors() {

    if (!vendorSelect) return;

    try {

        const result = await apiFetch(

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



async function loadMessages() {

    if (!messageTable) return;

    try {

        showLoading();

        const result = await apiFetch(

            `${API_BASE}/messages`

        );

        hideLoading();

        renderMessageTable(

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

            "Unable to load messages.",

            "#dc2626"

        );

    }

}



let messages = [];



function renderMessageTable(data) {

    messages = data;

    if (!messageTable) return;

    if (!data.length) {

        messageTable.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center;">

                    No Messages Found

                </td>

            </tr>

        `;

        return;

    }

    messageTable.innerHTML = "";

    data.forEach(message => {

        messageTable.innerHTML += `

        <tr>

            <td>

                ${message.vendor?.vendorName || "-"}

            </td>

            <td>

                ${message.subject}

            </td>

            <td>

                ${formatDate(message.createdAt)}

            </td>

            <td>

                ${getStatusBadge(message.status)}

            </td>

            <td>

                <button
                    class="btn btn-primary btn-sm"
                    onclick="editMessage('${message._id}')">

                    Edit

                </button>

                <button
                    class="btn btn-success btn-sm"
                    onclick="markAsRead('${message._id}')">

                    Read

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteMessage('${message._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}



function getStatusBadge(status) {

    if (status === "Read") {

        return `

            <span class="badge badge-success">

                Read

            </span>

        `;

    }

    return `

        <span class="badge badge-warning">

            Unread

        </span>

    `;

}



function updateStatistics(data) {

    const totalMessages =
        document.getElementById("totalMessages");

    const unreadMessages =
        document.getElementById("unreadMessages");

    const readMessages =
        document.getElementById("readMessages");

    const todayMessages =
        document.getElementById("todayMessages");

    if (totalMessages) {

        totalMessages.innerText = data.length;

    }

    if (unreadMessages) {

        unreadMessages.innerText =

            data.filter(

                msg => msg.status === "Unread"

            ).length;

    }

    if (readMessages) {

        readMessages.innerText =

            data.filter(

                msg => msg.status === "Read"

            ).length;

    }

    if (todayMessages) {

        const today = new Date().toDateString();

        todayMessages.innerText =

            data.filter(msg =>

                new Date(msg.createdAt)
                .toDateString() === today

            ).length;

    }

    renderRecentMessages(data);

}



function renderRecentMessages(data) {

    const table =
        document.getElementById(
            "recentMessageTable"
        );

    if (!table) return;

    table.innerHTML = "";

    data
        .slice()
        .reverse()
        .slice(0, 5)
        .forEach(message => {

            table.innerHTML += `

            <tr>

                <td>

                    ${formatDate(message.createdAt)}

                </td>

                <td>

                    ${message.vendor?.vendorName || "-"}

                </td>

                <td>

                    ${message.subject}

                </td>

                <td>

                    ${message.status}

                </td>

            </tr>

            `;

        });

}



function searchMessages() {

    const keyword =
        searchInput.value
        .trim()
        .toLowerCase();

    if (!keyword) {

        renderMessageTable(messages);

        return;

    }

    const filtered = messages.filter(msg =>

        msg.subject
            .toLowerCase()
            .includes(keyword)

        ||

        (msg.vendor?.vendorName || "")
            .toLowerCase()
            .includes(keyword)

        ||

        msg.message
            .toLowerCase()
            .includes(keyword)

    );

    renderMessageTable(filtered);

}

if (searchBtn) {

    searchBtn.addEventListener(

        "click",

        searchMessages

    );

}

if (searchInput) {

    searchInput.addEventListener(

        "keyup",

        searchMessages

    );

}




if (messageForm) {

    messageForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const messageData = {

            vendor: document.getElementById("vendor").value,

            subject: document.getElementById("subject").value.trim(),

            priority: document.getElementById("priority").value,

            status: document.getElementById("status").value,

            message: document.getElementById("message").value.trim()

        };

        const editMessageData = JSON.parse(
            localStorage.getItem("editMessage")
        );

        const isEditMode =
            window.location.search.includes("edit=true") &&
            editMessageData;

        try {

            showLoading();

            let response;

            if (isEditMode) {

                response = await fetch(

                    `${API_BASE}/messages/${editMessageData._id}`,

                    {

                        method: "PUT",

                        headers,

                        body: JSON.stringify(messageData)

                    }

                );

            } else {

                response = await fetch(

                    `${API_BASE}/messages`,

                    {

                        method: "POST",

                        headers,

                        body: JSON.stringify(messageData)

                    }

                );

            }

            const result = await response.json();

            hideLoading();

            if (result.success) {

                showToast(

                    isEditMode
                        ? "Message updated successfully."
                        : "Message sent successfully.",

                    "#16a34a"

                );

                localStorage.removeItem("editMessage");

                messageForm.reset();

                setTimeout(() => {

                    window.location.href =
                        "/messages";

                }, 1000);

            } else {

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
                "Unable to save message.",
                "#dc2626"
            );

        }

    });

}



async function deleteMessage(id) {

    if (!confirmAction("Delete this message?")) {

        return;

    }

    try {

        showLoading();

        const response = await fetch(

            `${API_BASE}/messages/${id}`,

            {

                method: "DELETE",

                headers

            }

        );

        const result = await response.json();

        hideLoading();

        if (result.success) {

            showToast(
                "Message deleted.",
                "#16a34a"
            );

            loadMessages();

        } else {

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



async function markAsRead(id) {

    try {

        await fetch(

            `${API_BASE}/messages/${id}`,

            {

                method: "PUT",

                headers,

                body: JSON.stringify({

                    status: "Read"

                })

            }

        );

        loadMessages();

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to update message.",
            "#dc2626"
        );

    }

}



async function editMessage(id) {

    try {

        const result = await apiFetch(

            `${API_BASE}/messages/${id}`

        );

        localStorage.setItem(

            "editMessage",

            JSON.stringify(result.data)

        );

        window.location.href =
            "/addMessage.html?edit=true";

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to load message.",
            "#dc2626"
        );

    }

}



function initializeEditMode() {

    if (!messageForm) return;

    const message = JSON.parse(

        localStorage.getItem("editMessage")

    );

    if (!message) return;

    document.title =
        "Update Message | VendorLink";

    document.getElementById("pageHeading").innerText =
        "Update Message";

    messageForm.querySelector(

        "button[type='submit']"

    ).innerText =
        "Update Message";

    document.getElementById("vendor").value =
        message.vendor._id || message.vendor;

    document.getElementById("subject").value =
        message.subject;

    document.getElementById("priority").value =
        message.priority;

    document.getElementById("status").value =
        message.status;

    document.getElementById("message").value =
        message.message;

}



document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (vendorSelect) {

            await loadVendors();

            initializeEditMode();

        }

        if (messageTable) {

            loadMessages();

        }

    }

);

