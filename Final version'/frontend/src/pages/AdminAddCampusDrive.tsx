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
import { CampusDrive } from '@/services/opportunityService';
import { AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';

export default function AdminAddCampusDrive() {
  const navigate = useNavigate();
  const { addCampusDrive, loading, error } = useOpportunities();
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    driveDate: '',
    registrationDeadline: '',
    expectedTime: '',
    venue: '',
    description: '',
    positions: '',
    ctc: '',
    eligibility: '',
    roles: [] as string[],
    registrationLink: '',
    status: 'Upcoming' as 'Upcoming' | 'Ongoing' | 'Completed',
    recruitmentProcess: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [newRole, setNewRole] = useState('');

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

  const addRole = () => {
    if (newRole.trim() && !formData.roles.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, newRole.trim()]
      }));
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r !== role)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.driveDate || !formData.registrationDeadline) {
      alert('Please fill in all required fields');
      return;
    }

    const driveData: Omit<CampusDrive, 'id' | 'createdDate'> = {
      company: formData.company,
      driveDate: formData.driveDate,
      registrationDeadline: formData.registrationDeadline,
      expectedTime: formData.expectedTime,
      venue: formData.venue,
      description: formData.description,
      positions: parseInt(formData.positions) || 0,
      ctc: formData.ctc || '-',
      eligibility: formData.eligibility,
      roles: formData.roles.length > 0 ? formData.roles : ['General'],
      registrationLink: formData.registrationLink,
      status: formData.status as 'Upcoming' | 'Ongoing' | 'Completed',
      recruitmentProcess: formData.recruitmentProcess,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone
    };

    const result = addCampusDrive(driveData);
    
    if (result.success) {
      setSuccessMessage(`Campus drive for "${formData.company}" created successfully!`);
      setFormData({
        company: '',
        driveDate: '',
        registrationDeadline: '',
        expectedTime: '',
        venue: '',
        description: '',
        positions: '',
        ctc: '',
        eligibility: '',
        roles: [],
        registrationLink: '',
        status: 'Upcoming',
        recruitmentProcess: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      });

      setTimeout(() => {
        navigate('/admin/dashboard?tab=campus-drives');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Add Campus Drive</h1>
          <p className="text-slate-600">Create a new campus recruitment drive for students</p>
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
              <CardDescription>Company details and drive dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company" className="text-slate-700 font-semibold">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Microsoft"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-slate-700 font-semibold">Drive Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driveDate" className="text-slate-700 font-semibold">Drive Date *</Label>
                  <Input
                    id="driveDate"
                    name="driveDate"
                    type="date"
                    value={formData.driveDate}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDeadline" className="text-slate-700 font-semibold">Registration Deadline *</Label>
                  <Input
                    id="registrationDeadline"
                    name="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedTime" className="text-slate-700 font-semibold">Expected Time Duration</Label>
                  <Input
                    id="expectedTime"
                    name="expectedTime"
                    value={formData.expectedTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 2-3 hours"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="venue" className="text-slate-700 font-semibold">Venue/Location</Label>
                  <Input
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    placeholder="e.g., Auditorium, Room 101"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drive Details */}
          <Card>
            <CardHeader>
              <CardTitle>Drive Details</CardTitle>
              <CardDescription>Positions, compensation, and eligibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="positions" className="text-slate-700 font-semibold">Number of Positions</Label>
                  <Input
                    id="positions"
                    name="positions"
                    type="number"
                    value={formData.positions}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ctc" className="text-slate-700 font-semibold">CTC / Annual Package</Label>
                  <Input
                    id="ctc"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleInputChange}
                    placeholder="e.g., 15 LPA"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-700 font-semibold">Drive Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the drive, company background, and what makes this an exciting opportunity..."
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
                  placeholder="e.g., B.Tech/B.E in CSE/IT/ECE, CGPA >= 7.0, No active backlog"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Roles & Process */}
          <Card>
            <CardHeader>
              <CardTitle>Roles & Recruitment Process</CardTitle>
              <CardDescription>Job roles and interview/selection process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-700 font-semibold">Roles Available</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                  />
                  <Button
                    type="button"
                    onClick={addRole}
                    size="sm"
                    variant="outline"
                    title="Add role"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.roles.map((role) => (
                    <div
                      key={role}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      <span className="text-sm font-medium">{role}</span>
                      <button
                        type="button"
                        onClick={() => removeRole(role)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                        title={`Remove ${role}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="recruitmentProcess" className="text-slate-700 font-semibold">Recruitment Process</Label>
                <Textarea
                  id="recruitmentProcess"
                  name="recruitmentProcess"
                  value={formData.recruitmentProcess}
                  onChange={handleInputChange}
                  placeholder="e.g., Written Test (60 mins) -> Technical Interview (45 mins) -> HR Round (30 mins)"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact & Registration */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Registration</CardTitle>
              <CardDescription>Company contact information and registration link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson" className="text-slate-700 font-semibold">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe - HR Manager"
                    className="mt-1"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="registrationLink" className="text-slate-700 font-semibold">Registration Link</Label>
                  <Input
                    id="registrationLink"
                    name="registrationLink"
                    type="url"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                    placeholder="e.g., https://careers.company.com/register"
                    className="mt-1"
                  />
                </div>
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? 'Creating...' : 'Create Campus Drive'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
