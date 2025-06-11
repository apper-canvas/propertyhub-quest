import React from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const FilterButton = ({ label, onClick, isActive, className = '' }) => {
    return (
        <Button
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${className}`}
        >
            <Text as="span">{label}</Text>
        </Button>
    );
};

export default FilterButton;