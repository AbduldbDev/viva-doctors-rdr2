<script setup>
import { ref, watch, inject } from "vue";
import { MEDICINES } from "../data/constants.js";
import { todayStr } from "../data/constants.js";

const notify = inject("notify");

const STORAGE_KEY = "viva-doctors-lawmen-training";
const numberOptions = Array.from({ length: 50 }, (_, i) => i + 1);

function defaultMeds() {
  const meds = {};
  for (const name of MEDICINES) {
    meds[name] = { checked: false, amount: 1 };
  }
  return meds;
}

function defaultState() {
  return {
    time_started: "",
    time_ended: "",
    treated_sibil: "",
    meds: defaultMeds(),
    led_by: "",
    report: "",
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);

    const mergedMeds = defaultMeds();
    for (const name of MEDICINES) {
      if (parsed.meds && parsed.meds[name]) {
        mergedMeds[name] = {
          checked: !!parsed.meds[name].checked,
          amount: parsed.meds[name].amount || 1,
        };
      }
    }

    return { ...defaultState(), ...parsed, meds: mergedMeds };
  } catch (err) {
    console.error("Failed to load lawmenTraining from localStorage:", err);
    return defaultState();
  }
}

const saved = load();

const dateStr = ref(todayStr());
const time_started = ref(saved.time_started);
const time_ended = ref(saved.time_ended);
const treated_sibil = ref(saved.treated_sibil);
const meds = ref(saved.meds);
const led_by = ref(saved.led_by);
const report = ref(saved.report);

watch(
  [time_started, time_ended, treated_sibil, meds, led_by, report],
  () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          time_started: time_started.value,
          time_ended: time_ended.value,
          treated_sibil: treated_sibil.value,
          meds: meds.value,
          led_by: led_by.value,
          report: report.value,
        }),
      );
    } catch (err) {
      console.error("Failed to save lawmenTraining to localStorage:", err);
    }
  },
  { deep: true },
);

function clearForm() {
  dateStr.value = todayStr();
  time_started.value = "";
  time_ended.value = "";
  treated_sibil.value = "";
  meds.value = defaultMeds();
  led_by.value = "";
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

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function generateReport() {
  const medLines = MEDICINES.filter((name) => meds.value[name].checked)
    .map((name) => `  - ${name}: ${meds.value[name].amount}`)
    .join("\n");

  report.value =
    `Date: ${dateStr.value}\n` +
    `Time: ${formatTime(time_started.value)} - ${formatTime(time_ended.value)}\n` +
    `Treatment: ${treated_sibil.value}\n` +
    `Meds Used:\n${medLines || " - Wala"}\n` +
    `Led By: ${led_by.value.trim()}\n`;
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label>Date</label>
      <input type="text" v-model="dateStr" />
    </div>

    <div class="field">
      <label for="lt-time-started">Time Started</label>
      <input id="lt-time-started" type="time" v-model="time_started" />
    </div>

    <div class="field">
      <label for="lt-time-ended">Time Ended</label>
      <input id="lt-time-ended" type="time" v-model="time_ended" />
    </div>

    <div class="field">
      <label for="lt-treated-sibil">Treatment</label>
      <select id="lt-treated-sibil" v-model="treated_sibil">
        <option value="" disabled>Piliin ang Bilang</option>
        <option v-for="n in numberOptions" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <div class="field">
      <label>Meds</label>
      <div class="meds-list">
        <div v-for="name in MEDICINES" :key="name" class="med-row check-row">
          <label class="med-checkbox-label">
            <input type="checkbox" v-model="meds[name].checked" />
            {{ name }}
          </label>
          <select
            class="med-amount-select"
            v-model="meds[name].amount"
            :disabled="!meds[name].checked"
          >
            <option v-for="n in numberOptions" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="field">
      <label for="lt-led-by">Led By (Pangalan ng Sibil)</label>
      <input id="lt-led-by" type="text" v-model="led_by" />
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
.med-amount-select {
  width: 80px;
}
.meds-list {
  display: flex;
  flex-direction: column;
}
.med-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.med-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}
</style>
