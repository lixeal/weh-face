import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = "lixeal";
const REPO = "weh-face";

export default async function handler(req, res) {
    const { path } = req.query; // Это массив из частей URL
    
    // Путь теперь ведет в папку repository
    const fullPath = `data/repository/${path.join('/')}`;

    try {
        const response = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: fullPath,
        });

        // Декодируем файл из Base64
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

        // Устанавливаем заголовки, чтобы Roblox понял, что это текст
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(200).send(content);
        
    } catch (error) {
        res.status(404).send("-- File not found on Weh Face");
    }
}
