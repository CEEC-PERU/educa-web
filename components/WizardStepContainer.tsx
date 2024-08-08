import React from 'react';

interface WizardStepContainerProps {
  title?: string;
  children: React.ReactNode;
}

const WizardStepContainer: React.FC<WizardStepContainerProps> = ({ title, children }) => {
  return (
    <div className="rounded-lg p-6 mb-4">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default WizardStepContainer;
