// components/Wizard.tsx
import React from 'react';

interface WizardStep {
  title: string;
  icon: React.ReactNode;
}

interface WizardProps {
  currentStep: number;
  steps: WizardStep[];
}

const Wizard: React.FC<WizardProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative mb-2">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentStep >= index + 1 ? 'bg-purple-500' : 'bg-purple-200'
                } text-white`}
              >
                {step.icon}
              </div>
              <div className="absolute top-12 w-full text-center text-xs md:text-base">
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  currentStep > index + 1 ? 'bg-purple-500' : 'bg-purple-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wizard;
