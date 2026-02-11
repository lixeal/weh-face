export default async function logInject({ host, ip, file }) {
    if (!process.env.DISCORD_WEBHOOK_INJECT) return;

    await fetch(process.env.DISCORD_WEBHOOK_INJECT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `⚡ Inject: \`${file}\`\nDomain: **${host}**\nIP: \`${ip}\``
        })
    });
}
