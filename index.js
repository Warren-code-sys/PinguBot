require('dotenv').config();

// Démarrer le serveur web pour Replit
require('./server');

const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

console.log('🚀 Démarrage de PinguBot...');

// Configuration du client Discord avec TOUS les intents nécessaires
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});

// Définition de la commande /call
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
                .setDescription('Direction du trade (Long/Short)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('entry')
                .setDescription('Prix d\'entrée')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('stop')
                .setDescription('Stop Loss')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tp')
                .setDescription('Take Profits (séparés par des tirets)')
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
                .setDescription('Image du graphique/chart (PNG, JPG, GIF)')
                .setRequired(false))
        .toJSON()
];

// Enregistrement des commandes slash
async function deployCommands() {
    try {
        console.log('🔄 Enregistrement des commandes slash...');
        
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        
        console.log('✅ Commandes slash enregistrées avec succès!');
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement des commandes:', error);
    }
}

// Événement : Bot prêt
client.once('ready', async () => {
    console.log(`🤖 ${client.user.tag} est en ligne!`);
    console.log(`📊 Connecté sur ${client.guilds.cache.size} serveur(s)`);
    await deployCommands();
});

// Gestion des interactions - VERSION SIMPLE
client.on('interactionCreate', async (interaction) => {
    console.log('🔔 Interaction reçue:', interaction.type);
    
    if (!interaction.isCommand()) return;
    
    console.log('📊 Commande reçue:', interaction.commandName);
    
    if (interaction.commandName === 'call') {
        console.log(`📊 Commande /call de ${interaction.user.tag}`);
        
        try {
            // Récupération des valeurs
            const symbol = interaction.options.getString('symbol') || 'BTCUSDT';
            const direction = interaction.options.getString('direction') || 'Long';
            const entry = interaction.options.getString('entry') || '0';
            const stop = interaction.options.getString('stop') || '0';
            const tp = interaction.options.getString('tp') || '0';
            const rr = interaction.options.getString('rr');
            const reasoning = interaction.options.getString('reasoning');
            const chart = interaction.options.getAttachment('chart');
            
            // Création de l'embed
            const embed = new MessageEmbed()
                .setTitle('📈 TRADE SIGNAL 📈')
                .setDescription(`**${symbol.toUpperCase()}** - **${direction.toUpperCase()}**`)
                .setColor(direction.toLowerCase() === 'long' ? '#00FF88' : '#FF4444')
                .addField('Entry', entry, true)
                .addField('Stop', stop, true)
                .addField('TP', tp, true)
                .setFooter(`By ${interaction.user.tag}`)
                .setTimestamp();
            
            if (rr) {
                embed.addField('R/R', rr, true);
            }
            
            if (reasoning) {
                embed.addField('Analysis', reasoning, false);
            }
            
            if (chart) {
                embed.setImage(chart.url);
            }
            
            // Réponse
            await interaction.reply({
                content: '🚨 **NEW TRADE ALERT** 🚨',
                embeds: [embed]
            });
            
            console.log('✅ Signal publié avec succès!');
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            
            // Réponse d'erreur
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Erreur lors de la publication du signal.',
                    ephemeral: true
                }).catch(console.error);
            }
        }
    }
});

// Gestion des erreurs
client.on('error', console.error);
client.on('warn', console.warn);

// Connexion
client.login(process.env.TOKEN); 