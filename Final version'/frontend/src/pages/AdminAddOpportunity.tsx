import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/services/opportunityService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminAddOpportunity() {
  const navigate = useNavigate();
  const { addOpportunity, loading, error } = useOpportunities();
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Job' as 'Job' | 'Internship' | 'Fellowship',
    ctc: '',
    positions: '',
    jobProfile: '',
    description: '',
    eligibility: '',
    applyLink: '',
    deadline: '',
    location: '',
    skills: '',
    tags: '',
    contactEmail: '',
    contactPhone: '',
    status: 'Active' as 'Active' | 'Closed' | 'Upcoming'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const opportunityData: Omit<Opportunity, 'id' | 'postedDate'> = {
      title: formData.title,
      company: formData.company,
      type: formData.type,
      ctc: formData.ctc || '-',
      positions: parseInt(formData.positions) || 0,
      jobProfile: formData.jobProfile,
      description: formData.description,
      eligibility: formData.eligibility,
      applyLink: formData.applyLink,
      deadline: formData.deadline,
      location: formData.location,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      status: formData.status as 'Active' | 'Closed' | 'Upcoming'
    };

    const result = addOpportunity(opportunityData);
    
    if (result.success) {
      setSuccessMessage(`Opportunity "${formData.title}" added successfully!`);
      setFormData({
        title: '',
        company: '',
        type: 'Job',
        ctc: '',
        positions: '',
        jobProfile: '',
        description: '',
        eligibility: '',
        applyLink: '',
        deadline: '',
        location: '',
        skills: '',
        tags: '',
        contactEmail: '',
        contactPhone: '',
        status: 'Active'
      });

      setTimeout(() => {
        navigate('/admin/dashboard?tab=opportunities');
      }, 2000);
    }
  };

  const getTypeLabel = () => {
    switch (formData.type) {
      case 'Job': return 'Annual CTC';
      case 'Internship': return 'Monthly Stipend';
      case 'Fellowship': return 'Monthly Fellowship';
      default: return 'CTC/Stipend';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Add Opportunity</h1>
          <p className="text-slate-600">Create a new job opportunity, internship, or fellowship</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Job title, company, and opportunity type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-slate-700 font-semibold">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-slate-700 font-semibold">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-slate-700 font-semibold">Opportunity Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger id="type" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Job">Job</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Fellowship">Fellowship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-slate-700 font-semibold">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunity Details */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
              <CardDescription>Compensation, positions, and key information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ctc" className="text-slate-700 font-semibold">{getTypeLabel()}</Label>
                  <Input
                    id="ctc"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleInputChange}
                    placeholder="e.g., 12 LPA"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="positions" className="text-slate-700 font-semibold">Number of Positions</Label>
                  <Input
                    id="positions"
                    name="positions"
                    type="number"
                    value={formData.positions}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobProfile" className="text-slate-700 font-semibold">Job Profile/Role</Label>
                  <Input
                    id="jobProfile"
                    name="jobProfile"
                    value={formData.jobProfile}
                    onChange={handleInputChange}
                    placeholder="e.g., Full Stack Developer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-slate-700 font-semibold">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Bangalore, India"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deadline" className="text-slate-700 font-semibold">Application Deadline *</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Description & Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Description & Requirements</CardTitle>
              <CardDescription>Job description, eligibility criteria, and required skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-slate-700 font-semibold">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the job role, responsibilities, and what we're looking for..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="eligibility" className="text-slate-700 font-semibold">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech in Computer Science, CGPA >= 7.0, No backlog"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="skills" className="text-slate-700 font-semibold">Required Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">Separate skills with commas</p>
              </div>
            </CardContent>
          </Card>

          {/* Application & Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Application & Contact</CardTitle>
              <CardDescription>How candidates can apply and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="applyLink" className="text-slate-700 font-semibold">Apply Link/URL</Label>
                <Input
                  id="applyLink"
                  name="applyLink"
                  type="url"
                  value={formData.applyLink}
                  onChange={handleInputChange}
                  placeholder="e.g., https://careers.company.com/job/123"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail" className="text-slate-700 font-semibold">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="e.g., recruitment@company.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-slate-700 font-semibold">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="e.g., +91-9876543210"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags" className="text-slate-700 font-semibold">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., Fresher-Friendly, Remote, Visa-Sponsorship (comma-separated)"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              {loading ? 'Creating...' : 'Create Opportunity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
