const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Route de base pour que Replit garde le bot en vie
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>PinguBot - Discord Trading Bot</title>
                <meta charset="UTF-8">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 50px;
                        margin: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: rgba(255,255,255,0.1);
                        padding: 30px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                    }
                    .status {
                        background: #4CAF50;
                        padding: 10px 20px;
                        border-radius: 25px;
                        display: inline-block;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🐧 PinguBot</h1>
                    <h2>Discord Trading Signal Bot</h2>
                    <div class="status">✅ Bot is Online & Running</div>
                    <p>Le bot Discord est actif et prêt à publier des signaux de trade !</p>
                    <p><strong>Commande :</strong> <code>/call</code></p>
                    <p>Uptime: ${process.uptime().toFixed(0)} secondes</p>
                    <p>Dernière activité: ${new Date().toLocaleString('fr-FR')}</p>
                </div>
            </body>
        </html>
    `);
});

// Route de santé pour les vérifications
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        bot: 'PinguBot'
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🌐 Serveur web démarré sur le port ${port}`);
    console.log(`🔗 URL: http://localhost:${port}`);
});

// Exporter l'app pour que Replit puisse l'utiliser
module.exports = app; 