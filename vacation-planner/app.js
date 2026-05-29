const STORAGE_KEY = "familyTripPlanner:v4";

const countryFuelDefaults = {
  RO: { name: "România", prices: { gasoline: 1.46, diesel: 1.48, lpg: 0.72, electric: 0.42 }, toll: 3 },
  BG: { name: "Bulgaria", prices: { gasoline: 1.36, diesel: 1.39, lpg: 0.68, electric: 0.38 }, toll: 8 },
  GR: { name: "Grecia", prices: { gasoline: 1.86, diesel: 1.62, lpg: 0.93, electric: 0.45 }, toll: 16 },
  TR: { name: "Turcia", prices: { gasoline: 1.24, diesel: 1.18, lpg: 0.65, electric: 0.30 }, toll: 18 },
  HU: { name: "Ungaria", prices: { gasoline: 1.55, diesel: 1.57, lpg: 0.89, electric: 0.46 }, toll: 16 },
  AT: { name: "Austria", prices: { gasoline: 1.61, diesel: 1.58, lpg: 1.05, electric: 0.48 }, toll: 12 },
  RS: { name: "Serbia", prices: { gasoline: 1.54, diesel: 1.66, lpg: 0.82, electric: 0.36 }, toll: 14 },
  IT: { name: "Italia", prices: { gasoline: 1.84, diesel: 1.71, lpg: 0.77, electric: 0.50 }, toll: 32 },
  DE: { name: "Germania", prices: { gasoline: 1.79, diesel: 1.65, lpg: 1.05, electric: 0.48 }, toll: 0 },
  FR: { name: "Franța", prices: { gasoline: 1.88, diesel: 1.75, lpg: 1.02, electric: 0.47 }, toll: 42 },
  ES: { name: "Spania", prices: { gasoline: 1.62, diesel: 1.50, lpg: 0.95, electric: 0.43 }, toll: 20 },
  NL: { name: "Olanda", prices: { gasoline: 2.05, diesel: 1.82, lpg: 1.04, electric: 0.49 }, toll: 0 },
  BE: { name: "Belgia", prices: { gasoline: 1.78, diesel: 1.72, lpg: 0.82, electric: 0.46 }, toll: 0 },
  CZ: { name: "Cehia", prices: { gasoline: 1.55, diesel: 1.49, lpg: 0.72, electric: 0.41 }, toll: 13 },
  PL: { name: "Polonia", prices: { gasoline: 1.52, diesel: 1.50, lpg: 0.72, electric: 0.39 }, toll: 17 },
  HR: { name: "Croația", prices: { gasoline: 1.52, diesel: 1.45, lpg: 0.81, electric: 0.42 }, toll: 24 },
  SI: { name: "Slovenia", prices: { gasoline: 1.52, diesel: 1.48, lpg: 0.88, electric: 0.44 }, toll: 16 },
  SK: { name: "Slovacia", prices: { gasoline: 1.61, diesel: 1.53, lpg: 0.83, electric: 0.44 }, toll: 12 },
  MK: { name: "Macedonia de Nord", prices: { gasoline: 1.34, diesel: 1.20, lpg: 0.65, electric: 0.33 }, toll: 10 },
  XK: { name: "Kosovo", prices: { gasoline: 1.35, diesel: 1.32, lpg: 0.72, electric: 0.34 }, toll: 0 },
  AL: { name: "Albania", prices: { gasoline: 1.82, diesel: 1.80, lpg: 0.82, electric: 0.36 }, toll: 6 },
  ME: { name: "Muntenegru", prices: { gasoline: 1.55, diesel: 1.45, lpg: 0.78, electric: 0.36 }, toll: 8 },
  BA: { name: "Bosnia și Herțegovina", prices: { gasoline: 1.35, diesel: 1.36, lpg: 0.71, electric: 0.33 }, toll: 8 },
  US: { name: "Statele Unite", prices: { gasoline: 0.97, diesel: 1.07, lpg: 0.68, electric: 0.26 }, toll: 22 },
  GB: { name: "Regatul Unit", prices: { gasoline: 1.72, diesel: 1.78, lpg: 1.02, electric: 0.45 }, toll: 18 },
  DEFAULT: { name: "Zonă", prices: { gasoline: 1.65, diesel: 1.55, lpg: 0.85, electric: 0.42 }, toll: 10 }
};

const fuelProfiles = {
  gasoline: { label: "Benzină", unit: "l", priceUnit: "€/l", consumptionLabel: "Consum l/100 km", defaultConsumption: 7.4 },
  diesel: { label: "Diesel", unit: "l", priceUnit: "€/l", consumptionLabel: "Consum l/100 km", defaultConsumption: 6.4 },
  lpg: { label: "GPL", unit: "l", priceUnit: "€/l", consumptionLabel: "Consum l/100 km", defaultConsumption: 9.2 },
  electric: { label: "Electric", unit: "kWh", priceUnit: "€/kWh", consumptionLabel: "Consum kWh/100 km", defaultConsumption: 18.5 }
};

const roadTollProfiles = {
  RO: { type: "fixed", fixed: 3, label: "rovinietă 7 zile cat. A" },
  BG: { type: "fixed", fixed: 8, label: "e-vignetă 7 zile" },
  HU: { type: "fixed", fixed: 17, label: "e-vignetă 10 zile D1" },
  AT: { type: "fixed", fixed: 13, label: "vignetă 10 zile" },
  SI: { type: "fixed", fixed: 16, label: "e-vignetă 7 zile" },
  SK: { type: "fixed", fixed: 12, label: "e-vignetă 10 zile" },
  CZ: { type: "fixed", fixed: 12, label: "e-vignetă 10 zile" },
  AL: { type: "fixed", fixed: 5, label: "taxă segment posibil" },
  ME: { type: "fixed", fixed: 5, label: "tunel/segment posibil" },
  IT: { type: "perKm", rate: 0.075, motorwayShare: 0.8, min: 3, label: "~0.075 €/km autostradă" },
  FR: { type: "perKm", rate: 0.1, motorwayShare: 0.82, min: 5, label: "~0.10 €/km autostradă" },
  ES: { type: "perKm", rate: 0.07, motorwayShare: 0.45, min: 0, label: "~0.07 €/km pe segmente taxate" },
  GR: { type: "perKm", rate: 0.07, motorwayShare: 0.75, min: 5, label: "stații toll, estimat €/km" },
  HR: { type: "perKm", rate: 0.065, motorwayShare: 0.8, min: 4, label: "~0.065 €/km autostradă" },
  RS: { type: "perKm", rate: 0.045, motorwayShare: 0.85, min: 2, label: "taxă autostradă pe segment" },
  MK: { type: "perKm", rate: 0.035, motorwayShare: 0.85, min: 4, label: "stații toll, estimat €/km" },
  XK: { type: "free", fixed: 0, label: "fără taxă majoră estimată" },
  TR: { type: "perKm", rate: 0.03, motorwayShare: 0.8, min: 4, label: "OGS/HGS, estimat €/km" },
  BA: { type: "perKm", rate: 0.035, motorwayShare: 0.65, min: 2, label: "autostradă taxată parțial" },
  PL: { type: "perKm", rate: 0.05, motorwayShare: 0.55, min: 0, label: "segmente taxate parțial" },
  DE: { type: "free", fixed: 0, label: "fără taxă auto personal" },
  NL: { type: "free", fixed: 0, label: "fără taxă auto personal" },
  BE: { type: "free", fixed: 0, label: "fără taxă auto personal" },
  DEFAULT: { type: "fallback", label: "valoare implicită editabilă" }
};

const cityCatalog = [
  ["București, România", "RO", 44.4268, 26.1025],
  ["Craiova, România", "RO", 44.3302, 23.7949],
  ["Cluj-Napoca, România", "RO", 46.7712, 23.6236],
  ["Timișoara, România", "RO", 45.7489, 21.2087],
  ["Iași, România", "RO", 47.1585, 27.6014],
  ["Constanța, România", "RO", 44.1598, 28.6348],
  ["Brașov, România", "RO", 45.6427, 25.5887],
  ["Sibiu, România", "RO", 45.7983, 24.1256],
  ["Oradea, România", "RO", 47.0465, 21.9189],
  ["Arad, România", "RO", 46.1866, 21.3123],
  ["Pitești, România", "RO", 44.8565, 24.8692],
  ["Ploiești, România", "RO", 44.9367, 26.0129],
  ["Suceava, România", "RO", 47.6635, 26.2732],
  ["Târgu Mureș, România", "RO", 46.5386, 24.5514],
  ["Drobeta-Turnu Severin, România", "RO", 44.6258, 22.6532],
  ["Galați, România", "RO", 45.4353, 28.0080],
  ["Brăila, România", "RO", 45.2692, 27.9575],
  ["Bacău, România", "RO", 46.567, 26.914],
  ["Baia Mare, România", "RO", 47.656, 23.582],
  ["Satu Mare, România", "RO", 47.79, 22.89],
  ["Deva, România", "RO", 45.88, 22.90],
  ["Alba Iulia, România", "RO", 46.07, 23.57],
  ["Râmnicu Vâlcea, România", "RO", 45.10, 24.37],
  ["Târgu Jiu, România", "RO", 45.03, 23.27],
  ["Zalău, România", "RO", 47.19, 23.05],
  ["Bistrița, România", "RO", 47.13, 24.49],
  ["Botoșani, România", "RO", 47.74, 26.66],
  ["Piatra Neamț, România", "RO", 46.93, 26.37],
  ["Focșani, România", "RO", 45.70, 27.18],
  ["Buzău, România", "RO", 45.15, 26.82],
  ["Târgoviște, România", "RO", 44.93, 25.46],
  ["Slatina, România", "RO", 44.43, 24.36],
  ["Reșița, România", "RO", 45.30, 21.89],
  ["Alexandria, România", "RO", 43.97, 25.33],
  ["Slobozia, România", "RO", 44.56, 27.37],
  ["Călărași, România", "RO", 44.20, 27.33],
  ["Giurgiu, România", "RO", 43.90, 25.97],
  ["Tulcea, România", "RO", 45.18, 28.80],
  ["Vaslui, România", "RO", 46.64, 27.73],
  ["Sfântu Gheorghe, România", "RO", 45.86, 25.79],
  ["Miercurea Ciuc, România", "RO", 46.36, 25.80],
  ["Ruse, Bulgaria", "BG", 43.8356, 25.9657],
  ["Sofia, Bulgaria", "BG", 42.6977, 23.3219],
  ["Varna, Bulgaria", "BG", 43.2141, 27.9147],
  ["Veliko Tărnovo, Bulgaria", "BG", 43.0757, 25.6172],
  ["Thassos, Grecia", "GR", 40.7781, 24.7094],
  ["Salonic, Grecia", "GR", 40.6401, 22.9444],
  ["Halkidiki, Grecia", "GR", 40.3695, 23.2871],
  ["Lefkada, Grecia", "GR", 38.8334, 20.7069],
  ["Atena, Grecia", "GR", 37.9838, 23.7275],
  ["Kavala, Grecia", "GR", 40.9376, 24.4129],
  ["Istanbul, Turcia", "TR", 41.0082, 28.9784],
  ["Edirne, Turcia", "TR", 41.6772, 26.5557],
  ["Budapesta, Ungaria", "HU", 47.4979, 19.0402],
  ["Debrecen, Ungaria", "HU", 47.5316, 21.6273],
  ["Szeged, Ungaria", "HU", 46.253, 20.1414],
  ["Lenti, Ungaria", "HU", 46.624, 16.5386],
  ["Viena, Austria", "AT", 48.2082, 16.3738],
  ["Graz, Austria", "AT", 47.0707, 15.4395],
  ["Praga, Cehia", "CZ", 50.0755, 14.4378],
  ["Berlin, Germania", "DE", 52.52, 13.405],
  ["Munchen, Germania", "DE", 48.1351, 11.582],
  ["Paris, Franța", "FR", 48.8566, 2.3522],
  ["Lyon, Franța", "FR", 45.764, 4.8357],
  ["Barcelona, Spania", "ES", 41.3874, 2.1686],
  ["Madrid, Spania", "ES", 40.4168, -3.7038],
  ["Roma, Italia", "IT", 41.9028, 12.4964],
  ["Bari, Italia", "IT", 41.1171, 16.8719],
  ["Veneția, Italia", "IT", 45.4408, 12.3155],
  ["Milano, Italia", "IT", 45.4642, 9.19],
  ["Trieste, Italia", "IT", 45.6495, 13.7768],
  ["Zagreb, Croația", "HR", 45.815, 15.9819],
  ["Split, Croația", "HR", 43.5081, 16.4402],
  ["Dubrovnik, Croația", "HR", 42.6507, 18.0944],
  ["Belgrad, Serbia", "RS", 44.8125, 20.4612],
  ["Skopje, Macedonia de Nord", "MK", 41.9981, 21.4254],
  ["Pristina, Kosovo", "XK", 42.6629, 21.1655],
  ["Ljubljana, Slovenia", "SI", 46.0569, 14.5058],
  ["Tirana, Albania", "AL", 41.3275, 19.8187],
  ["Durrës, Albania", "AL", 41.3186, 19.4544],
  ["Vlorë, Albania", "AL", 40.4661, 19.4914],
  ["Amsterdam, Olanda", "NL", 52.3676, 4.9041],
  ["Bruxelles, Belgia", "BE", 50.8503, 4.3517],
  ["Londra, Regatul Unit", "GB", 51.5072, -0.1276],
  ["New York, Statele Unite", "US", 40.7128, -74.006],
  ["Los Angeles, Statele Unite", "US", 34.0522, -118.2437]
].map(([name, countryCode, lat, lon]) => ({ name, countryCode, lat, lon }));

const REVERSE_COUNTRY_CACHE_KEY = "familyTripPlanner:reverse_country_cache";
let reverseCountryCache = new Map();
try {
  const cachedData = JSON.parse(localStorage.getItem(REVERSE_COUNTRY_CACHE_KEY) || "[]");
  reverseCountryCache = new Map(cachedData);
} catch (e) {
  console.warn("Failed to load reverse country cache", e);
}

function saveReverseCountryCache() {
  try {
    localStorage.setItem(REVERSE_COUNTRY_CACHE_KEY, JSON.stringify([...reverseCountryCache.entries()]));
  } catch (e) {
    console.warn("Failed to save reverse country cache", e);
  }
}

const corridorMap = {
  "RO-GR": ["RO", "BG", "GR"],
  "RO-TR": ["RO", "BG", "TR"],
  "RO-HU": ["RO", "HU"],
  "RO-AT": ["RO", "HU", "AT"],
  "RO-CZ": ["RO", "HU", "SK", "CZ"],
  "RO-DE": ["RO", "HU", "AT", "DE"],
  "RO-FR": ["RO", "HU", "AT", "DE", "FR"],
  "RO-IT": ["RO", "RS", "HR", "SI", "IT"],
  "RO-HR": ["RO", "RS", "HR"],
  "RO-RS": ["RO", "RS"],
  "RO-BG": ["RO", "BG"],
  "RO-AL": ["RO", "BG", "MK", "AL"],
  "BG-AL": ["BG", "MK", "AL"],
  "MK-AL": ["MK", "AL"],
  "HU-AT": ["HU", "AT"],
  "HU-IT": ["HU", "SI", "IT"],
  "AT-IT": ["AT", "IT"],
  "RS-IT": ["RS", "HR", "SI", "IT"],
  "HR-IT": ["HR", "SI", "IT"],
  "SI-IT": ["SI", "IT"],
  "DE-FR": ["DE", "FR"],
  "DE-NL": ["DE", "NL"],
  "FR-ES": ["FR", "ES"]
};

const ferrySuggestions = [
  { match: ["thassos", "tasos"], label: "Keramoti - Limenas / Kavala - Prinos", cost: 45 },
  { match: ["corfu", "kerkira"], label: "Igoumenitsa - Corfu", cost: 55 },
  { match: ["crete", "creta", "heraklion", "chania"], label: "Pireu - Creta", cost: 180 },
  { match: ["sardinia", "sardinia", "cagliari"], label: "Italia continentală - Sardinia", cost: 190 },
  { match: ["sicily", "sicilia", "palermo", "catania"], label: "Villa San Giovanni - Messina", cost: 45 },
  { match: ["mallorca", "palma"], label: "Barcelona / Valencia - Mallorca", cost: 180 }
];

const ferryRoutePresets = [
  { from: "durres", to: "bari", label: "Durrës - Bari", cost: 95, hours: 9 },
  { from: "bari", to: "durres", label: "Bari - Durrës", cost: 95, hours: 9 },
  { from: "vlore", to: "brindisi", label: "Vlorë - Brindisi", cost: 85, hours: 6 },
  { from: "brindisi", to: "vlore", label: "Brindisi - Vlorë", cost: 85, hours: 6 },
  { from: "igoumenitsa", to: "corfu", label: "Igoumenitsa - Corfu", cost: 55, hours: 1.5 },
  { from: "keramoti", to: "thassos", label: "Keramoti - Limenas", cost: 45, hours: 0.7 }
];

const routeVariantTemplates = [
  {
    id: "ro-it-serbia-croatia",
    from: "RO",
    to: "IT",
    title: "Auto prin Serbia/Croația",
    note: "Coridor sudic, bun când vrei să eviți ocolul prin Ungaria.",
    waypoints: ["Belgrad, Serbia", "Zagreb, Croația", "Ljubljana, Slovenia"]
  },
  {
    id: "ro-it-hungary-slovenia",
    from: "RO",
    to: "IT",
    title: "Auto prin Ungaria/Slovenia",
    note: "Coridor nordic prin vestul României, Ungaria și Slovenia.",
    waypoints: ["Timișoara, România", "Szeged, Ungaria", "Lenti, Ungaria", "Ljubljana, Slovenia"]
  },
  {
    id: "ro-it-durres-ferry",
    from: "RO",
    to: "IT",
    title: "Auto + bac Durrës",
    note: "Drum mai scurt cu traversare Durrës - Bari.",
    waypoints: ["Belgrad, Serbia", "Pristina, Kosovo", "Durrës, Albania"],
    ferrySegments: [{ from: "Durrës, Albania", to: "Bari, Italia", cost: 95, hours: 9 }]
  },
  {
    id: "ro-it-bulgaria-macedonia-ferry",
    from: "RO",
    to: "IT",
    title: "Bac prin Bulgaria/Macedonia",
    note: "Variantă spre Albania prin Sofia și Skopje.",
    waypoints: ["Sofia, Bulgaria", "Skopje, Macedonia de Nord", "Durrës, Albania"],
    ferrySegments: [{ from: "Durrës, Albania", to: "Bari, Italia", cost: 95, hours: 9 }]
  }
];

