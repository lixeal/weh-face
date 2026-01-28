import { getRepoContent } from '@/lib/github';
import { uploadToGithub, createFolder } from './actions';

export default async function RepoPage({ searchParams }: { searchParams: { path?: string } }) {
  const currentPath = searchParams.path || '';
  const contents = await getRepoContent(currentPath);

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">My Personal Repo: /{currentPath}</h1>

      {/* Кнопки управления */}
      <div className="flex gap-4 mb-6 p-4 border rounded-md bg-gray-50">
        <form action={async (formData) => {
          'use server';
          const name = formData.get('folderName') as string;
          await createFolder(name, currentPath);
        }}>
          <input name="folderName" placeholder="New folder name" className="border p-1 mr-2" />
          <button className="bg-green-600 text-white px-3 py-1 rounded">Create Folder</button>
        </form>
      </div>

      {/* Список файлов */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 p-2 border-b text-sm text-gray-600">Files</div>
        {Array.isArray(contents) && contents.map((item: any) => (
          <div key={item.sha} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              {item.type === 'dir' ? '📁' : '📄'}
              <a 
                href={item.type === 'dir' ? `?path=${item.path}` : item.download_url} 
                className="text-blue-600 hover:underline"
              >
                {item.name}
              </a>
            </div>
            <div className="text-xs text-gray-400">
              {item.type !== 'dir' && <a href={`/api/raw/${item.path}`}>Raw</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
