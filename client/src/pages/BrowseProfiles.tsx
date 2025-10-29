import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Profile } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Search,
  MapPin,
  Briefcase,
  X,
  Filter,
  Loader2
} from "lucide-react";

export default function BrowseProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch profiles from backend
  const { data: allProfiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  // Extract unique skills and locations from profiles
  const skills = ["all", ...Array.from(new Set(allProfiles.map(p => p.skill)))];
  const locations = ["all", ...Array.from(new Set(allProfiles.map(p => {
    const city = p.location.split(",")[0].trim();
    return city;
  })))];

  const filteredProfiles = allProfiles.filter((profile) => {
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkill === "all" || profile.skill === selectedSkill;
    const matchesLocation = selectedLocation === "all" || profile.location.includes(selectedLocation);
    
    return matchesSearch && matchesSkill && matchesLocation;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSkill("all");
    setSelectedLocation("all");
  };

  const hasActiveFilters = searchQuery || selectedSkill !== "all" || selectedLocation !== "all";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">WorkWave</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button data-testid="button-create-profile">
                Create Profile
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Discover Talented Workers
            </h1>
            <p className="text-lg text-muted-foreground">
              Find skilled gig workers in your area ready to bring value to your business
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill, or location..."
                className="pl-12 pr-4 h-12 text-base"
                data-testid="input-search"
              />
            </div>

            {/* Filter Toggle for Mobile */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
                data-testid="button-toggle-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Skill Category</label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger data-testid="select-skill">
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill === "all" ? "All Skills" : skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger data-testid="select-location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === "all" ? "All Locations" : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                {filteredProfiles.length} {filteredProfiles.length === 1 ? "worker" : "workers"} found
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading profiles...</p>
                </div>
              </div>
            )}

            {/* Profile Grid */}
            {!isLoading && filteredProfiles.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => {
                  const initials = profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                  <Link key={profile.id} href={`/profile/${profile.id}`}>
                    <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-profile-${profile.id}`}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16 border-2 border-primary/10">
                            <AvatarImage src={profile.photoUrl} alt={profile.name} />
                            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate" data-testid={`text-name-${profile.id}`}>
                              {profile.name}
                            </h3>
                            <p className="text-sm text-primary font-medium" data-testid={`text-skill-${profile.id}`}>
                              {profile.skill}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{profile.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{profile.experience}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {profile.languages.slice(0, 3).map((lang) => (
                            <Badge key={lang} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>

                        <Button className="w-full" size="sm" data-testid={`button-view-${profile.id}`}>
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProfiles.length === 0 && (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">No workers found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
