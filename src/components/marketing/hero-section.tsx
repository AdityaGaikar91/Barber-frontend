"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/30"
          >
            Built for the modern barbershop owner
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Manage Your Shop <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              With Precision.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed"
          >
            The all-in-one SaaS platform to scale your barbershop business. 
            Track performance, automate reminders, and grow your revenue with data-driven insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/20" asChild>
              <Link href="/register">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg glass" asChild>
              <Link href="/login" className="flex items-center">
                <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Dashboard Preview Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-5xl mt-10 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-video rounded-xl border border-border/50 overflow-hidden bg-muted/20">
              {/* Using a placeholder since we don't have a real screenshot yet, but optimized for LCP */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-2xl">
                BarberPro Dashboard Preview
              </div>
              <Image 
                src="/dashpre.png"
                alt="BarberPro Dashboard"
                fill
                priority
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
