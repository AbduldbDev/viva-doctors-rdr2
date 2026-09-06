<script setup>
import { ref, inject } from "vue";
import {
  DIAGNOSIS_OPTIONS,
  SERVICE_FEES,
  DETAILED_LOCATIONS,
} from "../data/constants.js";

const notify = inject("notify");

const patientName = ref("");
const location = ref("");
const feeVar = ref("");
const diagnosisChecks = ref(
  Object.fromEntries(DIAGNOSIS_OPTIONS.map((d) => [d, false])),
);

const report = ref("");

function clearForm() {
  patientName.value = "";
  location.value = "";
  feeVar.value = "";
  for (const key of Object.keys(diagnosisChecks.value))
    diagnosisChecks.value[key] = false;
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
  const diagnoses = DIAGNOSIS_OPTIONS.filter((d) => diagnosisChecks.value[d]);

  const locationText = location.value.trim()
    ? `Lokasyon: ${location.value.trim()}\n`
    : "";
  const feeText = feeVar.value.trim()
    ? `Halaga ng Serbisyo: ${feeVar.value.trim()}\n`
    : "Halaga ng Serbisyo: \n";

  report.value =
    `${feeText}` +
    `Ngalan ng Pasyente: ${patientName.value.trim()}\n` +
    `${locationText}` +
    "Diagnosis: " +
    (diagnoses.length ? diagnoses.join(", ") : "  - Wala") +
    "\n\n";
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="p-name">Ngalan ng Pasyente</label>
      <input id="p-name" type="text" v-model="patientName" />
    </div>

    <div class="field">
      <label for="p-location">Lokasyon</label>
      <select id="p-location" v-model="location">
        <option value=""></option>
        <option
          v-for="loc in DETAILED_LOCATIONS"
          :key="loc"
          :value="String(loc)"
        >
          {{ loc }}
        </option>
      </select>
    </div>

    <div class="section-label">Diagnosis</div>
    <label class="check-row" v-for="d in DIAGNOSIS_OPTIONS" :key="d">
      <input type="checkbox" v-model="diagnosisChecks[d]" />
      {{ d }}
    </label>

    <div class="field" style="margin-top: 16px">
      <label for="p-fee">Halaga ng Serbisyo</label>
      <select id="p-fee" v-model="feeVar">
        <option value=""></option>
        <option v-for="fee in SERVICE_FEES" :key="fee" :value="String(fee)">
          {{ fee }}
        </option>
      </select>
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
