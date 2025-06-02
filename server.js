const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Route de base
app.get('/', (req, res) => {
    res.json({
        status: '🟢 PinguBot Online',
        message: 'Discord trading bot is running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🌐 Serveur Express en ligne sur le port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
});

module.exports = app; 