import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { contactService } from '../services';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getAll();
      setContacts(result);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesType = selectedType === 'all' || contact.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getContactIcon = (type) => {
    switch (type) {
      case 'buyer': return 'ShoppingBag';
      case 'seller': return 'Home';
      case 'investor': return 'TrendingUp';
      default: return 'User';
    }
  };

  const getContactColor = (type) => {
    switch (type) {
      case 'buyer': return 'bg-blue-100 text-blue-800';
      case 'seller': return 'bg-green-100 text-green-800';
      case 'investor': return 'bg-purple-100 text-purple-800';
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
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load contacts</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadContacts}
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
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap">
              <ApperIcon name="Plus" size={16} className="inline mr-2" />
              Add Contact
            </button>
          </div>
          
          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'buyer', 'seller', 'investor'].map((type) => (
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

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Add your first contact to start building your network'
              }
            </p>
            {!searchTerm && (
              <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                <ApperIcon name="Plus" size={16} className="inline mr-2" />
                Add Contact
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <ApperIcon name={getContactIcon(contact.type)} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContactColor(contact.type)}`}>
                      {contact.type}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
                
                {contact.preferences && Object.keys(contact.preferences).length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Preferences</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(contact.preferences).slice(0, 3).map(([key, value]) => (
                        <span key={key} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                      <ApperIcon name="Phone" size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                      <ApperIcon name="Mail" size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                      <ApperIcon name="MoreHorizontal" size={16} />
                    </button>
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

export default Contacts;