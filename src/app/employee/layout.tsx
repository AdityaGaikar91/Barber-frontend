"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Scissors, LayoutDashboard, LogOut, Banknote } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else if (user?.role !== 'EMPLOYEE') {
       // Stop owners from accessing employee portal, just to be safe.
       router.push('/dashboard');
    }
  }, [token, user, router]);

  if (!user || user.role !== 'EMPLOYEE') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Overview', href: '/employee', icon: LayoutDashboard },
    { name: 'Log Service', href: '/employee/transactions', icon: Banknote },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col pt-6 pb-4 border-r bg-white dark:bg-gray-950">
        <div className="px-6 pb-6">
          <Link href="/employee" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
            <Scissors className="h-6 w-6" />
            <span>BarberPro</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 px-1">Staff Portal</p>
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
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-6 border-t mx-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs text-gray-500 mt-1 capitalize">{user.role.toLowerCase()}</span>
            </div>
          </div>
          <ThemeToggle />
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
