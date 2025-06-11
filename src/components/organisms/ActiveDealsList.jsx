import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const ActiveDealsList = ({ deals }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
            <div className="flex items-center justify-between mb-6">
                <Text as="h3" className="text-lg font-semibold text-gray-900">Active Deals</Text>
                <ApperIcon name="TrendingUp" size={20} className="text-gray-400" />
            </div>
            
            {deals.length === 0 ? (
                <EmptyState
                    icon="Handshake"
                    title=""
                    message="No active deals"
                />
            ) : (
                <div className="space-y-4">
                    {deals.map((deal, index) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <Text as="h4" className="font-medium text-gray-900 truncate">
                                    {deal.contactName || 'Unknown Contact'}
                                </Text>
                                <Text as="p" className="text-sm text-gray-500 truncate">
                                    {deal.propertyAddress || 'No property'}
                                </Text>
                                <div className="flex items-center mt-1">
                                    <Text as="span" className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        deal.stage === 'lead' ? 'bg-blue-100 text-blue-800' :
                                        deal.stage === 'showing' ? 'bg-yellow-100 text-yellow-800' :
                                        deal.stage === 'offer' ? 'bg-orange-100 text-orange-800' :
                                        deal.stage === 'contract' ? 'bg-purple-100 text-purple-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {deal.stage}
                                    </Text>
                                </div>
                            </div>
                            <div className="text-right">
                                <Text as="p" className="font-semibold text-primary">
                                    ${deal.value?.toLocaleString() || '0'}
                                </Text>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ActiveDealsList;