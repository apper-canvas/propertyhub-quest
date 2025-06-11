import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { propertyService } from '../services';

const Properties = () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search skeleton */}
          <div className="mb-6">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load properties</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadProperties}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
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
            <div className="flex-1 relative">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties by address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap">
              <ApperIcon name="Plus" size={16} className="inline mr-2" />
              Add Property
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 py-1">Status:</span>
              {['all', 'active', 'pending', 'sold', 'withdrawn'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 py-1">Type:</span>
              {['all', 'house', 'condo', 'townhouse', 'land'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Home" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Add your first property to start building your listings'
              }
            </p>
            {!searchTerm && (
              <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                <ApperIcon name="Plus" size={16} className="inline mr-2" />
                Add Property
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-100">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.address}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ApperIcon name="Home" size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  
                  {/* Image Count */}
                  {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      <ApperIcon name="Camera" size={12} className="inline mr-1" />
                      {property.images.length}
                    </div>
                  )}
                </div>
                
                {/* Property Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      ${property.price?.toLocaleString() || '0'}
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded capitalize">
                      {property.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 truncate">{property.address}</p>
                  
                  {/* Property Stats */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <ApperIcon name="Bed" size={16} className="mr-1" />
                      <span>{property.beds || 0} beds</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Bath" size={16} className="mr-1" />
                      <span>{property.baths || 0} baths</span>
                    </div>
                    {property.sqft && (
                      <div className="flex items-center">
                        <ApperIcon name="Square" size={16} className="mr-1" />
                        <span>{property.sqft.toLocaleString()} sqft</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Features */}
                  {property.features && property.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {property.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="bg-surface-50 text-gray-600 text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 3 && (
                          <span className="bg-surface-50 text-gray-600 text-xs px-2 py-1 rounded">
                            +{property.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Heart" size={14} className="mr-1" />
                      <span>0 interested</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <ApperIcon name="Eye" size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <ApperIcon name="Share" size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <ApperIcon name="MoreHorizontal" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;