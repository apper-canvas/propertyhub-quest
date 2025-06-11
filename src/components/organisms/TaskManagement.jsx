import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import FilterButton from '@/components/molecules/FilterButton';
import TaskItem from '@/components/molecules/TaskItem';
import EmptyState from '@/components/molecules/EmptyState';

const TaskManagement = ({
    tasks,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    onToggleTaskStatus,
    onAddTaskClick,
    loading
}) => {
    const sortedTasks = tasks.sort((a, b) => {
        // Sort by status (pending first), then by due date, then by priority
        if (a.status !== b.status) {
            return a.status === 'completed' ? 1 : -1;
        }
        
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
        }
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
                        <div className="flex items-center">
                            <div className="w-5 h-5 bg-gray-200 rounded mr-4"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {/* Filters and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-2">
                        <Text as="span" className="text-sm font-medium text-gray-700 py-1">Priority:</Text>
                        {['all', 'high', 'medium', 'low'].map((priority) => (
                            <FilterButton
                                key={priority}
                                label={priority.charAt(0).toUpperCase() + priority.slice(1)}
                                onClick={() => setSelectedPriority(priority)}
                                isActive={selectedPriority === priority}
                            />
                        ))}
                    </div>
                    
                    <div className="flex gap-2">
                        <Text as="span" className="text-sm font-medium text-gray-700 py-1">Status:</Text>
                        {['all', 'pending', 'completed'].map((status) => (
                            <FilterButton
                                key={status}
                                label={status.charAt(0).toUpperCase() + status.slice(1)}
                                onClick={() => setSelectedStatus(status)}
                                isActive={selectedStatus === status}
                            />
                        ))}
                    </div>
                </div>
                
                <Button
                    onClick={onAddTaskClick}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap"
                >
                    <ApperIcon name="Plus" size={16} className="inline mr-2" />
                    Add Task
                </Button>
            </div>

            {/* Tasks List */}
            {sortedTasks.length === 0 ? (
                <EmptyState
                    icon="CheckSquare"
                    title="No tasks found"
                    message={selectedPriority !== 'all' || selectedStatus !== 'all'
                        ? 'Try adjusting your filters or create a new task'
                        : 'Create your first task to start organizing your work'
                    }
                >
                    <Button
                        onClick={onAddTaskClick}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        <ApperIcon name="Plus" size={16} className="inline mr-2" />
                        Add Task
                    </Button>
                </EmptyState>
            ) : (
                <div className="space-y-4">
                    {sortedTasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleStatus={onToggleTaskStatus}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Stats */}
            {tasks.length > 0 && (
                <div className="mt-8 p-4 bg-surface-50 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <Text as="p" className="text-2xl font-bold text-gray-900">
                                {tasks.filter(t => t.status === 'pending').length}
                            </Text>
                            <Text as="p" className="text-sm text-gray-600">Pending</Text>
                        </div>
                        <div>
                            <Text as="p" className="text-2xl font-bold text-gray-900">
                                {tasks.filter(t => t.status === 'completed').length}
                            </Text>
                            <Text as="p" className="text-sm text-gray-600">Completed</Text>
                        </div>
                        <div>
                            <Text as="p" className="text-2xl font-bold text-gray-900">
                                {tasks.filter(t => t.priority === 'high' && t.status === 'pending').length}
                            </Text>
                            <Text as="p" className="text-sm text-gray-600">High Priority</Text>
                        </div>
                        <div>
                            <Text as="p" className="text-2xl font-bold text-gray-900">
                                {tasks.filter(t => {
                                    const today = new Date().toDateString();
                                    return new Date(t.dueDate).toDateString() === today && t.status === 'pending';
                                }).length}
                            </Text>
                            <Text as="p" className="text-sm text-gray-600">Due Today</Text>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskManagement;