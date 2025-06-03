require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});

client.once('ready', async () => {
    console.log('🔍 DIAGNOSTIC BOT:');
    console.log(`✅ Bot: ${client.user.tag}`);
    console.log(`📊 Serveurs: ${client.guilds.cache.size}`);
    
    const guild = client.guilds.cache.first();
    if (guild) {
        console.log(`🏠 Serveur principal: ${guild.name} (${guild.id})`);
        console.log(`👥 Membres: ${guild.memberCount}`);
        
        // Vérifier les commandes
        const commands = await guild.commands.fetch();
        console.log(`⚙️ Commandes actives: ${commands.size}`);
        commands.forEach(cmd => {
            console.log(`   - /${cmd.name}: ${cmd.description}`);
        });
        
        // Permissions du bot
        const botMember = guild.members.cache.get(client.user.id);
        if (botMember) {
            const perms = botMember.permissions.toArray();
            console.log(`🔐 Permissions: ${perms.length > 10 ? 'Administrateur ou beaucoup' : perms.join(', ')}`);
        }
    }
    
    console.log('\n🎯 Si vous voyez /call dans les commandes ci-dessus, le bot fonctionne !');
    process.exit(0);
});

client.login(process.env.TOKEN); 