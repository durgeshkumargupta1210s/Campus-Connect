import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText, Code2, Brain, Award, Download, ExternalLink } from "lucide-react";

const categories = [
  {
    title: "Programming",
    icon: <Code2 className="w-8 h-8" />,
    count: "150+ resources",
    color: "text-primary",
  },
  {
    title: "Data Structures",
    icon: <Brain className="w-8 h-8" />,
    count: "120+ resources",
    color: "text-accent",
  },
  {
    title: "Interview Prep",
    icon: <Award className="w-8 h-8" />,
    count: "80+ resources",
    color: "text-primary",
  },
  {
    title: "Development",
    icon: <Code2 className="w-8 h-8" />,
    count: "200+ resources",
    color: "text-accent",
  },
];

const resources = [
  {
    title: "Complete DSA Guide",
    type: "PDF",
    icon: <FileText className="w-6 h-6" />,
    size: "15 MB",
    downloads: "1,250",
    category: "Data Structures",
  },
  {
    title: "Web Development Bootcamp",
    type: "Video Course",
    icon: <Video className="w-6 h-6" />,
    size: "25 hours",
    downloads: "850",
    category: "Development",
  },
  {
    title: "Python Programming Notes",
    type: "PDF",
    icon: <FileText className="w-6 h-6" />,
    size: "8 MB",
    downloads: "2,100",
    category: "Programming",
  },
  {
    title: "Interview Questions Bank",
    type: "Document",
    icon: <FileText className="w-6 h-6" />,
    size: "5 MB",
    downloads: "3,500",
    category: "Interview Prep",
  },
  {
    title: "React.js Complete Guide",
    type: "PDF",
    icon: <FileText className="w-6 h-6" />,
    size: "12 MB",
    downloads: "1,680",
    category: "Development",
  },
  {
    title: "Machine Learning Basics",
    type: "Video Course",
    icon: <Video className="w-6 h-6" />,
    size: "18 hours",
    downloads: "920",
    category: "Programming",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 px-4">
          <div className="container mx-auto text-center">
            <BookOpen className="w-20 h-20 text-white mx-auto mb-6 animate-float" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Study Resources Hub
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Access curated study materials, training programs, and skill development resources - all in one place!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => {
                document.getElementById('popular-resources')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Browse Resources
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12">Browse by Category</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                  <CardHeader>
                    <div className={`${category.color} mb-4 group-hover:animate-float`}>
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.count}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Resources */}
        <section id="popular-resources" className="py-20 px-4 bg-secondary">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold">Popular Resources</h2>
              <Button variant="outline">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-lg transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-primary">{resource.icon}</div>
                      <Badge variant="secondary">{resource.type}</Badge>
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <CardDescription>{resource.category}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-semibold">{resource.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="font-semibold text-primary">{resource.downloads}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Training Programs */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-12">Skill Development Programs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Full Stack Development",
                  duration: "12 weeks",
                  level: "Intermediate",
                  enrolled: "120 students",
                },
                {
                  title: "Data Science with Python",
                  duration: "10 weeks",
                  level: "Beginner",
                  enrolled: "95 students",
                },
                {
                  title: "Mobile App Development",
                  duration: "8 weeks",
                  level: "Intermediate",
                  enrolled: "85 students",
                },
                {
                  title: "Cloud Computing Basics",
                  duration: "6 weeks",
                  level: "Beginner",
                  enrolled: "110 students",
                },
              ].map((program, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <Badge>{program.level}</Badge>
                    </div>
                    <CardDescription>Duration: {program.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span>{program.enrolled} enrolled</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4 bg-gradient-hero">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Resources by Numbers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { number: "500+", label: "Study Materials" },
                { number: "50+", label: "Video Courses" },
                { number: "10,000+", label: "Downloads" },
                { number: "20+", label: "Training Programs" },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center">
                  <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
