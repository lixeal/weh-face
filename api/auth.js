import { Octokit } from "@octokit/rest";
import bcrypt from "bcryptjs";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = "lixeal";
const REPO = "weh-face";

export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;

    // Простая валидация
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const path = `data/accounts/${username}.json`;

        // 1. Проверяем, не занято ли имя пользователя
        try {
            await octokit.repos.getContent({
                owner: OWNER,
                repo: REPO,
                path: path,
            });
            // Если запрос прошел успешно, значит файл уже есть
            return res.status(400).json({ error: "User already exists" });
        } catch (err) {
            // Ошибка 404 — это хорошо, значит юзер свободен
            if (err.status !== 404) throw err;
        }

        // 2. Шифруем пароль (10 кругов хеширования — стандарт)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Формируем структуру JSON
        const userData = {
            id: `#${Math.floor(Math.random() * 10000)}`, // Генерируем случайный ID
            username: username,
            password: hashedPassword,
            loginned: new Date().toLocaleString('ru-RU'),
            posted_scripts: []
        };

        // 4. Загружаем файл на GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner: OWNER,
            repo: REPO,
            path: path,
            message: `Register: ${username}`,
            content: Buffer.from(JSON.stringify(userData, null, 2)).toString('base64'),
        });

        return res.status(201).json({ 
            success: true, 
            message: "Account created successfully!" 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error: " + error.message });
    }
}
