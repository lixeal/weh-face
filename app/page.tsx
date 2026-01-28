import { getRepoContent } from '@/lib/github';
import Link from 'next/link';

export default async function Dashboard() {
  // Получаем содержимое папки /data, где лежат наши "репозитории"
  const projects = await getRepoContent('data');

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">My Hosting Hub</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + New Project
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(projects) && projects.map((project: any) => (
            <Link 
              key={project.sha} 
              href={`/repo/${project.name}`}
              className="group border border-slate-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">📦</span>
                <h2 className="font-semibold text-xl group-hover:text-blue-600">{project.name}</h2>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Manage files, releases and edits for this repository.
              </p>
              <div className="flex items-center text-xs text-slate-400">
                <span className="mr-3">Updated: Recently</span>
                <span>Public</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
