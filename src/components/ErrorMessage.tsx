
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  const isTranscriptError = message.toLowerCase().includes('transcript') || 
                           message.toLowerCase().includes('captions');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {message}
        </p>
        
        {isTranscriptError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">Common causes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Auto-generated captions are disabled for this video</li>
              <li>• The video is too new (captions not generated yet)</li>
              <li>• The content is primarily music or non-speech</li>
              <li>• The video is private or restricted</li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button
            onClick={() => window.open('https://support.google.com/youtube/answer/6373554', '_blank')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Learn About Captions
          </Button>
        </div>
      </div>
    </div>
  );
}
