# PinguBot 🐧

Bot Discord pour publier des signaux de trade avec la commande `/call`.

## 🚀 Déploiement sur Replit (Recommandé)

### **Étape 1 : Préparer Replit**
1. Allez sur [Replit.com](https://replit.com) et créez un compte
2. Cliquez sur **"Create Repl"** 
3. Sélectionnez **"Import from GitHub"** ou **"Node.js"**
4. Importez ce projet ou uploadez les fichiers

### **Étape 2 : Configuration**
1. **Créez les Secrets (variables d'environnement) :**
   - Dans Replit, allez dans l'onglet **"Secrets"** (🔒)
   - Ajoutez ces 3 secrets :
   ```
   TOKEN = votre_token_discord
   CLIENT_ID = votre_client_id
   GUILD_ID = votre_guild_id
   ```

### **Étape 3 : Obtenir les valeurs Discord**
1. **Allez sur [Discord Developer Portal](https://discord.com/developers/applications)**
2. **Créez une nouvelle application**
3. **Dans l'onglet "Bot" :**
   - Créez un bot et copiez le token → `TOKEN`
4. **Dans "General Information" :**
   - Copiez le Client ID → `CLIENT_ID` 
5. **Dans Discord :**
   - Activez le mode développeur
   - Clic droit sur votre serveur → "Copier l'ID" → `GUILD_ID`

### **Étape 4 : Inviter le bot**
1. **Dans "OAuth2" > "URL Generator" :**
   - ✅ Cochez **"bot"** et **"applications.commands"**
   - Sélectionnez les permissions nécessaires
   - Visitez l'URL générée pour inviter le bot

### **Étape 5 : Lancer sur Replit**
1. **Cliquez sur le bouton "Run" ▶️**
2. **Le bot sera en ligne 24/7 !**
3. **Vérifiez le statut sur l'URL générée par Replit**

---

## 🎯 Utilisation

### Commande `/call`

Publie un signal de trade simplifié avec les informations essentielles.

**Options requises :**
- `symbol`: Symbole du trade (ex: BTCUSDT)
- `direction`: Direction (Long/Short)
- `entry`: Prix d'entrée
- `stop`: Stop Loss
- `tp`: Take Profits (ex: 67000-65000)

**Options optionnelles :**
- `rr`: Risk/Reward ratio (ex: 2.5)
- `reasoning`: Analyse du trade
- `chart`: Image du graphique/chart (PNG, JPG, GIF) 📊

### Exemple d'utilisation :

```
/call symbol:BTCUSDT direction:Short entry:68420 stop:69000 tp:67000-65000 rr:2.5 reasoning:Double top + divergences chart:[votre_image.png]
```

### Format de sortie :

```
🚨 NEW TRADE ALERT 🚨
Signal generated for BTCUSDT

📉 TRADE SIGNAL 📉
BTCUSDT 🔴 SHORT ⬇️

🎯 Entry Point: 68420
🛡️ Stop Loss: 69000
💰 Take Profits: 67000 → 65000
⚖️ Risk/Reward Ratio: 2.5
🧠 Analysis & Reasoning: Double top + divergences
```

*+ Image du chart intégrée si fournie (avec couleur selon la direction)*

## 🌐 Installation Locale (Optionnelle)

Si vous préférez faire tourner le bot en local :

```bash
npm install
npm start
```

## 📋 Prérequis

- Compte Replit (gratuit)
- Un serveur Discord
- Un bot Discord avec les permissions nécessaires

## 🛠️ Technologies

- Discord.js v14
- Node.js
- Express.js (pour Replit)
- dotenv

## 🎮 Avantages Replit

✅ **24/7 en ligne** - Pas besoin de garder votre PC allumé  
✅ **Gratuit** - Plan gratuit suffisant pour un bot Discord  
✅ **Interface web** - Monitoring et logs en temps réel  
✅ **Déploiement facile** - Un clic et c'est en ligne  
✅ **Sauvegarde automatique** - Votre code est sauvé dans le cloud  

---

Développé avec ❤️ pour la communauté trading 