
import { useState } from 'react';
import { ChevronDown, ChevronRight, Star, Clock, Calendar, User, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Summary } from './PodcastSummaryApp';

interface SummaryDisplayProps {
  summary: Summary;
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['executive']));
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  const getRatingColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 3) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getRatingEmoji = (score: number) => {
    if (score >= 4) return '🔥';
    if (score >= 3) return '👍';
    if (score >= 2) return '🤔';
    return '⏭️';
  };

  const handleBookmark = () => {
    // Save to localStorage bookmarks
    const bookmarks = JSON.parse(localStorage.getItem('podcast-bookmarks') || '[]');
    if (!bookmarks.find((b: Summary) => b.id === summary.id)) {
      bookmarks.push(summary);
      localStorage.setItem('podcast-bookmarks', JSON.stringify(bookmarks));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: summary.title,
          text: summary.executiveSummary,
          url: `https://youtube.com/watch?v=${summary.youtubeVideoId}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${summary.title}\n\n${summary.executiveSummary}\n\nhttps://youtube.com/watch?v=${summary.youtubeVideoId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold leading-tight flex-1 mr-4">{summary.title}</h2>
          <div className="flex gap-2">
            <Button
              onClick={handleBookmark}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-blue-100 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{summary.channel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{summary.duration}</span>
          </div>
          {summary.publishDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(summary.publishDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRatingColor(summary.listenRating.score)}`}>
            <span className="mr-2">{getRatingEmoji(summary.listenRating.score)}</span>
            Listen Rating: {summary.listenRating.score}/5
          </div>
          
          <Button
            onClick={() => window.open(`https://youtube.com/watch?v=${summary.youtubeVideoId}`, '_blank')}
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch on YouTube
          </Button>
        </div>
      </div>
      
      {/* Executive Summary */}
      <div className="p-8 border-b border-gray-100">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
          📋 Executive Summary
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">{summary.executiveSummary}</p>
      </div>
      
      {/* Collapsible Sections */}
      <div className="divide-y divide-gray-100">
        <CollapsibleSection
          title="🎯 Key Topics"
          isExpanded={expandedSections.has('topics')}
          onToggle={() => toggleSection('topics')}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {summary.keyTopics.map((topic, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{topic.topic}</h4>
                <p className="text-gray-600 leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection
          title="📝 Detailed Summary"
          isExpanded={expandedSections.has('detailed')}
          onToggle={() => toggleSection('detailed')}
        >
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {summary.detailedSummary.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection
          title="💬 Notable Quotes"
          isExpanded={expandedSections.has('quotes')}
          onToggle={() => toggleSection('quotes')}
        >
          <div className="space-y-6">
            {summary.notableQuotes.map((quote, index) => (
              <blockquote key={index} className="border-l-4 border-blue-500 bg-blue-50 pl-6 py-4 rounded-r-lg">
                <p className="text-gray-800 italic text-lg leading-relaxed">"{quote}"</p>
              </blockquote>
            ))}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection
          title="✅ Key Takeaways"
          isExpanded={expandedSections.has('takeaways')}
          onToggle={() => toggleSection('takeaways')}
        >
          <div className="grid gap-3 md:grid-cols-1">
            {summary.keyTakeaways.map((takeaway, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-800 leading-relaxed">{takeaway}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
      
      {/* Listen Rating Details */}
      <div className="p-8 bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              🎧 Listen Recommendation
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary.listenRating.justification}</p>
          </div>
          <div className={`ml-6 px-6 py-3 rounded-xl text-2xl font-bold border-2 ${getRatingColor(summary.listenRating.score)}`}>
            {getRatingEmoji(summary.listenRating.score)} {summary.listenRating.score}/5
          </div>
        </div>
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

function CollapsibleSection({ title, children, isExpanded, onToggle }: CollapsibleSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-8 py-6 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="ml-4">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="px-8 pb-8">
          {children}
        </div>
      )}
    </div>
  );
}
