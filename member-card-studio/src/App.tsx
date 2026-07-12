import { useState, useCallback, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { toPng } from 'html-to-image';
import * as db from './lib/supabase';

// ─── TYPES ──────────────────────────────────────────────
type OrgType = 'ONG' | 'Église' | 'École' | 'Parti Politique' | 'Association' | 'Entreprise' | 'Autre';
type DesignId = 'corporate' | 'elegant' | 'modern' | 'classic' | 'vibrant' | 'minimal';
type Face = 'front' | 'back';
type MemberStatus = 'Actif' | 'Inactif' | 'Suspendu';
type View = 'dashboard' | 'organizations' | 'members' | 'templates' | 'generate' | 'gallery' | 'settings';

interface Org {
  id: string; name: string; type: OrgType; phone: string; email: string;
  address: string; pin: string; prefix: string; logo: string; signature: string;
  legalText: string; createdAt: string;
}

interface Member {
  id: string; orgId: string; fullName: string; firstName: string;
  memberNo: string; category: string; role: string; gender: string;
  birthDate: string; birthPlace: string; nationality: string;
  phone: string; email: string; address: string; status: MemberStatus;
  photo: string; issueDate: string; expiryDate: string; createdAt: string;
}

interface CardEl {
  id: string; type: string; label: string;
  x: number; y: number; w: number; h: number; face: Face;
  fontSize: number; color: string; fontWeight: string; align: string;
}

interface Template {
  id: string; orgId: string; name: string; designId: DesignId;
  primaryColor: string; secondaryColor: string; accentColor: string;
  elements: CardEl[]; createdAt: string;
}

interface AppData { organizations: Org[]; members: Member[]; templates: Template[]; }
interface Session { type: 'superadmin' | 'org'; orgId?: string; }

// ─── UTILS ──────────────────────────────────────────────
const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
const fmtDate = (d: string) => { if (!d) return ''; try { return new Date(d).toLocaleDateString('fr-FR'); } catch { return d; } };

function el(type: string, label: string, x: number, y: number, w: number, h: number, face: Face, fs: number, color: string, fw: string, al: string): CardEl {
  return { id: uid('el'), type, label, x, y, w, h, face, fontSize: fs, color, fontWeight: fw, align: al };
}

// ─── DB CONVERTERS ──────────────────────────────────────
function orgToDb(o: Org): db.DbOrganization {
  return { id: o.id, name: o.name, type: o.type, phone: o.phone, email: o.email, address: o.address, pin: o.pin, prefix: o.prefix, logo: o.logo, signature: o.signature, legal_text: o.legalText, created_at: o.createdAt };
}
function dbToOrg(d: db.DbOrganization): Org {
  return { id: d.id, name: d.name, type: d.type as OrgType, phone: d.phone, email: d.email, address: d.address, pin: d.pin, prefix: d.prefix, logo: d.logo, signature: d.signature, legalText: d.legal_text, createdAt: d.created_at };
}
function memberToDb(m: Member): db.DbMember {
  return { id: m.id, org_id: m.orgId, full_name: m.fullName, first_name: m.firstName, member_no: m.memberNo, category: m.category, role: m.role, gender: m.gender, birth_date: m.birthDate, birth_place: m.birthPlace, nationality: m.nationality, phone: m.phone, email: m.email, address: m.address, status: m.status, photo: m.photo, issue_date: m.issueDate, expiry_date: m.expiryDate, created_at: m.createdAt };
}
function dbToMember(d: db.DbMember): Member {
  return { id: d.id, orgId: d.org_id, fullName: d.full_name, firstName: d.first_name, memberNo: d.member_no, category: d.category, role: d.role, gender: d.gender, birthDate: d.birth_date, birthPlace: d.birth_place, nationality: d.nationality, phone: d.phone, email: d.email, address: d.address, status: d.status as MemberStatus, photo: d.photo, issueDate: d.issue_date, expiryDate: d.expiry_date, createdAt: d.created_at };
}
function templateToDb(t: Template): db.DbTemplate {
  return { id: t.id, org_id: t.orgId, name: t.name, design_id: t.designId, primary_color: t.primaryColor, secondary_color: t.secondaryColor, accent_color: t.accentColor, elements: JSON.stringify(t.elements), created_at: t.createdAt };
}
function dbToTemplate(d: db.DbTemplate): Template {
  return { id: d.id, orgId: d.org_id, name: d.name, designId: d.design_id as DesignId, primaryColor: d.primary_color, secondaryColor: d.secondary_color, accentColor: d.accent_color, elements: JSON.parse(d.elements || '[]'), createdAt: d.created_at };
}

// ─── DESIGNS ────────────────────────────────────────────
const DESIGNS: { id: DesignId; name: string; icon: string; desc: string; primary: string; secondary: string; accent: string }[] = [
  { id: 'corporate', name: 'Business Wave', icon: '🌊', desc: 'Vagues premium, photo ronde et look corporate moderne', primary: '#0f4fb4', secondary: '#143a82', accent: '#8cc4ff' },
  { id: 'elegant', name: 'Élégant Gold', icon: '✨', desc: 'Luxueux avec bordures dorées', primary: '#1e293b', secondary: '#0f172a', accent: '#d4a574' },
  { id: 'modern', name: 'Skyline Premium', icon: '🏙️', desc: 'Fond corporate clair et mise en page haut de gamme', primary: '#2d5e91', secondary: '#173f72', accent: '#d7e7ff' },
  { id: 'classic', name: 'Classique Officiel', icon: '🏛️', desc: 'Sobre et institutionnel', primary: '#1e3a5f', secondary: '#0c2340', accent: '#c8a951' },
  { id: 'vibrant', name: 'Vibrant Energy', icon: '🎨', desc: 'Dynamique et coloré', primary: '#dc2626', secondary: '#991b1b', accent: '#fbbf24' },
  { id: 'minimal', name: 'Executive Circle', icon: '⭕', desc: 'Photo ronde à droite et hiérarchie typographique élégante', primary: '#324d66', secondary: '#24384c', accent: '#6f8ca8' },
];

function designElements(d: DesignId): CardEl[] {
  const F: Face = 'front', B: Face = 'back';
  switch(d) {
    case 'corporate': return [
      el('logo','Logo',5,6,10,12,F,10,'#111','normal','center'),
      el('organization','Organisation',17,7,28,9,F,15,'#0f4fb4','bold','start'),
      el('category','Catégorie',17,17,25,5,F,9.5,'#4e739a','bold','start'),
      el('photo','Photo',6,26,30,30,F,12,'#111','normal','center'),
      el('fullName','Nom',42,27,50,9,F,24,'#0f172a','bold','start'),
      el('role','Fonction',42,38,35,7,F,15,'#0f4fb4','bold','start'),
      el('phone','Téléphone',42,52,38,5.5,F,10,'#334155','normal','start'),
      el('email','Email',42,60,45,5.5,F,10,'#334155','normal','start'),
      el('address','Adresse',42,68,48,5.5,F,10,'#334155','normal','start'),
      el('memberNo','N°',42,84,20,5,F,9,'#64748b','bold','start'),
      el('barcode','Code-barres',42,78,28,6,F,8,'#111','normal','center'),
      el('signature','Signature',75,75,18,10,F,9,'#111','normal','center'),
      el('expiryDate','Expiration',75,87,18,4,F,8,'#dc2626','bold','center'),
      el('logoBack','Logo',38,10,24,28,B,10,'#111','normal','center'),
      el('organization','Organisation',15,42,70,9,B,17,'#0f4fb4','bold','center'),
      el('legalText','Texte juridique',10,56,55,15,B,8,'#4b6077','normal','start'),
      el('qr','QR',68,54,22,24,B,10,'#111','normal','center'),
      el('officeAddress','Siège',10,78,45,5,B,8,'#4b6077','normal','start'),
      el('officePhone','Bureau',10,85,30,4,B,8,'#4b6077','normal','start'),
      el('email','Email',58,85,32,4,B,8,'#4b6077','normal','end'),
    ];
    case 'elegant': return [
      el('logo','Logo',38,5,24,18,F,10,'#111','normal','center'),
      el('organization','Organisation',10,26,80,7,F,15,'#d4a574','bold','center'),
      el('photo','Photo',8,38,22,36,F,12,'#111','normal','center'),
      el('fullName','Nom',34,38,58,7,F,18,'#ffffff','bold','start'),
      el('firstName','Prénom',34,46,58,6,F,14,'#e2e8f0','normal','start'),
      el('category','Catégorie',34,54,30,5,F,9.5,'#d4a574','bold','start'),
      el('role','Fonction',66,54,28,5,F,9.5,'#94a3b8','normal','start'),
      el('memberNo','N°',34,62,30,5,F,9.5,'#e2e8f0','bold','start'),
      el('phone','Tél',34,70,30,5,F,8.5,'#94a3b8','normal','start'),
      el('signature','Signature',72,78,18,9,F,8.5,'#ffffff','normal','center'),
      el('expiryDate','Expiration',8,82,22,4,F,8,'#d4a574','bold','center'),
      el('barcode','Code-barres',8,74,24,6,F,7.5,'#ffffff','normal','center'),
      el('logoBack','Logo',38,12,24,26,B,10,'#d4a574','normal','center'),
      el('organization','Organisation',15,42,70,8,B,16,'#d4a574','bold','center'),
      el('legalText','Texte juridique',10,56,55,14,B,7.5,'#94a3b8','normal','start'),
      el('qr','QR',68,56,22,22,B,10,'#ffffff','normal','center'),
      el('officeAddress','Siège',10,78,45,5,B,7.5,'#94a3b8','normal','start'),
      el('officePhone','Bureau',10,85,32,4,B,7.5,'#94a3b8','normal','start'),
      el('email','Email',58,85,32,4,B,7.5,'#94a3b8','normal','end'),
    ];
    case 'modern': return [
      el('logo','Logo',5,6,10,11,F,10,'#111','normal','center'),
      el('organization','Organisation',17,7,30,8,F,14,'#2d5e91','bold','start'),
      el('category','Catégorie',17,16,26,5,F,9,'#496f93','bold','start'),
      el('photo','Photo',64,10,28,28,F,12,'#111','normal','center'),
      el('fullName','Nom',5,32,55,8,F,22,'#0f172a','bold','start'),
      el('role','Fonction',5,42,40,6,F,13,'#2d5e91','bold','start'),
      el('memberNo','N°',5,51,25,5,F,9.5,'#475569','normal','start'),
      el('phone','Téléphone',5,60,35,5,F,9,'#475569','normal','start'),
      el('email','Email',5,68,42,5,F,9,'#475569','normal','start'),
      el('address','Adresse',5,76,45,5,F,9,'#475569','normal','start'),
      el('barcode','Code-barres',5,84,28,6,F,8,'#111','normal','center'),
      el('signature','Signature',68,75,22,10,F,9,'#111','normal','center'),
      el('expiryDate','Expiration',68,88,22,4,F,8,'#dc2626','bold','center'),
      el('logoBack','Logo',38,12,24,26,B,10,'#111','normal','center'),
      el('organization','Organisation',15,42,70,8,B,16,'#2d5e91','bold','center'),
      el('legalText','Texte juridique',10,56,55,14,B,7.5,'#4b6077','normal','start'),
      el('qr','QR',68,56,22,22,B,10,'#111','normal','center'),
      el('officeAddress','Siège',10,78,45,5,B,7.5,'#4b6077','normal','start'),
      el('officePhone','Bureau',10,85,32,4,B,7.5,'#4b6077','normal','start'),
      el('email','Email',58,85,32,4,B,7.5,'#4b6077','normal','end'),
    ];
    case 'classic': return [
      el('logo','Logo',4,6,16,18,F,10,'#111','normal','center'),
      el('organization','Organisation',22,6,55,8,F,16,'#ffffff','bold','start'),
      el('category','Catégorie',22,16,40,5,F,10,'#c8a951','bold','start'),
      el('photo','Photo',4,32,24,40,F,12,'#111','normal','center'),
      el('fullName','Nom',32,32,62,7,F,18,'#1e293b','bold','start'),
      el('firstName','Prénom',32,40,62,6,F,14,'#475569','bold','start'),
      el('role','Fonction',32,49,40,5,F,10,'#1e3a5f','bold','start'),
      el('memberNo','N°',32,57,30,5,F,11,'#111827','bold','start'),
      el('birthDate','Naissance',32,64,28,5,F,9,'#64748b','normal','start'),
      el('nationality','Nationalité',63,64,32,5,F,9,'#64748b','normal','start'),
      el('phone','Tél',32,72,30,5,F,9,'#64748b','normal','start'),
      el('barcode','Code-barres',4,75,24,7,F,8,'#111','normal','center'),
      el('signature','Signature',74,78,20,10,F,9,'#111','normal','center'),
      el('expiryDate','Expiration',32,89,25,5,F,8.5,'#c8a951','bold','start'),
      el('logoBack','Logo',35,6,30,28,B,10,'#111','normal','center'),
      el('organization','Organisation',10,38,80,7,B,15,'#1e3a5f','bold','center'),
      el('legalText','Texte juridique',8,48,84,22,B,8.5,'#64748b','normal','center'),
      el('qr','QR',38,72,24,22,B,10,'#111','normal','center'),
      el('officeAddress','Siège',8,76,28,5,B,8,'#64748b','normal','start'),
      el('officePhone','Bureau',8,85,28,5,B,8,'#64748b','normal','start'),
      el('email','Email',64,85,28,5,B,8,'#64748b','normal','end'),
    ];
    case 'vibrant': return [
      el('logo','Logo',3,3,14,17,F,10,'#111','normal','center'),
      el('organization','Organisation',19,4,50,7,F,14,'#ffffff','bold','start'),
      el('category','Catégorie',19,12,35,5,F,9,'#fef3c7','bold','start'),
      el('photo','Photo',3,25,30,46,F,12,'#111','normal','center'),
      el('fullName','Nom',36,25,58,8,F,19,'#111827','bold','start'),
      el('firstName','Prénom',36,34,58,6,F,14,'#475569','bold','start'),
      el('role','Fonction',36,43,40,5,F,10,'#dc2626','bold','start'),
      el('memberNo','N°',36,51,30,5,F,11,'#111827','bold','start'),
      el('birthDate','Naissance',36,59,25,5,F,9,'#64748b','normal','start'),
      el('phone','Tél',63,59,30,5,F,9,'#64748b','normal','start'),
      el('nationality','Nationalité',36,66,30,5,F,9,'#64748b','normal','start'),
      el('barcode','Code-barres',3,75,30,8,F,8,'#111','normal','center'),
      el('signature','Signature',72,78,22,12,F,9,'#111','normal','center'),
      el('expiryDate','Expiration',36,89,25,5,F,8.5,'#dc2626','bold','start'),
      el('logoBack','Logo',35,8,30,26,B,10,'#111','normal','center'),
      el('organization','Organisation',10,38,80,7,B,15,'#dc2626','bold','center'),
      el('legalText','Texte juridique',8,48,84,22,B,8.5,'#64748b','normal','center'),
      el('qr','QR',38,72,24,22,B,10,'#111','normal','center'),
      el('officeAddress','Siège',8,76,28,5,B,8,'#64748b','normal','start'),
      el('officePhone','Bureau',8,85,28,5,B,8,'#64748b','normal','start'),
      el('email','Email',64,85,28,5,B,8,'#64748b','normal','end'),
    ];
    case 'minimal': default: return [
      el('logo','Logo',6,6,9,10,F,10,'#111','normal','center'),
      el('organization','Organisation',17,7,30,8,F,14,'#324d66','bold','start'),
      el('fullName','Nom',6,28,52,8,F,22,'#0f172a','bold','start'),
      el('role','Fonction',6,38,38,6,F,13,'#324d66','normal','start'),
      el('phone','Téléphone',6,56,35,5,F,9.5,'#475569','normal','start'),
      el('email','Email',6,64,42,5,F,9.5,'#475569','normal','start'),
      el('address','Adresse',6,72,45,5,F,9.5,'#475569','normal','start'),
      el('photo','Photo',62,12,30,30,F,12,'#111','normal','center'),
      el('memberNo','N°',62,46,22,5,F,9,'#64748b','bold','start'),
      el('barcode','Code-barres',62,54,28,6,F,8,'#111','normal','center'),
      el('signature','Signature',62,75,28,10,F,9,'#111','normal','center'),
      el('expiryDate','Expiration',62,88,22,4,F,8,'#dc2626','bold','center'),
      el('logoBack','Logo',38,12,24,26,B,10,'#111','normal','center'),
      el('organization','Organisation',15,42,70,8,B,16,'#324d66','bold','center'),
      el('legalText','Texte juridique',10,56,55,14,B,7.5,'#4b6077','normal','start'),
      el('qr','QR',68,56,22,22,B,10,'#111','normal','center'),
      el('officeAddress','Siège',10,78,45,5,B,7.5,'#4b6077','normal','start'),
      el('officePhone','Bureau',10,85,32,4,B,7.5,'#4b6077','normal','start'),
      el('email','Email',58,85,32,4,B,7.5,'#4b6077','normal','end'),
    ];
  }
}

function getAutoDesignForOrg(input: Pick<Org, 'name' | 'type'> | { name: string; type: OrgType }): DesignId {
  const type = String(input.type || '').toLowerCase();
  const name = String(input.name || '').toLowerCase();
  if (/entreprise|industry|industrie|real estate|immobilier|corporate|business/.test(`${type} ${name}`)) return 'corporate';
  if (/eglise|church|ministry|paroisse/.test(`${type} ${name}`)) return 'elegant';
  if (/ecole|school|institut|academy|universit/.test(`${type} ${name}`)) return 'modern';
  if (/association|asbl|ong|foundation|fondation/.test(`${type} ${name}`)) return 'minimal';
  if (/parti|politique|movement|mouvement/.test(`${type} ${name}`)) return 'classic';
  return 'corporate';
}

function getDesignMeta(id: DesignId) {
  return DESIGNS.find(d => d.id === id) || DESIGNS[0];
}

// ─── SEED DATA ──────────────────────────────────────────
// Projet 100% VIERGE au premier lancement - aucune donnée préchargée
function seedData(): AppData {
  return {
    organizations: [],
    members: [],
    templates: [],
  };
}

const SK = 'mcs:data:v3';
const SSK = 'mcs:session';
function loadLocal(): AppData { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : seedData(); } catch { return seedData(); } }
function saveLocal(d: AppData) { localStorage.setItem(SK, JSON.stringify(d)); }
function loadSession(): Session | null { try { const r = sessionStorage.getItem(SSK); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveSession(s: Session | null) { if (s) sessionStorage.setItem(SSK, JSON.stringify(s)); else sessionStorage.removeItem(SSK); }

// ─── FILE UPLOAD HELPER ────────────────────────────────
function pickFile(accept: string): Promise<string> {
  return new Promise(resolve => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = accept;
    inp.onchange = () => {
      const f = inp.files?.[0]; if (!f) return resolve('');
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(f);
    };
    inp.click();
  });
}

// ═══════════════════════════════════════════════════════
// CARD RENDERER
// ═══════════════════════════════════════════════════════
const CW = 640, CH = 404;

function CardBG({ designId, face, p, s, a, w, h }: { designId: DesignId; face: Face; p: string; s: string; a: string; w: number; h: number }) {
  const vb = `0 0 ${CW} ${CH}`;
  if (face === 'front') {
    switch (designId) {
      case 'corporate': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={p}/><stop offset="100%" stopColor={s}/></linearGradient>
            <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f8fbff"/><stop offset="100%" stopColor="#ffffff"/></linearGradient>
          </defs>
          <rect width={CW} height={CH} fill="url(#cg2)"/>
          <path d={`M0,0 H${CW} V${CH*0.12} C${CW*0.82},${CH*0.03} ${CW*0.66},${CH*0.18} ${CW*0.48},${CH*0.09} C${CW*0.28},${CH*0.0} ${CW*0.14},${CH*0.16} 0,${CH*0.08} Z`} fill="url(#cg)"/>
          <path d={`M0,${CH} V${CH*0.88} C${CW*0.18},${CH*0.78} ${CW*0.34},${CH*0.96} ${CW*0.52},${CH*0.9} C${CW*0.72},${CH*0.82} ${CW*0.86},${CH*0.98} ${CW},${CH*0.9} V${CH} Z`} fill="url(#cg)"/>
          <circle cx={CW*0.79} cy={CH*0.18} r={18} fill={p} opacity="0.95"/>
          <circle cx={CW*0.86} cy={CH*0.81} r={22} fill={p} opacity="0.95"/>
          <path d={`M${CW*0.56},${CH*0.12} C${CW*0.68},${CH*0.08} ${CW*0.76},${CH*0.28} ${CW*0.66},${CH*0.42} C${CW*0.58},${CH*0.53} ${CW*0.7},${CH*0.68} ${CW*0.83},${CH*0.62}`} fill="none" stroke={a} strokeWidth="1.2" opacity="0.45"/>
          <path d={`M${CW*0.52},${CH*0.18} C${CW*0.62},${CH*0.14} ${CW*0.7},${CH*0.34} ${CW*0.6},${CH*0.48} C${CW*0.53},${CH*0.58} ${CW*0.63},${CH*0.7} ${CW*0.76},${CH*0.68}`} fill="none" stroke={a} strokeWidth="0.8" opacity="0.3"/>
          <path d={`M${CW*0.03},${CH*0.08} C${CW*0.07},${CH*0.14} ${CW*0.11},${CH*0.2} ${CW*0.1},${CH*0.32}`} fill="none" stroke={a} strokeWidth="0.8" opacity="0.18"/>
        </svg>
      );
      case 'elegant': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={p}/><stop offset="100%" stopColor={s}/></linearGradient></defs>
          <rect width={CW} height={CH} fill="url(#eg)"/>
          <rect x="5" y="5" width={CW-10} height={CH-10} fill="none" stroke={a} strokeWidth="1.5" rx="6" opacity="0.5"/>
          <rect x="9" y="9" width={CW-18} height={CH-18} fill="none" stroke={a} strokeWidth="0.5" rx="4" opacity="0.25"/>
          <circle cx={18} cy={18} r={10} fill="none" stroke={a} strokeWidth="0.8" opacity="0.3"/>
          <circle cx={CW-18} cy={18} r={10} fill="none" stroke={a} strokeWidth="0.8" opacity="0.3"/>
          <circle cx={18} cy={CH-18} r={10} fill="none" stroke={a} strokeWidth="0.8" opacity="0.3"/>
          <circle cx={CW-18} cy={CH-18} r={10} fill="none" stroke={a} strokeWidth="0.8" opacity="0.3"/>
          <circle cx={CW*0.82} cy={CH*0.18} r={90} fill={a} opacity="0.04"/>
          <line x1="30" y1="2" x2={CW-30} y2="2" stroke={a} strokeWidth="2.5" opacity="0.55"/>
          <line x1="30" y1={CH-2} x2={CW-30} y2={CH-2} stroke={a} strokeWidth="2.5" opacity="0.55"/>
        </svg>
      );
      case 'modern': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={p}/><stop offset="100%" stopColor={s}/></linearGradient>
            <linearGradient id="msoft" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eef5ff"/><stop offset="100%" stopColor="#ffffff"/></linearGradient>
          </defs>
          <rect width={CW} height={CH} fill="url(#msoft)"/>
          <path d={`M0,${CH*0.86} C${CW*0.14},${CH*0.73} ${CW*0.32},${CH*0.95} ${CW*0.5},${CH*0.88} C${CW*0.72},${CH*0.79} ${CW*0.86},${CH*1.02} ${CW},${CH*0.89} V${CH} H0 Z`} fill="url(#mg)"/>
          <path d={`M${CW*0.64},${CH*0.12} A${CW*0.34} ${CH*0.42} 0 0 1 ${CW},${CH*0.33} L${CW},${CH*0.78} A${CW*0.32} ${CH*0.36} 0 0 0 ${CW*0.72},${CH*0.56} Z`} fill={p} opacity="0.12"/>
          <rect x={CW*0.02} y={CH*0.08} width={CW*0.45} height={CH*0.78} fill="#ffffff" opacity="0.35"/>
          <rect x={CW*0.18} y={CH*0.2} width={CW*0.06} height={CH*0.52} rx="4" fill={a} opacity="0.14"/>
          <rect x={CW*0.27} y={CH*0.12} width={CW*0.08} height={CH*0.6} rx="4" fill={a} opacity="0.1"/>
          <rect x={CW*0.38} y={CH*0.26} width={CW*0.05} height={CH*0.46} rx="4" fill={a} opacity="0.08"/>
        </svg>
      );
      case 'classic': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <rect width={CW} height={CH} fill="#fff"/>
          <rect width={CW} height={CH*0.27} fill={p}/>
          <rect y={CH-6} width={CW} height={6} fill={a}/>
          <rect width={3} height={CH} fill={p}/><rect x={CW-3} width={3} height={CH} fill={p}/>
          <circle cx={CW/2} cy={CH*0.27} r={28} fill="#fff" opacity="0.1"/>
          <line x1={CW*0.04} y1={CH*0.29} x2={CW*0.96} y2={CH*0.29} stroke={p} strokeWidth="1" opacity="0.12"/>
        </svg>
      );
      case 'vibrant': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <rect width={CW} height={CH} fill="#fff"/>
          <polygon points={`0,0 ${CW*0.35},0 ${CW*0.25},${CH} 0,${CH}`} fill={p}/>
          <polygon points={`0,0 ${CW*0.32},0 ${CW*0.22},${CH} 0,${CH}`} fill={s} opacity="0.55"/>
          <circle cx={CW*0.27} cy={CH*0.2} r={45} fill={a} opacity="0.15"/>
          <circle cx={CW*0.17} cy={CH*0.82} r={30} fill="#fff" opacity="0.1"/>
          <rect x={CW*0.35} y={CH-4} width={CW*0.28} height={4} fill={a}/>
          <circle cx={CW*0.92} cy={CH*0.88} r={16} fill={p} opacity="0.06"/>
          <circle cx={CW*0.88} cy={CH*0.82} r={7} fill={a} opacity="0.14"/>
        </svg>
      );
      case 'minimal': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <rect width={CW} height={CH} fill="#ffffff"/>
          <line x1="0" y1={CH*0.48} x2={CW} y2={CH*0.48} stroke={p} strokeWidth="3" opacity="0.95"/>
          <path d={`M${CW*0.05},${CH} V${CH*0.82} H${CW*0.56} C${CW*0.59},${CH*0.82} ${CW*0.61},${CH*0.84} ${CW*0.61},${CH*0.87} V${CH} Z`} fill={p}/>
          <circle cx={CW*0.76} cy={CH*0.38} r={96} fill="none" stroke={p} strokeWidth="10"/>
          <circle cx={CW*0.76} cy={CH*0.38} r={82} fill="none" stroke={p} strokeWidth="4" opacity="0.9"/>
          <line x1={CW*0.88} y1={CH*0.48} x2={CW} y2={CH*0.48} stroke={p} strokeWidth="3" opacity="0.95"/>
        </svg>
      );
    }
  } else {
    switch (designId) {
      case 'corporate': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <defs><linearGradient id="cbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={p}/><stop offset="100%" stopColor={s}/></linearGradient></defs>
          <rect width={CW} height={CH} fill="#f9fbff"/>
          <path d={`M0,0 H${CW} V${CH*0.09} C${CW*0.82},${CH*0.02} ${CW*0.64},${CH*0.16} ${CW*0.46},${CH*0.08} C${CW*0.24},0 ${CW*0.12},${CH*0.14} 0,${CH*0.06} Z`} fill="url(#cbg)"/>
          <path d={`M0,${CH} V${CH*0.9} C${CW*0.22},${CH*0.82} ${CW*0.32},${CH} ${CW*0.52},${CH*0.92} C${CW*0.72},${CH*0.84} ${CW*0.86},${CH} ${CW},${CH*0.92} V${CH} Z`} fill="url(#cbg)"/>
          <circle cx={CW*0.82} cy={CH*0.78} r={18} fill={p} opacity="0.9"/>
          <path d={`M${CW*0.54},${CH*0.22} C${CW*0.68},${CH*0.1} ${CW*0.82},${CH*0.28} ${CW*0.74},${CH*0.5}`} fill="none" stroke={a} strokeWidth="1" opacity="0.35"/>
        </svg>
      );
      case 'elegant': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <defs><linearGradient id="ebg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={p}/><stop offset="100%" stopColor={s}/></linearGradient></defs>
          <rect width={CW} height={CH} fill="url(#ebg)"/>
          <rect x="5" y="5" width={CW-10} height={CH-10} fill="none" stroke={a} strokeWidth="1" rx="6" opacity="0.35"/>
          <line x1="30" y1="2" x2={CW-30} y2="2" stroke={a} strokeWidth="2" opacity="0.45"/>
          <line x1="30" y1={CH-2} x2={CW-30} y2={CH-2} stroke={a} strokeWidth="2" opacity="0.45"/>
        </svg>
      );
      case 'modern': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <defs><linearGradient id="mbg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={p}/><stop offset="100%" stopColor={s}/></linearGradient></defs>
          <rect width={CW} height={CH} fill="#f7faff"/>
          <path d={`M0,${CH} V${CH*0.9} C${CW*0.2},${CH*0.8} ${CW*0.36},${CH} ${CW*0.54},${CH*0.92} C${CW*0.72},${CH*0.84} ${CW*0.86},${CH} ${CW},${CH*0.91} V${CH} Z`} fill="url(#mbg2)"/>
          <circle cx={CW*0.82} cy={CH*0.2} r={16} fill={p} opacity="0.9"/>
          <path d={`M${CW*0.58},${CH*0.2} C${CW*0.68},${CH*0.12} ${CW*0.8},${CH*0.24} ${CW*0.72},${CH*0.44}`} fill="none" stroke={a} strokeWidth="1" opacity="0.45"/>
        </svg>
      );
      case 'minimal': return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <rect width={CW} height={CH} fill="#ffffff"/>
          <line x1="0" y1={CH*0.5} x2={CW} y2={CH*0.5} stroke={p} strokeWidth="2" opacity="0.95"/>
          <path d={`M${CW*0.06},${CH} V${CH*0.84} H${CW*0.52} C${CW*0.55},${CH*0.84} ${CW*0.58},${CH*0.86} ${CW*0.58},${CH*0.89} V${CH} Z`} fill={p}/>
          <circle cx={CW*0.8} cy={CH*0.26} r={30} fill="none" stroke={p} strokeWidth="2" opacity="0.18"/>
        </svg>
      );
      default: return (
        <svg width={w} height={h} viewBox={vb} style={{ position:'absolute', inset:0 }}>
          <rect width={CW} height={CH} fill="#fafbfc"/>
          <rect width={CW} height={5} fill={p}/>
          <rect y={CH-3} width={CW} height={3} fill={a} opacity="0.4"/>
        </svg>
      );
    }
  }
}

