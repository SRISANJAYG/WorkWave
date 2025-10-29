import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ProfileCard } from "@/components/ProfileCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Upload,
  Plus,
  X,
  Loader2
} from "lucide-react";
import { insertProfileSchema } from "@shared/schema";

const formSchema = insertProfileSchema.extend({
  languages: z.string().min(1, "At least one language is required"),
  portfolioLinks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Basic Info", fields: ["name", "skill", "location"] },
  { id: 2, title: "Details", fields: ["languages", "experience", "workingHours"] },
  { id: 3, title: "Contact & Portfolio", fields: ["contactEmail", "contactPhone", "photoUrl", "portfolioLinks"] },
  { id: 4, title: "Review", fields: [] },
];

export default function CreateProfile() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Partial<FormData>>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      skill: "",
      location: "",
      languages: "",
      experience: "",
      workingHours: "",
      contactEmail: "",
      contactPhone: "",
      photoUrl: "",
      portfolioLinks: "",
      bio: "",
      slogan: "",
      isPublic: false,
    },
    mode: "onChange",
  });

  const watchedFields = form.watch();

  const updatePreview = () => {
    const values = form.getValues();
    setPreviewData({
      ...values,
      languages: languages,
      portfolioLinks: portfolioLinks,
    });
  };

  const addLanguage = () => {
    if (languageInput.trim() && !languages.includes(languageInput.trim())) {
      const newLanguages = [...languages, languageInput.trim()];
      setLanguages(newLanguages);
      setLanguageInput("");
      form.setValue("languages", newLanguages.join(", "), { shouldValidate: true });
      updatePreview();
    }
  };

  const removeLanguage = (lang: string) => {
    const newLanguages = languages.filter((l) => l !== lang);
    setLanguages(newLanguages);
    form.setValue("languages", newLanguages.join(", "), { shouldValidate: true });
    updatePreview();
  };

  const addPortfolioLink = () => {
    if (portfolioInput.trim() && !portfolioLinks.includes(portfolioInput.trim())) {
      const newLinks = [...portfolioLinks, portfolioInput.trim()];
      setPortfolioLinks(newLinks);
      setPortfolioInput("");
      form.setValue("portfolioLinks", newLinks.join(", "));
      updatePreview();
    }
  };

  const removePortfolioLink = (link: string) => {
    const newLinks = portfolioLinks.filter((l) => l !== link);
    setPortfolioLinks(newLinks);
    form.setValue("portfolioLinks", newLinks.join(", "));
    updatePreview();
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const fields = STEPS[step - 1].fields as Array<keyof FormData>;
    if (fields.length === 0) return true;
    
    const result = await form.trigger(fields);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      updatePreview();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    const profileData = {
      ...data,
      languages: languages,
      portfolioLinks: portfolioLinks,
    };
    
    // Navigate to generate page with form data
    sessionStorage.setItem("profileFormData", JSON.stringify(profileData));
    setLocation("/generate");
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">WorkWave</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </h2>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-form" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div>
            <Card className="p-6 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Let's start with the basics
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tell us about yourself and your profession
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="e.g., Maria Santos"
                        data-testid="input-name"
                        onBlur={updatePreview}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skill">Skill / Profession *</Label>
                      <Input
                        id="skill"
                        {...form.register("skill")}
                        placeholder="e.g., Street Vendor, Delivery Agent, Artisan"
                        data-testid="input-skill"
                        onBlur={updatePreview}
                      />
                      {form.formState.errors.skill && (
                        <p className="text-sm text-destructive">{form.formState.errors.skill.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        What service or product do you offer?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location / City *</Label>
                      <Input
                        id="location"
                        {...form.register("location")}
                        placeholder="e.g., Mumbai, India"
                        data-testid="input-location"
                        onBlur={updatePreview}
                      />
                      {form.formState.errors.location && (
                        <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Share more details
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Help employers understand your experience
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Languages You Speak *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={languageInput}
                          onChange={(e) => setLanguageInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                          placeholder="e.g., English"
                          data-testid="input-language"
                        />
                        <Button 
                          type="button" 
                          onClick={addLanguage}
                          size="icon"
                          data-testid="button-add-language"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {languages.map((lang) => (
                          <div
                            key={lang}
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            data-testid={`badge-language-${lang}`}
                          >
                            <span>{lang}</span>
                            <button
                              type="button"
                              onClick={() => removeLanguage(lang)}
                              className="hover-elevate rounded-full"
                              data-testid={`button-remove-language-${lang}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.languages && (
                        <p className="text-sm text-destructive">{form.formState.errors.languages.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience / Tagline *</Label>
                      <Textarea
                        id="experience"
                        {...form.register("experience")}
                        placeholder="e.g., 5 years serving the best street food in Mumbai"
                        rows={3}
                        data-testid="input-experience"
                        onBlur={updatePreview}
                      />
                      {form.formState.errors.experience && (
                        <p className="text-sm text-destructive">{form.formState.errors.experience.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workingHours">Working Hours *</Label>
                      <Input
                        id="workingHours"
                        {...form.register("workingHours")}
                        placeholder="e.g., Mon-Fri 9 AM - 6 PM"
                        data-testid="input-hours"
                        onBlur={updatePreview}
                      />
                      {form.formState.errors.workingHours && (
                        <p className="text-sm text-destructive">{form.formState.errors.workingHours.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Contact & Portfolio */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        How can employers reach you?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add your contact details and showcase your work
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email (Optional)</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        {...form.register("contactEmail")}
                        placeholder="your.email@example.com"
                        data-testid="input-email"
                        onBlur={updatePreview}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
                      <Input
                        id="contactPhone"
                        {...form.register("contactPhone")}
                        placeholder="+91 98765 43210"
                        data-testid="input-phone"
                        onBlur={updatePreview}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photoUrl">Profile Photo URL (Optional)</Label>
                      <Input
                        id="photoUrl"
                        {...form.register("photoUrl")}
                        placeholder="https://example.com/photo.jpg"
                        data-testid="input-photo"
                        onBlur={updatePreview}
                      />
                      <p className="text-xs text-muted-foreground">
                        Paste a link to your profile photo
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Portfolio Links (Optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={portfolioInput}
                          onChange={(e) => setPortfolioInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolioLink())}
                          placeholder="https://example.com/my-work"
                          data-testid="input-portfolio"
                        />
                        <Button 
                          type="button" 
                          onClick={addPortfolioLink}
                          size="icon"
                          data-testid="button-add-portfolio"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {portfolioLinks.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                            data-testid={`item-portfolio-${index}`}
                          >
                            <span className="text-sm truncate flex-1">{link}</span>
                            <button
                              type="button"
                              onClick={() => removePortfolioLink(link)}
                              className="hover-elevate p-1 rounded-md"
                              data-testid={`button-remove-portfolio-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Review your information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Check everything looks good, then generate your AI-powered profile
                      </p>
                    </div>

                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Name:</span>
                          <p className="text-foreground">{form.getValues("name")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Skill:</span>
                          <p className="text-foreground">{form.getValues("skill")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Location:</span>
                          <p className="text-foreground">{form.getValues("location")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Languages:</span>
                          <p className="text-foreground">{languages.join(", ")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            AI-Powered Generation
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Our AI will create a professional bio and catchy slogan based on your information
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                      data-testid="button-prev-step"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1"
                      data-testid="button-next-step"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1"
                      data-testid="button-generate"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Profile
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
              <ProfileCard
                profile={{
                  ...previewData,
                  name: watchedFields.name || previewData.name,
                  skill: watchedFields.skill || previewData.skill,
                  location: watchedFields.location || previewData.location,
                  experience: watchedFields.experience || previewData.experience,
                  workingHours: watchedFields.workingHours || previewData.workingHours,
                  contactEmail: watchedFields.contactEmail || previewData.contactEmail,
                  contactPhone: watchedFields.contactPhone || previewData.contactPhone,
                  photoUrl: watchedFields.photoUrl || previewData.photoUrl,
                  languages: languages,
                  portfolioLinks: portfolioLinks,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
