# 🧮 Risk Calculator Bot

Bot Discord pour calculer les risques de trading automatiquement.

## 📊 Fonctionnalités

- **Commande `/risk`** : Calcul automatique de position size
- **Détection automatique** LONG/SHORT selon les prix
- **Validation des données** avec messages d'erreur clairs
- **Interface moderne** avec embeds colorés
- **Calculs précis** : Risk/Reward, Position Size, Gains potentiels

## 🚀 Installation

### 1. Cloner et installer
```bash
cd risk-calculator-bot
npm install
```

### 2. Configuration Discord
1. Créer un bot sur https://discord.com/developers/applications
2. Copier le **Token**, **Client ID** et **Guild ID**
3. Créer un fichier `.env` :
```
TOKEN=votre_token_bot
CLIENT_ID=votre_client_id
GUILD_ID=votre_guild_id
```

### 3. Enregistrer les commandes
```bash
npm run register
```

### 4. Démarrer le bot
```bash
npm start
```

## 💻 Utilisation

### Commande `/risk`

**Paramètres requis :**
- `capital` : Votre capital total (ex: 10000)
- `risk_pct` : Pourcentage de risque (ex: 2 pour 2%)
- `entry` : Prix d'entrée (ex: 68500)
- `stop` : Prix de stop loss (ex: 67000)
- `target` : Prix objectif (ex: 72000)

### 📝 Exemples

**LONG Trade :**
```
/risk capital:10000 risk_pct:2 entry:68500 stop:67000 target:72000
```

**SHORT Trade :**
```
/risk capital:10000 risk_pct:2 entry:68500 stop:70000 target:65000
```

## 🧮 Calculs effectués

1. **Direction détectée** : LONG ou SHORT automatiquement
2. **Montant à risquer** : Capital × Risk%
3. **Position Size** : Montant risqué ÷ Distance stop
4. **Gain potentiel** : Position Size × Distance target
5. **Risk/Reward ratio** : Distance target ÷ Distance stop

## ⚠️ Validations

- **Nombres valides** : Tous les champs doivent être numériques
- **Capital positif** : Capital > 0
- **Risk% valide** : 0 < Risk% ≤ 100
- **Cohérence LONG** : Stop < Entry < Target
- **Cohérence SHORT** : Target < Entry < Stop

## 🎨 Interface

- **Couleur verte** pour les résultats
- **Couleur rouge** pour les erreurs
- **Emojis** pour faciliter la lecture
- **Format monétaire** automatique
- **Horodatage** sur chaque calcul

## 🔧 Structure

```
risk-calculator-bot/
├── index.js           # Bot principal
├── register-commands.js # Enregistrement commandes
├── package.json       # Dépendances
├── env-template.txt   # Template environnement
└── README.md         # Documentation
```

## 🌟 Exemple de résultat

```
🧮 CALCULATEUR DE RISQUE
Voici vos calculs de position :

💰 CAPITAL: $10,000.00
⚠️ RISQUE %: 2%
📊 DIRECTION: LONG 🟢

🎯 ENTRY: 68,500
🛑 STOP LOSS: 67,000
🚀 TARGET: 72,000

💵 RISQUE ($): $200.00
📦 POSITION SIZE: 0.1333
💸 GAIN POTENTIEL: $466.67
⚖️ RISK/REWARD: 1:2.33
```

## 📱 Compatibilité

- Discord.js v14
- Node.js 16+
- Compatible Replit, Railway, etc.

---
*Bot créé pour faciliter la gestion des risques en trading* 📈 