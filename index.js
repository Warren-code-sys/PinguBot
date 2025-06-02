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
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
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
    if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
        console.error('❌ Variables d\'environnement manquantes! Vérifiez TOKEN, CLIENT_ID, GUILD_ID');
        return;
    }

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
        console.log(`📊 Commande /call reçue de ${interaction.user.tag}`);

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
            const mainEmbed = new MessageEmbed()
                .setTitle(`${style.emoji} **TRADE SIGNAL** ${style.emoji}`)
                .setDescription(`## **${symbol.toUpperCase()}** ${style.directionEmoji} **${direction.toUpperCase()}** ${style.trend}`)
                .setColor(style.color)
                .addField('🎯 **Entry Point**', `\`\`\`fix\n${entry}\`\`\``, true)
                .addField('🛡️ **Stop Loss**', `\`\`\`fix\n${stop}\`\`\``, true)
                .addField('💰 **Take Profits**', `\`\`\`css\n${formatTakeProfit(tp)}\`\`\``, false)
                .setFooter(`📊 Published by ${interaction.user.tag} • ${new Date().toLocaleString('fr-FR')}`, interaction.user.displayAvatarURL())
                .setTimestamp();

            // Ajout des champs optionnels
            if (rr) {
                mainEmbed.addField('⚖️ **Risk/Reward Ratio**', `\`\`\`yaml\n${rr}\`\`\``, true);
            }

            if (reasoning) {
                mainEmbed.addField('🧠 **Analysis & Reasoning**', `\`\`\`md\n# ${reasoning}\`\`\``, false);
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

            // Répondre
            await interaction.reply({
                content: `## 🚨 **NEW TRADE ALERT** 🚨\n> *Signal generated for* **${symbol.toUpperCase()}**`,
                embeds: embeds
            });
            
            console.log(`✅ Signal publié: ${symbol} ${direction}${chart ? ' (avec image)' : ''}`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la réponse:', error);
            
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({
                        content: '❌ Une erreur s\'est produite lors de la publication du signal.',
                        ephemeral: true
                    });
                } catch (replyError) {
                    console.error('❌ Impossible de répondre:', replyError.message);
                }
            }
        }
    }
});

// Gestion des erreurs
client.on('error', error => {
    console.error('❌ Erreur Discord.js:', error);
});

client.on('warn', warn => {
    console.warn('⚠️ Avertissement:', warn);
});

process.on('unhandledRejection', error => {
    console.error('❌ Erreur non gérée:', error);
});

// Connexion du bot
if (!process.env.TOKEN) {
    console.error('❌ TOKEN manquant dans les variables d\'environnement!');
    process.exit(1);
}

client.login(process.env.TOKEN)
    .then(() => console.log('🔗 Connexion au bot réussie'))
    .catch(error => {
        console.error('❌ Erreur de connexion:', error);
        process.exit(1);
    }); 