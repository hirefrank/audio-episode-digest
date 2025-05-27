
import { Clock, Star, ChevronRight } from 'lucide-react';
import { Summary } from './PodcastSummaryApp';

interface RecentSummariesProps {
  summaries: Summary[];
  onSelect: (summary: Summary) => void;
  currentSummaryId?: string;
}

export function RecentSummaries({ summaries, onSelect, currentSummaryId }: RecentSummariesProps) {
  if (summaries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Summaries
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">
            Your recent summaries will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Recent Summaries
      </h3>
      
      <div className="space-y-3">
        {summaries.map((summary) => (
          <SummaryCard
            key={summary.id}
            summary={summary}
            onSelect={onSelect}
            isSelected={summary.id === currentSummaryId}
          />
        ))}
      </div>
      
      {summaries.length >= 10 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            Showing 10 most recent summaries
          </p>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  summary: Summary;
  onSelect: (summary: Summary) => void;
  isSelected: boolean;
}

function SummaryCard({ summary, onSelect, isSelected }: SummaryCardProps) {
  const getRatingColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-blue-600 bg-blue-100';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRatingEmoji = (score: number) => {
    if (score >= 4) return '🔥';
    if (score >= 3) return '👍';
    if (score >= 2) return '🤔';
    return '⏭️';
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <button
      onClick={() => onSelect(summary)}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
            {summary.title}
          </h4>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">{summary.channel}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{summary.duration}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(summary.listenRating.score)}`}>
              {getRatingEmoji(summary.listenRating.score)} {summary.listenRating.score}/5
            </div>
            
            {summary.createdAt && (
              <span className="text-xs text-gray-400">
                {timeAgo(summary.createdAt)}
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isSelected ? 'text-blue-500' : 'text-gray-400'
        }`} />
      </div>
    </button>
  );
}
