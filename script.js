/*
    JORTTANGEL GARMENTS
    M02 - PURCHASING & RESTOCKING

    Array-based system
    No database used.
*/


// ==========================================
// PURCHASE DATA ARRAY
// ==========================================

let purchases = [];


// ==========================================
// INVENTORY DATA ARRAY
// ==========================================

let inventory = [
    {
        material: "Fabric",
        quantity: 20,
        unit: "meters",
        minimum: 30
    },

    {
        material: "Buttons",
        quantity: 100,
        unit: "pcs",
        minimum: 50
    },

    {
        material: "Thread",
        quantity: 15,
        unit: "rolls",
        minimum: 10
    },

    {
        material: "Zippers",
        quantity: 40,
        unit: "pcs",
        minimum: 20
    },

    {
        material: "Lining",
        quantity: 25,
        unit: "meters",
        minimum: 20
    }
];


// ==========================================
// DOM ELEMENTS
// ==========================================

const purchaseForm =
    document.getElementById("purchaseForm");

const purchaseTable =
    document.getElementById("purchaseTable");

const stockList =
    document.getElementById("stockList");

const searchInput =
    document.getElementById("searchInput");

const resetBtn =
    document.getElementById("resetBtn");

const toast =
    document.getElementById("toast");


// ==========================================
// DISPLAY ELEMENTS
// ==========================================

const totalPurchases =
    document.getElementById("totalPurchases");

const materialsReceived =
    document.getElementById("materialsReceived");

const totalCost =
    document.getElementById("totalCost");

const inventoryStatus =
    document.getElementById("inventoryStatus");

const headerPurchases =
    document.getElementById("headerPurchases");

const headerMaterials =
    document.getElementById("headerMaterials");

const purchaseCount =
    document.getElementById("purchaseCount");


// ==========================================
// INITIAL INVENTORY COPY
// ==========================================

const originalInventory =
    JSON.parse(JSON.stringify(inventory));


// ==========================================
// RECORD PURCHASE
// ==========================================

purchaseForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get values from form

    const purchaseId =
        document.getElementById("purchaseId").value.trim();

    const supplier =
        document.getElementById("supplier").value;

    const material =
        document.getElementById("material").value;

    const quantity =
        Number(document.getElementById("quantity").value);

    const unit =
        document.getElementById("unit").value;

    const unitCost =
        Number(document.getElementById("cost").value);

    const remarks =
        document.getElementById("remarks").value.trim();


    // Validate

    if (
        purchaseId === "" ||
        supplier === "" ||
        material === "" ||
        quantity <= 0 ||
        unitCost < 0
    ) {

        alert("Please complete all required fields.");

        return;
    }


    // Check if Purchase ID already exists

    const duplicate =
        purchases.some(
            purchase => purchase.id === purchaseId
        );


    if (duplicate) {

        alert(
            "Purchase ID already exists. Please use another ID."
        );

        return;
    }


    // ==========================================
    // CREATE PURCHASE OBJECT
    // ==========================================

    const newPurchase = {

        id: purchaseId,

        supplier: supplier,

        material: material,

        quantity: quantity,

        unit: unit,

        unitCost: unitCost,

        totalCost: quantity * unitCost,

        remarks: remarks,

        status: "Completed",

        date: new Date().toLocaleDateString()
    };


    // Add purchase to array

    purchases.push(newPurchase);


    // ==========================================
    // AUTOMATIC INVENTORY UPDATE
    // ==========================================

    updateInventory(
        material,
        quantity,
        unit
    );


    // Update UI

    renderPurchases();

    renderInventory();

    updateDashboard();


    // Show success message

    showToast();


    // Clear form

    purchaseForm.reset();

});


// ==========================================
// UPDATE INVENTORY
// ==========================================

function updateInventory(
    materialName,
    purchasedQuantity,
    selectedUnit
) {

    // Search material in inventory array

    const material =
        inventory.find(
            item => item.material === materialName
        );


    // If material exists, add quantity

    if (material) {

        material.quantity += purchasedQuantity;

        material.unit = selectedUnit;

    }

    // If material does not exist,
    // create a new inventory element.

    else {

        inventory.push({

            material: materialName,

            quantity: purchasedQuantity,

            unit: selectedUnit,

            minimum: 10

        });

    }
}


// ==========================================
// DISPLAY PURCHASE TABLE
// ==========================================

