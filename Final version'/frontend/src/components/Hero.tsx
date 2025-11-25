import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy, Zap, Users, BookOpen } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gradient-hero pt-0">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Where Every Student Stays Connected!</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in [animation-delay:0.1s]">
            Welcome to <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">CampusConnect</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s]">
            A smart campus ecosystem designed to make every college moment smoother, smarter & more exciting!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in [animation-delay:0.3s]">
            <Button 
              size="lg" 
              onClick={() => navigate("/create-account")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-glow transition-all"
            >
              Create Account
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in [animation-delay:0.4s]">
            <FeatureCard 
              icon={<Trophy />} 
              title="Events" 
              onClick={() => navigate("/events")}
            />
            <FeatureCard 
              icon={<Zap />} 
              title="Career Growth" 
              onClick={() => navigate("/placements")}
            />
            <FeatureCard 
              icon={<Users />} 
              title="Community" 
              onClick={() => navigate("/community")}
            />
            <FeatureCard 
              icon={<BookOpen />} 
              title="Resources" 
              onClick={() => navigate("/resources")}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick?: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
    >
      <div className="text-white mb-3 flex justify-center">{icon}</div>
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
  );
};

export default Hero;
