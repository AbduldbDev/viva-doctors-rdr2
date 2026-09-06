export const DIAGNOSIS_OPTIONS = [
  "Pasa at Sugat",
  "Punch Hit",
  "Bullet Wound",
  "Arrow Wound",
  "Sharp Object",
  "Snake Bite",
  "Panther Bite",
  "Alligator Bite",
  "Wolf Bite",
  "Bear Bite",
  "Burned",
  "Knife Wound",
];

export const SERVICE_FEES = [
  70, 80, 90, 110, 120, 180, 190, 220, 240, 250, 350, 500,
];

export const LOCATIONS = ["Rhodes", "Blackwater", "Valentine"];
export const TEMPERATURES = [
  "30°C",
  "31°C",
  "32°C",
  "33°C",
  "34°C",
  "35°C",
  "36°C",
  "37°C",
  "38°C",
  "39°C",
  "39°C",
  "40°C",
  "41°C",
  "42°C",
  "43°C",
  "44°C",
  "45°C",
];

export const HEART_RATES = [
  "60 BPM",
  "61 BPM",
  "62 BPM",
  "63 BPM",
  "64 BPM",
  "65 BPM",
  "66 BPM",
  "67 BPM",
  "68 BPM",
  "69 BPM",
  "70 BPM",
  "71 BPM",
  "72 BPM",
  "73 BPM",
  "74 BPM",
  "75 BPM",
  "76 BPM",
  "77 BPM",
  "78 BPM",
  "79 BPM",
  "80 BPM",
  "81 BPM",
  "82 BPM",
  "83 BPM",
  "84 BPM",
  "85 BPM",
  "86 BPM",
  "87 BPM",
  "88 BPM",
  "89 BPM",
  "90 BPM",
  "91 BPM",
  "92 BPM",
  "93 BPM",
  "94 BPM",
  "95 BPM",
  "96 BPM",
  "97 BPM",
  "98 BPM",
  "99 BPM",
  "100 BPM",
];
export const DETAILED_LOCATIONS = [
  // AMBARINO
  "Ambarino",
  "Grizzlies East",
  "Grizzlies West",
  "Colter",
  "Mount Hagen",
  "Lake Isabella",
  "Cairn Lake",
  "Barrow Lagoon",
  "Cattail Pond",
  "O'Creagh's Run",
  "Cotorra Springs",
  "Whinyard Strait",
  "Calumet Ravine",
  "Wapiti Indian Reservation",
  "The Loft",
  "Bacchus Station",
  "Donner Falls",
  "Dakota River",

  // NEW HANOVER
  "New Hanover",
  "Cumberland Forest",
  "The Heartlands",
  "Roanoke Ridge",
  "Roanoke Valley",
  "Valentine",
  "Annesburg",
  "Van Horn Trading Post",
  "Emerald Ranch",
  "Flatneck Station",
  "Cornwall Kerosene & Tar",
  "Heartland Overflow",
  "Guthrie Farm",
  "Aberdeen Pig Farm",
  "Catfish Jacksons",
  "Doverhill",
  "Beaver Hollow",
  "Elysian Pool",
  "Brandywine Drop",
  "Kamassa River",
  "Mysterious Hill Home",
  "Bacchus Station",

  // LEMOYNE
  "Lemoyne",
  "Scarlett Meadows",
  "Bayou Nwa",
  "Bluewater Marsh",
  "Rhodes",
  "Saint Denis",
  "Lagras",
  "Braithwaite Manor",
  "Caliga Hall",
  "Shady Belle",
  "Bolger Glade",
  "Pleasance",
  "Lakay",
  "Mattock Pond",
  "Ringneck Creek",
  "Dewberry Creek",
  "Kamassa River",
  "Lannahechee River",
  "Hagen Orchards",
  "Macomb's End",
  "Sisika Island",
  "Saint Denis Cemetery",

  // WEST ELIZABETH
  "West Elizabeth",
  "Big Valley",
  "Great Plains",
  "Tall Trees",
  "Strawberry",
  "Blackwater",
  "Riggs Station",
  "Wallace Station",
  "Owanjila",
  "Owanjila Dam",
  "Manzanita Post",
  "Beecher's Hope",
  "Aurora Basin",
  "Lower Montana River",
  "Upper Montana River",
  "Montana Ford",
  "Bard's Crossing",
  "Mount Shann",
  "Hawk Eye Creek",
  "Little Creek River",
  "Dakota River",

  // NEW AUSTIN
  "New Austin",
  "Cholla Springs",
  "Gaptooth Ridge",
  "Hennigan's Stead",
  "Rio Bravo",
  "Armadillo",
  "Tumbleweed",
  "Benedict Point",
  "Rathskeller Fork",
  "Gaptooth Breach",
  "Plainview",
  "MacFarlane's Ranch",
  "Mercer Station",
  "Thieves' Landing",
  "Fort Mercer",
  "Twin Rocks",
  "Rio Del Lobo Rock",
  "San Luis River",
  "Lake Don Julio",
  "Stillwater Creek",
  "Manteca Falls",
  "Diez Coronas",
  "Guarma",
];

export const INVENTORY_ITEMS = [
  "Medical Syringe",
  "Morphine",
  "Bandage",
  "Valerian Root",
  "Food",
  "Broken Bone Restorative",
  "Infection Potion",
  "Anti-Snake Venom",
  "Laudanum",
];

export const MEDICINES = [
  "Morphine",
  "Bandage",
  "Valerian Root",
  "Broken Bone Restorative",
  "Anti Snake Venom",
  "Infection Potion",
  "Laudanum",
];

export function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function formatMoney(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function padReceiptLine(item, amountDisplay) {
  const left = (item ?? "").toString();
  const right = (amountDisplay ?? "").toString();
  const leftPadded =
    left.length >= 30 ? left : left + " ".repeat(30 - left.length);
  const rightPadded =
    right.length >= 12 ? right : " ".repeat(12 - right.length) + right;
  return leftPadded + rightPadded;
}