function renderPurchases(
    searchTerm = ""
) {

    purchaseTable.innerHTML = "";


    const filteredPurchases =
        purchases.filter(purchase => {

            const search =
                searchTerm.toLowerCase();

            return (

                purchase.id
                    .toLowerCase()
                    .includes(search)

                ||

                purchase.supplier
                    .toLowerCase()
                    .includes(search)

                ||

                purchase.material
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (filteredPurchases.length === 0) {

        purchaseTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#94a3b8;
                    "
                >

                    No purchase transactions found.

                </td>

            </tr>

        `;

        return;
    }


    filteredPurchases.forEach(
        purchase => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <span class="purchase-id">
                        ${purchase.id}
                    </span>
                </td>

                <td>
                    ${purchase.supplier}
                </td>

                <td>
                    <strong>
                        ${purchase.material}
                    </strong>
                </td>

                <td>
                    ${purchase.quantity}
                    ${purchase.unit}
                </td>

                <td>
                    ₱${formatMoney(purchase.unitCost)}
                </td>

                <td>
                    <strong>
                        ₱${formatMoney(purchase.totalCost)}
                    </strong>
                </td>

                <td>

                    <span class="status completed">
                        ${purchase.status}
                    </span>

                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deletePurchase('${purchase.id}')"
                    >
                        Remove
                    </button>

                </td>

            `;


            purchaseTable.appendChild(row);

        }
    );
}


// ==========================================
// DISPLAY INVENTORY
// ==========================================

function renderInventory() {

    stockList.innerHTML = "";


    inventory.forEach(item => {

        const stockItem =
            document.createElement("div");


        stockItem.className =
            "stock-item";


        const stockLevel =
            item.quantity <= item.minimum
                ? "low-stock"
                : "good-stock";


        const statusText =
            item.quantity <= item.minimum
                ? "Low Stock"
                : "Available";


        stockItem.innerHTML = `

            <div class="stock-info">

                <div class="material-icon">
                    ◆
                </div>

                <div>

                    <strong>
                        ${item.material}
                    </strong>

                    <small>
                        ${statusText}
                    </small>

                </div>

            </div>


            <div class="stock-quantity">

                <strong class="${stockLevel}">
                    ${item.quantity}
                </strong>

                <small>
                    ${item.unit}
                </small>

            </div>

        `;


        stockList.appendChild(stockItem);

    });
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    // Total number of purchases

    totalPurchases.textContent =
        purchases.length;

    headerPurchases.textContent =
        purchases.length;

    purchaseCount.textContent =
        purchases.length;


    // Total quantity received

    const totalQuantity =
        purchases.reduce(
            (total, purchase) =>
                total + purchase.quantity,
            0
        );


    materialsReceived.textContent =
        totalQuantity;

    headerMaterials.textContent =
        totalQuantity;


    // Total purchase cost

    const cost =
        purchases.reduce(
            (total, purchase) =>
                total + purchase.totalCost,
            0
        );


    totalCost.textContent =
        "₱" + formatMoney(cost);


    // Inventory status

    const lowStockItems =
        inventory.filter(
            item =>
                item.quantity <= item.minimum
        );


    if (lowStockItems.length > 0) {

        inventoryStatus.textContent =
            "Restock Needed";

    } else {

        inventoryStatus.textContent =
            "Ready";

    }
}


// ==========================================
// DELETE PURCHASE
// ==========================================

function deletePurchase(id) {

    const purchase =
        purchases.find(
            item => item.id === id
        );


    if (!purchase) {
        return;
    }


    const confirmDelete =
        confirm(
            "Remove this purchase transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    // Remove purchased quantity
    // from inventory

    const material =
        inventory.find(
            item =>
                item.material === purchase.material
        );


    if (material) {

        material.quantity -=
            purchase.quantity;

        if (material.quantity < 0) {
            material.quantity = 0;
        }

    }


    // Remove purchase from array

    purchases =
        purchases.filter(
            item => item.id !== id
        );


    renderPurchases();

    renderInventory();

    updateDashboard();

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        renderPurchases(
            searchInput.value
        );

    }
);


// ==========================================
// RESET SYSTEM DATA
// ==========================================

resetBtn.addEventListener(
    "click",
    function() {

        const confirmation =
            confirm(
                "Reset all purchase transactions and restore the original inventory?"
            );


        if (!confirmation) {
            return;
        }


        purchases = [];


        inventory =
            JSON.parse(
                JSON.stringify(originalInventory)
            );


        renderPurchases();

        renderInventory();

        updateDashboard();

    }
);


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(value) {

    return Number(value)
        .toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// SUCCESS TOAST
// ==========================================

function showToast() {

    toast.classList.add("show");


    setTimeout(
        function() {

            toast.classList.remove("show");

        },
        3000
    );

}


// ==========================================
// START SYSTEM
// ==========================================

renderPurchases();

renderInventory();

updateDashboard();