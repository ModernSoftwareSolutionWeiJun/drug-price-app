// Base cost per unit
const DRUG_DATA = {
  Tirzepatide: { "2.5 mg": 283, "5 mg": 350, "7.5 mg": 500, "10 mg": 500, "12.5 mg": 630, "15 mg": 630 },
  Semaglutide: { "0.25 mg": 250, "0.5 mg": 250, "1 mg": 250, "1.7 mg": 435, "2.4 mg": 435 }
};

const MARKUP = 1.6;                     // 60% markup -> Clinic price
const ROWS = 3;                         // number of editable schedule rows per drug
const WEEKS = Array.from({length: 13}, (_, i) => `Week ${i*4+1} - ${i*4+4}`);

const fmt = n => `$${(+n).toFixed(2)}`; // "$123.45" (no "US")

function clinicPricesFor(drugObj){
  // Unique clinic prices derived from strengths (Cost × MARKUP)
  const uniq = new Set(Object.values(drugObj).map(c => +(c * MARKUP).toFixed(2)));
  return [...uniq].sort((a,b)=>a-b);
}

function optionList(prices){
  return `
    <option value="0">—</option>
    ${prices.map(p => `<option value="${p}">${fmt(p)}</option>`).join("")}
  `;
}

function populateTable(id, drugObj){
  const table = document.getElementById(id);
  if (!table) return;

  const prices = clinicPricesFor(drugObj);

  // Build header (weeks only)
  const header = `
    <thead>
      <tr>${WEEKS.map(w => `<th>${w}</th>`).join("")}</tr>
    </thead>
  `;

  // Build body (editable selects)
  const bodyRows = Array.from({length: ROWS}, () => `
    <tr>
      ${WEEKS.map(() => `<td><select class="week-select">${optionList(prices)}</select></td>`).join("")}
    </tr>
  `).join("");

  // Footer totals (bottom-of-column subtotals)
  const footer = `
    <tfoot>
      <tr>${WEEKS.map(() => `<td class="col-total">${fmt(0)}</td>`).join("")}</tr>
    </tfoot>
  `;

  table.innerHTML = header + `<tbody>${bodyRows}</tbody>` + footer;

  // Listen for changes and recompute subtotals
  table.querySelectorAll(".week-select").forEach(sel => {
    sel.addEventListener("change", () => updateColumnTotals(table));
  });
}

function updateColumnTotals(table){
  const totals = Array(WEEKS.length).fill(0);

  table.querySelectorAll("tbody tr").forEach(row => {
    row.querySelectorAll("td").forEach((cell, colIdx) => {
      const val = parseFloat(cell.querySelector("select")?.value || "0");
      totals[colIdx] += isNaN(val) ? 0 : val;
    });
  });

  table.querySelectorAll("tfoot td.col-total").forEach((td, i) => {
    td.textContent = fmt(totals[i]);
  });
}

// Init both tables
populateTable("tirzepatideTable", DRUG_DATA.Tirzepatide);
populateTable("semaglutideTable", DRUG_DATA.Semaglutide);
