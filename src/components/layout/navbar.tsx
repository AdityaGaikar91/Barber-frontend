import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
                <div className="flex flex-1 items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/50">
                        <Scissors className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r dark:from-white dark:to-white/60 from-slate-900 to-slate-900/60 bg-clip-text text-transparent">
                        BarberPro
                    </span>
                </div>

                <nav className="hidden md:flex flex-1 justify-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Services
                    </Link>
                    <Link href="/employees" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Staff
                    </Link>
                </nav>

                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                    <div className="hidden sm:block w-[90px]">
                        <ThemeToggle className="p-0" />
                    </div>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary" asChild>
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.5)] border border-primary/20" asChild>
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
