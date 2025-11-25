import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useClubs } from "@/hooks/useClubs";
import { Club, TeamMember } from "@/services/clubService";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";

const clubColors = [
  "bg-gradient-to-br from-primary to-primary/70",
  "bg-gradient-to-br from-accent to-accent/70",
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-cyan-500",
  "bg-gradient-to-br from-orange-500 to-red-500",
  "bg-gradient-to-br from-green-500 to-emerald-500",
];

export default function AdminAddClub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClubById, addClub, updateClub, loadClubs, clubs } = useClubs();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Club>({
    id: "",
    name: "",
    icon: "Code2",
    members: 0,
    description: "",
    tags: [],
    color: clubColors[0],
    about: "",
    establishedYear: new Date().getFullYear(),
    president: { id: "1", name: "", role: "President", email: "", phone: "", image: "", bio: "" },
    vicePresident: { id: "2", name: "", role: "Vice President", email: "", phone: "", image: "", bio: "" },
    teamMembers: [],
    gallery: [],
    achievements: [],
    events: [],
    contactEmail: "",
    contactPhone: "",
    social: { instagram: "", linkedin: "", discord: "" },
  });

  const [newTag, setNewTag] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    id: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    image: "",
    bio: "",
  });

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  useEffect(() => {
    if (id && clubs.length > 0) {
      const club = getClubById(id);
      if (club) {
        setFormData(club);
      }
    } else if (!id) {
      setFormData((prev) => ({
        ...prev,
        id: `club-${Date.now()}`,
      }));
    }
  }, [id, clubs, getClubById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "members" || name === "establishedYear" ? parseInt(value) : value,
    }));
  };

  const handlePresidentChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      president: { ...prev.president, [field]: value },
    }));
  };

  const handleVicePresidentChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      vicePresident: { ...prev.vicePresident, [field]: value },
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social: { ...prev.social, [platform]: value },
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const addEvent = () => {
    if (newEvent.trim()) {
      setFormData((prev) => ({
        ...prev,
        events: [...prev.events, newEvent.trim()],
      }));
      setNewEvent("");
    }
  };

  const removeEvent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const addTeamMember = () => {
    if (newTeamMember.name.trim() && newTeamMember.role.trim()) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [
          ...prev.teamMembers,
          { ...newTeamMember, id: `member-${Date.now()}` },
        ],
      }));
      setNewTeamMember({
        id: "",
        name: "",
        role: "",
        email: "",
        phone: "",
        image: "",
        bio: "",
      });
    }
  };

  const removeTeamMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((member) => member.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        updateClub(id, formData);
      } else {
        addClub(formData);
      }
      navigate("/admin?tab=clubs");
    } catch (error) {
      console.error("Error saving club:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/admin?tab=clubs")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clubs
        </Button>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Club Information</CardTitle>
              <CardDescription>Basic details about the club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Club Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter club name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Members Count *</label>
                  <Input
                    name="members"
                    type="number"
                    value={formData.members}
                    onChange={handleInputChange}
                    placeholder="250"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Established Year *</label>
                  <Input
                    name="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color Theme *</label>
                  <select
                    title="Select color theme"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-full border rounded-lg p-2 bg-background"
                  >
                    {clubColors.map((color, idx) => (
                      <option key={idx} value={color}>
                        Color {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description of the club"
                  className="w-full border rounded-lg p-3 h-24 bg-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">About (Detailed) *</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Detailed information about the club"
                  className="w-full border rounded-lg p-3 h-32 bg-background"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                />
                <Button type="button" onClick={addTag} variant="outline" title="Add tag">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} className="bg-primary text-primary-foreground flex items-center gap-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-300"
                      title="Remove tag"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leadership */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Leadership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* President */}
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary">President</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="President Name"
                    value={formData.president.name}
                    onChange={(e) => handlePresidentChange("name", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.president.email}
                    onChange={(e) => handlePresidentChange("email", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={formData.president.phone}
                    onChange={(e) => handlePresidentChange("phone", e.target.value)}
                  />
                  <Input
                    placeholder="Bio"
                    value={formData.president.bio}
                    onChange={(e) => handlePresidentChange("bio", e.target.value)}
                  />
                </div>
              </div>

              {/* Vice President */}
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-accent/20">
                <h3 className="font-semibold text-accent">Vice President</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Vice President Name"
                    value={formData.vicePresident.name}
                    onChange={(e) => handleVicePresidentChange("name", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.vicePresident.email}
                    onChange={(e) => handleVicePresidentChange("email", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={formData.vicePresident.phone}
                    onChange={(e) => handleVicePresidentChange("phone", e.target.value)}
                  />
                  <Input
                    placeholder="Bio"
                    value={formData.vicePresident.bio}
                    onChange={(e) => handleVicePresidentChange("bio", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Team Members */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Core Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold">Add Team Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Name"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Role"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember((prev) => ({ ...prev, role: e.target.value }))}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone"
                    value={newTeamMember.phone}
                    onChange={(e) => setNewTeamMember((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <Button type="button" onClick={addTeamMember} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {formData.teamMembers.length > 0 && (
                <div className="space-y-2">
                  {formData.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all"
                        title="Remove team member"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Achievements & Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                  placeholder="Add achievement"
                />
                <Button type="button" onClick={addAchievement} variant="outline" title="Add achievement">
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border"
                  >
                    <span>{achievement}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(idx)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all"
                      title="Remove achievement"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Regular Events & Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEvent())}
                  placeholder="Add event/activity"
                />
                <Button type="button" onClick={addEvent} variant="outline" title="Add event">
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.events.map((event, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border"
                  >
                    <span>{event}</span>
                    <button
                      type="button"
                      onClick={() => removeEvent(idx)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all"
                      title="Remove event"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="club@campus.edu"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="font-semibold">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Instagram URL"
                    value={formData.social.instagram}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={formData.social.linkedin}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  />
                  <Input
                    placeholder="Discord URL"
                    value={formData.social.discord}
                    onChange={(e) => handleSocialChange("discord", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white flex-1"
            >
              {isLoading ? "Saving..." : id ? "Update Club" : "Create Club"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin?tab=clubs")}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
