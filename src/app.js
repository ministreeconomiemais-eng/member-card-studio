const STORAGE_KEY = "member-card-studio:v1";
const SESSION_KEY = "member-card-studio:session";
const SUPER_ADMIN_PIN = "0000";

const fieldCatalog = [
  { type: "fullName", label: "Nom" },
  { type: "firstName", label: "Prenom" },
  { type: "memberNo", label: "Numero membre" },
  { type: "category", label: "Categorie" },
  { type: "role", label: "Fonction" },
  { type: "gender", label: "Sexe" },
  { type: "birthDate", label: "Date naissance" },
  { type: "birthPlace", label: "Lieu naissance" },
  { type: "nationality", label: "Nationalite" },
  { type: "photo", label: "Photo membre" },
  { type: "barcode", label: "Code-barres ID" },
  { type: "qr", label: "Code QR" },
  { type: "issueDate", label: "Date emission" },
  { type: "expiryDate", label: "Date expiration" },
  { type: "organization", label: "Organisation" },
  { type: "logo", label: "Logo" },
  { type: "logoBack", label: "Logo arriere" },
  { type: "signature", label: "Signature" },
  { type: "phone", label: "Telephone" },
  { type: "email", label: "Email" },
  { type: "address", label: "Adresse" },
  { type: "status", label: "Statut" },
  { type: "officeAddress", label: "Adresse siege" },
  { type: "officePhone", label: "Numero bureau" },
  { type: "legalText", label: "Texte juridique" }
];

const defaultElements = [
  el("organization", "Organisation", 33, 10, 46, 8, "front", 18, "#ffffff", "bold", "start"),
  el("fullName", "Nom", 33, 25, 48, 8, "front", 19, "#ffffff", "bold", "start"),
  el("firstName", "Prenom", 33, 34, 48, 8, "front", 17, "#ffffff", "bold", "start"),
  el("memberNo", "Numero membre", 33, 44, 35, 7, "front", 12, "#ffffff", "normal", "start"),
  el("category", "Categorie", 33, 53, 38, 7, "front", 12, "#fef3c7", "bold", "start"),
  el("photo", "Photo membre", 7, 18, 21, 34, "front", 12, "#111827", "normal", "center"),
  el("signature", "Signature", 59, 72, 19, 10, "front", 10, "#111827", "normal", "center"),
  el("logo", "Logo", 7, 7, 14, 17, "front", 10, "#111827", "normal", "center"),
  el("logoBack", "Logo arriere", 39, 13, 22, 31, "back", 10, "#111827", "normal", "center"),
  el("legalText", "Texte juridique", 13, 48, 74, 13, "back", 10, "#111827", "normal", "center"),
  el("officeAddress", "Adresse siege", 13, 65, 74, 8, "back", 11, "#111827", "normal", "center"),
  el("officePhone", "Numero bureau", 13, 76, 74, 8, "back", 11, "#111827", "normal", "center"),
  el("qr", "Code QR", 42, 42, 16, 25, "back", 10, "#111827", "normal", "center")
];

function photoCardElements() {
  return orderedCardElements("photo");
}

function ngoCardElements(variant = "ngoStandard") {
  return orderedCardElements(variant);
}

function orderedCardElements(variant = "photo") {
  const text = variant === "ngoHonor" ? "#2f2417" : "#111827";
  const muted = variant === "ngoHonor" ? "#78350f" : "#334155";
  const heading = variant === "ngoStandard" ? "#064e3b" : variant === "ngoHonor" ? "#7c2d12" : "#0f172a";
  return [
    el("photo", "Photo membre", 6.8, 17.2, 27.4, 45.6, "front", 12, "#111827", "normal", "center"),
    el("barcode", "Code-barres ID", 8.1, 67.2, 25.2, 8.2, "front", 10, "#111827", "normal", "center"),
    el("memberNo", "Numero membre", 8.1, 76.5, 25.2, 5.8, "front", 12.5, text, "bold", "center"),
    el("logo", "Logo", 40.2, 8.2, 11, 13.8, "front", 10, "#111827", "normal", "center"),
    el("organization", "Organisation", 53.4, 7.4, 39.8, 12.2, "front", 20, heading, "bold", "start"),
    el("fullName", "Nom", 41.2, 27.4, 51.5, 7.4, "front", 20, text, "bold", "start"),
    el("firstName", "Prenom", 41.2, 35.8, 51.5, 6.8, "front", 17, text, "bold", "start"),
    el("category", "Categorie", 41.2, 44.2, 25.5, 5.8, "front", 11.5, heading, "bold", "start"),
    el("role", "Fonction", 68, 44.2, 24.6, 5.8, "front", 11, muted, "bold", "start"),
    el("birthDate", "Date naissance", 41.2, 52.2, 21, 5.8, "front", 10.5, text, "bold", "start"),
    el("birthPlace", "Lieu naissance", 63.8, 52.2, 28.8, 5.8, "front", 10.5, text, "bold", "start"),
    el("nationality", "Nationalite", 41.2, 60.2, 51.5, 5.8, "front", 10.5, text, "bold", "start"),
    el("address", "Adresse", 40.8, 79.8, 34, 6, "front", 9.4, muted, "bold", "start"),
    el("phone", "Contact", 40.8, 87.4, 33.5, 5.4, "front", 9.4, muted, "bold", "start"),
    el("signature", "Signature", 74.8, 78.4, 12.2, 9.8, "front", 9, "#111827", "normal", "center"),
    el("expiryDate", "Expiration", 75.2, 89.2, 18.2, 5.2, "front", 9.4, text, "bold", "center"),
    el("logoBack", "Logo arriere", 7.4, 14.2, 17.6, 22, "back", 10, "#111827", "normal", "center"),
    el("organization", "Organisation", 29.2, 12.8, 38.2, 10.6, "back", 18, heading, "bold", "start"),
    el("legalText", "Texte juridique", 7.8, 40.2, 57.2, 29.5, "back", 9.5, text, "normal", "start"),
    el("qr", "Code QR", 72.2, 33.8, 18.3, 28.2, "back", 10, "#111827", "normal", "center"),
    el("officeAddress", "Adresse siege", 7.8, 77.4, 56.5, 6, "back", 9.5, muted, "bold", "start"),
    el("officePhone", "Numero bureau", 7.8, 85.4, 41.5, 5.8, "back", 9.5, muted, "bold", "start"),
    el("email", "Email", 50.5, 85.4, 37.5, 5.8, "back", 9.5, muted, "bold", "end")
  ];
}

let state = migrateState(loadState());
let session = loadSession();
let loginMode = "organization";
let view = "dashboard";
let activeOrgId = state.organizations[0]?.id || "";
let selectedTemplateId = state.templates[0]?.id || "";
let selectedElementId = "";
let activeFace = "front";
let previewMemberId = state.members[0]?.id || "";
let editingMemberId = "";
let generatedSelection = new Set(state.members.slice(0, 4).map((m) => m.id));

const app = document.querySelector("#app");

state.organizations.forEach((org) => ensureRequiredModelsForOrg(org.id));
saveState();

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "carte";
}

