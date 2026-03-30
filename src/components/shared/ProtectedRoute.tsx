'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for Zustand hydration
        const checkAuth = () => {
             if (!isAuthenticated) {
                router.replace('/login');
             } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
                 router.replace('/dashboard');
             }
             setIsChecking(false);
        };
        
        checkAuth();
    }, [isAuthenticated, pathname, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Only render children if authenticated (for dashboard routes)
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
        return null;
    }

    return <>{children}</>;
}