const countryNameAliases = {
  romania: "RO",
  bulgaria: "BG",
  grecia: "GR",
  greece: "GR",
  turcia: "TR",
  turkey: "TR",
  ungaria: "HU",
  hungary: "HU",
  austria: "AT",
  serbia: "RS",
  italia: "IT",
  italy: "IT",
  albania: "AL",
  germania: "DE",
  germany: "DE",
  franta: "FR",
  france: "FR",
  spania: "ES",
  spain: "ES",
  croatia: "HR",
  slovenia: "SI",
  slovacia: "SK",
  macedonia: "MK",
  kosovo: "XK"
};

const defaults = {
  from: "",
  to: "",
  startDate: "2026-07-06",
  endDate: "2026-07-14",
  distanceKm: 0,
  driveHours: 0,
  routeSource: "Rută necalculată",
  adults: 2,
  children: 2,
  childAges: "4, 9",
  rooms: 1,
  maxDailyHours: 7,
  localKm: 0,
  fuelType: "gasoline",
  fuelConsumption: 7.4,
  fuelPrice: 1.55,
  nightlyBudget: 115,
  foodDaily: 26,
  tolls: 0,
  ferry: 0,
  ferryLabel: "",
  waypoints: [],
  ferrySegments: [],
  fromPlace: null,
  toPlace: null,
  routeGeometry: null,
  waypointPlaces: [],
  routeSegments: [],
  routeVariants: [],
  routeZones: [],
  language: "ro",
  theme: "light",
  aiProvider: "proxy",
  aiEndpoint: "/api/ai-suggestions",
  aiModel: "gemini-2.5-flash",
  aiKey: "",
  aiPrompt: "Sugerează locuri de văzut pe traseu, opriri bune cu copii, ce merită în destinație și ce merită evitat. Vreau recomandări practice, pe zile, cu distanțe aproximative.",
  aiOutput: "",
  roundTrip: true
};

let mode = "comfort";
let lastPlan = null;
let routeMeta = {
  source: defaults.routeSource,
  fromPlace: null,
  toPlace: null,
  ferryLabel: "",
  routeGeometry: null,
  waypointPlaces: [],
  routeSegments: [],
  routeVariants: []
};
let leafletMap = null;
let routeLayer = null;
let markerLayer = null;
let routeVariantCache = new Map();
let language = defaults.language;
let theme = defaults.theme;
let lastWeatherCoords = { lat: null, lon: null };

const fields = {
  from: document.querySelector("#from"),
  to: document.querySelector("#to"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  distanceKm: document.querySelector("#distanceKm"),
  driveHours: document.querySelector("#driveHours"),
  adults: document.querySelector("#adults"),
  children: document.querySelector("#children"),
  childAges: document.querySelector("#childAges"),
  rooms: document.querySelector("#rooms"),
  maxDailyHours: document.querySelector("#maxDailyHours"),
  localKm: document.querySelector("#localKm"),
  fuelType: document.querySelector("#fuelType"),
  fuelConsumption: document.querySelector("#fuelConsumption"),
  fuelPrice: document.querySelector("#fuelPrice"),
  nightlyBudget: document.querySelector("#nightlyBudget"),
  foodDaily: document.querySelector("#foodDaily"),
  tolls: document.querySelector("#tolls"),
  ferry: document.querySelector("#ferry"),
  roundTrip: document.querySelector("#roundTrip")
};

const form = document.querySelector("#tripForm");
const langRoBtn = document.querySelector("#langRoBtn");
const langEnBtn = document.querySelector("#langEnBtn");
const themeToggleBtn = document.querySelector("#themeToggleBtn");
const cityHints = document.querySelector("#cityHints");
const routeZonesEl = document.querySelector("#routeZones");
const routeStatus = document.querySelector("#routeStatus");
const routeVariantsEl = document.querySelector("#routeVariants");
const fuelConsumptionLabel = document.querySelector("#fuelConsumptionLabel");
const fuelPriceLabel = document.querySelector("#fuelPriceLabel");
const fuelOnlineStatus = document.querySelector("#fuelOnlineStatus");
const tollOnlineStatus = document.querySelector("#tollOnlineStatus");
const waypointInput = document.querySelector("#waypointInput");
const routePathInput = document.querySelector("#routePathInput");
const waypointList = document.querySelector("#waypointList");
const ferryList = document.querySelector("#ferryList");
const aiProvider = document.querySelector("#aiProvider");
const aiEndpoint = document.querySelector("#aiEndpoint");
const aiModel = document.querySelector("#aiModel");
const aiKey = document.querySelector("#aiKey");
const aiPrompt = document.querySelector("#aiPrompt");
const aiOutput = document.querySelector("#aiOutput");
const runAiBtn = document.querySelector("#runAiBtn");
const refreshFuelBtn = document.querySelector("#refreshFuelBtn");
const refreshTollsBtn = document.querySelector("#refreshTollsBtn");
const aiResultModal = document.querySelector("#aiResultModal");
const aiResultModalText = document.querySelector("#aiResultModalText");
const closeAiResultBtn = document.querySelector("#closeAiResultBtn");
const openAiResultBtn = document.querySelector("#openAiResultBtn");
const savedScenariosSelect = document.querySelector("#savedScenariosSelect");
const deleteScenarioBtn = document.querySelector("#deleteScenarioBtn");
const newScenarioName = document.querySelector("#newScenarioName");
const saveScenarioBtn = document.querySelector("#saveScenarioBtn");
const checklistPanel = document.querySelector("#checklistPanel");
const checklistBody = document.querySelector("#checklistBody");
const checklistTitleRow = document.querySelector("#checklistTitleRow");
const checklistToggleArrow = document.querySelector("#checklistToggleArrow");
const printPdfBtn = document.querySelector("#printPdfBtn");
const destinationWeather = document.querySelector("#destinationWeather");

const uiText = {
  ro: {
    personalPlan: "Plan personal",
    route: "Traseu",
    reset: "Resetează",
    notCalculated: "Rută necalculată",
    from: "Plecare",
    to: "Destinație",
    departureDate: "Data plecării",
    returnDate: "Data întoarcerii",
    oneWayKm: "Km dus",
    oneWayHours: "Ore drum dus",
    waypoints: "Puncte intermediare",
    add: "Adaugă",
    fullRoute: "Traseu complet",
    applyPoints: "Aplică puncte",
    ferryOnRoute: "Bac pe traseu",
    addFerry: "Adaugă bac",
    calculateKm: "Calculează km",
    fuelData: "Date combustibil",
    familyComfort: "Familie și confort",
    adults: "Adulți",
    children: "Copii",
    rooms: "Camere",
    childAges: "Vârste copii",
    maxHours: "Max ore condus/zi",
    localKm: "Km locali",
    fuelTaxes: "Combustibil și taxe",
    fuelType: "Tip combustibil",
    tollsOneWay: "Taxe drum dus €",
    ferryOneWay: "Bac dus €",
    onlinePrices: "Prețuri online",
    roadTolls: "Taxe drum",
    stayBudget: "Buget sejur",
    lodgingNight: "Cazare €/noapte/cameră",
    foodDay: "Mâncare €/zi/pers.",
    roundTrip: "Calculează dus-întors",
    recalculate: "Recalculează",
    exportPlan: "Export plan",
    activeScenario: "Scenariu activ",
    totalEstimate: "Total estimat",
    fuel: "Combustibil",
    lodging: "Cazare",
    recommendation: "Recomandare",
    bestBalanced: "Cel mai echilibrat",
    bestFit: "Cea mai bună potrivire",
    mapPlan: "Hartă plan",
    routeStops: "Ruta și opririle",
    comfort: "Confort",
    fast: "Rapid",
    comparison: "Comparație",
    transport: "Transport",
    roadCosts: "Costuri pe drum",
    fuelCountriesTaxes: "Combustibil, țări și taxe",
    aiIdeas: "Zone de văzut și idei pe traseu",
    aiRequest: "Cerere info AI",
    askAi: "Cere sugestii AI",
    dayPlan: "Plan pe zile",
    itinerary: "Itinerar",
    stays: "Cazări",
    candidateOptions: "Opțiuni candidate",
    enRoute: "Pe traseu",
    goodStops: "Opriri bune",
    placesToSee: "Zone de văzut",
    aiGenerated: "Sugestii generate",
    viewResult: "Vezi rezultat",
    close: "Închide",
    nightMode: "Night mode",
    lightMode: "Light mode",
    fuelOnlineStatusDefault: "Prețurile online se aplică pe țările detectate în traseu.",
    tollStatusDefault: "Taxele sunt estimate pe țări: vignetă, rovinietă sau €/km unde se aplică.",
    aiPromptDefault: "Sugerează locuri de văzut pe traseu, opriri bune cu copii, ce merită în destinație și ce merită evitat. Vreau recomandări practice, pe zile, cu distanțe aproximative.",
    aiOutputDefault: "Endpoint server activ. Poți cere sugestii fără API key în pagină după ce rewrite-ul din Amplify trimite /api/ai-suggestions către Lambda.",
    fromPlaceholder: "ex: Craiova, România",
    toPlaceholder: "ex: Bari, Italia",
    waypointPlaceholder: "ex: Durrës, Albania",
    routePathPlaceholder: "Craiova -> Timișoara -> Szeged -> Ljubljana -> Bari",
    childAgesPlaceholder: "ex: 4, 9",
    gasoline: "Benzină",
    diesel: "Diesel",
    lpg: "GPL",
    electric: "Electric",
    consumptionGas: "Consum l/100 km",
    consumptionElectric: "Consum kWh/100 km",
    averagePrice: "Preț mediu",
    perPerson: "persoană",
    nights: "nopți",
    people: "persoane",
    totalKm: "km total",
    calculateRoute: "Calculează ruta",
    noRoute: "Fără rută auto",
    liveRouting: "Rutare live",
    partialRouting: "Rutare parțială",
    ferryShort: "bac",
    countriesFromRoute: "țări din rută",
    countriesEstimated: "țări estimate",
    savedScenarios: "Scenarii salvate",
    chooseScenario: "Alege un scenariu...",
    save: "Salvează",
    delete: "Șterge",
    scenarioNamePlaceholder: "Nume (ex: Grecia 2026)",
    checklistTitle: "Pregătiri și Checklist Traseu",
    checkVignette: "Cumpără vignetă/rovinietă pentru {country} ({details})",
    checkPassport: "Verifică valabilitatea pașaportului (călătorie în afara UE / tranzit în {country})",
    checkGreenCard: "Verifică asigurarea cărții verzi a mașinii pentru {country}",
    checkCarOil: "Verifică nivelul uleiului de motor și al lichidului de răcire",
    checkCarTires: "Verifică presiunea pneurilor și starea anvelopei de rezervă",
    checkCarKit: "Asigură-te că ai trusa medicală, stingătorul și triunghiurile reflectorizante",
    checkKidsSnacks: "Pregătește apă și gustări suficiente pentru drum",
    checkKidsEntertainment: "Pregătește jocuri și tablete/activități pentru copii",
    weatherLoading: "Se încarcă vremea...",
    weatherTemp: "Vreme: {temp}°C, {desc}",
    printPdf: "Printează PDF"
  },
  en: {
    personalPlan: "Personal plan",
    route: "Route",
    reset: "Reset",
    notCalculated: "Route not calculated",
    from: "From",
    to: "Destination",
    departureDate: "Departure date",
    returnDate: "Return date",
    oneWayKm: "One-way km",
    oneWayHours: "One-way driving hours",
    waypoints: "Intermediate stops",
    add: "Add",
    fullRoute: "Full route",
    applyPoints: "Apply stops",
    ferryOnRoute: "Ferry on route",
    addFerry: "Add ferry",
    calculateKm: "Calculate km",
    fuelData: "Fuel data",
    familyComfort: "Family and comfort",
    adults: "Adults",
    children: "Children",
    rooms: "Rooms",
    childAges: "Child ages",
    maxHours: "Max driving hours/day",
    localKm: "Local km",
    fuelTaxes: "Fuel and tolls",
    fuelType: "Fuel type",
    tollsOneWay: "Road tolls one-way €",
    ferryOneWay: "Ferry one-way €",
    onlinePrices: "Online prices",
    roadTolls: "Road tolls",
    stayBudget: "Stay budget",
    lodgingNight: "Lodging €/night/room",
    foodDay: "Food €/day/person",
    roundTrip: "Calculate round trip",
    recalculate: "Recalculate",
    exportPlan: "Export plan",
    activeScenario: "Active scenario",
    totalEstimate: "Total estimate",
    fuel: "Fuel",
    lodging: "Lodging",
    recommendation: "Recommendation",
    bestBalanced: "Most balanced",
    bestFit: "Best fit",
    mapPlan: "Map plan",
    routeStops: "Route and stops",
    comfort: "Comfort",
    fast: "Fast",
    comparison: "Comparison",
    transport: "Transport",
    roadCosts: "Road costs",
    fuelCountriesTaxes: "Fuel, countries and tolls",
    aiIdeas: "Sightseeing and route ideas",
    aiRequest: "AI prompt",
    askAi: "Get AI suggestions",
    dayPlan: "Day-by-day plan",
    itinerary: "Itinerary",
    stays: "Lodging",
    candidateOptions: "Candidate stays",
    enRoute: "En route",
    goodStops: "Good stops",
    placesToSee: "Places to see",
    aiGenerated: "AI suggestions",
    viewResult: "View result",
    close: "Close",
    nightMode: "Night mode",
    lightMode: "Light mode",
    fuelOnlineStatusDefault: "Online prices apply to countries detected on route.",
    tollStatusDefault: "Tolls are estimated per country: vignette or €/km where applicable.",
    aiPromptDefault: "Suggest places to see along the route, good stops for kids, what is worth seeing at destination and what to avoid. Provide practical recommendations, day-by-day, with approximate distances.",
    aiOutputDefault: "Server endpoint active. You can request suggestions without an API key in the browser after Amplify rewrite redirects /api/ai-suggestions to Lambda.",
    fromPlaceholder: "e.g. Bucharest, Romania",
    toPlaceholder: "e.g. Athens, Greece",
    waypointPlaceholder: "e.g. Sofia, Bulgaria",
    routePathPlaceholder: "Bucharest -> Sofia -> Thessaloniki -> Athens",
    childAgesPlaceholder: "e.g. 4, 9",
    gasoline: "Gasoline",
    diesel: "Diesel",
    lpg: "LPG",
    electric: "Electric",
    consumptionGas: "Consumption l/100 km",
    consumptionElectric: "Consumption kWh/100 km",
    averagePrice: "Average price",
    perPerson: "person",
    nights: "nights",
    people: "people",
    totalKm: "total km",
    calculateRoute: "Calculate route",
    noRoute: "No car route",
    liveRouting: "Live routing",
    partialRouting: "Partial routing",
    ferryShort: "ferry",
    countriesFromRoute: "countries on route",
    countriesEstimated: "estimated countries",
    savedScenarios: "Saved scenarios",
    chooseScenario: "Choose a scenario...",
    save: "Save",
    delete: "Delete",
    scenarioNamePlaceholder: "Name (e.g. Greece 2026)",
    checklistTitle: "Route Preparation Checklist",
    checkVignette: "Buy vignette for {country} ({details})",
    checkPassport: "Check passport validity (travel outside EU / transit in {country})",
    checkGreenCard: "Check car Green Card insurance validity for {country}",
    checkCarOil: "Check motor oil and coolant levels",
    checkCarTires: "Check tire pressure and the spare wheel",
    checkCarKit: "Ensure you have the first aid kit, fire extinguisher, and warning triangles",
    checkKidsSnacks: "Prepare sufficient water and road snacks",
    checkKidsEntertainment: "Prepare games and activities/tablets for children",
    weatherLoading: "Loading weather...",
    weatherTemp: "Weather: {temp}°C, {desc}",
    printPdf: "Print PDF"
  }
};

cityHints.innerHTML = cityCatalog.map((city) => `<option value="${city.name}"></option>`).join("");

function t(key) {
  return uiText[language]?.[key] || uiText.ro[key] || key;
}

function ownTextNode(element) {
  if (!element) return null;
  return [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
}

function setOwnText(selector, key) {
  const element = document.querySelector(selector);
  const text = t(key);
  const node = ownTextNode(element);
  if (node) {
    node.textContent = ` ${text} `;
  } else if (element) {
    element.append(document.createTextNode(text));
  }
}

function setText(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.textContent = t(key);
}

function setParentLabelText(fieldSelector, key) {
  const field = document.querySelector(fieldSelector);
  const label = field?.closest("label");
  const node = ownTextNode(label);
  if (node) node.textContent = `\n                ${t(key)}\n                `;
}

function setPlaceholder(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.placeholder = t(key);
}

function fuelTypeLabel(type) {
  return t(type === "gasoline" ? "gasoline" : type);
}

function fuelConsumptionText(type) {
  return type === "electric" ? t("consumptionElectric") : t("consumptionGas");
}

function applyTheme(nextTheme = theme) {
  theme = nextTheme === "dark" ? "dark" : "light";
  document.body.dataset.theme = theme;
  const use = themeToggleBtn.querySelector("use");
  if (use) use.setAttribute("href", theme === "dark" ? "#icon-sun" : "#icon-moon");
  const label = theme === "dark" ? t("lightMode") : t("nightMode");
  themeToggleBtn.setAttribute("aria-label", label);
  themeToggleBtn.title = label;
}

function applyLanguage(nextLanguage = language, options = {}) {
  language = nextLanguage === "en" ? "en" : "ro";
  document.documentElement.lang = language;
  langRoBtn.classList.toggle("active", language === "ro");
  langEnBtn.classList.toggle("active", language === "en");

  setText(".brand-row .eyebrow", "personalPlan");
  setText("#tripForm .form-section:nth-of-type(1) .section-title span", "route");
  setText("#tripForm .form-section:nth-of-type(2) .section-title span", "familyComfort");
  setText("#tripForm .form-section:nth-of-type(3) .section-title span", "fuelTaxes");
  setText("#tripForm .form-section:nth-of-type(4) .section-title span", "stayBudget");
  setText(".route-builder:nth-of-type(1) .subsection-title", "waypoints");
  setText(".route-builder:nth-of-type(2) .subsection-title", "ferryOnRoute");
  setText(".topbar .eyebrow", "activeScenario");
  setText(".summary-grid .metric:nth-child(1) span", "totalEstimate");
  setText(".summary-grid .metric:nth-child(2) span", "fuel");
  setText(".summary-grid .metric:nth-child(3) span", "lodging");
  setText(".summary-grid .metric:nth-child(4) span", "recommendation");
  setText(".map-panel .eyebrow", "mapPlan");
  setText(".decision-panel .eyebrow", "comparison");
  setText(".decision-panel h3", "transport");
  setText(".content-grid .content-panel:nth-child(1) .eyebrow", "roadCosts");
  setText(".content-grid .content-panel:nth-child(1) h3", "fuelCountriesTaxes");
  setText(".content-grid .content-panel:nth-child(2) h3", "aiIdeas");
  setText(".content-grid .content-panel:nth-child(3) .eyebrow", "dayPlan");
  setText(".content-grid .content-panel:nth-child(3) h3", "itinerary");
  setText(".content-grid .content-panel:nth-child(4) .eyebrow", "stays");
  setText(".content-grid .content-panel:nth-child(4) h3", "candidateOptions");
  setText(".content-grid .content-panel:nth-child(5) .eyebrow", "enRoute");
  setText(".content-grid .content-panel:nth-child(5) h3", "goodStops");
  setText(".split-list > div:nth-child(1) h4", "goodStops");
  setText(".split-list > div:nth-child(2) h4", "placesToSee");
  setText("#aiResultTitle", "aiGenerated");

  setParentLabelText("#from", "from");
  setParentLabelText("#to", "to");
  setParentLabelText("#startDate", "departureDate");
  setParentLabelText("#endDate", "returnDate");
  setParentLabelText("#distanceKm", "oneWayKm");
  setParentLabelText("#driveHours", "oneWayHours");
  setParentLabelText("#routePathInput", "fullRoute");
  setParentLabelText("#adults", "adults");
  setParentLabelText("#children", "children");
  setParentLabelText("#rooms", "rooms");
  setParentLabelText("#childAges", "childAges");
  setParentLabelText("#maxDailyHours", "maxHours");
  setParentLabelText("#localKm", "localKm");
  setParentLabelText("#fuelType", "fuelType");
  setParentLabelText("#tolls", "tollsOneWay");
  setParentLabelText("#ferry", "ferryOneWay");
  setParentLabelText("#nightlyBudget", "lodgingNight");
  setParentLabelText("#foodDaily", "foodDay");
  setParentLabelText("#aiPrompt", "aiRequest");

  setOwnText("#addWaypointBtn", "add");
  setOwnText("#applyRoutePathBtn", "applyPoints");
  setOwnText("#addFerryBtn", "addFerry");
  setOwnText("#autoRouteBtn", "calculateKm");
  setOwnText("#fuelTemplateBtn", "fuelData");
  setOwnText("#refreshFuelBtn", "onlinePrices");
  setOwnText("#refreshTollsBtn", "roadTolls");
  setOwnText(".actions-row > .primary-button[type='submit']", "recalculate");
  setOwnText("#exportBtn", "exportPlan");
  setOwnText("#runAiBtn", "askAi");
  setOwnText("#openAiResultBtn", "viewResult");
  setText("#modeComfort", "comfort");
  setText("#modeFast", "fast");

  // New translations
  setText("#lblSavedScenarios", "savedScenarios");
  setText("#optChooseScenario", "chooseScenario");
  setOwnText("#saveScenarioBtn", "save");
  setPlaceholder("#newScenarioName", "scenarioNamePlaceholder");
  setText("#lblChecklistTitle", "checklistTitle");
  setOwnText("#printPdfBtn", "printPdf");

  setPlaceholder("#from", "fromPlaceholder");
  setPlaceholder("#to", "toPlaceholder");
  setPlaceholder("#waypointInput", "waypointPlaceholder");
  setPlaceholder("#routePathInput", "routePathPlaceholder");
  setPlaceholder("#childAges", "childAgesPlaceholder");

  document.querySelector("#fuelType option[value='gasoline']").textContent = t("gasoline");
  document.querySelector("#fuelType option[value='diesel']").textContent = t("diesel");
  document.querySelector("#fuelType option[value='lpg']").textContent = t("lpg");
  document.querySelector("#fuelType option[value='electric']").textContent = t("electric");
  document.querySelector("#resetBtn").setAttribute("aria-label", t("reset"));
  document.querySelector("#resetBtn").title = t("reset");
  closeAiResultBtn.setAttribute("aria-label", t("close"));
  closeAiResultBtn.title = t("close");

  const roundTripSpan = document.querySelector(".check-row span");
  if (roundTripSpan) roundTripSpan.textContent = t("roundTrip");
  const currentStatus = routeStatus.textContent.trim();
  if (!currentStatus || currentStatus === uiText.ro.notCalculated || currentStatus === uiText.en.notCalculated) {
    routeStatus.textContent = t("notCalculated");
    routeMeta.source = t("notCalculated");
  }
  fuelOnlineStatus.textContent = t("fuelOnlineStatusDefault");
  tollOnlineStatus.textContent = t("tollStatusDefault");

  const prompts = [uiText.ro.aiPromptDefault, uiText.en.aiPromptDefault];
  if (prompts.includes(aiPrompt.value.trim())) aiPrompt.value = t("aiPromptDefault");
  const aiHints = [uiText.ro.aiOutputDefault, uiText.en.aiOutputDefault, ""];
  if (aiHints.includes(aiOutput.textContent.trim())) aiOutput.textContent = t("aiOutputDefault");

  updateFuelLabels(true);
  applyTheme(theme);
  if (options.render !== false) render();
}

function euro(value) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Math.round(value || 0));
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function daysBetween(start, end) {
  const startTime = new Date(`${start}T12:00:00`).getTime();
  const endTime = new Date(`${end}T12:00:00`).getTime();
  const diff = Math.round((endTime - startTime) / 86400000);
  return Math.max(1, diff || 1);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
}

function haversineKm(a, b) {
  const earthRadiusKm = 6371;
  const toRad = (value) => value * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function geometrySegmentKm(a, b) {
  return haversineKm(
    { lat: a[1], lon: a[0] },
    { lat: b[1], lon: b[0] }
  );
}

function roundTo(value, step) {
  return Math.round(value / step) * step;
}

function findLocalCity(query) {
  const needle = normalize(query).replaceAll("-", " ");
  if (!needle) return null;
  const directMatch = cityCatalog.find((city) => {
    const normName = normalize(city.name).replaceAll("-", " ");
    return normName === needle || normName.startsWith(needle);
  });
  if (directMatch) return directMatch;

  const cityPart = needle.split(",")[0]?.trim();
  const countryCode = countryCodeFromText(query);
  if (!cityPart) return null;
  return cityCatalog.find((city) => {
    const catalogCity = normalize(city.name).replaceAll("-", " ").split(",")[0]?.trim();
    return catalogCity === cityPart && (!countryCode || city.countryCode === countryCode);
  }) || null;
}

function countryFor(code) {
  return countryFuelDefaults[code] || { ...countryFuelDefaults.DEFAULT, name: code || "Zonă" };
}

function getCountryCode(place) {
  return String(place?.countryCode || "DEFAULT").toUpperCase();
}

function countryCodeFromText(text) {
  const normalized = normalize(text);
  return Object.entries(countryNameAliases).find(([name]) => normalized.includes(name))?.[1] || null;
}

async function geocodePlace(query) {
  const q = query.trim();
  if (!q) throw new Error("Oraș lipsă");
  const local = findLocalCity(q);
  if (local) return { ...local, source: "local" };

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "1");
    url.searchParams.set("q", q);
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "FamilyTripPlanner/1.0 (sebastian@msecur.ro)"
      }
    });
    if (!response.ok) throw new Error("Geocoding indisponibil");
    const results = await response.json();
    if (results?.length) {
      const result = results[0];
      const address = result.address || {};
      const name = address.city || address.town || address.village || address.municipality || result.name || q;
      const country = address.country || countryFor(address.country_code?.toUpperCase()).name;
      return {
        name: `${name}, ${country}`,
        lat: Number(result.lat),
        lon: Number(result.lon),
        countryCode: String(address.country_code || "").toUpperCase() || local?.countryCode || "DEFAULT",
        source: "Nominatim"
      };
    }
  } catch (error) {
    console.info("Geocoding fallback:", error.message);
  }

  if (local) return { ...local, source: "local" };
  throw new Error(`Nu am găsit orașul "${query}".`);
}

