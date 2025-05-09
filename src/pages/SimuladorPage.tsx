
import React from 'react';
import Header from '@/components/Header';
import { SimuladorPageContainer } from '@/components/simulador/SimuladorPageContainer';

const SimuladorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <SimuladorPageContainer />
    </div>
  );
};

export default SimuladorPage;
