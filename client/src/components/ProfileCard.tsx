import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Mail, Phone, Languages } from "lucide-react";
import type { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Partial<Profile>;
  className?: string;
}

export function ProfileCard({ profile, className = "" }: ProfileCardProps) {
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WW";

  return (
    <Card className={`overflow-hidden ${className}`} data-testid="card-profile">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            <AvatarImage src={profile.photoUrl} alt={profile.name} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-profile-name">
              {profile.name || "Your Name"}
            </h2>
            <p className="text-lg font-medium text-primary" data-testid="text-profile-skill">
              {profile.skill || "Your Profession"}
            </p>
          </div>
        </div>

        {/* Slogan */}
        {profile.slogan && (
          <div className="text-center">
            <p className="text-base md:text-lg font-medium italic text-muted-foreground" data-testid="text-profile-slogan">
              "{profile.slogan}"
            </p>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              About
            </h3>
            <p className="text-sm leading-relaxed text-foreground" data-testid="text-profile-bio">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="space-y-3">
          {profile.location && (
            <div className="flex items-start gap-3" data-testid="text-profile-location">
              <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground">{profile.location}</span>
            </div>
          )}
          
          {profile.workingHours && (
            <div className="flex items-start gap-3" data-testid="text-profile-hours">
              <Clock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground">{profile.workingHours}</span>
            </div>
          )}
          
          {profile.languages && profile.languages.length > 0 && (
            <div className="flex items-start gap-3" data-testid="text-profile-languages">
              <Languages className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground">{profile.languages.join(", ")}</span>
            </div>
          )}

          {profile.contactEmail && (
            <div className="flex items-start gap-3" data-testid="text-profile-email">
              <Mail className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground break-all">{profile.contactEmail}</span>
            </div>
          )}

          {profile.contactPhone && (
            <div className="flex items-start gap-3" data-testid="text-profile-phone">
              <Phone className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground">{profile.contactPhone}</span>
            </div>
          )}
        </div>

        {/* Experience */}
        {profile.experience && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Experience
            </h3>
            <p className="text-sm text-foreground" data-testid="text-profile-experience">
              {profile.experience}
            </p>
          </div>
        )}

        {/* Portfolio Links */}
        {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Portfolio
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.portfolioLinks.map((link, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                  data-testid={`badge-portfolio-${index}`}
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Link {index + 1}
                  </a>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
