#!/bin/bash
echo "🚀 DÉMARRAGE PINGUBOT REPLIT..."

# Vérification Node.js
echo "📋 Node.js version: $(node --version)"
echo "📋 NPM version: $(npm --version)"

# Installation rapide
echo "📦 Installation des dépendances..."
npm install --production

# Vérification .env (Secrets Replit)
if [ -z "$TOKEN" ]; then
    echo "❌ ERREUR: Variable TOKEN manquante dans Secrets"
    exit 1
fi

if [ -z "$CLIENT_ID" ]; then
    echo "❌ ERREUR: Variable CLIENT_ID manquante dans Secrets"
    exit 1
fi

if [ -z "$GUILD_ID" ]; then
    echo "❌ ERREUR: Variable GUILD_ID manquante dans Secrets"
    exit 1
fi

echo "✅ Variables d'environnement OK"

# Démarrage
echo "🤖 Lancement du bot..."
node index.js 