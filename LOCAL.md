# ArtiPro — Tests en local

## Prérequis

- Node.js 18+
- MongoDB (local **ou** cluster Atlas — déjà configuré dans `BackEnd/.env`)

## 1. Installation (une seule fois)

```powershell
# Backend
cd f:\ArtiPro\BackEnd
npm install

# Frontend
cd f:\ArtiPro\FrontEnd
npm install
```

## 2. Configuration

### Backend — `BackEnd/.env`

```env
MONGO_URI=mongodb://localhost:27017/ArtiPro
SESSION_SECRET=une-cle-secrete
PORT=3000
```

### Frontend — `FrontEnd/.env`

Laissez le fichier vide en local : le proxy Vite redirige vers le backend (cookies de session OK).

Pour la production :

```env
VITE_API_URL=https://artipro-production.up.railway.app
```

## 3. Démarrer les serveurs

**Terminal 1 — Backend**

```powershell
cd f:\ArtiPro\BackEnd
npm run dev
```

Attendez : `Serveur mongodb connecté avec succès` et `Server is running at http://localhost:3000`

**Terminal 2 — Frontend**

```powershell
cd f:\ArtiPro\FrontEnd
npm run dev
```

Ouvrez : **http://localhost:5173**

## 4. Comptes de test

Créez des comptes via **Inscription** (`/SignIn`) :

| Rôle   | Usage                                      |
|--------|--------------------------------------------|
| Client | Publier des demandes, accepter des offres  |
| Pro    | Envoyer des offres (validation admin)      |
| Admin  | Gérer users, catégories, candidatures      |

## 5. Vérifications rapides

| Test                    | URL / action                          |
|-------------------------|---------------------------------------|
| API backend             | http://localhost:3000/categories      |
| Accueil                 | http://localhost:5173                 |
| Inscription / Login     | http://localhost:5173/SignIn          |
| Demandes (connecté)     | http://localhost:5173/demandes        |

## 6. Problèmes fréquents

**La connexion ne marche pas en local**

- `FrontEnd/.env` doit être **vide** (pas `localhost:3000`)
- Redémarrez backend + frontend après modification
- Backend sur port 3000, frontend sur 5173

**Erreur MongoDB**

- Vérifiez que MongoDB tourne (local) ou que l’URL Atlas est correcte
- Vérifiez votre IP autorisée sur Atlas (Network Access)

**Session / login ne marche pas**

- Backend sur port **3000**, frontend sur **5173**
- Ne pas utiliser `NODE_ENV=production` en local

**Images (avatars, photos) ne s’affichent pas**

- Le backend doit tourner sur `http://localhost:3000`
- Dossiers : `BackEnd/public/images/avatars/` et `.../posts/`
