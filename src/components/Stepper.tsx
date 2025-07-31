import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  
  const calculateProgress = () => {
    return (currentStep / steps.length) * 100;
  };
  calculateProgress();

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.number} className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''} relative`}>
            <div className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors
                    ${step.number < currentStep
                      ? 'bg-green-600 border-green-600 text-white'
                      : step.number === currentStep
                      ? 'bg-green-100 border-green-600 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    Step {step.number}: {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              
              {stepIdx !== steps.length - 1 && (
                <div className="flex-1 mx-6">
                  <div
                    className={`h-0.5 transition-colors ${
                      step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
