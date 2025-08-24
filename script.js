const DRUG_DATA = {
  Tirzepatide: {
    "2.5 mg": 283,
    "5 mg": 350,
    "7.5 mg": 500,
    "10 mg": 500,
    "12.5 mg": 630,
    "15 mg": 630
  },
  Semaglutide: {
    "0.25 mg": 250,
    "0.5 mg": 250,
    "1 mg": 250,
    "1.7 mg": 435,
    "2.4 mg": 435
  }
};

const MARKUP = 1.6; // 60% markup
const WEEKS = Array.from({ length: 13 }, (_, i) => `Week ${i * 4 + 1} - ${i * 4 + 4}`);
const fmt = n => `$${(+n).toFixed(2)}`;

function populateTable(id, drugObj) {
  const table = document.getElementById(id);
  if (!table) return;

  const weekHeader = WEEKS.map(w => `<th>${w}</th>`).join('');

  // Build rows for each strength
  const rows = Object.entries(drugObj)
    .map(([strength, cost]) => {
      const patientPrice = cost * MARKUP;
      const weekCells = WEEKS.map(() => `
        <td>
          <select class="week-select" data-price="${patientPrice}">
            <option value="0">—</option>
            <option value="${patientPrice}">${fmt(patientPrice)}</option>
          </select>
        </td>
      `).join('');

      return `
        <tr>
          <td>${strength}</td>
          <td>${fmt(cost)}</td>
          <td>${fmt(patientPrice)}</td>
          ${weekCells}
          <td class="subtotal-cell">${fmt(0)}</td>
        </tr>
      `;
    })
    .join('');

  // Add a footer row for totals
  const footerRow = `
    <tr class="table-total-row">
      <td colspan="${3 + WEEKS.length}" style="text-align:right; font-weight:bold;">Total</td>
      <td id="${id}-grand-total" style="font-weight:bold;">${fmt(0)}</td>
    </tr>
  `;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Cost Price</th>
        <th>Patient Price</th>
        ${weekHeader}
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      ${footerRow}
    </tbody>
  `;

  // Add listeners for week selects
  table.querySelectorAll(".week-select").forEach(select => {
    select.addEventListener("change", () => {
      updateRowSubtotals(table);
      updateTableGrandTotal(table, `${id}-grand-total`);
    });
  });
}

function updateRowSubtotals(table) {
  table.querySelectorAll("tbody tr").forEach(row => {
    if (row.classList.contains("table-total-row")) return; // skip total row
    let subtotal = 0;
    row.querySelectorAll(".week-select").forEach(sel => {
      subtotal += parseFloat(sel.value) || 0;
    });
    row.querySelector(".subtotal-cell").textContent = fmt(subtotal);
  });
}

function updateTableGrandTotal(table, totalCellId) {
  let grandTotal = 0;
  table.querySelectorAll("tbody tr").forEach(row => {
    if (row.classList.contains("table-total-row")) return;
    const subtotalText = row.querySelector(".subtotal-cell").textContent.replace("$", "");
    grandTotal += parseFloat(subtotalText) || 0;
  });
  document.getElementById(totalCellId).textContent = fmt(grandTotal);
}

// Initialize both tables
populateTable("tirzepatideTable", DRUG_DATA.Tirzepatide);
populateTable("semaglutideTable", DRUG_DATA.Semaglutide);
