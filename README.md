# VIVA! Doctors — Vue + Tauri

A Vue 3 + Tauri rewrite of the "VIVA! Doctors" Tkinter tool, in the same
black-and-red Red Dead Redemption 2–inspired ledger theme as the Sibil Penal
Codes app. All six report tabs are ported 1:1 from the Python source, and
the hardcoded `DOCTOR_NAME` has been replaced with a **Settings** screen
backed by `localStorage`.

## What changed from the Python version

- **Framework**: Tkinter → Vue 3 (Composition API) on Tauri, same as the
  Sibil Penal Codes rewrite.
- **Doctor name is now a setting, not a constant.** Click the gear icon
  (top-right of the header) to set it once — it's saved to the device via
  `localStorage` (key `viva-doctors-settings`) and automatically fills in
  on the Inventory Logs, Mediko Legal, Prescription, and Official Receipt
  tabs. If it hasn't been set yet, those fields show a reminder placeholder
  instead of silently defaulting to someone else's name.
- **UI**: same theme tokens as the Sibil Penal Codes app (`Rye` display
  font, `Special Elite` typewriter font, parchment "case file" output,
  dark leather chrome). Tabs wrap onto two rows since there are six of them
  plus Settings.
- **Popups → toast**, same as before.
- **Official Receipt's dynamic rows**: the "+ Add Item" / "✕ remove" table
  from the original is reactive Vue state instead of manually
  grid-managed Tkinter frames.
- Money formatting (`1,234.56`) and the fixed-width receipt line padding
  are reproduced in `src/data/constants.js` to match the original output.

## Project layout

```
├── src/
│   ├── App.vue                    # header, tab switcher, settings toggle, toast
│   ├── store/settings.js          # localStorage-backed doctor name
│   ├── data/constants.js          # ported option lists + formatting helpers
│   └── components/
│       ├── PatientTab.vue
│       ├── InventoryLogsTab.vue
│       ├── MedikoLegalTab.vue
│       ├── PrescriptionTab.vue
│       ├── OfficialReceiptTab.vue
│       ├── IncidentReportTab.vue
│       └── SettingsTab.vue
└── src-tauri/                     # Rust shell (Tauri) — same as the other app
```

## Setup, dev, and build

Same as the Sibil Penal Codes project:

```bash
npm install
npx tauri icon src-tauri/icons/app-icon.png   # fills in the full icon set
npm run tauri dev                              # development, hot reload
npm run tauri build                            # production installer/.exe
```

See that project's README for the full prerequisites list (Node.js, Rust,
WebView2/WebKitGTK) and for setting up the auto-updater if you want future
builds to reach installed copies automatically — the same Tauri updater
config applies here (add an `"updater"` block to `src-tauri/tauri.conf.json`
with your own signing key and endpoint).

## Notes on local storage

- Storage is per-device, per-user-profile — it does **not** sync between
  different PCs. Each doctor who installs the app sets their own name once.
- Clearing browser/webview data (or "Alisin" in Settings) removes the saved
  name; nothing else is stored (no patient data is persisted — each report
  is generated fresh and lives only in that session unless copied out).
