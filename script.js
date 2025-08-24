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
      const clinicPrice = cost * MARKUP;
      const weekCells = WEEKS.map(() => `
        <td>
          <select class="week-select" data-price="${clinicPrice}">
            <option value="0">—</option>
            <option value="${clinicPrice}">${fmt(clinicPrice)}</option>
          </select>
        </td>
      `).join('');

      return `
        <tr>
          <td>${strength}</td>
          <td>${fmt(cost)}</td>
          <td>${fmt(clinicPrice)}</td>
          ${weekCells}
          <td class="subtotal-cell">${fmt(0)}</td>
        </tr>
      `;
    })
    .join('');

  table.innerHTML = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Cost Price</th>
        <th>Clinic Price</th>
        ${weekHeader}
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  `;

  // Add listeners for week selects
  table.querySelectorAll(".week-select").forEach(select => {
    select.addEventListener("change", () => updateRowSubtotals(table));
  });
}

function updateRowSubtotals(table) {
  table.querySelectorAll("tbody tr").forEach(row => {
    let subtotal = 0;
    row.querySelectorAll(".week-select").forEach(sel => {
      subtotal += parseFloat(sel.value) || 0;
    });
    row.querySelector(".subtotal-cell").textContent = fmt(subtotal);
  });
}

// Initialize both tables
populateTable("tirzepatideTable", DRUG_DATA.Tirzepatide);
populateTable("semaglutideTable", DRUG_DATA.Semaglutide);
