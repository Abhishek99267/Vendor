// // =============================================
// // VendorLink Purchase Module
// // =============================================

// // =============================================
// // DOM Elements
// // =============================================

// const purchaseForm = document.getElementById("purchaseForm");

// const purchaseTable = document.getElementById("purchaseTable");

// const vendorSelect = document.getElementById("vendor");

// const quantityInput = document.getElementById("quantity");

// const unitPriceInput = document.getElementById("unitPrice");

// const totalAmountInput = document.getElementById("totalAmount");

// const searchInput = document.getElementById("searchOrder");

// const statusFilter = document.getElementById("statusFilter");

// const searchBtn = document.getElementById("searchBtn");

// const logoutBtn = document.getElementById("logoutBtn");

// const sidebarLogout = document.getElementById("sidebarLogout");

// // =============================================
// // Logout
// // =============================================

// if (logoutBtn) {

//     logoutBtn.addEventListener("click", logout);

// }

// if (sidebarLogout) {

//     sidebarLogout.addEventListener("click", logout);

// }

// // =============================================
// // Auto Calculate Total Amount
// // =============================================

// function calculateTotal() {

//     if (!quantityInput || !unitPriceInput || !totalAmountInput) {

//         return;

//     }

//     const quantity = Number(quantityInput.value) || 0;

//     const unitPrice = Number(unitPriceInput.value) || 0;

//     totalAmountInput.value = quantity * unitPrice;

// }

// if (quantityInput) {

//     quantityInput.addEventListener("input", calculateTotal);

// }

// if (unitPriceInput) {

//     unitPriceInput.addEventListener("input", calculateTotal);

// }

// // =============================================
// // Load Vendors Dropdown
// // =============================================

// async function loadVendorsDropdown() {

//     if (!vendorSelect) return;

//     try {

//         const result = await apiFetch(

//             `${API_BASE}/vendors`

//         );

//         vendorSelect.innerHTML =

//             `<option value="">Select Vendor</option>`;

//         result.data.forEach(vendor => {

//             vendorSelect.innerHTML += `

//                 <option value="${vendor._id}">

//                     ${vendor.vendorName}

//                     (${vendor.companyName})

//                 </option>

//             `;

//         });

//     }

//     catch (error) {

//         console.error(error);

//         showToast(

//             "Unable to load vendors.",

//             "#dc2626"

//         );

//     }

// }

// // =============================================
// // Load Purchase Orders
// // =============================================

// async function loadPurchaseOrders() {

//     if (!purchaseTable) return;

//     try {

//         showLoading();

//         const result = await apiFetch(

//             `${API_BASE}/orders`

//         );

//         hideLoading();

//         renderPurchaseTable(result.data);

//         updatePurchaseStatistics(result.data);

//     }

//     catch (error) {

//         hideLoading();

//         console.error(error);

//         showToast(

//             "Unable to load purchase orders.",

//             "#dc2626"

//         );

//     }

// }

// // =============================================
// // Render Purchase Table
// // =============================================

// function renderPurchaseTable(orders) {

//     if (!purchaseTable) return;

//     if (!orders.length) {

//         purchaseTable.innerHTML = `

//         <tr>

//             <td colspan="7"
//                 style="text-align:center;">

//                 No Purchase Orders Found

//             </td>

//         </tr>

//         `;

//         return;

//     }

//     purchaseTable.innerHTML = "";

//     orders.forEach(order => {

//         purchaseTable.innerHTML += `

//         <tr>

//             <td>${order.poNumber}</td>

//             <td>

//                 ${order.vendor?.vendorName || "N/A"}

//             </td>

//             <td>${order.productName}</td>

//             <td>${order.quantity}</td>

//             <td>

//                 ${formatCurrency(order.totalAmount)}

//             </td>

//             <td>

//                 <span class="badge

//                     ${

//                         order.status === "Delivered"

//                         ? "badge-success"

//                         : order.status === "Pending"

//                         ? "badge-warning"

//                         : order.status === "Approved"

//                         ? "badge-info"

//                         : "badge-danger"

//                     }">

//                     ${order.status}

//                 </span>

//             </td>

//             <td>

//                 <button
//                     class="btn-edit"
//                     onclick="editPurchase('${order._id}')">

//                     Edit

//                 </button>

//                 <button
//                     class="btn-delete"
//                     onclick="deletePurchase('${order._id}')">

//                     Delete

//                 </button>

//             </td>

//         </tr>

//         `;

//     });

// }

// // =============================================
// // Purchase Statistics
// // =============================================

// function updatePurchaseStatistics(orders) {

//     const totalOrders =
//         document.getElementById("totalOrders");

//     const pendingOrders =
//         document.getElementById("pendingOrders");

//     const completedOrders =
//         document.getElementById("completedOrders");

//     const purchaseAmount =
//         document.getElementById("purchaseAmount");

//     const monthlyOrders =
//         document.getElementById("monthlyOrders");

//     const monthlyAmount =
//         document.getElementById("monthlyAmount");

