import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Sparkles, 
  Share2, 
  Search, 
  CheckCircle2,
  Users,
  Briefcase,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">WorkWave</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="ghost" data-testid="button-browse">
                Browse Workers
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Your Professional Profile.{" "}
                  <span className="text-primary">In Minutes, Not Hours.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Empower your work. Create stunning digital profiles that get you discovered and hired. 
                  AI-powered, mobile-friendly, and completely free.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-base font-semibold px-8"
                    data-testid="button-create-profile"
                  >
                    Create Your Free Profile
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto text-base font-semibold px-8"
                    data-testid="button-browse-workers"
                  >
                    Browse Worker Profiles
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <span className="font-medium">Join thousands of gig workers already empowered</span>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-card-border">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">AI-Powered Bio Generation</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-card-border">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Instant QR Code Sharing</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-card-border">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Download as Image or PDF</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-card-border">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">Get Discovered by Recruiters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to create your professional digital presence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 md:p-8 hover-elevate">
              <CardContent className="space-y-4 p-0">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">01</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Fill Simple Form</h3>
                <p className="text-muted-foreground">
                  Enter your basic information, skills, and experience. Upload a photo and add portfolio links.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 md:p-8 hover-elevate">
              <CardContent className="space-y-4 p-0">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">AI Generates Profile</h3>
                <p className="text-muted-foreground">
                  Our AI crafts a polished bio and catchy slogan that highlights your unique skills and experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 md:p-8 hover-elevate">
              <CardContent className="space-y-4 p-0">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Share2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Share Everywhere</h3>
                <p className="text-muted-foreground">
                  Download, share via WhatsApp, generate QR codes, or publish to our talent showcase.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Worker CTA */}
            <Card className="p-8 md:p-10 space-y-6 hover-elevate">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">I'm a Worker</h3>
                <p className="text-muted-foreground">
                  Create your professional profile and get discovered by employers looking for your skills.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>AI-powered profile creation</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Instant sharing options</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Get found by recruiters</span>
                  </li>
                </ul>
              </div>
              <Link href="/create">
                <Button className="w-full" size="lg" data-testid="button-worker-cta">
                  Create My Profile
                </Button>
              </Link>
            </Card>

            {/* Recruiter CTA */}
            <Card className="p-8 md:p-10 space-y-6 hover-elevate">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">I'm Hiring</h3>
                <p className="text-muted-foreground">
                  Search and discover talented gig workers ready to bring value to your business.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Search by skill & location</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>View detailed profiles</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Contact workers directly</span>
                  </li>
                </ul>
              </div>
              <Link href="/browse">
                <Button className="w-full" variant="outline" size="lg" data-testid="button-recruiter-cta">
                  Browse Talent
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">WorkWave</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering gig workers to showcase their skills and get hired
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
