
import React from 'react';
import Header from '@/components/Header';
import { DieselBessAnalysis } from '@/components/simulador/results/diesel-bess/DieselBessAnalysis';

const DieselBessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <DieselBessAnalysis />
      </main>
    </div>
  );
};

export default DieselBessPage;