//     if (totalOrders)
//         totalOrders.innerText = orders.length;

//     if (pendingOrders)
//         pendingOrders.innerText =

//             orders.filter(

//                 order => order.status === "Pending"

//             ).length;

//     if (completedOrders)
//         completedOrders.innerText =

//             orders.filter(

//                 order => order.status === "Delivered"

//             ).length;

//     const total = orders.reduce(

//         (sum, order) =>

//             sum + Number(order.totalAmount),

//         0

//     );

//     if (purchaseAmount)
//         purchaseAmount.innerText =

//             formatCurrency(total);

//     // Monthly Report

//     const currentMonth =

//         new Date().getMonth();

//     const currentYear =

//         new Date().getFullYear();

//     const monthly = orders.filter(order => {

//         const date = new Date(order.orderDate);

//         return (

//             date.getMonth() === currentMonth &&

//             date.getFullYear() === currentYear

//         );

//     });

//     if (monthlyOrders)
//         monthlyOrders.innerText =

//             monthly.length;

//     if (monthlyAmount)
//         monthlyAmount.innerText =

//             formatCurrency(

//                 monthly.reduce(

//                     (sum, order) =>

//                         sum + Number(order.totalAmount),

//                     0

//                 )

//             );

// }

// // =============================================
// // Initialize
// // =============================================

// document.addEventListener(

//     "DOMContentLoaded",

//     () => {

//         loadVendorsDropdown();

//         loadPurchaseOrders();

//     }

// );

// // =============================================
// // Search Purchase Orders
// // =============================================

// async function searchPurchaseOrders() {

//     const keyword = searchInput ?
//         searchInput.value.trim() : "";

//     const status = statusFilter ?
//         statusFilter.value : "";

//     try {

//         showLoading();

//         const result = await apiFetch(

//             `${API_BASE}/orders`

//         );

//         hideLoading();

//         let orders = result.data;

//         // Search
//         if (keyword) {

//             const search = keyword.toLowerCase();

//             orders = orders.filter(order =>

//                 order.poNumber.toLowerCase().includes(search) ||

//                 order.productName.toLowerCase().includes(search) ||

//                 (order.vendor?.vendorName || "")
//                 .toLowerCase()
//                 .includes(search)

//             );

//         }

//         // Status Filter
//         if (status) {

//             orders = orders.filter(

//                 order => order.status === status

//             );

//         }

//         renderPurchaseTable(orders);

//         updatePurchaseStatistics(orders);

//     }

//     catch (error) {

//         hideLoading();

//         console.error(error);

//         showToast(

//             "Search failed.",

//             "#dc2626"

//         );

//     }

// }

// // =============================================
// // Search Events
// // =============================================

// if (searchBtn) {

//     searchBtn.addEventListener(

//         "click",

//         searchPurchaseOrders

//     );

// }

// if (searchInput) {

//     searchInput.addEventListener(

//         "keyup",

//         searchPurchaseOrders

//     );

// }

// if (statusFilter) {

//     statusFilter.addEventListener(

//         "change",

//         searchPurchaseOrders

//     );

// }

// // =============================================
// // Add Purchase Order
// // =============================================

// if (purchaseForm) {

//     purchaseForm.addEventListener(

//         "submit",

//         async (e) => {

//             e.preventDefault();

//             const purchaseData = {

//                 poNumber:
//                     document.getElementById("poNumber").value.trim(),

//                 vendor:
//                     document.getElementById("vendor").value,

//                 productName:
//                     document.getElementById("productName").value.trim(),

//                 category:
//                     document.getElementById("category").value,

//                 quantity:
//                     Number(document.getElementById("quantity").value),

//                 unitPrice:
//                     Number(document.getElementById("unitPrice").value),

//                 totalAmount:
//                     Number(document.getElementById("totalAmount").value),

//                 status:
//                     document.getElementById("status").value,

//                 orderDate:
//                     document.getElementById("orderDate").value,

//                 deliveryDate:
//                     document.getElementById("deliveryDate").value,

//                 notes:
//                     document.getElementById("notes").value.trim()

//             };

//             try {

//                 showLoading();

//                 const response = await fetch(

//                     `${API_BASE}/orders`,

//                     {

//                         method: "POST",

//                         headers,

//                         body: JSON.stringify(

//                             purchaseData

//                         )

//                     }

//                 );

//                 const result =
//                     await response.json();

//                 hideLoading();

//                 if (result.success) {

//                     showToast(

//                         "Purchase Order Created",

//                         "#16a34a"

//                     );

//                     purchaseForm.reset();

//                     setTimeout(() => {

//                         window.location.href =
//                             "/purchaseOrders";

//                     }, 1200);

//                 }

//                 else {

//                     showToast(

//                         result.message,

//                         "#dc2626"

//                     );

//                 }

//             }

//             catch (error) {

//                 hideLoading();

//                 console.error(error);

//                 showToast(

//                     "Unable to create purchase order.",

//                     "#dc2626"

//                 );

//             }

//         }

//     );

// }

