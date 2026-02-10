import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = "lixeal";
const REPO = "vexpass";

const CIS_COUNTRIES = ['RU', 'UA', 'BY', 'KZ', 'AM', 'AZ', 'GE', 'MD', 'KG', 'TJ', 'UZ', 'TM'];

async function getGeo(ip) {
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
        const data = await res.json();
        return data.status === 'success' ? data : null;
    } catch (e) { return null; }
}

export default async function handler(req, res) {
    const host = req.headers.host || "";
    const userAgent = req.headers['user-agent'] || "";
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim();
    
    let { path: requestedPath } = req.query;
    if (!requestedPath) return res.status(400).send("No path");

    const cleanPath = requestedPath.split('#')[0].split('?')[0].replace(/\.[^/.]+$/, "");

    // --- 1. ОПРЕДЕЛЕНИЕ ВЕТКИ И ИКОНКИ ---
    let targetBranch = "off";
    let iconName = "vexpass.svg"; // Иконка по умолчанию для главных страниц

    if (host.includes("raw-vexpass")) targetBranch = "raw";
    else if (host.includes("cdn")) targetBranch = "cdn";
    else if (host.includes("api")) targetBranch = "api";
    else if (host.includes("test")) {
        targetBranch = "testing";
        iconName = "test-vexpass.svg";
    }

    // Если в пути указан конкретный файл (например /script), всегда ставим щит
    if (cleanPath !== "" && cleanPath !== "links") {
        iconName = "ScriptProtector.svg";
    }

    // --- 2. ГЕО И ЯЗЫК ---
    const geoData = await getGeo(ip);
    const lang = (geoData && CIS_COUNTRIES.includes(geoData.countryCode)) ? "RU" : "EN";

    // --- 3. ВЫДАЧА ИКОНОК ИЗ РЕПО ---
    if (requestedPath.startsWith("favicon/")) {
        try {
            const { data: iconFile } = await octokit.repos.getContent({
                owner: OWNER, repo: REPO, path: `site/favicon/${requestedPath.split('/').pop()}`, ref: "main"
            });
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.status(200).send(Buffer.from(iconFile.content, 'base64').toString('utf-8'));
        } catch (e) { return res.status(404).end(); }
    }

    // --- 4. ЛОГИКА ДЛЯ ЧЕЛОВЕКА (БРАУЗЕР) ---
    const isRoblox = userAgent.includes("Roblox");

    if (!isRoblox) {
        let pageName = "main.html";
        let isFileRequest = false;

        if (cleanPath === "links") {
            pageName = "links.html";
        } else if (targetBranch === "testing" && cleanPath === "") {
            pageName = "test.html";
        } else if (cleanPath !== "") {
            // Если человек пытается открыть файл напрямую
            pageName = "main.html"; 
            isFileRequest = true;
        }

        try {
            const { data: file } = await octokit.repos.getContent({
                owner: OWNER, repo: REPO, path: `site/html/${pageName}`, ref: "main"
            });
            let html = Buffer.from(file.content, 'base64').toString('utf-8');

            // Название вкладки: если это запрос к файлу — ставим невидимый символ (U+200E)
            const title = isFileRequest ? "&#x200E;" : "VEXPASS";
            
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
            html = html.replace(/{{LANG}}/g, lang);
            html = html.replace(/{{ICON_PATH}}/g, `/api/raw?path=favicon/${iconName}`);
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(html);
        } catch (e) {
            return res.status(404).send("System error");
        }
    }

    // --- 5. ВЫДАЧА КОДА (ROBLOX) ---
    try {
        const { data: repoFiles } = await octokit.repos.getContent({
            owner: OWNER, repo: REPO, path: "", ref: targetBranch
        });

        const targetFile = repoFiles.find(f => f.name.replace(/\.[^/.]+$/, "") === cleanPath);
        if (!targetFile) throw new Error();

        const { data: blob } = await octokit.git.getBlob({
            owner: OWNER, repo: REPO, file_sha: targetFile.sha
        });

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).send(Buffer.from(blob.content, 'base64').toString('utf-8'));
    } catch (e) {
        return res.status(404).send(`-- VexPass Error: Resource not found`);
    }
}
