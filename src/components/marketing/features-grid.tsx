import { BarChart3, Users, Scissors, Zap, ShieldCheck, HeartPulse } from "lucide-react";

const features = [
  {
    title: "Real-time Analytics",
    description: "Track revenue, popular services, and peak hours instantly from your dashboard.",
    icon: BarChart3,
  },
  {
    title: "Staff Management",
    description: "Monitor employee performance, track service history and manage commissions.",
    icon: Users,
  },
  {
    title: "Service Tracking",
    description: "Log every haircut, beard trim, and facial with a simple and lightning-fast UI.",
    icon: Scissors,
  },
  {
    title: "Automated Reminders",
    description: "Automatically re-engage customers after 2 weeks of inactivity to boost retention.",
    icon: Zap,
  },
  {
    title: "Tenant Isolation",
    description: "Multi-tenant architecture ensures every barbershop's data is strictly isolated.",
    icon: ShieldCheck,
  },
  {
    title: "Customer Loyalty",
    description: "Maintain deep customer histories and launch promotional offers to keep them coming back.",
    icon: HeartPulse,
  },
];

export function FeaturesGrid() {
  return (
    <section className="w-full py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Everything You Need to Scale
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
            Powerful tools for single shop owners and large multi-location chains.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="glass relative group overflow-hidden rounded-2xl p-8 flex flex-col items-center text-center space-y-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:translate-y-[-4px]"
            >
              <div className="p-5 bg-primary/10 rounded-2xl ring-1 ring-primary/30 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.1)] group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