function hashString(value) {
  return Array.from(String(value || "")).reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function organizationDesignStyle(org, variant = "photo") {
  const base = `${org?.id || ""}|${org?.name || ""}|${org?.type || ""}|${variant}`;
  const hash = hashString(base);
  const type = `${org?.type || ""} ${org?.name || ""}`.toLowerCase();
  let hue = hash % 360;
  if (/eglise|church|paroisse|ministere|pasteur/.test(type)) hue = (hue + 260) % 360;
  if (/ecole|school|universit|institut|college/.test(type)) hue = (hue + 205) % 360;
  if (/ong|association|asbl/.test(type)) hue = (hue + 145) % 360;
  if (/politique|parti|mouvement/.test(type)) hue = (hue + 24) % 360;
  if (variant === "ngoHonor") hue = (hue + 38) % 360;
  if (variant === "ngoStandard") hue = (hue + 154) % 360;
  const accent = `hsl(${hue} 72% 34%)`;
  const accent2 = `hsl(${(hue + 38) % 360} 84% 46%)`;
  const accent3 = `hsl(${(hue + 168) % 360} 78% 42%)`;
  const soft = `hsl(${hue} 82% 97%)`;
  const line = `hsl(${(hue + 18) % 360} 82% 56%)`;
  return {
    accent,
    accent2,
    accent3,
    soft,
    line,
    hue,
    motif: hash % 5,
    angle: (hash % 24) - 12,
    offset: hash % 48,
    mark: String(org?.prefix || org?.name || "ORG").trim().slice(0, 2).toUpperCase()
  };
}

function el(type, label, x, y, w, h, face, fontSize, color, fontWeight, align) {
  return {
    id: uid("element"),
    type,
    label,
    x,
    y,
    w,
    h,
    face,
    fontSize,
    color,
    fontWeight,
    align
  };
}

function seedState() {
  const org1 = {
    id: uid("org"),
    name: "Fondation Umoja",
    type: "ONG",
    phone: "+243 000 111 222",
    email: "contact@umoja.test",
    address: "Lubumbashi, RDC",
    officeAddress: "Siege social: Lubumbashi, RDC",
    officePhone: "+243 000 111 222",
    legalText: "Cette carte est personnelle et atteste l'appartenance du titulaire a l'organisation. Elle doit etre presentee sur demande et reste la propriete de l'organisation.",
    prefix: "UMJ",
    logo: "",
    logoBack: "",
    signature: "",
    pin: "1111",
    adminName: "Admin Umoja",
    status: "active"
  };
  const org2 = {
    id: uid("org"),
    name: "Eglise Lumiere Vivante",
    type: "Eglise",
    phone: "+243 000 333 444",
    email: "eglise@lumiere.test",
    address: "Kinshasa, RDC",
    officeAddress: "Siege social: Kinshasa, RDC",
    officePhone: "+243 000 333 444",
    legalText: "Cette carte identifie le titulaire dans le cadre des activites officielles de l'organisation. Toute utilisation frauduleuse est interdite.",
    prefix: "ELV",
    logo: "",
    logoBack: "",
    signature: "",
    pin: "2222",
    adminName: "Admin Eglise",
    status: "active"
  };
  const categories = [
    { id: uid("cat"), orgId: org1.id, name: "Membre standard", color: "#0f766e", validityMonths: 240 },
    { id: uid("cat"), orgId: org1.id, name: "Membre d'honneur", color: "#b45309", validityMonths: 240 },
    { id: uid("cat"), orgId: org2.id, name: "Pasteur representant legal", color: "#7c3aed", validityMonths: 240 },
    { id: uid("cat"), orgId: org2.id, name: "Pasteur de district", color: "#2563eb", validityMonths: 240 }
  ];
  const members = [
    member(org1, categories[0], "Kabongo", "Grace", "Coordinatrice terrain", "F", "+243 970 000 001"),
    member(org1, categories[1], "Mutombo", "Henri", "Bienfaiteur", "M", "+243 970 000 002"),
    member(org2, categories[2], "Mbuyi", "Samuel", "Pasteur representant legal", "M", "+243 970 000 003"),
    member(org2, categories[3], "Kalenga", "Esther", "Pasteure de district", "F", "+243 970 000 004")
  ];
  const standardTemplate = {
    id: uid("tpl"),
    orgId: org1.id,
    categoryId: categories[0].id,
    name: "PVC membre standard",
    widthMm: 85.6,
    heightMm: 54,
    orientation: "landscape",
    accentColor: "#0f766e",
    bgFront: "",
    bgBack: "",
    elements: structuredClone(defaultElements)
  };
  const honorTemplate = {
    id: uid("tpl"),
    orgId: org1.id,
    categoryId: categories[1].id,
    name: "PVC membre d'honneur",
    widthMm: 85.6,
    heightMm: 54,
    orientation: "landscape",
    accentColor: "#b45309",
    bgFront: "",
    bgBack: "",
    elements: structuredClone(defaultElements)
  };
  const churchLegalTemplate = {
    id: uid("tpl"),
    orgId: org2.id,
    categoryId: categories[2].id,
    name: "PVC pasteur representant legal",
    widthMm: 85.6,
    heightMm: 54,
    orientation: "landscape",
    accentColor: "#7c3aed",
    bgFront: "",
    bgBack: "",
    elements: structuredClone(defaultElements)
  };
  const churchDistrictTemplate = {
    id: uid("tpl"),
    orgId: org2.id,
    categoryId: categories[3].id,
    name: "PVC pasteur de district",
    widthMm: 85.6,
    heightMm: 54,
    orientation: "landscape",
    accentColor: "#2563eb",
    bgFront: "",
    bgBack: "",
    elements: structuredClone(defaultElements)
  };
  categories[0].templateId = standardTemplate.id;
  categories[1].templateId = honorTemplate.id;
  categories[2].templateId = churchLegalTemplate.id;
  categories[3].templateId = churchDistrictTemplate.id;
  org1.defaultTemplateId = standardTemplate.id;
  org2.defaultTemplateId = churchLegalTemplate.id;
  return {
    organizations: [org1, org2],
    categories,
    members,
    templates: [standardTemplate, honorTemplate, churchLegalTemplate, churchDistrictTemplate],
    generatedCards: []
  };
}

function member(org, category, lastName, firstName, role, gender, phone) {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return {
    id: uid("mem"),
    orgId: org.id,
    categoryId: category.id,
    firstName,
    lastName,
    gender,
    birthDate: "",
    birthPlace: "",
    nationality: "Congolaise",
    role,
    phone,
    email: "",
    address: org.address,
    memberNo: `${org.prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    issueDate: now.toISOString().slice(0, 10),
    expiryDate: expiry.toISOString().slice(0, 10),
    status: "active",
    photo: "",
    cardUid: uid("card").toUpperCase()
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedState();
  } catch {
    return seedState();
  }
}

function migrateState(data) {
  data.organizations ||= [];
  data.categories ||= [];
  data.members ||= [];
  data.templates ||= [];
  data.generatedCards ||= [];
  data.organizations.forEach((org) => {
    org.defaultTemplateId ||= data.templates.find((tpl) => tpl.orgId === org.id)?.id || "";
    org.pin ||= "1234";
    org.adminName ||= `Admin ${org.name || "Organisation"}`;
    org.officeAddress ||= org.address || "";
    org.officePhone ||= org.phone || "";
    org.legalText ||= "Cette carte est personnelle, non transferable et reste la propriete de l'organisation. Elle doit etre presentee pour verification lorsque cela est necessaire.";
    if (/fondation umoja/i.test(org.name) && org.pin === "1234") org.pin = "1111";
    if (/eglise lumiere vivante/i.test(org.name) && org.pin === "1234") org.pin = "2222";
  });
  data.templates.forEach((tpl) => {
    tpl.accentColor ||= "#0f766e";
    tpl.palette ||= "photo";
    if (!tpl.schemaVersion || tpl.schemaVersion < 3) {
      tpl.bgFront = svgDataUrl(photoStyleFrontSvg());
      tpl.bgBack = svgDataUrl(photoStyleBackSvg());
      tpl.elements = photoCardElements();
      tpl.palette = "photo";
      tpl.schemaVersion = 3;
      applyTemplatePalette(tpl, "photo");
    }
    tpl.elements ||= photoCardElements();
    ensureSplitNameFields(tpl);
    ensureBackOfficeFields(tpl);
    ensureChurchBackLayout(tpl, data);
    if (tpl.categoryId) {
      const cat = data.categories.find((item) => item.id === tpl.categoryId && item.orgId === tpl.orgId);
      if (cat && !cat.templateId) cat.templateId = tpl.id;
      if (cat) applyOrgTemplateDesign(tpl, cat, data);
    } else {
      applyOrgTemplateDesign(tpl, { id: "", orgId: tpl.orgId, name: tpl.name || "Modele" }, data);
    }
  });
  data.categories.forEach((cat) => {
    cat.templateId ||= "";
    if (!cat.validityMonths || cat.validityMonths < 240) cat.validityMonths = 240;
  });
  data.members.forEach((mem) => {
    mem.birthDate ||= "";
    mem.birthPlace ||= "";
    mem.nationality ||= "Congolaise";
    if (!mem.expiryDate || new Date(mem.expiryDate) < new Date(mem.issueDate || Date.now())) {
      mem.expiryDate = defaultExpiry(mem.categoryId, mem.issueDate);
    }
  });
  return data;
}

function ensureSplitNameFields(tpl) {
  tpl.elements.forEach((item) => {
    if (item.type === "fullName") item.label = "Nom";
  });
  const hasFirstName = tpl.elements.some((item) => item.type === "firstName" && item.face === "front");
  const nameField = tpl.elements.find((item) => item.type === "fullName" && item.face === "front");
  if (!hasFirstName && nameField) {
    const y = Math.min(nameField.y + nameField.h + 1, 100 - nameField.h);
    tpl.elements.push(el("firstName", "Prenom", nameField.x, y, nameField.w, nameField.h, "front", Math.max(6, Number(nameField.fontSize || 12) - 2), nameField.color, nameField.fontWeight, nameField.align));
  }
}

function ensureBackOfficeFields(tpl) {
  const fields = [
    el("email", "Email membre", 10.5, 63.6, 52, 6.2, "back", 10, "#2f2d32", "normal", "start"),
    el("status", "Statut", 72.5, 65.5, 18, 6.2, "back", 10, "#2f2d32", "bold", "center"),
    el("legalText", "Texte juridique", 10.3, 39.3, 53.8, 22.8, "back", 11, "#2f2d32", "normal", "start"),
    el("officeAddress", "Adresse siege", 10.5, 72.3, 55.6, 6.8, "back", 11, "#4b5563", "bold", "start"),
    el("officePhone", "Numero bureau", 10.5, 82.7, 42, 6.8, "back", 11, "#4b5563", "bold", "start")
  ];
  fields.forEach((field) => {
    if (!tpl.elements.some((item) => item.type === field.type && item.face === "back")) {
      tpl.elements.push(field);
    }
  });
}

function ensureChurchBackLayout(tpl, data = state) {
  const org = data.organizations.find((item) => item.id === tpl.orgId);
  if (!org || !/eglise|church/i.test(`${org.type} ${org.name}`)) return;
  if (tpl.churchBackLayoutVersion >= 1) return;
  const layout = {
    logoBack: { x: 7.5, y: 11.5, w: 17.5, h: 22.5, fontSize: 10, color: "#111827", fontWeight: "normal", align: "center" },
    organization: { x: 29, y: 11, w: 52, h: 8.5, fontSize: 15, color: "#0f6fa6", fontWeight: "bold", align: "start" },
    category: { x: 29, y: 22.5, w: 38, h: 6.2, fontSize: 10.5, color: "#2f2d32", fontWeight: "bold", align: "start" },
    role: { x: 29, y: 29.5, w: 39, h: 6.2, fontSize: 10.5, color: "#2f2d32", fontWeight: "bold", align: "start" },
    legalText: { x: 7.5, y: 43, w: 57, h: 18, fontSize: 9.5, color: "#2f2d32", fontWeight: "normal", align: "start" },
    email: { x: 7.5, y: 63.8, w: 56, h: 5.8, fontSize: 8.5, color: "#4b5563", fontWeight: "normal", align: "start" },
    officeAddress: { x: 7.5, y: 73.5, w: 58, h: 5.9, fontSize: 9.5, color: "#4b5563", fontWeight: "bold", align: "start" },
    officePhone: { x: 7.5, y: 82.7, w: 45, h: 5.9, fontSize: 9.5, color: "#4b5563", fontWeight: "bold", align: "start" },
    qr: { x: 72, y: 35, w: 18.5, h: 28.5, fontSize: 10, color: "#111827", fontWeight: "normal", align: "center" },
    status: { x: 71.8, y: 65.5, w: 19, h: 5.8, fontSize: 8.5, color: "#2f2d32", fontWeight: "bold", align: "center" }
  };
  Object.entries(layout).forEach(([type, values]) => {
    const item = tpl.elements.find((entry) => entry.type === type && entry.face === "back");
    if (!item) return;
    Object.assign(item, values);
  });
  tpl.churchBackLayoutVersion = 1;
}

function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function orderedFrontSvg(variant = "photo", style = {}) {
  const honor = variant === "ngoHonor";
  const standard = variant === "ngoStandard";
  const accent = style.accent || (honor ? "#b45309" : standard ? "#0f766e" : "#0f6fa6");
  const accent2 = style.accent2 || (honor ? "#7c2d12" : standard ? "#0284c7" : "#f97316");
  const accent3 = style.accent3 || (honor ? "#f59e0b" : standard ? "#22c55e" : "#14b8a6");
  const soft = style.soft || (honor ? "#fffbeb" : standard ? "#f0fdfa" : "#eff6ff");
  const line = style.line || (honor ? "#f59e0b" : standard ? "#14b8a6" : "#38bdf8");
  const motif = style.motif || 0;
  const offset = style.offset || 0;
  const angle = style.angle || 0;
  const mark = style.mark || "";
  const uniqueFront = `
    <g opacity=".2" transform="translate(${offset - 24} 0) rotate(${angle} 506 319)">
      ${motif === 0 ? `<circle cx="778" cy="312" r="92" fill="none" stroke="${accent}" stroke-width="18"/><circle cx="808" cy="312" r="44" fill="${accent3}" opacity=".45"/>` : ""}
      ${motif === 1 ? `<path d="M724 250 l96 -62 96 62 -96 62 Z" fill="${accent}"/><path d="M754 318 l66 -42 66 42 -66 42 Z" fill="${accent3}"/>` : ""}
      ${motif === 2 ? `<path d="M690 236 C790 176 870 196 948 260 C852 246 774 286 690 366 Z" fill="${accent}"/><path d="M716 390 C802 330 874 338 940 398 C846 386 778 424 716 488 Z" fill="${accent3}"/>` : ""}
      ${motif === 3 ? `<rect x="730" y="220" width="166" height="166" rx="34" fill="${accent}"/><rect x="776" y="266" width="166" height="166" rx="34" fill="${accent3}"/>` : ""}
      ${motif === 4 ? `<path d="M710 278 H930 M710 320 H930 M710 362 H930 M710 404 H930" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><path d="M760 250 H890 M760 432 H890" stroke="${accent3}" stroke-width="12" stroke-linecap="round"/>` : ""}
    </g>
    ${mark ? `<text x="894" y="566" font-family="Arial, sans-serif" font-size="46" font-weight="800" fill="${accent}" opacity=".14" text-anchor="middle">${mark}</text>` : ""}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${soft}"/></linearGradient>
      <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}"/><stop offset=".52" stop-color="${accent2}"/><stop offset="1" stop-color="${accent3}"/></linearGradient>
      <radialGradient id="shine" cx=".18" cy=".12" r=".9"><stop offset="0" stop-color="#ffffff" opacity=".9"/><stop offset=".45" stop-color="#ffffff" opacity=".18"/><stop offset="1" stop-color="#ffffff" opacity="0"/></radialGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0f172a" flood-opacity=".12"/></filter>
      <pattern id="grain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="5" cy="7" r=".8" fill="${accent}" opacity=".045"/><circle cx="18" cy="16" r=".7" fill="#0f172a" opacity=".035"/></pattern>
      <pattern id="slashes" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><rect width="8" height="46" fill="${accent2}" opacity=".055"/></pattern>
      <pattern id="micro" width="72" height="18" patternUnits="userSpaceOnUse"><path d="M0 9 H72" stroke="${accent}" stroke-opacity=".08" stroke-width="1"/><circle cx="12" cy="9" r="2" fill="${accent3}" opacity=".13"/></pattern>
    </defs>
    <rect width="1011" height="638" rx="34" fill="url(#paper)"/>
    <rect width="1011" height="638" rx="34" fill="url(#shine)"/>
    <rect width="1011" height="638" rx="34" fill="url(#grain)"/>
    <rect width="1011" height="638" rx="34" fill="url(#slashes)"/>
    <rect x="60" y="64" width="884" height="500" rx="20" fill="url(#micro)" opacity=".58"/>
    ${uniqueFront}
    <path d="M26 182 L140 70 H242 L26 286 Z" fill="${accent}" opacity=".16"/>
    <path d="M90 222 L248 64 H296 L90 270 Z" fill="${accent2}" opacity=".12"/>
    <path d="M742 598 L989 350 V438 L826 598 Z" fill="${accent3}" opacity=".18"/>
    <path d="M808 598 L989 418 V494 L884 598 Z" fill="${accent2}" opacity=".14"/>
    <path d="M676 0 H1011 V118 C908 92 812 58 676 0 Z" fill="url(#ribbon)" opacity=".9"/>
    <path d="M0 638 H420 C270 602 130 574 0 542 Z" fill="url(#ribbon)" opacity=".18"/>
    <circle cx="924" cy="118" r="52" fill="${accent3}" opacity=".18"/>
    <circle cx="928" cy="118" r="33" fill="none" stroke="#ffffff" stroke-width="5" opacity=".55"/>
    <path d="M890 160 C930 142 955 108 966 62" fill="none" stroke="#ffffff" stroke-width="6" opacity=".35"/>
    <path d="M620 82 C710 116 794 122 880 92" fill="none" stroke="#ffffff" stroke-width="5" opacity=".32"/>
    <path d="M642 102 C724 132 802 136 872 112" fill="none" stroke="#ffffff" stroke-width="2" opacity=".32"/>
    <g opacity=".28">
      <path d="M804 72 l28 22 -28 22 -28 -22 Z" fill="${accent}"/>
      <path d="M850 82 l20 16 -20 16 -20 -16 Z" fill="${accent3}"/>
      <path d="M896 64 l18 14 -18 14 -18 -14 Z" fill="#ffffff"/>
    </g>
    <rect x="22" y="22" width="967" height="18" rx="9" fill="url(#ribbon)" opacity=".95"/>
    <rect x="22" y="598" width="967" height="18" rx="9" fill="url(#ribbon)" opacity=".38"/>
    <rect x="46" y="64" width="10" height="468" rx="5" fill="url(#ribbon)" opacity=".55"/>
    <rect x="948" y="150" width="10" height="330" rx="5" fill="url(#ribbon)" opacity=".4"/>
    <path d="M368 58 C342 152 342 430 368 536" fill="none" stroke="${accent2}" stroke-width="2" opacity=".22"/>
    <path d="M396 58 C370 152 370 430 396 536" fill="none" stroke="${accent3}" stroke-width="2" opacity=".18"/>
    <g opacity=".5">
      <rect x="874" y="210" width="20" height="20" rx="5" fill="${accent}"/>
      <rect x="902" y="210" width="20" height="20" rx="5" fill="${accent2}"/>
      <rect x="874" y="238" width="20" height="20" rx="5" fill="${accent3}"/>
      <rect x="902" y="238" width="20" height="20" rx="5" fill="${accent}" opacity=".55"/>
    </g>
    <rect x="22" y="22" width="967" height="594" rx="28" fill="none" stroke="${line}" stroke-width="5"/>
    <rect x="46" y="46" width="919" height="546" rx="20" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="385" y1="52" x2="385" y2="548" stroke="${line}" stroke-width="4"/>
    <line x1="410" y1="178" x2="932" y2="178" stroke="${line}" stroke-width="4"/>
    <line x1="410" y1="438" x2="932" y2="438" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="410" y1="188" x2="932" y2="188" stroke="${accent2}" stroke-width="1.5" opacity=".42"/>
    <line x1="410" y1="428" x2="932" y2="428" stroke="${accent3}" stroke-width="1.5" opacity=".34"/>
    <rect x="70" y="106" width="262" height="292" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" filter="url(#softShadow)"/>
    <rect x="92" y="126" width="218" height="252" rx="17" fill="none" stroke="${accent}" stroke-width="2" opacity=".25"/>
    <path d="M70 106 H332 V126 H70 Z" fill="url(#ribbon)" opacity=".16"/>
    <path d="M70 378 H332 V398 H70 Z" fill="url(#ribbon)" opacity=".1"/>
    <rect x="70" y="438" width="262" height="82" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <path d="M72 438 H332 V452 H72 Z" fill="url(#ribbon)" opacity=".18"/>
    <rect x="410" y="58" width="124" height="94" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <path d="M426 76 H518 M426 94 H500 M426 112 H510" stroke="${accent}" stroke-width="3" opacity=".2" stroke-linecap="round"/>
    <circle cx="515" cy="134" r="11" fill="${accent3}" opacity=".22"/>
    <circle cx="515" cy="134" r="5" fill="${accent2}" opacity=".18"/>
    <path d="M410 458 H722 C710 482 710 506 722 530 H410 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" opacity=".96"/>
    <path d="M410 458 H722 C716 470 713 482 712 494 H410 Z" fill="url(#ribbon)" opacity=".08"/>
    <path d="M422 470 H704" stroke="${accent}" stroke-width="2" opacity=".18"/>
    <path d="M422 518 H704" stroke="${accent3}" stroke-width="2" opacity=".16"/>
    <rect x="742" y="454" width="138" height="76" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <rect x="886" y="454" width="46" height="76" rx="12" fill="url(#ribbon)" opacity=".16"/>
    <circle cx="909" cy="492" r="14" fill="${accent3}" opacity=".22"/>
    <circle cx="909" cy="492" r="7" fill="${accent2}" opacity=".18"/>
    <path d="M888 520 C902 508 920 508 934 520" fill="none" stroke="${accent}" stroke-width="2" opacity=".32"/>
    <rect x="86" y="560" width="836" height="34" rx="17" fill="url(#ribbon)" opacity=".14"/>
    <path d="M874 570 H918 M874 580 H906" stroke="#ffffff" stroke-width="4" opacity=".45" stroke-linecap="round"/>
    <path d="M88 570 H286" stroke="#ffffff" stroke-width="4" opacity=".26" stroke-linecap="round"/>
  </svg>`;
}

function orderedBackSvg(variant = "photo", style = {}) {
  const honor = variant === "ngoHonor";
  const standard = variant === "ngoStandard";
  const accent = style.accent || (honor ? "#b45309" : standard ? "#0f766e" : "#0f6fa6");
  const accent2 = style.accent2 || (honor ? "#7c2d12" : standard ? "#0284c7" : "#f97316");
  const accent3 = style.accent3 || (honor ? "#f59e0b" : standard ? "#22c55e" : "#14b8a6");
  const soft = style.soft || (honor ? "#fffbeb" : standard ? "#f0fdfa" : "#eff6ff");
  const line = style.line || (honor ? "#f59e0b" : standard ? "#14b8a6" : "#38bdf8");
  const motif = style.motif || 0;
  const offset = style.offset || 0;
  const angle = style.angle || 0;
  const mark = style.mark || "";
  const uniqueBack = `
    <g opacity=".18" transform="translate(${24 - offset} 0) rotate(${-angle} 506 319)">
      ${motif === 0 ? `<circle cx="352" cy="430" r="88" fill="none" stroke="${accent}" stroke-width="16"/><circle cx="384" cy="430" r="38" fill="${accent3}" opacity=".5"/>` : ""}
      ${motif === 1 ? `<path d="M258 410 l94 -58 94 58 -94 58 Z" fill="${accent}"/><path d="M304 494 l58 -36 58 36 -58 36 Z" fill="${accent3}"/>` : ""}
      ${motif === 2 ? `<path d="M220 372 C320 312 424 340 506 408 C396 394 316 430 220 528 Z" fill="${accent}"/><path d="M254 284 C330 246 426 260 486 318 C398 310 326 334 254 398 Z" fill="${accent3}"/>` : ""}
      ${motif === 3 ? `<rect x="274" y="336" width="158" height="158" rx="32" fill="${accent}"/><rect x="326" y="388" width="132" height="132" rx="28" fill="${accent3}"/>` : ""}
      ${motif === 4 ? `<path d="M228 352 H518 M228 394 H518 M228 436 H518 M228 478 H518" stroke="${accent}" stroke-width="16" stroke-linecap="round"/><path d="M270 320 H462 M270 510 H462" stroke="${accent3}" stroke-width="11" stroke-linecap="round"/>` : ""}
    </g>
    ${mark ? `<text x="178" y="562" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="${accent}" opacity=".12" text-anchor="middle">${mark}</text>` : ""}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${soft}"/></linearGradient>
      <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}"/><stop offset=".52" stop-color="${accent2}"/><stop offset="1" stop-color="${accent3}"/></linearGradient>
      <radialGradient id="shine" cx=".82" cy=".18" r=".85"><stop offset="0" stop-color="#ffffff" opacity=".85"/><stop offset=".5" stop-color="#ffffff" opacity=".16"/><stop offset="1" stop-color="#ffffff" opacity="0"/></radialGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0f172a" flood-opacity=".12"/></filter>
      <pattern id="grain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="5" cy="7" r=".8" fill="${accent}" opacity=".045"/><circle cx="18" cy="16" r=".7" fill="#0f172a" opacity=".035"/></pattern>
      <pattern id="slashes" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><rect width="8" height="46" fill="${accent2}" opacity=".05"/></pattern>
      <pattern id="micro" width="72" height="18" patternUnits="userSpaceOnUse"><path d="M0 9 H72" stroke="${accent}" stroke-opacity=".08" stroke-width="1"/><circle cx="12" cy="9" r="2" fill="${accent3}" opacity=".13"/></pattern>
    </defs>
    <rect width="1011" height="638" rx="34" fill="url(#paper)"/>
    <rect width="1011" height="638" rx="34" fill="url(#shine)"/>
    <rect width="1011" height="638" rx="34" fill="url(#grain)"/>
    <rect width="1011" height="638" rx="34" fill="url(#slashes)"/>
    <rect x="60" y="64" width="884" height="500" rx="20" fill="url(#micro)" opacity=".52"/>
    ${uniqueBack}
    <path d="M26 164 L160 30 H254 L26 258 Z" fill="${accent}" opacity=".14"/>
    <path d="M706 598 L989 316 V414 L806 598 Z" fill="${accent3}" opacity=".18"/>
    <path d="M790 598 L989 400 V490 L880 598 Z" fill="${accent2}" opacity=".14"/>
    <path d="M0 0 H314 C214 34 114 70 0 118 Z" fill="url(#ribbon)" opacity=".16"/>
    <path d="M690 638 H1011 V512 C900 558 804 594 690 638 Z" fill="url(#ribbon)" opacity=".28"/>
    <circle cx="904" cy="106" r="44" fill="${accent3}" opacity=".15"/>
    <circle cx="904" cy="106" r="26" fill="none" stroke="#ffffff" stroke-width="5" opacity=".55"/>
    <path d="M760 92 C816 124 878 132 946 100" fill="none" stroke="#ffffff" stroke-width="5" opacity=".28"/>
    <g opacity=".26">
      <path d="M790 76 l26 20 -26 20 -26 -20 Z" fill="${accent}"/>
      <path d="M836 88 l18 14 -18 14 -18 -14 Z" fill="${accent3}"/>
      <path d="M880 70 l18 14 -18 14 -18 -14 Z" fill="#ffffff"/>
    </g>
    <rect x="22" y="22" width="967" height="18" rx="9" fill="url(#ribbon)" opacity=".95"/>
    <rect x="22" y="598" width="967" height="18" rx="9" fill="url(#ribbon)" opacity=".38"/>
    <rect x="46" y="64" width="10" height="468" rx="5" fill="url(#ribbon)" opacity=".55"/>
    <rect x="948" y="150" width="10" height="330" rx="5" fill="url(#ribbon)" opacity=".4"/>
    <path d="M674 80 C704 170 704 420 674 530" fill="none" stroke="${accent2}" stroke-width="2" opacity=".2"/>
    <path d="M700 80 C730 170 730 420 700 530" fill="none" stroke="${accent3}" stroke-width="2" opacity=".16"/>
    <g opacity=".5">
      <rect x="820" y="142" width="20" height="20" rx="5" fill="${accent}"/>
      <rect x="848" y="142" width="20" height="20" rx="5" fill="${accent2}"/>
      <rect x="820" y="170" width="20" height="20" rx="5" fill="${accent3}"/>
      <rect x="848" y="170" width="20" height="20" rx="5" fill="${accent}" opacity=".55"/>
    </g>
    <rect x="22" y="22" width="967" height="594" rx="28" fill="none" stroke="${line}" stroke-width="5"/>
    <rect x="46" y="46" width="919" height="546" rx="20" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="70" y="92" width="184" height="150" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <rect x="92" y="112" width="140" height="110" rx="14" fill="none" stroke="${accent}" stroke-width="2" opacity=".24"/>
    <path d="M70 92 H254 V108 H70 Z" fill="url(#ribbon)" opacity=".14"/>
    <rect x="292" y="92" width="396" height="132" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <path d="M314 118 H652 M314 148 H610 M314 178 H636" stroke="${accent}" stroke-width="3" opacity=".16" stroke-linecap="round"/>
    <line x1="70" y1="280" x2="660" y2="280" stroke="${line}" stroke-width="4"/>
    <rect x="70" y="306" width="590" height="178" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <path d="M70 306 H660 V322 H70 Z" fill="url(#ribbon)" opacity=".1"/>
    <rect x="706" y="206" width="224" height="240" rx="26" fill="#ffffff" stroke="${line}" stroke-width="4" filter="url(#softShadow)"/>
    <rect x="744" y="246" width="148" height="148" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M722 222 H914 V430 H722 Z" fill="none" stroke="${accent2}" stroke-width="2" opacity=".18"/>
    <path d="M706 206 H930 V226 H706 Z" fill="url(#ribbon)" opacity=".16"/>
    <rect x="718" y="456" width="200" height="32" rx="16" fill="url(#ribbon)" opacity=".16"/>
    <rect x="70" y="502" width="590" height="64" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <rect x="86" y="560" width="836" height="34" rx="17" fill="url(#ribbon)" opacity=".14"/>
    <path d="M88 570 H286" stroke="#ffffff" stroke-width="4" opacity=".26" stroke-linecap="round"/>
    <path d="M790 570 H918 M790 580 H890" stroke="#ffffff" stroke-width="4" opacity=".45" stroke-linecap="round"/>
  </svg>`;
}

function photoStyleFrontSvg() {
  return orderedFrontSvg("photo");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f8dbb"/><stop offset="1" stop-color="#0d6fa2"/></linearGradient>
      <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ea580c"/></linearGradient>
      <pattern id="grain" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#f8f5ec"/><circle cx="3" cy="5" r=".7" fill="#111827" opacity=".035"/><circle cx="14" cy="12" r=".6" fill="#111827" opacity=".025"/></pattern>
    </defs>
    <rect width="1011" height="638" rx="34" fill="url(#grain)"/>
    <rect x="36" y="44" width="356" height="398" fill="url(#orange)" opacity=".96"/>
    <rect x="70" y="58" width="292" height="330" fill="#fff" stroke="#ea580c" stroke-width="3"/>
    <rect x="94" y="82" width="244" height="282" fill="#f3f4f6" stroke="#fb923c" stroke-width="2"/>
    <rect x="402" y="0" width="12" height="550" fill="#f97316"/>
    <rect x="432" y="143" width="520" height="416" rx="26" fill="#fff" opacity=".84" stroke="#eef2f7" stroke-width="2"/>
    <line x1="420" y1="120" x2="974" y2="120" stroke="#f97316" stroke-width="5"/>
    <line x1="420" y1="410" x2="974" y2="410" stroke="#f97316" stroke-width="4"/>
    <line x1="420" y1="500" x2="974" y2="500" stroke="#f97316" stroke-width="3"/>
    <rect x="506" y="35" width="118" height="106" rx="20" fill="#fff" stroke="#d7dce5" stroke-width="2"/>
    <circle cx="565" cy="88" r="38" fill="#0f8dbb" opacity=".16"/>
    <rect x="640" y="50" width="250" height="34" rx="17" fill="#0f8dbb" opacity=".22"/>
    <rect x="640" y="94" width="300" height="34" rx="17" fill="#0f8dbb" opacity=".22"/>
    <rect x="448" y="192" width="326" height="44" rx="9" fill="#f8fafc" stroke="#eef2f7"/>
    <rect x="448" y="270" width="242" height="44" rx="9" fill="#f8fafc" stroke="#eef2f7"/>
    <rect x="806" y="266" width="114" height="48" rx="9" fill="#f8fafc" stroke="#eef2f7"/>
    <rect x="448" y="348" width="205" height="42" rx="9" fill="#f8fafc" stroke="#eef2f7"/>
    <rect x="680" y="348" width="230" height="42" rx="9" fill="#f8fafc" stroke="#eef2f7"/>
    <rect x="448" y="430" width="374" height="50" rx="9" fill="#f8fafc" stroke="#eef2f7"/>
    <rect x="0" y="550" width="1011" height="88" fill="url(#blue)"/>
    <rect x="58" y="447" width="318" height="92" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
    <rect x="562" y="558" width="176" height="54" rx="11" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
    <rect x="752" y="561" width="206" height="40" rx="9" fill="#fff" opacity=".95"/>
  </svg>`;
}

function photoStyleBackSvg() {
  return orderedBackSvg("photo");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f8dbb"/><stop offset="1" stop-color="#0d6fa2"/></linearGradient>
      <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ea580c"/></linearGradient>
      <pattern id="grain" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#f8f5ec"/><circle cx="3" cy="5" r=".7" fill="#111827" opacity=".035"/><circle cx="14" cy="12" r=".6" fill="#111827" opacity=".025"/></pattern>
    </defs>
    <rect width="1011" height="638" rx="34" fill="url(#grain)"/>
    <rect x="0" y="0" width="1011" height="84" fill="url(#blue)"/>
    <rect x="0" y="554" width="1011" height="84" fill="url(#blue)"/>
    <rect x="42" y="116" width="184" height="136" rx="18" fill="#fff" stroke="#d1d5db" stroke-width="3"/>
    <rect x="260" y="104" width="440" height="104" rx="22" fill="#fff" opacity=".82" stroke="#e5e7eb" stroke-width="2"/>
    <rect x="286" y="125" width="390" height="30" rx="15" fill="#0f8dbb" opacity=".18"/>
    <rect x="286" y="169" width="340" height="24" rx="12" fill="#111827" opacity=".06"/>
    <line x1="42" y1="300" x2="650" y2="300" stroke="#f97316" stroke-width="4"/>
    <rect x="60" y="312" width="600" height="178" rx="20" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
    <rect x="712" y="226" width="186" height="186" rx="22" fill="#fff" stroke="#d1d5db" stroke-width="3"/>
    <rect x="742" y="265" width="110" height="110" rx="12" fill="#e5e7eb"/>
    <rect x="60" y="500" width="610" height="58" rx="15" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
    <line x1="60" y1="502" x2="900" y2="502" stroke="#f97316" stroke-width="4"/>
  </svg>`;
}

function ngoStandardFrontSvg() {
  return orderedFrontSvg("ngoStandard");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="main" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#065f46"/><stop offset=".58" stop-color="#0f766e"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient>
      <linearGradient id="soft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ecfdf5"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient>
      <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.4" fill="#ffffff" opacity=".16"/></pattern>
    </defs>
    <rect width="1011" height="638" rx="34" fill="#f8fafc"/>
    <rect width="1011" height="168" fill="url(#main)"/>
    <rect width="1011" height="168" fill="url(#dots)"/>
    <path d="M0 500 C210 430 358 560 560 498 C730 447 832 390 1011 430 L1011 638 L0 638 Z" fill="url(#main)" opacity=".92"/>
    <rect x="44" y="72" width="296" height="372" rx="28" fill="#ffffff" stroke="#d1fae5" stroke-width="5"/>
    <rect x="75" y="105" width="234" height="306" rx="22" fill="#eef2f7" stroke="#99f6e4" stroke-width="3"/>
    <rect x="385" y="112" width="556" height="348" rx="30" fill="#ffffff" stroke="#dbeafe" stroke-width="3"/>
    <rect x="418" y="148" width="116" height="94" rx="20" fill="#ffffff" stroke="#bae6fd" stroke-width="3"/>
    <rect x="558" y="148" width="330" height="28" rx="14" fill="#0f766e" opacity=".18"/>
    <rect x="558" y="192" width="270" height="22" rx="11" fill="#0ea5e9" opacity=".14"/>
    <rect x="420" y="270" width="368" height="42" rx="12" fill="url(#soft)" stroke="#ccfbf1"/>
    <rect x="420" y="344" width="258" height="40" rx="12" fill="#f8fafc" stroke="#dbeafe"/>
    <rect x="710" y="344" width="144" height="40" rx="12" fill="#f8fafc" stroke="#dbeafe"/>
    <rect x="420" y="418" width="404" height="42" rx="12" fill="#f8fafc" stroke="#dbeafe"/>
    <rect x="56" y="470" width="300" height="82" rx="18" fill="#ffffff" stroke="#d1fae5" stroke-width="3"/>
    <rect x="550" y="532" width="176" height="58" rx="16" fill="#ffffff" stroke="#ccfbf1" stroke-width="3"/>
    <rect x="750" y="542" width="210" height="38" rx="15" fill="#ffffff" opacity=".94"/>
  </svg>`;
}

function ngoStandardBackSvg() {
  return orderedBackSvg("ngoStandard");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="main" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#065f46"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient>
    </defs>
    <rect width="1011" height="638" rx="34" fill="#f8fafc"/>
    <rect width="1011" height="92" fill="url(#main)"/>
    <rect y="548" width="1011" height="90" fill="url(#main)"/>
    <rect x="56" y="124" width="178" height="134" rx="22" fill="#ffffff" stroke="#99f6e4" stroke-width="4"/>
    <rect x="280" y="120" width="420" height="94" rx="24" fill="#ffffff" stroke="#dbeafe" stroke-width="3"/>
    <rect x="304" y="144" width="346" height="28" rx="14" fill="#0f766e" opacity=".18"/>
    <rect x="304" y="184" width="292" height="20" rx="10" fill="#0ea5e9" opacity=".14"/>
    <rect x="58" y="314" width="602" height="184" rx="24" fill="#ffffff" stroke="#d1fae5" stroke-width="3"/>
    <rect x="716" y="226" width="190" height="190" rx="28" fill="#ffffff" stroke="#bae6fd" stroke-width="4"/>
    <rect x="752" y="262" width="118" height="118" rx="18" fill="#e5e7eb"/>
    <rect x="58" y="508" width="612" height="52" rx="18" fill="#ffffff" stroke="#d1fae5" stroke-width="3"/>
  </svg>`;
}

function ngoHonorFrontSvg() {
  return orderedFrontSvg("ngoHonor");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="black" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111827"/><stop offset="1" stop-color="#3f2e12"/></linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset=".55" stop-color="#d97706"/><stop offset="1" stop-color="#92400e"/></linearGradient>
      <radialGradient id="glow" cx=".18" cy=".2" r=".9"><stop offset="0" stop-color="#fef3c7" opacity=".45"/><stop offset="1" stop-color="#111827" opacity="0"/></radialGradient>
    </defs>
    <rect width="1011" height="638" rx="34" fill="url(#black)"/>
    <rect width="1011" height="638" rx="34" fill="url(#glow)"/>
    <path d="M0 96 L1011 0 L1011 132 L0 228 Z" fill="url(#gold)" opacity=".96"/>
    <path d="M0 546 C190 488 330 574 506 514 C686 452 820 468 1011 410 L1011 638 L0 638 Z" fill="url(#gold)" opacity=".92"/>
    <rect x="46" y="94" width="304" height="372" rx="30" fill="#fffaf0" stroke="#fbbf24" stroke-width="5"/>
    <rect x="79" y="128" width="238" height="304" rx="22" fill="#e5e7eb" stroke="#f59e0b" stroke-width="3"/>
    <rect x="388" y="128" width="560" height="350" rx="32" fill="#fffaf0" stroke="#fbbf24" stroke-width="3"/>
    <rect x="420" y="154" width="120" height="96" rx="22" fill="#ffffff" stroke="#f59e0b" stroke-width="3"/>
    <rect x="565" y="162" width="300" height="30" rx="15" fill="#d97706" opacity=".22"/>
    <rect x="565" y="208" width="250" height="22" rx="11" fill="#111827" opacity=".10"/>
    <rect x="424" y="280" width="390" height="44" rx="13" fill="#ffffff" stroke="#fcd34d"/>
    <rect x="424" y="354" width="260" height="42" rx="13" fill="#ffffff" stroke="#fcd34d"/>
    <rect x="716" y="354" width="144" height="42" rx="13" fill="#ffffff" stroke="#fcd34d"/>
    <rect x="424" y="428" width="410" height="42" rx="13" fill="#ffffff" stroke="#fcd34d"/>
    <rect x="58" y="486" width="304" height="82" rx="20" fill="#ffffff" stroke="#fbbf24" stroke-width="3"/>
    <rect x="552" y="536" width="178" height="58" rx="18" fill="#fffaf0" stroke="#fbbf24" stroke-width="3"/>
    <rect x="752" y="546" width="214" height="40" rx="16" fill="#111827" opacity=".18"/>
  </svg>`;
}

function ngoHonorBackSvg() {
  return orderedBackSvg("ngoHonor");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1011" height="638" viewBox="0 0 1011 638">
    <defs>
      <linearGradient id="black" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111827"/><stop offset="1" stop-color="#3f2e12"/></linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset=".6" stop-color="#d97706"/><stop offset="1" stop-color="#92400e"/></linearGradient>
    </defs>
    <rect width="1011" height="638" rx="34" fill="#fffaf0"/>
    <rect width="1011" height="104" fill="url(#black)"/>
    <rect y="548" width="1011" height="90" fill="url(#black)"/>
    <path d="M0 104 L1011 36 L1011 112 L0 180 Z" fill="url(#gold)" opacity=".92"/>
    <rect x="56" y="126" width="180" height="136" rx="24" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/>
    <rect x="282" y="126" width="430" height="98" rx="24" fill="#ffffff" stroke="#fbbf24" stroke-width="3"/>
    <rect x="306" y="152" width="346" height="28" rx="14" fill="#d97706" opacity=".20"/>
    <rect x="306" y="192" width="304" height="20" rx="10" fill="#111827" opacity=".10"/>
    <rect x="60" y="318" width="604" height="182" rx="24" fill="#ffffff" stroke="#fbbf24" stroke-width="3"/>
    <rect x="716" y="228" width="190" height="190" rx="28" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/>
    <rect x="752" y="264" width="118" height="118" rx="18" fill="#e5e7eb"/>
    <rect x="60" y="510" width="610" height="52" rx="18" fill="#ffffff" stroke="#fbbf24" stroke-width="3"/>
  </svg>`;
}

function applyTemplatePalette(tpl, palette = "photo") {
  tpl.palette = palette;
  const palettes = {
    photo: {
      text: "#111827",
      heading: "#0f172a",
      muted: "#334155",
      footer: "#111827",
      legal: "#111827"
    },
    dark: {
      text: "#111827",
      heading: "#0f172a",
      muted: "#334155",
      footer: "#111827",
      legal: "#111827"
    },
    light: {
      text: "#ffffff",
      heading: "#ffffff",
      muted: "#e5e7eb",
      footer: "#ffffff",
      legal: "#ffffff"
    }
  };
  const colors = palettes[palette] || palettes.photo;
  tpl.elements.forEach((item) => {
    if (["photo", "logo", "logoBack", "qr", "barcode", "signature"].includes(item.type)) return;
    if (["organization"].includes(item.type)) item.color = colors.heading;
    else if (["phone"].includes(item.type)) item.color = colors.footer;
    else if (["legalText"].includes(item.type)) item.color = colors.legal;
    else if (["officeAddress", "officePhone"].includes(item.type)) item.color = colors.muted;
    else item.color = colors.text;
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession() {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

function isSuperAdmin() {
  return session?.role === "superadmin";
}

function isOrgAdmin() {
  return session?.role === "orgadmin";
}

function visibleOrganizations() {
  if (isSuperAdmin()) return state.organizations;
  return state.organizations.filter((org) => org.id === session?.orgId);
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function activeOrg() {
  return state.organizations.find((org) => org.id === activeOrgId) || state.organizations[0];
}

function orgCategories(orgId = activeOrgId) {
  return state.categories.filter((cat) => cat.orgId === orgId);
}

function orgMembers(orgId = activeOrgId) {
  return state.members.filter((mem) => mem.orgId === orgId);
}

function orgTemplates(orgId = activeOrgId) {
  return state.templates.filter((tpl) => tpl.orgId === orgId);
}

function scopedMembers() {
  return isSuperAdmin() ? state.members : orgMembers();
}

function scopedCategories() {
  return isSuperAdmin() ? state.categories : orgCategories();
}

function scopedTemplates() {
  return isSuperAdmin() ? state.templates : orgTemplates();
}

function categoryName(id) {
  return state.categories.find((cat) => cat.id === id)?.name || "Sans categorie";
}

function templateName(id) {
  return state.templates.find((tpl) => tpl.id === id)?.name || "Modele par defaut";
}

function template() {
  return state.templates.find((tpl) => tpl.id === selectedTemplateId) || orgTemplates()[0] || state.templates[0];
}

function templateForMember(mem) {
  const cat = state.categories.find((item) => item.id === mem.categoryId);
  const assigned = state.templates.find((tpl) => tpl.id === cat?.templateId && tpl.orgId === mem.orgId);
  const org = state.organizations.find((item) => item.id === mem.orgId);
  const orgDefault = state.templates.find((tpl) => tpl.id === org?.defaultTemplateId && tpl.orgId === mem.orgId);
  return assigned || orgDefault || state.templates.find((tpl) => tpl.id === selectedTemplateId && tpl.orgId === mem.orgId) || orgTemplates(mem.orgId)[0] || state.templates[0];
}

function defaultTemplateForOrg(orgId = activeOrgId) {
  const org = state.organizations.find((item) => item.id === orgId);
  return state.templates.find((tpl) => tpl.id === org?.defaultTemplateId && tpl.orgId === orgId) || orgTemplates(orgId)[0];
}

function previewMember() {
  return state.members.find((mem) => mem.id === previewMemberId) || orgMembers()[0] || state.members[0];
}

function render() {
  if (!session) {
    app.innerHTML = renderLogin();
    bindLogin();
    return;
  }
  if (isOrgAdmin()) activeOrgId = session.orgId;
  if (isSuperAdmin() && view !== "organizations") view = "organizations";
  if (!isSuperAdmin() && view === "organizations") view = "dashboard";
  if (!activeOrgId && state.organizations[0]) activeOrgId = state.organizations[0].id;
  if (!selectedTemplateId && state.templates[0]) selectedTemplateId = state.templates[0].id;
  if (!previewMemberId && state.members[0]) previewMemberId = state.members[0].id;

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar no-print">
        <div class="brand-block">
          <div class="brand-title">Member Card Studio</div>
          <div class="brand-subtitle">Cartes PVC multi-organisations</div>
        </div>
        <nav class="nav">
          ${isSuperAdmin() ? navButton("organizations", "Organisations") : `
            ${navButton("dashboard", "Tableau de bord")}
            ${navButton("categories", "Categories")}
            ${navButton("members", "Membres")}
            ${navButton("templates", "Modeles")}
            ${navButton("generate", "Generation")}
            ${navButton("verify", "Verification")}
            ${navButton("settings", "Parametres")}
          `}
        </nav>
        <div class="sidebar-note">
          Les donnees sont sauvegardees dans ce navigateur. Le MVP peut ensuite etre branche a PostgreSQL, Prisma et un vrai backend.
        </div>
      </aside>
      <main class="main">
        <header class="topbar no-print">
          <div>
            <h1>${titleForView()}</h1>
          </div>
          <div class="session-bar">
            <span class="pill ${isSuperAdmin() ? "warn" : ""}">${isSuperAdmin() ? "Super admin" : esc(activeOrg()?.adminName || "Admin organisation")}</span>
            <span>${isSuperAdmin() ? "Gestion globale" : esc(activeOrg()?.name || "")}</span>
            <button data-action="logout">Deconnexion</button>
          </div>
        </header>
        <section class="workspace">
          ${renderView()}
        </section>
      </main>
    </div>
  `;
  bindEvents();
  scheduleTextFit();
}

function renderLogin() {
  return `
    <div class="login-page">
      <form class="login-panel" id="login-form">
        <div>
          <h1>Connexion securisee</h1>
          <p>Choisis le type d'acces. Le super admin gere tout le systeme. Un admin organisation ne voit que son organisation.</p>
        </div>
        <div class="login-mode">
          <button type="button" class="${loginMode === "organization" ? "active" : ""}" data-login-mode="organization">Organisation</button>
          <button type="button" class="${loginMode === "superadmin" ? "active" : ""}" data-login-mode="superadmin">Super admin</button>
        </div>
        ${loginMode === "organization" ? `
          <label>Organisation <select name="orgId" required>
            ${state.organizations.map((org) => `<option value="${org.id}">${esc(org.name)} - ${esc(org.type)}</option>`).join("")}
          </select></label>
          <label>Code PIN organisation <input name="pin" type="password" inputmode="numeric" placeholder="Ex: 1111" required /></label>
        ` : `
          <label>Code PIN super admin <input name="pin" type="password" inputmode="numeric" placeholder="Ex: 0000" required /></label>
        `}
        <button class="primary" type="submit">Se connecter</button>
        <div class="notice">
          Demo: super admin PIN 0000. Fondation Umoja PIN 1111. Eglise Lumiere Vivante PIN 2222.
        </div>
      </form>
      <div class="login-art">
        <strong>Gestion des cartes par organisation.</strong>
      </div>
    </div>
  `;
}

function navButton(id, label) {
  return `<button class="${view === id ? "active" : ""}" data-view="${id}">${label}</button>`;
}

function titleForView() {
  return {
    dashboard: "Tableau de bord",
    organizations: "Organisations",
    categories: "Categories de membres",
    members: "Membres",
    templates: "Editeur de modeles",
    generate: "Generation et impression",
    verify: "Verification QR"
    ,settings: "Parametres organisation"
  }[view];
}

function renderView() {
  if (isSuperAdmin()) return renderOrganizations();
  if (view === "organizations") return isSuperAdmin() ? renderOrganizations() : renderDashboard();
  if (view === "categories") return renderCategories();
  if (view === "members") return renderMembers();
  if (view === "templates") return renderTemplates();
  if (view === "generate") return renderGenerate();
  if (view === "verify") return renderVerify();
  if (view === "settings") return renderOrgSettings();
  return renderDashboard();
}

function renderDashboard() {
  const members = scopedMembers();
  const cards = isSuperAdmin() ? state.generatedCards.length : state.generatedCards.filter((card) => card.orgId === activeOrgId).length;
  const active = members.filter((m) => m.status === "active").length;
  const expired = members.filter((m) => new Date(m.expiryDate) < new Date()).length;
  const suspended = members.filter((m) => m.status === "suspended").length;
  const org = activeOrg();
  return `
    <div class="dashboard-hero">
      <div class="hero-band">
        <div>
          <h2>${esc(org?.name || "Organisation")}</h2>
          <p>Tableau de bord de gestion des membres, modeles, categories et cartes imprimables de cette organisation.</p>
        </div>
        <div class="hero-actions">
          <button data-view="members">Ajouter un membre</button>
          <button data-view="templates">Configurer les modeles</button>
          <button data-view="generate">Generer les cartes</button>
        </div>
      </div>
      <div class="panel">
        <h2>Etat rapide</h2>
        <div class="status-list" style="margin-top:.8rem">
          <div class="status-row"><span>Organisation</span><strong>${esc(org?.type || "")}</strong></div>
          <div class="status-row"><span>Admin</span><strong>${esc(org?.adminName || "")}</strong></div>
          <div class="status-row"><span>Modele par defaut</span><strong>${esc(templateName(org?.defaultTemplateId))}</strong></div>
        </div>
      </div>
    </div>
    <div class="metric-grid">
      ${metric("Membres", members.length)}
      ${metric("Cartes generees", cards)}
      ${metric("Cartes actives", active)}
      ${metric("Suspendues", suspended)}
    </div>
    <div class="quick-grid">
      <button class="quick-card" data-view="categories"><strong>Categories</strong><span>Definir les types de membres et leur modele de carte.</span></button>
      <button class="quick-card" data-view="members"><strong>Membres</strong><span>Ajouter, rechercher et preparer les membres a imprimer.</span></button>
      <button class="quick-card" data-view="generate"><strong>Impression</strong><span>Generer les cartes PVC recto-verso selon la categorie.</span></button>
    </div>
    <div class="grid-2">
      <div class="panel">
        <h2>Derniers membres</h2>
        ${memberTable(members.slice(-5).reverse())}
      </div>
      <div class="panel">
        <h2>Configuration</h2>
        <div class="status-list" style="margin-top:.8rem">
          <div class="status-row"><span>Categories</span><strong>${scopedCategories().length}</strong></div>
          <div class="status-row"><span>Modeles</span><strong>${scopedTemplates().length}</strong></div>
          <div class="status-row"><span>Cartes expirees</span><strong>${expired}</strong></div>
        </div>
      </div>
    </div>
  `;
}

function metric(label, value) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderOrganizations() {
  const rows = state.organizations.map((org) => `
    <tr>
      <td>${logoThumb(org.logo)} ${esc(org.name)}</td>
      <td>${esc(org.type)}</td>
      <td>${esc(org.prefix)}</td>
      <td>${esc(org.adminName || "")}</td>
      <td>${esc(templateName(org.defaultTemplateId))}</td>
      <td>${esc(org.phone)}</td>
      <td><span class="pill">${esc(org.status)}</span></td>
      <td>
        <div class="actions">
          <button type="button" data-action="edit-org" data-org-id="${org.id}">Modifier</button>
          <button type="button" class="danger" data-action="delete-org" data-org-id="${org.id}">Supprimer</button>
        </div>
      </td>
    </tr>
  `).join("");
  return `
    <div class="grid-2">
      <form class="panel form-grid" id="org-form">
        <div class="wide">
          <h2>Organisation</h2>
          <p>Seul le super admin cree et configure les organisations.</p>
        </div>
        <input type="hidden" name="id" value="" />
        <label>Nom <input name="name" required /></label>
        <label>Type <select name="type">
          <option>ONG</option><option>Eglise</option><option>Ecole</option><option>Parti politique</option><option>Association</option><option>Autre</option>
        </select></label>
        <label>Prefixe membre <input name="prefix" placeholder="EX: ONG" required /></label>
        <label>Admin organisation <input name="adminName" placeholder="Ex: Admin principal" /></label>
        <label>Code PIN <input name="pin" type="password" inputmode="numeric" placeholder="Ex: 1234" /></label>
        <label>Telephone <input name="phone" /></label>
        <label>Email <input name="email" type="email" /></label>
        <label>Adresse <input name="address" /></label>
        <label>Adresse siege <input name="officeAddress" /></label>
        <label>Numero bureau <input name="officePhone" /></label>
        <label class="wide">Texte juridique verso <textarea name="legalText"></textarea></label>
        <label class="wide">Modele par defaut <select name="defaultTemplateId">
          <option value="">Premier modele de cette organisation</option>
          ${state.templates.map((tpl) => `<option value="${tpl.id}">${esc(state.organizations.find((org) => org.id === tpl.orgId)?.name || "Organisation")} - ${esc(tpl.name)}</option>`).join("")}
        </select></label>
        <label>Logo <input name="logoFile" type="file" accept="image/*" /></label>
        <label>Logo arriere <input name="logoBackFile" type="file" accept="image/*" /></label>
        <label class="wide">Signature du responsable <input name="signatureFile" type="file" accept="image/*" /></label>
        <div class="actions wide">
          <button class="primary" type="button" data-action="save-org">Enregistrer</button>
          <button type="button" data-action="clear-org-form">Nouveau</button>
        </div>
      </form>
      <div class="panel">
        <div class="section-head">
          <div>
            <h2>Liste</h2>
            <p>${state.organizations.length} organisations configurees.</p>
          </div>
        </div>
        <div class="table-wrap"><table><thead><tr><th>Nom</th><th>Type</th><th>Prefixe</th><th>Admin</th><th>Modele defaut</th><th>Telephone</th><th>Statut</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      </div>
    </div>
  `;
}

function renderCategories() {
  const cats = orgCategories();
  const rows = cats.map((cat) => `
    <tr>
      <td><span style="display:inline-block;width:14px;height:14px;background:${esc(cat.color)};border-radius:50%;vertical-align:middle;margin-right:.4rem"></span>${esc(cat.name)}</td>
      <td>${cat.validityMonths} mois</td>
      <td>${esc(templateName(cat.templateId))}</td>
      <td><button type="button" data-action="edit-cat" data-cat-id="${cat.id}">Modifier</button></td>
    </tr>
  `).join("");
  return `
    <div class="grid-2">
      <form class="panel form-grid" id="category-form">
        <div class="wide">
          <h2>Categorie</h2>
          <p>Chaque organisation peut avoir ses propres categories et designs.</p>
        </div>
        <input type="hidden" name="id" value="" />
        <label class="wide">Nom <input name="name" required placeholder="Ex: Membre d'honneur" /></label>
        <label>Couleur <input name="color" type="color" value="#0f766e" /></label>
        <label>Validite <input name="validityMonths" type="number" min="1" value="240" /></label>
        <label class="wide">Modele de carte <select name="templateId">
          <option value="">Modele par defaut de l'organisation</option>
          ${orgTemplates().map((tpl) => `<option value="${tpl.id}">${esc(tpl.name)}</option>`).join("")}
        </select></label>
        <div class="notice wide">Cette association est propre a l'organisation active. Une autre organisation peut utiliser la meme categorie avec un autre modele.</div>
        <div class="actions wide">
          <button class="primary" type="button" data-action="save-cat">Enregistrer</button>
          <button type="button" data-action="clear-cat-form">Nouveau</button>
        </div>
      </form>
      <div class="panel">
        <h2>Categories de ${esc(activeOrg()?.name || "")}</h2>
        <div class="table-wrap"><table><thead><tr><th>Nom</th><th>Validite</th><th>Modele</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      </div>
    </div>
  `;
}

function renderMembers() {
  const rows = memberTable(orgMembers());
  const editing = orgMembers().find((mem) => mem.id === editingMemberId);
  const today = new Date().toISOString().slice(0, 10);
  return `
    <div class="grid-2">
      <form class="panel form-grid" id="member-form">
        <div class="wide">
          <h2>${editing ? "Modification membre" : "Membre"}</h2>
          <p>${editing ? `Tu modifies ${esc(editing.lastName)} ${esc(editing.firstName)}.` : "Saisie individuelle avec numero et code de verification uniques."}</p>
        </div>
        <input type="hidden" name="id" value="${esc(editing?.id || "")}" />
        ${editing ? `<div class="notice wide">Mode modification actif. Change les informations puis clique sur Mettre a jour le membre.</div>` : ""}
        <label>Nom <input name="lastName" required value="${esc(editing?.lastName || "")}" /></label>
        <label>Prenom <input name="firstName" required value="${esc(editing?.firstName || "")}" /></label>
        <label>Sexe <select name="gender">
          ${["F", "M", "Autre"].map((value) => `<option value="${value}" ${(editing?.gender || "F") === value ? "selected" : ""}>${value}</option>`).join("")}
        </select></label>
        <label>Categorie <select name="categoryId" required>${orgCategories().map((cat) => `<option value="${cat.id}" ${cat.id === editing?.categoryId ? "selected" : ""}>${esc(cat.name)}</option>`).join("")}</select></label>
        <label>Date naissance <input name="birthDate" type="date" value="${esc(editing?.birthDate || "")}" /></label>
        <label>Lieu naissance <input name="birthPlace" value="${esc(editing?.birthPlace || "")}" /></label>
        <label>Nationalite <input name="nationality" value="${esc(editing?.nationality || "Congolaise")}" /></label>
        <label>Fonction <input name="role" placeholder="Ex: Pasteur provincial" value="${esc(editing?.role || "")}" /></label>
        <label>Telephone <input name="phone" value="${esc(editing?.phone || "")}" /></label>
        <label>Email <input name="email" type="email" value="${esc(editing?.email || "")}" /></label>
        <label>Numero membre <input name="memberNo" placeholder="Auto si vide" value="${esc(editing?.memberNo || "")}" /></label>
        <label>Date emission <input name="issueDate" type="date" value="${esc(editing?.issueDate || today)}" /></label>
        <label>Date expiration <input name="expiryDate" type="date" value="${esc(editing?.expiryDate || "")}" /></label>
        <label>Statut <select name="status">
          ${["active", "suspended", "expired"].map((value) => `<option value="${value}" ${(editing?.status || "active") === value ? "selected" : ""}>${value}</option>`).join("")}
        </select></label>
        <label>Photo <input name="photoFile" type="file" accept="image/*" /></label>
        <label class="wide">Adresse <input name="address" value="${esc(editing?.address || "")}" /></label>
        <div class="actions wide">
          <button class="primary" type="button" data-action="save-member">${editing ? "Mettre a jour le membre" : "Enregistrer"}</button>
          <button type="button" data-action="clear-member-form">Nouveau</button>
        </div>
      </form>
      <div class="panel">
        <div class="section-head">
          <div>
            <h2>Membres de ${esc(activeOrg()?.name || "")}</h2>
            <p>Import CSV: nom, prenom, fonction, telephone.</p>
          </div>
        </div>
        <div class="import-box" style="margin:.8rem 0">
          <input type="file" accept=".csv,text/csv" data-action="import-csv" />
        </div>
        ${rows}
      </div>
    </div>
  `;
}

function memberTable(members) {
  const rows = members.map((mem) => `
    <tr>
      <td>${mem.photo ? `<img class="avatar" src="${mem.photo}" alt="">` : `<span class="avatar" style="display:inline-block"></span>`}</td>
      <td>${esc(mem.lastName)} ${esc(mem.firstName)}</td>
      <td>${esc(mem.memberNo)}</td>
      <td>${esc(categoryName(mem.categoryId))}</td>
      <td>${esc(mem.role)}</td>
      <td><span class="pill ${mem.status === "suspended" ? "danger" : ""}">${esc(mem.status)}</span></td>
      <td>
        <div class="actions compact-actions">
          <button type="button" data-action="edit-member" data-member-id="${mem.id}">Modifier</button>
          <button type="button" class="danger" data-action="delete-member" data-member-id="${mem.id}">Supprimer</button>
        </div>
      </td>
    </tr>
    ${editingMemberId === mem.id ? renderMemberEditRow(mem) : ""}
  `).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Photo</th><th>Nom</th><th>Numero</th><th>Categorie</th><th>Fonction</th><th>Statut</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderMemberEditRow(mem) {
  return `
    <tr class="member-edit-row">
      <td colspan="7">
        <div class="inline-edit-form" data-member-edit-form="${mem.id}">
          <input type="hidden" name="id" value="${esc(mem.id)}" />
          <div class="inline-edit-head">
            <strong>Modification de ${esc(mem.lastName)} ${esc(mem.firstName)}</strong>
            <span>Change les informations ici puis enregistre.</span>
          </div>
          <div class="inline-edit-grid">
            <label>Nom <input name="lastName" required value="${esc(mem.lastName || "")}" /></label>
            <label>Prenom <input name="firstName" required value="${esc(mem.firstName || "")}" /></label>
            <label>Sexe <select name="gender">${["F", "M", "Autre"].map((value) => `<option value="${value}" ${(mem.gender || "F") === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
            <label>Categorie <select name="categoryId" required>${orgCategories().map((cat) => `<option value="${cat.id}" ${cat.id === mem.categoryId ? "selected" : ""}>${esc(cat.name)}</option>`).join("")}</select></label>
            <label>Date naissance <input name="birthDate" type="date" value="${esc(mem.birthDate || "")}" /></label>
            <label>Lieu naissance <input name="birthPlace" value="${esc(mem.birthPlace || "")}" /></label>
            <label>Nationalite <input name="nationality" value="${esc(mem.nationality || "Congolaise")}" /></label>
            <label>Fonction <input name="role" value="${esc(mem.role || "")}" /></label>
            <label>Telephone <input name="phone" value="${esc(mem.phone || "")}" /></label>
            <label>Email <input name="email" type="email" value="${esc(mem.email || "")}" /></label>
            <label>Numero membre <input name="memberNo" value="${esc(mem.memberNo || "")}" /></label>
            <label>Date emission <input name="issueDate" type="date" value="${esc(mem.issueDate || "")}" /></label>
            <label>Date expiration <input name="expiryDate" type="date" value="${esc(mem.expiryDate || "")}" /></label>
            <label>Statut <select name="status">${["active", "suspended", "expired"].map((value) => `<option value="${value}" ${(mem.status || "active") === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>
            <label>Photo <input name="photoFile" type="file" accept="image/*" /></label>
            <label class="wide">Adresse <input name="address" value="${esc(mem.address || "")}" /></label>
          </div>
          <div class="actions">
            <button class="primary" type="button" data-action="save-member-edit" data-member-id="${mem.id}">Enregistrer les modifications</button>
            <button type="button" data-action="cancel-member-edit">Fermer</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function renderTemplates() {
  const tpl = template();
  if (!tpl) return `<div class="empty-state">Cree d'abord une organisation et un modele.</div>`;
  const member = previewMember();
  const faceElements = tpl.elements.filter((item) => item.face === activeFace);
  const selectedElement = faceElements.find((item) => item.id === selectedElementId);
  return `
    <div class="template-designer">
      <div class="panel">
        <h2>Configuration automatique</h2>
        <p>Choisis le modele, sa categorie et applique le placement automatique inspire de la carte reference.</p>
        <div class="template-actions" style="margin-top:.8rem">
          <label>Modele <select data-action="select-template">${orgTemplates().map((item) => `<option value="${item.id}" ${item.id === tpl.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select></label>
          <button class="primary" data-action="new-template">Nouveau modele PVC</button>
          <label>Nom <input data-template-field="name" value="${esc(tpl.name)}" /></label>
          <label>Categorie du modele <select data-template-field="categoryId">
            <option value="">Aucune categorie precise</option>
            ${orgCategories().map((cat) => `<option value="${cat.id}" ${cat.id === tpl.categoryId ? "selected" : ""}>${esc(cat.name)}</option>`).join("")}
          </select></label>
          <div class="actions">
            <button type="button" data-template-preset="standard">Associer Standard</button>
            <button type="button" data-template-preset="honor">Associer Honneur</button>
          </div>
          <button class="primary" data-action="apply-photo-card-preset">Appliquer modele photo + placement auto</button>
          <button type="button" data-action="ensure-org-models">Creer les modeles requis pour cette organisation</button>
          <label>Palette des textes <select data-action="template-palette">
            <option value="photo" ${tpl.palette === "photo" || !tpl.palette ? "selected" : ""}>Couleurs du modele photo</option>
            <option value="dark" ${tpl.palette === "dark" ? "selected" : ""}>Texte sombre</option>
            <option value="light" ${tpl.palette === "light" ? "selected" : ""}>Texte clair</option>
          </select></label>
          <label>Fond recto image/PDF <input type="file" accept="image/*,application/pdf" data-bg-upload="front" /></label>
          <label>Fond verso image/PDF <input type="file" accept="image/*,application/pdf" data-bg-upload="back" /></label>
          <div class="notice">Le placement automatique installe photo, logo, informations, code-barres ID, signature, expiration et QR verso. Utilise la correction manuelle seulement si un champ tombe mal sur ton modele.</div>
        </div>
        <div class="template-adjuster">
          <h3>Correction manuelle</h3>
          <label>Champ a ajuster <select data-action="select-template-element">
            <option value="">Choisir un champ</option>
            ${faceElements.map((item) => `<option value="${item.id}" ${item.id === selectedElementId ? "selected" : ""}>${esc(item.label)}</option>`).join("")}
          </select></label>
          ${selectedElement ? renderTemplateAdjuster(selectedElement) : `<div class="notice">Selectionne un champ du ${activeFace === "front" ? "recto" : "verso"} pour regler sa position et la taille du texte.</div>`}
        </div>
      </div>
      <div class="panel card-stage">
        <div class="section-head" style="width:100%">
          <div>
            <h2>Apercu du modele</h2>
            <p>Le placement applique ici sera reutilise automatiquement pendant la generation.</p>
          </div>
          <select data-action="preview-member">
            ${orgMembers().map((mem) => `<option value="${mem.id}" ${member?.id === mem.id ? "selected" : ""}>${esc(mem.lastName)} ${esc(mem.firstName)}</option>`).join("")}
          </select>
        </div>
        <div class="face-tabs">
          <button class="${activeFace === "front" ? "active" : ""}" data-face="front">Recto</button>
          <button class="${activeFace === "back" ? "active" : ""}" data-face="back">Verso</button>
        </div>
        ${renderCard(tpl, member, activeFace, true)}
      </div>
    </div>
  `;
}

function renderTemplateAdjuster(element) {
  return `
    <label>Libelle <input data-template-adjust-field="label" value="${esc(element.label)}" /></label>
    <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:.55rem">
      <label>X % <input data-template-adjust-field="x" type="number" min="0" max="100" step="0.1" value="${element.x}" /></label>
      <label>Y % <input data-template-adjust-field="y" type="number" min="0" max="100" step="0.1" value="${element.y}" /></label>
      <label>Largeur % <input data-template-adjust-field="w" type="number" min="1" max="100" step="0.1" value="${element.w}" /></label>
      <label>Hauteur % <input data-template-adjust-field="h" type="number" min="1" max="100" step="0.1" value="${element.h}" /></label>
    </div>
    <label>Taille texte max <input data-template-adjust-field="fontSize" type="number" min="6" max="42" value="${element.fontSize}" /></label>
    <label>Couleur <input data-template-adjust-field="color" type="color" value="${esc(element.color)}" /></label>
    <label>Graisse <select data-template-adjust-field="fontWeight"><option ${element.fontWeight === "normal" ? "selected" : ""}>normal</option><option ${element.fontWeight === "bold" ? "selected" : ""}>bold</option></select></label>
    <label>Alignement <select data-template-adjust-field="align"><option value="start" ${element.align === "start" ? "selected" : ""}>gauche</option><option value="center" ${element.align === "center" ? "selected" : ""}>centre</option><option value="end" ${element.align === "end" ? "selected" : ""}>droite</option></select></label>
    <div class="notice">La taille choisie est une taille maximum. A l'impression, le systeme reduit automatiquement le texte si le contenu est trop long pour son emplacement.</div>
  `;
}

function renderGenerate() {
  const members = orgMembers();
  const printable = members.filter((mem) => generatedSelection.has(mem.id));
  return `
    <div class="grid-2 no-print">
      <div class="panel">
        <h2>Selection des cartes</h2>
        <p>Choisis les membres a imprimer. Le systeme prend automatiquement le modele de leur organisation et de leur categorie.</p>
        <label style="margin-top:.8rem">Modele par defaut de l'organisation <select data-action="org-default-template">${orgTemplates().map((item) => `<option value="${item.id}" ${item.id === defaultTemplateForOrg()?.id ? "selected" : ""}>${esc(item.name)}</option>`).join("")}</select></label>
        <div class="tool-list" style="margin-top:.8rem">
          ${members.map((mem) => `
            <label style="display:flex;grid-template-columns:auto 1fr;gap:.5rem;align-items:center;font-weight:500">
              <input style="width:auto" type="checkbox" data-print-member="${mem.id}" ${generatedSelection.has(mem.id) ? "checked" : ""}>
              ${esc(mem.lastName)} ${esc(mem.firstName)} - ${esc(categoryName(mem.categoryId))} - ${esc(templateForMember(mem)?.name || "Modele par defaut")}
            </label>
          `).join("")}
        </div>
        <div class="actions" style="margin-top:.9rem">
          <button type="button" class="primary" data-action="print-cards">Telecharger PDF / imprimer</button>
          <button type="button" data-action="download-card-image">Telecharger image recto-verso</button>
          <button type="button" data-action="select-all-print">Tout selectionner</button>
          <button type="button" data-action="clear-print">Vider</button>
        </div>
      </div>
      <div class="panel">
        <h2>Conseil impression</h2>
        <div class="notice" style="margin-top:.8rem">Dans la fenetre d'impression, choisis A4, echelle 100 %, marges par defaut ou minimales. Pour une imprimante PVC, utilise une carte par page ou adapte le pilote a 85.6 x 54 mm.</div>
      </div>
    </div>
    <div class="panel">
      <div class="section-head no-print">
        <div>
          <h2>Apercu imprimable</h2>
          <p>${printable.length} carte(s) selectionnee(s). Chaque membre utilise le modele associe a son organisation et a sa categorie.</p>
        </div>
      </div>
      <div class="print-sheet">
        ${printable.map((mem) => `${renderCard(templateForMember(mem), mem, "front", false, true)}${renderCard(templateForMember(mem), mem, "back", false, true)}`).join("")}
      </div>
    </div>
  `;
}

function renderVerify() {
  const query = window.currentVerifyQuery || "";
  const found = query ? state.members.find((mem) => mem.cardUid === query || mem.memberNo === query) : null;
  return `
    <div class="grid-2">
      <div class="panel">
        <h2>Verification publique</h2>
        <p>Le QR code peut pointer vers une page publique de ce type. Ici tu peux tester avec le code unique du membre.</p>
        <label style="margin-top:.8rem">Code carte ou numero membre <input data-action="verify-input" value="${esc(query)}" placeholder="Ex: CARD_..." /></label>
      </div>
      <div class="panel">
        <h2>Resultat</h2>
        ${found ? verifyResult(found) : `<div class="empty-state">Aucune carte chargee pour le moment.</div>`}
      </div>
    </div>
  `;
}

function renderOrgSettings() {
  const org = activeOrg();
  return `
    <div class="grid-2">
      <form class="panel form-grid" id="settings-form">
        <div class="wide">
          <h2>Parametres de ${esc(org?.name || "l'organisation")}</h2>
          <p>Ces informations peuvent etre imprimees au verso des cartes et modifiees par l'admin de l'organisation.</p>
        </div>
        <label>Telephone general <input name="phone" value="${esc(org?.phone || "")}" /></label>
        <label>Email <input name="email" type="email" value="${esc(org?.email || "")}" /></label>
        <label class="wide">Adresse principale <input name="address" value="${esc(org?.address || "")}" /></label>
        <label class="wide">Adresse du siege <input name="officeAddress" value="${esc(org?.officeAddress || "")}" /></label>
        <label>Numero du bureau <input name="officePhone" value="${esc(org?.officePhone || "")}" /></label>
        <label>Modele par defaut <select name="defaultTemplateId">
          <option value="">Premier modele de cette organisation</option>
          ${orgTemplates().map((tpl) => `<option value="${tpl.id}" ${tpl.id === org?.defaultTemplateId ? "selected" : ""}>${esc(tpl.name)}</option>`).join("")}
        </select></label>
        <label class="wide">Texte juridique du verso <textarea name="legalText">${esc(org?.legalText || "")}</textarea></label>
        <label>Logo principal <input name="logoFile" type="file" accept="image/*" /></label>
        <label>Logo arriere <input name="logoBackFile" type="file" accept="image/*" /></label>
        <label class="wide">Signature du responsable <input name="signatureFile" type="file" accept="image/*" /></label>
        <div class="actions wide">
          <button class="primary" type="button" data-action="save-settings">Enregistrer les parametres</button>
        </div>
      </form>
      <div class="panel">
        <h2>Apercu des donnees verso</h2>
        <div class="status-list" style="margin-top:.8rem">
          <div class="status-row"><span>Adresse siege</span><strong>${esc(org?.officeAddress || "")}</strong></div>
          <div class="status-row"><span>Numero bureau</span><strong>${esc(org?.officePhone || "")}</strong></div>
          <div class="status-row"><span>Modele defaut</span><strong>${esc(templateName(org?.defaultTemplateId))}</strong></div>
        </div>
        <div class="notice" style="margin-top:.9rem">${esc(org?.legalText || "")}</div>
      </div>
    </div>
  `;
}

function verifyResult(mem) {
  const org = state.organizations.find((item) => item.id === mem.orgId);
  const expired = new Date(mem.expiryDate) < new Date();
  return `
    <div class="grid-2" style="grid-template-columns:120px 1fr">
      <div>${mem.photo ? `<img src="${mem.photo}" alt="" style="width:110px;height:110px;object-fit:cover;border-radius:8px;border:1px solid var(--line)">` : `<div class="empty-state">Photo</div>`}</div>
      <div>
        <h2>${esc(mem.lastName)} ${esc(mem.firstName)}</h2>
        <p>${esc(org?.name || "")}</p>
        <p>${esc(categoryName(mem.categoryId))} - ${esc(mem.role)}</p>
        <p>Numero: <strong>${esc(mem.memberNo)}</strong></p>
        <p>Expiration: ${esc(mem.expiryDate)}</p>
        <span class="pill ${mem.status !== "active" || expired ? "danger" : ""}">${expired ? "expired" : esc(mem.status)}</span>
      </div>
    </div>
  `;
}

function renderCard(tpl, mem, face, editable = false, print = false) {
  if (!tpl || !mem) return `<div class="empty-state">Aucun modele ou membre disponible.</div>`;
  const bg = face === "front" ? tpl.bgFront : tpl.bgBack;
  const className = print ? "print-card" : "card-canvas";
  const elements = tpl.elements.filter((item) => item.face === face).map((item) => renderElement(item, mem, editable)).join("");
  return `
    <div class="${className}" data-card-canvas="${editable ? "true" : "false"}" style="--card-accent:${esc(tpl.accentColor || "#0f766e")}">
      <div class="card-bg ${bg ? "" : "fallback-bg"}">${bg && bg.startsWith("data:image") ? `<img src="${bg}" alt="">` : ""}</div>
      ${elements}
    </div>
  `;
}

function renderElement(item, mem, editable) {
  const selected = editable && item.id === selectedElementId ? "selected" : "";
  const fontSize = autoFontSize(item, mem);
  const style = `left:${item.x}%;top:${item.y}%;width:${item.w}%;height:${item.h}%;font-size:${fontSize}px;color:${item.color};font-weight:${item.fontWeight};justify-items:${item.align};text-align:${item.align === "start" ? "left" : item.align === "end" ? "right" : "center"};`;
  const fitAttrs = isTextElement(item) ? `data-auto-text="true" data-min-font="${item.type === "legalText" ? "3.4" : ["organization", "address", "email", "officeAddress"].includes(item.type) ? "4.2" : "4.6"}"` : "";
  return `<div class="element ${item.type} ${selected}" style="${style}" data-element-id="${item.id}" ${fitAttrs}>${elementContent(item, mem)}</div>`;
}

function textValueForElement(item, mem) {
  const org = state.organizations.find((entry) => entry.id === mem.orgId) || activeOrg();
  const data = {
    fullName: mem.lastName,
    firstName: mem.firstName,
    lastName: mem.lastName,
    gender: mem.gender,
    birthDate: mem.birthDate,
    birthPlace: mem.birthPlace,
    nationality: mem.nationality,
    memberNo: mem.memberNo,
    category: categoryName(mem.categoryId),
    role: mem.role,
    issueDate: mem.issueDate,
    expiryDate: mem.expiryDate,
    status: mem.status,
    organization: org?.name || "",
    phone: mem.phone || org?.phone || "",
    email: mem.email || org?.email || "",
    address: mem.address || org?.address || "",
    officeAddress: org?.officeAddress || org?.address || "",
    officePhone: org?.officePhone || org?.phone || "",
    legalText: org?.legalText || ""
  };
  return data[item.type] || item.label;
}

function isTextElement(item) {
  return !["photo", "logo", "logoBack", "signature", "barcode", "qr"].includes(item.type);
}

function autoFontSize(item, mem) {
  if (!isTextElement(item)) return item.fontSize;
  const text = String(textValueForElement(item, mem) || "").trim();
  if (!text) return item.fontSize;
  const rawBase = Number(item.fontSize || 12);
  const min = item.type === "legalText" ? 4.2 : ["organization", "address", "officeAddress", "email"].includes(item.type) ? 4.4 : 4.8;
  const boxWidth = Math.max(12, (Number(item.w) / 100) * 856);
  const boxHeight = Math.max(8, (Number(item.h) / 100) * 540);
  const hardLines = text.split(/\n+/);
  const densityScale = item.type === "organization" ? 0.62 : item.type === "legalText" ? 0.7 : ["address", "officeAddress", "email"].includes(item.type) ? 0.66 : 0.7;
  const heightCap = Math.max(min, boxHeight * (item.type === "legalText" ? 0.16 : 0.42));
  const base = Math.min(rawBase * densityScale, heightCap);

  for (let size = base; size >= min; size -= 0.25) {
    const averageCharWidth = size * (item.fontWeight === "bold" ? 0.64 : 0.58);
    const charsPerLine = Math.max(4, Math.floor(boxWidth / averageCharWidth));
    const lines = hardLines.reduce((sum, line) => {
      const words = line.split(/\s+/).filter(Boolean);
      if (!words.length) return sum + 1;
      let count = 1;
      let current = 0;
      words.forEach((word) => {
        const next = current ? current + word.length + 1 : word.length;
        if (next > charsPerLine) {
          count += 1;
          current = word.length;
        } else {
          current = next;
        }
      });
      return sum + count;
    }, 0);
    const longestWord = Math.max(...text.split(/\s+/).map((word) => word.length), 1);
    const fitsWidth = longestWord * averageCharWidth <= boxWidth - 2;
    const fitsHeight = lines * size * 1.03 <= boxHeight - 2;
    if (fitsWidth && fitsHeight) return Number(size.toFixed(1));
  }
  return min;
}

function elementContent(item, mem) {
  const org = state.organizations.find((entry) => entry.id === mem.orgId) || activeOrg();
  if (item.type === "photo") return mem.photo ? `<img class="member-photo" src="${mem.photo}" alt="">` : `<span>Photo</span>`;
  if (item.type === "logo") return org?.logo ? `<img src="${org.logo}" alt="">` : `<span>Logo</span>`;
  if (item.type === "logoBack") return org?.logoBack || org?.logo ? `<img src="${org.logoBack || org.logo}" alt="">` : `<span>Logo</span>`;
  if (item.type === "signature") return org?.signature ? `<img src="${org.signature}" alt="">` : `<span>Signature</span>`;
  if (item.type === "barcode") return `<img class="barcode-img" src="${barcodeUrl(mem.memberNo)}" alt="Code-barres">`;
  if (item.type === "qr") return `<img class="qr-img" src="${qrUrl(mem)}" alt="QR">`;
  return esc(textValueForElement(item, mem));
}

function scheduleTextFit() {
  requestAnimationFrame(() => {
    fitCardTextElements();
    requestAnimationFrame(fitCardTextElements);
  });
}

function fitCardTextElements(root = document) {
  root.querySelectorAll(".element[data-auto-text='true']").forEach((node) => {
    const max = Number.parseFloat(node.style.fontSize || "12");
    const min = Number.parseFloat(node.dataset.minFont || "4");
    let size = max;
    node.style.fontSize = `${size}px`;
    node.style.lineHeight = "1";
    node.style.whiteSpace = "pre-wrap";
    node.style.overflowWrap = "anywhere";
    node.style.wordBreak = "normal";

    let guard = 0;
    while (textOverflows(node) && size > min && guard < 80) {
      size = Math.max(min, size - 0.35);
      node.style.fontSize = `${size.toFixed(2)}px`;
      guard += 1;
    }
  });
}

function textOverflows(node) {
  return node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1;
}

function qrUrl(mem) {
  const payload = `${location.origin}${location.pathname}#verify=${encodeURIComponent(mem.cardUid)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`;
}

function barcodeUrl(value) {
  return svgDataUrl(code39BarcodeSvg(value || "ID-0000"));
}

function exportCardCss() {
  return `
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,Arial,sans-serif;background:#fff;color:#111827}
    .export-row{display:flex;gap:50px;align-items:flex-start;margin-bottom:72px}
    .export-label{font-size:22px;font-weight:700;margin:0 0 14px;color:#111827}
    .print-card{width:856px;height:540px;background:#fff;border-radius:14px;border:1px solid #a9b3c4;overflow:hidden;position:relative}
    .card-bg,.card-bg img{position:absolute;inset:0;width:100%;height:100%}
    .card-bg img{object-fit:cover}
    .fallback-bg{background:linear-gradient(120deg,#0f766e,#111827)}
    .element{position:absolute;border:1px dashed transparent;display:grid;align-items:center;justify-items:start;overflow:hidden;line-height:1.02;padding:1px 2px;white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal}
    .element img{width:100%;height:100%;object-fit:cover}
    .element.signature img,.element.logo img,.element.logoBack img{object-fit:contain}
    .member-photo{border-radius:50%}
    .qr-img{image-rendering:pixelated;background:#fff}
  `;
}

function downloadTextFile(filename, mime, content) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function xmlReady(html) {
  return html.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#[0-9]+;|#x[0-9a-f]+;)/gi, "&amp;");
}

function downloadSelectedCardImage() {
  const members = orgMembers().filter((mem) => generatedSelection.has(mem.id));
  if (!members.length) {
    window.alert("Selectionne au moins un membre avant de telecharger l'image.");
    return;
  }
  const width = 1812;
  const rowHeight = 650;
  const height = Math.max(rowHeight, members.length * rowHeight);
  const rows = members.map((mem, index) => {
    const tpl = templateForMember(mem);
    const y = index * rowHeight;
    return `
      <foreignObject x="0" y="${y}" width="${width}" height="${rowHeight}">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${exportCardCss()}</style>
          <p class="export-label">${esc(mem.lastName)} ${esc(mem.firstName)} - recto / verso</p>
          <div class="export-row">
            ${xmlReady(renderCard(tpl, mem, "front", false, true))}
            ${xmlReady(renderCard(tpl, mem, "back", false, true))}
          </div>
        </div>
      </foreignObject>
    `;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rows}</svg>`;
  const orgSlug = slugify(activeOrg()?.name || "organisation");
  downloadTextFile(`cartes-${orgSlug}-recto-verso.svg`, "image/svg+xml;charset=utf-8", svg);
}

function code39BarcodeSvg(value) {
  const patterns = {
    "0": "101001101101", "1": "110100101011", "2": "101100101011", "3": "110110010101",
    "4": "101001101011", "5": "110100110101", "6": "101100110101", "7": "101001011011",
    "8": "110100101101", "9": "101100101101", "A": "110101001011", "B": "101101001011",
    "C": "110110100101", "D": "101011001011", "E": "110101100101", "F": "101101100101",
    "G": "101010011011", "H": "110101001101", "I": "101101001101", "J": "101011001101",
    "K": "110101010011", "L": "101101010011", "M": "110110101001", "N": "101011010011",
    "O": "110101101001", "P": "101101101001", "Q": "101010110011", "R": "110101011001",
    "S": "101101011001", "T": "101011011001", "U": "110010101011", "V": "100110101011",
    "W": "110011010101", "X": "100101101011", "Y": "110010110101", "Z": "100110110101",
    "-": "100101011011", ".": "110010101101", " ": "100110101101", "$": "100100100101",
    "/": "100100101001", "+": "100101001001", "%": "101001001001", "*": "100101101101"
  };
  const clean = `*${String(value).toUpperCase().replace(/[^0-9A-Z .$/+%-]/g, "-")}*`;
  let x = 10;
  const bars = [];
  for (const char of clean) {
    const pattern = patterns[char] || patterns["-"];
    for (let i = 0; i < pattern.length; i += 1) {
      const wide = pattern[i] === "1";
      const width = wide ? 4 : 2;
      if (i % 2 === 0) bars.push(`<rect x="${x}" y="10" width="${width}" height="66" fill="#111"/>`);
      x += width;
    }
    x += 3;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${x + 10}" height="86" viewBox="0 0 ${x + 10} 86"><rect width="100%" height="100%" fill="#fff"/>${bars.join("")}</svg>`;
}

function logoThumb(src) {
  return src ? `<img class="avatar" src="${src}" alt="">` : `<span class="avatar" style="display:inline-block"></span>`;
}

function bindEvents() {
  app.onclick = handleAppClick;

  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      view = btn.dataset.view;
      render();
    });
  });

  document.querySelector("[data-action='switch-org']")?.addEventListener("change", (event) => {
    if (!isSuperAdmin()) return;
    activeOrgId = event.target.value;
    selectedTemplateId = defaultTemplateForOrg()?.id || orgTemplates()[0]?.id || "";
    previewMemberId = orgMembers()[0]?.id || "";
    editingMemberId = "";
    generatedSelection = new Set(orgMembers().slice(0, 4).map((m) => m.id));
    render();
  });

  bindOrganizations();
  bindCategories();
  bindMembers();
  bindTemplates();
  bindGenerate();
  bindVerify();
  bindOrgSettings();
  bindSessionActions();
}

async function handleAppClick(event) {
  const saveOrgButton = event.target.closest("[data-action='save-org']");
  if (saveOrgButton) {
    event.preventDefault();
    await saveOrganizationFromForm(document.querySelector("#org-form"));
    return;
  }

  const editOrgButton = event.target.closest("[data-action='edit-org']");
  if (editOrgButton) {
    event.preventDefault();
    fillOrgForm(editOrgButton.dataset.orgId);
    return;
  }

  const deleteOrgButton = event.target.closest("[data-action='delete-org']");
  if (deleteOrgButton) {
    event.preventDefault();
    deleteOrganization(deleteOrgButton.dataset.orgId);
    return;
  }

  const saveCatButton = event.target.closest("[data-action='save-cat']");
  if (saveCatButton) {
    event.preventDefault();
    saveCategoryFromForm(document.querySelector("#category-form"));
    return;
  }

  const editCatButton = event.target.closest("[data-action='edit-cat']");
  if (editCatButton) {
    event.preventDefault();
    fillCategoryForm(editCatButton.dataset.catId);
    return;
  }

  const saveSettingsButton = event.target.closest("[data-action='save-settings']");
  if (saveSettingsButton) {
    event.preventDefault();
    await saveSettingsFromForm(document.querySelector("#settings-form"));
    return;
  }

  const saveMemberButton = event.target.closest("[data-action='save-member']");
  if (saveMemberButton) {
    event.preventDefault();
    await saveMemberFromForm(document.querySelector("#member-form"), editingMemberId || "");
    return;
  }

  const editMemberButton = event.target.closest("[data-action='edit-member']");
  if (editMemberButton) {
    event.preventDefault();
    fillMemberForm(editMemberButton.dataset.memberId);
    return;
  }

  const deleteMemberButton = event.target.closest("[data-action='delete-member']");
  if (deleteMemberButton) {
    event.preventDefault();
    deleteMember(deleteMemberButton.dataset.memberId);
    return;
  }

  const saveMemberEditButton = event.target.closest("[data-action='save-member-edit']");
  if (saveMemberEditButton) {
    event.preventDefault();
    const editBox = saveMemberEditButton.closest("[data-member-edit-form]");
    await saveMemberFromForm(editBox, saveMemberEditButton.dataset.memberId);
    return;
  }

  const cancelMemberEditButton = event.target.closest("[data-action='cancel-member-edit']");
  if (cancelMemberEditButton) {
    event.preventDefault();
    editingMemberId = "";
    render();
  }
}

function bindLogin() {
  document.querySelectorAll("[data-login-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      loginMode = button.dataset.loginMode;
      render();
    });
  });
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pin = data.get("pin")?.trim();
    if (loginMode === "superadmin") {
      if (pin !== SUPER_ADMIN_PIN) {
        alert("PIN super admin incorrect.");
        return;
      }
      session = { role: "superadmin", name: "Super admin" };
      activeOrgId = state.organizations[0]?.id || "";
      view = "organizations";
    } else {
      const org = state.organizations.find((item) => item.id === data.get("orgId"));
      if (!org || pin !== org.pin) {
        alert("Organisation ou PIN incorrect.");
        return;
      }
      session = { role: "orgadmin", orgId: org.id, name: org.adminName || `Admin ${org.name}` };
      activeOrgId = org.id;
      view = "dashboard";
    }
    selectedTemplateId = defaultTemplateForOrg()?.id || orgTemplates()[0]?.id || "";
    previewMemberId = orgMembers()[0]?.id || "";
    generatedSelection = new Set(orgMembers().slice(0, 4).map((m) => m.id));
    saveSession();
    render();
  });
}

