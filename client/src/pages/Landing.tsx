import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShieldCheck, BarChart3, Lock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">UF</div>
            <span className="font-display font-bold text-lg tracking-tight">Unified Farm</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/traceability/demo" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Traceability Demo
            </a>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <a href="/api/login">
                Member Login
                <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background gradient blob */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-accent/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6 border border-secondary-foreground/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            New: AI-Powered Crop Advisories
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto">
            Cultivate Smarter with <br className="hidden md:block" />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Intelligent Farming
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage your farms, track yields, and provide transparent traceability from soil to shelf. The complete operating system for modern agriculture.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90">
              <a href="/api/login">Get Started Free</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base border-border hover:bg-secondary/50">
              <Link href="/traceability/demo">View Demo Traceability</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Leaf className="text-primary" size={32} />}
              title="Smart Crop Management"
              description="Track planting schedules, growth stages, and expected harvests with intelligent dashboarding."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-accent-foreground" size={32} />}
              title="AI Advisories"
              description="Receive real-time, AI-generated advice for weather events, pest control, and irrigation optimization."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-blue-600" size={32} />}
              title="Blockchain Traceability"
              description="Generate immutable QR codes that prove your produce's journey and carbon footprint to consumers."
            />
          </div>
        </div>
      </section>

      <footer className="py-12 bg-background border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Unified Farm Intelligence Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-secondary/30 transition-colors duration-300">
      <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
