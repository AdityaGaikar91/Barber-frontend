import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Users, Scissors } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-primary/30 shadow-[0_0_15px_var(--color-primary)]">
                New: AI-Powered Analytics
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Run Your Barbershop <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-lg">Like a Pro</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Premium analytics, service tracking, and staff management built specifically for modern barbershops.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/30" asChild>
                  <Link href="/register">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 glass" asChild>
                  <Link href="/login">View Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glass rounded-xl p-6 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="p-4 bg-primary/10 rounded-full ring-1 ring-primary/30 shadow-[0_0_20px_var(--color-primary)]">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-time Analytics</h3>
                <p className="text-muted-foreground">Track revenue, popular services, and peak hours instantly.</p>
              </div>
              <div className="glass rounded-xl p-6 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="p-4 bg-primary/10 rounded-full ring-1 ring-primary/30 shadow-[0_0_20px_var(--color-primary)]">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Staff Management</h3>
                <p className="text-muted-foreground">Monitor employee performance and track individual commissions.</p>
              </div>
              <div className="glass rounded-xl p-6 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="p-4 bg-primary/10 rounded-full ring-1 ring-primary/30 shadow-[0_0_20px_var(--color-primary)]">
                  <Scissors className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Service Tracking</h3>
                <p className="text-muted-foreground">Log diverse services instantly with our intuitive POS interface.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