function bindSessionActions() {
  document.querySelector("[data-action='logout']")?.addEventListener("click", () => {
    session = null;
    saveSession();
    view = "dashboard";
    render();
  });
}

function bindOrganizations() {
  const form = document.querySelector("#org-form");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveOrganizationFromForm(form);
  });

  document.querySelector("[data-action='clear-org-form']")?.addEventListener("click", () => {
    form?.reset();
    if (form) setField(form, "id", "");
  });
}

async function saveOrganizationFromForm(form) {
  if (!form || !isSuperAdmin()) return;
  const data = new FormData(form);
  const existing = state.organizations.find((org) => org.id === data.get("id"));
  const org = existing || { id: uid("org"), status: "active", logo: "", logoBack: "", signature: "" };
  org.name = data.get("name").trim();
  org.type = data.get("type");
  org.prefix = data.get("prefix").trim().toUpperCase();
  org.adminName = data.get("adminName").trim() || `Admin ${org.name}`;
  org.pin = data.get("pin").trim() || org.pin || "1234";
  org.phone = data.get("phone").trim();
  org.email = data.get("email").trim();
  org.address = data.get("address").trim();
  org.officeAddress = data.get("officeAddress").trim() || org.address;
  org.officePhone = data.get("officePhone").trim() || org.phone;
  org.legalText = data.get("legalText").trim() || org.legalText || "";
  const wantedTemplate = state.templates.find((tpl) => tpl.id === data.get("defaultTemplateId"));
  org.defaultTemplateId = wantedTemplate?.orgId === org.id ? wantedTemplate.id : org.defaultTemplateId || "";
  org.logo = await maybeFile(data.get("logoFile"), org.logo);
  org.logoBack = await maybeFile(data.get("logoBackFile"), org.logoBack);
  org.signature = await maybeFile(data.get("signatureFile"), org.signature);
  if (!existing) state.organizations.push(org);
  activeOrgId = org.id;
  ensureRequiredModelsForOrg(org.id);
  saveState();
  render();
}

