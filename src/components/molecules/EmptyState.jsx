import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const EmptyState = ({ icon, title, message, children }) => {
    return (
        <div className="text-center py-12">
            <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">{title}</Text>
            <Text as="p" className="text-gray-500 mb-4">{message}</Text>
            {children}
        </div>
    );
};

export default EmptyState;