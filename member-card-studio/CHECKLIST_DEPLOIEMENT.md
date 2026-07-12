# ✅ Checklist de Déploiement

##  GitHub (2 min)

- [ ] Créer un compte GitHub (si pas déjà fait)
- [ ] Créer un nouveau repository : `member-card-studio`
- [ ] **NE PAS** cocher "Initialize with README"
- [ ] Upload TOUS les fichiers du projet
- [ ] Commit : "Initial commit - Member Card Studio"

**Fichiers à upload :**
```
✅ src/
✅ public/
✅ dist/
✅ index.html
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ vite.config.ts
✅ .gitignore
✅ .env (avec TES clés)
✅ .env.example
✅ vercel.json
✅ sql-setup.sql
✅ README.md
✅ README_FINAL.md
✅ DEPLOYMENT_GUIDE.md
✅ CHECKLIST_DEPLOIEMENT.md
```

---

##  Vercel (2 min)

- [ ] Aller sur https://vercel.com
- [ ] Se connecter avec GitHub
- [ ] Cliquer "Add New Project"
- [ ] Importer `member-card-studio`
- [ ] Vérifier : Framework = Vite ✅
- [ ] Vérifier : Build = `npm run build` ✅
- [ ] Vérifier : Output = `dist` ✅

### Variables d'Environnement
- [ ] Ajouter `VITE_SUPABASE_URL` = `https://zktgfbbrldwjnixfgwhw.supabase.co`
- [ ] Ajouter `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_smnM01UQwh2cJcTDxH3xSQ_Mv6-c4Ns`

### Déploiement
- [ ] Cliquer "Deploy"
- [ ] Attendre 1-2 minutes
- [ ] Vérifier : "Deployment Ready" ✅
- [ ] Noter l'URL : `https://member-card-studio-XXXX.vercel.app`

---

##  Supabase (2 min)

- [ ] Aller sur https://supabase.com
- [ ] Ouvrir le projet : `zktgfbbrldwjnixfgwhw`
- [ ] Cliquer "SQL Editor"
- [ ] Cliquer "New query"
- [ ] Ouvrir `sql-setup.sql`
- [ ] Copier-coller TOUT le contenu
- [ ] Cliquer "Run"
- [ ] Vérifier : "Success. No rows returned" ✅

### Vérification des Tables
- [ ] Cliquer "Table Editor"
- [ ] Vérifier : `organizations` ✅
- [ ] Vérifier : `members` ✅
- [ ] Vérifier : `templates` ✅

---

##  Google Auth (Optionnel - 2 min)

- [ ] Supabase → Authentication → Providers
- [ ] Activer "Google"
- [ ] Google Cloud Console → Créer OAuth 2.0 Client ID
- [ ] Ajouter redirect URIs :
  - [ ] `https://zktgfbbrldwjnixfgwhw.supabase.co/auth/v1/callback`
  - [ ] `https://ton-projet.vercel.app/auth/v1/callback`
- [ ] Copier Client ID + Client Secret dans Supabase
- [ ] Sauvegarder

---

##  Tests (2 min)

### Test 1 : Connexion
- [ ] Ouvrir `https://member-card-studio-XXXX.vercel.app`
- [ ] Super Admin → PIN : `0000`
- [ ] Vérifier : Dashboard s'affiche ✅

### Test 2 : Organisation
- [ ] Aller dans "Organisations"
- [ ] Cliquer "Nouvelle organisation"
- [ ] Remplir : Nom, Type, PIN, etc.
- [ ] Enregistrer
- [ ] Vérifier : Design auto-généré ✅

### Test 3 : Membre
- [ ] Aller dans "Membres"
- [ ] Cliquer "Nouveau membre"
- [ ] Remplir les infos
- [ ] Upload photo (optionnel)
- [ ] Enregistrer
- [ ] Vérifier : Membre dans la liste ✅

### Test 4 : Carte
- [ ] Aller dans "Générer les cartes"
- [ ] Sélectionner le membre
- [ ] Choisir le modèle
- [ ] Cliquer "Télécharger"
- [ ] Vérifier : PNG téléchargé ✅

### Test 5 : Sync Cloud
- [ ] Ouvrir sur un DEUXIÈME appareil (téléphone)
- [ ] Se connecter avec le même PIN
- [ ] Vérifier : L'organisation apparaît ✅
- [ ] Vérifier : Le membre apparaît ✅

---

##  Finalisation

- [ ] Mettre à jour `README.md` avec l'URL Vercel
- [ ] Mettre à jour `DEPLOYMENT_GUIDE.md` avec l'URL Vercel
- [ ] Sauvegarder les URLs quelque part
- [ ] Partager l'URL avec ton équipe (si besoin)

---

##  URLs à Noter

```
URL Vercel : https://____________________________________.vercel.app

URL Supabase : https://zktgfbbrldwjnixfgwhw.supabase.co

Repository GitHub : https://github.com/_______/member-card-studio
```

---

## ✅ Si Tout Est Coché

🎉 **FÉLICITATIONS !**

Ton **Member Card Studio** est :
- ✅ En ligne sur Vercel
- ✅ Synchronisé avec Supabase
- ✅ Accessible depuis tous les appareils
- ✅ Prêt à générer des cartes PVC professionnelles !

**Prochaine étape :** Commence à créer tes organisations et générer des cartes ! 🚀

---

##  En Cas de Problème

| Problème | Solution |
|----------|----------|
| Build failed | Vérifie logs Vercel + build local (`npm run build`) |
| Table does not exist | Réexécute `sql-setup.sql` dans Supabase |
| Supabase not configured | Vérifie variables Vercel |
| Google Auth ne marche pas | Vérifie redirect URIs dans Google Cloud |
| Sync ne marche pas | Vérifie que Supabase est connecté + tables créées |

---

**Bon déploiement !** 🚀
