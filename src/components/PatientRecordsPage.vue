<script setup>
import { ref, computed, inject } from "vue";
import {
  patientRecords,
  deleteRecord,
  clearAllRecords,
} from "../data/patientRecords.js";

const notify = inject("notify");
const search = ref("");
const openId = ref(null);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return patientRecords;
  return patientRecords.filter(
    (r) =>
      r.full_name.toLowerCase().includes(q) ||
      r.passport_number.toLowerCase().includes(q),
  );
});

function toggle(id) {
  openId.value = openId.value === id ? null : id;
}

function copyRecord(r) {
  navigator.clipboard?.writeText(r.report);
  notify("Nakopya na ang ulat sa clipboard.");
}

function removeRecord(id) {
  deleteRecord(id);
  notify("Tinanggal ang rekord.");
}

function clearAll() {
  if (!patientRecords.length) return;
  clearAllRecords();
  notify("Nabura lahat ng rekord.");
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("fil-PH");
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="pr-search">Maghanap (Pangalan o Passport Number)</label>
      <input
        id="pr-search"
        type="text"
        v-model="search"
        placeholder="Maghanap..."
      />
    </div>

    <div class="btn-row">
      <button class="btn" @click="clearAll">Burahin Lahat</button>
    </div>

    <p v-if="!filtered.length" class="case-file empty">
      <span v-if="patientRecords.length">Walang tumugmang rekord.</span>
      <span v-else>Wala pang naka-save na rekord.</span>
    </p>

    <div v-for="r in filtered" :key="r.id" class="case-file">
      <div
        class="btn-row"
        style="justify-content: space-between; align-items: center"
      >
        <div>
          <strong>{{ r.full_name || "(Walang Pangalan)" }}</strong>
          — {{ r.passport_number || "(Walang Passport #)" }}
          <div style="font-size: 0.85em; opacity: 0.7">
            Na-save: {{ formatDate(r.savedAt) }}
          </div>
        </div>
        <div class="btn-row">
          <button class="btn" @click="toggle(r.id)">
            {{ openId === r.id ? "Itago" : "Tingnan" }}
          </button>
          <button class="btn" @click="copyRecord(r)">Copy</button>
          <button class="btn" @click="removeRecord(r.id)">Tanggalin</button>
        </div>
      </div>
      <pre v-if="openId === r.id">{{ r.report }}</pre>
    </div>
  </div>
</template>
