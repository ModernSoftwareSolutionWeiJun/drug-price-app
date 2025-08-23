// Currency formatter
const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

// Price data
const PRICES = {
  Mounjaro: {
    "2.5mg": 550,
    "5mg": 600,
    "7.5mg": 650,
    "10mg": 700,
    "12.5mg": 750,
    "15mg": 800
  },
  Wegovy: {
    "0.25mg": 120,
    "0.5mg": 200,
    "1mg": 350,
    "1.7mg": 400,
    "2.4mg": 450
  }
};

// Populate a table with strengths and inputs
function renderTable(drug, tableId) {
  const table = document.getElementById(tableId);
  table.innerHTML = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Unit Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(PRICES[drug])
        .map(
          ([strength, price]) => `
          <tr>
            <td>${strength}</td>
            <td>${currency.format(price)}</td>
            <td>
              <input type="number" 
                     class="qty-input" 
                     min="0" 
                     data-drug="${drug}" 
                     data-strength="${strength}" 
                     data-price="${price}" 
                     style="width:70px">
            </td>
            <td class="total-cell"></td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  `;
}

// Handle qty input changes
function handleQtyInput(e) {
  if (!e.target.classList.contains("qty-input")) return;

  const qty = parseInt(e.target.value, 10) || 0;
  const price = parseFloat(e.target.dataset.price);
  const totalCell = e.target.closest("tr").querySelector(".total-cell");

  if (qty > 0) {
    totalCell.textContent = currency.format(price * qty);
    totalCell.style.color = "var(--success)";
  } else {
    totalCell.textContent = "";
  }
}

// Init tables
renderTable("Mounjaro", "mounjaroTable");
renderTable("Wegovy", "wegovyTable");

// Listen for qty changes (event delegation)
document.addEventListener("input", handleQtyInput);