function CardEl_({ el: e, member: m, org: o, cw }: { el: CardEl; member: Member; org: Org; cw: number }) {
  const sc = cw / CW;
  const base: React.CSSProperties = {
    position: 'absolute', left: `${e.x}%`, top: `${e.y}%`, width: `${e.w}%`, height: `${e.h}%`,
    fontSize: `${e.fontSize * sc}px`, color: e.color, fontWeight: e.fontWeight === 'bold' ? 700 : 400,
    textAlign: e.align as React.CSSProperties['textAlign'], display: 'flex', alignItems: 'center', overflow: 'hidden', lineHeight: 1.25,
    justifyContent: e.align === 'center' ? 'center' : e.align === 'end' ? 'flex-end' : 'flex-start',
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  if (e.type === 'photo') {
    const circlePhoto = Math.abs(e.w - e.h) <= 8;
    return <div style={base}>{m.photo
      ? <img src={m.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius: circlePhoto ? '999px' : `${4*sc}px`, border: `${circlePhoto ? 6 : 1.5*sc}px solid ${circlePhoto ? '#0f4fb4' : 'rgba(255,255,255,0.25)'}` }}/>
      : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#94a3b8,#64748b)', borderRadius: circlePhoto ? '999px' : `${4*sc}px`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:`${22*sc}px`, fontWeight:800, border: `${circlePhoto ? 6 : 1.5*sc}px solid ${circlePhoto ? '#0f4fb4' : 'rgba(255,255,255,0.25)'}` }}>{(m.fullName?.[0]||'')}{(m.firstName?.[0]||'')}</div>
    }</div>;
  }
  if (e.type === 'logo' || e.type === 'logoBack') {
    return <div style={base}>{o.logo
      ? <img src={o.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }}/>
      : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#0f766e,#134e4a)', borderRadius:`${5*sc}px`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:`${13*sc}px`, fontWeight:900, letterSpacing:'1px', boxShadow:`0 ${2*sc}px ${6*sc}px rgba(0,0,0,0.15)` }}>{(o.prefix||o.name.slice(0,3)).toUpperCase()}</div>
    }</div>;
  }
  if (e.type === 'signature') {
    return <div style={{...base, flexDirection:'column', gap:`${2*sc}px`, justifyContent:'flex-end'}}>
      {o.signature ? <img src={o.signature} alt="" style={{ maxWidth:'100%', maxHeight:'60%', objectFit:'contain' }}/> : <div style={{ borderBottom:`${1.5*sc}px solid #94a3b8`, width:'80%' }}/>}
      <span style={{ fontSize:`${7*sc}px`, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px' }}>Signature</span>
    </div>;
  }
  if (e.type === 'barcode') {
    const bh = (e.h / 100) * (cw * CH / CW);
    return <div style={base}><Barcode value={m.memberNo||'000'} width={1} height={Math.max(16, bh*0.42)} fontSize={0} margin={0} displayValue={false} background="transparent"/></div>;
  }
  if (e.type === 'qr') {
    const sz = Math.min((e.w/100)*cw, (e.h/100)*(cw*CH/CW)) * 0.8;
    return <div style={base}><QRCodeSVG value={JSON.stringify({org:o.name,id:m.memberNo,name:`${m.fullName} ${m.firstName}`})} size={sz} level="M"/></div>;
  }

  const val = (() => {
    switch(e.type) {
      case 'fullName': return m.fullName;
      case 'firstName': return m.firstName;
      case 'memberNo': return m.memberNo;
      case 'category': return m.category;
      case 'role': return m.role;
      case 'birthDate': return m.birthDate ? `Né(e): ${fmtDate(m.birthDate)}` : '';
      case 'birthPlace': return m.birthPlace ? `Lieu: ${m.birthPlace}` : '';
      case 'nationality': return m.nationality ? `Nat: ${m.nationality}` : '';
      case 'phone': return m.phone; case 'email': return m.email; case 'address': return m.address;
      case 'issueDate': return m.issueDate ? `Émis: ${fmtDate(m.issueDate)}` : '';
      case 'expiryDate': return m.expiryDate ? `Exp: ${fmtDate(m.expiryDate)}` : '';
      case 'organization': return o.name;
      case 'officeAddress': return o.address; case 'officePhone': return o.phone;
      case 'legalText': return o.legalText; default: return '';
    }
  })();
  if (!val) return null;
  return <div style={base}><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace: e.type==='legalText'?'normal':'nowrap', width:'100%' }}>{val}</span></div>;
}

