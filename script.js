// Data model: drug -> strengths -> price per unit
const PRICES = {
  // Paracetamol: { "250 mg": 0.20, "500 mg": 0.35, "1 g": 0.60 },
  // Ibuprofen:   { "200 mg": 0.25, "400 mg": 0.45, "600 mg": 0.65 },
  // Amoxicillin: { "250 mg": 0.55, "500 mg": 0.95 },
  // "Metformin": { "500 mg": 0.30, "850 mg": 0.45, "1 g": 0.55 },
    Mounjaro: {
    "2.5 mg": 283,
    "5 mg": 350,
    "7.5 mg": 500,
    "10 mg": 500,
    "12.5 mg": 630,
    "15 mg": 630
  },
  "Wegovy/Semaglutide": {
    "2.5 mg": 250,
    "5 mg": 250,
    "10 mg": 250,
    "17.5 mg": 435,
    "25 mg": 435
  }
};

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function populateTable(id, data) {
  const table = document.getElementById(id);
  if (!table) return;

  // Build header
  table.innerHTML = `
    <thead>
      <tr>
        <th>Strength</th>
        <th>Price (per unit)</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(data)
        .map(([strength, price]) => `
          <tr>
            <td>${strength}</td>
            <td>${currency.format(price)}</td>
          </tr>
        `)
        .join('')}
    </tbody>
  `;
}

// Initialize tables
populateTable('mounjaroTable', DRUG_DATA.Mounjaro);
populateTable('wegovyTable', DRUG_DATA["Wegovy/Semaglutide"]);
