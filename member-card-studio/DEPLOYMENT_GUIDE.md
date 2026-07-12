# 🚀 Guide de Déploiement - GitHub + Vercel

## ⏱️ Temps estimé : 5-7 minutes

---

## ÉTAPE 1 : Créer le Repository GitHub (2 min)

### 1.1 Connecte-toi à GitHub
- Va sur : **https://github.com**
- Connecte-toi avec ton compte

### 1.2 Crée un nouveau repository
1. Clique sur le **"+"** en haut à droite
2. Choisis **"New repository"**
3. Remplis :
   - **Repository name** : `member-card-studio`
   - **Description** : "Système de cartes PVC professionnel"
   - **Public** ou **Private** (au choix)
   - ❌ **NE PAS** cocher "Initialize with README"
4. Clique **"Create repository"**

### 1.3 Upload les fichiers
Tu as 2 options :

#### Option A : Upload via l'interface (plus simple)
1. Sur la page du repo, clique **"uploading an existing file"**
2. **Glisse-dépose TOUS les fichiers** de ton projet :
   ```
   src/
   dist/
   public/
   index.html
   package.json
   package-lock.json
   tsconfig.json
   vite.config.ts
   .gitignore
   .env.example
   vercel.json
   sql-setup.sql
   README_FINAL.md
   DEPLOYMENT_GUIDE.md
   ```
3. Ajoute un message : "Initial commit - Member Card Studio"
4. Clique **"Commit changes"**

#### Option B : Via Git (si tu connais)
```bash
git init
git add .
git commit -m "Initial commit - Member Card Studio"
git branch -M main
git remote add origin https://github.com/TON_USER/member-card-studio.git
git push -u origin main
```

---

## ÉTAPE 2 : Connecter Vercel à GitHub (2 min)

### 2.1 Va sur Vercel
- **https://vercel.com**
- Connecte-toi avec **GitHub** (recommandé)

### 2.2 Importe le projet
1. Clique **"Add New Project"**
2. Sous "Import Git Repository", cherche **`member-card-studio`**
3. Clique **"Import"**

### 2.3 Configure le projet
1. **Project Name** : `member-card-studio` (ou ce que tu veux)
2. **Framework Preset** : Vercel détecte automatiquement **Vite** ✅
3. **Root Directory** : `./` (laisse tel quel)
4. **Build Command** : `npm run build` (déjà rempli)
5. **Output Directory** : `dist` (déjà rempli)

### 2.4 Ajoute les variables d'environnement
Clique **"Environment Variables"** puis **"Add"** :

| Nom | Valeur |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://zktgfbbrldwjnixfgwhw.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_smnM01UQwh2cJcTDxH3xSQ_Mv6-c4Ns` |

Clique **"Add"** pour chaque variable.

### 2.5 Déploie !
1. Clique **"Deploy"**
2. Attends **1-2 minutes** ⏳
3. ✅ **"Deployment Ready"** !
4. Clique sur la vignette pour voir ton site en ligne

---

## ÉTAPE 3 : Configurer Supabase (2 min)

### 3.1 Ouvre Supabase
- **https://supabase.com**
- Va sur ton projet : `zktgfbbrldwjnixfgwhw`

### 3.2 Exécute le SQL
1. Clique **"SQL Editor"** (menu de gauche)
2. Clique **"New query"**
3. Ouvre le fichier `sql-setup.sql` (dans ton projet)
4. **Copie-colle TOUT le contenu**
5. Clique **"Run"** (ou Ctrl+Enter)
6. ✅ Tu devrais voir **"Success. No rows returned"**

### 3.3 Vérifie les tables
1. Clique **"Table Editor"** (menu de gauche)
2. Tu devrais voir 3 tables :
   - ✅ `organizations`
   - ✅ `members`
   - ✅ `templates`

---

## ÉTAPE 4 : Activer Google Auth (Optionnel - 2 min)

### 4.1 Dans Supabase
1. Va dans **Authentication** → **Providers**
2. Clique sur **Google**
3. Active **"Enable Sign in with Google"**

