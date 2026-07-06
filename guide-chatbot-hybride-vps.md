# Chatbot NRJKA — Configuration hybride (embeddings VPS + génération Mistral)

**Objectif.** Héberger l'**embedder** (BGE-M3) sur ton VPS IONOS et garder la **génération** sur l'API Mistral managée. C'est le meilleur compromis sans GPU : les embeddings sont gratuits et rapides en CPU, la génération reste de qualité et tient la charge.

**Architecture.**

```
Visiteur ─▶ Site (Netlify) ─▶ /api/chat
                               ├─ embeddings ─▶ https://ai.nrjka.com/v1  (VPS: Cloudflare Tunnel ▶ Caddy[token] ▶ Ollama/bge-m3)
                               └─ génération  ─▶ https://api.mistral.ai/v1 (managé)
```

**Prérequis :** accès SSH root au VPS IONOS · la zone `nrjka.com` déjà sur Cloudflare · le code à jour (client IA déjà séparé embeddings/génération).

---

## 1. Mistral (génération)

1. Crée un compte sur **https://console.mistral.ai** (entité européenne, données en UE).
2. **Billing** → ajoute un moyen de paiement (facturation à l'usage). Volume attendu = faible.
3. **API Keys** → *Create new key* → copie la clé (tu ne la reverras plus).
4. Modèle par défaut = `mistral-small-latest` (bon rapport qualité/prix). Rien à faire de plus.

➡️ Tu obtiens : `MISTRAL_API_KEY=...` (à mettre dans les variables d'env, étape 6).

---

## 2. VPS IONOS — préparer + installer Ollama

Connecte-toi : `ssh root@TON_IP_VPS`

```bash
# Mise à jour + petit swap de sécurité (8 Go de RAM, on évite l'OOM)
apt update && apt upgrade -y
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

Ollama écoute **par défaut sur 127.0.0.1:11434** (local uniquement) — c'est ce qu'on veut. On garde le modèle chargé en mémoire :

```bash
systemctl edit ollama
```

Ajoute dans l'éditeur qui s'ouvre :

```ini
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_KEEP_ALIVE=-1"
```

Puis :

```bash
systemctl daemon-reload && systemctl restart ollama
ollama pull bge-m3          # embedder multilingue FR/EN (~1,2 Go)

# Test local
curl http://127.0.0.1:11434/v1/embeddings \
  -H 'Content-Type: application/json' \
  -d '{"model":"bge-m3","input":["bonjour NRJKA"]}'
```

Tu dois voir un JSON avec un long tableau `embedding`. ✅

> ⚠️ Ne bind **jamais** Ollama sur `0.0.0.0` : il n'a aucune authentification. L'accès public passe obligatoirement par le reverse proxy (étape 3).

---

## 3. Reverse proxy Caddy — authentification par token

On place Caddy devant Ollama pour exiger un jeton secret.

```bash
# Génère un token une bonne fois (garde-le)
openssl rand -hex 32     # ex. 9f3a...  ← c'est ton AI_EMBED_API_KEY

# Installe Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy
```

Édite `/etc/caddy/Caddyfile` (remplace tout le contenu par) :

```caddy
# Écoute en local ; Cloudflare Tunnel s'en charge côté public (TLS à la périphérie).
:8080 {
    @unauth not header Authorization "Bearer REMPLACE_PAR_TON_TOKEN"
    respond @unauth "Unauthorized" 401
    reverse_proxy 127.0.0.1:11434
}
```

```bash
systemctl reload caddy
# Test : sans token => 401, avec token => embedding
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/v1/embeddings -d '{}'   # 401 attendu
```

---

## 4. Cloudflare — exposer `ai.nrjka.com` via un Tunnel (sans ouvrir de port)

Le Tunnel publie le service **sans ouvrir 443**, masque l'IP du VPS et gère le TLS.

```bash
# Installe cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
dpkg -i cloudflared.deb

cloudflared tunnel login                         # ouvre un lien : autorise la zone nrjka.com
cloudflared tunnel create nrjka-ai               # note le TUNNEL_ID affiché
cloudflared tunnel route dns nrjka-ai ai.nrjka.com   # crée le CNAME proxifié automatiquement
```

Crée `/root/.cloudflared/config.yml` :

```yaml
tunnel: TON_TUNNEL_ID
credentials-file: /root/.cloudflared/TON_TUNNEL_ID.json
ingress:
  - hostname: ai.nrjka.com
    service: http://127.0.0.1:8080
  - service: http_status:404
```

Lance-le en service :

```bash
cloudflared --config /root/.cloudflared/config.yml service install
systemctl enable --now cloudflared
```

**Test depuis n'importe où :**

```bash
# Sans token → 401
curl -s -o /dev/null -w "%{http_code}\n" https://ai.nrjka.com/v1/embeddings -d '{}'

# Avec token → embedding
curl https://ai.nrjka.com/v1/embeddings \
  -H "Authorization: Bearer TON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"bge-m3","input":["bonjour NRJKA"]}'
```

> **Alternative sans Tunnel** (si tu préfères ouvrir le port 443) : mets un vrai nom de domaine dans le Caddyfile pour le TLS auto (Let's Encrypt), ouvre 443 au firewall, et règle le DNS Cloudflare en *proxied* + SSL « Full (strict) » avec un certificat d'origine. Le Tunnel évite tout ça.

---

## 5. Variables d'environnement (local + Netlify)

**En hybride, on garde la génération managée et on ajoute uniquement l'embedder VPS.**

| Variable | Valeur | Où |
|---|---|---|
| `MISTRAL_API_KEY` | clé Mistral (étape 1) | local + Netlify |
| `AI_EMBED_BASE_URL` | `https://ai.nrjka.com/v1` | local + Netlify |
| `AI_EMBED_API_KEY` | ton token Caddy (étape 3) | local + Netlify |
| `AI_EMBED_MODEL` | `bge-m3` | local + Netlify |
| `REINDEX_SECRET` | un secret au hasard | local + Netlify |

- **Local** : dans `.env` (voir `.env.example`, section « Option C : HYBRIDE »).
- **Netlify** : *Site settings → Environment variables* → ajoute les 5, puis redéploie.

---

## 6. Déploiement (schéma + réindexation)

Les deux nouvelles collections (`knowledge-chunks`, `chat-conversations`) créent des tables.

```bash
# 1) Sync du schéma en local : passe push:true dans src/payload.config.ts
pnpm dev                      # réponds « create » aux invites Drizzle, puis coupe
#    remets push:false, puis :
pnpm generate:types

# 2) Migration pour la prod (Netlify tourne en push:false via `payload migrate`)
pnpm payload migrate:create add_chatbot_collections
#    commit le fichier de migration généré

# 3) Peupler la base de connaissances (embeddings via le VPS)
#    en dev :
open http://localhost:3000/reindex-kb
#    en prod (après déploiement) :
#    https://nrjka.com/reindex-kb?secret=TON_REINDEX_SECRET

# 4) Build + déploiement
pnpm build      # puis commit/push → Netlify déploie
```

---

## 7. Vérification

- `/reindex-kb` renvoie `{ ok: true, indexed: N }` avec N > 0.
- Admin Payload → groupe **IA** → **Base de connaissances (IA)** est peuplée.
- Le **widget de chat** apparaît en bas à gauche du site ; pose une question → réponse ancrée dans ton contenu, en streaming.
- Après acceptation du consentement, une entrée apparaît dans **Conversations du chatbot (IA)**.
- `journalctl -u ollama -f` et `journalctl -u cloudflared -f` pour surveiller le VPS.

---

## 8. Sécurité, coûts, maintenance

- **Sécurité** : Ollama en localhost seulement · token obligatoire au reverse proxy · Tunnel = IP masquée, aucun port ouvert · fais tourner le token si fuite.
- **Coûts** : embeddings = gratuits (VPS déjà payé) · génération Mistral = à l'usage (faible volume ; vérifie la grille sur console.mistral.ai).
- **Maintenance** : relance `/reindex-kb` après un gros ajout de contenu · `ollama pull bge-m3` de temps en temps · surveille la RAM (`htop`).
- **Durcissements à prévoir** (non inclus) : rate-limiting sur `/api/chat`, purge des conversations anciennes (rétention), et compléter la page `/confidentialite` (mention chatbot + durée de conservation).

---

## 9. Revenir au tout-managé (rollback)

Supprime les variables `AI_EMBED_*` sur Netlify (et en local) : les embeddings retombent automatiquement sur `mistral-embed` de l'API managée. **Relance ensuite `/reindex-kb`** (les vecteurs BGE-M3 et mistral-embed ne sont pas compatibles).
