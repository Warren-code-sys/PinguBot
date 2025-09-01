# Pingu Trade Monitor

Monorepo Node.js (pnpm) pour le bot Discord Pingu, API Fastify, worker de monitoring et dashboard Next.js.

## Setup

1. `pnpm install`
2. `docker compose -f infra/docker-compose.yml up -d`
3. `pnpm prisma migrate deploy`
4. `pnpm dev`

## Fonctionnalités

- Lier un compte Discord à une adresse via signature ECDSA.
- Créer des calls et activer uniquement si la position réelle est ouverte.
- Worker temps réel pour suivre positions et prix via WebSocket mock Pingu.
- Alertes envoyées sur Discord via BullMQ/Redis.
- Dashboard Next.js (pages stub) avec NextAuth Discord.

## Tests

`pnpm test`

## Mock Pingu

Un serveur WebSocket local peut être lancé avec :

```
pnpm mock:pingu
```
