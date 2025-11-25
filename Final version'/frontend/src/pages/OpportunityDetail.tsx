import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { Opportunity } from '@/services/opportunityService';
import { 
  MapPin, Briefcase, Calendar, DollarSign, ExternalLink, ArrowLeft,
  Mail, Phone, Users, CheckCircle2, AlertCircle, Upload, FileText, CheckCircle, Zap
} from 'lucide-react';

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opportunities, loadOpportunities } = useOpportunities();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  useEffect(() => {
    if (id && opportunities.length > 0) {
      const found = opportunities.find(o => o.id === id);
      setOpportunity(found || null);
    }
  }, [id, opportunities]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Opportunity not found</p>
            <Button onClick={() => navigate('/opportunities')}>
              Back to Opportunities
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeColor = {
    'Job': 'bg-blue-100 text-blue-800',
    'Internship': 'bg-green-100 text-green-800',
    'Fellowship': 'bg-purple-100 text-purple-800'
  };

  const isDeadlinePassed = new Date(opportunity.deadline) < new Date();
  const daysLeft = Math.ceil((new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/opportunities')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Opportunities
        </Button>

        {/* Header Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{opportunity.title}</h1>
                  <Badge className={typeColor[opportunity.type as keyof typeof typeColor]}>
                    {opportunity.type}
                  </Badge>
                </div>
                <p className="text-xl text-slate-700 font-semibold">{opportunity.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {opportunity.ctc && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-slate-600">CTC/Stipend</p>
                    <p className="font-semibold text-slate-900">{opportunity.ctc}</p>
                  </div>
                </div>
              )}
              {opportunity.positions && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600">Positions</p>
                    <p className="font-semibold text-slate-900">{opportunity.positions}</p>
                  </div>
                </div>
              )}
              {opportunity.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-slate-600">Location</p>
                    <p className="font-semibold text-slate-900">{opportunity.location}</p>
                  </div>
                </div>
              )}
              {opportunity.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-600">Deadline</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(opportunity.deadline).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Alert */}
            {isDeadlinePassed ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Application deadline has passed</AlertDescription>
              </Alert>
            ) : daysLeft <= 3 && daysLeft > 0 ? (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to apply!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Applications are open! {daysLeft} days remaining to apply.
                </AlertDescription>
              </Alert>
            )}

            {/* Apply Now CTA */}
            {!isDeadlinePassed && opportunity.applyLink && (
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Ready to Apply?</h3>
                    <p className="text-blue-100">Click below to submit your application on the company portal</p>
                  </div>
                  <a href={opportunity.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white hover:bg-slate-100 text-blue-600 font-bold px-8 py-6 text-lg whitespace-nowrap">
                      Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {opportunity.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-line">{opportunity.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Eligibility */}
            {opportunity.eligibility && (
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-line">{opportunity.eligibility}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {opportunity.skills && opportunity.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {opportunity.tags && opportunity.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Profile */}
            {opportunity.jobProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Profile/Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{opportunity.jobProfile}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            {!isDeadlinePassed && opportunity.applyLink && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <a href={opportunity.applyLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6 mb-4">
                      Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <p className="text-sm text-slate-600 text-center">
                    You will be redirected to the company's application portal
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Resume Eligibility Check */}
            <ResumeEligibilityCard opportunity={opportunity} />

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunity.contactEmail && (
                  <a href={`mailto:${opportunity.contactEmail}`} className="flex items-center gap-3 text-slate-700 hover:text-blue-600">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="break-all">{opportunity.contactEmail}</span>
                  </a>
                )}
                {opportunity.contactPhone && (
                  <a href={`tel:${opportunity.contactPhone}`} className="flex items-center gap-3 text-slate-700 hover:text-blue-600">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>{opportunity.contactPhone}</span>
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
                  <p className="text-xs font-semibold text-slate-600 uppercase">Type</p>
                  <p className="text-slate-900 font-semibold">{opportunity.type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                  <Badge className={opportunity.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                    {opportunity.status}
                  </Badge>
                </div>
                {opportunity.postedDate && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Posted</p>
                    <p className="text-slate-900">{new Date(opportunity.postedDate).toLocaleDateString('en-IN')}</p>
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

// Resume Eligibility Card Component
const ResumeEligibilityCard = ({ opportunity }: { opportunity: Opportunity }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { analyzeResume, analyzing, error, result, resetAnalysis, suggestions, loadingSuggestions } = useResumeAnalysis();
  const [activeTab, setActiveTab] = useState<'overview' | 'improvements'>('overview');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const requiredSkills = opportunity.skills || [];
    
    // Extract CGPA requirement from eligibility text
    let requiredCGPA: number | undefined;
    if (opportunity.eligibility?.toLowerCase().includes('cgpa')) {
      const cgpaMatch = opportunity.eligibility.match(/cgpa\s*[>=]*\s*(\d+\.?\d*)/i);
      if (cgpaMatch) {
        requiredCGPA = parseFloat(cgpaMatch[1]);
      }
    }

    await analyzeResume(file, requiredSkills, requiredCGPA);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Resume Eligibility Checker
        </CardTitle>
        <CardDescription>Upload your resume to get AI-powered analysis and improvement suggestions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <>
            {!showUpload ? (
              <Button
                onClick={() => setShowUpload(true)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-12 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50"
              >
                <Upload className="w-4 h-4" />
                Upload Your Resume
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileSelect}
                  disabled={analyzing}
                  className="cursor-pointer"
                />
                <p className="text-xs text-slate-500">📄 PDF or TXT file (max 5MB)</p>
                {analyzing && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm text-slate-600">Analyzing your resume with AI...</p>
                  </div>
                )}
                {error && <Alert variant="destructive"><AlertDescription>⚠️ {error}</AlertDescription></Alert>}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Analysis Results
              </button>
              <button
                onClick={() => setActiveTab('improvements')}
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === 'improvements'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Suggestions
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Eligibility Score */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-900">Overall Eligibility Score</p>
                    <span className={`text-3xl font-bold ${result.eligibilityScore >= 80 ? 'text-green-600' : result.eligibilityScore >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                      {result.eligibilityScore}%
                    </span>
                  </div>
                  <div className="eligibility-progress-container">
                    <ProgressBar percentage={result.eligibilityScore} />
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-3 p-3 rounded-lg bg-slate-50 border-l-4 ${result.isEligible ? 'status-eligible' : 'status-ineligible'}`}>
                  {result.isEligible ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-700">You are eligible! 🎉</p>
                        <p className="text-xs text-green-600">Your profile matches the job requirements</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-700">Needs Improvement</p>
                        <p className="text-xs text-red-600">Check the suggestions tab for improvements</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Feedback */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-blue-900">Analysis: </span>
                    {result.feedback}
                  </p>
                </div>

                {/* Skills Match */}
                {(result.matchedSkills.length > 0 || result.missingSkills.length > 0) && (
                  <div className="space-y-3">
                    {result.matchedSkills.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Matched Skills ({result.matchedSkills.length}/{result.matchedSkills.length + result.missingSkills.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSkills.map((skill, idx) => (
                            <Badge key={idx} className="bg-green-200 text-green-900 text-xs font-medium">
                              ✓ {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.missingSkills.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-xs font-bold text-red-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Missing Skills ({result.missingSkills.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-red-700 border-red-300 bg-white">
                              ✕ {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CGPA Info */}
                {result.requiredCGPA && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-2 text-sm">📊 CGPA Requirement</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Required</p>
                        <p className="text-lg font-bold text-slate-900">{result.requiredCGPA}</p>
                      </div>
                      {result.userCGPA && (
                        <>
                          <div className="text-2xl text-slate-400">→</div>
                          <div>
                            <p className="text-xs text-slate-600">Your CGPA</p>
                            <p className={`text-lg font-bold ${result.userCGPA >= result.requiredCGPA ? 'text-green-600' : 'text-red-600'}`}>
                              {result.userCGPA}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button onClick={resetAnalysis} variant="outline" className="w-full">
                  Check Another Resume
                </Button>
              </div>
            )}

            {/* Improvements Tab */}
            {activeTab === 'improvements' && (
              <div className="space-y-4">
                {loadingSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mr-3"></div>
                    <p className="text-slate-600">Generating AI-powered suggestions...</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                      💡 Based on your resume analysis, here are AI-powered improvement suggestions to boost your candidacy:
                    </p>
                    {suggestions.map((suggestion, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(suggestion.priority)} bg-opacity-30`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm">{suggestion.area}</span>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(suggestion.priority)}`}>
                                {suggestion.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{suggestion.suggestion}</p>
                            {suggestion.timeToLearn && (
                              <p className="text-xs text-slate-600 flex items-center gap-1">
                                ⏱️ Estimated time: <span className="font-semibold">{suggestion.timeToLearn}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-slate-900">Perfect Match! 🎯</p>
                    <p className="text-slate-600 text-sm mt-1">Your resume perfectly matches all the requirements.</p>
                  </div>
                )}

                {/* Additional Resources */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-3">📚 Learning Resources</p>
                  <div className="grid grid-cols-2 gap-2">
                    <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition">
                      Udemy Courses
                    </a>
                    <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition">
                      Coursera
                    </a>
                    <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition">
                      LeetCode
                    </a>
                    <a href="https://www.geeksforgeeks.org" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition">
                      GeeksforGeeks
                    </a>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="space-y-2 pt-4">
                  {result.isEligible && (
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                      Apply Now
                    </Button>
                  )}
                  <Button onClick={resetAnalysis} variant="outline" className="w-full">
                    Check Another Resume
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Progress Bar Component
const ProgressBar = ({ percentage }: { percentage: number }) => {
  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    return 'low';
  };

  return (
    <div
      className={`eligibility-progress-bar ${getColorClass(percentage)}`}
      data-width={percentage}
    />
  );
};
