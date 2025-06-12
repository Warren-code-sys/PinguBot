const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('risk')
        .setDescription('🧮 Calculateur de risque pour vos trades')
        .addStringOption(option =>
            option.setName('capital')
                .setDescription('💰 Votre capital total (ex: 10000)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('risk_pct')
                .setDescription('⚠️ Pourcentage de risque (ex: 2 pour 2%)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('entry')
                .setDescription('🎯 Prix d\'entrée (ex: 68500)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('stop')
                .setDescription('🛑 Prix de stop loss (ex: 67000)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('target')
                .setDescription('🚀 Prix target/objectif (ex: 72000)')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🔄 Enregistrement des commandes slash...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('✅ Commandes slash enregistrées avec succès!');
        console.log('📋 Commandes disponibles:');
        console.log('   • /risk - Calculateur de risque');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement:', error);
    }
})(); 