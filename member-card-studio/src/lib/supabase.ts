import { createClient } from '@supabase/supabase-js';

// Clés Supabase côté navigateur
// Utilise en priorité la nouvelle publishable key (sb_publishable_*).
// Compatibilité conservée avec l'ancienne variable ANON_KEY si nécessaire.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zktgfbbrldwjnixfgwhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

export const isSupabaseConfigured = () => !!supabase;

// Types pour la base de données
export interface DbOrganization {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  pin: string;
  prefix: string;
  logo: string;
  signature: string;
  legal_text: string;
  created_at: string;
}

export interface DbMember {
  id: string;
  org_id: string;
  full_name: string;
  first_name: string;
  member_no: string;
  category: string;
  role: string;
  gender: string;
  birth_date: string;
  birth_place: string;
  nationality: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  photo: string;
  issue_date: string;
  expiry_date: string;
  created_at: string;
}

export interface DbTemplate {
  id: string;
  org_id: string;
  name: string;
  design_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  elements: string; // JSON stringified
  created_at: string;
}

// ─── AUTH GOOGLE ───────────────────────────────────────
export async function signInWithGoogle() {
  if (!supabase) return { error: new Error('Supabase not configured') };
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });
}

export async function signOut() {
  if (!supabase) return { error: new Error('Supabase not configured') };
  return await supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

// Fonctions CRUD pour Organizations
export async function fetchOrganizations(): Promise<DbOrganization[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
  if (error) { console.error('Fetch orgs error:', error); return []; }
  return data || [];
}

export async function upsertOrganization(org: DbOrganization): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('organizations').upsert(org);
  if (error) { console.error('Upsert org error:', error); return false; }
  return true;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('organizations').delete().eq('id', id);
  if (error) { console.error('Delete org error:', error); return false; }
  return true;
}

// Fonctions CRUD pour Members
export async function fetchMembers(): Promise<DbMember[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
  if (error) { console.error('Fetch members error:', error); return []; }
  return data || [];
}

export async function upsertMember(member: DbMember): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('members').upsert(member);
  if (error) { console.error('Upsert member error:', error); return false; }
  return true;
}

export async function deleteMember(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) { console.error('Delete member error:', error); return false; }
  return true;
}

// Fonctions CRUD pour Templates
export async function fetchTemplates(): Promise<DbTemplate[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
  if (error) { console.error('Fetch templates error:', error); return []; }
  return data || [];
}

export async function upsertTemplate(template: DbTemplate): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('templates').upsert(template);
  if (error) { console.error('Upsert template error:', error); return false; }
  return true;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('templates').delete().eq('id', id);
  if (error) { console.error('Delete template error:', error); return false; }
  return true;
}

// Sync all data from Supabase
export async function syncFromCloud(): Promise<{ organizations: DbOrganization[]; members: DbMember[]; templates: DbTemplate[] } | null> {
  if (!supabase) return null;
  try {
    const [orgs, mems, tpls] = await Promise.all([
      fetchOrganizations(),
      fetchMembers(),
      fetchTemplates(),
    ]);
    return { organizations: orgs, members: mems, templates: tpls };
  } catch (e) {
    console.error('Sync from cloud error:', e);
    return null;
  }
}
