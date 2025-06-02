# PinguBot 🐧

Bot Discord pour publier des signaux de trade avec la commande `/call`.

## 🚀 Déploiement sur Replit (Recommandé)

### Étape 1 : Préparer Replit
1. Allez sur [Replit.com](https://replit.com) et créez un compte
2. Cliquez sur **"Create Repl"**
3. Sélectionnez **"Import from GitHub"**
4. Collez l'URL : `https://github.com/Warren-code-sys/PinguBot.git`
5. Nommez votre projet **"PinguBot"**
6. Cliquez sur **"Import from GitHub"**

### Étape 2 : Configuration des variables d'environnement
Dans Replit, allez dans **Secrets** (🔒) et ajoutez :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `TOKEN` | Token de votre bot Discord | `MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.Gh7bcd.abcdef123456789` |
| `CLIENT_ID` | ID de votre application Discord | `1234567890123456789` |
| `GUILD_ID` | ID de votre serveur Discord | `9876543210987654321` |

### Étape 3 : Lancement
1. Cliquez sur **"Run"** ▶️
2. Le bot se lancera automatiquement

### Étape 4 : Maintien 24/7 (Optionnel)
Pour maintenir le bot actif 24/7, utilisez **UptimeRobot** :
1. Récupérez l'URL de votre Replit (ex: `https://pingubot.votrenom.repl.co`)
2. Créez un compte sur [UptimeRobot.com](https://uptimerobot.com)
3. Ajoutez un monitor HTTP vers votre URL Replit
4. Configurez un ping toutes les 5 minutes

## 📊 Utilisation

Une fois le bot en ligne, utilisez la commande `/call` dans votre serveur Discord :

```
/call symbol:BTCUSDT direction:Long entry:68420 stop:69000 tp:67000-65000 rr:2.5 reasoning:"Double top + divergences"
```

## 🛠️ Développement local

Si vous préférez développer en local :

```bash
# Cloner le projet
git clone https://github.com/Warren-code-sys/PinguBot.git
cd PinguBot

# Installer les dépendances
npm install

# Créer le fichier .env avec vos variables
# (voir env-template.txt pour l'exemple)

# Lancer le bot
node index.js
```

## 📋 Variables d'environnement requises

Copiez `env-template.txt` vers `.env` et remplissez :

- `TOKEN` : Token de votre bot Discord (depuis Discord Developer Portal)
- `CLIENT_ID` : ID de votre application Discord
- `GUILD_ID` : ID de votre serveur Discord (Mode développeur > Clic droit > Copier l'ID)

## 🎯 Fonctionnalités

- ✅ Commande slash `/call` pour signaux de trade
- ✅ Embeds Discord sophistiqués avec couleurs
- ✅ Support d'images/graphiques
- ✅ Champs optionnels (Risk/Reward, Analysis)
- ✅ Design adaptatif (vert pour Long, rouge pour Short)
- ✅ Compatible Replit pour hébergement 24/7

## 🐛 Résolution de problèmes

**"App is in recovery mode" sur Replit :**
1. Vérifiez que toutes les variables d'environnement sont définies
2. Consultez les logs dans la Console Replit
3. Assurez-vous que votre bot Discord a les permissions nécessaires

**Le bot ne répond pas :**
1. Vérifiez que le bot est invité sur votre serveur avec les permissions appropriées
2. Vérifiez que les slash commands sont enregistrées
3. Consultez les logs pour d'éventuelles erreurs

## 📝 License

MIT License - Voir le fichier LICENSE pour plus de détails. 