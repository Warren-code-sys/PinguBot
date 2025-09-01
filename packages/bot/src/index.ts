import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const token = process.env.DISCORD_BOT_TOKEN || '';
const clientId = process.env.DISCORD_CLIENT_ID || '';
const guildId = process.env.DISCORD_GUILD_ID || '';

export async function startBot() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  const redis = new Redis(process.env.REDIS_URL || '');
  const alerts = new Worker(
    'alerts',
    async job => {
      console.log('Alert', job.data);
    },
    { connection: redis }
  );

  const commands = [
    new SlashCommandBuilder().setName('link').setDescription('Link wallet'),
    new SlashCommandBuilder().setName('call').setDescription('Create call'),
    new SlashCommandBuilder().setName('status').setDescription('Get status'),
  ].map(c => c.toJSON());

  if (token && clientId && guildId) {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    await client.login(token);
    console.log('Bot logged in');
  } else {
    console.warn('Missing Discord credentials');
  }

  return { client, alerts };
}

if (require.main === module) {
  startBot();
}
