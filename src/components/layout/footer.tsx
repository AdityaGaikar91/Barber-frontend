import Link from "next/link";
import { Scissors } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 font-bold text-2xl tracking-tighter transition-opacity hover:opacity-80">
              <div className="p-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
                <Scissors className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BarberPro</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The premium management platform for modern barbershops. 
              Built with precision for salon owners who demand excellence.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Product</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Resources</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partners</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Legal</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BarberPro SaaS. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
