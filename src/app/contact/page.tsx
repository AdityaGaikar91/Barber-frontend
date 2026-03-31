import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us | BarberPro",
  description: "Get in touch with the BarberPro team to learn more about our SaaS platform.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Header Section */}
        <section className="w-full py-20 bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />
          
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Get in Touch with Our Team
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions about BarberPro or need help setting up your shop? 
              We're here to help you scale your business.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="container mx-auto px-4 py-16 w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
                <p className="text-muted-foreground">
                  Our support team is available Monday through Friday, 9am to 6pm Est.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50 glass hover:border-primary/50 transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-2">
                      For general inquiries and support
                    </p>
                    <a href="mailto:hello@barberpro.com" className="text-primary font-medium hover:underline">
                      hello@barberpro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50 glass hover:border-primary/50 transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Call Us</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-2">
                      Mon-Fri from 9am to 6pm
                    </p>
                    <a href="tel:+18005550199" className="text-primary font-medium hover:underline">
                      +1 (800) 555-0199
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50 glass hover:border-primary/50 transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Headquarters</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-2">
                      Visit us at our main office
                    </p>
                    <address className="not-italic text-sm text-muted-foreground">
                      123 Innovation Drive<br />
                      Suite 400<br />
                      San Francisco, CA 94105
                    </address>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="relative rounded-2xl border border-border/50 bg-background/50 glass p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <input 
                      id="firstName" 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      placeholder="John" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <input 
                      id="lastName" 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <input 
                    id="email" 
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    placeholder="john@example.com" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <select 
                    id="subject"
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                    placeholder="How can we help you?" 
                  />
                </div>

                <Button type="button" className="w-full text-base h-12 mt-2 shadow-lg">
                  Send Message
                </Button>
              </form>
            </div>
            
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
