const GITHUB_API = 'https://api.github.com';

export async function getRepoContent(path: string = '') {
  const res = await fetch(
    `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${path}`,
    {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      next: { revalidate: 60 } // Кэш на 1 минуту
    }
  );
  return res.json();
}
