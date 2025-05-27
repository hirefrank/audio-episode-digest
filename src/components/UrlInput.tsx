
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Sparkles } from "lucide-react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  disabled: boolean;
}

export function UrlInput({ onSubmit, disabled }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const validateUrl = (inputUrl: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    return regex.test(inputUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setIsValid(false);
      return;
    }
    
    if (!validateUrl(trimmedUrl)) {
      setIsValid(false);
      return;
    }
    
    setIsValid(true);
    onSubmit(trimmedUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl.trim() && !validateUrl(newUrl)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const exampleUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Youtube className="w-6 h-6 text-red-500" />
          Enter YouTube URL
        </h2>
        <p className="text-gray-600">
          Paste any YouTube podcast episode URL to generate an intelligent summary
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="url"
            value={url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`h-14 text-lg pr-4 pl-12 ${!isValid ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            disabled={disabled}
          />
          <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {!isValid && (
            <p className="text-red-500 text-sm mt-2">
              Please enter a valid YouTube URL
            </p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={disabled || !url.trim() || !isValid}
          className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
        >
          {disabled ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Summary
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-3">Try these example URLs:</p>
        <div className="flex flex-wrap gap-2">
          {exampleUrls.map((exampleUrl, index) => (
            <button
              key={index}
              onClick={() => {
                setUrl(exampleUrl);
                setIsValid(true);
              }}
              disabled={disabled}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
            >
              Example {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
