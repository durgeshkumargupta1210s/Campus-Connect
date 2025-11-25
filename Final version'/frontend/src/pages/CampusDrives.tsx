import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useOpportunities } from '@/hooks/useOpportunities';
import { CampusDrive } from '@/services/opportunityService';
import { MapPin, Calendar, Users, DollarSign, ExternalLink, Search, Clock } from 'lucide-react';

export default function CampusDrives() {
  const { loadCampusDrives, campusDrives } = useOpportunities();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrives, setFilteredDrives] = useState<CampusDrive[]>([]);

  useEffect(() => {
    loadCampusDrives();
  }, [loadCampusDrives]);

  useEffect(() => {
    let filtered = campusDrives;

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(drive =>
        drive.company.toLowerCase().includes(search) ||
        drive.description?.toLowerCase().includes(search) ||
        drive.venue?.toLowerCase().includes(search) ||
        drive.roles?.some(role => role.toLowerCase().includes(search))
      );
    }

    setFilteredDrives(filtered);
  }, [campusDrives, searchTerm]);

  const upcomingDrives = filteredDrives.filter(d => d.status === 'Upcoming');
  const ongoingDrives = filteredDrives.filter(d => d.status === 'Ongoing');
  const completedDrives = filteredDrives.filter(d => d.status === 'Completed');

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

  const CampusDriveCard = ({ drive }: { drive: CampusDrive }) => {
    const isRegistrationOpen = new Date(drive.registrationDeadline) > new Date();
    const daysLeft = Math.ceil((new Date(drive.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <Card className="hover:shadow-lg transition-shadow overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{drive.company}</h3>
              <p className="text-sm text-slate-600 mt-1">Campus Recruitment Drive</p>
            </div>
            <Badge className={getStatusColor(drive.status)}>
              {drive.status}
            </Badge>
          </div>

          {drive.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{drive.description}</p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Drive: {new Date(drive.driveDate).toLocaleDateString('en-IN')}</span>
            </div>
            
            {isRegistrationOpen && daysLeft > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-700 font-semibold bg-orange-50 px-2 py-1 rounded">
                <Clock className="w-4 h-4" />
                <span>Register in {daysLeft} days</span>
              </div>
            )}
            
            {drive.venue && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{drive.venue}</span>
              </div>
            )}

            {drive.ctc && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>CTC: {drive.ctc}</span>
              </div>
            )}

            {drive.positions && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Users className="w-4 h-4 text-purple-600" />
                <span>{drive.positions} positions</span>
              </div>
            )}
          </div>

          {drive.roles && drive.roles.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Roles:</p>
              <div className="flex flex-wrap gap-1">
                {drive.roles.map((role, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Link to={`/campus-drive/${drive.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            {drive.registrationLink && isRegistrationOpen && (
              <a href={drive.registrationLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Register <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Campus Recruitment Drives</h1>
          <p className="text-slate-600 text-lg">Connect with top companies and kickstart your career journey</p>
        </div>

        {/* Search */}
        <Card className="mb-8 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by company name, roles, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Campus Drives Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingDrives.length})
            </TabsTrigger>
            <TabsTrigger value="ongoing">
              Ongoing ({ongoingDrives.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedDrives.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingDrives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingDrives.map((drive) => (
                  <CampusDriveCard key={drive.id} drive={drive} />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-center">
                    {searchTerm ? 'No upcoming drives match your search criteria' : 'No upcoming drives at the moment'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-4">
            {ongoingDrives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingDrives.map((drive) => (
                  <CampusDriveCard key={drive.id} drive={drive} />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-center">
                    {searchTerm ? 'No ongoing drives match your search criteria' : 'No ongoing drives at the moment'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedDrives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedDrives.map((drive) => (
                  <CampusDriveCard key={drive.id} drive={drive} />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-center">
                    {searchTerm ? 'No completed drives match your search criteria' : 'No completed drives to display'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        {filteredDrives.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{filteredDrives.length}</div>
                <p className="text-sm text-slate-600 mt-2">Total Drives</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{upcomingDrives.length}</div>
                <p className="text-sm text-slate-600 mt-2">Upcoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {filteredDrives.reduce((sum, d) => sum + (d.positions || 0), 0)}
                </div>
                <p className="text-sm text-slate-600 mt-2">Total Positions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-orange-600">{new Set(filteredDrives.map(d => d.company)).size}</div>
                <p className="text-sm text-slate-600 mt-2">Companies</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
