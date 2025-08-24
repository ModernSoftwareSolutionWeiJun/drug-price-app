const DRUG_DATA = {
  Tirzepatide: { "2.5 mg": 283, "5 mg": 350, "7.5 mg": 500, "10 mg": 500, "12.5 mg": 630, "15 mg": 630 },
  Semaglutide: { "0.25 mg": 250, "0.5 mg": 250, "1 mg": 250, "1.7 mg": 435, "2.4 mg": 435 }
};

const MARKUP = 1.6; // 60% markup
const WEEKS = Array.from({ length: 13 }, (_, i) => `Week ${i * 4 + 1} - ${i * 4 + 4}`);

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function populateTable(id, data, label) {
  const table = document.getElementById(id);
  if (!table) return;

  const headerWeeks = WEEKS.map(w => `<th>${w}</th>`).join('');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Cost Price</th>
        <th>Clinic Price</th>
        <th>Qty</th>
        ${headerWeeks}
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(data).map(([strength, cost]) => {
        const clinicPrice = cost * MARKUP;
        const weekCells = WEEKS.map(() => `<td class="week-cell">${currency.format(0)}</td>`).join('');
        return `
          <tr>
            <td>${strength}</td>
            <td>${currency.format(cost)}</td>
            <td>${currency.format(clinicPrice)}</td>
            <td><input type="number" min="0" value="0" data-price="${clinicPrice}" class="qty-input" /></td>
            ${weekCells}
            <td class="subtotal-cell">${currency.format(0)}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  `;

  table.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('input', () => updateTableTotals(table));
  });
}

function updateTableTotals(table) {
  table.querySelectorAll('tbody tr').forEach(row => {
    const qty = parseInt(row.querySelector('.qty-input').value) || 0;
    const price = parseFloat(row.querySelector('.qty-input').dataset.price);
    const total = qty * price;

    let subtotal = 0;
    row.querySelectorAll('.week-cell').forEach(cell => {
      cell.textContent = qty > 0 ? currency.format(total) : currency.format(0);
      subtotal += qty > 0 ? total : 0;
    });

    row.querySelector('.subtotal-cell').textContent = currency.format(subtotal);
  });
}

populateTable('tirzepatideTable', DRUG_DATA.Tirzepatide, 'Tirzepatide');
populateTable('semaglutideTable', DRUG_DATA.Semaglutide, 'Semaglutide');
