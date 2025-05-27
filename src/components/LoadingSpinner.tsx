
import { Loader2, Brain, Mic, FileText } from 'lucide-react';

export function LoadingSpinner() {
  const steps = [
    { icon: Mic, text: 'Extracting transcript...', delay: 0 },
    { icon: Brain, text: 'Analyzing content...', delay: 1000 },
    { icon: FileText, text: 'Generating summary...', delay: 2000 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
          <Loader2 className="w-10 h-10 text-white animate-spin relative z-10" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Creating Your Summary
        </h3>
        
        <div className="space-y-4 max-w-md mx-auto">
          {steps.map((step, index) => (
            <ProcessingStep
              key={index}
              icon={step.icon}
              text={step.text}
              delay={step.delay}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>💡 Tip:</strong> Summaries are cached to avoid reprocessing the same episodes
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProcessingStepProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  delay: number;
}

function ProcessingStep({ icon: Icon, text, delay }: ProcessingStepProps) {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInSlide 0.5s ease-out forwards'
      }}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
      <div className="ml-auto">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
