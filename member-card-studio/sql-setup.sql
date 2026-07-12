-- ═══════════════════════════════════════════════════════
-- MEMBER CARD STUDIO - Configuration Base de Données
-- Supabase : https://zktgfbbrldwjnixfgwhw.supabase.co
-- ═══════════════════════════════════════════════════════

-- Supprimer les tables si elles existent déjà (optionnel)
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ═══════════════════════════════════════════════════════
-- TABLE 1: ORGANISATIONS
-- ══════════════════════════════════════════════════════
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

-- Index pour recherche rapide
CREATE INDEX idx_orgs_name ON organizations(name);
CREATE INDEX idx_orgs_type ON organizations(type);

-- ═══════════════════════════════════════════════════════
-- TABLE 2: MEMBRES
-- ══════════════════════════════════════════════════════
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

-- Index pour recherche rapide
CREATE INDEX idx_members_org ON members(org_id);
CREATE INDEX idx_members_name ON members(full_name, first_name);
CREATE INDEX idx_members_no ON members(member_no);
CREATE INDEX idx_members_status ON members(status);

-- ═══════════════════════════════════════════════════════
-- TABLE 3: MODÈLES DE CARTES
-- ═══════════════════════════════════════════════════════
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

-- Index pour recherche rapide
CREATE INDEX idx_templates_org ON templates(org_id);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════
-- POLITIQUES D'ACCÈS
-- Pour démo : accès public en lecture/écriture
-- En production : restreindre selon l'utilisateur connecté
-- ═══════════════════════════════════════════════════════

-- Organisations : tout le monde peut tout faire (démo)
CREATE POLICY "public_orgs_select" ON organizations FOR SELECT USING (true);
CREATE POLICY "public_orgs_insert" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_orgs_update" ON organizations FOR UPDATE USING (true);
CREATE POLICY "public_orgs_delete" ON organizations FOR DELETE USING (true);

-- Membres : tout le monde peut tout faire (démo)
CREATE POLICY "public_members_select" ON members FOR SELECT USING (true);
CREATE POLICY "public_members_insert" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "public_members_update" ON members FOR UPDATE USING (true);
CREATE POLICY "public_members_delete" ON members FOR DELETE USING (true);

-- Templates : tout le monde peut tout faire (démo)
CREATE POLICY "public_templates_select" ON templates FOR SELECT USING (true);
CREATE POLICY "public_templates_insert" ON templates FOR INSERT WITH CHECK (true);
CREATE POLICY "public_templates_update" ON templates FOR UPDATE USING (true);
CREATE POLICY "public_templates_delete" ON templates FOR DELETE USING (true);

-- ═══════════════════════════════════════════════════════
-- DONNÉES DE TEST (Optionnel - à commenter en production)
-- ═══════════════════════════════════════════════════════
-- Les données sont gérées par l'application directement
-- Le projet est 100% VIERGE au premier lancement

-- ═══════════════════════════════════════════════════════
-- VÉRIFICATION
-- ══════════════════════════════════════════════════════
-- Pour vérifier que les tables sont créées :
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Pour vérifier les politiques RLS :
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ═══════════════════════════════════════════════════════
-- FIN DU SCRIPT
-- ═══════════════════════════════════════════════════════
