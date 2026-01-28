import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
    const { path } = req.query;
    
    // Автоматически добавляем префикс папки, где лежат скрипты
    const fullPath = `res/data/${path}`;

    try {
        const response = await octokit.repos.getContent({
            owner: "lixeal",
            repo: "weh-face",
            path: fullPath,
        });

        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(200).send(content);
    } catch (e) {
        res.status(404).send(`-- Error: File [${path}] not found in res/data/`);
    }
}import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
    const { path } = req.query;
    
    // Автоматически добавляем префикс папки, где лежат скрипты
    const fullPath = `res/data/${path}`;

    try {
        const response = await octokit.repos.getContent({
            owner: "lixeal",
            repo: "weh-face",
            path: fullPath,
        });

        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(200).send(content);
    } catch (e) {
        res.status(404).send(`-- Error: File [${path}] not found in res/data/`);
    }
}
