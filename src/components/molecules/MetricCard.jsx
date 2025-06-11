import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const MetricCard = ({ title, value, icon, color, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div>
                    <Text as="p" className="text-sm font-medium text-gray-600">{title}</Text>
                    <Text as="p" className="text-2xl font-bold text-gray-900 mt-2">{value}</Text>
                    {subtitle && (
                        <Text as="p" className="text-sm text-gray-500 mt-1">{subtitle}</Text>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <ApperIcon name={icon} size={24} className="text-white" />
                </div>
            </div>
        </motion.div>
    );
};

export default MetricCard;