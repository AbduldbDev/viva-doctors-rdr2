<script setup>
import { ref, inject } from "vue";
import { settings } from "../store/settings.js";

const notify = inject("notify");
const draft = ref(settings.doctorName);

function save() {
  settings.doctorName = draft.value.trim();
  notify("Nai-save ang mga setting.");
}

function reset() {
  draft.value = "";
  settings.doctorName = "";
  notify("Na-clear ang pangalan ng manggagamot.");
}
</script>

<template>
  <div class="tab-panel">
    <div class="section-label" style="margin-top: 0">Manggagamot</div>
    <div class="field">
      <label for="settings-doctor">Pangalan ng Manggagamot</label>
      <input
        id="settings-doctor"
        type="text"
        v-model="draft"
        placeholder="hal. Sabine Vergara"
        @keyup.enter="save"
      />
    </div>
    <p class="hint">
      Awtomatikong lalabas ang pangalang ito sa bawat ulat (Inventory Logs,
      Mediko Legal, Prescription, Official Receipt) — hindi na kailangang
      i-type paulit-ulit. Naka-save ito sa device na ito lamang.
    </p>

    <div class="btn-row">
      <button class="btn btn-primary" @click="save">I-save</button>
      <button class="btn" @click="reset">Alisin</button>
    </div>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: -6px 0 4px;
}
</style>
