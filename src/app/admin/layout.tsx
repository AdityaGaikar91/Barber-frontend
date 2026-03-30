"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, Store, LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token || user?.role !== 'SUPER_ADMIN') {
      router.push('/login');
    }
  }, [token, user, router]);

  if (!user || user?.role !== 'SUPER_ADMIN') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'All Shops', href: '/admin/shops', icon: Store },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
      {/* Dark Authority Sidebar */}
      <aside className="w-64 flex flex-col pt-6 pb-4 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="px-6 pb-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-white">BarberPro</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Super Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-6 border-t border-gray-700 mx-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarFallback className="bg-blue-500/20 text-blue-400 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none text-white">{user.name}</span>
              <span className="text-xs text-gray-400 mt-1">Platform Admin</span>
            </div>
          </div>
          <ThemeToggle />
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
