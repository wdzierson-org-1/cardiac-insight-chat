import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MoreHorizontal } from "lucide-react";
import { useAssistantUI } from "../assistant-ui-context";
import Female from "@/assets/Female.png";
import Female1 from "@/assets/Female_1.png";
import Male from "@/assets/Male.jpg";

export const EnhancedCommunityCardiologistCard = () => {
  const { showExtraCardiologist } = useAssistantUI();
  
  const doctors = [
    {
      name: "Dr. Asha Menon, MD",
      specialty: "Cardiology",
      org: "Seaside Heart & Vascular",
      blurb:
        "Provides comprehensive cardiac care with a focus on hypertension and lipid disorders.",
      img: Female,
      initials: "AM",
    },
    {
      name: "Dr. Leah Whitman, MD",
      specialty: "Cardiology",
      org: "Clearview Cardiology Associates",
      blurb:
        "Offers community-based cardiac care with an emphasis on outcomes and follow-up.",
      img: Female1,
      initials: "LW",
    },
    {
      name: "Dr. Michael Hellman, MD",
      specialty: "Interventional Cardiology",
      org: "Heart Institute of California",
      blurb:
        "Specializes in advanced cardiac procedures and heart failure management with 15+ years experience.",
      img: Male,
      initials: "MH",
    },
  ];

  const extraDoctor = {
    name: "Dr. Sarah Rodriguez, MD",
    specialty: "Heart Failure Specialist",
    org: "Pacific Cardiovascular Center",
    blurb:
      "Board-certified heart failure specialist with expertise in advanced therapies and device management.",
    img: Female,
    initials: "SR",
  };

  // Replace the last doctor with the extra doctor when showing extra cardiologist
  const displayDoctors = showExtraCardiologist 
    ? [...doctors.slice(0, 2), extraDoctor] 
    : doctors;

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-gold))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">Community Cardiologist Matches</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10"
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {displayDoctors.map((d, i) => (
          <div
            key={i}
            className={
              "flex items-start gap-4 p-4 " + (i > 0 ? "border-t" : "") + (i === displayDoctors.length - 1 && showExtraCardiologist ? " animate-fade-in" : "")
            }
          >
            <Avatar className="h-14 w-14 shadow">
              <AvatarImage src={d.img} alt={d.name} />
              <AvatarFallback>{d.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold leading-snug">{d.name}</div>
              <div className="text-sm text-muted-foreground">{d.specialty}</div>
              <div className="text-base text-muted-foreground/90">{d.org}</div>
              <div className="text-sm italic text-muted-foreground mt-1 line-clamp-1">
                {d.blurb}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};