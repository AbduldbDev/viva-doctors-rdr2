<script setup>
import { ref, inject } from "vue";
import { settings, doctorNameOrPlaceholder } from "../store/settings.js";
import { LOCATIONS, INVENTORY_ITEMS, todayStr } from "../data/constants.js";

const notify = inject("notify");

const location = ref("");
const dateStr = ref(todayStr());
const itemChecks = ref(
  Object.fromEntries(INVENTORY_ITEMS.map((i) => [i, false])),
);
const itemQty = ref(Object.fromEntries(INVENTORY_ITEMS.map((i) => [i, "0"])));

const report = ref("");

function clearForm() {
  location.value = "";
  dateStr.value = todayStr();
  for (const item of INVENTORY_ITEMS) {
    itemChecks.value[item] = false;
    itemQty.value[item] = "0";
  }
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
  for (const item of INVENTORY_ITEMS) {
    if (itemChecks.value[item]) {
      const qty = String(itemQty.value[item] ?? "").trim() || "0";
      lines.push(`  - ${item}: ${qty}`);
    }
  }

  report.value =
    `Name: ${doctorNameOrPlaceholder()}\n` +
    `Location: ${location.value.trim()}\n` +
    `Date: ${dateStr.value}\n` +
    "\n" +
    "Mga Item:\n" +
    (lines.length ? lines.join("\n") : "  - Wala") +
    "\n";
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label>Name</label>
      <input type="text" :value="doctorNameOrPlaceholder()" readonly />
    </div>

    <div class="field">
      <label for="i-location">Location</label>
      <select id="i-location" v-model="location">
        <option value=""></option>
        <option v-for="loc in LOCATIONS" :key="loc" :value="loc">
          {{ loc }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Date</label>
      <input type="text" :value="dateStr" readonly />
    </div>

    <div class="section-label">Item</div>
    <div v-for="item in INVENTORY_ITEMS" :key="item" class="qty-row">
      <label class="check-row" style="flex: 1">
        <input type="checkbox" v-model="itemChecks[item]" />
        {{ item }}
      </label>
      <input
        type="number"
        min="0"
        max="999"
        v-model="itemQty[item]"
        class="qty-input"
      />
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
.qty-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 0;
}
.qty-input {
  width: 64px;
  background: var(--bg-inset);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 8px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  border-radius: var(--radius);
  text-align: center;
}
.qty-input:focus {
  outline: none;
  border-color: var(--red-bright);
  box-shadow: 0 0 0 1px var(--red-bright);
}
</style>
