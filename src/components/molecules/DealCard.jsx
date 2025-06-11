import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DealCard = ({ deal, onDragStart, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            draggable
            onDragStart={onDragStart}
            className="bg-white p-4 rounded-lg shadow-sm border cursor-move hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-2">
                <Text as="h4" className="font-medium text-gray-900 text-sm truncate">
                    {deal.contactName || 'Unknown Contact'}
                </Text>
                <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
            </div>
            
            <Text as="p" className="text-xs text-gray-600 mb-2 truncate">
                {deal.propertyAddress || 'No property'}
            </Text>
            
            <div className="flex items-center justify-between">
                <Text as="span" className="text-lg font-semibold text-primary">
                    ${deal.value?.toLocaleString() || '0'}
                </Text>
                <Text as="span" className="text-xs text-gray-500">
                    {deal.commission ? `$${deal.commission.toLocaleString()} comm` : ''}
                </Text>
            </div>
            
            {deal.notes && (
                <Text as="p" className="text-xs text-gray-500 mt-2 truncate">{deal.notes}</Text>
            )}
        </motion.div>
    );
};

export default DealCard;