// // =============================================
// // Delete Purchase
// // =============================================

// async function deletePurchase(id) {

//     if (

//         !confirmAction(

//             "Delete this purchase order?"

//         )

//     ) return;

//     try {

//         showLoading();

//         const response = await fetch(

//             `${API_BASE}/orders/${id}`,

//             {

//                 method: "DELETE",

//                 headers

//             }

//         );

//         const result =
//             await response.json();

//         hideLoading();

//         if (result.success) {

//             showToast(

//                 "Purchase Order Deleted",

//                 "#16a34a"

//             );

//             loadPurchaseOrders();

//         }

//         else {

//             showToast(

//                 result.message,

//                 "#dc2626"

//             );

//         }

//     }

//     catch (error) {

//         hideLoading();

//         console.error(error);

//         showToast(

//             "Delete failed.",

//             "#dc2626"

//         );

//     }

// }

// // =============================================
// // Edit Purchase
// // =============================================

// // function editPurchase(id) {

// //     window.location.href =
// //         `/addPurchase.html?id=${id}`;

// // }
// async function editPurchase(id) {

//     try {

//         const result =
//             await apiFetch(

//                 `${API_BASE}/orders/${id}`

//             );

//         if (!result.success) {

//             showToast(

//                 result.message,

//                 "#dc2626"

//             );

//             return;

//         }

//         localStorage.setItem(

//             "editPurchase",

//             JSON.stringify(result.data)

//         );

//         window.location.href =
//             "/addPurchase.html?edit=true";

//     }

//     catch (error) {

//         console.error(error);

//         showToast(

//             "Unable to load purchase order.",

//             "#dc2626"

//         );

//     }

// }

// // =============================================
// // Initialize Edit Mode
// // =============================================

// function initializeEditMode() {

//     if (!purchaseForm) return;

//     const params =
//         new URLSearchParams(
//             window.location.search
//         );

//     if (!params.has("edit")) return;

//     const purchase =
//         JSON.parse(

//             localStorage.getItem(
//                 "editPurchase"
//             )

//         );

//     if (!purchase) return;

//     document.getElementById("poNumber").value =
//         purchase.poNumber;

//     document.getElementById("vendor").value =
//         purchase.vendor._id || purchase.vendor;

//     document.getElementById("productName").value =
//         purchase.productName;

//     document.getElementById("category").value =
//         purchase.category;

//     document.getElementById("quantity").value =
//         purchase.quantity;

//     document.getElementById("unitPrice").value =
//         purchase.unitPrice;

//     document.getElementById("totalAmount").value =
//         purchase.totalAmount;

//     document.getElementById("status").value =
//         purchase.status;

//     document.getElementById("orderDate").value =
//         purchase.orderDate.substring(0,10);

//     document.getElementById("deliveryDate").value =
//         purchase.deliveryDate.substring(0,10);

//     document.getElementById("notes").value =
//         purchase.notes;

//     document.title =
//         "Update Purchase Order | VendorLink";

//     document.getElementById("pageHeading").innerText =
//         "Update Purchase Order";

//     purchaseForm.querySelector(

//         "button[type='submit']"

//     ).innerText =
//         "Update Purchase Order";

// }




// ======================================================
// VendorLink - Purchase Module
// ======================================================

// ======================================================
// DOM Elements first cut de diya
// ======================================================

// const purchaseForm = document.getElementById("purchaseForm");
// const purchaseTable = document.getElementById("purchaseTable");

// const vendorSelect = document.getElementById("vendor");
// const quantityInput = document.getElementById("quantity");
// const unitPriceInput = document.getElementById("unitPrice");
// const totalAmountInput = document.getElementById("totalAmount");

// const searchInput = document.getElementById("searchOrder");
// const statusFilter = document.getElementById("statusFilter");
// const searchBtn = document.getElementById("searchBtn");

// const logoutBtn = document.getElementById("logoutBtn");
// const sidebarLogout = document.getElementById("sidebarLogout");

// // ======================================================
// // Logout
// // ======================================================

// if (logoutBtn) {

//     logoutBtn.addEventListener("click", logout);

// }

// if (sidebarLogout) {

//     sidebarLogout.addEventListener("click", logout);

// }

// // ======================================================
// // Auto Calculate Total
// // ======================================================

// function calculateTotal() {

//     if (
//         !quantityInput ||
//         !unitPriceInput ||
//         !totalAmountInput
//     ) return;

//     const quantity =
//         Number(quantityInput.value) || 0;

//     const unitPrice =
//         Number(unitPriceInput.value) || 0;

//     totalAmountInput.value =
//         quantity * unitPrice;

// }

// if (quantityInput) {

//     quantityInput.addEventListener(
//         "input",
//         calculateTotal
//     );

// }

// if (unitPriceInput) {

//     unitPriceInput.addEventListener(
//         "input",
//         calculateTotal
//     );

// }

// // ======================================================
// // Load Vendors Dropdown
// // ======================================================

// async function loadVendorsDropdown() {

//     if (!vendorSelect) return;

