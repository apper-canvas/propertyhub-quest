import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TypeDropdownFilter = ({ selectedType, onTypeChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const types = [
    { key: 'all', label: 'All Types', icon: 'Grid3X3' },
    { key: 'house', label: 'House', icon: 'Home' },
    { key: 'condo', label: 'Condo', icon: 'Building2' },
    { key: 'townhouse', label: 'Townhouse', icon: 'Building' },
    { key: 'land', label: 'Land', icon: 'TreePine' }
  ];

  const selectedTypeData = types.find(type => type.key === selectedType) || types[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTypeSelect = (typeKey) => {
    onTypeChange(typeKey);
    setIsOpen(false);
  };

  const handleKeyDown = (event, typeKey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTypeSelect(typeKey);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-700">Property Type</span>
      </div>
      
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select property type"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-5 h-5 text-primary">
            <ApperIcon name={selectedTypeData.icon} size={20} />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {selectedTypeData.label}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-4 h-4 text-gray-400"
        >
          <ApperIcon name="ChevronDown" size={16} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            role="listbox"
            aria-label="Property type options"
          >
            {types.map((type, index) => {
              const isSelected = type.key === selectedType;
              
              return (
                <motion.button
                  key={type.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleTypeSelect(type.key)}
                  onKeyDown={(e) => handleKeyDown(e, type.key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-surface-50 transition-colors ${
                    isSelected ? 'bg-primary/5 border-r-2 border-r-primary' : ''
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                >
                  <div className={`flex-shrink-0 w-5 h-5 ${
                    isSelected ? 'text-primary' : 'text-gray-400'
                  }`}>
                    <ApperIcon name={type.icon} size={20} />
                  </div>
                  
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </span>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto w-4 h-4 text-primary"
                    >
                      <ApperIcon name="Check" size={16} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segmented Control Alternative (Hidden by default, can be toggled) */}
      <div className="hidden mt-4 p-1 bg-surface-100 rounded-lg">
        <div className="grid grid-cols-5 gap-1">
          {types.map((type) => {
            const isSelected = type.key === selectedType;
            
            return (
              <button
                key={type.key}
                onClick={() => onTypeChange(type.key)}
                className={`relative px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                  isSelected
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex flex-col items-center space-y-1">
                  <ApperIcon name={type.icon} size={16} />
                  <span className="hidden sm:block">{type.label}</span>
                </div>
                
                {isSelected && (
                  <motion.div
                    layoutId="segmented-indicator"
                    className="absolute inset-0 bg-white rounded-md shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TypeDropdownFilter;