function fillOrgForm(id) {
  const org = state.organizations.find((item) => item.id === id);
  const form = document.querySelector("#org-form");
  if (!org || !form) return;
  activeOrgId = org.id;
  setField(form, "id", org.id);
  setField(form, "name", org.name);
  setField(form, "type", org.type);
  setField(form, "prefix", org.prefix);
  setField(form, "adminName", org.adminName);
  setField(form, "pin", org.pin);
  setField(form, "phone", org.phone);
  setField(form, "email", org.email);
  setField(form, "address", org.address);
  setField(form, "officeAddress", org.officeAddress);
  setField(form, "officePhone", org.officePhone);
  setField(form, "legalText", org.legalText);
  setField(form, "defaultTemplateId", org.defaultTemplateId);
}

function bindOrgSettings() {
  const form = document.querySelector("#settings-form");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSettingsFromForm(form);
  });
}

async function saveSettingsFromForm(form) {
  if (!form || !isOrgAdmin()) return;
  const data = new FormData(form);
  const org = activeOrg();
  org.phone = data.get("phone").trim();
  org.email = data.get("email").trim();
  org.address = data.get("address").trim();
  org.officeAddress = data.get("officeAddress").trim();
  org.officePhone = data.get("officePhone").trim();
  org.defaultTemplateId = data.get("defaultTemplateId") || org.defaultTemplateId || "";
  org.legalText = data.get("legalText").trim();
  org.logo = await maybeFile(data.get("logoFile"), org.logo);
  org.logoBack = await maybeFile(data.get("logoBackFile"), org.logoBack);
  org.signature = await maybeFile(data.get("signatureFile"), org.signature);
  saveState();
  render();
}