//     try {

//         const result = await apiFetch(

//             `${API_BASE}/vendors`

//         );

//         vendorSelect.innerHTML =
//             `<option value="">Select Vendor</option>`;

//         result.data.forEach(vendor => {

//             vendorSelect.innerHTML += `

//             <option value="${vendor._id}">

//                 ${vendor.vendorName}
//                 (${vendor.companyName})

//             </option>

//             `;

//         });

//     }

//     catch (error) {

//         console.error(error);

//         showToast(

//             "Unable to load vendors.",

//             "#dc2626"

//         );

//     }

// }

// // ======================================================
// // Load Purchase Orders
// // ======================================================

// async function loadPurchaseOrders() {

//     if (!purchaseTable) return;

//     try {

//         showLoading();

//         const result =
//             await apiFetch(

//                 `${API_BASE}/orders`

//             );

//         hideLoading();

//         renderPurchaseTable(

//             result.data

//         );

//         updateStatistics(

//             result.data

//         );

//     }

//     catch (error) {

//         hideLoading();

//         console.error(error);

//         showToast(

//             "Unable to load purchase orders.",

//             "#dc2626"

//         );

//     }

// }

// // ======================================================
// // Render Purchase Table
// // ======================================================

// function renderPurchaseTable(orders) {

//     if (!purchaseTable) return;

//     if (!orders || orders.length === 0) {

//         purchaseTable.innerHTML = `

//             <tr>

//                 <td colspan="7"
//                     style="text-align:center;">

//                     No Purchase Orders Found

//                 </td>

//             </tr>

//         `;

//         return;

//     }

//     purchaseTable.innerHTML = "";

//     orders.forEach(order => {

//         purchaseTable.innerHTML += `

//         <tr>

//             <td>${order.poNumber}</td>

//             <td>

//                 ${order.vendor?.vendorName || "N/A"}

//             </td>

//             <td>${order.productName}</td>

//             <td>${order.quantity}</td>

//             <td>

//                 ${formatCurrency(order.totalAmount)}

//             </td>

//             <td>

//                 ${getStatusBadge(order.status)}

//             </td>

//             <td>

//                 <button
//                     class="btn btn-primary btn-sm"
//                     onclick="editPurchase('${order._id}')">

//                     Edit

//                 </button>

//                 <button
//                     class="btn btn-danger btn-sm"
//                     onclick="deletePurchase('${order._id}')">

//                     Delete

//                 </button>

//             </td>

//         </tr>

//         `;

//     });

// }

// // ======================================================
// // Status Badge
// // ======================================================

// function getStatusBadge(status) {

//     switch (status) {

//         case "Pending":

//             return `<span class="badge badge-warning">
//                         Pending
//                     </span>`;

//         case "Approved":

//             return `<span class="badge badge-primary">
//                         Approved
//                     </span>`;

//         case "Delivered":

//             return `<span class="badge badge-success">
//                         Delivered
//                     </span>`;

//         case "Cancelled":

//             return `<span class="badge badge-danger">
//                         Cancelled
//                     </span>`;

//         default:

//             return status;

//     }

// }

// // ======================================================
// // Statistics
// // ======================================================

// function updateStatistics(orders) {

//     const totalOrders =
//         document.getElementById("totalOrders");

//     const pendingOrders =
//         document.getElementById("pendingOrders");

//     const completedOrders =
//         document.getElementById("completedOrders");

//     const purchaseAmount =
//         document.getElementById("purchaseAmount");

//     if (totalOrders) {

//         totalOrders.innerText = orders.length;

//     }

//     if (pendingOrders) {

//         pendingOrders.innerText =

//             orders.filter(

//                 order => order.status === "Pending"

//             ).length;

//     }

//     if (completedOrders) {

//         completedOrders.innerText =

//             orders.filter(

//                 order =>

//                     order.status === "Delivered"

//             ).length;

//     }

//     if (purchaseAmount) {

//         const total = orders.reduce(

//             (sum, order) =>

//                 sum + Number(order.totalAmount),

//             0

//         );

//         purchaseAmount.innerText =

//             formatCurrency(total);

//     }

//     updateMonthlyReport(orders);

// }

// // ======================================================
// // Monthly Report
// // ======================================================

// function updateMonthlyReport(orders) {

//     const monthlyOrders =
//         document.getElementById("monthlyOrders");

//     const monthlyAmount =
//         document.getElementById("monthlyAmount");

//     if (!monthlyOrders || !monthlyAmount) {

//         return;

//     }

//     const today = new Date();

//     const currentMonth = today.getMonth();

//     const currentYear = today.getFullYear();

//     const currentMonthOrders = orders.filter(order => {

//         const orderDate = new Date(order.orderDate);

//         return (

//             orderDate.getMonth() === currentMonth &&

//             orderDate.getFullYear() === currentYear

//         );

//     });

//     monthlyOrders.innerText =

//         currentMonthOrders.length;

//     const total = currentMonthOrders.reduce(

//         (sum, order) =>

