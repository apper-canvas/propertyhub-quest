import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

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

const ContactCard = ({ contact, index }) => {
    return (
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
                    <Text as="h3" className="font-semibold text-gray-900 truncate">{contact.name}</Text>
                    <Text as="span" className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContactColor(contact.type)}`}>
                        {contact.type}
                    </Text>
                </div>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
                    <Text as="span" className="truncate">{contact.email}</Text>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
                    <Text as="span">{contact.phone}</Text>
                </div>
            </div>
            
            {contact.preferences && Object.keys(contact.preferences).length > 0 && (
                <div className="mb-4">
                    <Text as="p" className="text-xs text-gray-500 mb-2">Preferences</Text>
                    <div className="flex flex-wrap gap-1">
                        {Object.entries(contact.preferences).slice(0, 3).map(([key, value]) => (
                            <Text as="span" key={key} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                {key}: {String(value)}
                            </Text>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Text as="span" className="text-xs text-gray-500">
                    Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                </Text>
                <div className="flex items-center space-x-2">
                    <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <ApperIcon name="Phone" size={16} />
                    </Button>
                    <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <ApperIcon name="Mail" size={16} />
                    </Button>
                    <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                        <ApperIcon name="MoreHorizontal" size={16} />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactCard;