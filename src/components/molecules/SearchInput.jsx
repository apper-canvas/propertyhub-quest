import React from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchInput = ({ placeholder, value, onChange, className = '', ...props }) => {
    return (
        <div className={`flex-1 relative ${className}`}>
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-10 pr-4 py-2"
                {...props}
            />
        </div>
    );
};

export default SearchInput;