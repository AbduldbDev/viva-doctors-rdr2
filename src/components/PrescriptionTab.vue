<script setup>
import { ref, inject } from "vue";
import { doctorNameOrPlaceholder } from "../store/settings.js";
import { todayStr } from "../data/constants.js";

const notify = inject("notify");

const pangalan = ref("");
const diagnosis = ref("");
const gamot = ref("");
const panuto = ref("");
const dami = ref("");
const refill = ref("");
const petsa = ref(todayStr());

const report = ref("");

function clearForm() {
  pangalan.value = "";
  diagnosis.value = "";
  gamot.value = "";
  panuto.value = "";
  dami.value = "";
  refill.value = "";
  petsa.value = todayStr();
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
  const panutoTrimmed = panuto.value.trim();

  report.value =
    `Pangalan: ${pangalan.value.trim()}\n` +
    `Diagnosis: ${diagnosis.value.trim()}\n` +
    `Pangalan at Lakas ng Gamot: ${gamot.value.trim()}\n\n` +
    `Panuto: ${panutoTrimmed ? panutoTrimmed : "Wala"}\n\n` +
    `Dami: ${dami.value.trim()}\n` +
    `Refill: ${refill.value.trim()}\n\n` +
    `Nagreseta: ${doctorNameOrPlaceholder()}\n` +
    `Petsa ng Reseta: ${petsa.value.trim()}\n`;
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label>Nagreseta</label>
      <input type="text" :value="doctorNameOrPlaceholder()" readonly />
    </div>

    <div class="field">
      <label for="rx-pangalan">Pangalan</label
      ><input id="rx-pangalan" type="text" v-model="pangalan" />
    </div>
    <div class="field">
      <label for="rx-diagnosis">Diagnosis</label
      ><input id="rx-diagnosis" type="text" v-model="diagnosis" />
    </div>
    <div class="field">
      <label for="rx-gamot">Pangalan at Lakas ng Gamot</label
      ><input id="rx-gamot" type="text" v-model="gamot" />
    </div>

    <div class="field">
      <label for="rx-panuto">Panuto</label>
      <textarea
        id="rx-panuto"
        v-model="panuto"
        rows="5"
        class="textarea"
      ></textarea>
    </div>

    <div class="field">
      <label for="rx-dami">Dami</label
      ><input id="rx-dami" type="text" v-model="dami" />
    </div>
    <div class="field">
      <label for="rx-refill">Refill</label
      ><input id="rx-refill" type="text" v-model="refill" />
    </div>
    <div class="field">
      <label for="rx-petsa">Petsa ng Reseta</label
      ><input id="rx-petsa" type="text" v-model="petsa" />
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
