<script setup>
import { inject } from "vue";
import { patientReport, clearPatientReport } from "../data/patientReport.js";
import { addRecord } from "../data/patientRecords.js";

const notify = inject("notify");

function clearForm() {
  clearPatientReport();
}

function copyReport() {
  const text = patientReport.report.trim();
  if (!text) {
    notify("Wala pang Ulat — buuin muna ang ulat bago kopyahin.");
    return;
  }
  navigator.clipboard?.writeText(text);
  notify("Nakopya na ang ulat sa clipboard.");
}

function generateReport() {
  const historyTrimmed = patientReport.history.trim();

  patientReport.report =
    `Passport Number: ${patientReport.passport_number.trim()}\n` +
    `Full Name: ${patientReport.full_name.trim()}\n` +
    `Date Of Birth: ${patientReport.date_of_birth}\n` +
    `Age: ${patientReport.age}\n` +
    `Gender: ${patientReport.gender}\n` +
    `Medical History: ${historyTrimmed || "Wala"}\n`;
}

function saveToRecords() {
  if (!patientReport.report.trim()) {
    notify("Buuin muna ang ulat bago i-save.");
    return;
  }
  addRecord(patientReport);
  notify("Naidagdag sa Patient Records.");
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="pr-passport">Passport Number</label>
      <input
        id="pr-passport"
        type="text"
        v-model="patientReport.passport_number"
      />
    </div>

    <div class="field">
      <label for="pr-full-name">Full Name</label>
      <input id="pr-full-name" type="text" v-model="patientReport.full_name" />
    </div>

    <div class="field">
      <label for="pr-date-of-birth">Date Of Birth</label>
      <input
        id="pr-date-of-birth"
        type="date"
        v-model="patientReport.date_of_birth"
      />
    </div>

    <div class="field">
      <label for="pr-age">Age</label>
      <input id="pr-age" type="text" v-model="patientReport.age" />
    </div>

    <div class="field">
      <label for="pr-gender">Gender</label>
      <select id="pr-gender" v-model="patientReport.gender">
        <option value="" disabled>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

    <div class="field">
      <label for="pr-history">Medical History</label>
      <textarea
        id="pr-history"
        v-model="patientReport.history"
        rows="8"
        class="textarea"
      ></textarea>
    </div>

    <div class="btn-row">
      <button class="btn btn-primary" @click="generateReport">Submit</button>
      <button class="btn" @click="saveToRecords">Save to Records</button>
      <button class="btn" @click="clearForm">Clear Form</button>
      <button class="btn" @click="copyReport">Copy</button>
    </div>

    <div class="case-file" :class="{ empty: !patientReport.report }">
      <h3>Resulta</h3>
      <pre v-if="patientReport.report">{{ patientReport.report }}</pre>
      <pre v-else>Wala pang nabuong ulat.</pre>
    </div>
  </div>
</template>