//             sum + Number(order.totalAmount),

//         0

//     );

//     monthlyAmount.innerText =

//         formatCurrency(total);

// }

// // ======================================================
// // Search & Filter Purchase Orders
// // ======================================================

// let purchaseOrders = [];

// async function refreshPurchaseOrders() {

//     try {

//         const result = await apiFetch(
//             `${API_BASE}/orders`
//         );

//         purchaseOrders = result.data;

//         applyFilters();

//     }

//     catch (error) {

//         console.error(error);

//         showToast(
//             "Unable to refresh purchase orders.",
//             "#dc2626"
//         );

//     }

// }

// function applyFilters() {

//     let filtered = [...purchaseOrders];

//     // Search

//     if (searchInput && searchInput.value.trim()) {

//         const keyword =
//             searchInput.value
//             .trim()
//             .toLowerCase();

//         filtered = filtered.filter(order =>

//             order.poNumber
//                 .toLowerCase()
//                 .includes(keyword)

//             ||

//             order.productName
//                 .toLowerCase()
//                 .includes(keyword)

//             ||

//             (order.vendor?.vendorName || "")
//                 .toLowerCase()
//                 .includes(keyword)

//         );

//     }

//     // Status Filter

//     if (

//         statusFilter &&

//         statusFilter.value

//     ) {

//         filtered = filtered.filter(order =>

//             order.status === statusFilter.value

//         );

//     }

//     renderPurchaseTable(filtered);

//     updateStatistics(filtered);

// }

// if (searchBtn) {

//     searchBtn.addEventListener(

//         "click",

//         applyFilters

//     );

// }

// if (searchInput) {

//     searchInput.addEventListener(

//         "keyup",

//         applyFilters

//     );

// }

// if (statusFilter) {

//     statusFilter.addEventListener(

//         "change",

//         applyFilters

//     );

// }

// // ======================================================
// // Add / Update Purchase Order
// // ======================================================

// if (purchaseForm) {

//     purchaseForm.addEventListener(

//         "submit",

//         async (e) => {

//             e.preventDefault();

//             // const purchaseData = {

//             //     poNumber:
//             //         document.getElementById("poNumber").value.trim(),

//             //     vendor:
//             //         document.getElementById("vendor").value,

//             //     productName:
//             //         document.getElementById("productName").value.trim(),

//             //     category:
//             //         document.getElementById("category").value,

//             //     quantity:
//             //         Number(document.getElementById("quantity").value),

//             //     unitPrice:
//             //         Number(document.getElementById("unitPrice").value),

//             //     totalAmount:
//             //         Number(document.getElementById("totalAmount").value),

//             //     status:
//             //         document.getElementById("status").value,

//             //     orderDate:
//             //         document.getElementById("orderDate").value,

//             //     deliveryDate:
//             //         document.getElementById("deliveryDate").value,

//             //     notes:
//             //         document.getElementById("notes").value.trim()

//             // };
//             const purchaseData = {

//     purchaseOrderNo:
//         document.getElementById("poNumber").value.trim(),

//     vendor:
//         document.getElementById("vendor").value,

//     productName:
//         document.getElementById("productName").value.trim(),

//     category:
//         document.getElementById("category").value,

//     quantity:
//         Number(document.getElementById("quantity").value),

//     unitPrice:
//         Number(document.getElementById("unitPrice").value),

//     totalAmount:
//         Number(document.getElementById("totalAmount").value),

//     status:
//         document.getElementById("status").value,

//     orderDate:
//         document.getElementById("orderDate").value,

//     expectedDeliveryDate:
//         document.getElementById("deliveryDate").value,

//     notes:
//         document.getElementById("notes").value.trim()

// };

//             const editPurchase = JSON.parse(

//                 localStorage.getItem("editPurchase")

//             );

//             const isEditMode =

//                 window.location.search.includes("edit=true")

//                 &&

//                 editPurchase;

//             try {

//                 showLoading();

//                 let response;

//                 if (isEditMode) {

//                     response = await fetch(

//                         `${API_BASE}/orders/${editPurchase._id}`,

//                         {

//                             method: "PUT",

//                             headers,

//                             body: JSON.stringify(

//                                 purchaseData

//                             )

//                         }

//                     );

//                 }

//                 else {

//                     response = await fetch(

//                         `${API_BASE}/orders`,

//                         {

//                             method: "POST",

//                             headers,

//                             body: JSON.stringify(

//                                 purchaseData

//                             )

//                         }

//                     );

//                 }

//                 const result =
//                     await response.json();

//                 hideLoading();

//                 if (result.success) {

//                     showToast(

//                         isEditMode

//                         ?

//                         "Purchase Order Updated"

//                         :

//                         "Purchase Order Created",

//                         "#16a34a"

//                     );

//                     localStorage.removeItem(

//                         "editPurchase"

//                     );

//                     purchaseForm.reset();

//                     setTimeout(() => {

//                         window.location.href =

//                             "/purchaseOrders";

//                     }, 1000);

//                 }

//                 else {

//                     showToast(

