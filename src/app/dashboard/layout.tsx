"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { tenantsApi } from '@/services/tenants.service';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scissors, Users, LayoutDashboard, Settings, LogOut, Banknote, Tag, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [shopLogo, setShopLogo] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role !== 'OWNER') {
      router.push('/login');
    }
  }, [token, user, router]);

  useEffect(() => {
    if (token && user?.role === 'OWNER') {
      tenantsApi.getSettings().then(data => {
        if (data?.logoUrl) setShopLogo(data.logoUrl);
      }).catch(() => {});
    }
  }, [token, user]);

  if (!user || user?.role !== 'OWNER') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Clock },
    { name: 'Transactions', href: '/dashboard/transactions', icon: Banknote },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Offers', href: '/dashboard/offers', icon: Tag },
    { name: 'Services', href: '/dashboard/services', icon: Scissors },
    { name: 'Employees', href: '/dashboard/employees', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col pt-6 pb-4 border-r bg-white dark:bg-gray-950">
        <div className="px-6 pb-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
            {shopLogo ? (
              <img src={shopLogo} alt="Shop Logo" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <Scissors className="h-6 w-6" />
            )}
            <span>BarberPro</span>
          </Link>
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
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
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
