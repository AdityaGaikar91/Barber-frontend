import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl bg-primary px-8 py-16 md:px-12 md:py-24 text-center text-primary-foreground shadow-2xl overflow-hidden group">
          {/* Animated Background Details */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-all duration-700" />

          <div className="relative space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Ready to Transform Your Barbershop?
            </h2>
            <p className="text-xl text-primary-foreground/90 font-medium">
              Join hundreds of shop owners who trust BarberPro to manage their growth. 
              Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-xl" asChild>
                <Link href="/register">
                  Grow My Business <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-bold bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:text-white backdrop-blur-sm" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
            <p className="text-sm font-medium opacity-70">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
