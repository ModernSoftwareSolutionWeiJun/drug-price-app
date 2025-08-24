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

const MARKUP = 1.6; // 60% markup for clinic price
const WEEKS = Array.from({ length: 13 }, (_, i) => `Week ${i * 4 + 1} - ${i * 4 + 4}`);
const ROWS = 3; // number of rows in the weekly schedule section

const fmt = n => `$${(+n).toFixed(2)}`;

function populateTable(id, drugObj) {
  const table = document.getElementById(id);
  if (!table) return;

  // 1) STATIC PRICE TABLE (top)
  const strengthRows = Object.entries(drugObj)
    .map(([strength, cost]) => {
      const clinic = cost * MARKUP;
      return `
        <tr>
          <td>${strength}</td>
          <td>${fmt(cost)}</td>
          <td>${fmt(clinic)}</td>
        </tr>`;
    })
    .join('');

  const staticSection = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Cost Price</th>
        <th>Clinic Price</th>
      </tr>
    </thead>
    <tbody>
      ${strengthRows}
    </tbody>
  `;

  // 2) WEEKS GRID SECTION (bottom)
  const weekHeader = WEEKS.map(w => `<th>${w}</th>`).join('');
  const prices = Object.values(drugObj).map(c => +(c * MARKUP).toFixed(2));
  const uniqueClinicPrices = [...new Set(prices)].sort((a, b) => a - b);
  const options = `
    <option value="0">—</option>
    ${uniqueClinicPrices.map(p => `<option value="${p}">${fmt(p)}</option>`).join('')}
  `;

  const weekRows = Array.from({ length: ROWS }, () => `
    <tr>
      ${WEEKS.map(() => `<td><select class="week-select">${options}</select></td>`).join('')}
    </tr>
  `).join('');

  const weekSection = `
    <thead>
      <tr>${weekHeader}</tr>
    </thead>
    <tbody class="week-body">
      ${weekRows}
    </tbody>
    <tfoot>
      <tr>${WEEKS.map(() => `<td class="col-total">${fmt(0)}</td>`).join('')}</tr>
    </tfoot>
  `;

  // Combine sections: top static + bottom weeks
  table.innerHTML = staticSection + '<tr><td colspan="3"></td></tr>' + weekSection;

  // Add event listeners for dropdowns
  table.querySelectorAll(".week-select").forEach(sel => {
    sel.addEventListener("change", () => updateColumnTotals(table));
  });
}

function updateColumnTotals(table) {
  const totals = Array(WEEKS.length).fill(0);

  table.querySelectorAll(".week-body tr").forEach(row => {
    row.querySelectorAll("td").forEach((cell, colIdx) => {
      const val = parseFloat(cell.querySelector("select")?.value || "0");
      totals[colIdx] += isNaN(val) ? 0 : val;
    });
  });

  table.querySelectorAll("tfoot td.col-total").forEach((td, i) => {
    td.textContent = fmt(totals[i]);
  });
}

// Initialize tables
populateTable("tirzepatideTable", DRUG_DATA.Tirzepatide);
populateTable("semaglutideTable", DRUG_DATA.Semaglutide);
