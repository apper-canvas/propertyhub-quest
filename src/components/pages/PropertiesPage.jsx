import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/molecules/SearchInput';
import StatusToggleFilter from '@/components/molecules/StatusToggleFilter';
import TypeDropdownFilter from '@/components/molecules/TypeDropdownFilter';
import PropertyListings from '@/components/organisms/PropertyListings';
import { propertyService } from '@/services';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState(['all']);
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    type: 'house',
    status: 'active',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

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
    const matchesStatus = selectedStatuses.includes('all') || selectedStatuses.includes(property.status);
    const matchesType = selectedType === 'all' || property.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddPropertyClick = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      address: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      sqft: '',
      type: 'house',
      status: 'active',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim() || !formData.price.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    try {
      const propertyToCreate = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        sqft: parseInt(formData.sqft) || 0
      };
      
      const newProperty = await propertyService.create(propertyToCreate);
      setProperties(prev => [newProperty, ...prev]);
      toast.success('Property created successfully!');
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to create property');
    } finally {
      setFormLoading(false);
}
  };

  const handlePropertyUpdate = (property) => {
    setEditingProperty(property);
    setFormData({
      address: property.address,
      price: property.price.toString(),
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      sqft: property.sqft?.toString() || '',
      type: property.type,
      status: property.status,
      description: property.description || ''
    });
    setShowEditModal(true);
  };

  const handlePropertyDelete = (propertyId) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim() || !formData.price.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    try {
      const propertyToUpdate = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        sqft: parseInt(formData.sqft) || 0
      };
      
      const updatedProperty = await propertyService.update(editingProperty.id, propertyToUpdate);
      setProperties(prev => prev.map(p => p.id === editingProperty.id ? updatedProperty : p));
      toast.success('Property updated successfully!');
      handleCloseEditModal();
    } catch (err) {
      toast.error('Failed to update property');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProperty(null);
    setFormData({
      address: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      sqft: '',
      type: 'house',
      status: 'active',
      description: ''
    });
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
        {/* Search and Add Property */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          
          {/* Modern Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <StatusToggleFilter
              selectedStatuses={selectedStatuses}
              onStatusToggle={setSelectedStatuses}
            />
            
            <TypeDropdownFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
          </div>
        </div>
{/* Properties Grid */}
<PropertyListings
          properties={filteredProperties}
          searchTerm={searchTerm}
          onAddPropertyClick={handleAddPropertyClick}
          onPropertyUpdate={handlePropertyUpdate}
          onPropertyDelete={handlePropertyDelete}
          loading={loading}
        />

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Property</h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter property address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Square Feet
                      </label>
                      <input
                        type="number"
                        name="sqft"
                        value={formData.sqft}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Property description..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {formLoading ? 'Creating...' : 'Create Property'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
</div>
        )}

        {/* Edit Property Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Property</h2>
                  <button
                    onClick={handleCloseEditModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter property address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Square Feet
                      </label>
                      <input
                        type="number"
                        name="sqft"
                        value={formData.sqft}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Property description..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleCloseEditModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {formLoading ? 'Updating...' : 'Update Property'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;