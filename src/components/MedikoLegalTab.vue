<script setup>
import { ref, inject } from "vue";
import { doctorNameOrPlaceholder } from "../store/settings.js";
import { TEMPERATURES, HEART_RATES } from "../data/constants.js";
import { todayStr } from "../data/constants.js";

const notify = inject("notify");

const pangalan = ref("");
const edad = ref("");
const lokasyon = ref("");
const temperatura = ref("");
const tangkad = ref("");
const bigat = ref("");
const paraSaan = ref("");
const tibokNgPuso = ref("");
const mata = ref("");
const peklat = ref("");
const kondisyon = ref("");
const dateStr = ref(todayStr());
const report = ref("");

function clearForm() {
  pangalan.value = "";
  edad.value = "";
  lokasyon.value = "";
  temperatura.value = "";
  tangkad.value = "";
  bigat.value = "";
  paraSaan.value = "";
  tibokNgPuso.value = "";
  mata.value = "";
  peklat.value = "";
  kondisyon.value = "";
  report.value = "";
  dateStr.value = todayStr();
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
  const bigatText = bigat.value.trim() ? `${bigat.value.trim()} kg` : "Wala";
  const kondisyonTrimmed = kondisyon.value.trim();

  report.value =
    `Pangalan: ${pangalan.value.trim()}\n` +
    `Date: ${dateStr.value}\n` +
    `Edad: ${edad.value.trim()}\n` +
    `Lokasyon: ${lokasyon.value.trim()}\n` +
    `Temperatura: ${temperatura.value.trim()}\n` +
    `Tangkad: ${tangkad.value.trim()}\n` +
    `Bigat: ${bigatText}\n` +
    `Para saan: ${paraSaan.value.trim()}\n\n` +
    `Tibok ng Puso: ${tibokNgPuso.value.trim()}\n` +
    `Mata: ${mata.value.trim()}\n` +
    `Peklat: ${peklat.value.trim()}\n` +
    `Kondisyon: ${kondisyonTrimmed ? kondisyonTrimmed : "Wala"}\n\n` +
    "\n" +
    `Pangalan ng Manggagamot: ${doctorNameOrPlaceholder()}\n`;
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label>Pangalan ng Manggagamot</label>
      <input type="text" :value="doctorNameOrPlaceholder()" readonly />
    </div>

    <div class="field">
      <label for="ml-pangalan">Pangalan</label
      ><input id="ml-pangalan" type="text" v-model="pangalan" />
    </div>

    <div class="field">
      <label>Date</label>
      <input type="text" :value="dateStr" readonly />
    </div>

    <div class="field">
      <label for="ml-edad">Edad</label
      ><input id="ml-edad" type="text" v-model="edad" />
    </div>
    <div class="field">
      <label for="ml-lokasyon">Lokasyon</label
      ><input id="ml-lokasyon" type="text" v-model="lokasyon" />
    </div>
    <div class="field">
      <label for="ml-temp">Temperatura</label>
      <select id="ml-temp" v-model="temperatura">
        <option v-for="temp in TEMPERATURES" :key="temp" :value="String(temp)">
          {{ temp }}
        </option>
      </select>
    </div>
    <div class="field">
      <label for="ml-tangkad">Tangkad</label
      ><input id="ml-tangkad" type="text" v-model="tangkad" />
    </div>
    <div class="field">
      <label for="ml-bigat">Bigat (kg)</label
      ><input id="ml-bigat" type="text" v-model="bigat" />
    </div>
    <div class="field">
      <label for="ml-para">Para saan</label
      ><input id="ml-para" type="text" v-model="paraSaan" />
    </div>
    <div class="field">
      <label for="ml-tibok">Tibok ng Puso</label>
      <select id="ml-heart-rate" v-model="tibokNgPuso">
        <option v-for="rate in HEART_RATES" :key="rate" :value="String(rate)">
          {{ rate }}
        </option>
      </select>
    </div>
    <div class="field">
      <label for="ml-mata">Mata</label
      ><input id="ml-mata" type="text" v-model="mata" />
    </div>
    <div class="field">
      <label for="ml-peklat">Peklat</label
      ><input id="ml-peklat" type="text" v-model="peklat" />
    </div>

    <div class="field">
      <label for="ml-kondisyon">Kondisyon</label>
      <textarea
        id="ml-kondisyon"
        v-model="kondisyon"
        rows="5"
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
