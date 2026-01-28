import { Octokit } from "@octokit/rest";
import bcrypt from "bcryptjs";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
    // Важно: читаем данные независимо от того, как их прислал эксплоит
    let data = req.body;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { /* ignore */ }
    }

    const username = data.user || data.username;
    const password = data.pass || data.password;

    // Проверка, чтобы bcrypt не падал
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        const hashed = await bcrypt.hash(String(password), 10);

        await octokit.repos.createOrUpdateFileContents({
            owner: "lixeal",
            repo: "weh-face",
            path: `data/accounts/${username}.json`,
            message: `Register: ${username}`,
            content: Buffer.from(JSON.stringify({ username, password: hashed })).toString('base64')
        });

        res.status(200).send(`AUTH_SUCCESS|{"username":"${username}","password":"${password}"}`);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
