// Data model: drug -> strengths -> price per unit
const PRICES = {
  Paracetamol: { "250 mg": 0.20, "500 mg": 0.35, "1 g": 0.60 },
  Ibuprofen:   { "200 mg": 0.25, "400 mg": 0.45, "600 mg": 0.65 },
  Amoxicillin: { "250 mg": 0.55, "500 mg": 0.95 },
  "Metformin": { "500 mg": 0.30, "850 mg": 0.45, "1 g": 0.55 }
};

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const drugSelect = document.getElementById("drugSelect");
const strengthSelect = document.getElementById("strengthSelect");
const qtyInput = document.getElementById("qtyInput");
const result = document.getElementById("result");

function init() {
  // Populate drug dropdown
  Object.keys(PRICES).forEach(drug => {
    const opt = document.createElement("option");
    opt.value = drug;
    opt.textContent = drug;
    drugSelect.appendChild(opt);
  });

  drugSelect.addEventListener("change", handleDrugChange);
}

function handleDrugChange() {
  const drug = drugSelect.value;
  // Reset strengths
  strengthSelect.innerHTML = '<option value="" selected disabled>Select strength</option>';
  strengthSelect.disabled = true;

  if (!drug) return;

  const strengths = Object.keys(PRICES[drug]);
  strengths.forEach(str => {
    const opt = document.createElement("option");
    opt.value = str;
    opt.textContent = str;
    strengthSelect.appendChild(opt);
  });
  strengthSelect.disabled = false;

  // Optional: Auto-calc if qty present and strength selected
  result.textContent = "";
}

function calculatePrice() {
  const drug = drugSelect.value;
  const strength = strengthSelect.value;
  const qty = parseInt(qtyInput.value, 10);

  if (!drug) return showMsg("Please select a drug.", "err");
  if (!strength) return showMsg("Please select a strength.", "err");
  if (!qty || qty < 1) return showMsg("Quantity must be at least 1.", "warn");

  const unitPrice = PRICES[drug][strength];
  const total = unitPrice * qty;

  showMsg(`${drug} • ${strength} × ${qty} = <span class="ok">${currency.format(total)}</span>`);
}

function showMsg(html, cls=null){
  result.className = "result" + (cls ? " " + cls : "");
  result.innerHTML = html;
}

function resetForm(){
  document.getElementById("priceForm").reset();
  strengthSelect.disabled = true;
  result.textContent = "";
}

init();