async function fetchRoadRoute(fromPlace, toPlace) {
  const coords = `${fromPlace.lon},${fromPlace.lat};${toPlace.lon},${toPlace.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&alternatives=false&steps=false`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Rutare indisponibilă");
  const data = await response.json();
  const route = data.routes?.[0];
  if (!route?.distance || !route?.duration) throw new Error("Nu există rută auto");
  return {
    km: roundTo(route.distance / 1000, 1),
    hours: Math.round((route.duration / 3600) * 10) / 10,
    source: "Rutare live",
    geometry: route.geometry || null
  };
}

function estimateFallbackRoute(fromPlace, toPlace) {
  const directKm = haversineKm(fromPlace, toPlace);
  const factor = directKm > 1400 ? 1.22 : directKm > 800 ? 1.28 : directKm > 300 ? 1.24 : 1.16;
  const km = Math.max(10, roundTo(directKm * factor, 10));
  return {
    km,
    hours: Math.round((km / 78) * 10) / 10,
    source: "Estimare offline",
    geometry: {
      type: "LineString",
      coordinates: [
        [fromPlace.lon, fromPlace.lat],
        [toPlace.lon, toPlace.lat]
      ]
    }
  };
}

function corridorCodes(fromCode, toCode) {
  if (fromCode === toCode) return [fromCode];
  const key = `${fromCode}-${toCode}`;
  const reverseKey = `${toCode}-${fromCode}`;
  if (corridorMap[key]) return corridorMap[key];
  if (corridorMap[reverseKey]) return [...corridorMap[reverseKey]].reverse();
  return [fromCode, toCode];
}

