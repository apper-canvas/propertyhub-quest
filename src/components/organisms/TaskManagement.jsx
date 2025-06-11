import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FilterButton from '@/components/molecules/FilterButton';
import EmptyState from '@/components/molecules/EmptyState';
import Text from '@/components/atoms/Text';
const TaskManagement = ({ 
  tasks, 
  selectedPriority, 
  setSelectedPriority,
selectedStatus, 
  setSelectedStatus, 
  onToggleTaskStatus, 
  onAddTaskClick,
  onTaskUpdate,
  onTaskDelete,
  loading 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const TaskItem = ({ task, onToggleStatus, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-lg p-4 shadow-sm border group hover:shadow-md transition-shadow ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          
          {/* Action buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onTaskUpdate && onTaskUpdate(task)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit task"
            >
              <ApperIcon name="Edit2" size={14} />
            </button>
            <button
              onClick={() => handleDeleteClick(task)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete task"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
          
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`p-2 rounded-full transition-colors ${
              task.status === 'completed'
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            <ApperIcon 
              name={task.status === 'completed' ? 'CheckCircle2' : 'Circle'} 
              size={20} 
            />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="Calendar" size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          {task.category && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Tag" size={14} />
              <span>{task.category}</span>
            </div>
          )}
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          task.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {task.status}
        </div>
      </div>
    </motion.div>
  );

  const handleDeleteClick = (task) => {
    setShowDeleteConfirm(task);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    
    setDeleting(true);
    try {
      await onTaskDelete(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setDeleting(false);
    }
  };

const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const sortedTasks = tasks?.sort((a, b) => {
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
  }) || [];

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
      {tasks?.length > 0 && (
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                  <p className="text-gray-600">Are you sure you want to delete this task?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="font-medium text-gray-900">{showDeleteConfirm.title}</p>
                {showDeleteConfirm.description && (
                  <p className="text-sm text-gray-600 mt-1">{showDeleteConfirm.description}</p>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The task will be permanently removed.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskManagement;