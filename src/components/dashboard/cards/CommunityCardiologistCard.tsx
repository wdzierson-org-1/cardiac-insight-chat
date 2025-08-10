import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MoreHorizontal } from "lucide-react";
import doc1 from "@/assets/patient-avatar.jpg";
import doc2 from "@/assets/patient-avatar.jpg";

export const CommunityCardiologistCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-gold))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">Community Cardiologist Matches</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[{
          name: "Dr. Asha Menon, MD",
          org: "Seaside Heart & Vascular",
          blurb: "Provides comprehensive cardiac care with a focus on hypertension and lipid disorders.",
          img: doc1,
          initials: "AM",
        },{
          name: "Dr. Leah Whitman, MD",
          org: "Clearview Cardiology Associates",
          blurb: "Offers community-based cardiac care with emphasis on outcomes and follow-up.",
          img: doc2,
          initials: "LW",
        }].map((d, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border p-3 bg-background/60">
            <Avatar className="h-10 w-10">
              <AvatarImage src={d.img} alt={d.name} />
              <AvatarFallback>{d.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium truncate">{d.name}</div>
              <div className="text-xs text-muted-foreground truncate">Cardiology • {d.org}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.blurb}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