function reverseCountryKey(lon, lat) {
  return `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
}

async function reverseCountryAt(lon, lat) {
  if (!Number.isFinite(Number(lon)) || !Number.isFinite(Number(lat))) return null;
  const key = reverseCountryKey(lon, lat);
  if (reverseCountryCache.has(key)) return reverseCountryCache.get(key);

  let code = null;
  try {
    const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);
    url.searchParams.set("localityLanguage", "en");
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Reverse geocoding principal indisponibil");
    const data = await response.json();
    code = String(data.countryCode || "").toUpperCase() || null;
  } catch (error) {
    console.info("Country reverse primary fallback:", error.message);
  }

  if (!code) {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("zoom", "5");
      url.searchParams.set("accept-language", "ro,en");
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lon);
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": "FamilyTripPlanner/1.0 (sebastian@msecur.ro)"
        }
      });
      if (!response.ok) throw new Error("Reverse geocoding indisponibil");
      const data = await response.json();
      code = String(data.address?.country_code || data.country_code || "").toUpperCase() || null;
    } catch (error) {
      console.info("Country reverse fallback:", error.message);
    }
  }

  reverseCountryCache.set(key, code);
  saveReverseCountryCache();
  return code;
}

function coordinateAtDistance(coordinates, cumulativeKm, targetKm) {
  let segmentIndex = 0;
  while (segmentIndex < cumulativeKm.length - 2 && cumulativeKm[segmentIndex + 1] < targetKm) {
    segmentIndex += 1;
  }

  const from = coordinates[segmentIndex];
  const to = coordinates[segmentIndex + 1] || from;
  const startKm = cumulativeKm[segmentIndex] || 0;
  const endKm = cumulativeKm[segmentIndex + 1] || startKm;
  const ratio = endKm > startKm ? (targetKm - startKm) / (endKm - startKm) : 0;
  return {
    lon: from[0] + (to[0] - from[0]) * ratio,
    lat: from[1] + (to[1] - from[1]) * ratio
  };
}

function sampleGeometryPoints(geometry, routeKm = 0, maxSamples = 22) {
  const coordinates = geometry?.type === "LineString" ? geometry.coordinates : [];
  if (!coordinates.length) return [];
  if (coordinates.length === 1) {
    return [{ lon: coordinates[0][0], lat: coordinates[0][1], kmFromStart: 0 }];
  }

  const cumulativeKm = [0];
  for (let index = 1; index < coordinates.length; index += 1) {
    cumulativeKm.push(cumulativeKm[index - 1] + geometrySegmentKm(coordinates[index - 1], coordinates[index]));
  }

  const geometryKm = cumulativeKm.at(-1) || 0;
  if (geometryKm <= 0) {
    return [
      { lon: coordinates[0][0], lat: coordinates[0][1], kmFromStart: 0 },
      { lon: coordinates.at(-1)[0], lat: coordinates.at(-1)[1], kmFromStart: routeKm || 0 }
    ];
  }

  const effectiveRouteKm = routeKm > 0 ? routeKm : geometryKm;
  const sampleCount = clamp(Math.ceil(effectiveRouteKm / 90) + 1, 4, maxSamples);
  return Array.from({ length: sampleCount }, (_, index) => {
    const targetKm = geometryKm * index / (sampleCount - 1);
    const point = coordinateAtDistance(coordinates, cumulativeKm, targetKm);
    return {
      ...point,
      kmFromStart: effectiveRouteKm * targetKm / geometryKm
    };
  });
}

function fillMissingCountryCodes(codes) {
  return codes.map((code, index) => {
    if (code) return code;
    const previous = codes.slice(0, index).reverse().find(Boolean);
    const next = codes.slice(index + 1).find(Boolean);
    return previous === next ? previous : (previous || next || null);
  });
}

function addRouteZoneBucket(buckets, code, km) {
  const normalizedCode = String(code || "").toUpperCase();
  if (!normalizedCode || normalizedCode === "DEFAULT" || km <= 0) return;
  const existing = buckets.find((bucket) => bucket.code === normalizedCode);
  if (existing) {
    existing.km += km;
  } else {
    buckets.push({ code: normalizedCode, km });
  }
}

function routeZonesFromBuckets(buckets, fuelType) {
  return buckets
    .filter((bucket) => bucket.km > 0.5)
    .map((bucket) => {
      const country = countryFor(bucket.code);
      const km = Math.max(1, Math.round(bucket.km));
      const tollEstimate = estimateRoadToll({ code: bucket.code, km });
      return {
        code: bucket.code,
        name: country.name,
        km,
        fuelPrice: country.prices[fuelType] ?? country.prices.gasoline,
        toll: tollEstimate.toll,
        tollNote: tollEstimate.note
      };
    });
}

async function inferRouteZonesFromRouteSegments(routeSegments, fuelType) {
  const buckets = [];
  for (const segment of routeSegments) {
    if (segment.type !== "road" || !segment.geometry?.coordinates?.length) continue;
    const samples = sampleGeometryPoints(segment.geometry, segment.km);
    if (samples.length < 2) continue;

    const codes = [];
    for (let index = 0; index < samples.length; index += 1) {
      const sample = samples[index];
      let code = null;
      if (index === 0) {
        code = getCountryCode(segment.fromPlace);
      } else if (index === samples.length - 1) {
        code = getCountryCode(segment.toPlace);
      }
      if (!code || code === "DEFAULT") {
        code = await reverseCountryAt(sample.lon, sample.lat);
      }
      codes.push(code && code !== "DEFAULT" ? code : null);
    }

    const filledCodes = fillMissingCountryCodes(codes);
    for (let index = 0; index < samples.length - 1; index += 1) {
      const km = Math.max(0, samples[index + 1].kmFromStart - samples[index].kmFromStart);
      const fromCode = filledCodes[index];
      const toCode = filledCodes[index + 1];
      if (!fromCode && !toCode) continue;
      if (fromCode === toCode || !toCode) {
        addRouteZoneBucket(buckets, fromCode, km);
      } else if (!fromCode) {
        addRouteZoneBucket(buckets, toCode, km);
      } else {
        addRouteZoneBucket(buckets, fromCode, km / 2);
        addRouteZoneBucket(buckets, toCode, km / 2);
      }
    }
  }

  return routeZonesFromBuckets(buckets, fuelType);
}

function routeZonesForFuelType(zones, fuelType) {
  return zones.map((zone) => {
    const country = countryFor(zone.code);
    const tollEstimate = estimateRoadToll(zone);
    return {
      ...zone,
      fuelPrice: country.prices[fuelType] ?? country.prices.gasoline ?? zone.fuelPrice,
      toll: Number.isFinite(zone.toll) ? zone.toll : tollEstimate.toll,
      tollNote: zone.tollNote || tollEstimate.note
    };
  });
}

function shouldUseEstimatedRouteZones(liveZones, fallbackZones, roadLegs) {
  if (!liveZones.length) return true;
  const liveCodes = new Set(liveZones.map((zone) => zone.code).filter(Boolean));
  const endpointCodes = new Set(roadLegs.flatMap((leg) => [
    getCountryCode(leg.from),
    getCountryCode(leg.to)
  ]).filter((code) => code && code !== "DEFAULT"));
  const hasDetectedTransitCountry = [...liveCodes].some((code) => !endpointCodes.has(code));
  const routeKm = roadLegs.reduce((sum, leg) => sum + leg.km, 0);
  const fallbackAddsCountries = fallbackZones.some((zone) => !liveCodes.has(zone.code));
  return routeKm > 350 && fallbackAddsCountries && !hasDetectedTransitCountry;
}

function inferRouteZones(fromPlace, toPlace, km, fuelType) {
  const codes = corridorCodes(getCountryCode(fromPlace), getCountryCode(toPlace));
  const weight = codes.map((code, index) => {
    if (codes.length === 1) return 1;
    if (index === 0 || index === codes.length - 1) return 0.65;
    return 1;
  });
  const totalWeight = weight.reduce((sum, item) => sum + item, 0);
  return codes.map((code, index) => {
    const country = countryFor(code);
    return {
      code,
      name: country.name,
      km: Math.max(1, Math.round((km * weight[index]) / totalWeight)),
      fuelPrice: country.prices[fuelType] ?? country.prices.gasoline,
      toll: estimateRoadToll({ code, km: Math.max(1, Math.round((km * weight[index]) / totalWeight)) }).toll
    };
  });
}

function inferRouteZonesFromLegs(roadLegs, fuelType) {
  const buckets = [];
  roadLegs.forEach((leg) => {
    const codes = corridorCodes(getCountryCode(leg.from), getCountryCode(leg.to));
    const weights = codes.map((code, index) => {
      if (codes.length === 1) return 1;
      if (index === 0 || index === codes.length - 1) return 0.65;
      return 1;
    });
    const totalWeight = weights.reduce((sum, item) => sum + item, 0);
    codes.forEach((code, index) => {
      const km = Math.max(1, Math.round((leg.km * weights[index]) / totalWeight));
      const existing = buckets.find((bucket) => bucket.code === code);
      if (existing) {
        existing.km += km;
        existing.toll = estimateRoadToll(existing).toll;
      } else {
        const country = countryFor(code);
        buckets.push({
          code,
          name: country.name,
          km,
          fuelPrice: country.prices[fuelType] ?? country.prices.gasoline,
          toll: estimateRoadToll({ code, km }).toll
        });
      }
    });
  });
  return buckets;
}

function estimateRoadToll(zone) {
  const profile = roadTollProfiles[zone.code] || roadTollProfiles.DEFAULT;
  const fallback = countryFor(zone.code).toll || 0;
  if (profile.type === "free") {
    return { toll: 0, note: profile.label };
  }
  if (profile.type === "fixed") {
    return { toll: roundMoney(profile.fixed), note: profile.label };
  }
  if (profile.type === "perKm") {
    const tolledKm = Math.max(0, zone.km || 0) * (profile.motorwayShare ?? 1);
    const raw = tolledKm * profile.rate;
    const toll = raw > 0 ? Math.max(profile.min || 0, raw) : 0;
    return { toll: roundMoney(toll), note: profile.label };
  }
  return { toll: roundMoney(fallback), note: profile.label };
}

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function suggestFerry(text) {
  const normalized = normalize(text);
  return ferrySuggestions.find((suggestion) =>
    suggestion.match.some((item) => normalized.includes(normalize(item)))
  );
}

function ferryPresetFor(fromName, toName) {
  const from = normalize(fromName);
  const to = normalize(toName);
  return ferryRoutePresets.find((preset) =>
    from.includes(preset.from) && to.includes(preset.to)
  );
}

function samePlaceLabel(a, b) {
  const left = normalize(a).split(",")[0];
  const right = normalize(b).split(",")[0];
  return left && right && (left === right || left.includes(right) || right.includes(left));
}

function readWaypoints() {
  return [...waypointList.querySelectorAll(".chip-item")].map((item) => item.dataset.value);
}

function parseRoutePath(text) {
  return String(text || "")
    .split(/\n|;|\||→|->/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyRoutePath() {
  const parts = parseRoutePath(routePathInput.value);
  if (parts.length < 2) {
    showToast("Pune cel puțin plecare și destinație.");
    return;
  }

  fields.from.value = parts[0];
  fields.to.value = parts.at(-1);
  renderWaypoints(parts.slice(1, -1));
  routePathInput.value = "";
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
  render();
  showToast(`${Math.max(0, parts.length - 2)} puncte intermediare aplicate.`);
}

function renderWaypoints(waypoints) {
  waypointList.innerHTML = waypoints.map((value, index) => `
    <div class="chip-item" data-value="${value}">
      <span>${index + 1}. ${value}</span>
      <button class="mini-button" type="button" data-remove-waypoint="${index}" aria-label="Șterge ${value}">×</button>
    </div>
  `).join("");
}

function readFerrySegments() {
  return [...ferryList.querySelectorAll(".ferry-row")].map((row) => ({
    from: row.querySelector("[data-ferry-from]").value.trim(),
    to: row.querySelector("[data-ferry-to]").value.trim(),
    cost: number(row.querySelector("[data-ferry-cost]").value, 0),
    hours: number(row.querySelector("[data-ferry-hours]").value, 0)
  })).filter((segment) => segment.from || segment.to || segment.cost || segment.hours);
}

function renderFerrySegments(segments) {
  ferryList.innerHTML = segments.map((segment, index) => `
    <div class="ferry-row" data-ferry-index="${index}">
      <label>
        Din
        <input data-ferry-from type="text" list="cityHints" value="${segment.from || ""}" placeholder="Durrës">
      </label>
      <label>
        Până la
        <input data-ferry-to type="text" list="cityHints" value="${segment.to || ""}" placeholder="Bari">
      </label>
      <label>
        Cost €
        <input data-ferry-cost type="number" min="0" step="5" value="${segment.cost || 0}">
      </label>
      <label>
        Ore
        <input data-ferry-hours type="number" min="0" step="0.5" value="${segment.hours || 0}">
      </label>
      <button class="mini-button" type="button" data-remove-ferry="${index}" aria-label="Șterge bac">×</button>
    </div>
  `).join("");
  syncFerryTotal();
}

function syncFerryTotal() {
  const total = readFerrySegments().reduce((sum, segment) => sum + segment.cost, 0);
  fields.ferry.value = Math.round(total);
}

function autoFerrySegmentsForLabels(labels) {
  const segments = [];
  for (let index = 0; index < labels.length - 1; index += 1) {
    const preset = ferryPresetFor(labels[index], labels[index + 1]);
    if (preset) {
      segments.push({
        from: labels[index],
        to: labels[index + 1],
        cost: preset.cost,
        hours: preset.hours
      });
    }
  }
  return segments;
}

function matchingFerrySegment(fromPlace, toPlace, ferrySegments) {
  return ferrySegments.find((segment) =>
    samePlaceLabel(fromPlace.name, segment.from) && samePlaceLabel(toPlace.name, segment.to)
  );
}

function routeZonesFromFields() {
  const km = Math.max(0, number(fields.distanceKm.value, 0));
  const fromCity = findLocalCity(fields.from.value) || { countryCode: "RO" };
  const toCity = findLocalCity(fields.to.value) || { countryCode: fromCity.countryCode };
  return inferRouteZones(fromCity, toCity, km || 1, fields.fuelType.value || defaults.fuelType);
}

function readRouteZones() {
  return [...routeZonesEl.querySelectorAll(".zone-row")].map((row) => ({
    code: row.dataset.code,
    name: row.dataset.name,
    km: number(row.dataset.km, 0),
    fuelPrice: number(row.querySelector("[data-zone-price]").value, 0),
    toll: number(row.querySelector("[data-zone-toll]").value, 0)
  }));
}

function renderRouteZones(zones) {
  const fuelType = fields.fuelType.value || defaults.fuelType;
  const profile = fuelProfiles[fuelType] || fuelProfiles.gasoline;
  routeZonesEl.innerHTML = zones.map((zone) => `
    <div class="zone-row" data-code="${zone.code}" data-name="${zone.name}" data-km="${zone.km}">
      <div class="zone-country">
        <strong>${zone.name}</strong>
        <span>${zone.km} km dus</span>
        <span class="zone-toll-note">${zone.tollNote || estimateRoadToll(zone).note}</span>
      </div>
      <label>
        ${profile.priceUnit}
        <input data-zone-price type="number" min="0" step="0.01" value="${zone.fuelPrice}">
      </label>
      <label>
        Taxă €
        <input data-zone-toll type="number" min="0" step="1" value="${zone.toll}">
      </label>
    </div>
  `).join("");
  updateRouteTotalsFromZones();
}

function updateRouteTotalsFromZones() {
  const zones = readRouteZones();
  if (!zones.length) {
    fields.fuelPrice.value = countryFuelDefaults.DEFAULT.prices[fields.fuelType.value].toFixed(2);
    fields.tolls.value = 0;
    return;
  }
  const totalKm = zones.reduce((sum, zone) => sum + zone.km, 0);
  const averagePrice = zones.reduce((sum, zone) => sum + zone.fuelPrice * zone.km, 0) / totalKm;
  const tolls = zones.reduce((sum, zone) => sum + zone.toll, 0);
  fields.fuelPrice.value = averagePrice.toFixed(2);
  fields.tolls.value = Math.round(tolls);
}

async function refreshFuelPricesOnline() {
  const fuelType = fields.fuelType.value || defaults.fuelType;
  if (fuelType === "electric") {
    fuelOnlineStatus.textContent = "Pentru electric păstrăm preț manual: depinde mult de stație, abonament și tipul încărcării.";
    showToast("Preț electric manual.");
    return;
  }

  let zones = readRouteZones();
  if (!zones.length && number(fields.distanceKm.value, 0) > 0) {
    renderRouteZones(routeZonesFromFields());
    zones = readRouteZones();
  }
  if (!zones.length) {
    fuelOnlineStatus.textContent = "Calculează ruta întâi, apoi pot actualiza prețurile pe țările din traseu.";
    showToast("Calculează ruta întâi.");
    return;
  }

  const countryCodes = [...new Set(zones.map((zone) => zone.code).filter(Boolean))];
  if (!countryCodes.length) {
    fuelOnlineStatus.textContent = "Nu am țări detectate pe traseu pentru actualizare.";
    return;
  }

  refreshFuelBtn.disabled = true;
  fuelOnlineStatus.textContent = "Se descarcă prețurile online...";
  try {
    const url = new URL("/api/fuel-prices", window.location.origin);
    url.searchParams.set("countries", countryCodes.join(","));
    url.searchParams.set("fuelType", fuelType);
    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const data = await readJsonEndpoint(response, "/api/fuel-prices");
    if (!response.ok) {
      throw new Error(data.error || "Endpointul de combustibil a întors eroare.");
    }

    const prices = data.prices || {};
    let updated = 0;
    routeZonesEl.querySelectorAll(".zone-row").forEach((row) => {
      const code = row.dataset.code;
      const price = prices[code]?.[fuelType];
      if (!Number.isFinite(price) || price <= 0) return;
      row.querySelector("[data-zone-price]").value = price.toFixed(2);
      updated += 1;
    });

    updateRouteTotalsFromZones();
    render();
    const missing = countryCodes.length - updated;
    const dateLabel = data.updatedAt ? ` · ${data.updatedAt}` : "";
    fuelOnlineStatus.textContent = updated
      ? `Actualizat ${updated}/${countryCodes.length} țări din ${data.source || "sursa online"}${dateLabel}.${missing ? " Restul rămân editabile manual." : ""}`
      : "Nu am găsit preț online pentru țările/fuelul selectat. Valorile rămân editabile manual.";
    showToast(updated ? "Prețuri combustibil actualizate." : "Fără prețuri online pentru traseu.");
  } catch (error) {
    fuelOnlineStatus.textContent = `Nu am putut actualiza prețurile online. ${error.message}`;
    showToast("Endpoint combustibil indisponibil.");
  } finally {
    refreshFuelBtn.disabled = false;
  }
}

function refreshRoadTolls() {
  let zones = readRouteZones();
  if (!zones.length && number(fields.distanceKm.value, 0) > 0) {
    renderRouteZones(routeZonesFromFields());
    zones = readRouteZones();
  }
  if (!zones.length) {
    tollOnlineStatus.textContent = "Calculează ruta întâi, apoi pot estima taxele pe țările din traseu.";
    showToast("Calculează ruta întâi.");
    return;
  }

  let updated = 0;
  routeZonesEl.querySelectorAll(".zone-row").forEach((row) => {
    const zone = {
      code: row.dataset.code,
      name: row.dataset.name,
      km: number(row.dataset.km, 0)
    };
    const estimate = estimateRoadToll(zone);
    row.querySelector("[data-zone-toll]").value = estimate.toll.toFixed(estimate.toll % 1 ? 2 : 0);
    const note = row.querySelector(".zone-toll-note");
    if (note) note.textContent = estimate.note;
    updated += 1;
  });

  updateRouteTotalsFromZones();
  render();
  tollOnlineStatus.textContent = `Taxe estimate pentru ${updated} țări. Vignetele/rovinietele sunt puse ca valori pe sens pentru buget rapid; verifică validitatea exactă pentru dus-întors.`;
  showToast("Taxe drum actualizate.");
}

async function readJsonEndpoint(response, pathLabel) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  const text = await response.text();
  if (/<!doctype html|<html/i.test(text.slice(0, 300))) {
    throw new Error(`Amplify întoarce pagina aplicației pentru ${pathLabel}. Adaugă regula de rewrite către API Gateway.`);
  }
  throw new Error(`Endpointul ${pathLabel} nu a răspuns JSON (${response.status}).`);
}

function syncZonePricesFromAverage() {
  const price = number(fields.fuelPrice.value, 0);
  routeZonesEl.querySelectorAll("[data-zone-price]").forEach((input) => {
    input.value = price.toFixed(2);
  });
}

function syncZoneTollsFromTotal() {
  const rows = [...routeZonesEl.querySelectorAll(".zone-row")];
  if (!rows.length) return;
  const total = number(fields.tolls.value, 0);
  const current = rows.reduce((sum, row) => sum + number(row.querySelector("[data-zone-toll]").value, 0), 0);
  rows.forEach((row) => {
    const input = row.querySelector("[data-zone-toll]");
    const value = current > 0 ? number(input.value, 0) * total / current : total / rows.length;
    input.value = Math.round(value);
  });
}

function updateFuelLabels(keepConsumption = false) {
  const fuelType = fields.fuelType.value || defaults.fuelType;
  const profile = fuelProfiles[fuelType] || fuelProfiles.gasoline;
  fuelConsumptionLabel.textContent = fuelConsumptionText(fuelType);
  fuelPriceLabel.textContent = `${t("averagePrice")} ${profile.priceUnit}`;
  fields.fuelPrice.max = fuelType === "electric" ? "2" : "4";
  fields.fuelConsumption.max = fuelType === "electric" ? "40" : "25";
  if (!keepConsumption) fields.fuelConsumption.value = profile.defaultConsumption;
}

function setRouteStatus(text) {
  routeMeta.source = text;
  routeStatus.textContent = text;
}

function syncAiUi() {
  const isProxy = aiProvider.value === "proxy";
  aiEndpoint.disabled = !isProxy;
  aiKey.disabled = isProxy;

  const output = aiOutput.textContent.trim();
  const isOldHint = !output || /Completează API key-ul|cheia AI fără să o introduci|Endpoint server activ/.test(output);
  if (isProxy && isOldHint) {
    aiOutput.textContent = "Endpoint server activ. Poți cere sugestii fără API key în pagină după ce rewrite-ul din Amplify trimite /api/ai-suggestions către Lambda.";
  }
  if (!isProxy && isOldHint) {
    aiOutput.textContent = "Mod direct activ. Completează o cheie Gemini doar dacă testezi fără Lambda.";
  }
}

function getSavedAiData() {
  const key = "familyTripPlanner:ai_data:" + getChecklistKey();
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch (e) {
    return null;
  }
}

function parseAndSaveStructuredAiData(text) {
  if (!text) return text;

  const startTag = "<structured_data>";
  const endTag = "</structured_data>";
  const startIndex = text.indexOf(startTag);
  const endIndex = text.indexOf(endTag);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const jsonStr = text.substring(startIndex + startTag.length, endIndex).trim();
    const cleanText = (text.substring(0, startIndex) + text.substring(endIndex + endTag.length)).trim();

    try {
      let cleanedJsonStr = jsonStr;
      if (cleanedJsonStr.startsWith("```")) {
        cleanedJsonStr = cleanedJsonStr.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
      }

      const parsed = JSON.parse(cleanedJsonStr);
      if (parsed) {
        const key = "familyTripPlanner:ai_data:" + getChecklistKey();
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn("Failed to parse structured AI data JSON:", e, jsonStr);
    }

    return cleanText;
  }

  return text;
}

function showAiResult(text) {
  const cleanText = parseAndSaveStructuredAiData(text);
  const formattedText = cleanText.trim();
  aiOutput.textContent = formattedText;
  aiOutput.classList.add("has-result");
  aiResultModalText.textContent = formattedText;
  openAiResultBtn.hidden = !formattedText;
  aiResultModal.hidden = false;
}

function closeAiResult() {
  aiResultModal.hidden = true;
}

function openAiResult() {
  const text = aiOutput.textContent.trim();
  if (!text || text === t("aiOutputDefault")) {
    showToast(language === "en" ? "No AI result yet." : "Nu există încă rezultat AI.");
    return;
  }
  aiResultModalText.textContent = text;
  aiResultModal.hidden = false;
}

