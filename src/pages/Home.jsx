import MainFeature from '../components/MainFeature';

const Home = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Deal Pipeline
          </h1>
          <p className="text-gray-600">
            Track your deals through each stage of the sales process
          </p>
        </div>
        
        <MainFeature />
      </div>
    </div>
  );
};

export default Home;