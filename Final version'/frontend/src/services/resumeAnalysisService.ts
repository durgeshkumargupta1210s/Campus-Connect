// Resume Analysis Service
// Analyzes user resume against opportunity requirements

export interface ResumeAnalysisResult {
  isEligible: boolean;
  eligibilityScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
  requiredCGPA?: number;
  userCGPA?: number;
  aiSuggestions?: string[];
  improvementAreas?: string[];
}

export interface AIImprovementSuggestion {
  area: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  timeToLearn?: string;
}

export const resumeAnalysisService = {
  // Extract text from resume (simple implementation)
  extractResumeText: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text.toLowerCase());
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Extract skills from resume text
  extractSkillsFromResume: (resumeText: string): string[] => {
    const commonSkills = [
      'java', 'python', 'javascript', 'typescript', 'react', 'node', 'nodejs',
      'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql', 'rest', 'api',
      'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'windows',
      'c++', 'c#', 'php', 'ruby', 'golang', 'rust', 'scala', 'kotlin',
      'machine learning', 'ml', 'ai', 'deep learning', 'tensorflow', 'pytorch',
      'django', 'flask', 'spring', 'hibernate', 'jpa', 'servlet', 'jsp',
      'angular', 'vue', 'nextjs', 'express', 'fastapi', 'graphql',
      'agile', 'scrum', 'jira', 'jenkins', 'ci/cd', 'devops',
      'communication', 'leadership', 'teamwork', 'problem solving',
      'data structures', 'algorithms', 'design patterns', 'oops', 'oop',
      'microservices', 'monolith', 'rest api', 'soap', 'websocket'
    ];

    const foundSkills: string[] = [];
    const seen = new Set<string>();

    commonSkills.forEach(skill => {
      // Check for exact word matches and variations
      const skillRegex = new RegExp(`\\b${skill.replace(/[+]/g, '\\+')}\\b`, 'gi');
      if (skillRegex.test(resumeText) && !seen.has(skill.toLowerCase())) {
        foundSkills.push(skill);
        seen.add(skill.toLowerCase());
      }
    });

    return foundSkills;
  },

  // Extract CGPA from resume
  extractCGPAFromResume: (resumeText: string): number | null => {
    // Look for patterns like "CGPA: 8.5" or "GPA: 3.8" or "8.5/10"
    const cgpaPatterns = [
      /cgpa\s*[:=]?\s*(\d+\.?\d*)/i,
      /gpa\s*[:=]?\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*\/\s*10/i,
      /(?:score|average)\s*[:=]?\s*(\d+\.?\d*)/i
    ];

    for (const pattern of cgpaPatterns) {
      const match = resumeText.match(pattern);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        // Validate CGPA is reasonable (between 0-10)
        if (value > 0 && value <= 10) {
          return value;
        }
      }
    }

    return null;
  },

  // Analyze resume against opportunity requirements
  analyzeResume: (
    resumeText: string,
    requiredSkills: string[],
    requiredCGPA?: number
  ): ResumeAnalysisResult => {
    const resumeSkills = resumeAnalysisService.extractSkillsFromResume(resumeText);
    const userCGPA = resumeAnalysisService.extractCGPAFromResume(resumeText);

    // Find matched and missing skills
    const matchedSkills = requiredSkills.filter(skill =>
      resumeSkills.some(resSkill => 
        resSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(resSkill.toLowerCase())
      )
    );

    const missingSkills = requiredSkills.filter(
      skill => !matchedSkills.includes(skill)
    );

    // Calculate eligibility score
    let scoreBreakdown = 0;

    // Skills matching: 60% of score
    const skillsScore = requiredSkills.length > 0
      ? (matchedSkills.length / requiredSkills.length) * 60
      : 60;
    scoreBreakdown += skillsScore;

    // CGPA matching: 40% of score
    let cgpaScore = 0;
    if (requiredCGPA && userCGPA) {
      if (userCGPA >= requiredCGPA) {
        cgpaScore = 40; // Meets requirement
      } else {
        // Partial score based on how close
        const percentageOfRequired = (userCGPA / requiredCGPA) * 100;
        cgpaScore = (percentageOfRequired / 100) * 40;
      }
    } else if (!requiredCGPA) {
      // No CGPA requirement
      cgpaScore = 40;
    }
    scoreBreakdown += cgpaScore;

    const eligibilityScore = Math.round(scoreBreakdown);

    // Determine if eligible (need at least 60% score)
    const isEligible = eligibilityScore >= 60;

    // Generate feedback
    let feedback = '';
    if (eligibilityScore >= 80) {
      feedback = '🎉 Excellent match! Your profile strongly aligns with this opportunity.';
    } else if (eligibilityScore >= 60) {
      feedback = '✅ Good match! You meet the basic requirements for this opportunity.';
    } else if (eligibilityScore >= 40) {
      feedback = '⚠️ Partial match. You have some relevant skills but may need to develop additional ones.';
    } else {
      feedback = '❌ Limited match. You might want to upskill before applying.';
    }

    if (missingSkills.length > 0) {
      feedback += ` Consider learning: ${missingSkills.slice(0, 2).join(', ')}.`;
    }

    if (requiredCGPA && userCGPA) {
      if (userCGPA < requiredCGPA) {
        feedback += ` Your CGPA (${userCGPA}) is below the requirement (${requiredCGPA}).`;
      }
    }

    return {
      isEligible,
      eligibilityScore,
      matchedSkills,
      missingSkills,
      feedback,
      requiredCGPA,
      userCGPA
    };
  },

  // Generate AI-powered improvement suggestions (uses local logic, can be integrated with Ant API)
  generateAISuggestions: (
    missingSkills: string[],
    eligibilityScore: number,
    userCGPA?: number,
    requiredCGPA?: number
  ): AIImprovementSuggestion[] => {
    const suggestions: AIImprovementSuggestion[] = [];

    // Skill improvement suggestions
    if (missingSkills.length > 0) {
      missingSkills.slice(0, 3).forEach((skill) => {
        const skillTimeMap: { [key: string]: string } = {
          'python': '2-3 weeks',
          'javascript': '2-3 weeks',
          'react': '3-4 weeks',
          'typescript': '2 weeks',
          'nodejs': '2-3 weeks',
          'aws': '3-4 weeks',
          'docker': '2-3 weeks',
          'kubernetes': '4-5 weeks',
          'machine learning': '6-8 weeks',
          'sql': '2 weeks',
          'rest api': '1-2 weeks',
          'spring': '4-5 weeks',
          'angular': '4-5 weeks',
          'vue': '3-4 weeks',
          'nextjs': '3-4 weeks',
          'graphql': '2-3 weeks',
          'devops': '4-5 weeks',
          'ci/cd': '3-4 weeks',
        };

        suggestions.push({
          area: `Learn ${skill}`,
          suggestion: `Focus on learning ${skill} through online courses (Udemy, Coursera) or practice platforms. Build 1-2 projects to showcase your skills.`,
          priority: 'high',
          timeToLearn: skillTimeMap[skill.toLowerCase()] || '3-4 weeks'
        });
      });
    }

    // CGPA improvement suggestion
    if (userCGPA && requiredCGPA && userCGPA < requiredCGPA) {
      const gap = (requiredCGPA - userCGPA).toFixed(2);
      suggestions.push({
        area: 'Improve Academic Performance',
        suggestion: `Your current CGPA (${userCGPA}) is ${gap} points below the requirement (${requiredCGPA}). Focus on improving your GPA in upcoming semesters. However, some companies may waive the CGPA requirement if you have strong projects and internships.`,
        priority: 'medium',
        timeToLearn: 'Ongoing (1-2 semesters)'
      });
    }

    // Experience improvement
    if (eligibilityScore < 50) {
      suggestions.push({
        area: 'Build Project Portfolio',
        suggestion: 'Create 2-3 projects demonstrating your technical skills. Focus on real-world problems and deploy them on GitHub. This will significantly improve your candidature.',
        priority: 'high',
        timeToLearn: '4-8 weeks'
      });

      suggestions.push({
        area: 'Seek Internship Experience',
        suggestion: 'Apply for internships in similar domains. Real-world experience is highly valued by companies and will prepare you better for full-time roles.',
        priority: 'high',
        timeToLearn: 'Summer/Winter internship'
      });
    }

    // General suggestions based on score
    if (eligibilityScore < 80) {
      suggestions.push({
        area: 'Resume Optimization',
        suggestion: 'Tailor your resume for this role. Add quantifiable achievements, highlight relevant projects, and use ATS-friendly keywords from the job description.',
        priority: 'medium',
        timeToLearn: '1-2 days'
      });

      suggestions.push({
        area: 'Interview Preparation',
        suggestion: 'Practice technical questions related to the role. Use platforms like LeetCode, HackerRank for coding problems and GeeksforGeeks for system design concepts.',
        priority: 'high',
        timeToLearn: '2-3 weeks'
      });
    }

    // Soft skills
    suggestions.push({
      area: 'Soft Skills Development',
      suggestion: 'Improve communication skills by joining tech communities, attending meetups, and participating in hackathons. These help in HR rounds and work culture fit.',
      priority: 'medium',
      timeToLearn: 'Ongoing'
    });

    return suggestions;
  },

  // Integration point for Ant API (can be extended for actual AI analysis)
  getAntAPIAnalysis: async (resumeText: string, jobDescription: string): Promise<string> => {
    try {
      // This is a placeholder for Ant API integration
      // In production, you would call the actual Ant API endpoint
      // Example: const response = await fetch('https://api.ant.ai/analyze', {...})
      
      // For now, returning local analysis
      const improvementAreas = [
        'Strengthen technical skill set',
        'Add more project experience',
        'Improve communication in resume',
      ];

      return `Based on analysis: ${improvementAreas.join(', ')}`;
    } catch (error) {
      console.error('Error calling Ant API:', error);
      throw new Error('Failed to get AI analysis');
    }
  }
};
