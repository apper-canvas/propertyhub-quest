import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { contactService } from '@/services';

const ContactCard = ({ contact, index, onContactUpdate, onContactDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (onContactUpdate) {
      onContactUpdate(contact);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await contactService.delete(contact.id);
      toast.success('Contact deleted successfully');
      if (onContactDelete) {
        onContactDelete(contact.id);
      }
    } catch (err) {
      toast.error('Failed to delete contact');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'buyer': return 'bg-blue-100 text-blue-800';
      case 'seller': return 'bg-green-100 text-green-800';
      case 'investor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-medium mr-4">
              {getInitials(contact.name)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contact.type)}`}>
                {contact.type}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit contact"
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete contact"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="Mail" size={14} className="mr-2 text-gray-400" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Phone" size={14} className="mr-2 text-gray-400" />
            <span>{contact.phone}</span>
          </div>
          {contact.notes && (
            <div className="flex items-start mt-3">
              <ApperIcon name="FileText" size={14} className="mr-2 text-gray-400 mt-0.5" />
              <span className="text-gray-500 text-xs line-clamp-2">{contact.notes}</span>
            </div>
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Contact</h3>
                  <p className="text-gray-600">Are you sure you want to delete {contact.name}?</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. All contact information will be permanently removed.
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

export default ContactCard;