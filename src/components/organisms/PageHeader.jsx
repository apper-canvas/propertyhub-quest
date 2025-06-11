import React from 'react';
import Text from '@/components/atoms/Text';

const PageHeader = ({ title, description, children }) => {
    return (
        <div className="mb-6">
            {title && (
                <Text as="h1" className="text-3xl font-heading font-bold text-gray-900 mb-2">
                    {title}
                </Text>
            )}
            {description && (
                <Text as="p" className="text-gray-600">
                    {description}
                </Text>
            )}
            {children}
        </div>
    );
};

export default PageHeader;