function loadDefaults() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const params = new URLSearchParams(window.location.search);
  const queryState = {};
  const hasRouteQuery = params.has("from") || params.has("to") || params.has("via") || params.has("ferry");
  if (params.get("from")) queryState.from = params.get("from");
  if (params.get("to")) queryState.to = params.get("to");
  if (params.get("via")) queryState.waypoints = params.get("via").split("|").map((item) => item.trim()).filter(Boolean);
  if (hasRouteQuery && !params.has("via")) queryState.waypoints = [];
  if (params.get("ferry")) {
    queryState.ferrySegments = params.get("ferry").split("|").map((item) => {
      const [from = "", to = "", cost = "0", hours = "0"] = item.split(":");
      return { from, to, cost: number(cost, 0), hours: number(hours, 0) };
    });
  }
  if (hasRouteQuery && !params.has("ferry")) queryState.ferrySegments = [];
  if (hasRouteQuery) {
    Object.assign(queryState, {
      distanceKm: 0,
      driveHours: 0,
      routeSource: defaults.routeSource,
      ferryLabel: "",
      fromPlace: null,
      toPlace: null,
      routeGeometry: null,
      waypointPlaces: [],
      routeSegments: [],
      routeVariants: [],
      routeZones: []
    });
  }
  const state = { ...defaults, ...saved, ...queryState };
  language = state.language === "en" ? "en" : "ro";
  theme = state.theme === "dark" ? "dark" : "light";
  if (state.aiProvider === "gemini" && !state.aiKey) state.aiProvider = "proxy";
  fields.from.value = state.from;
  fields.to.value = state.to;
  fields.startDate.value = state.startDate;
  fields.endDate.value = state.endDate;
  fields.distanceKm.value = state.distanceKm;
  fields.driveHours.value = state.driveHours;
  fields.adults.value = state.adults;
  fields.children.value = state.children;
  fields.childAges.value = state.childAges;
  fields.rooms.value = state.rooms;
  fields.maxDailyHours.value = state.maxDailyHours;
  fields.localKm.value = state.localKm;
  fields.fuelType.value = state.fuelType;
  fields.fuelConsumption.value = state.fuelConsumption;
  fields.fuelPrice.value = state.fuelPrice;
  fields.nightlyBudget.value = state.nightlyBudget;
  fields.foodDaily.value = state.foodDaily;
  fields.tolls.value = state.tolls;
  fields.ferry.value = state.ferry;
  fields.roundTrip.checked = state.roundTrip;
  renderWaypoints(state.waypoints || []);
  renderFerrySegments(state.ferrySegments || []);
  aiProvider.value = state.aiProvider || defaults.aiProvider;
  aiModel.value = state.aiModel || defaults.aiModel;
  aiKey.value = "";
  aiPrompt.value = state.aiPrompt || defaults.aiPrompt;
  aiEndpoint.value = state.aiEndpoint || defaults.aiEndpoint;
  aiOutput.textContent = state.aiOutput || "";
  aiOutput.classList.toggle("has-result", Boolean(state.aiOutput));
  openAiResultBtn.hidden = !state.aiOutput;
  aiResultModalText.textContent = state.aiOutput || "";
  syncAiUi();
  routeMeta = {
    source: state.routeSource || defaults.routeSource,
    fromPlace: state.fromPlace || null,
    toPlace: state.toPlace || null,
    ferryLabel: state.ferryLabel || "",
    routeGeometry: state.routeGeometry || null,
    waypointPlaces: state.waypointPlaces || [],
    routeSegments: state.routeSegments || [],
    routeVariants: state.routeVariants || []
  };
  updateFuelLabels(true);
  renderRouteZones(state.routeZones?.length ? state.routeZones : []);
  renderRouteVariants(routeMeta.routeVariants);
  applyLanguage(language, { render: false });
  applyTheme(theme);
  const initialSource = [defaults.routeSource, uiText.ro.notCalculated, uiText.en.notCalculated].includes(routeMeta.source)
    ? t("notCalculated")
    : routeMeta.source;
  setRouteStatus(initialSource);
}

