const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Fonction pour calculer le risque
function calculateRisk(capital, riskPct, entry, stop, target) {
    const results = {};
    
    // Conversion en nombres
    const capitalNum = parseFloat(capital);
    const riskPctNum = parseFloat(riskPct);
    const entryNum = parseFloat(entry);
    const stopNum = parseFloat(stop);
    const targetNum = parseFloat(target);
    
    // Validation des données
    if (isNaN(capitalNum) || isNaN(riskPctNum) || isNaN(entryNum) || isNaN(stopNum) || isNaN(targetNum)) {
        return { error: "Toutes les valeurs doivent être des nombres valides" };
    }
    
    if (capitalNum <= 0 || riskPctNum <= 0 || riskPctNum > 100) {
        return { error: "Capital et Risk% doivent être positifs (Risk% ≤ 100%)" };
    }
    
    // Déterminer la direction du trade
    const isLong = entryNum < targetNum;
    const isShort = entryNum > targetNum;
    
    if (!isLong && !isShort) {
        return { error: "Entry doit être différent de Target" };
    }
    
    // Validation stop vs entry/target
    if (isLong && (stopNum >= entryNum || stopNum >= targetNum)) {
        return { error: "Pour un LONG: Stop doit être < Entry < Target" };
    }
    
    if (isShort && (stopNum <= entryNum || stopNum <= targetNum)) {
        return { error: "Pour un SHORT: Target < Entry < Stop" };
    }
    
    // Calculs
    const riskAmount = (capitalNum * riskPctNum) / 100;
    const stopDistance = Math.abs(entryNum - stopNum);
    const targetDistance = Math.abs(targetNum - entryNum);
    
    const positionSize = riskAmount / stopDistance;
    const potentialGain = positionSize * targetDistance;
    const riskRewardRatio = targetDistance / stopDistance;
    
    return {
        direction: isLong ? "LONG 🟢" : "SHORT 🔴",
        capital: capitalNum.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }),
        riskPct: riskPctNum + "%",
        riskAmount: riskAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }),
        positionSize: positionSize.toFixed(4),
        potentialGain: potentialGain.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }),
        riskRewardRatio: riskRewardRatio.toFixed(2),
        entry: entryNum.toLocaleString('fr-FR'),
        stop: stopNum.toLocaleString('fr-FR'),
        target: targetNum.toLocaleString('fr-FR')
    };
}

client.once('ready', () => {
    console.log(`✅ Risk Calculator Bot connecté: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'risk') {
        try {
            // Récupérer les paramètres
            const capital = interaction.options.getString('capital');
            const riskPct = interaction.options.getString('risk_pct');
            const entry = interaction.options.getString('entry');
            const stop = interaction.options.getString('stop');
            const target = interaction.options.getString('target');

            // Calculer le risque
            const result = calculateRisk(capital, riskPct, entry, stop, target);

            // Gestion des erreurs
            if (result.error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Erreur de Calcul')
                    .setDescription(result.error)
                    .setTimestamp();

                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Créer l'embed de résultat
            const embed = new EmbedBuilder()
                .setColor('#00FF88')
                .setTitle('🧮 **CALCULATEUR DE RISQUE**')
                .setDescription('**Voici vos calculs de position :**')
                .addFields(
                    { name: '💰 **CAPITAL**', value: result.capital, inline: true },
                    { name: '⚠️ **RISQUE %**', value: result.riskPct, inline: true },
                    { name: '📊 **DIRECTION**', value: result.direction, inline: true },
                    { name: '🎯 **ENTRY**', value: result.entry, inline: true },
                    { name: '🛑 **STOP LOSS**', value: result.stop, inline: true },
                    { name: '🚀 **TARGET**', value: result.target, inline: true },
                    { name: '💵 **RISQUE ($)**', value: result.riskAmount, inline: true },
                    { name: '📦 **POSITION SIZE**', value: result.positionSize, inline: true },
                    { name: '💸 **GAIN POTENTIEL**', value: result.potentialGain, inline: true },
                    { name: '⚖️ **RISK/REWARD**', value: `1:${result.riskRewardRatio}`, inline: false }
                )
                .setFooter({ text: '💡 Gérez toujours vos risques!' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors du calcul:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur Système')
                .setDescription('Une erreur est survenue lors du calcul. Réessayez plus tard.')
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN); 