require('dotenv').config();

// Polyfill pour ReadableStream si nécessaire (compatibilité Replit)
if (typeof globalThis.ReadableStream === 'undefined') {
    const { ReadableStream } = require('stream/web');
    globalThis.ReadableStream = ReadableStream;
}

// Démarrer le serveur web pour Replit
require('./server');

const { Client, Intents, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Configuration du client Discord
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Définition de la commande /call
const callCommand = new SlashCommandBuilder()
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
            .setRequired(false));

// Enregistrement des commandes slash
async function deployCommands() {
    const commands = [callCommand];
    
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    
    try {
        console.log('🔄 Enregistrement des commandes slash...');
        
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
    await deployCommands();
});

// Fonction pour obtenir les emojis et couleurs selon la direction
function getTradeStyle(direction) {
    const isLong = direction.toLowerCase() === 'long';
    return {
        color: isLong ? '#00FF88' : '#FF4444',
        emoji: isLong ? '📈' : '📉',
        directionEmoji: isLong ? '🟢' : '🔴',
        trend: isLong ? '⬆️' : '⬇️'
    };
}

// Fonction pour formater les take profits
function formatTakeProfit(tp) {
    return tp.replace(/-/g, '→').replace(/,/g, ',\n');
}

// Gestion des interactions (commandes slash)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'call') {
        // Vérifier si l'interaction n'a pas expiré
        if (interaction.replied || interaction.deferred) {
            console.log('⚠️ Interaction déjà traitée');
            return;
        }

        try {
            // Récupération des options
            const symbol = interaction.options.getString('symbol');
            const direction = interaction.options.getString('direction');
            const entry = interaction.options.getString('entry');
            const stop = interaction.options.getString('stop');
            const tp = interaction.options.getString('tp');
            const rr = interaction.options.getString('rr');
            const reasoning = interaction.options.getString('reasoning');
            const chart = interaction.options.getAttachment('chart');
            
            const style = getTradeStyle(direction);
            
            // Embed principal avec le design sophistiqué
            const mainEmbed = {
                title: `${style.emoji} **TRADE SIGNAL** ${style.emoji}`,
                description: `## **${symbol.toUpperCase()}** ${style.directionEmoji} **${direction.toUpperCase()}** ${style.trend}`,
                color: parseInt(style.color.slice(1), 16),
                fields: [
                    {
                        name: '🎯 **Entry Point**',
                        value: `\`\`\`fix\n${entry}\`\`\``,
                        inline: true
                    },
                    {
                        name: '🛡️ **Stop Loss**',
                        value: `\`\`\`fix\n${stop}\`\`\``,
                        inline: true
                    },
                    {
                        name: '💰 **Take Profits**',
                        value: `\`\`\`css\n${formatTakeProfit(tp)}\`\`\``,
                        inline: false
                    }
                ],
                footer: { 
                    text: `📊 Published by ${interaction.user.tag} • ${new Date().toLocaleString('fr-FR')}`,
                    icon_url: interaction.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString()
            };

            // Ajout des champs optionnels avec style
            if (rr) {
                mainEmbed.fields.push({
                    name: '⚖️ **Risk/Reward Ratio**',
                    value: `\`\`\`yaml\n${rr}\`\`\``,
                    inline: true
                });
            }

            if (reasoning) {
                mainEmbed.fields.push({
                    name: '🧠 **Analysis & Reasoning**',
                    value: `\`\`\`md\n# ${reasoning}\`\`\``,
                    inline: false
                });
            }

            const embeds = [mainEmbed];

            // Si une image est fournie, créer un embed séparé pour le chart
            if (chart) {
                const chartEmbed = {
                    title: `📊 Technical Analysis - ${symbol.toUpperCase()}`,
                    image: { url: chart.url },
                    color: parseInt(style.color.slice(1), 16)
                };
                
                embeds.push(chartEmbed);
            }

            // Répondre avec les embeds
            await interaction.reply({
                content: `## 🚨 **NEW TRADE ALERT** 🚨\n> *Signal generated for* **${symbol.toUpperCase()}**`,
                embeds: embeds
            });
            
            console.log(`📊 Signal publié par ${interaction.user.tag}: ${symbol} ${direction}${chart ? ' (avec image)' : ''}`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la réponse:', error);
            
            // Vérifier si on peut encore répondre avant d'essayer
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({
                        content: '❌ Une erreur s\'est produite lors de la publication du signal.',
                        ephemeral: true
                    });
                } catch (replyError) {
                    console.error('❌ Impossible de répondre à l\'interaction:', replyError.message);
                }
            }
        }
    }
});

// Gestion des erreurs
client.on('error', error => {
    console.error('❌ Erreur Discord.js:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ Erreur non gérée:', error);
});

// Connexion du bot
client.login(process.env.TOKEN); 