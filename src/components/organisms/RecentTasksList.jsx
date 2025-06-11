import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';

const RecentTasksList = ({ tasks }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-error';
            case 'medium': return 'bg-warning';
            case 'low': return 'bg-success';
            default: return 'bg-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
            <div className="flex items-center justify-between mb-6">
                <Text as="h3" className="text-lg font-semibold text-gray-900">Upcoming Tasks</Text>
                <ApperIcon name="Clock" size={20} className="text-gray-400" />
            </div>
            
            {tasks.length === 0 ? (
                <EmptyState
                    icon="CheckSquare"
                    title=""
                    message="No tasks scheduled"
                />
            ) : (
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className={`w-3 h-3 rounded-full mr-4 ${
                                getPriorityColor(task.priority)
                            }`}></div>
                            <div className="flex-1 min-w-0">
                                <Text as="h4" className="font-medium text-gray-900 truncate">{task.title}</Text>
                                <Text as="p" className="text-sm text-gray-500">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </Text>
                            </div>
                            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default RecentTasksList;