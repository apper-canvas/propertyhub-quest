import React from 'react';

const Button = ({ onClick, children, className = '', type = 'button', disabled = false, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;