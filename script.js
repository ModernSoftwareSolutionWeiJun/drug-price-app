// Currency formatter
const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const PRICES = {
  Mounjaro: {
    "2.5mg": 283,
    "5mg": 350,
    "7.5mg": 500,
    "10mg": 500,
    "12.5mg": 630,
    "15mg": 630
  },
  Wegovy: {
    "0.25mg": 250,
    "0.5mg": 250,
    "1mg": 250,
    "1.7mg": 435,
    "2.4mg": 435
  }
};

// Render a dropdown for quantity (0–10)
function renderQtyDropdown(drug, strength, price) {
  let options = `<option value="0" selected>0</option>`;
  for (let i = 1; i <= 10; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return `
    <select class="qty-select" 
            data-drug="${drug}" 
            data-strength="${strength}" 
            data-price="${price}">
      ${options}
    </select>
  `;
}

// Populate a table with strengths and dropdowns
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
            <td>${renderQtyDropdown(drug, strength, price)}</td>
            <td class="total-cell"></td>
          </tr>
        `
        )
        .join("")}
      <tr class="table-total-row">
        <td colspan="3" style="text-align:right;">${drug} Total</td>
        <td id="${drug.toLowerCase()}Total"></td>
      </tr>
    </tbody>
  `;
}

// Calculate totals for each drug
function updateTotals() {
  let mounjaroTotal = 0;
  let wegovyTotal = 0;

  document.querySelectorAll("#mounjaroTable .qty-select").forEach(select => {
    const qty = parseInt(select.value, 10) || 0;
    const price = parseFloat(select.dataset.price);
    mounjaroTotal += qty * price;
  });

  document.querySelectorAll("#wegovyTable .qty-select").forEach(select => {
    const qty = parseInt(select.value, 10) || 0;
    const price = parseFloat(select.dataset.price);
    wegovyTotal += qty * price;
  });

  document.getElementById("mounjaroTotal").textContent =
    mounjaroTotal > 0 ? currency.format(mounjaroTotal) : "";
  document.getElementById("wegovyTotal").textContent =
    wegovyTotal > 0 ? currency.format(wegovyTotal) : "";
}

// Handle qty dropdown changes
function handleQtyChange(e) {
  if (!e.target.classList.contains("qty-select")) return;

  const qty = parseInt(e.target.value, 10);
  const price = parseFloat(e.target.dataset.price);
  const totalCell = e.target.closest("tr").querySelector(".total-cell");

  if (qty > 0) {
    totalCell.textContent = currency.format(price * qty);
    totalCell.style.color = "var(--success)";
  } else {
    totalCell.textContent = "";
  }

  updateTotals();
}

// Initialize once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderTable("Mounjaro", "mounjaroTable");
  renderTable("Wegovy", "wegovyTable");

  document.addEventListener("change", handleQtyChange);
});
