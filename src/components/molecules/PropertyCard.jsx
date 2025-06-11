import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'sold': return 'bg-blue-100 text-blue-800';
        case 'withdrawn': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const PropertyCard = ({ property, index }) => {
    return (
        <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
        >
            {/* Property Image */}
            <div className="relative h-48 bg-gray-100">
                {property.images && property.images.length > 0 ? (
                    <img
                        src={property.images[0]}
                        alt={property.address}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ApperIcon name="Home" size={48} className="text-gray-400" />
                    </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <Text as="span" className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                    </Text>
                </div>
                
                {/* Image Count */}
                {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        <ApperIcon name="Camera" size={12} className="inline mr-1" />
                        {property.images.length}
                    </div>
                )}
            </div>
            
            {/* Property Details */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <Text as="h3" className="font-semibold text-gray-900 text-lg truncate">
                        ${property.price?.toLocaleString() || '0'}
                    </Text>
                    <Text as="span" className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded capitalize">
                        {property.type}
                    </Text>
                </div>
                
                <Text as="p" className="text-gray-600 text-sm mb-4 truncate">{property.address}</Text>
                
                {/* Property Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <ApperIcon name="Bed" size={16} className="mr-1" />
                        <Text as="span">{property.beds || 0} beds</Text>
                    </div>
                    <div className="flex items-center">
                        <ApperIcon name="Bath" size={16} className="mr-1" />
                        <Text as="span">{property.baths || 0} baths</Text>
                    </div>
                    {property.sqft && (
                        <div className="flex items-center">
                            <ApperIcon name="Square" size={16} className="mr-1" />
                            <Text as="span">{property.sqft.toLocaleString()} sqft</Text>
                        </div>
                    )}
                </div>
                
                {/* Features */}
                {property.features && property.features.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {property.features.slice(0, 3).map((feature, idx) => (
                                <Text as="span" key={idx} className="bg-surface-50 text-gray-600 text-xs px-2 py-1 rounded">
                                    {feature}
                                </Text>
                            ))}
                            {property.features.length > 3 && (
                                <Text as="span" className="bg-surface-50 text-gray-600 text-xs px-2 py-1 rounded">
                                    +{property.features.length - 3} more
                                </Text>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        <ApperIcon name="Heart" size={14} className="mr-1" />
                        <Text as="span">0 interested</Text>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                            <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                            <ApperIcon name="Share" size={16} />
                        </Button>
                        <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                            <ApperIcon name="MoreHorizontal" size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;