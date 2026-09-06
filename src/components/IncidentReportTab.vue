<script setup>
import { ref, inject } from "vue";
import { todayStr } from "../data/constants.js";
import { doctorNameOrPlaceholder } from "../store/settings.js";

const notify = inject("notify");

const persons = ref("");
const dateStr = ref(todayStr());
const time = ref("");
const details = ref("");

const report = ref("");

function clearForm() {
  persons.value = "";
  dateStr.value = todayStr();
  time.value = "";
  details.value = "";
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
  const detailsTrimmed = details.value.trim();

  report.value =
    `Person/s Involved: ${persons.value.trim()}\n` +
    `Date: ${dateStr.value}\n` +
    `Time: ${time.value.trim()}\n` +
    `Details: ${detailsTrimmed ? detailsTrimmed : "Wala"}\n` +
    `Pangalan ng nag sumite: ${doctorNameOrPlaceholder()}\n`;
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="ir-doktor">Pangalan ng Doktor</label>
      <input
        id="ir-doktor"
        type="text"
        :value="doctorNameOrPlaceholder()"
        readonly
      />
    </div>
    <div class="field">
      <label for="ir-persons">Person/s Involved</label>
      <input id="ir-persons" type="text" v-model="persons" />
    </div>

    <div class="field">
      <label>Date</label>
      <input type="text" :value="dateStr" readonly />
    </div>

    <div class="field">
      <label for="ir-time">Time</label>
      <input id="ir-time" type="time" v-model="time" />
    </div>

    <div class="field">
      <label for="ir-details">Details</label>
      <textarea
        id="ir-details"
        v-model="details"
        rows="8"
        class="textarea"
      ></textarea>
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