//                         result.message,

//                         "#dc2626"

//                     );

//                 }

//             }

//             catch (error) {

//                 hideLoading();

//                 console.error(error);

//                 showToast(

//                     "Unable to save purchase order.",

//                     "#dc2626"

//                 );

//             }

//         }

//     );

// }

// // ======================================================
// // Delete Purchase Order
// // ======================================================

// async function deletePurchase(id) {

//     if (

//         !confirmAction(

//             "Delete this purchase order?"

//         )

//     ) {

//         return;

//     }

//     try {

//         showLoading();

//         const response = await fetch(

//             `${API_BASE}/orders/${id}`,

//             {

//                 method: "DELETE",

//                 headers

//             }

//         );

//         const result = await response.json();

//         hideLoading();

//         if (result.success) {

//             showToast(

//                 "Purchase Order Deleted",

//                 "#16a34a"

//             );

//             refreshPurchaseOrders();

//         }

//         else {

//             showToast(

//                 result.message,

//                 "#dc2626"

//             );

//         }

//     }

//     catch (error) {

//         hideLoading();

//         console.error(error);

//         showToast(

//             "Delete failed.",

//             "#dc2626"

//         );

//     }

// }

// // ======================================================
// // Edit Purchase Order
// // ======================================================

// async function editPurchase(id) {

//     try {

//         const result = await apiFetch(

//             `${API_BASE}/orders/${id}`

//         );

//         localStorage.setItem(

//             "editPurchase",

//             JSON.stringify(result.data)

//         );

//         window.location.href =

//             "/addPurchase.html?edit=true";

//     }

//     catch (error) {

//         console.error(error);

//         showToast(

//             "Unable to load purchase order.",

//             "#dc2626"

//         );

//     }

// }

// // ======================================================
// // Initialize Edit Mode
// // ======================================================

// function initializeEditMode() {

//     if (!purchaseForm) return;

//     const purchase = JSON.parse(

//         localStorage.getItem("editPurchase")

//     );

//     if (!purchase) return;

//     document.title =

//         "Update Purchase Order | VendorLink";

//     document.getElementById("pageHeading").innerText =

//         "Update Purchase Order";

//     purchaseForm.querySelector(

//         "button[type='submit']"

//     ).innerText =

//         "Update Purchase Order";

//     document.getElementById("poNumber").value =
//         purchase.poNumber;

//     document.getElementById("vendor").value =
//         purchase.vendor._id || purchase.vendor;

//     document.getElementById("productName").value =
//         purchase.productName;

//     document.getElementById("category").value =
//         purchase.category;

//     document.getElementById("quantity").value =
//         purchase.quantity;

//     document.getElementById("unitPrice").value =
//         purchase.unitPrice;

//     document.getElementById("totalAmount").value =
//         purchase.totalAmount;

//     document.getElementById("status").value =
//         purchase.status;

//     document.getElementById("orderDate").value =
//         purchase.orderDate.substring(0, 10);

//     document.getElementById("deliveryDate").value =
//         purchase.deliveryDate.substring(0, 10);

//     document.getElementById("notes").value =
//         purchase.notes || "";

// }

// // ======================================================
// // Initialize
// // ======================================================

// document.addEventListener(

//     "DOMContentLoaded",

//     async () => {

//         if (vendorSelect) {

//             await loadVendorsDropdown();

//             initializeEditMode();

//         }

//         if (purchaseTable) {

//             await refreshPurchaseOrders();

//         }

//     }

// );






// dusra cut
// ======================================================
// PURCHASE.JS
// VendorLink Purchase Module
// ======================================================

const purchaseForm = document.getElementById("purchaseForm");
const purchaseTable = document.getElementById("purchaseTable");

const vendorSelect = document.getElementById("vendor");
const quantityInput = document.getElementById("quantity");
const unitPriceInput = document.getElementById("unitPrice");
const totalAmountInput = document.getElementById("totalAmount");

const searchInput = document.getElementById("searchOrder");
const statusFilter = document.getElementById("statusFilter");
const searchBtn = document.getElementById("searchBtn");

const logoutBtn = document.getElementById("logoutBtn");
const sidebarLogout = document.getElementById("sidebarLogout");

let purchaseOrders = [];

// ======================================================
// Logout
// ======================================================

if (logoutBtn) logoutBtn.addEventListener("click", logout);

if (sidebarLogout) sidebarLogout.addEventListener("click", logout);

// ======================================================
// Auto Calculate Total
// ======================================================

function calculateTotal() {

    const qty = Number(quantityInput?.value) || 0;

    const price = Number(unitPriceInput?.value) || 0;

    if(totalAmountInput){

        totalAmountInput.value = qty * price;

    }

}

quantityInput?.addEventListener("input", calculateTotal);

unitPriceInput?.addEventListener("input", calculateTotal);

// ======================================================
// Load Vendors
// ======================================================

