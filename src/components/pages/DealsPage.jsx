import React from 'react';
import PageHeader from '@/components/organisms/PageHeader';
import DealPipelineBoard from '@/components/organisms/DealPipelineBoard';

const DealsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          description="Drag deals between stages to track progress through your sales pipeline"
        />
        <DealPipelineBoard />
      </div>
    </div>
  );
};

export default DealsPage;