### 4.2 Dans Google Cloud Console
1. Va sur **https://console.cloud.google.com**
2. Crée un nouveau projet (ou utilise un existant)
3. Va dans **APIs & Services** → **Credentials**
4. Crée **OAuth 2.0 Client ID**
5. **Authorized redirect URIs** :
   ```
   https://zktgfbbrldwjnixfgwhw.supabase.co/auth/v1/callback
   https://ton-projet.vercel.app/auth/v1/callback
   ```
6. Copie **Client ID** et **Client Secret**
7. Colle-les dans Supabase (section Google)
8. Clique **"Save"**

---

## ÉTAPE 5 : Tester l'application (1 min)

### 5.1 Ouvre ton site Vercel
- URL : `https://member-card-studio-XXXX.vercel.app`

### 5.2 Première connexion
1. **Super Admin** → PIN : `0000`
2. OU **Google** (si activé)

### 5.3 Crée ta première organisation
1. Va dans **"Organisations"**
2. Clique **"Nouvelle organisation"**
3. Remplis :
   - Nom : "Ton Organisation"
   - Type : (choisis)
   - PIN : (choisis un code)
   - etc.
4. Clique **"Enregistrer"**
5. ✅ Le design se génère **automatiquement** !

### 5.4 Ajoute un membre
1. Va dans **"Membres"**
2. Clique **"Nouveau membre"**
3. Remplis les infos
4. Upload une photo (optionnel)
5. Clique **"Enregistrer"**

### 5.5 Génère une carte
1. Va dans **"Générer les cartes"**
2. Sélectionne ton membre
3. Choisis le modèle
4. Clique **"Télécharger"** ou **"Imprimer"**
5. ✅ **Carte PVC générée !**

---

## ✅ Checklist de Déploiement

| Étape | Statut |
|-------|--------|
| [ ] Repository GitHub créé |  |
| [ ] Fichiers uploadés |  |
| [ ] Projet importé sur Vercel |  |
| [ ] Variables d'environnement ajoutées |  |
| [ ] Déploiement réussi |  |
| [ ] Tables SQL créées dans Supabase |  |
| [ ] Google Auth activé (optionnel) |  |
| [ ] Test de connexion réussi |  |
| [ ] Première organisation créée |  |
| [ ] Première carte générée |  |

---

##  Dépannage

### Problème : "Supabase not configured"
**Solution :** Vérifie les variables dans Vercel
- Vercel → Project → Settings → Environment Variables
- Vérifie que `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont corrects
- Redéploie après modification

### Problème : "Table does not exist"
**Solution :** Exécute le script SQL
- Supabase → SQL Editor
- Copie-colle `sql-setup.sql`
- Clique "Run"

### Problème : "Build failed"
**Solution :** Vérifie le build local
```bash
npm run build
```
Si ça marche en local, vérifie les logs Vercel :
- Vercel → Deployments → Clique sur le déploiement → Voir les logs

### Problème : "Google Auth ne marche pas"
**Solution :** Vérifie les redirect URIs
- Dans Google Cloud Console
- Ajoute : `https://zktgfbbrldwjnixfgwhw.supabase.co/auth/v1/callback`
- Ajoute : `https://ton-projet.vercel.app/auth/v1/callback`

---

## 📱 Test Multi-Appareils

1. **Ouvre sur PC** → Crée une organisation
2. **Ouvre sur téléphone** → L'organisation apparaît ! ✅
3. **Ajoute un membre sur mobile** → Visible sur PC ! ✅

**La synchronisation cloud fonctionne !** 🎉

---

## 🎉 Félicitations !

Ton **Member Card Studio** est :
- ✅ En ligne sur Vercel
- ✅ Synchronisé avec Supabase
- ✅ Accessible depuis tous les appareils
- ✅ Prêt à générer des cartes PVC professionnelles !

**URL de ton site :** `https://member-card-studio-XXXX.vercel.app`

---

## 📞 Support

Si tu as un problème :
1. Vérifie les logs Vercel
2. Vérifie la console navigateur (F12)
3. Vérifie Supabase → Logs

**Bon déploiement !** 🚀
