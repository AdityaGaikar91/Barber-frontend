"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: { monthly: 29, yearly: 290 },
    description: "Perfect for single barbers working solo.",
    features: [
      "Up to 2 Employees",
      "Unlimited Bookings",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 79, yearly: 790 },
    description: "Best for growing shops with a team.",
    features: [
      "Up to 10 Employees",
      "Advanced Analytics",
      "Automated Reminders",
      "Priority Email Support",
      "Multi-tenant Access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 199, yearly: 1990 },
    description: "For large chains with multiple locations.",
    features: [
      "Unlimited Employees",
      "Custom Reporting",
      "Dedicated Representative",
      "White-label Reports",
      "API Access",
    ],
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Choose the plan that fits your business scale. No hidden fees.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center space-x-4 bg-muted/50 p-1 rounded-full border border-border">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isAnnual ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isAnnual ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'border-primary ring-1 ring-primary/30 shadow-2xl' : 'border-border'} bg-background/50 backdrop-blur-xl`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold">${isAnnual ? plan.price.yearly : plan.price.monthly}</span>
                  <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center space-x-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                size="lg" 
                className={`w-full h-12 text-lg font-bold rounded-xl ${!plan.popular ? 'glass' : ''}`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