function deleteOrganization(id) {
  if (!isSuperAdmin()) return;
  const org = state.organizations.find((item) => item.id === id);
  if (!org) return;
  const ok = confirm(`Supprimer ${org.name} et toutes ses donnees locales ?`);
  if (!ok) return;
  state.organizations = state.organizations.filter((item) => item.id !== id);
  state.categories = state.categories.filter((item) => item.orgId !== id);
  state.members = state.members.filter((item) => item.orgId !== id);
  state.templates = state.templates.filter((item) => item.orgId !== id);
  state.generatedCards = state.generatedCards.filter((item) => item.orgId !== id);
  activeOrgId = state.organizations[0]?.id || "";
  selectedTemplateId = defaultTemplateForOrg()?.id || orgTemplates()[0]?.id || "";
  saveState();
  render();
}

function bindCategories() {
  const form = document.querySelector("#category-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCategoryFromForm(form);
  });
  document.querySelector("[data-action='clear-cat-form']")?.addEventListener("click", () => {
    form?.reset();
    if (form) setField(form, "id", "");
  });
}

function saveCategoryFromForm(form) {
  if (!form) return;
  const data = new FormData(form);
  const existing = state.categories.find((cat) => cat.id === data.get("id"));
  const cat = existing || { id: uid("cat"), orgId: activeOrgId };
  cat.name = data.get("name").trim();
  cat.color = data.get("color");
  cat.validityMonths = Number(data.get("validityMonths") || 12);
  cat.templateId = data.get("templateId") || "";
  if (!existing) state.categories.push(cat);
  saveState();
  render();
}

