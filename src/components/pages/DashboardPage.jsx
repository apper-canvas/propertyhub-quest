import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import DashboardMetricsSection from '@/components/organisms/DashboardMetricsSection';
import RecentTasksList from '@/components/organisms/RecentTasksList';
import ActiveDealsList from '@/components/organisms/ActiveDealsList';
import { dealService, taskService, contactService, propertyService } from '@/services';

const DashboardPage = () => {
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

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon="AlertCircle"
            title="Failed to load dashboard"
            message={error}
          >
            <Button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </Button>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Metrics Grid */}
        <DashboardMetricsSection metrics={metrics} loading={loading} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Tasks */}
          <RecentTasksList tasks={recentTasks} />

          {/* Recent Deals */}
          <ActiveDealsList deals={recentDeals} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;