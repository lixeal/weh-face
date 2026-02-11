export default async function logAccess({ host, ip, userAgent, file }) {
    if (!process.env.DISCORD_WEBHOOK_LOG) return;

    await fetch(process.env.DISCORD_WEBHOOK_LOG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            embeds: [
                {
                    title: "🛡️ Access Blocked",
                    color: 0xff0000,
                    fields: [
                        { name: "Domain", value: `\`${host}\``, inline: true },
                        { name: "File", value: `\`${file}\``, inline: true },
                        {
                            name: "User-Agent",
                            value: "```" + userAgent.slice(0, 200) + "```"
                        },
                        { name: "IP", value: `\`${ip}\`` }
                    ],
                    footer: { text: "WEH-FACE Security Center" },
                    timestamp: new Date().toISOString()
                }
            ]
        })
    });
}
