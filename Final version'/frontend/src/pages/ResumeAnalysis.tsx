import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Opportunity } from '@/services/opportunityService';

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const { analyzeResume, analyzing, error, result, suggestions, loadingSuggestions } = useResumeAnalysis();
  const { opportunities, loadOpportunities } = useOpportunities();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [matchedOpportunities, setMatchedOpportunities] = useState<(Opportunity & { eligibilityScore: number })[]>([]);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Find matching opportunities
  useEffect(() => {
    if (result && opportunities.length > 0) {
      const matched = opportunities
        .map(opp => {
          // Simple matching: check if user has most of the required skills
          const requiredSkills = (opp.skills || []).slice(0, 5);
          const matchedSkills = result.matchedSkills.filter(skill =>
            requiredSkills.some(reqSkill =>
              skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
              reqSkill.toLowerCase().includes(skill.toLowerCase())
            )
          );

          const skillScore = requiredSkills.length > 0
            ? (matchedSkills.length / requiredSkills.length) * 100
            : 100;

          // Check CGPA eligibility if required
          let cgpaMatch = true;
          if (result.userCGPA) {
            // Assume most opportunities require minimum 7.0 CGPA
            cgpaMatch = result.userCGPA >= 7.0;
          }

          const eligibilityScore = cgpaMatch ? Math.round(skillScore * 0.9) : Math.round(skillScore * 0.6);

          return { ...opp, eligibilityScore };
        })
        .filter(opp => opp.eligibilityScore >= 50)
        .sort((a, b) => b.eligibilityScore - a.eligibilityScore)
        .slice(0, 6);

      setMatchedOpportunities(matched);
    }
  }, [result, opportunities]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select a resume file');
      return;
    }

    // Common job required skills for analysis
    const requiredSkills = [
      'java', 'python', 'javascript', 'react', 'nodejs',
      'sql', 'html', 'css', 'git', 'rest api'
    ];

    const response = await analyzeResume(selectedFile, requiredSkills, 7.0);

    if (response.success) {
      setAnalysisPerformed(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-12 px-4">
          <div className="container mx-auto text-center">
            <Award className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Resume Analysis & Opportunity Matcher
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Upload your resume, get instant analysis, and discover opportunities that match your profile
            </p>
          </div>
        </section>

        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Upload Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Your Resume</CardTitle>
                    <CardDescription>
                      Support PDF and TXT formats (max 5MB)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? 'border-primary bg-primary/10'
                          : 'border-muted-foreground/30 bg-muted/5'
                      }`}
                    >
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="font-semibold text-foreground mb-2">
                        Drag and drop your resume here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or
                      </p>
                      <input
                        ref={(input) => {
                          if (input) {
                            (window as any).fileInput = input;
                          }
                        }}
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={analyzing}
                        id="resume-file-input"
                      />
                      <Button 
                        variant="outline" 
                        disabled={analyzing}
                        onClick={() => document.getElementById('resume-file-input')?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>

                    {selectedFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-800 font-medium">
                          {selectedFile.name} selected
                        </span>
                      </div>
                    )}

                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-800">{error}</span>
                      </div>
                    )}

                    <Button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || analyzing}
                      className="w-full mt-4 bg-gradient-accent hover:opacity-90 text-white"
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                    </Button>
                  </CardContent>
                </Card>

                {/* How it works */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How It Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Upload Resume</p>
                        <p className="text-sm text-muted-foreground">
                          Upload your resume in PDF or TXT format
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-foreground">AI Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI extracts skills and analyzes your profile
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Get Matched</p>
                        <p className="text-sm text-muted-foreground">
                          Discover opportunities that fit your profile
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {analysisPerformed && result ? (
                  <>
                    {/* Overall Score */}
                    <Card className={`border ${getScoreBgColor(result.eligibilityScore)}`}>
                      <CardHeader>
                        <CardTitle>Overall Assessment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className={`text-5xl font-bold ${getScoreColor(result.eligibilityScore)} mb-2`}>
                            {result.eligibilityScore}%
                          </div>
                          <p className="text-foreground font-medium">{result.feedback}</p>
                        </div>

                        <Progress value={result.eligibilityScore} className="h-3" />

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {result.matchedSkills.length}
                            </div>
                            <p className="text-sm text-muted-foreground">Skills Matched</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent">
                              {result.missingSkills.length}
                            </div>
                            <p className="text-sm text-muted-foreground">Skills To Learn</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Skills Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.matchedSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Matched Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.matchedSkills.map((skill, idx) => (
                                <Badge key={idx} className="bg-green-100 text-green-800 hover:bg-green-200">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.missingSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Skills To Develop
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.missingSkills.slice(0, 5).map((skill, idx) => (
                                <Badge key={idx} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.userCGPA && (
                          <div className="pt-3 border-t">
                            <p className="text-sm font-semibold text-foreground mb-2">
                              Academic Score
                            </p>
                            <p className="text-lg font-bold text-primary">
                              {result.userCGPA} / 10 CGPA
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Upload your resume to see analysis and matched opportunities
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {analysisPerformed && suggestions.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  <Lightbulb className="w-6 h-6 inline-block mr-2 text-accent" />
                  Personalized Improvement Suggestions
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {suggestions.map((suggestion, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{suggestion.area}</CardTitle>
                          <Badge
                            className={
                              suggestion.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : suggestion.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {suggestion.suggestion}
                        </p>
                        {suggestion.timeToLearn && (
                          <div className="pt-2 border-t text-xs text-foreground font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Time required: {suggestion.timeToLearn}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Opportunities */}
            {analysisPerformed && matchedOpportunities.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Opportunities For You ({matchedOpportunities.length})
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedOpportunities.map((opp) => (
                    <Card key={opp.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-foreground">{opp.title}</CardTitle>
                            <CardDescription className="text-base">{opp.company}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(opp.eligibilityScore)}`}>
                              {opp.eligibilityScore}%
                            </div>
                            <p className="text-xs text-muted-foreground">Match</p>
                          </div>
                        </div>
                        <Progress value={opp.eligibilityScore} className="h-2" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {opp.location && (
                          <p className="text-sm text-muted-foreground">📍 {opp.location}</p>
                        )}
                        {opp.ctc && (
                          <p className="text-sm font-semibold text-accent">💰 {opp.ctc}</p>
                        )}
                        {opp.deadline && (
                          <p className="text-sm text-muted-foreground">
                            ⏱️ Deadline: {new Date(opp.deadline).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </CardContent>
                      <div className="px-6 pb-4 border-t pt-4">
                        <Button
                          onClick={() => navigate(`/opportunity/${opp.id}`)}
                          className="w-full bg-gradient-accent hover:opacity-90 text-white"
                          size="sm"
                        >
                          View & Apply
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {analysisPerformed && matchedOpportunities.length === 0 && (
              <div className="mt-12 text-center py-12 bg-secondary/30 rounded-lg border border-border">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No exact matches found, but don't worry! Follow the improvement suggestions above to increase your eligibility.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
