import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOpportunities } from '@/hooks/useOpportunities';
import { CampusDrive } from '@/services/opportunityService';
import { 
  MapPin, Calendar, DollarSign, ExternalLink, ArrowLeft,
  Mail, Phone, Users, Clock, CheckCircle2, AlertCircle, Briefcase
} from 'lucide-react';

export default function CampusDriveDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campusDrives, loadCampusDrives } = useOpportunities();
  const [drive, setDrive] = useState<CampusDrive | null>(null);

  useEffect(() => {
    loadCampusDrives();
  }, [loadCampusDrives]);

  useEffect(() => {
    if (id && campusDrives.length > 0) {
      const found = campusDrives.find(d => d.id === id);
      setDrive(found || null);
    }
  }, [id, campusDrives]);

  if (!drive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Campus drive not found</p>
            <Button onClick={() => navigate('/campus-drives')}>
              Back to Campus Drives
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const isRegistrationOpen = new Date(drive.registrationDeadline) > new Date();
  const daysLeft = Math.ceil((new Date(drive.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilDrive = Math.ceil((new Date(drive.driveDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/campus-drives')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campus Drives
        </Button>

        {/* Header Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{drive.company}</h1>
                  <Badge className={getStatusColor(drive.status)}>
                    {drive.status}
                  </Badge>
                </div>
                <p className="text-xl text-slate-700 font-semibold">Campus Recruitment Drive</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {drive.ctc && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-slate-600">CTC</p>
                    <p className="font-semibold text-slate-900">{drive.ctc}</p>
                  </div>
                </div>
              )}
              {drive.positions && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600">Positions</p>
                    <p className="font-semibold text-slate-900">{drive.positions}</p>
                  </div>
                </div>
              )}
              {drive.driveDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-600">Drive Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(drive.driveDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
              {drive.registrationDeadline && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-slate-600">Register By</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(drive.registrationDeadline).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Alert */}
            {!isRegistrationOpen ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Registration deadline has passed</AlertDescription>
              </Alert>
            ) : daysLeft <= 3 ? (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to register!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Registration is open! {daysLeft} days remaining. Drive in {daysUntilDrive} day{daysUntilDrive !== 1 ? 's' : ''}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {drive.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Drive</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-line">{drive.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Roles Available */}
            {drive.roles && drive.roles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Roles Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {drive.roles.map((role, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800 text-sm py-1 px-3">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Eligibility */}
            {drive.eligibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-line">{drive.eligibility}</p>
                </CardContent>
              </Card>
            )}

            {/* Recruitment Process */}
            {drive.recruitmentProcess && (
              <Card>
                <CardHeader>
                  <CardTitle>Recruitment Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-line">{drive.recruitmentProcess}</p>
                </CardContent>
              </Card>
            )}

            {/* Drive Details */}
            <Card>
              <CardHeader>
                <CardTitle>Drive Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {drive.expectedTime && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Expected Duration</p>
                    <p className="text-slate-900 font-semibold">{drive.expectedTime}</p>
                  </div>
                )}
                {drive.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase">Venue</p>
                      <p className="text-slate-900 font-semibold">{drive.venue}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Register Section */}
            {isRegistrationOpen && drive.registrationLink && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <a href={drive.registrationLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6 mb-4">
                      Register Now <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <p className="text-sm text-slate-600 text-center">
                    {daysLeft} day{daysLeft !== 1 ? 's' : ''} to register
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {drive.contactPerson && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Contact Person</p>
                    <p className="text-slate-900 font-semibold">{drive.contactPerson}</p>
                  </div>
                )}
                {drive.contactEmail && (
                  <a href={`mailto:${drive.contactEmail}`} className="flex items-center gap-3 text-slate-700 hover:text-blue-600">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="break-all text-sm">{drive.contactEmail}</span>
                  </a>
                )}
                {drive.contactPhone && (
                  <a href={`tel:${drive.contactPhone}`} className="flex items-center gap-3 text-slate-700 hover:text-blue-600">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{drive.contactPhone}</span>
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                  <Badge className={getStatusColor(drive.status)}>
                    {drive.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Hiring For</p>
                  <p className="text-slate-900 font-semibold">
                    {drive.positions} position{drive.positions !== 1 ? 's' : ''}
                  </p>
                </div>
                {drive.createdDate && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Posted</p>
                    <p className="text-slate-900">{new Date(drive.createdDate).toLocaleDateString('en-IN')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
