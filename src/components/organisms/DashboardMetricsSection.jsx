import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardMetricsSection = ({ metrics, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
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
    );
};

export default DashboardMetricsSection;