import React from 'react';
import PageHeader from '@/components/organisms/PageHeader';
import DealPipelineBoard from '@/components/organisms/DealPipelineBoard';

const HomePage = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Deal Pipeline"
          description="Track your deals through each stage of the sales process"
        />
        <DealPipelineBoard />
      </div>
    </div>
  );
};

export default HomePage;