function fillCategoryForm(id) {
  const cat = state.categories.find((item) => item.id === id && item.orgId === activeOrgId);
  const form = document.querySelector("#category-form");
  if (!cat || !form) return;
  setField(form, "id", cat.id);
  setField(form, "name", cat.name);
  setField(form, "color", cat.color);
  setField(form, "validityMonths", cat.validityMonths);
  setField(form, "templateId", cat.templateId);
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindMembers() {
  const form = document.querySelector("#member-form");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveMemberFromForm(form, editingMemberId || "");
  });
  document.querySelector("[data-action='clear-member-form']")?.addEventListener("click", () => resetMemberForm(form));
  document.querySelector("[data-action='import-csv']")?.addEventListener("change", importCsv);
}

async function saveMemberFromForm(form, forcedId = "") {
  if (!form) return;
  const data = form instanceof HTMLFormElement ? new FormData(form) : formDataFromContainer(form);
  const editingId = forcedId || data.get("id");
  const existing = state.members.find((mem) => mem.id === editingId && mem.orgId === activeOrgId);
  const org = activeOrg();
  const mem = existing || { id: uid("mem"), orgId: activeOrgId, photo: "", cardUid: uid("card").toUpperCase() };
  mem.lastName = data.get("lastName").trim();
  mem.firstName = data.get("firstName").trim();
  mem.gender = data.get("gender");
  mem.birthDate = data.get("birthDate");
  mem.birthPlace = data.get("birthPlace").trim();
  mem.nationality = data.get("nationality").trim() || "Congolaise";
  mem.categoryId = data.get("categoryId");
  mem.role = data.get("role").trim();
  mem.phone = data.get("phone").trim();
  mem.email = data.get("email").trim();
  mem.address = data.get("address").trim();
  mem.memberNo = data.get("memberNo").trim() || `${org.prefix}-${String(state.members.length + 1).padStart(4, "0")}`;
  mem.issueDate = data.get("issueDate");
  mem.expiryDate = data.get("expiryDate") || defaultExpiry(mem.categoryId, mem.issueDate);
  mem.status = data.get("status");
  mem.photo = await maybeFile(data.get("photoFile"), mem.photo);
  if (!existing) state.members.push(mem);
  editingMemberId = mem.id;
  previewMemberId = mem.id;
  generatedSelection.add(mem.id);
  saveState();
  render();
}

