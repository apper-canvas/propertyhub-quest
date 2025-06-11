import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/molecules/SearchInput';
import FilterButton from '@/components/molecules/FilterButton';
import PropertyListings from '@/components/organisms/PropertyListings';
import { propertyService } from '@/services';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getAll();
      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
    const matchesType = selectedType === 'all' || property.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddPropertyClick = () => {
    toast.info('Add Property functionality coming soon!');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load properties</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={loadProperties}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <SearchInput
              placeholder="Search properties by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              onClick={handleAddPropertyClick}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              <ApperIcon name="Plus" size={16} className="inline mr-2" />
              Add Property
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 py-1">Status:</span>
              {['all', 'active', 'pending', 'sold', 'withdrawn'].map((status) => (
                <FilterButton
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  onClick={() => setSelectedStatus(status)}
                  isActive={selectedStatus === status}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 py-1">Type:</span>
              {['all', 'house', 'condo', 'townhouse', 'land'].map((type) => (
                <FilterButton
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  onClick={() => setSelectedType(type)}
                  isActive={selectedType === type}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <PropertyListings
          properties={filteredProperties}
          searchTerm={searchTerm}
          onAddPropertyClick={handleAddPropertyClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PropertiesPage;