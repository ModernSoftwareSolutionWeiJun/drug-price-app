# Drug Price Calculator (Static Web App)

A tiny, front-end–only web app that lets users choose a **drug**, a **strength**, and **quantity**, then shows the total **price**.

No backend required. Built with plain **HTML/CSS/JavaScript**. Ready for **GitHub Pages**, **Netlify**, or **Vercel**.

---

## 🧪 Run Locally
Just open `index.html` in your browser.

---

## 🚀 Deploy (Free & Easy)

### Option 1 — GitHub Pages
1. Create a new repo on GitHub (e.g., `drug-price-app`).
2. Upload these files (`index.html`, `style.css`, `script.js`, `README.md`) to the repo (root).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` (or `master`) • **Folder**: `/ (root)`
5. Save. In ~1 minute, your site goes live at:  
   `https://<your-username>.github.io/<repo-name>/`

> Tip: If you use a custom domain, connect it under **Settings → Pages → Custom domain**.

---

### Option 2 — Netlify (Drag & Drop)
1. Go to **https://app.netlify.com/drop**.
2. Drag the **project folder** (the one that contains `index.html`) into the drop area.
3. Netlify deploys instantly and gives you a live URL like `https://your-site-name.netlify.app/`.
4. (Optional) Create a Netlify account to manage/rename your site.

---

### Option 3 — Vercel (via GitHub)
1. Push your repo to GitHub.
2. Go to **https://vercel.com** → **New Project** → **Import Git Repository**.
3. Select your repo. For **Framework Preset**, choose **Other** (this is a static site).
4. **Build & Output Settings**: Leave defaults; no build step needed.
5. Deploy. Your site will be live at `https://<project>.vercel.app`.

---

## 🧰 Customize Prices
Open `script.js` and edit the `PRICES` object:

```js
const PRICES = {
  Paracetamol: { "250 mg": 0.20, "500 mg": 0.35, "1 g": 0.60 },
  Ibuprofen:   { "200 mg": 0.25, "400 mg": 0.45, "600 mg": 0.65 },
  Amoxicillin: { "250 mg": 0.55, "500 mg": 0.95 }
};
```

- Keys are **drug names**.
- Nested keys are **strengths**.
- Values are **unit prices** (in USD by default).

To change currency, update the `Intl.NumberFormat` currency code in `script.js`.

---

## ✅ Accessibility Notes
- All inputs are labeled and keyboard accessible.
- Result text uses `aria-live="polite"` for screen readers.
- Form submit is prevented by JS to avoid page reloads.