function readState() {
  return {
    from: fields.from.value.trim(),
    to: fields.to.value.trim(),
    startDate: fields.startDate.value,
    endDate: fields.endDate.value,
    distanceKm: number(fields.distanceKm.value, 0),
    driveHours: number(fields.driveHours.value, 0),
    routeSource: routeMeta.source,
    adults: number(fields.adults.value, 2),
    children: number(fields.children.value, 0),
    childAges: fields.childAges.value.trim(),
    rooms: number(fields.rooms.value, 1),
    maxDailyHours: number(fields.maxDailyHours.value, 7),
    localKm: number(fields.localKm.value, 0),
    fuelType: fields.fuelType.value,
    fuelConsumption: number(fields.fuelConsumption.value, fuelProfiles[fields.fuelType.value].defaultConsumption),
    fuelPrice: number(fields.fuelPrice.value, 1.55),
    nightlyBudget: number(fields.nightlyBudget.value, 100),
    foodDaily: number(fields.foodDaily.value, 25),
    tolls: number(fields.tolls.value, 0),
    ferry: number(fields.ferry.value, 0),
    ferryLabel: routeMeta.ferryLabel,
    waypoints: readWaypoints(),
    ferrySegments: readFerrySegments(),
    fromPlace: routeMeta.fromPlace,
    toPlace: routeMeta.toPlace,
    routeGeometry: routeMeta.routeGeometry,
    waypointPlaces: routeMeta.waypointPlaces,
    routeSegments: routeMeta.routeSegments,
    routeVariants: routeMeta.routeVariants,
    routeZones: readRouteZones(),
    language,
    theme,
    aiProvider: aiProvider.value,
    aiEndpoint: aiEndpoint.value.trim() || defaults.aiEndpoint,
    aiModel: aiModel.value.trim() || defaults.aiModel,
    aiKey: "",
    aiPrompt: aiPrompt.value.trim() || defaults.aiPrompt,
    aiOutput: aiOutput.classList.contains("has-result") ? aiOutput.textContent.trim() : "",
    roundTrip: fields.roundTrip.checked
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function reverseFerrySegments(segments = []) {
  return [...segments].reverse().map((segment) => ({
    from: segment.to,
    to: segment.from,
    cost: segment.cost,
    hours: segment.hours
  }));
}

function routeVariantDefinitions(fromCode, toCode) {
  return routeVariantTemplates.flatMap((template) => {
    if (template.from === fromCode && template.to === toCode) {
      return [{ ...template, reverse: false }];
    }
    if (template.from === toCode && template.to === fromCode) {
      return [{
        ...template,
        id: `${template.id}-reverse`,
        reverse: true,
        waypoints: [...template.waypoints].reverse(),
        ferrySegments: reverseFerrySegments(template.ferrySegments || [])
      }];
    }
    return [];
  });
}

function routeVariantSignature(labels, ferrySegments = []) {
  const routeKey = labels.map((label) => normalize(label)).join(">");
  const ferryKey = ferrySegments.map((segment) =>
    `${normalize(segment.from)}>${normalize(segment.to)}>${segment.cost || 0}>${segment.hours || 0}`
  ).join("|");
  return `${routeKey}::${ferryKey}`;
}

function countryNamesFromZones(zones) {
  return zones.map((zone) => zone.name).filter(Boolean);
}

function placeForVariantLabel(label, fallbackPlace = null) {
  const local = findLocalCity(label);
  if (local) return local;
  if (fallbackPlace) return fallbackPlace;
  return {
    name: label,
    lat: NaN,
    lon: NaN,
    countryCode: countryCodeFromText(label) || "DEFAULT"
  };
}

function estimateRouteVariant(labels, ferrySegments, fromPlace, toPlace) {
  const places = labels.map((label, index) => {
    if (index === 0) return placeForVariantLabel(label, fromPlace);
    if (index === labels.length - 1) return placeForVariantLabel(label, toPlace);
    return placeForVariantLabel(label);
  });
  const countryCodes = [];
  let roadKm = 0;
  let roadHours = 0;
  let ferryHours = 0;

  for (let index = 0; index < places.length - 1; index += 1) {
    const from = places[index];
    const to = places[index + 1];
    const ferryLeg = matchingFerrySegment(from, to, ferrySegments);
    if (ferryLeg) {
      ferryHours += ferryLeg.hours;
      continue;
    }

    if (Number.isFinite(from.lat) && Number.isFinite(from.lon) && Number.isFinite(to.lat) && Number.isFinite(to.lon)) {
      const estimate = estimateFallbackRoute(from, to);
      roadKm += estimate.km;
      roadHours += estimate.hours;
    }

    corridorCodes(getCountryCode(from), getCountryCode(to)).forEach((code) => {
      if (code && code !== "DEFAULT" && countryCodes.at(-1) !== code) countryCodes.push(code);
    });
  }
  const waypointCorrection = labels.length > 2 ? 1.2 : 1;

  return {
    km: Math.round(roadKm * waypointCorrection),
    hours: Math.round((roadHours * waypointCorrection + ferryHours) * 10) / 10,
    countries: countryCodes.map((code) => countryFor(code).name)
  };
}

function variantSummaryFromScenario({ id, title, note, scenario, zones, active = false }) {
  const countries = countryNamesFromZones(zones);
  return {
    id,
    title,
    note,
    labels: [...scenario.inputLabels],
    ferrySegments: scenario.ferrySegments.map((segment) => ({ ...segment })),
    km: Math.round(scenario.roadKm),
    hours: Math.round(scenario.totalHours * 10) / 10,
    countries,
    active
  };
}

function renderRouteVariants(variants = []) {
  routeMeta.routeVariants = variants;
  routeVariantsEl.hidden = !variants.length;
  routeVariantsEl.innerHTML = variants.map((variant) => {
    const icon = variant.ferrySegments?.length ? "icon-ship" : "icon-route";
    const countries = variant.countries?.length ? variant.countries.join(" · ") : "țări detectate la aplicare";
    const kmLabel = variant.km ? `${variant.estimated ? "~" : ""}${variant.km} km` : "km la alegere";
    const hoursLabel = variant.hours ? `${variant.estimated ? "~" : ""}${variant.hours} h` : "timp la alegere";
    const meta = `${kmLabel} · ${hoursLabel} · ${countries}`;
    return `
      <button class="route-variant-card ${variant.active ? "active" : ""}" type="button" data-route-variant="${variant.id}">
        <svg aria-hidden="true"><use href="#${icon}"></use></svg>
        <span class="route-variant-text">
          <strong>${variant.title}</strong>
          <span>${meta}</span>
          <span>${variant.note || ""}</span>
        </span>
      </button>
    `;
  }).join("");
}

function clearRouteVariants() {
  routeVariantCache = new Map();
  routeMeta.routeVariants = [];
  renderRouteVariants([]);
}

function updateRouteVariantSummaries(variants, activeVariantId, scenario, routeZones) {
  return variants.map((variant) => {
    if (variant.id !== activeVariantId) return { ...variant, active: false };
    return {
      ...variant,
      ...variantSummaryFromScenario({
        id: variant.id,
        title: variant.title,
        note: variant.note,
        scenario,
        zones: routeZones,
        active: true
      })
    };
  });
}

async function calculateRouteScenario(pointLabels, ferrySegmentsInput = [], options = {}) {
  const shouldAutoFerry = options.autoFerry !== false;
  let ferrySegments = ferrySegmentsInput.map((segment) => ({ ...segment }));
  if (!ferrySegments.length && shouldAutoFerry) {
    ferrySegments = autoFerrySegmentsForLabels(pointLabels);
  }

  const places = await Promise.all(pointLabels.map((label) => geocodePlace(label)));
  const routeSegments = [];
  const roadLegs = [];
  let roadKm = 0;
  let totalHours = 0;
  let usedFallback = false;

  for (let index = 0; index < places.length - 1; index += 1) {
    const fromPlace = places[index];
    const toPlace = places[index + 1];
    const ferryLeg = matchingFerrySegment(fromPlace, toPlace, ferrySegments);
    if (ferryLeg) {
      totalHours += ferryLeg.hours;
      routeSegments.push({
        type: "ferry",
        label: `${shortPlace(fromPlace.name)} - ${shortPlace(toPlace.name)}`,
        fromPlace,
        toPlace,
        hours: ferryLeg.hours,
        cost: ferryLeg.cost,
        geometry: {
          type: "LineString",
          coordinates: [
            [fromPlace.lon, fromPlace.lat],
            [toPlace.lon, toPlace.lat]
          ]
        }
      });
      continue;
    }

    let legRoute;
    try {
      legRoute = await fetchRoadRoute(fromPlace, toPlace);
    } catch (error) {
      console.info("Route fallback:", error.message);
      legRoute = estimateFallbackRoute(fromPlace, toPlace);
      usedFallback = true;
    }

    roadKm += legRoute.km;
    totalHours += legRoute.hours;
    roadLegs.push({ from: fromPlace, to: toPlace, km: legRoute.km, geometry: legRoute.geometry });
    routeSegments.push({
      type: legRoute.source === "Estimare offline" ? "estimated-road" : "road",
      label: `${shortPlace(fromPlace.name)} - ${shortPlace(toPlace.name)}`,
      fromPlace,
      toPlace,
      km: legRoute.km,
      hours: legRoute.hours,
      geometry: legRoute.geometry
    });
  }

  return {
    inputLabels: [...pointLabels],
    places,
    ferrySegments,
    routeSegments,
    roadLegs,
    roadKm,
    totalHours,
    usedFallback
  };
}

async function routeZonesForScenario(scenario, fuelType) {
  const liveRouteZones = await inferRouteZonesFromRouteSegments(scenario.routeSegments, fuelType);
  const estimatedRouteZones = inferRouteZonesFromLegs(scenario.roadLegs, fuelType);
  const useEstimatedZones = shouldUseEstimatedRouteZones(liveRouteZones, estimatedRouteZones, scenario.roadLegs);
  return {
    zones: useEstimatedZones ? estimatedRouteZones : liveRouteZones,
    sourceLabel: useEstimatedZones ? t("countriesEstimated") : t("countriesFromRoute")
  };
}

async function applyCalculatedScenario(scenario, options = {}) {
  const fromPlace = scenario.places[0];
  const toPlace = scenario.places.at(-1);
  const ferryLabel = scenario.ferrySegments.map((segment) =>
    `${shortPlace(segment.from)} - ${shortPlace(segment.to)}`
  ).join(", ");
  const sourceBase = `${scenario.usedFallback ? t("partialRouting") : t("liveRouting")}${scenario.ferrySegments.length ? ` + ${t("ferryShort")}` : ""}`;
  const { zones: routeZones, sourceLabel } = await routeZonesForScenario(scenario, fields.fuelType.value);
  const routeSource = `${sourceBase} · ${sourceLabel}`;
  const routeVariants = updateRouteVariantSummaries(
    options.routeVariants || routeMeta.routeVariants || [],
    options.activeVariantId || "current",
    scenario,
    routeZones
  );

  routeMeta = {
    source: routeSource,
    fromPlace,
    toPlace,
    ferryLabel,
    routeGeometry: scenario.routeSegments.find((segment) => segment.type === "road")?.geometry || null,
    waypointPlaces: scenario.places.slice(1, -1),
    routeSegments: scenario.routeSegments,
    routeVariants
  };

  fields.from.value = fromPlace.name;
  fields.to.value = toPlace.name;
  renderWaypoints(scenario.places.slice(1, -1).map((place) => place.name));
  renderFerrySegments(scenario.ferrySegments);
  fields.distanceKm.value = Math.round(scenario.roadKm);
  fields.driveHours.value = Math.round(scenario.totalHours * 10) / 10;
  renderRouteZones(routeZones);
  renderRouteVariants(routeVariants);
  setRouteStatus(routeSource);
  render();
  if (options.toast !== false) showToast(`${sourceBase}: ${Math.round(scenario.roadKm)} km auto.`);
  return { routeZones, routeSource };
}

function buildRouteVariants(baseScenario, baseRouteZones) {
  const fromPlace = baseScenario.places[0];
  const toPlace = baseScenario.places.at(-1);
  const fromCode = getCountryCode(fromPlace);
  const toCode = getCountryCode(toPlace);
  const existingSignature = routeVariantSignature(baseScenario.inputLabels, baseScenario.ferrySegments);
  routeVariantCache = new Map([["current", baseScenario]]);

  const baseTitle = baseScenario.ferrySegments.length
    ? "Ruta curentă cu bac"
    : (baseScenario.inputLabels.length > 2 ? "Ruta curentă" : "Ruta rapidă");
  const variants = [
    variantSummaryFromScenario({
      id: "current",
      title: baseTitle,
      note: "Calculată din ruta introdusă acum.",
      scenario: baseScenario,
      zones: baseRouteZones,
      active: true
    })
  ];

  for (const template of routeVariantDefinitions(fromCode, toCode)) {
    const labels = [
      baseScenario.inputLabels[0],
      ...template.waypoints,
      baseScenario.inputLabels.at(-1)
    ];
    const ferrySegments = (template.ferrySegments || []).map((segment) => ({ ...segment }));
    if (routeVariantSignature(labels, ferrySegments) === existingSignature) continue;

    const estimate = estimateRouteVariant(labels, ferrySegments, fromPlace, toPlace);
    variants.push({
      id: template.id,
      title: template.title,
      note: template.note,
      labels,
      ferrySegments,
      km: estimate.km,
      hours: estimate.hours,
      countries: estimate.countries,
      active: false,
      estimated: true
    });
  }

  return variants;
}

async function applyRouteVariant(variantId) {
  const variant = routeMeta.routeVariants.find((item) => item.id === variantId);
  if (!variant || variant.active) return;

  routeVariantsEl.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  setRouteStatus(`Se aplică varianta: ${variant.title}...`);

  try {
    let scenario = routeVariantCache.get(variantId);
    if (!scenario) {
      scenario = await calculateRouteScenario(variant.labels, variant.ferrySegments || [], { autoFerry: false });
      routeVariantCache.set(variantId, scenario);
    }
    await applyCalculatedScenario(scenario, {
      activeVariantId: variantId,
      routeVariants: routeMeta.routeVariants,
      toast: true
    });
  } catch (error) {
    showToast(error.message || "Nu am putut aplica varianta.");
    setRouteStatus(routeMeta.source || defaults.routeSource);
    renderRouteVariants(routeMeta.routeVariants);
  }
}

async function applyAutoRouteEstimate() {
  const fromQuery = fields.from.value.trim();
  const toQuery = fields.to.value.trim();
  if (!fromQuery || !toQuery) {
    showToast("Completează plecarea și destinația.");
    return;
  }

  setRouteStatus("Se calculează ruta...");
  try {
    const waypointLabels = readWaypoints();
    const pointLabels = [fromQuery, ...waypointLabels, toQuery];
    let ferrySegments = readFerrySegments();
    const scenario = await calculateRouteScenario(pointLabels, ferrySegments);
    const { routeZones } = await applyCalculatedScenario(scenario, {
      activeVariantId: "current",
      routeVariants: [],
      toast: false
    });

    const baseSource = routeMeta.source;
    routeStatus.textContent = `${baseSource} · variante...`;
    const variants = buildRouteVariants(scenario, routeZones);
    routeMeta.routeVariants = variants;
    renderRouteVariants(variants);
    setRouteStatus(baseSource);
    render();
    showToast(`${baseSource}: ${Math.round(scenario.roadKm)} km auto.`);
  } catch (error) {
    setRouteStatus("Rută necalculată");
    showToast(error.message || "Nu am putut calcula ruta.");
  }
}

function calculatePlan() {
  const state = readState();
  const people = Math.max(1, state.adults + state.children);
  const nights = daysBetween(state.startDate, state.endDate);
  const multiplier = state.roundTrip ? 2 : 1;
  const routeZones = state.routeZones.length
    ? state.routeZones
    : (state.distanceKm > 0 ? routeZonesFromFields() : []);
  const totalRouteKm = state.distanceKm * multiplier + state.localKm;
  const routeKmInZones = routeZones.reduce((sum, zone) => sum + zone.km, 0) || state.distanceKm || 1;
  const zoneScale = state.distanceKm > 0 ? state.distanceKm / routeKmInZones : 0;
  const destinationPlace = routeMeta.toPlace || state.toPlace;
  const destinationCode = countryCodeFromText(state.to) || (destinationPlace ? getCountryCode(destinationPlace) : null);
  const destinationCountry = destinationCode && destinationCode !== "DEFAULT"
    ? countryFor(destinationCode)
    : (countryCodeFromText(state.to) ? countryFor(countryCodeFromText(state.to)) : null);
  const destinationZone = destinationCountry
    ? {
      name: destinationCountry.name,
      fuelPrice: destinationCountry.prices[state.fuelType] ?? state.fuelPrice
    }
    : (routeZones.at(-1) || { fuelPrice: state.fuelPrice, name: "destinație" });
  const fuelBreakdown = routeZones.map((zone) => {
    const adjustedKm = zone.km * zoneScale * multiplier;
    const fuelUnits = (adjustedKm * state.fuelConsumption) / 100;
    return {
      ...zone,
      adjustedKm,
      fuelUnits,
      fuelCost: fuelUnits * zone.fuelPrice
    };
  });
  const localFuelUnits = (state.localKm * state.fuelConsumption) / 100;
  const localFuelCost = localFuelUnits * destinationZone.fuelPrice;
  const fuelUnits = fuelBreakdown.reduce((sum, zone) => sum + zone.fuelUnits, 0) + localFuelUnits;
  const fuelCost = fuelBreakdown.reduce((sum, zone) => sum + zone.fuelCost, 0) + localFuelCost;
  const tollsOneWay = routeZones.reduce((sum, zone) => sum + zone.toll, 0);
  const roadCosts = (tollsOneWay + state.ferry) * multiplier;
  const travelDaysOneWay = state.driveHours > 0 && mode === "comfort"
    ? Math.max(1, Math.ceil(state.driveHours / Math.max(3, state.maxDailyHours)))
    : 1;
  const enRouteNights = state.roundTrip
    ? Math.max(0, travelDaysOneWay - 1) * 2
    : Math.max(0, travelDaysOneWay - 1);
  const destinationNights = Math.max(1, nights - enRouteNights);
  const lodgingCost = state.nightlyBudget * state.rooms * nights;
  const foodCost = state.foodDaily * people * (nights + 1);
  const parkingCost = state.distanceKm > 0 ? Math.max(18, nights * 6) : 0;
  const carTotal = fuelCost + roadCosts + lodgingCost + foodCost + parkingCost;
  const stopoverExtra = enRouteNights * state.rooms * Math.max(60, state.nightlyBudget * 0.75);
  const carComfortTotal = carTotal + stopoverExtra;
  const directKm = routeMeta.fromPlace && routeMeta.toPlace
    ? haversineKm(routeMeta.fromPlace, routeMeta.toPlace)
    : state.distanceKm * 0.74;
  const flightBase = estimateFlightCost(directKm, people, state.children);
  const rentalDays = Math.max(3, nights + 1);
  const flightTotal = flightBase + Math.max(70, people * 38) + rentalDays * 44 + lodgingCost + foodCost;

  const transport = state.distanceKm > 0
    ? buildTransportOptions({ state, people, totalRouteKm, carTotal, carComfortTotal, flightTotal, travelDaysOneWay, rentalDays })
    : [];
  transport.sort((a, b) => b.score - a.score);

  return {
    state,
    people,
    nights,
    multiplier,
    totalRouteKm,
    routeZones,
    destinationZone,
    fuelBreakdown,
    localFuelUnits,
    localFuelCost,
    fuelUnits,
    fuelCost,
    tollsOneWay,
    roadCosts,
    lodgingCost,
    foodCost,
    parkingCost,
    carTotal,
    flightTotal,
    travelDaysOneWay,
    enRouteNights,
    destinationNights,
    transport,
    recommended: transport[0] || null
  };
}

function estimateFlightCost(directKm, people, children) {
  const base = directKm > 1600 ? 240 : directKm > 900 ? 190 : directKm > 450 ? 140 : 110;
  return base * (people - children) + base * 0.78 * children;
}

function buildTransportOptions({ state, people, totalRouteKm, carTotal, carComfortTotal, flightTotal, travelDaysOneWay, rentalDays }) {
  const options = [
    {
      id: "car",
      icon: "icon-car",
      title: language === "en" ? "Direct car route" : "Auto direct",
      subtitle: `${Math.round(totalRouteKm)} ${t("totalKm")}`,
      price: carTotal,
      time: language === "en"
        ? `${Math.round(state.driveHours * (state.roundTrip ? 2 : 1)) || "-"} driving hours`
        : `${Math.round(state.driveHours * (state.roundTrip ? 2 : 1)) || "-"} ore drum`,
      score: scoreCar(state, carTotal, people),
      note: carNote(state, travelDaysOneWay),
      tags: language === "en" ? ["flexible", "easy luggage", fuelTypeLabel(state.fuelType)] : ["flexibil", "bagaje ușor", fuelTypeLabel(state.fuelType)]
    },
    {
      id: "comfort",
      icon: "icon-route",
      title: language === "en" ? "Car with stopover" : "Auto cu oprire",
      subtitle: language === "en" ? `${travelDaysOneWay} day${travelDaysOneWay > 1 ? "s" : ""} one-way` : `${travelDaysOneWay} zile pe sens`,
      price: carComfortTotal,
      time: language === "en" ? "better pace" : "ritm mai bun",
      score: scoreComfort(state, people),
      note: "Adaugă noapte de tranzit când drumul trece de limita ta de ore pe zi.",
      tags: language === "en"
        ? ["comfort", "good breaks", state.children > 0 ? "children" : "relaxed"]
        : ["confort", "pauze bune", state.children > 0 ? "copii" : "relaxat"]
    },
    {
      id: "flight",
      icon: "icon-plane",
      title: language === "en" ? "Flight + transfer" : "Avion + transfer",
      subtitle: language === "en" ? `${rentalDays} days with local car` : `${rentalDays} zile cu mașină locală`,
      price: flightTotal,
      time: language === "en" ? "flight + airport" : "zbor + aeroport",
      score: scoreFlight(state, flightTotal, carTotal),
      note: flightNote(state, flightTotal, carTotal),
      tags: language === "en" ? ["fast", "limited luggage", "car rental"] : ["rapid", "bagaje limitate", "închiriere auto"]
    }
  ];

  if (state.ferry > 0) {
    options.push({
      id: "ferry",
      icon: "icon-ship",
      title: language === "en" ? "Car + ferry" : "Auto + bac",
      subtitle: state.ferryLabel || "bac introdus manual",
      price: carTotal,
      time: language === "en" ? "port buffer" : "marjă pentru port",
      score: scoreComfort(state, people) + 2,
      note: state.ferryLabel
        ? `Include traversarea ${state.ferryLabel}. Verifică orarul înainte de plecare.`
        : "Include cost de bac introdus manual. Completează ruta exactă când o știi.",
      tags: language === "en" ? ["ferry", "timing", "time buffer"] : ["ferry", "timing", "rezervă timp"]
    });
  }

  return options;
}

function scoreCar(state, total, people) {
  let score = 70;
  if (state.driveHours > 0 && state.driveHours <= state.maxDailyHours) score += 12;
  if (people >= 4) score += 8;
  if (state.distanceKm > 950) score -= 12;
  if (total / people < 450) score += 4;
  return clamp(score, 25, 94);
}

function scoreComfort(state, people) {
  let score = 72;
  if (state.children > 0) score += 10;
  if (state.driveHours > state.maxDailyHours) score += 10;
  if (people <= 2) score -= 3;
  return clamp(score, 30, 95);
}

function scoreFlight(state, flightTotal, carTotal) {
  let score = 58;
  if (state.distanceKm > 900) score += 16;
  if (state.children === 0) score += 6;
  if (flightTotal < carTotal * 1.2) score += 10;
  if (state.children >= 2) score -= 7;
  return clamp(score, 25, 94);
}

function carNote(state, travelDays) {
  if (state.driveHours > state.maxDailyHours && travelDays > 1) {
    if (language === "en") return `Split the drive into ${travelDays} days each way to avoid a long haul.`;
    return `Împarte drumul în ${travelDays} zile pe sens ca să eviți condusul lung.`;
  }
  if (language === "en" && state.children > 0) return "Leave early, plan frequent breaks and keep time for borders or traffic.";
  if (language === "en") return "The most flexible option when you want more luggage and stops on your own schedule.";
  if (state.children > 0) return "Plecare devreme, pauze dese și rezervă de timp pentru frontieră sau trafic.";
  return "Cea mai flexibilă variantă când vrei bagaje multe și opriri la alegere.";
}

function flightNote(state, flightTotal, carTotal) {
  if (language === "en" && flightTotal < carTotal * 1.15) return "Worth checking seriously, the cost difference is small.";
  if (language === "en" && state.distanceKm > 1000) return "Saves time, but luggage and transfers can complicate family travel.";
  if (language === "en") return "Fast, but probably more expensive than driving for this scenario.";
  if (flightTotal < carTotal * 1.15) return "Merită verificat serios, diferența de cost e mică.";
  if (state.distanceKm > 1000) return "Câștigă timp, dar bagajele și transferurile pot complica familia.";
  return "Rapid, dar probabil mai scump decât mașina pentru acest scenariu.";
}

function render() {
  const plan = calculatePlan();
  lastPlan = plan;
  saveState(plan.state);

  const title = plan.state.from && plan.state.to
    ? `${shortPlace(plan.state.from)} → ${shortPlace(plan.state.to)}`
    : "Alege ruta";
  document.querySelector("#routeTitle").textContent = title;
  document.querySelector("#mapTitle").textContent = title.replace(" → ", " - ");
  document.querySelector("#topbarMeta").innerHTML = [
    `${plan.nights} ${t("nights")}`,
    `${plan.people} ${t("people")}`,
    `${Math.round(plan.totalRouteKm)} ${t("totalKm")}`,
    plan.state.routeSource,
    fuelTypeLabel(plan.state.fuelType)
  ].map((item) => `<span class="pill">${item}</span>`).join("");

  const total = plan.recommended ? plan.recommended.price : plan.carTotal;
  document.querySelector("#totalEstimate").textContent = euro(total);
  document.querySelector("#perPersonEstimate").textContent = `${euro(total / plan.people)} / ${t("perPerson")}`;
  document.querySelector("#fuelEstimate").textContent = euro(plan.fuelCost);
  document.querySelector("#fuelLiters").textContent = `${Math.round(plan.fuelUnits)} ${fuelProfiles[plan.state.fuelType].unit}`;
  document.querySelector("#lodgingEstimate").textContent = euro(plan.lodgingCost);
  document.querySelector("#lodgingNights").textContent =
    language === "en"
      ? `${plan.nights} ${t("nights")}, ${plan.state.rooms} room${plan.state.rooms > 1 ? "s" : ""}`
      : `${plan.nights} nopți, ${plan.state.rooms} cameră${plan.state.rooms > 1 ? "e" : ""}`;
  document.querySelector("#bestMode").textContent = plan.recommended?.title || t("calculateRoute");
  document.querySelector("#bestReason").textContent = plan.recommended
    ? (plan.recommended.score >= 85 ? t("bestFit") : t("bestBalanced"))
    : t("noRoute");

  renderMap(plan);
  renderTransport(plan);
  renderCostBreakdown(plan);
  renderTimeline(plan);
  renderLodging(plan);
  renderStops(plan);

  // Update Checklist
  renderChecklist();

  // Weather Check for destination
  const toPlace = routeMeta.toPlace;
  if (toPlace && (toPlace.lat !== lastWeatherCoords.lat || toPlace.lon !== lastWeatherCoords.lon)) {
    lastWeatherCoords = { lat: toPlace.lat, lon: toPlace.lon };
    fetchDestinationWeather(toPlace);
  } else if (!toPlace) {
    destinationWeather.style.display = "none";
    lastWeatherCoords = { lat: null, lon: null };
  }
}

function shortPlace(place) {
  return place.split(",")[0].trim() || place;
}

function renderMap(plan) {
  const mapEl = document.querySelector("#routeMap");
  if (!window.L) {
    mapEl.innerHTML = `
      <div class="map-fallback">
        <div>
          <strong>Harta reală nu s-a încărcat</strong>
          <span>Verifică internetul. Calculele rămân disponibile.</span>
        </div>
      </div>
    `;
    return;
  }

  if (!mapEl.querySelector(".leaflet-map")) {
    mapEl.innerHTML = `<div id="leafletMap" class="leaflet-map" aria-label="Hartă reală traseu"></div>`;
    leafletMap = L.map("leafletMap", {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([45.9432, 24.9668], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(leafletMap);
  }

  leafletMap.invalidateSize();
  if (routeLayer) routeLayer.remove();
  if (markerLayer) markerLayer.remove();
  markerLayer = L.layerGroup().addTo(leafletMap);

  const fromPlace = routeMeta.fromPlace;
  const toPlace = routeMeta.toPlace;
  const routeSegments = routeMeta.routeSegments?.length
    ? routeMeta.routeSegments
    : (routeMeta.routeGeometry ? [{ type: "road", geometry: routeMeta.routeGeometry }] : []);
  if (!fromPlace || !toPlace) {
    leafletMap.setView([45.9432, 24.9668], 6);
    return;
  }

  const markerPlaces = [fromPlace, ...(routeMeta.waypointPlaces || []), toPlace];
  markerPlaces.forEach((place, index) => {
    const role = index === 0 ? "Plecare" : index === markerPlaces.length - 1 ? "Destinație" : "Oprire";
    markerLayer.addLayer(L.marker([place.lat, place.lon]).bindPopup(`${role}: ${shortPlace(place.name)}`));
  });

  const layers = [];
  const bounds = [];
  routeSegments.forEach((segment) => {
    if (!segment.geometry?.coordinates?.length) return;
    const latLngs = segment.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    bounds.push(...latLngs);
    const isFerry = segment.type === "ferry";
    layers.push(
      L.polyline(latLngs, {
        color: "#ffffff",
        weight: isFerry ? 8 : 9,
        opacity: 0.9,
        dashArray: isFerry ? "10 10" : null,
        lineJoin: "round"
      }),
      L.polyline(latLngs, {
        color: isFerry ? "#0f766e" : "#0b6bcb",
        weight: isFerry ? 5 : 6,
        opacity: 0.95,
        dashArray: isFerry ? "10 10" : null,
        lineJoin: "round"
      }).bindPopup(segment.label || (isFerry ? "Bac" : "Rută auto"))
    );
  });

  if (layers.length) {
    routeLayer = L.layerGroup(layers).addTo(leafletMap);
    const routeBounds = L.latLngBounds(bounds);
    leafletMap.fitBounds(routeBounds, { padding: [26, 26] });
    window.setTimeout(() => {
      leafletMap.invalidateSize();
      leafletMap.fitBounds(routeBounds, { padding: [26, 26] });
    }, 80);
  } else {
    const defaultBounds = L.latLngBounds([
      [fromPlace.lat, fromPlace.lon],
      [toPlace.lat, toPlace.lon]
    ]);
    leafletMap.fitBounds(defaultBounds, { padding: [32, 32] });
  }
}

function renderTransport(plan) {
  document.querySelector("#transportOptions").innerHTML = plan.transport.length
    ? plan.transport.map((option, index) => `
      <article class="transport-card ${index === 0 ? "recommended" : ""}">
        <div class="transport-head">
          <div class="item-row">
            <div class="transport-icon" aria-hidden="true">
              <svg><use href="#${option.icon}"></use></svg>
            </div>
            <div class="transport-title">
              <strong>${option.title}</strong>
              <span>${option.subtitle} · scor ${option.score}/100</span>
            </div>
          </div>
          <div class="transport-price">${euro(option.price)}</div>
        </div>
        <p>${option.note}</p>
        <div class="tags">
          <span class="tag">${option.time}</span>
          ${option.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </article>
    `).join("")
    : `<article class="transport-card"><p>Introdu plecarea și destinația, apoi calculează ruta.</p></article>`;
}

function renderCostBreakdown(plan) {
  const profile = fuelProfiles[plan.state.fuelType];
  const zoneCards = plan.fuelBreakdown.map((zone) => `
    <article class="breakdown-card">
      <strong>${zone.name}</strong>
      <span>${Math.round(zone.adjustedKm)} km · ${Math.round(zone.fuelUnits)} ${profile.unit}</span>
      <span>${zone.fuelPrice.toFixed(2)} ${profile.priceUnit} · taxă ${euro(zone.toll * plan.multiplier)}</span>
      <strong>${euro(zone.fuelCost + zone.toll * plan.multiplier)}</strong>
    </article>
  `).join("");

  document.querySelector("#costBreakdown").innerHTML = `
    ${zoneCards || `<article class="breakdown-card"><strong>Fără traseu</strong><span>Costurile apar după calculul km.</span><strong>${euro(0)}</strong></article>`}
    <article class="breakdown-card">
      <strong>Km locali</strong>
      <span>${plan.state.localKm} km · ${Math.round(plan.localFuelUnits)} ${profile.unit}</span>
      <span>Calculat la prețul din ${plan.destinationZone?.name || "destinație"}</span>
      <strong>${euro(plan.localFuelCost)}</strong>
    </article>
    <article class="breakdown-card">
      <strong>Bac și taxe</strong>
      <span>Bac ${euro(plan.state.ferry * plan.multiplier)}</span>
      <span>Taxe drum ${euro(plan.tollsOneWay * plan.multiplier)}</span>
      <strong>${euro(plan.roadCosts)}</strong>
    </article>
  `;
}

function renderTimeline(plan) {
  const items = [];
  if (plan.state.distanceKm > 0) {
    if (plan.travelDaysOneWay === 1) {
      items.push({
        date: addDays(plan.state.startDate, 0),
        title: `Drum spre ${shortPlace(plan.state.to)}`,
        text: `${Math.round(plan.state.distanceKm)} km. Păstrează pauze la 2-3 ore și rezervă pentru trafic.`
      });
    } else {
      items.push({
        date: addDays(plan.state.startDate, 0),
        title: "Prima zi de drum",
        text: `Țintește aproximativ ${Math.round(plan.state.distanceKm / plan.travelDaysOneWay)} km și caută cazare de tranzit cu parcare.`
      });
      items.push({
        date: addDays(plan.state.startDate, 1),
        title: `Sosire în ${shortPlace(plan.state.to)}`,
        text: "Plecare relaxată, realimentare înainte de destinație și check-in fără presiune."
      });
    }
  } else {
    items.push({
      date: addDays(plan.state.startDate, 0),
      title: "Ruta nu este calculată",
      text: "Completează orașele și apasă Calculează km."
    });
  }

  items.push({
    date: `${addDays(plan.state.startDate, plan.travelDaysOneWay)} - ${addDays(plan.state.endDate, -plan.travelDaysOneWay + 1)}`,
    title: `${plan.destinationNights} nopți la destinație`,
    text: "Păstrează cel puțin o zi fără drum lung și una pentru explorare locală."
  });

  if (plan.state.roundTrip && plan.state.distanceKm > 0) {
    if (plan.travelDaysOneWay > 1) {
      items.push({
        date: addDays(plan.state.endDate, -1),
        title: "Noapte pe retur",
        text: "Alege o oprire diferită față de dus ca să rupi monotonia."
      });
    }
    items.push({
      date: addDays(plan.state.endDate, 0),
      title: `Retur spre ${shortPlace(plan.state.from)}`,
      text: "Lasă o rezervă de timp pentru frontieră, trafic, vreme sau ferry."
    });
  }

  document.querySelector("#timeline").innerHTML = items.map((item) => `
    <article class="timeline-item">
      <div class="timeline-text">
        <span>${item.date}</span>
        <strong>${item.title}</strong>
        <span>${item.text}</span>
      </div>
    </article>
  `).join("");
}

function renderLodging(plan) {
  const base = plan.state.nightlyBudget * plan.state.rooms;
  const aiData = getSavedAiData();
  
  let options = [];
  if (aiData && aiData.lodgings && aiData.lodgings.length) {
    options = aiData.lodgings.map(opt => ({
      title: opt.title || "Opțiune cazare",
      price: opt.price ? Number(opt.price) : base,
      meta: opt.meta || "",
      tags: Array.isArray(opt.tags) ? opt.tags : []
    }));
  } else {
    options = [
      { title: "Family value", price: base * 0.86, meta: "rating bun, parcare, anulare gratuită", tags: ["preț bun", "mic dejun", "familie"] },
      { title: "Aproape de plajă/centru", price: base * 1.08, meta: "mai puțin condus local, seri mai simple", tags: ["distanță mică", "confort", "copii"] },
      { title: "Apartament cu bucătărie", price: base * 0.98, meta: "reduce costul la mese și ajută cu programul copiilor", tags: ["bucătărie", "spațiu", "sejur lung"] }
    ];
  }

  document.querySelector("#lodgingOptions").innerHTML = options.map((option) => `
    <article class="lodging-card">
      <div class="lodging-head">
        <div class="lodging-title">
          <strong>${option.title}</strong>
          <span>${option.meta}</span>
        </div>
        <div class="lodging-price">${euro(option.price)}</div>
      </div>
      <p>Total estimat: ${euro(option.price * plan.nights)} pentru ${plan.nights} nopți.</p>
      <div class="tags">
        ${option.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderStops(plan) {
  const aiData = getSavedAiData();
  
  let stops = [];
  let attractions = [];
  
  if (aiData && aiData.stops && aiData.stops.length) {
    stops = aiData.stops.map(stop => [
      stop.title || "Oprire pe traseu",
      stop.distance || "-",
      stop.description || ""
    ]);
  } else {
    stops = plan.state.distanceKm > 0
      ? [
        ["Pauză scurtă", `${Math.round(plan.state.distanceKm * 0.25)} km`, "cafea, toaletă, dezmorțire"],
        ["Pauză lungă", `${Math.round(plan.state.distanceKm * 0.5)} km`, "masă și timp pentru copii"],
        ["Ultima oprire", `${Math.round(plan.state.distanceKm * 0.78)} km`, "realimentare și verificare check-in"]
      ]
      : [["După calcul", "-", "opriri generate în funcție de km"]];
  }
  
  if (aiData && aiData.attractions && aiData.attractions.length) {
    attractions = aiData.attractions.map(attr => [
      attr.title || "Atracție",
      attr.description || ""
    ]);
  } else {
    attractions = [
      ["Orașe la jumătatea drumului", "caută variante la 45-60% din traseu"],
      ["Parcuri sau faleze", "pauze mai bune decât benzinăriile simple"],
      ["Centru vechi / promenadă", "bun pentru masă și plimbare scurtă"],
      ["Locuri acoperite", "variantă de rezervă pe ploaie"]
    ];
  }

  document.querySelector("#stopList").innerHTML = stops.map((stop) => `
    <article class="plain-item">
      <div class="item-row">
        <strong>${stop[0]}</strong>
        <span>${stop[1]}</span>
      </div>
      <span>${stop[2]}</span>
    </article>
  `).join("");

  document.querySelector("#attractionList").innerHTML = attractions.map((place) => `
    <article class="plain-item">
      <strong>${place[0]}</strong>
      <span>${place[1]}</span>
    </article>
  `).join("");
}

function exportPlan() {
  if (!lastPlan) render();
  const plan = lastPlan;
  const payload = {
    traseu: `${plan.state.from} -> ${plan.state.to}`,
    puncteIntermediare: plan.state.waypoints,
    bacuri: plan.state.ferrySegments,
    sursaRuta: plan.state.routeSource,
    perioada: `${plan.state.startDate} - ${plan.state.endDate}`,
    persoane: plan.people,
    combustibil: {
      tip: fuelProfiles[plan.state.fuelType].label,
      consum: plan.state.fuelConsumption,
      unitate: fuelProfiles[plan.state.fuelType].unit,
      tariPeTraseu: plan.routeZones
    },
    costuri: {
      totalRecomandat: Math.round(plan.recommended?.price || plan.carTotal),
      combustibil: Math.round(plan.fuelCost),
      cazare: Math.round(plan.lodgingCost),
      mancare: Math.round(plan.foodCost),
      taxeDrum: Math.round(plan.roadCosts)
    },
    recomandare: plan.recommended?.title || null,
    transport: plan.transport.map((item) => ({
      nume: item.title,
      pret: Math.round(item.price),
      scor: item.score,
      nota: item.note
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `plan-${shortPlace(plan.state.from || "ruta")}-${shortPlace(plan.state.to || "destinatie")}`.toLowerCase().replaceAll(" ", "-") + ".json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Plan exportat ca JSON.");
}

function downloadFuelAndTollData() {
  const plan = lastPlan || calculatePlan();
  const payload = {
    actualizatManualLa: new Date().toISOString(),
    nota: "Valori orientative/editabile. Poți înlocui acest fișier cu date live dintr-un API.",
    fuelTypes: fuelProfiles,
    countryDefaults: countryFuelDefaults,
    route: {
      from: fields.from.value,
      to: fields.to.value,
      fuelType: fields.fuelType.value,
      countries: plan.routeZones
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "preturi-combustibil-taxe.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Datele de combustibil și taxe au fost descărcate.");
}

function buildAiContext(plan) {
  return [
    `Ruta: ${plan.state.from} -> ${plan.state.waypoints.join(" -> ")}${plan.state.waypoints.length ? " -> " : ""}${plan.state.to}`,
    `Sursa rută: ${plan.state.routeSource}`,
    `Km auto dus: ${Math.round(plan.state.distanceKm)}`,
    `Ore drum dus: ${plan.state.driveHours}`,
    `Bacuri: ${plan.state.ferrySegments.length ? plan.state.ferrySegments.map((segment) => `${segment.from} - ${segment.to}, ${segment.hours}h, ${segment.cost} EUR`).join("; ") : "nu"}`,
    `Perioadă: ${plan.state.startDate} - ${plan.state.endDate}, ${plan.nights} nopți`,
    `Familie: ${plan.state.adults} adulți, ${plan.state.children} copii, vârste: ${plan.state.childAges || "n/a"}`,
    `Țări pe traseu: ${plan.routeZones.map((zone) => `${zone.name} (${zone.km} km)`).join(", ")}`,
    `Cost estimat recomandat: ${Math.round(plan.recommended?.price || plan.carTotal)} EUR`,
    "",
    "Răspunde în română, practic, structurat scurt, cu idei realiste pentru familie."
  ].join("\n");
}

async function runAiSuggestions() {
  const key = aiKey.value.trim();
  const provider = aiProvider.value;
  const endpoint = aiEndpoint.value.trim() || defaults.aiEndpoint;
  const model = aiModel.value.trim() || defaults.aiModel;
  const prompt = aiPrompt.value.trim() || defaults.aiPrompt;
  if (provider === "gemini" && !key) {
    showToast("Completează API key-ul Gemini.");
    return;
  }
  const plan = lastPlan || calculatePlan();
    aiOutput.textContent = "Se cer sugestii AI...";
    aiOutput.classList.remove("has-result");
    openAiResultBtn.hidden = true;
  aiOutput.scrollIntoView({ behavior: "smooth", block: "center" });
  runAiBtn.disabled = true;
  try {
    const systemPrompt = `
Important: La finalul răspunsului tău (după recomandările text detaliate), adaugă un bloc JSON valid cuprins EXACT între tagurile speciale <structured_data> și </structured_data> (fără alte prefixe markdown gen \`\`\`json sau alte texte în interiorul tagurilor). Acesta trebuie să conțină date structurate conform schemei de mai jos:
{
  "stops": [
    {"title": "Pauză recomandată la...", "distance": "km de la plecare, ex: 150 km", "description": "ce pot face copiii sau utilitatea opririi (toaletă, masă etc.)"}
  ],
  "attractions": [
    {"title": "Nume Atractie/Loc", "description": "activități recomandate în acea zonă"}
  ],
  "lodgings": [
    {"title": "Nume opțiune / Tip cazare / Zonă", "price": pret_estimat_per_noapte_in_eur, "meta": "parcare gratuită, rating bun, mic dejun etc.", "tags": ["tag1", "tag2"]}
  ]
}
Te rog completează datele de mai sus cu opțiuni reale adaptate exact la traseul generat. Încearcă să oferi 3-4 opriri recomandate pe parcursul distanței totale, 3-4 atracții de vizitat și 3 opțiuni de cazare.
`;
    const augmentedPrompt = `${prompt}\n\n${systemPrompt}`;
    const payload = {
      prompt: augmentedPrompt,
      context: buildAiContext(plan),
      model
    };
    const response = provider === "proxy"
      ? await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      : await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${augmentedPrompt}\n\nContext traseu:\n${buildAiContext(plan)}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1650
        }
      })
    });
    const data = await readAiJson(response, provider);
    if (!response.ok) {
      throw new Error(data.error?.message || "API-ul AI a întors eroare.");
    }
    const text = provider === "proxy"
      ? (data.text || data.result || data.output || "")
      : data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    if (!text) throw new Error("Nu am primit text de la AI.");
    showAiResult(text);
    aiOutput.scrollIntoView({ behavior: "smooth", block: "center" });
    render();
    showToast("Sugestiile AI au fost generate.");
  } catch (error) {
    aiOutput.textContent = `Nu am putut genera sugestii AI.\n${error.message}`;
    aiOutput.classList.remove("has-result");
    openAiResultBtn.hidden = true;
    aiOutput.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast(provider === "proxy" ? "Verifică endpointul AI." : "AI indisponibil sau key invalid.");
  } finally {
    runAiBtn.disabled = false;
  }
}

async function readAiJson(response, provider) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();

  const text = await response.text();
  if (provider === "proxy" && response.ok && /<!doctype html|<html/i.test(text)) {
    throw new Error("Amplify întoarce pagina aplicației pentru /api/ai-suggestions. Verifică regula Rewrite: source /api/ai-suggestions, target AiEndpoint din CloudFormation, status 200.");
  }
  throw new Error(`Endpointul AI nu a răspuns JSON (${response.status}). Verifică API Gateway, Lambda și regula de rewrite din Amplify.`);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

// ==========================================
// SCENARIO MANAGER
// ==========================================
const SCENARIOS_KEY = "familyTripPlanner:saved_scenarios";

function getSavedScenarios() {
  try {
    return JSON.parse(localStorage.getItem(SCENARIOS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveSavedScenarios(list) {
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(list));
}

function loadSavedScenariosList() {
  if (!savedScenariosSelect) return;
  const list = getSavedScenarios();
  
  while (savedScenariosSelect.options.length > 1) {
    savedScenariosSelect.remove(1);
  }
  
  list.forEach(scenario => {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = scenario.name;
    savedScenariosSelect.appendChild(option);
  });
  
  savedScenariosSelect.value = "";
  if (deleteScenarioBtn) deleteScenarioBtn.disabled = true;
}

function handleSaveScenario() {
  const name = newScenarioName.value.trim();
  if (!name) {
    showToast(language === "en" ? "Please enter a name for the scenario." : "Te rog introdu un nume pentru scenariu.");
    return;
  }
  
  const currentPlan = lastPlan || calculatePlan();
  const state = currentPlan.state;
  
  const list = getSavedScenarios();
  const existingIndex = list.findIndex(s => normalize(s.name) === normalize(name));
  
  const id = existingIndex >= 0 ? list[existingIndex].id : "scen_" + Date.now();
  const newScenario = {
    id,
    name,
    timestamp: Date.now(),
    state
  };
  
  if (existingIndex >= 0) {
    list[existingIndex] = newScenario;
    showToast(language === "en" ? `Scenario "${name}" updated.` : `Scenariul "${name}" a fost actualizat.`);
  } else {
    list.push(newScenario);
    showToast(language === "en" ? `Scenario "${name}" saved.` : `Scenariul "${name}" a fost salvat.`);
  }
  
  saveSavedScenarios(list);
  newScenarioName.value = "";
  loadSavedScenariosList();
  
  savedScenariosSelect.value = id;
  if (deleteScenarioBtn) deleteScenarioBtn.disabled = false;
}

function handleDeleteScenario() {
  const id = savedScenariosSelect.value;
  if (!id) return;
  
  let list = getSavedScenarios();
  const scenario = list.find(s => s.id === id);
  if (!scenario) return;
  
  list = list.filter(s => s.id !== id);
  saveSavedScenarios(list);
  
  showToast(language === "en" ? `Scenario deleted.` : `Scenariul a fost șters.`);
  loadSavedScenariosList();
}

function handleSelectScenario() {
  const id = savedScenariosSelect.value;
  if (!id) {
    if (deleteScenarioBtn) deleteScenarioBtn.disabled = true;
    return;
  }
  
  if (deleteScenarioBtn) deleteScenarioBtn.disabled = false;
  
  const list = getSavedScenarios();
  const scenario = list.find(s => s.id === id);
  if (!scenario) return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario.state));
  loadDefaults();
  render();
  
  showToast(language === "en" ? `Scenario "${scenario.name}" loaded.` : `Scenariul "${scenario.name}" a fost încărcat.`);
}

// ==========================================
// PRE-TRIP CHECKLIST MANAGER
// ==========================================
const CHECKLIST_PREFIX = "familyTripPlanner:checklist:";

function getChecklistKey() {
  const selectVal = savedScenariosSelect ? savedScenariosSelect.value : "";
  if (selectVal) return "scen_" + selectVal;
  
  const from = fields.from.value.trim();
  const to = fields.to.value.trim();
  return `route_${normalize(from)}_${normalize(to)}`;
}

// Ensure checklist cache does not grow infinitely
function getCheckedItems() {
  const key = CHECKLIST_PREFIX + getChecklistKey();
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

function saveCheckedItems(items) {
  const key = CHECKLIST_PREFIX + getChecklistKey();
  localStorage.setItem(key, JSON.stringify(items));
}

function renderChecklist() {
  if (!checklistBody) return;
  const zones = readRouteZones();
  const checkedItems = getCheckedItems();
  
  let items = [];
  
  // 1. CAR GENERALS (always visible)
  items.push({
    id: "car_oil",
    text: t("checkCarOil"),
    category: "car"
  });
  items.push({
    id: "car_tires",
    text: t("checkCarTires"),
    category: "car"
  });
  items.push({
    id: "car_kit",
    text: t("checkCarKit"),
    category: "car"
  });
  
  // 2. KIDS GENERALS
  const kidsCount = number(fields.children.value, 0);
  if (kidsCount > 0) {
    items.push({
      id: "kids_snacks",
      text: t("checkKidsSnacks"),
      category: "kids"
    });
    items.push({
      id: "kids_entertainment",
      text: t("checkKidsEntertainment"),
      category: "kids"
    });
  }
  
  // 3. TRANSIT COUNTRY VIGNETTES & BORDER CHECKS
  const vignetteCountries = {
    RO: "rovinietă",
    BG: "vignetă electronică",
    HU: "e-vignetă (Matrica)",
    AT: "vignetă (clasică sau digitală)",
    SI: "e-vignetă",
    SK: "e-vignetă",
    CZ: "e-vignetă"
  };
  
  const borderCountries = {
    RS: "Serbia",
    MK: "Macedonia de Nord",
    AL: "Albania",
    XK: "Kosovo",
    ME: "Muntenegru",
    BA: "Bosnia și Herțegovina",
    TR: "Turcia",
    GB: "Regatul Unit",
    US: "Statele Unite"
  };
  
  zones.forEach(zone => {
    const code = zone.code.toUpperCase();
    
    // Vignette checks
    if (vignetteCountries[code]) {
      items.push({
        id: `vig_${code}`,
        text: t("checkVignette").replace("{country}", zone.name).replace("{details}", vignetteCountries[code]),
        category: "tolls"
      });
    } else if (code !== "DEFAULT") {
      items.push({
        id: `vig_${code}`,
        text: language === "en" 
          ? `Check toll stations and highway payment options (cash/card) for ${zone.name}` 
          : `Verifică stațiile de taxare și plata autostrăzii (cash/card) pentru ${zone.name}`,
        category: "tolls"
      });
    }
    
    // Border checks (non-EU)
    if (borderCountries[code]) {
      items.push({
        id: `passport_${code}`,
        text: t("checkPassport").replace("{country}", zone.name),
        category: "documents"
      });
      items.push({
        id: `greencard_${code}`,
        text: t("checkGreenCard").replace("{country}", zone.name),
        category: "documents"
      });
    }
  });
  
  if (!items.length) {
    checklistBody.innerHTML = `<div style="text-align: center; color: var(--muted); font-size: 0.88rem; padding: 10px 0;">
      ${language === "en" ? "Checklist will appear once a route is calculated." : "Checklist-ul va apărea după calcularea rutei."}
    </div>`;
    return;
  }
  
  checklistBody.innerHTML = items.map(item => {
    const isChecked = checkedItems.includes(item.id);
    return `
      <div class="checklist-item ${isChecked ? "checked" : ""}" data-item-id="${item.id}">
        <input type="checkbox" id="chk_${item.id}" ${isChecked ? "checked" : ""} />
        <label for="chk_${item.id}" style="display: flex; flex: 1; align-items: flex-start; cursor: pointer;">
          <span>${item.text}</span>
          <span class="tag">${item.category}</span>
        </label>
      </div>
    `;
  }).join("");
}

function handleChecklistClick(event) {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;
  
  const itemRow = checkbox.closest('.checklist-item');
  if (!itemRow) return;
  
  const itemId = itemRow.dataset.itemId;
  let checked = getCheckedItems();
  
  if (checkbox.checked) {
    itemRow.classList.add('checked');
    if (!checked.includes(itemId)) checked.push(itemId);
  } else {
    itemRow.classList.remove('checked');
    checked = checked.filter(id => id !== itemId);
  }
  
  saveCheckedItems(checked);
}

function toggleChecklistCollapse() {
  if (!checklistBody) return;
  const isHidden = checklistBody.classList.toggle("hidden");
  if (checklistToggleArrow) {
    checklistToggleArrow.style.transform = isHidden ? "rotate(-90deg)" : "rotate(0deg)";
  }
}

// ==========================================
// WEATHER SERVICE (OPEN-METEO)
// ==========================================
async function fetchDestinationWeather(toPlace) {
  if (!destinationWeather) return;
  if (!toPlace || !toPlace.lat || !toPlace.lon) {
    destinationWeather.style.display = "none";
    return;
  }
  
  destinationWeather.style.display = "inline-flex";
  destinationWeather.classList.add("loading");
  destinationWeather.textContent = t("weatherLoading");
  
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${toPlace.lat}&longitude=${toPlace.lon}&current_weather=true`);
    if (!response.ok) throw new Error("Weather API error");
    
    const data = await response.json();
    const current = data.current_weather;
    if (current) {
      const temp = Math.round(current.temperature);
      const code = current.weathercode;
      const desc = getWeatherDescription(code);
      
      destinationWeather.classList.remove("loading");
      destinationWeather.innerHTML = `
        <svg viewBox="0 0 24 24" style="stroke: var(--amber); fill: none; width: 16px; height: 16px; margin-right: 4px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <span>${temp}°C, ${desc}</span>
      `;
    }
  } catch (error) {
    console.error("Failed to load weather:", error);
    destinationWeather.style.display = "none";
  }
}

function getWeatherDescription(code) {
  const weatherMap = {
    0: language === "en" ? "Clear" : "Senin",
    1: language === "en" ? "Mostly clear" : "Majoritar senin",
    2: language === "en" ? "Partly cloudy" : "Parțial noros",
    3: language === "en" ? "Cloudy" : "Noros",
    45: language === "en" ? "Fog" : "Ceață",
    48: language === "en" ? "Depositing rime fog" : "Ceață depusă",
    51: language === "en" ? "Light drizzle" : "Boabă de ploaie fină",
    53: language === "en" ? "Moderate drizzle" : "Ploaie slabă",
    55: language === "en" ? "Dense drizzle" : "Ploaie deasă",
    61: language === "en" ? "Slight rain" : "Averse slabe",
    63: language === "en" ? "Moderate rain" : "Ploaie",
    65: language === "en" ? "Heavy rain" : "Averse torențiale",
    71: language === "en" ? "Slight snow" : "Ninsori slabe",
    73: language === "en" ? "Moderate snow" : "Ninsoare",
    75: language === "en" ? "Heavy snow" : "Viscol",
    77: language === "en" ? "Snow grains" : "Măzăriche",
    80: language === "en" ? "Slight rain showers" : "Ploaie trecătoare",
    81: language === "en" ? "Moderate rain showers" : "Averse moderate",
    82: language === "en" ? "Violent rain showers" : "Averse puternice",
    85: language === "en" ? "Slight snow showers" : "Averse slabe de ninsoare",
    86: language === "en" ? "Heavy snow showers" : "Averse grele de ninsoare",
    95: language === "en" ? "Thunderstorm" : "Furtună",
    96: language === "en" ? "Thunderstorm with slight hail" : "Furtună cu grindină",
    99: language === "en" ? "Thunderstorm with heavy hail" : "Furtună puternică"
  };
  return weatherMap[code] || (language === "en" ? "Sunny" : "Frumos");
}

// ==========================================
// PRINT / PDF EXPORTER
// ==========================================
function handlePrintPdf() {
  if (!lastPlan) render();
  const plan = lastPlan;
  
  const title = plan.state.from && plan.state.to
    ? `${shortPlace(plan.state.from)} → ${shortPlace(plan.state.to)}`
    : (language === "en" ? "Travel Plan" : "Plan de călătorie");
    
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast(language === "en" ? "Pop-up blocker prevented opening print view." : "Pop-up blocker-ul a blocat deschiderea paginii de print.");
    return;
  }
  
  const currentLanguage = language;
  
  // Format timeline cards from the current UI markup.
  const timelineHtml = Array.from(document.querySelectorAll("#timeline .timeline-item")).map(item => {
    const textBlock = item.querySelector(".timeline-text");
    const spans = Array.from(textBlock?.querySelectorAll("span") || []);
    const badge = spans[0]?.textContent || "";
    const name = textBlock?.querySelector("strong")?.textContent || "";
    const desc = spans[1]?.textContent || "";
    return `
      <div class="print-timeline-item">
        <div class="print-badge">${badge}</div>
        <div class="print-timeline-content">
          <strong>${name}</strong>
          <div class="print-desc">${desc}</div>
        </div>
      </div>
    `;
  }).join("");
  
  // Format checklist
  const checkedItems = getCheckedItems();
  const checklistHtml = Array.from(document.querySelectorAll(".checklist-item")).map(item => {
    const text = item.querySelector("span")?.textContent || "";
    const category = item.querySelector(".tag")?.textContent || "";
    const isChecked = checkedItems.includes(item.dataset.itemId);
    return `
      <div class="print-checklist-item">
        <span class="print-checkbox">${isChecked ? "&#9745;" : "&#9744;"}</span>
        <span class="print-checklist-text">${text}</span>
        <span class="print-checklist-category">(${category})</span>
      </div>
    `;
  }).join("");
  
  // Format cost breakdown cards from the current UI markup.
  const breakdownHtml = Array.from(document.querySelectorAll("#costBreakdown .breakdown-card")).map(row => {
    const country = row.querySelector("strong:first-child")?.textContent || row.querySelector("strong")?.textContent || "";
    const detail = row.querySelector("span:nth-of-type(1)")?.textContent || "";
    const costMeta = row.querySelector("span:nth-of-type(2)")?.textContent || "";
    const totalCost = row.querySelector("strong:last-child")?.textContent || "";
    return `
      <tr>
        <td><strong>${country}</strong></td>
        <td>${detail}</td>
        <td>${costMeta}</td>
        <td>${totalCost}</td>
      </tr>
    `;
  }).join("");
  
  // AI Suggestions if any
  const aiOutputText = aiOutput.textContent.trim();
  const hasAi = aiOutput.classList.contains("has-result") && aiOutputText && aiOutputText !== t("aiOutputDefault");
  const aiHtml = hasAi 
    ? `<div class="print-section">
         <h2>${t("aiIdeas")}</h2>
         <div class="print-ai-text">${aiOutputText.replaceAll("\n", "<br>")}</div>
       </div>`
    : "";

  const total = plan.recommended ? plan.recommended.price : plan.carTotal;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="${currentLanguage}">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Inter, system-ui, -apple-system, sans-serif;
          color: #1f2937;
          line-height: 1.5;
          margin: 40px;
          font-size: 14px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 5px;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 10px;
        }
        h2 {
          font-size: 18px;
          color: #0f766e;
          margin-top: 25px;
          margin-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .header-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .meta-group div {
          margin-bottom: 4px;
        }
        .meta-group strong {
          color: #111827;
        }
        .summary-box {
          font-size: 16px;
          background: #e6f4ea;
          border: 1px solid #34a853;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 25px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        th, td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #f3f4f6;
          font-weight: 600;
        }
        .print-timeline-item {
          display: flex;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .print-badge {
          font-weight: bold;
          background: #e0f2fe;
          color: #0369a1;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
          height: fit-content;
          margin-right: 15px;
          white-space: nowrap;
        }
        .print-timeline-content {
          flex: 1;
        }
        .print-detail {
          color: #6b7280;
          font-size: 12px;
          margin-left: 10px;
        }
        .print-desc {
          margin-top: 5px;
          color: #4b5563;
        }
        .print-checklist-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px dashed #e5e7eb;
          page-break-inside: avoid;
        }
        .print-checkbox {
          font-size: 18px;
          font-family: monospace;
          font-weight: bold;
          color: #0f766e;
        }
        .print-checklist-text {
          flex: 1;
        }
        .print-checklist-category {
          color: #9ca3af;
          font-size: 11px;
          text-transform: uppercase;
        }
        .print-ai-text {
          font-style: italic;
          color: #374151;
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #0f766e;
        }
        @media print {
          body {
            margin: 20px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      
      <div class="header-meta">
        <div class="meta-group">
          <div><strong>${currentLanguage === "en" ? "Period" : "Perioada"}:</strong> ${plan.state.startDate} - ${plan.state.endDate} (${plan.nights} ${t("nights")})</div>
          <div><strong>${currentLanguage === "en" ? "People" : "Persoane"}:</strong> ${plan.people}</div>
          <div><strong>${currentLanguage === "en" ? "Route source" : "Sursă rută"}:</strong> ${plan.state.routeSource}</div>
        </div>
        <div class="meta-group" style="text-align: right;">
          <div><strong>${currentLanguage === "en" ? "Total distance" : "Distanță totală"}:</strong> ${Math.round(plan.totalRouteKm)} km</div>
          <div><strong>${currentLanguage === "en" ? "Vehicle type" : "Tip vehicul"}:</strong> ${fuelTypeLabel(plan.state.fuelType)}</div>
          <div><strong>${currentLanguage === "en" ? "Accommodation nightly" : "Cazare noapte"}:</strong> €${plan.state.nightlyBudget} / ${t("rooms")}</div>
        </div>
      </div>
      
      <div class="summary-box">
        <strong>${t("totalEstimate")}: ${euro(total)}</strong> (${euro(total / plan.people)} / ${t("perPerson")})
        <div style="font-size: 12px; margin-top: 5px; color: #4b5563;">
          ${t("fuel")}: ${euro(plan.fuelCost)} | ${t("lodging")}: ${euro(plan.lodgingCost)} | ${currentLanguage === "en" ? "Food" : "Mâncare"}: ${euro(plan.foodCost)} | ${currentLanguage === "en" ? "Transit & Vignettes" : "Taxe drum & ferry"}: ${euro(plan.roadCosts)}
        </div>
      </div>

      <div class="print-section">
        <h2>${currentLanguage === "en" ? "Road Expenses by Country" : "Cheltuieli pe țări"}</h2>
        <table>
          <thead>
            <tr>
              <th>${currentLanguage === "en" ? "Country" : "Țară"}</th>
              <th>${currentLanguage === "en" ? "Distance" : "Distanță"}</th>
              <th>${t("fuel")}</th>
              <th>${currentLanguage === "en" ? "Toll" : "Taxă"}</th>
            </tr>
          </thead>
          <tbody>
            ${breakdownHtml || `<tr><td colspan="4" style="text-align:center;">${currentLanguage === "en" ? "No breakdown available" : "Fără costuri detailate"}</td></tr>`}
          </tbody>
        </table>
      </div>

      <div class="print-section">
        <h2>${t("itinerary")}</h2>
        ${timelineHtml || `<p>${currentLanguage === "en" ? "No itinerary details generated." : "Nu există detalii în itinerar."}</p>`}
      </div>

      <div class="print-section" style="page-break-before: always;">
        <h2>${t("checklistTitle")}</h2>
        ${checklistHtml || `<p>${currentLanguage === "en" ? "Checklist is empty." : "Checklist-ul este gol."}</p>`}
      </div>

      ${aiHtml}

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
  showToast("Plan recalculat.");
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  routeMeta = {
    source: defaults.routeSource,
    fromPlace: null,
    toPlace: null,
    ferryLabel: "",
    routeGeometry: null,
    waypointPlaces: [],
    routeSegments: [],
    routeVariants: []
  };
  routeVariantCache = new Map();
  loadDefaults();
  render();
  showToast("Date resetate.");
});

document.querySelector("#exportBtn").addEventListener("click", exportPlan);
document.querySelector("#autoRouteBtn").addEventListener("click", applyAutoRouteEstimate);
document.querySelector("#fuelTemplateBtn").addEventListener("click", downloadFuelAndTollData);
document.querySelector("#applyRoutePathBtn").addEventListener("click", applyRoutePath);
langRoBtn.addEventListener("click", () => {
  applyLanguage("ro");
  showToast("Limba schimbată în română.");
});
langEnBtn.addEventListener("click", () => {
  applyLanguage("en");
  showToast("Language changed to English.");
});
themeToggleBtn.addEventListener("click", () => {
  applyTheme(theme === "dark" ? "light" : "dark");
  render();
});
refreshFuelBtn.addEventListener("click", refreshFuelPricesOnline);
refreshTollsBtn.addEventListener("click", refreshRoadTolls);
runAiBtn.addEventListener("click", runAiSuggestions);
closeAiResultBtn.addEventListener("click", closeAiResult);
openAiResultBtn.addEventListener("click", openAiResult);
aiResultModal.addEventListener("click", (event) => {
  if (event.target === aiResultModal) closeAiResult();
});
routeVariantsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-route-variant]");
  if (!button) return;
  applyRouteVariant(button.dataset.routeVariant);
});

document.querySelector("#addWaypointBtn").addEventListener("click", () => {
  const value = waypointInput.value.trim();
  if (!value) return;
  renderWaypoints([...readWaypoints(), value]);
  waypointInput.value = "";
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
  render();
});

waypointInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#addWaypointBtn").click();
  }
});

routePathInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    applyRoutePath();
  }
});

waypointList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-waypoint]");
  if (!button) return;
  const index = Number(button.dataset.removeWaypoint);
  renderWaypoints(readWaypoints().filter((_, itemIndex) => itemIndex !== index));
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
  render();
});

document.querySelector("#addFerryBtn").addEventListener("click", () => {
  renderFerrySegments([
    ...readFerrySegments(),
    { from: "", to: "", cost: 0, hours: 0 }
  ]);
  clearRouteVariants();
  render();
});

ferryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-ferry]");
  if (!button) return;
  const index = Number(button.dataset.removeFerry);
  renderFerrySegments(readFerrySegments().filter((_, itemIndex) => itemIndex !== index));
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
  render();
});

ferryList.addEventListener("input", () => {
  syncFerryTotal();
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
  window.clearTimeout(render.inputTimer);
  render.inputTimer = window.setTimeout(render, 220);
});

fields.fuelType.addEventListener("change", () => {
  updateFuelLabels(false);
  const currentZones = readRouteZones();
  if (currentZones.length) {
    renderRouteZones(routeZonesForFuelType(currentZones, fields.fuelType.value));
  } else if (fields.distanceKm.value > 0) {
    renderRouteZones(routeZonesFromFields());
  }
  render();
  showToast(`Calcul pe ${fuelProfiles[fields.fuelType.value].label}.`);
});

fields.from.addEventListener("input", () => {
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
});
fields.to.addEventListener("input", () => {
  clearRouteVariants();
  setRouteStatus("Rută necalculată");
});

[aiProvider, aiEndpoint, aiModel, aiKey, aiPrompt].forEach((field) => {
  field.addEventListener("input", () => {
    if (field === aiProvider) syncAiUi();
    window.clearTimeout(render.inputTimer);
    render.inputTimer = window.setTimeout(render, 220);
  });
});

aiProvider.addEventListener("change", syncAiUi);

routeZonesEl.addEventListener("input", () => {
  updateRouteTotalsFromZones();
  window.clearTimeout(render.inputTimer);
  render.inputTimer = window.setTimeout(render, 220);
});

document.querySelector("#modeComfort").addEventListener("click", () => {
  mode = "comfort";
  document.querySelector("#modeComfort").classList.add("active");
  document.querySelector("#modeFast").classList.remove("active");
  render();
});

document.querySelector("#modeFast").addEventListener("click", () => {
  mode = "fast";
  document.querySelector("#modeFast").classList.add("active");
  document.querySelector("#modeComfort").classList.remove("active");
  render();
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    if (field === fields.fuelPrice) syncZonePricesFromAverage();
    if (field === fields.tolls) syncZoneTollsFromTotal();
    window.clearTimeout(render.inputTimer);
    render.inputTimer = window.setTimeout(render, 220);
  });
});

// New feature event listeners
if (savedScenariosSelect) savedScenariosSelect.addEventListener("change", handleSelectScenario);
if (deleteScenarioBtn) deleteScenarioBtn.addEventListener("click", handleDeleteScenario);
if (saveScenarioBtn) saveScenarioBtn.addEventListener("click", handleSaveScenario);
if (newScenarioName) {
  newScenarioName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveScenario();
    }
  });
}
if (checklistBody) checklistBody.addEventListener("click", handleChecklistClick);
if (checklistTitleRow) checklistTitleRow.addEventListener("click", toggleChecklistCollapse);
if (printPdfBtn) printPdfBtn.addEventListener("click", handlePrintPdf);

// Initialize Saved Scenarios dropdown
loadSavedScenariosList();

loadDefaults();
render();

if (new URLSearchParams(window.location.search).get("auto") === "1") {
  window.setTimeout(applyAutoRouteEstimate, 150);
}
