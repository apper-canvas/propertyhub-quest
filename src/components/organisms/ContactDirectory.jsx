import React from 'react';
import ContactCard from '@/components/molecules/ContactCard';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContactDirectory = ({ contacts, searchTerm, onAddContactClick, onContactUpdate, onContactDelete, loading }) => {
    if (loading) {
        return (
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
        );
    }

    return (
        <>
            {contacts.length === 0 ? (
                <EmptyState
                    icon="Users"
                    title={searchTerm ? 'No contacts found' : 'No contacts yet'}
                    message={searchTerm
                        ? 'Try adjusting your search terms or filters'
                        : 'Add your first contact to start building your network'
                    }
                >
                    {!searchTerm && (
                        <Button
                            onClick={onAddContactClick}
                            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            <ApperIcon name="Plus" size={16} className="inline mr-2" />
                            Add Contact
                        </Button>
                    )}
                </EmptyState>
            ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact, index) => (
                        <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            index={index}
                            onContactUpdate={onContactUpdate}
                            onContactDelete={onContactDelete}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default ContactDirectory;