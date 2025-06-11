import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { propertyService } from '@/services';

const PropertyCard = ({ property, index, onPropertyUpdate, onPropertyDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (onPropertyUpdate) {
      onPropertyUpdate(property);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await propertyService.delete(property.id);
      toast.success('Property deleted successfully');
      if (onPropertyDelete) {
        onPropertyDelete(property.id);
      }
    } catch (err) {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow group overflow-hidden"
      >
        {/* Property Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="Home" size={48} className="text-gray-400" />
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleEdit}
              className="p-2 bg-white/90 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors shadow-sm"
              title="Edit property"
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              onClick={handleDeleteClick}
              className="p-2 bg-white/90 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shadow-sm"
              title="Delete property"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{property.address}</h3>
            <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" size={14} className="mr-1 text-gray-400" />
              <span>{property.bedrooms || 0} bed</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" size={14} className="mr-1 text-gray-400" />
              <span>{property.bathrooms || 0} bath</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Square" size={14} className="mr-1 text-gray-400" />
              <span>{property.sqft ? `${property.sqft.toLocaleString()} sq ft` : 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 capitalize">{property.type}</span>
            <Button className="text-sm text-primary hover:text-primary/80 font-medium">
              View Details
              <ApperIcon name="ArrowRight" size={14} className="ml-1" />
            </Button>
          </div>

          {property.description && (
            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Property</h3>
                  <p className="text-gray-600">Are you sure you want to delete this property?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="font-medium text-gray-900">{property.address}</p>
                <p className="text-sm text-gray-600">{formatPrice(property.price)}</p>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. All property information will be permanently removed.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;