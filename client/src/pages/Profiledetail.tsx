import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@shared/schema";
import {
  Sparkles,
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Share2,
  Loader2
} from "lucide-react";

export default function ProfileDetail() {
  const [, params] = useRoute("/profile/:id");
  const { toast } = useToast();
  const profileId = params?.id || "";

  // Fetch profile from backend
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ["/api/profiles", profileId],
    enabled: !!profileId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Profile Not Found</h2>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
          <Link href="/browse">
            <Button>Browse Profiles</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleContact = (method: string) => {
    toast({
      title: "Contact Information",
      description: `Opening ${method} to contact ${profile.name}...`,
    });

    if (method === "email" && profile.contactEmail) {
      window.location.href = `mailto:${profile.contactEmail}`;
    } else if (method === "phone" && profile.contactPhone) {
      window.location.href = `tel:${profile.contactPhone}`;
    } else if (method === "whatsapp" && profile.contactPhone) {
      const phone = profile.contactPhone.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile - WorkWave`,
          text: `Check out ${profile.name}'s professional profile on WorkWave!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/browse">
            <Button variant="ghost" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">WorkWave</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <ProfileCard profile={profile} />
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Contact Worker</h3>
                  
                  {profile.contactEmail && (
                    <Button
                      onClick={() => handleContact("email")}
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-contact-email"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  )}

                  {profile.contactPhone && (
                    <>
                      <Button
                        onClick={() => handleContact("phone")}
                        variant="outline"
                        className="w-full justify-start"
                        data-testid="button-contact-phone"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>

                      <Button
                        onClick={() => handleContact("whatsapp")}
                        className="w-full justify-start bg-[#25D366] hover:bg-[#20BD5A] text-white"
                        data-testid="button-contact-whatsapp"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </>
                  )}

                  {!profile.contactEmail && !profile.contactPhone && (
                    <p className="text-sm text-muted-foreground text-center p-4 bg-muted/50 rounded-lg">
                      No contact information available
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full"
                  data-testid="button-share-profile"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">About WorkWave</h4>
                  <p className="text-xs text-muted-foreground">
                    This profile was created using WorkWave, a platform that empowers gig workers to showcase their skills.
                  </p>
                  <Link href="/create">
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                      Create your own profile →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
