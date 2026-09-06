<script setup>
import { ref, onMounted } from "vue";
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

const checking = ref(true);
const updateRequired = ref(false);
const installing = ref(false);
const errored = ref(false);
const version = ref("");
const statusText = ref("Checking for updates...");

onMounted(async () => {
  onUpdaterEvent(({ error, status }) => {
    if (error) {
      console.error("Updater error:", error);
      errored.value = true;
      statusText.value = "Update failed. Please try again.";
      installing.value = false;
      return;
    }
    if (status === "PENDING") statusText.value = "Downloading update...";
    if (status === "DONE") statusText.value = "Installing...";
  });

  try {
    const { shouldUpdate, manifest } = await checkUpdate();
    if (shouldUpdate) {
      updateRequired.value = true;
      version.value = manifest?.version ?? "";
      statusText.value = `Version ${version.value} is required to continue`;
    }
  } catch (e) {
    console.error("Update check failed:", e);
    // Fail-open: if the check itself fails (e.g. no internet),
    // let the user use the app rather than locking them out.
  } finally {
    checking.value = false;
  }
});

async function doInstall() {
  installing.value = true;
  errored.value = false;
  try {
    await installUpdate();
    await relaunch();
  } catch (e) {
    console.error("Install failed:", e);
    errored.value = true;
    statusText.value = "Update failed. Please try again.";
    installing.value = false;
  }
}
</script>

<template>
  <div v-if="checking" class="update-gate-screen">
    <p class="update-gate-status">Checking for updates...</p>
  </div>

  <div v-else-if="updateRequired" class="update-gate-screen">
    <div class="update-gate-card">
      <h2>Update Required</h2>
      <p class="update-gate-status">{{ statusText }}</p>
      <button v-if="!installing" class="update-gate-btn" @click="doInstall">
        Update Now
      </button>
      <div v-else class="update-gate-spinner" aria-hidden="true"></div>
    </div>
  </div>

  <slot v-else />
</template>

<style scoped>
.update-gate-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-inset, #111);
  z-index: 9999;
}

.update-gate-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 40px;
  background: var(--bg-raised, #1a1a1a);
  border: 1px solid var(--border, #333);
  border-radius: var(--radius, 8px);
  text-align: center;
  min-width: 280px;
}

.update-gate-card h2 {
  margin: 0;
  color: var(--red-bright, #e33);
  font-size: 1.2rem;
}

.update-gate-status {
  margin: 0;
  color: var(--text, #eee);
  font-size: 0.9rem;
}

.update-gate-btn {
  padding: 10px 24px;
  background: var(--red-bright, #e33);
  border: none;
  border-radius: var(--radius, 6px);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}
.update-gate-btn:hover {
  opacity: 0.9;
}

.update-gate-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border, #333);
  border-top-color: var(--red-bright, #e33);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
