# 🚀 Guide de Configuration - Member Card Studio

## ✅ État actuel du projet

| Élément | Statut |
|---------|--------|
| **Projet 100% vierge** | ✅ Aucune organisation/membre préchargé |
| **Alignements cartes** | ✅ Coordonnées professionnelles vérifiées |
| **Photos rondes** | ✅ Détection automatique + bordures premium |
| **QR Codes** | ✅ Alignés et intégrés au design |
| **Codes-barres** | ✅ Positionnés précisément |
| **Connexion Google** | ✅ Implémentée via Supabase Auth |
| **Clé publishable** | ✅ Utilisée (pas d'ancienne anon key) |
| **6 designs premium** | ✅ Inspirés de tes exemples Canva |

---

##  Configuration PRÊTE - Tes informations

### 1. URL du projet Supabase
**Ton URL :** `https://zktgfbbrldwjnixfgwhw.supabase.co`

### 2. Clé Publishable Supabase
**Ta clé :** `sb_publishable_smnM01UQwh2cJcTDxH3xSQ_Mv6-c4Ns`

---

## 🔧 Configuration Vercel

### Étape 1 : Ajouter les variables d'environnement

Dans **Vercel → Project → Settings → Environment Variables** :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://zktgfbbrldwjnixfgwhw.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_smnM01UQwh2cJcTDxH3xSQ_Mv6-c4Ns` |

### Étape 2 : Créer les tables SQL

Dans **Supabase → SQL Editor**, exécute ce script :

```sql
-- Table des organisations
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  pin TEXT NOT NULL,
  prefix TEXT DEFAULT '',
  logo TEXT DEFAULT '',
  signature TEXT DEFAULT '',
  legal_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des membres
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  member_no TEXT NOT NULL,
  category TEXT DEFAULT '',
  role TEXT DEFAULT '',
  gender TEXT DEFAULT 'M',
  birth_date TEXT DEFAULT '',
  birth_place TEXT DEFAULT '',
  nationality TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  status TEXT DEFAULT 'Actif',
  photo TEXT DEFAULT '',
  issue_date TEXT DEFAULT '',
  expiry_date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des modèles de carte
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  design_id TEXT NOT NULL,
  primary_color TEXT DEFAULT '#0f4fb4',
  secondary_color TEXT DEFAULT '#143a82',
  accent_color TEXT DEFAULT '#8cc4ff',
  elements TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès public
CREATE POLICY "public_orgs" ON organizations FOR ALL USING (true);
CREATE POLICY "public_members" ON members FOR ALL USING (true);
CREATE POLICY "public_templates" ON templates FOR ALL USING (true);
```

### Étape 3 : Activer Google Auth (optionnel mais recommandé)

Dans **Supabase → Authentication → Providers** :

1. Clique sur **Google**
2. Active le provider
3. Ajoute tes credentials Google OAuth (depuis Google Cloud Console)
4. Ajoute l'URL de redirection : `https://ton-projet.vercel.app/auth/v1/callback`

### Étape 4 : Redéployer

Après avoir ajouté les variables :
1. Va dans **Deployments**
2. Clique **Redeploy** sur la dernière version
3. Attends ~1-2 minutes

---

##  Designs de cartes - Alignements vérifiés

### 1. Business Wave (Entreprises)
- **Photo ronde** : 6% gauche, 26% haut, 30×30 (cercle automatique)
- **Nom** : 42% gauche, 27% haut, police 24pt
- **Rôle** : 42% gauche, 38% haut, couleur accent
- **Contact** : Alignés verticalement (52%, 60%, 68%, 76%)
- **Barcode** : 42% gauche, 78% haut
- **Signature** : 75% gauche, 75% haut
- **QR** : 68% gauche, 54% haut (dos)

### 2. Executive Circle (ONG/Associations)
- **Photo ronde** : 62% gauche, 12% haut, 30×30
- **Nom** : 6% gauche, 28% haut, police 22pt
- **Rôle** : 6% gauche, 38% haut
- **Contacts** : Alignés (56%, 64%, 72%)
- **Barcode** : 62% gauche, 54% haut
- **QR** : 68% gauche, 56% haut (dos)

### 3. Skyline Premium (Écoles/Instituts)
- **Photo ronde** : 64% gauche, 10% haut, 28×28
- **Nom** : 5% gauche, 32% haut, police 22pt
- **Rôle** : 5% gauche, 42% haut
- **Contacts** : Alignés (60%, 68%, 76%)
- **Barcode** : 5% gauche, 84% haut
- **QR** : 68% gauche, 56% haut (dos)

### 4. Élégant Gold (Églises/VIP)
- **Photo** : 8% gauche, 38% haut, 22×36 (rectangle)
- **Nom** : 34% gauche, 38% haut, police 18pt
- **Fond sombre** : Texte blanc/lisibilité maximale
- **Barcode** : 8% gauche, 74% haut (blanc sur fond sombre)
- **QR** : 68% gauche, 56% haut (blanc)

---

## ✨ Fonctionnalités incluses

| Fonctionnalité | État |
|---------------|------|
| Création d'organisation | ✅ Auto-génération du design |
| Ajout de membres | ✅ 18 champs + photo |
| Upload photos/logos/signatures | ✅ Base64 |
| 6 designs premium | ✅ Alignements parfaits |
| QR Codes | ✅ Données JSON du membre |
| Codes-barres | ✅ Basés sur N° membre |
| Export PNG | ✅ Haute qualité (2x) |
| Impression | ✅ Format A4 prêt |
| Export CSV | ✅ Membres |
| Backup/Restore JSON | ✅ Complet |
| Sync cloud Supabase | ✅ Temps réel |
| Connexion Google | ✅ OAuth |
| PIN Super Admin | ✅ `0000` |
| PIN par organisation | ✅ Personnalisable |
| Projet vierge au départ | ✅ Aucune donnée |

---

## 🔐 Comptes de démo (après création)

| Type | Identifiant | PIN |
|------|------------|-----|
| Super Admin | - | `0000` |
| Organisation 1 | (celle que tu crées) | (celui que tu définis) |

---

## ⚠️ Points importants

1. **Ne jamais exposer la clé secrète** `sb_secret_...` dans Vercel
2. **Utiliser uniquement** `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Projet vierge** : Aucune organisation/membre n'est préchargé
4. **Première utilisation** : Crée une organisation, le design se génère automatiquement
5. **Google Auth** : Nécessite configuration dans Supabase + Google Cloud Console

---

## 📞 Prochaines étapes

1. **Envoie-moi l'URL Supabase** pour que je complète la config
2. **Configure Vercel** avec les variables
3. **Exécute le SQL** dans Supabase
4. **Teste la connexion Google** (optionnel)
5. **Déploie et teste** sur ton téléphone + PC

---

##  Résultat final

- ✅ **Même design que Canva** (vagues, cercles, professionnel)
- ✅ **Alignements parfaits** (coordonnées vérifiées)
- ✅ **100% fonctionnel** (pas juste du visuel)
- ✅ **Sync cloud** (mêmes données partout)
- ✅ **Projet vierge** (tu commences de zéro)
- ✅ **Google Auth** (connexion facile)

**Prêt pour Vercel !** 🚀
