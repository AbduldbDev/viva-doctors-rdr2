import { reactive, watch } from "vue";

const STORAGE_KEY = "viva-doctors-patient-records";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const patientRecords = reactive(load());

watch(
  patientRecords,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      // localStorage unavailable — records won't persist, form still works.
    }
  },
  { deep: true },
);

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addRecord(data) {
  const record = {
    id: makeId(),
    savedAt: new Date().toISOString(),
    passport_number: data.passport_number?.trim() || "",
    full_name: data.full_name?.trim() || "",
    date_of_birth: data.date_of_birth || "",
    age: data.age || "",
    gender: data.gender || "",
    history: data.history?.trim() || "",
    report: data.report || "",
  };
  patientRecords.unshift(record);
  return record;
}

export function deleteRecord(id) {
  const idx = patientRecords.findIndex((r) => r.id === id);
  if (idx !== -1) patientRecords.splice(idx, 1);
}

export function clearAllRecords() {
  patientRecords.splice(0, patientRecords.length);
}
