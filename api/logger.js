import { Octokit } from "@octokit/rest";
import Redis from 'ioredis';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

    const { ip, city, region, country, org, path, branch } = req.body;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const CHANNEL_ID = "ТВОЙ_ID_ВОЙС_КАНАЛА"; // ЗАМЕНИ НА СВОЙ
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

    try {
        // 1. Обновляем счетчик инжекций в Redis
        const totalInjections = await redis.incr('injections_total');

        // 2. Обновляем название канала в Discord (раз в 6 минут)
        const lastUpdate = await redis.get('last_discord_update') || 0;
        const now = Date.now();

        if (now - lastUpdate > 360000) {
            await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bot ${BOT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: `ɷ Injections | ${totalInjections} ɷ` })
            });
            await redis.set('last_discord_update', now);
        }

        // 3. Отправляем красивый лог в Webhook
        const discordPayload = {
            username: "VexPass Logger",
            embeds: [{
                title: "🚀 New Injection Detected",
                color: 0x00ff00,
                fields: [
                    { name: "📁 Script Path", value: `\`${path}\` (${branch})`, inline: true },
                    { name: "🔢 Total", value: `${totalInjections}`, inline: true },
                    { name: "🌐 Connection", value: `**IP:** ${ip}\n**ISP:** ${org}`, inline: false },
                    { name: "📍 Location", value: `${city}, ${region}, ${country}`, inline: false }
                ],
                footer: { text: "VexPass System • " + new Date().toLocaleString() }
            }]
        };

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
        });

        return res.status(200).json({ success: true, total: totalInjections });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false });
    }
}
