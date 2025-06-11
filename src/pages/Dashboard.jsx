import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { dealService, taskService, contactService, propertyService } from '../services';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    activeDeals: 0,
    totalValue: 0,
    tasksToday: 0,
    newContacts: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deals, tasks, contacts, properties] = await Promise.all([
        dealService.getAll(),
        taskService.getAll(),
        contactService.getAll(),
        propertyService.getAll()
      ]);

      // Calculate metrics
      const activeDeals = deals.filter(deal => deal.stage !== 'closed');
      const totalValue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const today = new Date().toDateString();
      const tasksToday = tasks.filter(task => 
        new Date(task.dueDate).toDateString() === today && task.status !== 'completed'
      );
      const recentContacts = contacts.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return contactDate >= weekAgo;
      });

      setMetrics({
        activeDeals: activeDeals.length,
        totalValue,
        tasksToday: tasksToday.length,
        newContacts: recentContacts.length
      });

      setRecentTasks(tasks
        .filter(task => task.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
      );

      setRecentDeals(deals
        .filter(deal => deal.stage !== 'closed')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      );

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          
          {/* Skeleton content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded"></div>
                  ))}
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
        <div className="max-w-7xl mx-auto text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
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
      <div className="max-w-7xl mx-auto">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Deals"
            value={metrics.activeDeals}
            icon="Handshake"
            color="bg-primary"
            subtitle="In pipeline"
          />
          <MetricCard
            title="Total Value"
            value={`$${metrics.totalValue.toLocaleString()}`}
            icon="DollarSign"
            color="bg-success"
            subtitle="Active deals"
          />
          <MetricCard
            title="Tasks Today"
            value={metrics.tasksToday}
            icon="CheckSquare"
            color="bg-warning"
            subtitle="Due today"
          />
          <MetricCard
            title="New Contacts"
            value={metrics.newContacts}
            icon="UserPlus"
            color="bg-info"
            subtitle="This week"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <ApperIcon name="Clock" size={20} className="text-gray-400" />
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tasks scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full mr-4 ${
                      task.priority === 'high' ? 'bg-error' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Deals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Deals</h3>
              <ApperIcon name="TrendingUp" size={20} className="text-gray-400" />
            </div>
            
            {recentDeals.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Handshake" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No active deals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {deal.contactName || 'Unknown Contact'}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {deal.propertyAddress || 'No property'}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          deal.stage === 'lead' ? 'bg-blue-100 text-blue-800' :
                          deal.stage === 'showing' ? 'bg-yellow-100 text-yellow-800' :
                          deal.stage === 'offer' ? 'bg-orange-100 text-orange-800' :
                          deal.stage === 'contract' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {deal.stage}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ${deal.value?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;