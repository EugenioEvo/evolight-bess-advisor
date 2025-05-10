
import React from 'react';
import Header from '@/components/Header';
import { BessWizard } from '@/components/wizard/BessWizard';

const WizardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <BessWizard />
      </main>
    </div>
  );
};

export default WizardPage;
