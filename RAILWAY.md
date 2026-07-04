# Railway — dépannage crash

## Cause n°1 (la plus fréquente) : mauvais dossier

Railway doit déployer le dossier **`BackEnd`**, pas la racine du repo.

1. Railway → ton service backend → **Settings**
2. **Root Directory** → mets : `BackEnd`
3. **Start Command** → `npm start`
4. Redéploie (**Deploy**)

---

## Cause n°2 : variables manquantes

Railway met `NODE_ENV=production` automatiquement. Il **faut** au minimum :

| Variable | Exemple |
|----------|---------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ArtiPro` |
| `SESSION_SECRET` | 64 caractères aléatoires (`openssl rand -hex 32`) |

Optionnel mais recommandé :

```env
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=contact@artipro01.fr
FRONTEND_URL=https://www.artipro01.fr
CORS_ORIGINS=https://artipro01.fr,https://www.artipro01.fr
```

**Ne pas** mettre `MAIL_DEV_LOG=true` en production.

---

## Vérifier que ça marche

Après déploiement, ouvre dans le navigateur :

```
https://TON-URL-RAILWAY.up.railway.app/health
```

Tu dois voir : `{"status":"ok","service":"artipro-api"}`

Puis :

```
https://TON-URL-RAILWAY.up.railway.app/categories
```

---

## Lire les logs Railway

1. Railway → service → **Deployments**
2. Clique le dernier déploiement (rouge = crash)
3. Onglet **Deploy Logs**

Erreurs typiques :

| Message dans les logs | Solution |
|----------------------|----------|
| `Variables manquantes : SESSION_SECRET` | Ajoute `SESSION_SECRET` (32+ caractères) |
| `Variables manquantes : MONGO_URI` | Ajoute l'URI MongoDB Atlas |
| `Cannot find module` | Root Directory = `BackEnd` + redéployer |
| `Error connecting to MongoDB` | IP autorisée sur Atlas (0.0.0.0/0) |
| `SESSION_SECRET doit faire au moins 32` | Secret trop court |

---

## Générer SESSION_SECRET

Sur ton PC :

```bash
openssl rand -hex 32
```

Copie le résultat dans Railway → Variables → `SESSION_SECRET`.
