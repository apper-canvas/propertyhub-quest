import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return 'bg-error';
        case 'medium': return 'bg-warning';
        case 'low': return 'bg-success';
        default: return 'bg-gray-400';
    }
};

const getDueDateColor = (dueDate, status) => {
    if (status === 'completed') return 'text-gray-500';
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-error';
    if (diffDays === 0) return 'text-warning';
    if (diffDays <= 2) return 'text-orange-600';
    return 'text-gray-600';
};

const formatDueDate = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return due.toLocaleDateString();
};

const TaskItem = ({ task, onToggleStatus, index }) => {
    const isCompleted = task.status === 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
                isCompleted ? 'opacity-75' : ''
            }`}
        >
            <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <Button
                    onClick={() => onToggleStatus(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                            ? 'bg-success border-success text-white'
                            : 'border-gray-300 hover:border-primary'
                    }`}
                >
                    {isCompleted && (
                        <ApperIcon name="Check" size={12} />
                    )}
                </Button>
                
                {/* Priority Indicator */}
                <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${getPriorityColor(task.priority)}`}></div>
                
                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <Text as="h4" className={`font-medium ${
                                isCompleted
                                    ? 'text-gray-500 line-through'
                                    : 'text-gray-900'
                            }`}>
                                {task.title}
                            </Text>
                            {task.description && (
                                <Text as="p" className={`text-sm mt-1 ${
                                    isCompleted ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {task.description}
                                </Text>
                            )}
                        </div>
                        
                        {/* Due Date */}
                        <Text as="div" className={`text-sm font-medium ${getDueDateColor(task.dueDate, task.status)}`}>
                            {formatDueDate(task.dueDate)}
                        </Text>
                    </div>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <Text as="span" className="capitalize">Priority: {task.priority}</Text>
                            {task.dealId && (
                                <Text as="span" className="flex items-center">
                                    <ApperIcon name="Handshake" size={12} className="mr-1" />
                                    Deal linked
                                </Text>
                            )}
                            {task.contactId && (
                                <Text as="span" className="flex items-center">
                                    <ApperIcon name="User" size={12} className="mr-1" />
                                    Contact linked
                                </Text>
                            )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            <Button className="p-1 text-gray-400 hover:text-primary transition-colors">
                                <ApperIcon name="Edit2" size={14} />
                            </Button>
                            <Button className="p-1 text-gray-400 hover:text-error transition-colors">
                                <ApperIcon name="Trash2" size={14} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskItem;