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
EMAIL_FROM=malifaiz03@gmail.com
BREVO_API_KEY=xkeysib-...   # clé API (pas la clé SMTP) — recommandé sur Railway
FRONTEND_URL=https://www.artipro01.fr
CORS_ORIGINS=https://artipro01.fr,https://www.artipro01.fr
```

**Emails non reçus (code visible dans les logs Railway)**  
→ Le SMTP échoue depuis Railway. Ajoute **`BREVO_API_KEY`** :
1. Brevo → **SMTP & API** → **Clés API et MCP** → **Générer une clé**
2. Copie la clé `xkeysib-...` (différente de `xsmtpsib-...` SMTP)
3. Railway → Variables → `BREVO_API_KEY` = cette clé
4. `EMAIL_FROM` doit être **exactement** l’expéditeur vérifié chez Brevo (ex. `malifaiz03@gmail.com`)
5. Redéploie et regarde les logs : `[mail] Brevo API échec` ou `[mail] SMTP échec` indique l’erreur exacte

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
