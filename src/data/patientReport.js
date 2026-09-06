import { reactive, watch } from "vue";

const STORAGE_KEY = "viva-doctors-patient-report";

const defaults = {
  passport_number: "",
  full_name: "",
  date_of_birth: "1901-01-01",
  age: "",
  gender: "",
  history: "",
  report: "",
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}

export const patientReport = reactive(load());

watch(
  patientReport,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      // localStorage unavailable (e.g. private mode) — form still works,
      // it just won't persist across restarts.
    }
  },
  { deep: true },
);

export function clearPatientReport() {
  Object.assign(patientReport, defaults, { date_of_birth: "1901-01-01" });
}