async function loadVendorsDropdown(){

    if(!vendorSelect) return;

    try{

        const result = await apiFetch(`${API_BASE}/vendors`);

        vendorSelect.innerHTML =
        `<option value="">Select Vendor</option>`;

        result.data.forEach(vendor=>{

            vendorSelect.innerHTML += `

            <option value="${vendor._id}">

                ${vendor.vendorName}
                (${vendor.companyName})

            </option>

            `;

        });

    }

    catch(err){

        console.error(err);

        showToast(
            "Unable to load vendors",
            "#dc2626"
        );

    }

}

// ======================================================
// Load Orders
// ======================================================

async function refreshPurchaseOrders(){

    try{

        showLoading();

        const result =
        await apiFetch(`${API_BASE}/orders`);

        purchaseOrders = result.data;

        hideLoading();

        applyFilters();

    }

    catch(err){

        hideLoading();

        console.error(err);

        showToast(
            "Unable to load purchase orders",
            "#dc2626"
        );

    }

}

// ======================================================
// Render Table
// ======================================================

function renderPurchaseTable(orders){

    if(!purchaseTable) return;

    if(!orders.length){

        purchaseTable.innerHTML=`

        <tr>

            <td colspan="8" style="text-align:center">

                No Purchase Orders Found

            </td>

        </tr>

        `;

        return;

    }

    purchaseTable.innerHTML="";

    orders.forEach(order=>{

        purchaseTable.innerHTML += `

<tr>

<td>

${order.purchaseOrderNo}

</td>

<td>

${order.vendor?.vendorName || "-"}

</td>

<td>

${order.productName}

</td>

<td>

${order.quantity}

</td>

<td>

${formatCurrency(order.totalAmount)}

</td>

<td>

${getStatusBadge(order.status)}

</td>

<td>

${new Date(order.expectedDeliveryDate)
.toLocaleDateString()}

</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="editPurchase('${order._id}')">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="deletePurchase('${order._id}')">

Delete

</button>

</td>

</tr>

`;

    });

}

// ======================================================
// Status Badge
// ======================================================

function getStatusBadge(status){

    switch(status){

        case "Pending":

        return `<span class="badge badge-warning">
        Pending
        </span>`;

        case "Approved":

        return `<span class="badge badge-primary">
        Approved
        </span>`;

        case "Processing":

        return `<span class="badge badge-info">
        Processing
        </span>`;

        case "Shipped":

        return `<span class="badge badge-info">
        Shipped
        </span>`;

        case "Delivered":

        return `<span class="badge badge-success">
        Delivered
        </span>`;

        case "Cancelled":

        return `<span class="badge badge-danger">
        Cancelled
        </span>`;

        default:

        return status;

    }

}
// ======================================================
// Statistics
// ======================================================

function updateStatistics(orders){

    const totalOrders =
    document.getElementById("totalOrders");

    const pendingOrders =
    document.getElementById("pendingOrders");

    const completedOrders =
    document.getElementById("completedOrders");

    const purchaseAmount =
    document.getElementById("purchaseAmount");

    if(totalOrders){

        totalOrders.innerText =
        orders.length;

    }

    if(pendingOrders){

        pendingOrders.innerText =

        orders.filter(order=>

            order.status==="Pending"

        ).length;

    }

    if(completedOrders){

        completedOrders.innerText =

        orders.filter(order=>

            order.status==="Delivered"

        ).length;

    }

    if(purchaseAmount){

        const total = orders.reduce(

            (sum,order)=>

            sum + Number(order.totalAmount),

            0

        );

        purchaseAmount.innerText =
        formatCurrency(total);

    }

}

// ======================================================
// Search + Filter
// ======================================================

function applyFilters(){

    let filtered=[...purchaseOrders];

    if(searchInput && searchInput.value.trim()){

        const keyword =
        searchInput.value
        .toLowerCase()
        .trim();

        filtered = filtered.filter(order=>

            order.purchaseOrderNo
            .toLowerCase()
            .includes(keyword)

            ||

            order.productName
            .toLowerCase()
            .includes(keyword)

            ||

            (order.vendor?.vendorName || "")
            .toLowerCase()
            .includes(keyword)

        );

    }

    if(statusFilter && statusFilter.value){

        filtered = filtered.filter(order=>

            order.status===statusFilter.value

        );

    }

    renderPurchaseTable(filtered);

    updateStatistics(filtered);

}

searchBtn?.addEventListener(

"click",

applyFilters

);

searchInput?.addEventListener(

"keyup",

applyFilters

);

statusFilter?.addEventListener(

"change",

applyFilters

);

// ======================================================
// CREATE / UPDATE PURCHASE ORDER
// ======================================================

