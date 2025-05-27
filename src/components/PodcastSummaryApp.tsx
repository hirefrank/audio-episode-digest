
'use client';

import { useState } from 'react';
import { UrlInput } from './UrlInput';
import { LoadingSpinner } from './LoadingSpinner';
import { SummaryDisplay } from './SummaryDisplay';
import { ErrorMessage } from './ErrorMessage';
import { RecentSummaries } from './RecentSummaries';

export interface Summary {
  id: string;
  youtubeVideoId: string;
  title: string;
  channel: string;
  duration: string;
  publishDate?: string;
  executiveSummary: string;
  keyTopics: Array<{ topic: string; description: string }>;
  detailedSummary: string;
  notableQuotes: string[];
  keyTakeaways: string[];
  listenRating: { score: number; justification: string };
  extractionMethod?: string;
  createdAt?: string;
}

export default function PodcastSummaryApp() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSummaries, setRecentSummaries] = useState<Summary[]>([]);

  // Load recent summaries from localStorage on component mount
  useState(() => {
    const saved = localStorage.getItem('podcast-summaries');
    if (saved) {
      try {
        setRecentSummaries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent summaries:', e);
      }
    }
  });

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setSummary(null);
    
    try {
      // Extract video ID from URL
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      }

      // Check if we already have this summary cached
      const existingSummary = recentSummaries.find(s => s.youtubeVideoId === videoId);
      if (existingSummary) {
        setSummary(existingSummary);
        setLoading(false);
        return;
      }

      // For demo purposes, we'll create a mock summary
      // In a real implementation, this would call your backend API
      const mockSummary = await generateMockSummary(videoId, url);
      
      setSummary(mockSummary);
      
      // Save to localStorage
      const updatedSummaries = [mockSummary, ...recentSummaries.slice(0, 9)];
      setRecentSummaries(updatedSummaries);
      localStorage.setItem('podcast-summaries', JSON.stringify(updatedSummaries));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the summary');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (recentSummary: Summary) => {
    setSummary(recentSummary);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Podcast Summary Tool
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get intelligent cliff notes for any YouTube podcast episode. Save time and discover key insights before you listen.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UrlInput onSubmit={handleSubmit} disabled={loading} />
            
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {summary && <SummaryDisplay summary={summary} />}
          </div>
          
          <div className="lg:col-span-1">
            <RecentSummaries 
              summaries={recentSummaries} 
              onSelect={handleSelectRecent}
              currentSummaryId={summary?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Mock summary generator for demo purposes
async function generateMockSummary(videoId: string, url: string): Promise<Summary> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const mockSummaries = [
    {
      title: "The Future of AI and Human Creativity",
      channel: "Tech Talks Daily",
      duration: "1:23:45",
      executiveSummary: "A deep dive into how AI is transforming creative industries while exploring the unique value humans bring to innovation. The discussion covers practical applications, ethical considerations, and actionable strategies for creatives.",
      keyTopics: [
        { topic: "AI Creative Tools", description: "Overview of current AI tools revolutionizing design, writing, and content creation." },
        { topic: "Human-AI Collaboration", description: "How professionals can work alongside AI to enhance rather than replace creativity." },
        { topic: "Future Implications", description: "Predictions for how creative industries will evolve over the next decade." },
        { topic: "Ethical Considerations", description: "Discussion of copyright, attribution, and fair use in AI-generated content." }
      ],
      detailedSummary: "The episode begins with an exploration of current AI creative tools, highlighting how platforms like DALL-E, Midjourney, and GPT are being used by professionals. The host emphasizes that AI should be viewed as a powerful collaborator rather than a replacement for human creativity.\n\nA significant portion focuses on practical applications, with real-world examples from advertising agencies, design studios, and content creators who have successfully integrated AI into their workflows. The discussion reveals that the most successful implementations combine AI efficiency with human strategic thinking and emotional intelligence.\n\nThe conversation shifts to future implications, predicting major changes in creative education, job roles, and industry structures. The guests argue that professionals who adapt and learn to work with AI will have significant advantages over those who resist the technology.\n\nThe episode concludes with a thoughtful discussion of ethical considerations, including questions about authorship, copyright, and the importance of maintaining transparency about AI involvement in creative work.",
      notableQuotes: [
        "AI doesn't replace creativity; it amplifies it. The question isn't whether machines can be creative, but how we can be more creative with machines.",
        "The future belongs to those who can seamlessly blend human intuition with artificial intelligence capabilities.",
        "We're not looking at humans versus AI, but humans with AI versus humans without AI."
      ],
      keyTakeaways: [
        "Start experimenting with AI tools in low-risk projects to understand their capabilities and limitations",
        "Focus on developing skills that complement AI: strategic thinking, emotional intelligence, and creative direction",
        "Establish clear ethical guidelines for AI use in your creative work, including transparency and attribution",
        "View AI as a collaborative partner that can handle routine tasks, freeing you to focus on high-level creative decisions",
        "Invest in continuous learning as AI tools evolve rapidly and new opportunities emerge regularly"
      ],
      listenRating: { score: 4, justification: "Excellent insights for creative professionals with practical actionable advice, though could benefit from more specific implementation examples." }
    },
    {
      title: "Building Resilient Startups in Uncertain Times",
      channel: "Entrepreneur's Journey",
      duration: "58:32",
      executiveSummary: "Startup founders share battle-tested strategies for building companies that thrive during economic uncertainty. Focus on operational efficiency, customer retention, and adaptive business models.",
      keyTopics: [
        { topic: "Cash Flow Management", description: "Strategies for maintaining healthy cash flow and extending runway during downturns." },
        { topic: "Customer Retention", description: "Proven methods for keeping customers and increasing lifetime value." },
        { topic: "Team Building", description: "How to build and maintain high-performing teams with limited resources." },
        { topic: "Market Adaptation", description: "Frameworks for quickly adapting business models to changing market conditions." }
      ],
      detailedSummary: "This episode features three successful startup founders who built their companies during previous economic downturns. They share specific strategies that helped them not just survive, but thrive during challenging times.\n\nThe discussion begins with cash flow management, emphasizing the importance of maintaining 12-18 months of runway and implementing rigorous financial tracking. The founders share practical tools and metrics they use to monitor financial health and make data-driven decisions about spending and growth.\n\nCustomer retention takes center stage as the founders explain how they shifted focus from acquisition to retention during tough times. They share specific tactics for increasing customer lifetime value, including improved onboarding, proactive support, and value-added services.\n\nThe conversation covers team building strategies for resource-constrained environments, including creative compensation packages, equity structures, and building strong company culture that attracts top talent even when competing with larger companies.\n\nThe episode concludes with frameworks for rapid market adaptation, including methods for quickly testing new business models, pivoting strategies, and maintaining agility while preserving core company values.",
      notableQuotes: [
        "In uncertain times, cash is king, but customer relationships are the kingdom.",
        "The companies that thrive in downturns are those that use constraints as creativity catalysts.",
        "Don't just weather the storm—use it to build stronger foundations than your competitors."
      ],
      keyTakeaways: [
        "Maintain 12-18 months of cash runway and implement weekly cash flow monitoring",
        "Shift from growth-at-all-costs to sustainable, profitable growth with focus on unit economics",
        "Invest heavily in customer success and retention programs during uncertain times",
        "Build flexible business models that can quickly adapt to changing market conditions",
        "Use economic downturns as opportunities to acquire talent and gain market share"
      ],
      listenRating: { score: 5, justification: "Must-listen for any startup founder. Practical, actionable advice from proven successful entrepreneurs with specific tactics and frameworks." }
    }
  ];
  
  const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
  
  return {
    id: `summary-${Date.now()}`,
    youtubeVideoId: videoId,
    ...randomSummary,
    publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    extractionMethod: 'mock-demo',
    createdAt: new Date().toISOString()
  };
}
