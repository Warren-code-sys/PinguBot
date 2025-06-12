require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

console.log('🔄 Force refresh des commandes Discord...');

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

// Supprimer toutes les commandes puis les recréer
async function refreshCommands() {
    try {
        console.log('🗑️ Suppression des anciennes commandes...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        );
        
        console.log('⏳ Attente 2 secondes...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📝 Recréation de /call...');
        const { SlashCommandBuilder } = require('@discordjs/builders');
        
        const commands = [
            new SlashCommandBuilder()
                .setName('call')
                .setDescription('Publier un signal de trade')
                .addStringOption(option =>
                    option.setName('symbol')
                        .setDescription('Symbole du trade (ex: BTCUSDT)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('direction')
                        .setDescription('Direction du trade')
                        .setRequired(true)
                        .addChoices(
                            { name: '📈 Long', value: 'long' },
                            { name: '📉 Short', value: 'short' }
                        ))
                .addStringOption(option =>
                    option.setName('entry')
                        .setDescription('Prix d\'entrée')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('sl')
                        .setDescription('Stop Loss')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('tp')
                        .setDescription('Take Profit')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('rr')
                        .setDescription('Risk/Reward ratio')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('reasoning')
                        .setDescription('Analyse/Raison du trade')
                        .setRequired(false))
                .addAttachmentOption(option =>
                    option.setName('chart')
                        .setDescription('Image du graphique/chart')
                        .setRequired(false))
                .toJSON()
        ];
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        
        console.log('✅ Commandes /call recréées avec succès!');
        console.log('🎯 Testez maintenant /call sur votre serveur Discord');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

refreshCommands(); 