'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Image,
  FileText,
  Target,
  Briefcase,
  Award,
  Heart,
  ImageIcon,
  Newspaper,
  Users,
  Mail,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Palette,
  BarChart3,
  UserPlus,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { admin, setAdmin, isSidebarOpen, toggleSidebar } = useAppStore();

  useEffect(() => {
    // Check if admin is authenticated
    if (!admin) {
      router.push('/admin/login');
    }
  }, [admin, router]);

  const handleLogout = () => {
    setAdmin(null);
    router.push('/admin/login');
  };

  if (!admin) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hello Slides', href: '/admin/slides', icon: Image },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Programs', href: '/admin/programs', icon: Briefcase },
    { name: 'Achievements', href: '/admin/achievements', icon: Award },
    { name: 'Core Values', href: '/admin/core-values', icon: Heart },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'News', href: '/admin/news', icon: Newspaper },
    { name: 'Leadership', href: '/admin/leadership', icon: Users },
    { name: 'Contacts', href: '/admin/contacts', icon: Mail },
    { name: 'Donations', href: '/admin/donations', icon: DollarSign },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Theme', href: '/admin/theme', icon: Palette },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Users', href: '/admin/users', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{admin.fullName}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-20 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-200 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

