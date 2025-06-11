import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/molecules/SearchInput';
import FilterButton from '@/components/molecules/FilterButton';
import ContactDirectory from '@/components/organisms/ContactDirectory';
import { contactService } from '@/services';

const ContactsPage = () => {
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

  const handleAddContactClick = () => {
    toast.info('Add Contact functionality coming soon!');
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load contacts</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={loadContacts}
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
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              onClick={handleAddContactClick}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              <ApperIcon name="Plus" size={16} className="inline mr-2" />
              Add Contact
            </Button>
          </div>
          
          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'buyer', 'seller', 'investor'].map((type) => (
              <FilterButton
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                onClick={() => setSelectedType(type)}
                isActive={selectedType === type}
              />
            ))}
          </div>
        </div>

        {/* Contacts Grid */}
        <ContactDirectory
          contacts={filteredContacts}
          searchTerm={searchTerm}
          onAddContactClick={handleAddContactClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ContactsPage;