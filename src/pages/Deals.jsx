import MainFeature from '../components/MainFeature';

const Deals = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">
            Drag deals between stages to track progress through your sales pipeline
          </p>
        </div>
        
        <MainFeature />
      </div>
    </div>
  );
};

export default Deals;