function CardRender({ tpl, member, org, face, scale = 1 }: { tpl: Template; member: Member; org: Org; face: Face; scale?: number }) {
  const cw = CW * scale, ch = CH * scale;
  return (
    <div className="card-surface" style={{ width: cw, height: ch, position:'relative', borderRadius: 10*scale, overflow:'hidden', boxShadow:'0 10px 40px rgba(0,0,0,0.13), 0 2px 10px rgba(0,0,0,0.07)', fontFamily:"'Inter',system-ui,sans-serif", background:'#fff' }}>
      <CardBG designId={tpl.designId} face={face} p={tpl.primaryColor} s={tpl.secondaryColor} a={tpl.accentColor} w={cw} h={ch}/>
      {tpl.elements.filter(e => e.face === face).map(e => <CardEl_ key={e.id} el={e} member={member} org={org} cw={cw}/>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [data, setData_] = useState<AppData>(loadLocal);
  const [session, setSession_] = useState<Session | null>(loadSession);
  const [view, setView] = useState<View>('dashboard');
  const [activeOrgId, setActiveOrgId_] = useState(loadLocal().organizations[0]?.id || '');
  const [selTplId, setSelTplId] = useState('');
  const [editMbrId, setEditMbrId] = useState('');
  const [showMbrForm, setShowMbrForm] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [editOrgId, setEditOrgId] = useState('');
  const [selFace, setSelFace] = useState<Face>('front');
  const [selMembers, setSelMembers] = useState<Set<string>>(new Set());
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [genTplId, setGenTplId] = useState('');
  const [editTplName, setEditTplName] = useState(false);
  const [tplNameDraft, setTplNameDraft] = useState('');
  const [generating, setGenerating] = useState(false);
  
  const [cloudStatus, setCloudStatus] = useState<'offline'|'synced'|'syncing'|'error'>('offline');

  // Cloud sync check
  useEffect(() => {
    if (db.isSupabaseConfigured()) {
      setCloudStatus('syncing');
      db.syncFromCloud().then(cloudData => {
        if (cloudData && cloudData.organizations.length > 0) {
          const newData: AppData = {
            organizations: cloudData.organizations.map(dbToOrg),
            members: cloudData.members.map(dbToMember),
            templates: cloudData.templates.map(dbToTemplate),
          };
          setData_(newData);
          saveLocal(newData);
          if (newData.organizations.length > 0) setActiveOrgId_(newData.organizations[0].id);
          setCloudStatus('synced');
        } else {
          setCloudStatus('synced');
        }
      }).catch(() => setCloudStatus('error'));
    }
  }, []);

  const set = async (d: AppData) => {
    setData_(d);
    saveLocal(d);
    // Sync to cloud
    if (db.isSupabaseConfigured()) {
      setCloudStatus('syncing');
      try {
        await Promise.all(d.organizations.map(o => db.upsertOrganization(orgToDb(o))));
        await Promise.all(d.members.map(m => db.upsertMember(memberToDb(m))));
        await Promise.all(d.templates.map(t => db.upsertTemplate(templateToDb(t))));
        setCloudStatus('synced');
      } catch {
        setCloudStatus('error');
      }
    }
  };
  
  const login = (s: Session) => { setSession_(s); saveSession(s); };
  const logout = () => { setSession_(null); saveSession(null); };
  const setActiveOrg = (id: string) => { setActiveOrgId_(id); setSelTplId(''); setEditMbrId(''); setSelMembers(new Set()); setSearch(''); };
  const isSA = session?.type === 'superadmin';
  const org = data.organizations.find(o => o.id === activeOrgId);

  // ─── LOGIN ──────────────────────────────────────────
  if (!session) {
    return <LoginPage data={data} onLogin={login}/>;
  }

  // ─── SIDEBAR + CONTENT ─────────────────────────────
  const navItems: { id: View; icon: string; label: string; saOnly?: boolean }[] = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
    { id: 'organizations', icon: '🏢', label: 'Organisations', saOnly: true },
    { id: 'members', icon: '👥', label: 'Membres' },
    { id: 'templates', icon: '🎨', label: 'Modèles de carte' },
    { id: 'generate', icon: '🖨️', label: 'Générer cartes' },
    { id: 'gallery', icon: '🖼️', label: 'Galerie designs' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' },
  ];

  const viewTitles: Record<View, string> = {
    dashboard: 'Tableau de bord', organizations: 'Organisations', members: 'Membres',
    templates: 'Modèles de carte', generate: 'Générer les cartes', gallery: '🖼️ Galerie des designs', settings: 'Paramètres',
  };

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-lg font-black">CS</div>
            <div><p className="font-extrabold text-white text-sm">Card Studio</p><p className="text-[11px] text-gray-500">{isSA ? '🔐 Super Admin' : org?.name}</p></div>
          </div>
        </div>
        {isSA && (
          <div className="px-4 py-3 border-b border-white/10">
            <select value={activeOrgId} onChange={e => setActiveOrg(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-teal-500">
              {data.organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        )}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.filter(n => !n.saOnly || isSA).map(n => (
            <button key={n.id} onClick={() => setView(n.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${view === n.id ? 'bg-teal-600/20 text-teal-400 border border-teal-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
              <span className="text-base">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          {/* Cloud status */}
          <div className="px-3 py-2 mb-2 rounded-lg text-xs flex items-center gap-2" style={{ background: cloudStatus === 'synced' ? 'rgba(16,185,129,0.1)' : cloudStatus === 'syncing' ? 'rgba(251,191,36,0.1)' : cloudStatus === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.1)' }}>
            <span>{cloudStatus === 'synced' ? '☁️✅' : cloudStatus === 'syncing' ? '☁️🔄' : cloudStatus === 'error' ? '☁️❌' : '💾'}</span>
            <span style={{ color: cloudStatus === 'synced' ? '#10b981' : cloudStatus === 'syncing' ? '#fbbf24' : cloudStatus === 'error' ? '#ef4444' : '#94a3b8' }}>
              {cloudStatus === 'synced' ? 'Synchronisé' : cloudStatus === 'syncing' ? 'Sync...' : cloudStatus === 'error' ? 'Erreur sync' : 'Local seulement'}
            </span>
          </div>
          <div className="px-3 py-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-3">
            <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">Session</p>
            <p className="text-xs text-gray-300 mt-0.5 truncate">{isSA ? 'Administrateur global' : org?.name}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">🚪 Déconnexion</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">{viewTitles[view]}</h1>
          <span className="text-xs text-gray-400">Member Card Studio v2</span>
        </header>
        <div className="p-6">
          {view === 'dashboard' && <DashboardView data={data} orgId={activeOrgId} org={org} isSA={isSA} setView={setView}/>}
          {view === 'organizations' && <OrgsView data={data} set={set} showForm={showOrgForm} setShowForm={setShowOrgForm} editId={editOrgId} setEditId={setEditOrgId} setActiveOrg={setActiveOrg} setView={setView}/>}
          {view === 'members' && <MembersView data={data} set={set} orgId={activeOrgId} org={org} showForm={showMbrForm} setShowForm={setShowMbrForm} editId={editMbrId} setEditId={setEditMbrId} search={search} setSearch={setSearch}/>}
          {view === 'templates' && <TemplatesView data={data} set={set} orgId={activeOrgId} org={org} selTplId={selTplId} setSelTplId={setSelTplId} face={selFace} setFace={setSelFace} showDesignPicker={showDesignPicker} setShowDesignPicker={setShowDesignPicker} editTplName={editTplName} setEditTplName={setEditTplName} tplNameDraft={tplNameDraft} setTplNameDraft={setTplNameDraft}/>}
          {view === 'generate' && <GenerateView data={data} orgId={activeOrgId} org={org} selMembers={selMembers} setSelMembers={setSelMembers} genTplId={genTplId} setGenTplId={setGenTplId} generating={generating} setGenerating={setGenerating}/>}
          {view === 'gallery' && <GalleryView data={data} orgId={activeOrgId} org={org}/>}
          {view === 'settings' && <SettingsView data={data} isSA={isSA} cloudStatus={cloudStatus}/>}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════
function LoginPage({ data, onLogin }: { data: AppData; onLogin: (s: Session) => void }) {
  const [mode, setMode] = useState<'org'|'sa'>('org');
  const [orgId, setOrgId] = useState(data.organizations[0]?.id || '');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (mode === 'sa') {
      if (pin === '0000') onLogin({ type: 'superadmin' }); else setErr('PIN Super Admin incorrect');
    } else {
      const o = data.organizations.find(x => x.id === orgId);
      if (o && o.pin === pin) onLogin({ type: 'org', orgId }); else setErr('PIN incorrect');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErr('');
    try {
      const result = await db.signInWithGoogle();
      if (result.error) throw result.error;
      onLogin({ type: 'superadmin' });
    } catch (e: any) {
      setErr(e.message || 'Erreur connexion Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[440px_1fr]" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div className="bg-white flex flex-col justify-center px-8 py-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-teal-600/30">CS</div>
            <div><h1 className="text-xl font-extrabold text-gray-900">Member Card Studio</h1><p className="text-xs text-gray-500">Système de cartes PVC professionnel</p></div>
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 border border-gray-200 rounded-lg mb-6">
            <button onClick={() => { setMode('org'); setErr(''); setPin(''); }} className={`py-2.5 rounded-md text-sm font-medium transition-all ${mode==='org' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🏢 Organisation</button>
            <button onClick={() => { setMode('sa'); setErr(''); setPin(''); }} className={`py-2.5 rounded-md text-sm font-medium transition-all ${mode==='sa' ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🔐 Super Admin</button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'org' && (
              <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1.5">Organisation</span>
                <select value={orgId} onChange={e => setOrgId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                  {data.organizations.map(o => <option key={o.id} value={o.id}>{o.name} ({o.type})</option>)}
                </select>
              </label>
            )}
            <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1.5">{mode==='sa' ? 'PIN Super Admin' : 'PIN Organisation'}</span>
              <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="• • • •" maxLength={10} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 tracking-[0.3em] text-center text-lg"/>
            </label>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{err}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 rounded-lg shadow-lg shadow-teal-600/20 transition-all">Se connecter</button>
          </form>
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"/>
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200"/>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"/>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.766 12.2764c0-0.9167-0.0833-1.7917-0.2167-2.6333h-11.28v4.9652h6.4667c-0.2833 1.525-1.1417 2.8083-2.425 3.6667v3.0083h3.8833c2.275-2.0917 3.5917-5.175 3.5917-8.8167z"/><path fill="#34A853" d="M12.27 24.007c3.25 0 5.975-1.075 7.9667-2.9083l-3.8833-3.0083c-1.0833 0.725-2.4667 1.1583-4.0833 1.1583-3.1417 0-5.8-2.1167-6.75-4.9667h-4.0083v3.1083c1.9833 3.9417 6.0667 6.6167 10.7583 6.6167z"/><path fill="#FBBC05" d="M5.5167 14.2917c-0.2417-0.725-0.375-1.5-0.375-2.2917s0.1333-1.5667 0.375-2.2917v-3.1083h-4.0083c-0.825 1.6417-1.2917 3.4917-1.2917 5.4s0.4667 3.7583 1.2917 5.4l4.0083-3.1083z"/><path fill="#EA4335" d="M12.27 4.6917c1.7667 0 3.35 0.6083 4.6 1.7917l3.4417-3.4417c-2.0833-1.9417-4.8-3.0417-8.0417-3.0417-4.6917 0-8.775 2.675-10.7583 6.6167l4.0083 3.1083c0.95-2.85 3.6083-4.9667 6.75-4.9667z"/></svg>
            )}
            Continuer avec Google
          </button>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 leading-relaxed">
            <strong>Démo :</strong> Super Admin PIN = <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 font-mono">0000</code> · Fondation Umoja PIN = <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 font-mono">1234</code> · Église Bethel PIN = <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 font-mono">5678</code>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 via-gray-900/80 to-gray-900"/>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 6px, transparent 6px 22px)' }}/>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl font-extrabold text-white leading-[1.08] mb-4">Créez des cartes<br/><span className="text-teal-300">professionnelles</span><br/>en quelques clics</h2>
          <p className="text-teal-100/70 text-lg leading-relaxed mb-8">Générez des cartes PVC avec des designs personnalisés, QR codes et codes-barres pour vos organisations.</p>
          <div className="grid grid-cols-3 gap-3">
            {[['👥','Multi-organisations','Plusieurs entités'],['🎨','6 designs uniques','Personnalisez tout'],['☁️','Sync Cloud','Données partout']].map(([i,t,d]) => (
              <div key={t} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"><div className="text-2xl mb-2">{i}</div><p className="text-white font-semibold text-sm">{t}</p><p className="text-teal-200/50 text-xs mt-1">{d}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function DashboardView({ data, orgId, org, isSA, setView }: { data: AppData; orgId: string; org?: Org; isSA: boolean; setView: (v: View) => void }) {
  const mbs = data.members.filter(m => m.orgId === orgId);
  const tpls = data.templates.filter(t => t.orgId === orgId);
  const active = mbs.filter(m => m.status === 'Actif');
  const metrics = [
    { label: 'Organisations', val: isSA ? data.organizations.length : 1, color: 'from-teal-500 to-teal-600', icon: '🏢' },
    { label: 'Membres', val: mbs.length, color: 'from-blue-500 to-blue-600', icon: '👥' },
    { label: 'Modèles', val: tpls.length, color: 'from-purple-500 to-purple-600', icon: '🎨' },
    { label: 'Actifs', val: active.length, color: 'from-emerald-500 to-emerald-600', icon: '✅' },
  ];

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-gray-900 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute -right-16 -bottom-28 w-72 h-72 border-[45px] border-white/10 rounded-full"/>
        <div className="absolute right-36 -top-16 w-44 h-44 border-[25px] border-white/5 rounded-full"/>
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-medium mb-1">{isSA ? '🔐 Administration globale' : `📋 ${org?.type}`}</p>
          <h2 className="text-3xl font-extrabold mb-2">{isSA ? 'Bienvenue, Administrateur' : `Bienvenue, ${org?.name}`}</h2>
          <p className="text-teal-100/60 max-w-lg mb-6">Gérez vos membres, personnalisez vos modèles et générez des cartes PVC professionnelles.</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setView('members')} className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all">👥 Gérer les membres</button>
            <button onClick={() => setView('generate')} className="bg-white hover:bg-gray-100 text-teal-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-all">🖨️ Générer des cartes</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className={`absolute -right-3 -top-3 w-14 h-14 bg-gradient-to-br ${m.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}/>
            <div className="text-2xl mb-2">{m.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900">{m.val}</p>
            <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {([['👥','Ajouter un membre','Enregistrez un nouveau membre','members'],['🎨','Personnaliser un modèle','6 designs uniques disponibles','templates'],['🖨️','Imprimer les cartes','Générez les cartes PVC','generate']] as const).map(([ic,ti,de,v]) => (
          <button key={ti} onClick={() => setView(v)} className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-lg hover:border-gray-300 transition-all group">
            <div className="text-3xl mb-3">{ic}</div>
            <h3 className="font-bold text-gray-900 mb-1">{ti}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{de}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 mt-3 group-hover:gap-2 transition-all">Accéder →</span>
          </button>
        ))}
      </div>
      {mbs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div><h3 className="font-bold text-gray-900">Membres récents</h3><p className="text-sm text-gray-500">{mbs.length} membre(s)</p></div>
            <button onClick={() => setView('members')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">Voir tout →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {mbs.slice(0,5).map(m => (
              <div key={m.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">{m.fullName[0]}{m.firstName[0]}</div>
                  <div><p className="font-semibold text-gray-900 text-sm">{m.fullName} {m.firstName}</p><p className="text-xs text-gray-500">{m.memberNo} · {m.category}</p></div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.status==='Actif'?'bg-emerald-50 text-emerald-700':m.status==='Suspendu'?'bg-red-50 text-red-700':'bg-gray-100 text-gray-600'}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ORGANIZATIONS PAGE
// ═══════════════════════════════════════════════════════
const ORG_TYPES: OrgType[] = ['ONG','Église','École','Parti Politique','Association','Entreprise','Autre'];

function OrgForm({ initial, onSave, onCancel }: { initial?: Org; onSave: (d: Omit<Org,'id'|'createdAt'>) => void; onCancel: () => void }) {
  const [f, sf] = useState({ name: initial?.name||'', type: (initial?.type||'ONG') as OrgType, phone: initial?.phone||'', email: initial?.email||'', address: initial?.address||'', pin: initial?.pin||'', prefix: initial?.prefix||'', logo: initial?.logo||'', signature: initial?.signature||'', legalText: initial?.legalText||'' });
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">{initial ? "Modifier l'organisation" : "Nouvelle organisation"}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block col-span-2"><span className="text-sm font-semibold text-gray-700 block mb-1">Nom</span><input value={f.name} onChange={e => sf({...f,name:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Type</span><select value={f.type} onChange={e => sf({...f,type:e.target.value as OrgType})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">{ORG_TYPES.map(t => <option key={t}>{t}</option>)}</select></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Préfixe</span><input value={f.prefix} onChange={e => sf({...f,prefix:e.target.value})} maxLength={5} placeholder="Ex: UMJ" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Téléphone</span><input value={f.phone} onChange={e => sf({...f,phone:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Email</span><input value={f.email} onChange={e => sf({...f,email:e.target.value})} type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block col-span-2"><span className="text-sm font-semibold text-gray-700 block mb-1">Adresse</span><input value={f.address} onChange={e => sf({...f,address:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">PIN d'accès</span><input value={f.pin} onChange={e => sf({...f,pin:e.target.value})} maxLength={10} placeholder="PIN connexion" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <div className="flex items-end gap-4">
          <div><span className="text-sm font-semibold text-gray-700 block mb-1">Logo</span><div className="flex items-center gap-2">{f.logo && <img src={f.logo} alt="" className="w-10 h-10 object-contain rounded border"/>}<button onClick={async () => { const r = await pickFile('image/*'); if(r) sf({...f,logo:r}); }} className="text-sm text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50">{f.logo?'Changer':'Uploader'}</button></div></div>
          <div><span className="text-sm font-semibold text-gray-700 block mb-1">Signature</span><div className="flex items-center gap-2">{f.signature && <img src={f.signature} alt="" className="w-16 h-8 object-contain rounded border"/>}<button onClick={async () => { const r = await pickFile('image/*'); if(r) sf({...f,signature:r}); }} className="text-sm text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50">{f.signature?'Changer':'Uploader'}</button></div></div>
        </div>
        <label className="block col-span-2"><span className="text-sm font-semibold text-gray-700 block mb-1">Texte juridique (dos de carte)</span><textarea value={f.legalText} onChange={e => sf({...f,legalText:e.target.value})} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"/></label>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(f)} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">💾 Enregistrer</button>
        <button onClick={onCancel} className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50">Annuler</button>
      </div>
    </div>
  );
}

function OrgsView({ data, set, showForm, setShowForm, editId, setEditId, setActiveOrg, setView }: { data: AppData; set: (d: AppData) => Promise<void>; showForm: boolean; setShowForm: (b: boolean) => void; editId: string; setEditId: (s: string) => void; setActiveOrg: (s: string) => void; setView: (v: View) => void }) {
  const editOrg = data.organizations.find(o => o.id === editId);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-extrabold text-gray-900">Organisations</h2><p className="text-sm text-gray-500 mt-0.5">{data.organizations.length} enregistrée(s)</p></div>
        <button onClick={() => { setShowForm(true); setEditId(''); }} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-teal-600/20">➕ Nouvelle organisation</button>
      </div>
      {(showForm || editId) && <OrgForm initial={editOrg} onSave={async fd => {
        if (editId) { await set({...data, organizations: data.organizations.map(o => o.id===editId ? {...o,...fd} : o)}); }
        else {
          const nid = uid('org');
          const newOrg: Org = { ...fd, id: nid, createdAt: new Date().toISOString() };
          const autoDesign = getAutoDesignForOrg(fd);
          const dd = getDesignMeta(autoDesign);
          const tpl: Template = { id: uid('t'), orgId: nid, name: `Carte ${fd.name}`, designId: dd.id, primaryColor: dd.primary, secondaryColor: dd.secondary, accentColor: dd.accent, elements: designElements(dd.id), createdAt: new Date().toISOString() };
          await set({...data, organizations:[...data.organizations, newOrg], templates:[...data.templates, tpl]});
        }
        setShowForm(false); setEditId('');
      }} onCancel={() => { setShowForm(false); setEditId(''); }}/>}
      <div className="grid gap-4">
        {data.organizations.map(o => (
          <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {o.logo ? <img src={o.logo} alt="" className="w-14 h-14 object-contain rounded-xl border border-gray-100 p-1"/> : <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg">{o.prefix||o.name.slice(0,2).toUpperCase()}</div>}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{o.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5"><span className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded">{o.type}</span><span className="text-xs text-gray-400">PIN: {o.pin}</span></div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500"><span>👥 {data.members.filter(m=>m.orgId===o.id).length} membres</span><span>🎨 {data.templates.filter(t=>t.orgId===o.id).length} modèles</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setActiveOrg(o.id); setView('members'); }} className="text-sm text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 font-medium">Voir</button>
                <button onClick={() => { setEditId(o.id); setShowForm(false); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">✏️</button>
                <button onClick={async () => { if(confirm(`Supprimer ${o.name} ?`)) { await db.deleteOrganization(o.id); await set({...data, organizations:data.organizations.filter(x=>x.id!==o.id), members:data.members.filter(m=>m.orgId!==o.id), templates:data.templates.filter(t=>t.orgId!==o.id)}); }}} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MEMBERS PAGE
// ═══════════════════════════════════════════════════════
function MemberForm({ orgId, initial, data, onSave, onCancel }: { orgId: string; initial?: Member; data: AppData; onSave: (d: Omit<Member,'id'|'createdAt'>) => void; onCancel: () => void }) {
  const org = data.organizations.find(o => o.id === orgId);
  const cnt = data.members.filter(m => m.orgId === orgId).length;
  const [f, sf] = useState({
    orgId, fullName: initial?.fullName||'', firstName: initial?.firstName||'',
    memberNo: initial?.memberNo || `${org?.prefix||'MBR'}-${String(cnt+1).padStart(3,'0')}`,
    category: initial?.category||'', role: initial?.role||'', gender: initial?.gender||'M',
    birthDate: initial?.birthDate||'', birthPlace: initial?.birthPlace||'', nationality: initial?.nationality||'RD Congo',
    phone: initial?.phone||'', email: initial?.email||'', address: initial?.address||'',
    status: (initial?.status||'Actif') as MemberStatus, photo: initial?.photo||'',
    issueDate: initial?.issueDate || new Date().toISOString().slice(0,10),
    expiryDate: initial?.expiryDate || new Date(Date.now()+365*24*3600*1000).toISOString().slice(0,10),
  });
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">{initial ? 'Modifier le membre' : 'Nouveau membre'}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Nom</span><input value={f.fullName} onChange={e => sf({...f,fullName:e.target.value.toUpperCase()})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Prénom</span><input value={f.firstName} onChange={e => sf({...f,firstName:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">N° Membre</span><input value={f.memberNo} onChange={e => sf({...f,memberNo:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Catégorie</span><input value={f.category} onChange={e => sf({...f,category:e.target.value})} placeholder="Ex: Membre actif" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Fonction</span><input value={f.role} onChange={e => sf({...f,role:e.target.value})} placeholder="Ex: Coordinateur" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Sexe</span><select value={f.gender} onChange={e => sf({...f,gender:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"><option value="M">Masculin</option><option value="F">Féminin</option></select></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Date de naissance</span><input type="date" value={f.birthDate} onChange={e => sf({...f,birthDate:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Lieu de naissance</span><input value={f.birthPlace} onChange={e => sf({...f,birthPlace:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Nationalité</span><input value={f.nationality} onChange={e => sf({...f,nationality:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Téléphone</span><input value={f.phone} onChange={e => sf({...f,phone:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Email</span><input type="email" value={f.email} onChange={e => sf({...f,email:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Statut</span><select value={f.status} onChange={e => sf({...f,status:e.target.value as MemberStatus})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"><option>Actif</option><option>Inactif</option><option>Suspendu</option></select></label>
        <label className="block col-span-3"><span className="text-sm font-semibold text-gray-700 block mb-1">Adresse</span><input value={f.address} onChange={e => sf({...f,address:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Date d'émission</span><input type="date" value={f.issueDate} onChange={e => sf({...f,issueDate:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <label className="block"><span className="text-sm font-semibold text-gray-700 block mb-1">Date d'expiration</span><input type="date" value={f.expiryDate} onChange={e => sf({...f,expiryDate:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/></label>
        <div><span className="text-sm font-semibold text-gray-700 block mb-1">Photo</span><div className="flex items-center gap-3">{f.photo ? <img src={f.photo} alt="" className="w-14 h-14 object-cover rounded-lg border"/> : <div className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">Photo</div>}<button onClick={async()=>{const r=await pickFile('image/*');if(r)sf({...f,photo:r});}} className="text-sm text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 font-medium">{f.photo?'Changer':'Uploader'}</button></div></div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(f)} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">💾 Enregistrer</button>
        <button onClick={onCancel} className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50">Annuler</button>
      </div>
    </div>
  );
}

function MembersView({ data, set, orgId, org, showForm, setShowForm, editId, setEditId, search, setSearch }: { data: AppData; set: (d:AppData)=>Promise<void>; orgId: string; org?: Org; showForm: boolean; setShowForm: (b:boolean)=>void; editId: string; setEditId: (s:string)=>void; search: string; setSearch: (s:string)=>void }) {
  const mbs = data.members.filter(m => m.orgId === orgId).filter(m => { if(!search) return true; const q=search.toLowerCase(); return m.fullName.toLowerCase().includes(q)||m.firstName.toLowerCase().includes(q)||m.memberNo.toLowerCase().includes(q); });
  const editMbr = data.members.find(m => m.id === editId);
  const exportCSV = () => {
    const h = ['Nom','Prénom','N°','Catégorie','Fonction','Tél','Email','Statut'];
    const rows = mbs.map(m => [m.fullName,m.firstName,m.memberNo,m.category,m.role,m.phone,m.email,m.status]);
    const csv = [h,...rows].map(r => r.map(c=>`"${c}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = `membres-${org?.prefix||'export'}.csv`; a.click();
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-xl font-extrabold text-gray-900">Membres — {org?.name}</h2><p className="text-sm text-gray-500 mt-0.5">{mbs.length} membre(s)</p></div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">📥 Export CSV</button>
          <button onClick={() => { setShowForm(true); setEditId(''); }} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-teal-600/20">➕ Nouveau membre</button>
        </div>
      </div>
      {(showForm || editId) && <MemberForm orgId={orgId} initial={editMbr} data={data} onSave={async fd => { if(editId) { await db.upsertMember(memberToDb({...fd,id:editId,createdAt:editMbr!.createdAt} as Member)); await set({...data,members:data.members.map(m=>m.id===editId?{...m,...fd}:m)}); } else { const nm: Member = {...fd,id:uid('m'),createdAt:new Date().toISOString()} as Member; await db.upsertMember(memberToDb(nm)); await set({...data,members:[...data.members,nm]}); } setShowForm(false); setEditId(''); }} onCancel={() => { setShowForm(false); setEditId(''); }}/>}
      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, prénom, N°..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"/></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom / Prénom</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">N°</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fonction</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {mbs.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">{m.photo ? <img src={m.photo} alt="" className="w-10 h-10 object-cover rounded-lg"/> : <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">{m.fullName[0]}{m.firstName[0]}</div>}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-gray-900 text-sm">{m.fullName}</p><p className="text-xs text-gray-500">{m.firstName}</p></td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">{m.memberNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.role}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.status==='Actif'?'bg-emerald-50 text-emerald-700':m.status==='Suspendu'?'bg-red-50 text-red-700':'bg-gray-100 text-gray-600'}`}>{m.status}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-1"><button onClick={()=>{setEditId(m.id);setShowForm(false);}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">✏️</button><button onClick={async()=>{if(confirm(`Supprimer ${m.fullName} ?`)){await db.deleteMember(m.id);await set({...data,members:data.members.filter(x=>x.id!==m.id)});}}} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">🗑️</button></div></td>
                </tr>
              ))}
              {mbs.length===0 && <tr><td colSpan={7} className="text-center py-16 text-gray-400"><div className="text-4xl mb-2">👥</div><p className="font-medium">Aucun membre trouvé</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TEMPLATES PAGE
// ═══════════════════════════════════════════════════════
function TemplatesView({ data, set, orgId, org, selTplId, setSelTplId, face, setFace, showDesignPicker, setShowDesignPicker, editTplName, setEditTplName, tplNameDraft, setTplNameDraft }: { data: AppData; set: (d:AppData)=>Promise<void>; orgId: string; org?: Org; selTplId: string; setSelTplId: (s:string)=>void; face: Face; setFace: (f:Face)=>void; showDesignPicker: boolean; setShowDesignPicker: (b:boolean)=>void; editTplName: boolean; setEditTplName: (b:boolean)=>void; tplNameDraft: string; setTplNameDraft: (s:string)=>void }) {
  const tpls = data.templates.filter(t => t.orgId === orgId);
  const tpl = tpls.find(t => t.id === selTplId);
  const sample: Member = data.members.find(m => m.orgId === orgId) || { id:'s',orgId,fullName:'EXEMPLE',firstName:'Jean',memberNo:`${org?.prefix||'MBR'}-001`,category:'Membre actif',role:'Membre',gender:'M',birthDate:'1990-01-01',birthPlace:'Kinshasa',nationality:'RD Congo',phone:'+243 810 000 000',email:'exemple@mail.cd',address:'Kinshasa',status:'Actif',photo:'',issueDate:'2024-01-01',expiryDate:'2025-12-31',createdAt:'' };

  const addTpl = async () => {
    const autoDesign = getAutoDesignForOrg({ name: org?.name || '', type: org?.type || 'Autre' });
    const dd = getDesignMeta(autoDesign);
    const n: Template = { id: uid('t'), orgId, name: `Carte ${tpls.length+1}`, designId: dd.id, primaryColor: dd.primary, secondaryColor: dd.secondary, accentColor: dd.accent, elements: designElements(dd.id), createdAt: new Date().toISOString() };
    await db.upsertTemplate(templateToDb(n));
    await set({...data, templates:[...data.templates, n]});
    setSelTplId(n.id);
  };

  const upd = async (updates: Partial<Template>) => { if(!tpl) return; const updated = {...tpl,...updates}; await db.upsertTemplate(templateToDb(updated)); await set({...data, templates: data.templates.map(t => t.id===tpl.id ? updated : t)}); };

  if (!org) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-extrabold text-gray-900">Modèles — {org.name}</h2><p className="text-sm text-gray-500 mt-0.5">{tpls.length} modèle(s) · 6 designs</p></div>
        <button onClick={addTpl} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-teal-600/20">➕ Nouveau modèle</button>
      </div>
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Vos modèles</h3>
          {tpls.map(t => {
            const dd = DESIGNS.find(d => d.id === t.designId);
            return (
              <button key={t.id} onClick={() => setSelTplId(t.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${selTplId===t.id ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-200' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div><p className="font-bold text-gray-900 text-sm">{t.name}</p><p className="text-xs text-gray-500 mt-0.5">{dd?.name||t.designId}</p></div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full border" style={{background:t.primaryColor}}/><div className="w-4 h-4 rounded-full border" style={{background:t.accentColor}}/></div>
                </div>
              </button>
            );
          })}
          {tpls.length===0 && <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200"><div className="text-3xl mb-2">🎨</div><p className="text-sm">Aucun modèle</p></div>}
        </div>
        {tpl ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                {editTplName ? (
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <input value={tplNameDraft} onChange={e=>setTplNameDraft(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"/>
                    <button onClick={()=>{upd({name:tplNameDraft});setEditTplName(false);}} className="text-teal-600 hover:bg-teal-50 p-1.5 rounded-lg">💾</button>
                    <button onClick={()=>setEditTplName(false)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg">✕</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2"><h3 className="font-bold text-gray-900">{tpl.name}</h3><button onClick={()=>{setEditTplName(true);setTplNameDraft(tpl.name);}} className="text-gray-400 hover:text-blue-600">✏️</button></div>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={()=>setShowDesignPicker(!showDesignPicker)} className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">🎨 Changer design</button>
                  <button onClick={async()=>{if(confirm('Supprimer ce modèle ?')){await db.deleteTemplate(tpl.id);await set({...data,templates:data.templates.filter(t2=>t2.id!==tpl.id)});}setSelTplId('');}} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {([['Couleur primaire','primaryColor'],['Couleur secondaire','secondaryColor'],['Couleur accent','accentColor']] as const).map(([lbl,key]) => (
                  <label key={key} className="block"><span className="text-xs font-semibold text-gray-600 block mb-1">{lbl}</span>
                    <div className="flex items-center gap-2"><input type="color" value={(tpl as any)[key]} onChange={e => upd({[key]:e.target.value})} className="w-9 h-9 rounded border cursor-pointer p-0.5"/><span className="text-xs text-gray-500 font-mono">{(tpl as any)[key]}</span></div>
                  </label>
                ))}
              </div>
            </div>
            {showDesignPicker && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900">Choisir un design</h3><button onClick={()=>setShowDesignPicker(false)} className="text-gray-400 hover:text-gray-600">✕</button></div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {DESIGNS.map(d => (
                    <button key={d.id} onClick={()=>{upd({designId:d.id,primaryColor:d.primary,secondaryColor:d.secondary,accentColor:d.accent,elements:designElements(d.id)});setShowDesignPicker(false);}} className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${tpl.designId===d.id?'border-teal-500 bg-teal-50 ring-2 ring-teal-200':'border-gray-200 hover:border-gray-300'}`}>
                      <div className="text-3xl mb-2">{d.icon}</div>
                      <p className="font-bold text-gray-900 text-sm">{d.name} {tpl.designId===d.id && '✓'}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">👁️ Aperçu</h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button onClick={()=>setFace('front')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${face==='front'?'bg-white shadow text-gray-900':'text-gray-500'}`}>Face avant</button>
                  <button onClick={()=>setFace('back')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${face==='back'?'bg-white shadow text-gray-900':'text-gray-500'}`}>Face arrière</button>
                </div>
              </div>
              <div className="flex justify-center bg-gray-50 rounded-lg p-8">
                <CardRender tpl={tpl} member={sample} org={org} face={face} scale={0.85}/>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-gray-400"><div className="text-center"><div className="text-5xl mb-4 opacity-30">🎨</div><p className="font-medium text-gray-500">Sélectionnez un modèle</p><p className="text-sm mt-1">ou créez-en un nouveau</p></div></div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// GENERATE PAGE
// ═══════════════════════════════════════════════════════
function GenerateView({ data, orgId, org, selMembers, setSelMembers, genTplId, setGenTplId, generating, setGenerating }: { data: AppData; orgId: string; org?: Org; selMembers: Set<string>; setSelMembers: (s:Set<string>)=>void; genTplId: string; setGenTplId: (s:string)=>void; generating: boolean; setGenerating: (b:boolean)=>void }) {
  const mbs = data.members.filter(m => m.orgId === orgId);
  const tpls = data.templates.filter(t => t.orgId === orgId);
  const tplId = genTplId || tpls[0]?.id || '';
  const tpl = tpls.find(t => t.id === tplId);
  const sel = mbs.filter(m => selMembers.has(m.id));

  const toggle = (id: string) => { const s = new Set(selMembers); if(s.has(id)) s.delete(id); else s.add(id); setSelMembers(s); };
  const selAll = () => setSelMembers(new Set(mbs.map(m=>m.id)));
  const desel = () => setSelMembers(new Set());

  const dlCard = useCallback(async (mid: string, face: Face) => {
    const el = document.getElementById(`gen-${mid}-${face}`);
    if(!el) return;
    try { const url = await toPng(el, { quality:1, pixelRatio:2 }); const m = mbs.find(x=>x.id===mid); const a=document.createElement('a'); a.href=url; a.download=`${m?.memberNo||'carte'}-${face}.png`; a.click(); } catch(e) { console.error(e); }
  }, [mbs]);

  const dlAll = async () => {
    setGenerating(true);
    for (const m of sel) { await dlCard(m.id,'front'); await new Promise(r=>setTimeout(r,300)); await dlCard(m.id,'back'); await new Promise(r=>setTimeout(r,300)); }
    setGenerating(false);
  };

  if(!org) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-xl font-extrabold text-gray-900">Générer — {org.name}</h2><p className="text-sm text-gray-500 mt-0.5">{sel.length}/{mbs.length} sélectionné(s)</p></div>
        {sel.length > 0 && tpl && (
          <div className="flex items-center gap-3">
            <button onClick={dlAll} disabled={generating} className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">{generating ? '⏳ Génération...' : '📥 Télécharger tout'}</button>
            <button onClick={()=>window.print()} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-teal-600/20">🖨️ Imprimer</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-3">Modèle de carte</h3>
        {tpls.length === 0 ? <p className="text-sm text-gray-500">Aucun modèle. Créez-en un dans "Modèles de carte".</p> : (
          <div className="flex gap-3 flex-wrap">
            {tpls.map(t => (
              <button key={t.id} onClick={()=>setGenTplId(t.id)} className={`px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${tplId===t.id?'border-teal-500 bg-teal-50 text-teal-700':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{background:t.primaryColor}}/>{t.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Sélectionner les membres</h3>
          <div className="flex gap-2"><button onClick={selAll} className="text-xs text-teal-600 hover:underline font-medium">Tout sélectionner</button><span className="text-gray-300">|</span><button onClick={desel} className="text-xs text-gray-500 hover:underline font-medium">Désélectionner</button></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {mbs.map(m => (
            <button key={m.id} onClick={()=>toggle(m.id)} className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${selMembers.has(m.id)?'bg-teal-50 border-teal-300':'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
              <span className="text-lg">{selMembers.has(m.id)?'☑️':'⬜'}</span>
              <div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{m.fullName} {m.firstName}</p><p className="text-xs text-gray-500">{m.memberNo}</p></div>
            </button>
          ))}
        </div>
      </div>
      {tpl && sel.length > 0 && (
        <div className="space-y-8">
          <h3 className="font-bold text-gray-900 text-lg">Aperçu ({sel.length} carte{sel.length>1?'s':''})</h3>
          {sel.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div><p className="font-bold text-gray-900">{m.fullName} {m.firstName}</p><p className="text-sm text-gray-500">{m.memberNo}</p></div>
                <div className="flex gap-2"><button onClick={()=>dlCard(m.id,'front')} className="text-xs text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 font-medium">↓ Avant</button><button onClick={()=>dlCard(m.id,'back')} className="text-xs text-teal-600 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 font-medium">↓ Arrière</button></div>
              </div>
              <div className="flex gap-6 flex-wrap justify-center">
                <div><p className="text-xs text-gray-500 mb-2 text-center font-medium">Face avant</p><div id={`gen-${m.id}-front`}><CardRender tpl={tpl} member={m} org={org} face="front" scale={0.75}/></div></div>
                <div><p className="text-xs text-gray-500 mb-2 text-center font-medium">Face arrière</p><div id={`gen-${m.id}-back`}><CardRender tpl={tpl} member={m} org={org} face="back" scale={0.75}/></div></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tpl && sel.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200"><div className="text-5xl mb-4 opacity-30">🖨️</div><p className="font-medium text-gray-500">Sélectionnez des membres</p></div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════
function SettingsView({ data, isSA, cloudStatus }: { data: AppData; isSA: boolean; cloudStatus: string }) {
  const [showDanger, setShowDanger] = useState(false);
  const exportData = () => { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download=`mcs-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); };
  const importData = () => {
    const inp=document.createElement('input'); inp.type='file'; inp.accept='.json';
    inp.onchange=()=>{const f=inp.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result as string);if(d.organizations&&d.members&&d.templates){localStorage.setItem(SK,JSON.stringify(d));window.location.reload();}else alert('Format invalide');}catch{alert('Erreur de lecture');}};r.readAsText(f);};
    inp.click();
  };
  const reset = () => { if(confirm('⚠️ Supprimer toutes les données ?')) if(confirm('Dernière confirmation.')) { localStorage.removeItem(SK); sessionStorage.removeItem(SSK); window.location.reload(); } };

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h2 className="text-xl font-extrabold text-gray-900">Paramètres</h2><p className="text-sm text-gray-500 mt-0.5">Configuration et gestion</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4"><div className="text-3xl">⚙️</div><div><h3 className="font-bold text-gray-900">Member Card Studio</h3><p className="text-sm text-gray-500">Version 2.0 — React + Tailwind + Supabase</p></div></div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-lg text-center"><p className="text-2xl font-extrabold text-gray-900">{data.organizations.length}</p><p className="text-xs text-gray-500 mt-0.5">Organisations</p></div>
          <div className="p-4 bg-gray-50 rounded-lg text-center"><p className="text-2xl font-extrabold text-gray-900">{data.members.length}</p><p className="text-xs text-gray-500 mt-0.5">Membres</p></div>
          <div className="p-4 bg-gray-50 rounded-lg text-center"><p className="text-2xl font-extrabold text-gray-900">{data.templates.length}</p><p className="text-xs text-gray-500 mt-0.5">Modèles</p></div>
        </div>
      </div>
      {/* Cloud status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2"><span className="text-xl">☁️</span><h3 className="font-bold text-gray-900">Synchronisation Cloud</h3></div>
        <p className="text-sm text-gray-500 mb-3">
          Statut : <strong className={cloudStatus === 'synced' ? 'text-emerald-600' : cloudStatus === 'syncing' ? 'text-amber-600' : cloudStatus === 'error' ? 'text-red-600' : 'text-gray-600'}>
            {cloudStatus === 'synced' ? '✅ Synchronisé' : cloudStatus === 'syncing' ? '🔄 Synchronisation...' : cloudStatus === 'error' ? '❌ Erreur' : '💾 Local seulement'}
          </strong>
        </p>
        {!db.isSupabaseConfigured() && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm">
            <p className="font-semibold text-amber-800 mb-2">⚠️ Supabase non configuré</p>
            <p className="text-amber-700 mb-2">Pour synchroniser vos données sur tous vos appareils :</p>
            <ol className="list-decimal list-inside text-amber-700 space-y-1 text-xs">
              <li>Créez un compte gratuit sur <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a></li>
              <li>Créez un nouveau projet</li>
              <li>Copiez l'URL du projet et la clé <strong>Publishable</strong> depuis Settings → API Keys</li>
              <li>Ajoutez dans les variables d'environnement Vercel :<br/>
                <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> et <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code></li>
              <li>Créez les tables SQL (voir documentation)</li>
            </ol>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2"><span className="text-xl">🔐</span><h3 className="font-bold text-gray-900">Session</h3></div>
        <p className="text-sm text-gray-500">Connecté en tant que : <strong className="text-gray-700">{isSA ? 'Super Administrateur' : 'Organisation'}</strong></p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4"><span className="text-xl">💾</span><div><h3 className="font-bold text-gray-900">Sauvegarde & Restauration</h3><p className="text-sm text-gray-500">Exportez ou importez vos données</p></div></div>
        <div className="flex gap-3"><button onClick={exportData} className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 font-medium">📥 Exporter (JSON)</button><button onClick={importData} className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 font-medium">📤 Importer</button></div>
      </div>
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <button onClick={()=>setShowDanger(!showDanger)} className="flex items-center gap-3 w-full text-left"><span className="text-xl">⚠️</span><div><h3 className="font-bold text-red-700">Zone dangereuse</h3><p className="text-sm text-gray-500">Actions irréversibles</p></div></button>
        {showDanger && <div className="mt-4 pt-4 border-t border-red-100"><button onClick={reset} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold">🗑️ Réinitialiser toutes les données</button><p className="text-xs text-red-500 mt-2">Cette action supprimera définitivement tout.</p></div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// GALLERY VIEW - Aperçu de tous les designs
// ═══════════════════════════════════════════════════════
function GalleryView({ data, orgId, org }: { data: AppData; orgId: string; org?: Org }) {
  const [previewDesign, setPreviewDesign] = useState<DesignId>('corporate');
  const [previewFace, setPreviewFace] = useState<Face>('front');

  const sample: Member = data.members.find(m => m.orgId === orgId) || {
    id:'s', orgId, fullName:'KABONGO', firstName:'Jean-Pierre',
    memberNo: `${org?.prefix||'MBR'}-001`, category:'Membre actif', role:'Coordinateur',
    gender:'M', birthDate:'1990-05-15', birthPlace:'Kinshasa', nationality:'RD Congo',
    phone:'+243 810 000 001', email:'contact@org.cd', address:'Commune de Gombe, Kinshasa',
    status:'Actif', photo:'', issueDate:'2024-01-01', expiryDate:'2025-12-31', createdAt:''
  };

  const sampleOrg: Org = org || {
    id:'s', name:'Organisation Demo', type:'ONG', phone:'+243 810 000 000',
    email:'contact@demo.cd', address:'Av. Liberté 45, Kinshasa', pin:'0000',
    prefix:'DMO', logo:'', signature:'',
    legalText:'Cette carte est la propriété de l\'organisation. En cas de perte, prière de la retourner au siège social.',
    createdAt:''
  };

  const sampleTpl = (did: DesignId): Template => {
    const d = DESIGNS.find(x => x.id === did)!;
    return {
      id:'preview', orgId, name:'Preview', designId: did,
      primaryColor: d.primary, secondaryColor: d.secondary, accentColor: d.accent,
      elements: designElements(did), createdAt:''
    };
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">🖼️ Galerie des designs de cartes</h2>
        <p className="text-sm text-gray-500 mt-1">6 designs professionnels disponibles — chaque organisation peut avoir son propre style</p>
      </div>

      {/* Infos sur les éléments */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-6">
        <h3 className="font-bold text-teal-900 mb-3">📋 Éléments affichés sur chaque carte</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {[
            ['👤','Photo membre'],['🏢','Logo organisation'],['📛','Nom complet'],['👔','Fonction'],['🔢','N° membre'],
            ['📂','Catégorie'],['📅','Date naissance'],['🌍','Nationalité'],['📞','Téléphone'],['📍','Adresse'],
            ['✍️','Signature'],['📊','Code-barres'],['📱','QR Code'],['⏰','Expiration'],['📜','Texte juridique'],
          ].map(([icon, label]) => (
            <div key={label} className="bg-white/80 px-3 py-2 rounded-lg text-xs font-medium text-teal-800 flex items-center gap-1.5">
              <span>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>

      {/* Design selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DESIGNS.map(d => (
          <button
            key={d.id}
            onClick={() => { setPreviewDesign(d.id); setPreviewFace('front'); }}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
              previewDesign === d.id
                ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">{d.icon}</div>
            <p className="font-bold text-gray-900 text-sm">{d.name}</p>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{d.desc}</p>
            <div className="flex gap-1 mt-2">
              <div className="w-4 h-4 rounded-full border border-white shadow" style={{ background: d.primary }}/>
              <div className="w-4 h-4 rounded-full border border-white shadow" style={{ background: d.secondary }}/>
              <div className="w-4 h-4 rounded-full border border-white shadow" style={{ background: d.accent }}/>
            </div>
          </button>
        ))}
      </div>

      {/* Large preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {DESIGNS.find(d => d.id === previewDesign)?.icon} {DESIGNS.find(d => d.id === previewDesign)?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{DESIGNS.find(d => d.id === previewDesign)?.desc}</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setPreviewFace('front')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${previewFace === 'front' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Face avant
            </button>
            <button onClick={() => setPreviewFace('back')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${previewFace === 'back' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Face arrière
            </button>
          </div>
        </div>

        <div className="flex justify-center bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-10">
          <CardRender tpl={sampleTpl(previewDesign)} member={sample} org={sampleOrg} face={previewFace} scale={1}/>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Face avant contient</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>👤 Photo du membre (format passeport)</p>
              <p>🏢 Logo + Nom de l'organisation</p>
              <p>📛 Nom complet + Prénom en gros</p>
              <p>👔 Fonction / Rôle du membre</p>
              <p>🔢 Numéro de membre</p>
              <p>📅 Date de naissance + Nationalité</p>
              <p>📞 Téléphone + Adresse</p>
              <p>📊 Code-barres d'identification</p>
              <p>✍️ Zone de signature</p>
              <p>⏰ Date d'expiration</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Face arrière contient</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>🏢 Logo de l'organisation (grand format)</p>
              <p>📛 Nom de l'organisation</p>
              <p>📜 Texte juridique / Conditions</p>
              <p>📱 QR Code (scannable avec infos membre)</p>
              <p>📍 Adresse du siège social</p>
              <p>📞 Numéro du bureau</p>
              <p>📧 Email de l'organisation</p>
            </div>
          </div>
        </div>
      </div>

      {/* All designs comparison - show all 6 front faces */}
      <div>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4">📊 Comparaison des 6 designs (face avant)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESIGNS.map(d => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{d.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-[11px] text-gray-500">{d.desc}</p>
                </div>
              </div>
              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                <CardRender tpl={sampleTpl(d.id)} member={sample} org={sampleOrg} face="front" scale={0.55}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
