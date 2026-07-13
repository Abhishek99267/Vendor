
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



if (logoutBtn) logoutBtn.addEventListener("click", logout);

if (sidebarLogout) sidebarLogout.addEventListener("click", logout);



function calculateTotal() {

    const qty = Number(quantityInput?.value) || 0;

    const price = Number(unitPriceInput?.value) || 0;

    if(totalAmountInput){

        totalAmountInput.value = qty * price;

    }

}

quantityInput?.addEventListener("input", calculateTotal);

unitPriceInput?.addEventListener("input", calculateTotal);



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


window.editPurchase = editPurchase;

window.deletePurchase = deletePurchase;
