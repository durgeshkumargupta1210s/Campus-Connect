import { useState, useCallback } from 'react';
import { resumeAnalysisService, ResumeAnalysisResult, AIImprovementSuggestion } from '@/services/resumeAnalysisService';

export const useResumeAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<AIImprovementSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const analyzeResume = useCallback(
    async (file: File, requiredSkills: string[], requiredCGPA?: number) => {
      try {
        setError(null);
        setAnalyzing(true);

        // Check file type
        if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
          throw new Error('Please upload a PDF or TXT file');
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }

        // For PDF files, we'd normally need a PDF parser library
        // For now, we'll handle text files and extract text from PDFs as best we can
        const resumeText = await resumeAnalysisService.extractResumeText(file);

        if (!resumeText || resumeText.trim().length === 0) {
          throw new Error('Could not extract text from resume');
        }

        // Analyze the resume
        const analysisResult = resumeAnalysisService.analyzeResume(
          resumeText,
          requiredSkills,
          requiredCGPA
        );

        setResult(analysisResult);

        // Generate AI suggestions
        setLoadingSuggestions(true);
        const aiSuggestions = resumeAnalysisService.generateAISuggestions(
          analysisResult.missingSkills,
          analysisResult.eligibilityScore,
          analysisResult.userCGPA,
          analysisResult.requiredCGPA
        );
        setSuggestions(aiSuggestions);
        setLoadingSuggestions(false);

        return { success: true, result: analysisResult, suggestions: aiSuggestions };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to analyze resume';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setAnalyzing(false);
      }
    },
    []
  );

  const resetAnalysis = useCallback(() => {
    setResult(null);
    setError(null);
    setSuggestions([]);
  }, []);

  return {
    analyzeResume,
    resetAnalysis,
    analyzing,
    error,
    result,
    suggestions,
    loadingSuggestions
  };
};
