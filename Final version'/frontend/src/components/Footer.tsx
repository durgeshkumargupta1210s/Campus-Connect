import { Heart, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { emailService } from "@/services/emailService";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await emailService.subscribe(email);
    
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message
    });

    if (result.success) {
      setEmail("");
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }

    setLoading(false);
  };

  return (
    <footer className="bg-gradient-hero relative overflow-hidden">
      {/* Newsletter Section */}
      <section className="py-16 px-4 border-b border-white/10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-white/80">Get the latest news about events, hackathons, and opportunities</p>
            </div>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="email"
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
                  disabled={loading}
                  required
                />
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              {message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === "success" 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-2xl mb-4">CampusConnect</h3>
              <p className="text-white/80 text-sm mb-6">
                Where Every Student Stays Connected! Your ultimate campus companion.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors" title="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors" title="Linkedin">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Features</h4>
              <ul className="space-y-3 text-white/80 text-sm">
                <li><a href="/qr-registration" className="hover:text-white transition-colors">QR Registration</a></li>
                <li><a href="/fast-entry" className="hover:text-white transition-colors">Fast Entry</a></li>
                <li><a href="/events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="/placements" className="hover:text-white transition-colors">Placements</a></li>
                <li><a href="/resources" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            {/* Community */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Community</h4>
              <ul className="space-y-3 text-white/80 text-sm">
                <li><a href="/community" className="hover:text-white transition-colors">Join Clubs</a></li>
                <li><a href="/resources" className="hover:text-white transition-colors">Study Resources</a></li>
                <li><a href="/community" className="hover:text-white transition-colors">Discussion Forum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events Calendar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Announcements</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Get In Touch</h4>
              <div className="space-y-4 text-white/80 text-sm">
                <div className="flex gap-3 items-start">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <a href="mailto:hello@campusconnect.edu" className="hover:text-white transition-colors">hello@campusconnect.edu</a>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Phone</div>
                    <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 9876 543 210</a>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Location</div>
                    <div>Campus, City, Country</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-white/80 text-sm flex items-center justify-center gap-2">
                Built with <Heart className="w-4 h-4 text-accent fill-accent" /> for a connected campus
              </p>
              <p className="text-white/60 text-sm">
                © 2024 CampusConnect. All rights reserved.
              </p>
              <div className="flex gap-4 text-white/60 text-xs">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
