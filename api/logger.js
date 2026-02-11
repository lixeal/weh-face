export default async function sendLog({
    host,
    file,
    userAgent,
    ip
}) {
    if (!process.env.DISCORD_WEBHOOK) return;

    try {
        await fetch(process.env.DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({
                username: "wehface protector",
                embeds: [
                    {
                        title: "🛡️ Access Blocked",
                        color: 0x2b2d31,

                        fields: [
                            {
                                name: "🌐 Domain",
                                value: `\`${host}\``,
                                inline: true
                            },
                            {
                                name: "📁 File",
                                value: `\`${file}\``,
                                inline: true
                            },
                            {
                                name: "👤 User-Agent",
                                value:
                                    "```" +
                                    userAgent.slice(0, 200) +
                                    "```"
                            },
                            {
                                name: "📍 IP Info",
                                value: `**IP:** \`${ip}\``
                            }
                        ],

                        footer: {
                            text: "vexpass Security Center"
                        },

                        timestamp: new Date().toISOString()
                    }
                ]
            })
        });
    } catch (err) {
        console.log("Logger error:", err.message);
    }
}
