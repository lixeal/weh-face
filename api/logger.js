export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { ip, host, path } = req.body;
    const userAgent = req.body.agent || "Unknown";
    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

    if (!DISCORD_WEBHOOK) return res.status(500).send('Webhook not configured');

    // 1. ГЕО-ДАННЫЕ
    let location = "Ukraine, Dnipro"; 
    let isp = "PrJSC 'VF UKRAINE'";
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp`);
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
            location = `${geoData.country}, ${geoData.city}`;
            isp = geoData.isp;
        }
    } catch (e) { }

    // 2. ДАТА
    const now = new Date();
    const fullDate = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // 3. ФОРМИРУЕМ КРАСИВЫЙ EMBED (как на фото)
    const embed = {
        embeds: [{
            color: 0x3498db, // Синий цвет как на скриншоте
            title: "🛡️ Access Blocked",
            fields: [
                {
                    name: "🌐 Domain",
                    value: `\`${host}\``,
                    inline: true
                },
                {
                    name: "📁 File",
                    value: `\`${path || "index"}\``,
                    inline: true
                },
                {
                    name: "👤 User-Agent",
                    value: `\`\`\`${userAgent}\`\`\``,
                    inline: false
                },
                {
                    name: "📍 IP Info",
                    value: `**IP:** \`${ip}\`\n**Location:** ${location}\n**ISP:** ${isp}`,
                    inline: false
                }
            ],
            footer: {
                text: `vexpass security center • ${fullDate}`
            }
        }]
    };

    try {
        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).end();
    }
}
