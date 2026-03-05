export interface PageData {
  url: string;
  content: string;
}

export interface PageIssue {
  url: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'seo' | 'performance' | 'accessibility' | 'content' | 'technical';
}

export interface SEOMetric {
  label: string;
  score: number; // 0-100
  description: string;
}

export interface Suggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'seo' | 'performance' | 'accessibility' | 'content' | 'technical';
  estimatedImpact: string;
}

export interface SEOAnalysisResponse {
  overallScore: number; // 0-100
  metrics: {
    seoHealth: number; // 0-100
    pageSpeed: number; // 0-100
    mobileFriendly: number; // 0-100
    contentQuality: number; // 0-100
    technicalSEO: number; // 0-100
  };
  issues: PageIssue[];
  suggestions: Suggestion[];
  summary: string;
  analyzedPages: number;
  timestamp: string;
}