if(purchaseForm){

purchaseForm.addEventListener(

"submit",

async(e)=>{

e.preventDefault();

const purchaseData={

vendor:

document.getElementById("vendor").value,

purchaseOrderNo:

document.getElementById("poNumber")
.value.trim(),

productName:

document.getElementById("productName")
.value.trim(),

description:

document.getElementById("notes")
.value.trim(),

quantity:

Number(
document.getElementById("quantity").value
),

unitPrice:

Number(
document.getElementById("unitPrice").value
),

totalAmount:

Number(
document.getElementById("totalAmount").value
),

orderDate:

document.getElementById("orderDate").value,

expectedDeliveryDate:

document.getElementById("deliveryDate").value,

status:

document.getElementById("status").value,

paymentStatus:"Pending",

remarks:

document.getElementById("notes")
.value.trim()

};

const editData=

JSON.parse(

localStorage.getItem(
"editPurchase"
)

);

const editMode=

window.location.search.includes("edit=true")

&&

editData;

try{

showLoading();

let response;

if(editMode){
    console.log(purchaseData);

response=await fetch(

`${API_BASE}/orders/${editData._id}`,

{

method:"PUT",

headers,

body:JSON.stringify(

purchaseData

)

}

);

}

else{

response=await fetch(

`${API_BASE}/orders`,

{

method:"POST",

headers,

body:JSON.stringify(

purchaseData

)

}

);

}

const result=

await response.json();

hideLoading();

if(result.success){

showToast(

editMode

?

"Purchase Order Updated"

:

"Purchase Order Created",

"#16a34a"

);

localStorage.removeItem(

"editPurchase"

);

purchaseForm.reset();

setTimeout(()=>{

window.location.href=

"/purchaseOrders";

},800);

}

else{

showToast(

result.message,

"#dc2626"

);

}

}

catch(error){

hideLoading();

console.error(error);

showToast(

"Unable to save purchase order.",

"#dc2626"

);

}

}

);

}

// ======================================================
// DELETE PURCHASE ORDER
// ======================================================

async function deletePurchase(id){

    const confirmDelete = confirm(
        "Are you sure you want to delete this Purchase Order?"
    );

    if(!confirmDelete) return;

    try{

        showLoading();

        const response = await fetch(

            `${API_BASE}/orders/${id}`,

            {

                method:"DELETE",

                headers

            }

        );

        const result = await response.json();

        hideLoading();

        if(result.success){

            showToast(

                "Purchase Order Deleted Successfully",

                "#16a34a"

            );

            refreshPurchaseOrders();

        }

        else{

            showToast(

                result.message,

                "#dc2626"

            );

        }

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(

            "Delete failed.",

            "#dc2626"

        );

    }

}

// ======================================================
// EDIT PURCHASE ORDER
// ======================================================

async function editPurchase(id){

    try{

        showLoading();

        const result = await apiFetch(

            `${API_BASE}/orders/${id}`

        );

        hideLoading();

        localStorage.setItem(

            "editPurchase",

            JSON.stringify(result.data)

        );

        window.location.href =

        "/addPurchase.html?edit=true";

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(

            "Unable to load Purchase Order.",

            "#dc2626"

        );

    }

}

// ======================================================
// INITIALIZE EDIT MODE
// ======================================================

function initializeEditMode(){

    if(!purchaseForm) return;

    const purchase = JSON.parse(

        localStorage.getItem("editPurchase")

    );

    if(!purchase) return;

    document.title =

    "Update Purchase Order | VendorLink";

    const heading =

    document.getElementById("pageHeading");

    if(heading){

        heading.innerText =

        "Update Purchase Order";

    }

    const submitBtn =

    purchaseForm.querySelector(

        "button[type='submit']"

    );

    if(submitBtn){

        submitBtn.innerText =

        "Update Purchase Order";

    }

    document.getElementById("poNumber").value =

    purchase.purchaseOrderNo || "";

    document.getElementById("vendor").value =

    purchase.vendor?._id || purchase.vendor;

    document.getElementById("productName").value =

    purchase.productName || "";

    document.getElementById("quantity").value =

    purchase.quantity || "";

    document.getElementById("unitPrice").value =

    purchase.unitPrice || "";

    document.getElementById("totalAmount").value =

    purchase.totalAmount || "";

    document.getElementById("status").value =

    purchase.status || "Pending";

    document.getElementById("notes").value =

    purchase.remarks || purchase.description || "";

    if(purchase.orderDate){

        document.getElementById("orderDate").value =

        purchase.orderDate.substring(0,10);

    }

    if(purchase.expectedDeliveryDate){

        document.getElementById("deliveryDate").value =

        purchase.expectedDeliveryDate.substring(0,10);

    }

}

// ======================================================
// RESET FORM
// ======================================================

function resetPurchaseForm(){

    if(!purchaseForm) return;

    purchaseForm.reset();

    if(totalAmountInput){

        totalAmountInput.value="";

    }

    localStorage.removeItem(

        "editPurchase"

    );

}

// ======================================================
// PAGE INITIALIZATION
// ======================================================

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        try{

            if(vendorSelect){

                await loadVendorsDropdown();

                initializeEditMode();

            }

            if(purchaseTable){

                await refreshPurchaseOrders();

            }

        }

        catch(error){

            console.error(error);

        }

    }

);

// ======================================================
// EXPORT TO GLOBAL
// ======================================================

window.editPurchase = editPurchase;

window.deletePurchase = deletePurchase;
