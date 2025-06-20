require('dotenv').config();

// Démarrer le serveur web pour Replit
require('./server');

const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

console.log('🚀 Démarrage de PinguBot...');

// Configuration du client Discord
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS
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

// Fonction pour obtenir les emojis et couleurs selon la direction
function getTradeStyle(direction) {
    const isLong = direction.toLowerCase() === 'long';
    return {
        color: isLong ? 0x00FF88 : 0xFF4444,
        emoji: isLong ? '📈' : '📉',
        directionEmoji: isLong ? '🟢' : '🔴',
        trend: isLong ? '🔺' : '🔻'
    };
}

// Gestion des interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'call') {
        console.log(`📊 Commande /call reçue de ${interaction.user.tag}`);
        
        try {
            // Récupération des options
            const symbol = interaction.options.getString('symbol');
            const direction = interaction.options.getString('direction');
            const entry = interaction.options.getString('entry');
            const sl = interaction.options.getString('sl');
            const tp = interaction.options.getString('tp');
            const rr = interaction.options.getString('rr');
            const reasoning = interaction.options.getString('reasoning');
            const chart = interaction.options.getAttachment('chart');
            
            const style = getTradeStyle(direction);
            
            // Embed principal avec syntaxe v13 correcte
            const mainEmbed = new MessageEmbed()
                .setTitle(`${style.emoji} **TRADE SIGNAL** ${style.emoji}`)
                .setDescription(`**${symbol.toUpperCase()}** ${style.directionEmoji} **${direction.toUpperCase()}** ${style.trend}`)
                .setColor(style.color)
                .addFields([
                    { name: '🎯 **Entry Point**', value: `\`\`\`${entry}\`\`\``, inline: true },
                    { name: '🛡️ **Stop Loss**', value: `\`\`\`${sl}\`\`\``, inline: true },
                    { name: '💰 **Take Profit**', value: `\`\`\`${tp}\`\`\``, inline: true }
                ])
                .setFooter({ 
                    text: `📊 Published by ${interaction.user.tag} • ${new Date().toLocaleString('fr-FR')}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                })
                .setTimestamp();
            
            // Ajout des champs optionnels
            if (rr) {
                mainEmbed.addFields([{ name: '⚖️ **Risk/Reward Ratio**', value: `\`\`\`${rr}\`\`\``, inline: true }]);
            }
            
            if (reasoning) {
                mainEmbed.addFields([{ name: '🧠 **Analysis & Reasoning**', value: `\`\`\`${reasoning}\`\`\``, inline: false }]);
            }
            
            const embeds = [mainEmbed];

            // Si une image est fournie
            if (chart) {
                const chartEmbed = new MessageEmbed()
                    .setTitle(`📊 Technical Analysis - ${symbol.toUpperCase()}`)
                    .setImage(chart.url)
                    .setColor(style.color);
                
                embeds.push(chartEmbed);
            }
            
            // Répondre UNE SEULE FOIS
            await interaction.reply({
                content: `🚨 **NEW TRADE ALERT** 🚨\n> *Signal generated for* **${symbol.toUpperCase()}**`,
                embeds: embeds
            });
            
            console.log(`✅ Signal publié: ${symbol} ${direction}${chart ? ' (avec image)' : ''}`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la réponse:', error);
            
            // Gestion d'erreur sécurisée
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({
                        content: '❌ Une erreur s\'est produite lors de la publication du signal.',
                        ephemeral: true
                    });
                } catch (replyError) {
                    console.error('❌ Impossible de répondre:', replyError);
                }
            }
        }
    }
});

// Gestion des erreurs
client.on('error', console.error);
client.on('warn', console.warn);

// Connexion
client.login(process.env.TOKEN); 