import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/services/opportunityService';
import { MapPin, Briefcase, Calendar, DollarSign, ExternalLink, Search } from 'lucide-react';

export default function Opportunities() {
  const { loadOpportunities, opportunities, getActiveOpportunities, getUpcomingOpportunities } = useOpportunities();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Job' | 'Internship' | 'Fellowship'>('All');
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  useEffect(() => {
    let filtered = opportunities;

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(opp => opp.type === selectedType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(search) ||
        opp.company.toLowerCase().includes(search) ||
        opp.description?.toLowerCase().includes(search) ||
        opp.location?.toLowerCase().includes(search)
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, searchTerm, selectedType]);

  const activeOpps = filteredOpportunities.filter(opp => opp.status === 'Active');
  const upcomingOpps = filteredOpportunities.filter(opp => opp.status === 'Upcoming');

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const typeColor = {
      'Job': 'bg-blue-100 text-blue-800',
      'Internship': 'bg-green-100 text-green-800',
      'Fellowship': 'bg-purple-100 text-purple-800'
    };

    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <CardContent className="pt-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">{opportunity.title}</h3>
              <p className="text-sm text-slate-600 font-semibold">{opportunity.company}</p>
            </div>
            <Badge className={typeColor[opportunity.type as keyof typeof typeColor]}>
              {opportunity.type}
            </Badge>
          </div>

          {opportunity.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{opportunity.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            {opportunity.ctc && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>{opportunity.ctc}</span>
              </div>
            )}
            {opportunity.positions && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>{opportunity.positions} positions</span>
              </div>
            )}
            {opportunity.location && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{opportunity.location}</span>
              </div>
            )}
            {opportunity.deadline && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>{new Date(opportunity.deadline).toLocaleDateString('en-IN')}</span>
              </div>
            )}
          </div>

          {opportunity.skills && opportunity.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Skills Required:</p>
              <div className="flex flex-wrap gap-1">
                {opportunity.skills.slice(0, 3).map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {opportunity.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{opportunity.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto flex gap-2 pt-4 border-t">
            {opportunity.applyLink ? (
              <>
                <a href={opportunity.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold">
                    Apply Now <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </a>
                <Link to={`/opportunity/${opportunity.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" className="w-full">
                    Details
                  </Button>
                </Link>
              </>
            ) : (
              <Link to={`/opportunity/${opportunity.id}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold">
                  View & Apply
                </Button>
              </Link>
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Career Opportunities</h1>
          <p className="text-slate-600 text-lg">Explore job openings, internships, and fellowships from top companies</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by job title, company, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Filter by Type:</p>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Job', 'Internship', 'Fellowship'].map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? 'default' : 'outline'}
                      onClick={() => setSelectedType(type as 'All' | 'Job' | 'Internship' | 'Fellowship')}
                      className={selectedType === type ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : ''}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeOpps.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingOpps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOpps.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-center">
                    {searchTerm ? 'No opportunities match your search criteria' : 'No active opportunities at the moment'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingOpps.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-center">
                    {searchTerm ? 'No upcoming opportunities match your search criteria' : 'No upcoming opportunities at the moment'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        {filteredOpportunities.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{filteredOpportunities.length}</div>
                <p className="text-sm text-slate-600 mt-2">Total Opportunities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">{new Set(filteredOpportunities.map(o => o.company)).size}</div>
                <p className="text-sm text-slate-600 mt-2">Companies</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {filteredOpportunities.reduce((sum, o) => sum + (o.positions || 0), 0)}
                </div>
                <p className="text-sm text-slate-600 mt-2">Total Positions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-orange-600">{activeOpps.length}</div>
                <p className="text-sm text-slate-600 mt-2">Actively Hiring</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
