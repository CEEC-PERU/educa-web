// pages/exportCsv.tsx
import React, { useState } from 'react';
import Wizard from '../../../components/WizardComponet';
import UploadStep from './../../../pages/admin/student/UploadStep';
import AssignStep from './AssignStep';
import DetailsStep from './../../../pages/admin/student/DetailsStep';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import './../../../app/globals.css';

const ExportCsvPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [enterpriseId, setEnterpriseId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const steps = [
    {
      title: 'Subir',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 15a4 4 0 00-1-7.97V5a2 2 0 012-2h12a2 2 0 012 2v2.03a4 4 0 100 7.94V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zM10 14h4m-2 0v6m-6-2h6"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Asignar',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7a4 4 0 11-8 0 4 4 0 018 0zm4 6a4 4 0 100-8 4 4 0 000 8zm4 8a4 4 0 11-8 0 4 4 0 018 0zm0-8a4 4 0 10-8 0 4 4 0 008 0z"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Detalles',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m0 0H6m9 0l-3 3M18 11a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      ),
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <UploadStep
            initialFile={file}
            onNext={(file) => {
              setFile(file);
              setCurrentStep(2);
            }}
          />
        );
      case 2:
        return (
          <AssignStep
            file={file!}
            selectedCompany={selectedCompany}
            onNext={(enterpriseId) => {
              setEnterpriseId(enterpriseId);
              setSelectedCompany(enterpriseId);
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <DetailsStep
            file={file!}
            enterpriseId={enterpriseId!}
            onBack={() => setCurrentStep(2)}
          />
          );
      default:
        return null;
      }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main
          className={`flex-grow p-6 transition-all duration-300 ease-in-out ${
            showSidebar ? 'ml-20' : ''
          }`}
        >
          <Wizard currentStep={currentStep} steps={steps} />
          <div className="p-4">{renderStepContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default ExportCsvPage;