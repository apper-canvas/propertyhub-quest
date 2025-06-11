import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService } from '../services';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    return matchesPriority && matchesStatus;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Filters skeleton */}
          <div className="mb-6">
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Tasks skeleton */}
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 py-1">Priority:</span>
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedPriority === priority
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 py-1">Status:</span>
              {['all', 'pending', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap">
            <ApperIcon name="Plus" size={16} className="inline mr-2" />
            Add Task
          </button>
        </div>

        {/* Tasks List */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {selectedPriority !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or create a new task'
                : 'Create your first task to start organizing your work'
              }
            </p>
            <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
              <ApperIcon name="Plus" size={16} className="inline mr-2" />
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed'
                        ? 'bg-success border-success text-white'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <ApperIcon name="Check" size={12} />
                    )}
                  </button>
                  
                  {/* Priority Indicator */}
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${getPriorityColor(task.priority)}`}></div>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${
                          task.status === 'completed' 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className={`text-sm mt-1 ${
                            task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Due Date */}
                      <div className={`text-sm font-medium ${getDueDateColor(task.dueDate, task.status)}`}>
                        {formatDueDate(task.dueDate)}
                      </div>
                    </div>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="capitalize">Priority: {task.priority}</span>
                        {task.dealId && (
                          <span className="flex items-center">
                            <ApperIcon name="Handshake" size={12} className="mr-1" />
                            Deal linked
                          </span>
                        )}
                        {task.contactId && (
                          <span className="flex items-center">
                            <ApperIcon name="User" size={12} className="mr-1" />
                            Contact linked
                          </span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                          <ApperIcon name="Edit2" size={14} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-error transition-colors">
                          <ApperIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 p-4 bg-surface-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.priority === 'high' && t.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => {
                    const today = new Date().toDateString();
                    return new Date(t.dueDate).toDateString() === today && t.status === 'pending';
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Due Today</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;