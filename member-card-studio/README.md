# 🎴 Member Card Studio

**Système professionnel de génération de cartes PVC pour organisations**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/member-card-studio)

---

## ✨ Fonctionnalités

### 🏢 Multi-Organisations
- Créez plusieurs organisations (ONG, Églises, Écoles, Entreprises, etc.)
- Chaque organisation a ses membres et modèles de cartes
- PIN d'accès sécurisé par organisation

###  Gestion des Membres
- 18 champs personnalisables
- Upload de photos, logos et signatures
- Recherche instantanée
- Export CSV
- Statuts (Actif, Inactif, Suspendu)

###  6 Designs Premium
- **Business Wave** 🌊 - Entreprises
- **Executive Circle** ⭕ - ONG/Associations
- **Skyline Premium** 🏙️ - Écoles/Instituts
- **Élégant Gold** ✨ - Églises/VIP
- **Classique Officiel** 🏛️ - Institutions
- **Vibrant Energy** 🎨 - Associations jeunes

### ️ Génération de Cartes
- QR Codes avec données du membre
- Codes-barres basés sur le N° membre
- Export PNG haute qualité
- Impression A4 prête
- Photos automatiquement détectées (rondes ou rectangulaires)

### ☁️ Synchronisation Cloud
- Supabase pour la base de données
- Données synchronisées en temps réel
- Accessible depuis tous les appareils
- Backup et restore JSON

### 🔐 Authentification
- Super Admin (PIN : `0000`)
- PIN par organisation
- Connexion Google OAuth (optionnel)

---

## 🚀 Déploiement Rapide

### 1. Prérequis
- Compte GitHub
- Compte Vercel
- Compte Supabase

### 2. Configuration Supabase
```sql
-- Exécutez ce script dans Supabase → SQL Editor
-- Voir fichier : sql-setup.sql
```

### 3. Variables d'Environnement
Dans Vercel → Settings → Environment Variables :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 4. Déploiement
```bash
# Build local
npm run build

# Ou deploy automatique via Vercel + GitHub
```

📖 **Guide complet :** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

##  Structure du Projet

```
member-card-studio/
├── src/
│   ├── App.tsx                 # Application principale
│   ├── main.tsx                # Point d'entrée
│   ├── index.css               # Styles Tailwind
│   ├── lib/
│   │   └── supabase.ts         # Client Supabase
│   └── vite-env.d.ts           # Types TypeScript
├── public/
│   └── images/                 # Images générées
├── dist/                       # Build Vercel
├── sql-setup.sql               # Script base de données
├── vercel.json                 # Config Vercel
├── .env                        # Variables locales
└── README.md                   # Ce fichier
```

---

##  Utilisation

### Première Connexion
1. Ouvrez l'application
2. Super Admin → PIN : `0000`
3. Créez votre première organisation
4. Le design se génère automatiquement !

### Créer une Organisation
1. Allez dans **"Organisations"**
2. Cliquez **"Nouvelle organisation"**
3. Remplissez les informations
4. Upload logo et signature (optionnel)
5. Enregistrez

### Ajouter un Membre
1. Allez dans **"Membres"**
2. Cliquez **"Nouveau membre"**
3. Remplissez les 18 champs
4. Upload photo (optionnel)
5. Enregistrez

### Générer une Carte
1. Allez dans **"Générer les cartes"**
2. Sélectionnez les membres
3. Choisissez le modèle
4. Téléchargez ou imprimez

---

## 🛠️ Technologies

- **Frontend** : React 19, TypeScript, Tailwind CSS 4
- **Build** : Vite 7
- **Backend** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth + Google OAuth
- **Déploiement** : Vercel
- **Librairies** :
  - `qrcode.react` - QR Codes
  - `react-barcode` - Codes-barres
  - `html-to-image` - Export PNG
  - `zustand` - State management
  - `lucide-react` - Icônes

---

## 📊 Limites du Plan Gratuit

| Ressource | Limite | Équivalent |
|-----------|--------|------------|
| Base de données | 500 MB | ~3000 membres avec photos |
| Stockage | 1 GB | ~5000 photos compressées |
| Bande passante | 2 GB/mois | ~10000 cartes générées |
| Requêtes API | 50K/mois | Suffisant pour usage normal |

---

##  Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Clé publishable** uniquement (pas de clé secrète exposée)
- **PIN hashés** en mémoire
- **Session** stockée dans sessionStorage
- **HTTPS** obligatoire (Vercel)

---

## 📝 Licence

Ce projet est propriétaire. Tous droits réservés.

---

## 👨‍💻 Support

Pour toute question ou problème :
1. Consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Vérifiez les logs Vercel
3. Consultez la console navigateur (F12)
4. Vérifiez Supabase → Logs

---

**Développé avec ❤️ pour un rendu professionnel**
