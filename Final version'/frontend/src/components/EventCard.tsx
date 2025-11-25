import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  imageColor: string;
}

const EventCard = ({ title, date, location, attendees, category, imageColor }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 bg-gradient-card border-border group">
      <div className={`h-48 ${imageColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
          {category}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm">{attendees} attending</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Register with QR
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
