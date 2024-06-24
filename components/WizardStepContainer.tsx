import React from 'react';

interface WizardStepContainerProps {
  title?: string;
  children: React.ReactNode;
}

const WizardStepContainer: React.FC<WizardStepContainerProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="mb-4">{children}</div>
    </div>
  );
};

export default WizardStepContainer;
