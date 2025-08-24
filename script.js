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

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function populateTable(id, data, label) {
  const table = document.getElementById(id);
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Cost Price</th>
        <th>Clinic Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(data).map(([strength, cost]) => {
        const clinicPrice = cost * MARKUP;
        return `
          <tr>
            <td>${strength}</td>
            <td>${currency.format(cost)}</td>
            <td>${currency.format(clinicPrice)}</td>
            <td><input type="number" min="0" value="0" data-price="${clinicPrice}" class="qty-input" /></td>
            <td class="total-cell">${currency.format(0)}</td>
          </tr>
        `;
      }).join('')}
      <tr>
        <td colspan="4" style="text-align:right;font-weight:bold">${label} Total</td>
        <td class="grand-total">${currency.format(0)}</td>
      </tr>
    </tbody>
  `;

  // Add event listeners for quantity inputs
  table.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('input', () => updateTableTotal(table));
  });
}

function updateTableTotal(table) {
  let grandTotal = 0;
  table.querySelectorAll('tbody tr').forEach(row => {
    const input = row.querySelector('.qty-input');
    const totalCell = row.querySelector('.total-cell');
    if (input && totalCell) {
      const qty = parseInt(input.value) || 0;
      const price = parseFloat(input.dataset.price);
      const total = qty * price;
      totalCell.textContent = currency.format(total);
      grandTotal += total;
    }
  });
  const grandTotalCell = table.querySelector('.grand-total');
  if (grandTotalCell) grandTotalCell.textContent = currency.format(grandTotal);
}

// Initialize both tables
populateTable('tirzepatideTable', DRUG_DATA.Tirzepatide, 'Tirzepatide');
populateTable('semaglutideTable', DRUG_DATA.Semaglutide, 'Semaglutide');
