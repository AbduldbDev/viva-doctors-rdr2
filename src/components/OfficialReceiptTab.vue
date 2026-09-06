<script setup>
import { ref, computed, inject } from "vue";
import { doctorNameOrPlaceholder } from "../store/settings.js";
import { todayStr, formatMoney } from "../data/constants.js";

const notify = inject("notify");

const dateOfReceipt = ref(todayStr());
const receiptTo = ref("");

let nextId = 0;
function blankRow() {
  return { id: nextId++, item: "", dami: "", presyo: "" };
}
const rows = ref([blankRow(), blankRow(), blankRow()]);

const report = ref("");

function addRow() {
  rows.value.push(blankRow());
}
function removeRow(id) {
  rows.value = rows.value.filter((r) => r.id !== id);
}

function rowTotal(row) {
  const dami = parseFloat(row.dami) || 0;
  const presyo = parseFloat(row.presyo) || 0;
  return dami * presyo;
}

const grandTotal = computed(() =>
  rows.value.reduce((sum, row) => sum + rowTotal(row), 0),
);

function clearForm() {
  dateOfReceipt.value = todayStr();
  receiptTo.value = "";
  rows.value = [blankRow(), blankRow(), blankRow()];
  report.value = "";
}

function copyReport() {
  const text = report.value.trim();
  if (!text) {
    notify("Wala pang Ulat — buuin muna ang ulat bago kopyahin.");
    return;
  }
  navigator.clipboard?.writeText(text);
  notify("Nakopya na ang ulat sa clipboard.");
}

function generateReport() {
  const lines = [];
  let total = 0;

  for (const row of rows.value) {
    const item = row.item.trim();
    const damiRaw = row.dami.toString().trim();
    const presyoRaw = row.presyo.toString().trim();
    if (!item && !damiRaw && !presyoRaw) continue;

    const dami = damiRaw ? parseFloat(damiRaw) : 0;
    const presyo = presyoRaw ? parseFloat(presyoRaw) : 0;
    const safeDami = Number.isFinite(dami) ? dami : 0;
    const safePresyo = Number.isFinite(presyo) ? presyo : 0;
    const lineTotal = safeDami * safePresyo;
    total += lineTotal;

    lines.push(
      `${item || "(Walang pangalan)"}: ${safeDami} Piraso x $${formatMoney(
        safePresyo,
      )} = $${formatMoney(lineTotal)}`,
    );
  }

  report.value =
    `Date of Receipt: ${dateOfReceipt.value.trim()}\n` +
    `Sold by: ${doctorNameOrPlaceholder()}\n` +
    `Receipt to: ${receiptTo.value.trim()}\n` +
    "\n" +
    "List of Transaction:\n" +
    (lines.length ? lines.join("\n") : "  - Wala") +
    "\n\n" +
    `Total Amount: $${formatMoney(total)}\n`;
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="or-date">Date of Receipt</label>
      <input id="or-date" type="text" v-model="dateOfReceipt" />
    </div>

    <div class="field">
      <label>Sold by</label>
      <input type="text" :value="doctorNameOrPlaceholder()" readonly />
    </div>

    <div class="field">
      <label for="or-to">Receipt to</label>
      <input id="or-to" type="text" v-model="receiptTo" />
    </div>

    <div class="section-label">List of Transaction</div>
    <div class="tx-header">
      <span>Item</span>
      <span>Dami</span>
      <span>Presyo/Unit</span>
      <span>Total</span>
      <span></span>
    </div>
    <div class="tx-row" v-for="row in rows" :key="row.id">
      <input type="text" v-model="row.item" placeholder="Item" />
      <input type="number" v-model="row.dami" placeholder="Qty" min="0" />
      <input
        type="number"
        v-model="row.presyo"
        placeholder="0.00"
        min="0"
        step="0.01"
      />
      <span class="tx-total">{{ formatMoney(rowTotal(row)) }}</span>
      <button class="tx-remove" title="Alisin" @click="removeRow(row.id)">
        ✕
      </button>
    </div>
    <button class="btn" style="margin-top: 8px" @click="addRow">
      + Add Item
    </button>

    <div class="grand-total-row">
      <span>Total:</span>
      <strong>${{ formatMoney(grandTotal) }}</strong>
    </div>

    <div class="btn-row">
      <button class="btn btn-primary" @click="generateReport">Submit</button>
      <button class="btn" @click="clearForm">Clear Form</button>
      <button class="btn" @click="copyReport">Copy</button>
    </div>

    <div class="case-file" :class="{ empty: !report }">
      <h3>Resulta</h3>
      <pre v-if="report">{{ report }}</pre>
      <pre v-else>Wala pang nabuong ulat.</pre>
    </div>
  </div>
</template>

<style scoped>
.tx-header {
  display: grid;
  grid-template-columns: 1fr 70px 100px 100px 30px;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--brass);
  padding: 2px 2px 6px;
}
.tx-row {
  display: grid;
  grid-template-columns: 1fr 70px 100px 100px 30px;
  gap: 8px;
  margin-bottom: 6px;
  align-items: center;
}
.tx-row input {
  background: var(--bg-inset);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 9px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  border-radius: var(--radius);
  width: 100%;
  box-sizing: border-box;
}
.tx-row input:focus {
  outline: none;
  border-color: var(--red-bright);
  box-shadow: 0 0 0 1px var(--red-bright);
}
.tx-total {
  font-size: 0.85rem;
  color: var(--text);
  text-align: right;
  padding-right: 4px;
}
.tx-remove {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: var(--radius);
  cursor: pointer;
}
.tx-remove:hover {
  color: var(--red-bright);
  border-color: var(--red-bright);
}
.grand-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--bg-inset);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
}
</style>
