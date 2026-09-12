import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, FileText, LayoutDashboard, Video, Settings, LogOut, Grid } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">Central Lens Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/articles" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg">
            <FileText size={20} />
            <span>Articles</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg">
            <Grid size={20} />
            <span>Categories</span>
          </Link>
          <Link href="/admin/videos" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg">
            <Video size={20} />
            <span>Videos</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg mt-8">
            <Home size={20} />
            <span>View Site</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center space-x-3 p-3 w-full hover:bg-gray-800 rounded-lg text-red-400">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">
        {children}
      </main>
    </div>
  );
}
