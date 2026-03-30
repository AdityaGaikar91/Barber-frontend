import Image from "next/image";

const testimonials = [
  {
    name: "Marco Rossi",
    role: "Owner, The Classic Fade",
    content: "BarberPro changed how I track my staff. I finally know exactly who my top performers are every single week.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Sarah Jenkins",
    role: "Manager, Urban Cuts",
    content: "The automated reminders reduced our no-show rate by 40%. It's like having a full-time assistant for a fraction of the cost.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "David Chen",
    role: "Owner, Skyline Barbers",
    content: "Scaling to three locations was a breeze with the multi-tenant dashboard. I can see all my shops in one place.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-center sm:text-4xl md:text-5xl mb-16 underline decoration-primary/30 decoration-8 underline-offset-8">
          Trusted by Shop Owners Everywhere
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-xl shadow-black/5">
              <p className="text-lg italic text-muted-foreground leading-relaxed italic font-medium">
                &quot;{t.content}&quot;
              </p>
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-primary/20 bg-muted">
                  <Image 
                    src={t.avatar} 
                    alt={t.name} 
                    fill 
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
