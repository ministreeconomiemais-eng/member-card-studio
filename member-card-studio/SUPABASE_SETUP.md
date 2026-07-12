# 🚀 Configuration Supabase pour Member Card Studio

## Étape 1 : Créer un compte Supabase (GRATUIT)

1. Va sur **https://supabase.com**
2. Clique sur "Start your project"
3. Connecte-toi avec GitHub ou Email
4. Crée un nouveau projet :
   - Nom : `member-card-studio`
   - Mot de passe base de données : (choisis un mot de passe fort)
   - Région : Choisir le plus proche de toi

## Étape 2 : Créer les tables

Dans le dashboard Supabase, va dans **SQL Editor** et exécute ce script :

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
  primary_color TEXT DEFAULT '#0f766e',
  secondary_color TEXT DEFAULT '#134e4a',
  accent_color TEXT DEFAULT '#f59e0b',
  elements TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Politiques pour permettre l'accès public (pour démo)
-- En production, tu voudras des politiques plus restrictives
CREATE POLICY "Allow all operations on organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true);
CREATE POLICY "Allow all operations on templates" ON templates FOR ALL USING (true);
```

## Étape 3 : Récupérer les clés API

1. Va dans **Settings** → **Clés API**
2. Copie :
   - **Project URL** → `https://xxxx.supabase.co`
   - **Clé publiable / Publishable key** → `sb_publishable_...`

> ⚠️ **N'utilise jamais la clé secrète `sb_secret_...` dans Vercel côté frontend.**
> Seule la clé **publishable** doit être utilisée dans ce projet.

## Étape 4 : Configurer Vercel

Dans ton projet Vercel, va dans **Settings** → **Environment Variables** et ajoute :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |

## Étape 5 : Redéployer

Après avoir ajouté les variables, redéploie ton projet Vercel.

---

## 🎉 C'est tout !

Une fois configuré, tes données seront automatiquement synchronisées :

- ✅ Organisations
- ✅ Membres (avec photos en base64)
- ✅ Modèles de cartes
- ✅ Logos et signatures

Tous les appareils verront les mêmes données en temps réel !

---

## ⚠️ Limites du plan gratuit Supabase

| Ressource | Limite gratuite |
|-----------|-----------------|
| Base de données | 500 MB |
| Stockage fichiers | 1 GB |
| Requêtes API | 50,000/mois |
| Bande passante | 2 GB/mois |

Pour une utilisation normale, c'est largement suffisant !
