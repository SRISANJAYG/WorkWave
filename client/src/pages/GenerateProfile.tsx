import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfileCard } from "@/components/ProfileCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Sparkles,
  Download,
  Share2,
  QrCode,
  Check,
  Loader2,
  Home,
  Eye,
  AlertCircle
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@shared/schema";

export default function GenerateProfile() {
  const [, setLocationPath] = useLocation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [savedProfileId, setSavedProfileId] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);
  const [manualBio, setManualBio] = useState("");
  const [manualSlogan, setManualSlogan] = useState("");

  useEffect(() => {
    const formDataStr = sessionStorage.getItem("profileFormData");
    if (!formDataStr) {
      setLocationPath("/create");
      return;
    }

    const formData = JSON.parse(formDataStr);
    
    // Generate AI content and save profile
    const generateAndSave = async () => {
      try {
        // Generate bio and slogan with AI
        const aiContent = await apiRequest<{ bio: string; slogan: string }>(
          "POST",
          "/api/profiles/generate",
          {
            name: formData.name,
            skill: formData.skill,
            location: formData.location,
            languages: formData.languages,
            experience: formData.experience,
            workingHours: formData.workingHours,
          }
        );

        const completeProfile = {
          ...formData,
          bio: aiContent.bio,
          slogan: aiContent.slogan,
        };

        // Save profile to database
        const savedProfile = await apiRequest<Profile>("POST", "/api/profiles", completeProfile);
        
        setProfile(savedProfile);
        setSavedProfileId(savedProfile.id);
        setIsGenerating(false);
        
        // Clear session storage
        sessionStorage.removeItem("profileFormData");
      } catch (error) {
        console.error("Error generating profile:", error);
        setIsGenerating(false);
        setAiError(true);
        setProfile(formData);
        toast({
          title: "AI Generation Unavailable",
          description: "You can enter your bio and slogan manually below.",
          variant: "destructive",
        });
      }
    };

    generateAndSave();
  }, [setLocationPath, toast]);

  const handleDownloadImage = () => {
    toast({
      title: "Download Started",
      description: "Your profile image is being prepared...",
    });
  };

  const handleShare = async () => {
    if (savedProfileId) {
      const shareUrl = `${window.location.origin}/profile/${savedProfileId}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${profile?.name}'s Profile - WorkWave`,
            text: `Check out my professional profile on WorkWave!`,
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
    }
  };

  const handleGenerateQR = () => {
    if (savedProfileId) {
      const profileUrl = `${window.location.origin}/profile/${savedProfileId}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
      setQrCodeUrl(qrUrl);
      setShowQR(true);
    }
  };

  const handleSaveManual = async () => {
    if (!manualBio.trim() || !manualSlogan.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both a bio and slogan",
        variant: "destructive",
      });
      return;
    }

    try {
      const completeProfile = {
        ...profile,
        bio: manualBio,
        slogan: manualSlogan,
      };

      const savedProfile = await apiRequest<Profile>("POST", "/api/profiles", completeProfile);
      setProfile(savedProfile);
      setSavedProfileId(savedProfile.id);
      setAiError(false);
      sessionStorage.removeItem("profileFormData");
      
      toast({
        title: "Profile Saved!",
        description: "Your profile has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMakePublic = async () => {
    if (!savedProfileId) return;
    
    try {
      await apiRequest("PATCH", `/api/profiles/${savedProfileId}`, {
        isPublic: true,
      });
      
      toast({
        title: "Profile Published!",
        description: "Your profile is now visible in the talent showcase",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish profile",
        variant: "destructive",
      });
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Generating Your Profile
            </h2>
            <p className="text-muted-foreground">
              Our AI is crafting your professional bio and slogan...
            </p>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">WorkWave</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Success/Manual Entry Header */}
        <div className="max-w-4xl mx-auto mb-8 text-center space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${aiError ? 'bg-orange-500/10' : 'bg-primary/10'}`}>
            {aiError ? (
              <AlertCircle className="w-8 h-8 text-orange-500" />
            ) : (
              <Check className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {aiError ? "Almost There!" : "Your Profile is Ready!"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {aiError 
              ? "Please add your bio and slogan to complete your profile" 
              : "Share it with the world and start getting discovered"
            }
          </p>
        </div>

        {/* Manual Entry Form */}
        {aiError && (
          <Card className="max-w-2xl mx-auto mb-8 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="manual-slogan">Your Professional Slogan *</Label>
                <Input
                  id="manual-slogan"
                  placeholder="e.g., Fresh Flavors, Every Day"
                  value={manualSlogan}
                  onChange={(e) => setManualSlogan(e.target.value)}
                  data-testid="input-manual-slogan"
                />
                <p className="text-xs text-muted-foreground">
                  A catchy tagline that describes what you do
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-bio">Your Professional Bio *</Label>
                <Textarea
                  id="manual-bio"
                  placeholder="Tell potential employers about your skills, experience, and what makes you unique..."
                  value={manualBio}
                  onChange={(e) => setManualBio(e.target.value)}
                  rows={6}
                  data-testid="input-manual-bio"
                />
                <p className="text-xs text-muted-foreground">
                  Describe your experience and what makes you great at what you do
                </p>
              </div>

              <Button
                onClick={handleSaveManual}
                className="w-full"
                disabled={!manualBio.trim() || !manualSlogan.trim()}
                data-testid="button-save-manual"
              >
                Save Profile
              </Button>
            </div>
          </Card>
        )}

        {/* Profile Preview - Only show if not in error state or if profile is saved */}
        {!aiError && (
          <>
            <div className="max-w-2xl mx-auto mb-8">
              <ProfileCard profile={profile} />
            </div>

            {/* Action Buttons */}
            <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={handleDownloadImage}
              variant="outline"
              className="w-full"
              data-testid="button-download-image"
            >
              <Download className="w-4 h-4 mr-2" />
              Download as Image
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full"
              data-testid="button-share"
              disabled={!savedProfileId}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>

            <Button
              onClick={handleGenerateQR}
              variant="outline"
              className="w-full"
              data-testid="button-qr-code"
              disabled={!savedProfileId}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>

            <Button
              onClick={handleMakePublic}
              variant="outline"
              className="w-full"
              data-testid="button-make-public"
            >
              <Eye className="w-4 h-4 mr-2" />
              Add to Showcase
            </Button>
          </div>

          {/* QR Code Display */}
          {showQR && qrCodeUrl && (
            <Card className="p-6 text-center mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Profile QR Code</h3>
              <img
                src={qrCodeUrl}
                alt="Profile QR Code"
                className="mx-auto mb-4"
                data-testid="img-qr-code"
              />
              <p className="text-sm text-muted-foreground">
                Scan this code to view your profile
              </p>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={() => setLocationPath("/")}
              variant="outline"
              className="flex-1"
              data-testid="button-home"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => setLocationPath("/browse")}
              className="flex-1"
              data-testid="button-browse"
            >
              Browse Talent
            </Button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
