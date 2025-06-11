import React from 'react';
import { motion } from 'framer-motion';

const StatusToggleFilter = ({ selectedStatuses, onStatusToggle, className = '' }) => {
  const statuses = [
    { key: 'active', label: 'Active', color: 'bg-success' },
    { key: 'pending', label: 'Pending', color: 'bg-warning' },
    { key: 'sold', label: 'Sold', color: 'bg-primary' },
    { key: 'withdrawn', label: 'Withdrawn', color: 'bg-error' }
  ];

  const isAllSelected = selectedStatuses.includes('all');
  
  const handleAllToggle = () => {
    if (isAllSelected) {
      onStatusToggle([]);
    } else {
      onStatusToggle(['all']);
    }
  };

  const handleStatusToggle = (status) => {
    if (isAllSelected) {
      // If "All" was selected, switch to individual selection
      onStatusToggle([status]);
    } else {
      const newSelected = selectedStatuses.includes(status)
        ? selectedStatuses.filter(s => s !== status)
        : [...selectedStatuses.filter(s => s !== 'all'), status];
      
      // If no individual statuses selected, default to "All"
      if (newSelected.length === 0) {
        onStatusToggle(['all']);
      } else {
        onStatusToggle(newSelected);
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Status Filters</span>
        <button
          onClick={handleAllToggle}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          {isAllSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>
      
      <div className="space-y-2">
        {/* All Status Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors">
          <span className="text-sm font-medium text-gray-700">All Statuses</span>
          <button
            onClick={handleAllToggle}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            style={{
              backgroundColor: isAllSelected ? '#2C5530' : '#e2e8f0'
            }}
            role="switch"
            aria-checked={isAllSelected}
            aria-label="Toggle all statuses"
          >
            <motion.span
              animate={{
                x: isAllSelected ? 16 : 2
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
            />
          </button>
        </div>

        {/* Individual Status Toggles */}
        {statuses.map((status) => {
          const isSelected = !isAllSelected && selectedStatuses.includes(status.key);
          
          return (
            <motion.div
              key={status.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                isAllSelected 
                  ? 'bg-gray-50 opacity-50' 
                  : 'bg-surface-50 hover:bg-surface-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                <span className="text-sm font-medium text-gray-700">{status.label}</span>
              </div>
              
              <button
                onClick={() => handleStatusToggle(status.key)}
                disabled={isAllSelected}
                className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSelected ? '#2C5530' : '#e2e8f0'
                }}
                role="switch"
                aria-checked={isSelected}
                aria-label={`Toggle ${status.label} status`}
              >
                <motion.span
                  animate={{
                    x: isSelected ? 16 : 2
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                  className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusToggleFilter;