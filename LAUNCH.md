# ArtiPro — Lancement public

Ce document liste ce qui a été corrigé dans le code et **ce qu'il vous reste à faire** côté configuration / hébergement.

---

## ✅ Corrigé dans le code

- **Sécurité** : impossible de s'inscrire en `admin` via l'API
- **Rate limiting** : login, inscription, contact
- **Helmet** : headers HTTP de sécurité
- **SESSION_SECRET** : obligatoire en production (plus de `"cersei"`)
- **Mot de passe oublié** : `/mot-de-passe-oublie` + `/reinitialiser-mot-de-passe`
- **Cloudinary** : stockage images persistant si variables configurées (sinon disque local)
- **Page Contact** : `/contact`
- **AdminRoute** : pages admin protégées côté frontend
- **Filtre wilaya** sur la page Demandes
- **SEO** : titre, meta description, `lang="fr"`
- **Script admin** : `BackEnd/scripts/create-admin.js`

---

## 🔧 À faire de votre côté

### 1. MongoDB Atlas (production)

1. Créez un cluster sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Network Access → autorisez `0.0.0.0/0` (ou l'IP Railway)
3. Copiez l'URI de connexion dans `MONGO_URI` sur Railway

### 2. Backend Railway

Variables d'environnement à définir :

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
SESSION_SECRET=<générez 64 caractères aléatoires>
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=contact@artipro01.fr
CONTACT_EMAIL=contact@artipro01.fr
FRONTEND_URL=https://www.artipro01.fr
CORS_ORIGINS=https://artipro01.fr,https://www.artipro01.fr
PORT=3000
```

**Ne pas** mettre `MAIL_DEV_LOG=true` en production.

Générer un secret :
```bash
openssl rand -hex 32
```

### 3. Cloudinary (images — fortement recommandé)

1. Compte gratuit sur [cloudinary.com](https://cloudinary.com)
2. Dashboard → API Keys
3. Ajoutez sur Railway :

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Sans Cloudinary, les photos uploadées sur Railway **seront perdues** à chaque redéploiement.

### 4. Brevo (emails)

1. [app.brevo.com](https://app.brevo.com) → **Security** → **Authorized IPs**
2. Autorisez l'IP sortante de Railway **ou** désactivez le blocage IP
3. Vérifiez que `EMAIL_FROM` est une adresse validée chez Brevo

### 5. Frontend (Vercel / Netlify / Cloudflare Pages)

1. Connectez le repo `FrontEnd/`
2. Variable : `VITE_API_URL=https://artipro-production.up.railway.app`
3. Build : `npm run build` — Output : `dist`

### 6. Domaine

1. `artipro01.fr` → frontend (Vercel/Netlify)
2. Sous-domaine API ou Railway URL pour le backend
3. Mettez à jour `CORS_ORIGINS` et `FRONTEND_URL` si le domaine change

### 7. Créer le premier admin

Sur votre machine (avec accès à la base prod ou en local) :

```bash
cd BackEnd
node scripts/create-admin.js admin@artipro01.fr VotreMotDePasse123!
```

### 8. Emails de contact

Créez et surveillez :
- `contact@artipro01.fr` (ou votre domaine)
- `privacy@artipro01.fr` (mentionné dans les pages légales)

### 9. Contenu initial

- Connectez-vous en admin → **Catégories** : ajoutez plomberie, électricité, etc.
- Validez les premières candidatures **Artisan** dans **Candidatures**
- Testez un parcours complet : inscription client → demande → offre pro → message

### 10. Avant d'annoncer publiquement

- [ ] Test sur mobile (Chrome + Safari)
- [ ] Test mot de passe oublié avec un vrai email
- [ ] Test upload photo demande + avatar
- [ ] Vérifier les pages CGU / Confidentialité / Mentions légales (coordonnées réelles)
- [ ] Retirer `repomix-output.xml` du dépôt git si vous poussez sur GitHub

---

## Ordre recommandé

```
1. MongoDB Atlas
2. Railway (backend + variables)
3. Cloudinary
4. Brevo IP / SMTP
5. Frontend + domaine
6. Script create-admin
7. Tests manuels
8. Lancement beta (quelques utilisateurs)
9. Lancement public
```

---

## Support

En local, consultez `LOCAL.md`.  
En cas d'erreur email en dev : `MAIL_DEV_LOG=true` dans `BackEnd/.env`.
