import React from 'react';
import PropertyCard from '@/components/molecules/PropertyCard';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PropertyListings = ({ properties, searchTerm, onAddPropertyClick, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
                        <div className="p-6">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {properties.length === 0 ? (
                <EmptyState
                    icon="Home"
                    title={searchTerm ? 'No properties found' : 'No properties yet'}
                    message={searchTerm
                        ? 'Try adjusting your search terms or filters'
                        : 'Add your first property to start building your listings'
                    }
                >
                    {!searchTerm && (
                        <Button
                            onClick={onAddPropertyClick}
                            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            <ApperIcon name="Plus" size={16} className="inline mr-2" />
                            Add Property
                        </Button>
                    )}
                </EmptyState>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property, index) => (
                        <PropertyCard key={property.id} property={property} index={index} />
                    ))}
                </div>
            )}
        </>
    );
};

export default PropertyListings;