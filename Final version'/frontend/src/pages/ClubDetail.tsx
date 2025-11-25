import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClubs } from '@/hooks/useClubs';
import { Club } from '@/services/clubService';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Calendar,
  Instagram,
  Linkedin,
  MessageCircle,
  Trophy,
  Image as ImageIcon,
  User,
} from 'lucide-react';

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClubById, loadClubs, clubs } = useClubs();
  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  useEffect(() => {
    if (clubs.length > 0 && id) {
      const foundClub = getClubById(id);
      setClub(foundClub || null);
    }
  }, [id, clubs, getClubById]);

  if (!club) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 mb-4">Club not found</p>
              <Button onClick={() => navigate('/community')}>Back to Communities</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Back Button */}
        <div className="bg-slate-50 border-b border-slate-200 sticky top-16 z-40">
          <div className="container mx-auto px-4 py-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/community')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Communities
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <section className={`${club.color} text-white py-16`}>
          <div className="container mx-auto px-4">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-5xl font-bold mb-3">{club.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    <Users className="w-4 h-4 mr-2 inline" />
                    {club.members}+ Members
                  </Badge>
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2 inline" />
                    Est. {club.establishedYear}
                  </Badge>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="max-w-3xl">
              <p className="text-lg text-white/90 mb-6">{club.about}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {club.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-white/30 text-white text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Leadership */}
                <Card className="bg-white dark:bg-slate-900 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Leadership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* President */}
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-slate-600 font-semibold mb-2">PRESIDENT</p>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{club.president.name}</h3>
                      {club.president.bio && (
                        <p className="text-sm text-slate-600 mb-3">{club.president.bio}</p>
                      )}
                      <div className="space-y-2">
                        {club.president.email && (
                          <div className="flex items-center gap-3 text-sm text-slate-700">
                            <Mail className="w-4 h-4 text-primary" />
                            <a href={`mailto:${club.president.email}`} className="hover:text-primary">
                              {club.president.email}
                            </a>
                          </div>
                        )}
                        {club.president.phone && (
                          <div className="flex items-center gap-3 text-sm text-slate-700">
                            <Phone className="w-4 h-4 text-primary" />
                            <a href={`tel:${club.president.phone}`}>{club.president.phone}</a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vice President */}
                    {club.vicePresident && (
                      <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                        <p className="text-sm text-slate-600 font-semibold mb-2">VICE PRESIDENT</p>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{club.vicePresident.name}</h3>
                        {club.vicePresident.bio && (
                          <p className="text-sm text-slate-600 mb-3">{club.vicePresident.bio}</p>
                        )}
                        {club.vicePresident.email && (
                          <div className="flex items-center gap-3 text-sm text-slate-700">
                            <Mail className="w-4 h-4 text-accent" />
                            <a href={`mailto:${club.vicePresident.email}`} className="hover:text-accent">
                              {club.vicePresident.email}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Team Members */}
                    {club.teamMembers.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-4">Core Team Members</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {club.teamMembers.map((member, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="font-semibold text-slate-900">{member.name}</p>
                              <p className="text-sm text-slate-600">{member.role}</p>
                              {member.email && (
                                <p className="text-xs text-primary mt-1">{member.email}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-white dark:bg-slate-900 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      Achievements & Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {club.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-yellow-600 font-bold mt-1">★</span>
                          <span className="text-slate-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Events */}
                <Card className="bg-white dark:bg-slate-900 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Regular Events & Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {club.events.map((event, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-blue-600 font-bold mt-1">✓</span>
                          <span className="text-slate-700">{event}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Gallery */}
                {club.gallery.length > 0 && (
                  <Card className="bg-white dark:bg-slate-900 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-600" />
                        Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {club.gallery.map((image, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden bg-slate-200 hover:scale-105 transition-transform cursor-pointer"
                          >
                            <img
                              src={image}
                              alt={`${club.name} gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Get In Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <a
                        href={`mailto:${club.contactEmail}`}
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {club.contactEmail}
                      </a>
                    </div>
                    {club.contactPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <a href={`tel:${club.contactPhone}`} className="text-sm hover:text-primary">
                          {club.contactPhone}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Social Links */}
                {club.social && Object.keys(club.social).length > 0 && (
                  <Card className="bg-white dark:bg-slate-900 border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Follow Us</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {club.social.instagram && (
                        <a
                          href={club.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all"
                        >
                          <Instagram className="w-5 h-5 text-pink-600" />
                          <span className="text-sm font-medium text-slate-700">Instagram</span>
                        </a>
                      )}
                      {club.social.linkedin && (
                        <a
                          href={club.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all"
                        >
                          <Linkedin className="w-5 h-5 text-blue-700" />
                          <span className="text-sm font-medium text-slate-700">LinkedIn</span>
                        </a>
                      )}
                      {club.social.discord && (
                        <a
                          href={club.social.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all"
                        >
                          <MessageCircle className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm font-medium text-slate-700">Discord</span>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Join CTA */}
                <Button 
                  onClick={() => navigate(`/club/${id}/join`)}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-6 text-lg font-semibold"
                >
                  Join {club.name}
                </Button>

                {/* Stats Card */}
                <Card className="bg-white dark:bg-slate-900 border-slate-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="text-center pb-4 border-b border-slate-200">
                        <p className="text-3xl font-bold text-primary">{club.members}+</p>
                        <p className="text-sm text-slate-600">Active Members</p>
                      </div>
                      <div className="text-center pb-4 border-b border-slate-200">
                        <p className="text-3xl font-bold text-accent">{club.events.length}</p>
                        <p className="text-sm text-slate-600">Annual Events</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{club.achievements.length}</p>
                        <p className="text-sm text-slate-600">Major Achievements</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
