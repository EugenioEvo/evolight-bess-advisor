
import React from 'react';
import WizardHeader from '@/components/WizardHeader';
import { BessWizard } from '@/components/wizard/BessWizard';
import { Routes, Route } from 'react-router-dom';

const WizardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WizardHeader />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <Routes>
          <Route path="/" element={<BessWizard />} />
          <Route path="/new" element={<BessWizard />} />
          <Route path="/simulation/:simulationId" element={<BessWizard />} />
          <Route path="/template/:simulationId" element={<BessWizard />} />
          <Route path="*" element={<BessWizard />} />
        </Routes>
      </main>
    </div>
  );
};

export default WizardPage;