function formDataFromContainer(container) {
  const data = new FormData();
  container.querySelectorAll("input, select, textarea").forEach((field) => {
    if (!field.name) return;
    if (field.type === "file") data.set(field.name, field.files?.[0] || "");
    else data.set(field.name, field.value || "");
  });
  return data;
}

function resetMemberForm(form) {
  editingMemberId = "";
  render();
}

function fillMemberForm(id) {
  const mem = state.members.find((item) => item.id === id && item.orgId === activeOrgId);
  if (!mem) return;
  editingMemberId = mem.id;
  previewMemberId = mem.id;
  generatedSelection.add(mem.id);
  render();
  setTimeout(() => document.querySelector("#member-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
}

function deleteMember(id) {
  const mem = state.members.find((item) => item.id === id && item.orgId === activeOrgId);
  if (!mem) return;
  const ok = window.confirm(`Supprimer ${mem.lastName} ${mem.firstName} ?`);
  if (!ok) return;
  state.members = state.members.filter((item) => item.id !== mem.id);
  state.generatedCards = state.generatedCards.filter((item) => item.memberId !== mem.id);
  generatedSelection.delete(mem.id);
  if (editingMemberId === mem.id) editingMemberId = "";
  if (previewMemberId === mem.id) previewMemberId = orgMembers()[0]?.id || "";
  saveState();
  render();
}

function defaultExpiry(categoryId, issueDate) {
  const date = new Date(issueDate || new Date());
  date.setMonth(date.getMonth() + 240);
  return date.toISOString().slice(0, 10);
}

async function importCsv(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const categoryId = orgCategories()[0]?.id;
  const org = activeOrg();
  text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line, index) => {
    const [lastName, firstName, role, phone] = line.split(",").map((part) => part?.trim() || "");
    if (!lastName || !firstName) return;
    state.members.push({
      id: uid("mem"),
      orgId: activeOrgId,
      categoryId,
      firstName,
      lastName,
      gender: "",
      birthDate: "",
      birthPlace: "",
      nationality: "Congolaise",
      role,
      phone,
      email: "",
      address: org.address,
      memberNo: `${org.prefix}-${String(state.members.length + index + 1).padStart(4, "0")}`,
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: defaultExpiry(categoryId, new Date().toISOString().slice(0, 10)),
      status: "active",
      photo: "",
      cardUid: uid("card").toUpperCase()
    });
  });
  saveState();
  render();
}

