import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { ip, host, path, agent } = req.body;
    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

    // 1. ИГНОРИРУЕМ СИСТЕМНЫЕ ПУТИ
    if (!path || path === "" || path.includes("api/")) {
        return res.status(200).json({ status: "ignored" });
    }

    // 2. ОПРЕДЕЛЯЕМ БРАНЧ ДЛЯ ПРОВЕРКИ
    let targetBranch = "off";
    if (host.includes("raw-vexpass")) targetBranch = "raw";
    else if (host.includes("test")) targetBranch = "testing";
    else if (host.includes("cdn")) targetBranch = "cdn";

    // 3. ПРОВЕРКА: ЕСТЬ ЛИ ТАКОЙ ФАЙЛ?
    try {
        const cleanName = path.replace(/\.[^/.]+$/, "");
        const { data: repoContent } = await octokit.repos.getContent({ 
            owner: "lixeal", repo: "vexpass", path: "", ref: targetBranch 
        });

        const exists = repoContent.some(f => 
            f.type === "file" && (f.name === path || f.name === `${path}.lua` || f.name === cleanName)
        );

        if (!exists) return res.status(200).json({ status: "file not found, skipping log" });
    } catch (e) { 
        return res.status(200).json({ status: "error during validation" }); 
    }

    // 4. ГЕО-ДАННЫЕ
    let location = "Unknown";
    let isp = "Unknown";
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp`);
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
            location = `${geoData.country}, ${geoData.city}`;
            isp = geoData.isp;
        }
    } catch (e) { }

    // 5. ДАТА
    const now = new Date();
    const fullDate = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // 6. ОТПРАВКА В DISCORD
    const embed = {
        embeds: [{
            color: 0x3498db,
            title: "🛡️ Access Blocked",
            fields: [
                { name: "🌐 Domain", value: `\`${host}\``, inline: true },
                { name: "📁 File", value: `\`${path}\``, inline: true },
                { name: "👤 User-Agent", value: `\`\`\`${agent}\`\`\``, inline: false },
                { name: "📍 IP Info", value: `**IP:** \`${ip}\`\n**Location:** ${location}\n**ISP:** ${isp}`, inline: false }
            ],
            footer: { text: `vexpass security center • ${fullDate}` }
        }]
    };

    await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(embed)
    });

    return res.status(200).json({ success: true });
}
