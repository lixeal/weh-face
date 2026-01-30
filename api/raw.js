import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
    const { path } = req.query;
    if (!path) return res.status(400).send("No path provided");

    try {
        // 1. Получаем метаданные файла
        const { data: fileData } = await octokit.repos.getContent({
            owner: "lixeal",
            repo: "weh-face",
            path: `res/data/${path}`,
        });

        // 2. Если файл больше 1Мб, используем SHA для получения Blob
        const { data: blobData } = await octokit.git.getBlob({
            owner: "lixeal",
            repo: "weh-face",
            file_sha: fileData.sha,
        });

        const buffer = Buffer.from(blobData.content, 'base64');

        // 3. Определяем тип контента
        const extension = path.split('.').pop().toLowerCase();
        const types = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'lua': 'text/plain; charset=utf-8'
        };

        res.setHeader('Content-Type', types[extension] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Кэш на час для экономии лимитов
        
        res.status(200).send(buffer);
    } catch (e) {
        console.error(e);
        res.status(404).send(`Error: ${e.message}`);
    }
}