function bindTemplates() {
  document.querySelector("[data-action='select-template']")?.addEventListener("change", (event) => {
    selectedTemplateId = event.target.value;
    selectedElementId = "";
    render();
  });
  document.querySelector("[data-action='new-template']")?.addEventListener("click", () => {
    const variant = "photo";
    const org = activeOrg();
    const style = organizationDesignStyle(org, variant);
    const styleKey = `${style.accent}|${style.accent2}|${style.accent3}|${style.hue}|${style.motif}|${style.offset}|${style.angle}|${style.mark}`;
    const tpl = {
      id: uid("tpl"),
      orgId: activeOrgId,
      categoryId: "",
      name: "Nouveau modele PVC",
      widthMm: 85.6,
      heightMm: 54,
      orientation: "landscape",
      accentColor: style.accent,
      bgFront: svgDataUrl(frontSvgForVariant(variant, org)),
      bgBack: svgDataUrl(backSvgForVariant(variant, org)),
      palette: "photo",
      schemaVersion: 3,
      elements: orderedCardElements(variant)
    };
    ensureSplitNameFields(tpl);
    ensureBackOfficeFields(tpl);
    ensureChurchBackLayout(tpl);
    tpl.designVariant = variant;
    tpl.designVersion = 17;
    tpl.designStyleKey = styleKey;
    applyTemplatePalette(tpl, "photo");
    state.templates.push(tpl);
    if (org && !org.defaultTemplateId) org.defaultTemplateId = tpl.id;
    selectedTemplateId = tpl.id;
    saveState();
    render();
  });
  document.querySelector("[data-action='apply-photo-card-preset']")?.addEventListener("click", () => {
    const tpl = template();
    tpl.name = tpl.name || "Modele photo automatique";
    tpl.bgFront = svgDataUrl(photoStyleFrontSvg());
    tpl.bgBack = svgDataUrl(photoStyleBackSvg());
    tpl.elements = photoCardElements();
    tpl.widthMm = 85.6;
    tpl.heightMm = 54;
    tpl.accentColor = "#f97316";
    tpl.schemaVersion = 3;
    ensureSplitNameFields(tpl);
    ensureBackOfficeFields(tpl);
    delete tpl.churchBackLayoutVersion;
    ensureChurchBackLayout(tpl);
    applyTemplatePalette(tpl, "photo");
    saveState();
    render();
  });
  document.querySelector("[data-action='ensure-org-models']")?.addEventListener("click", () => {
    ensureRequiredModelsForOrg(activeOrgId);
    saveState();
    render();
  });
  document.querySelector("[data-action='template-palette']")?.addEventListener("change", (event) => {
    const tpl = template();
    applyTemplatePalette(tpl, event.target.value);
    saveState();
    render();
  });
  document.querySelectorAll("[data-template-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const tpl = template();
      const key = input.dataset.templateField;
      tpl[key] = input.type === "number" ? Number(input.value) : input.value;
      if (key === "categoryId") {
        const cat = state.categories.find((item) => item.id === input.value);
        if (cat) cat.templateId = tpl.id;
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-template-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const tpl = template();
      const cat = ensureCategoryPreset(button.dataset.templatePreset);
      tpl.categoryId = cat.id;
      cat.templateId = tpl.id;
      if (button.dataset.templatePreset === "standard") tpl.name ||= "Modele membre standard";
      if (button.dataset.templatePreset === "honor") tpl.name ||= "Modele membre d'honneur";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-bg-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const tpl = template();
      const dataUrl = await fileToDataUrl(file);
      if (input.dataset.bgUpload === "front") tpl.bgFront = dataUrl;
      if (input.dataset.bgUpload === "back") tpl.bgBack = dataUrl;
      applyTemplatePalette(tpl, tpl.palette || "photo");
      saveState();
      render();
    });
  });
  document.querySelector("[data-action='preview-member']")?.addEventListener("change", (event) => {
    previewMemberId = event.target.value;
    render();
  });
  document.querySelector("[data-action='select-template-element']")?.addEventListener("change", (event) => {
    selectedElementId = event.target.value;
    render();
  });
  document.querySelectorAll("[data-template-adjust-field]").forEach((input) => {
    input.addEventListener("change", () => updateTemplateElement(input));
    input.addEventListener("input", () => {
      if (["x", "y", "w", "h", "fontSize", "color"].includes(input.dataset.templateAdjustField)) {
        updateTemplateElement(input);
      }
    });
  });
  document.querySelectorAll(".element[data-element-id]").forEach((node) => {
    node.addEventListener("click", () => {
      selectedElementId = node.dataset.elementId;
      render();
    });
  });
  document.querySelectorAll("[data-face]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFace = btn.dataset.face;
      selectedElementId = "";
      render();
    });
  });
}

function updateTemplateElement(input) {
  const item = template().elements.find((entry) => entry.id === selectedElementId);
  if (!item) return;
  const key = input.dataset.templateAdjustField;
  if (input.type === "number") {
    const value = Number(input.value);
    if (key === "x") item.x = clamp(value, 0, 100 - item.w);
    else if (key === "y") item.y = clamp(value, 0, 100 - item.h);
    else if (key === "w") item.w = clamp(value, 1, 100 - item.x);
    else if (key === "h") item.h = clamp(value, 1, 100 - item.y);
    else if (key === "fontSize") item.fontSize = clamp(value, 6, 42);
  } else {
    item[key] = input.value;
  }
  saveState();
  render();
}

function bindGenerate() {
  document.querySelector("[data-action='org-default-template']")?.addEventListener("change", (event) => {
    const org = activeOrg();
    org.defaultTemplateId = event.target.value;
    selectedTemplateId = event.target.value;
    saveState();
    render();
  });
  document.querySelectorAll("[data-print-member]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) generatedSelection.add(input.dataset.printMember);
      else generatedSelection.delete(input.dataset.printMember);
      render();
    });
  });
  document.querySelector("[data-action='print-cards']")?.addEventListener("click", () => {
    generatedSelection.forEach((memberId) => {
      const mem = state.members.find((item) => item.id === memberId);
      const tpl = mem ? templateForMember(mem) : template();
      state.generatedCards.push({
        id: uid("gen"),
        memberId,
        templateId: tpl?.id,
        orgId: activeOrgId,
        generatedAt: new Date().toISOString()
      });
    });
    saveState();
    fitCardTextElements();
    window.print();
  });
  document.querySelector("[data-action='download-card-image']")?.addEventListener("click", downloadSelectedCardImage);
  document.querySelector("[data-action='select-all-print']")?.addEventListener("click", () => {
    generatedSelection = new Set(orgMembers().map((m) => m.id));
    render();
  });
  document.querySelector("[data-action='clear-print']")?.addEventListener("click", () => {
    generatedSelection = new Set();
    render();
  });
}

function bindVerify() {
  document.querySelector("[data-action='verify-input']")?.addEventListener("input", (event) => {
    window.currentVerifyQuery = event.target.value.trim();
    render();
  });
}

async function maybeFile(file, fallback) {
  if (!file || !file.size) return fallback || "";
  return fileToDataUrl(file);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ensureCategoryPreset(kind) {
  const names = kind === "honor"
    ? ["Membre d'honneur", "Honneur"]
    : ["Membre standard", "Standard"];
  let cat = orgCategories().find((item) => names.some((name) => item.name.toLowerCase() === name.toLowerCase()));
  if (!cat) {
    cat = {
      id: uid("cat"),
      orgId: activeOrgId,
      name: names[0],
      color: kind === "honor" ? "#b45309" : "#0f766e",
      validityMonths: 240,
      templateId: ""
    };
    state.categories.push(cat);
  }
  return cat;
}

function requiresStandardHonorModels(org) {
  return /ong|politique|parti|mouvement|association/i.test(`${org?.type || ""} ${org?.name || ""}`);
}

function ensureRequiredModelsForOrg(orgId = activeOrgId) {
  const previousOrg = activeOrgId;
  activeOrgId = orgId;
  const org = activeOrg();
  if (!org) return [];
  const created = [];
  if (requiresStandardHonorModels(org)) {
    created.push(ensureCategoryTemplate("standard", "PVC membre standard", "#0f766e"));
    created.push(ensureCategoryTemplate("honor", "PVC membre d'honneur", "#b45309"));
  } else if (!orgTemplates(org.id).length) {
    const cat = orgCategories(org.id)[0] || ensureCategoryPreset("standard");
    created.push(ensureTemplateForCategory(cat, `PVC ${cat.name}`, "#0f766e"));
  }
  org.defaultTemplateId ||= orgTemplates(org.id)[0]?.id || "";
  selectedTemplateId = org.defaultTemplateId || created[0]?.id || selectedTemplateId;
  activeOrgId = previousOrg || orgId;
  return created.filter(Boolean);
}

function ensureCategoryTemplate(kind, templateNameValue, accentColor) {
  const cat = ensureCategoryPreset(kind);
  return ensureTemplateForCategory(cat, templateNameValue, accentColor);
}

function ensureTemplateForCategory(cat, templateNameValue, accentColor = "#0f766e") {
  let tpl = state.templates.find((item) => item.orgId === cat.orgId && item.categoryId === cat.id);
  if (!tpl) {
    const variant = categoryDesignVariant(cat);
    tpl = {
      id: uid("tpl"),
      orgId: cat.orgId,
      categoryId: cat.id,
      name: `${templateNameValue} - ${activeOrg()?.name || "Organisation"}`,
      widthMm: 85.6,
      heightMm: 54,
      orientation: "landscape",
      accentColor,
      bgFront: svgDataUrl(frontSvgForVariant(variant, activeOrg())),
      bgBack: svgDataUrl(backSvgForVariant(variant, activeOrg())),
      palette: "photo",
      schemaVersion: 3,
      elements: photoCardElements()
    };
    ensureSplitNameFields(tpl);
    ensureBackOfficeFields(tpl);
    ensureChurchBackLayout(tpl);
    applyTemplatePalette(tpl, "photo");
    state.templates.push(tpl);
  }
  applyOrgTemplateDesign(tpl, cat);
  cat.templateId = tpl.id;
  const org = state.organizations.find((item) => item.id === cat.orgId);
  if (org && !org.defaultTemplateId) org.defaultTemplateId = tpl.id;
  return tpl;
}

function categoryDesignVariant(cat) {
  return /honneur|honor/i.test(cat.name) ? "ngoHonor" : /standard/i.test(cat.name) ? "ngoStandard" : "photo";
}

function frontSvgForVariant(variant, org) {
  const style = organizationDesignStyle(org, variant);
  if (variant === "ngoHonor") return orderedFrontSvg("ngoHonor", style);
  if (variant === "ngoStandard") return orderedFrontSvg("ngoStandard", style);
  return orderedFrontSvg("photo", style);
}

function backSvgForVariant(variant, org) {
  const style = organizationDesignStyle(org, variant);
  if (variant === "ngoHonor") return orderedBackSvg("ngoHonor", style);
  if (variant === "ngoStandard") return orderedBackSvg("ngoStandard", style);
  return orderedBackSvg("photo", style);
}

function applyOrgTemplateDesign(tpl, cat, dataSource) {
  const source = dataSource || state;
  const org = source.organizations.find((item) => item.id === tpl.orgId);
  const variant = categoryDesignVariant(cat);
  const style = organizationDesignStyle(org, variant);
  const styleKey = `${style.accent}|${style.accent2}|${style.accent3}|${style.hue}|${style.motif}|${style.offset}|${style.angle}|${style.mark}`;
  if (tpl.designVariant === variant && tpl.designVersion >= 17 && tpl.designStyleKey === styleKey) return;
  tpl.bgFront = svgDataUrl(frontSvgForVariant(variant, org));
  tpl.bgBack = svgDataUrl(backSvgForVariant(variant, org));
  tpl.accentColor = style.accent;
  tpl.elements = orderedCardElements(variant);
  tpl.designVariant = variant;
  tpl.designVersion = 17;
  tpl.designStyleKey = styleKey;
  ensureSplitNameFields(tpl);
  ensureBackOfficeFields(tpl);
  applyTemplatePalette(tpl, "photo");
}

function setField(form, name, value) {
  const field = form.elements.namedItem(name);
  if (field) field.value = value ?? "";
}

render();
