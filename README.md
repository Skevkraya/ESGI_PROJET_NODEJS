# IoT Monitoring API

API de monitoring IoT pour smart home - Projet final Node.js & MongoDB.

## Prérequis

- Node.js 24 LTS
- pnpm
- Docker (pour MongoDB)

## Installation

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Installer les dépendances
pnpm install

# 3. Lancer MongoDB
docker compose up -d

# 4. Lancer le serveur en mode développement
pnpm watch
```

## Vérification

```bash
curl http://localhost:3000/ping
# Réponse attendue : { "ok": true }
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm start` | Lance le serveur |
| `pnpm watch` | Lance le serveur en mode watch (développement) |
| `pnpm typecheck` | Vérifie les types TypeScript |
| `pnpm simulate:device` | Simule un device IoT |
| `pnpm admin:approve-device <deviceId>` | Approuve un device |
| `pnpm admin:revoke-device <deviceId>` | Révoque un device |
| `pnpm db:reset` | Remet à zéro la base de données |

## Structure du projet

```
src/
├── app.ts                  # Configuration Express
├── server.ts               # Point d'entrée
├── db.ts                   # Connexion MongoDB
├── routes/
│   └── index.ts            # Agrégateur de routes
├── ping/                   # Module ping (exemple)
│   ├── ping.controller.ts
│   └── ping.routes.ts
├── devices/                # À implémenter
├── telemetry/              # À implémenter
└── admin/                  # À implémenter
```

## Ce que vous devez implémenter

Consultez le fichier **CONSIGNES.md** pour les spécifications complètes du projet.

### Endpoints à développer

**Device (auth: `x-device-key`)**
- `POST /devices/register` - Demande d'accès
- `GET /devices/me` - Consulter son status
- `POST /telemetry` - Envoyer une mesure

**Admin (auth: `x-api-key`)**
- `GET /admin/devices` - Liste des devices
- `GET /admin/devices/:id` - Détail d'un device
- `POST /admin/devices/:id/approve` - Approuver un device
- `POST /admin/devices/:id/revoke` - Révoquer un device
- `GET /admin/devices/:id/telemetry` - Mesures paginées
- `GET /admin/devices/:id/telemetry/latest` - Dernière mesure
- `GET /admin/devices/:id/stats` - Stats agrégées

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/iot_monitoring` |
| `PORT` | Port du serveur | `3000` |
| `ADMIN_API_KEY` | Clé API pour l'authentification admin | - |
