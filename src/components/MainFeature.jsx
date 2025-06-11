import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { contactService, propertyService, dealService } from '../services';

const DealPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-100 border-blue-300' },
    { id: 'showing', name: 'Showing', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'offer', name: 'Offer', color: 'bg-orange-100 border-orange-300' },
    { id: 'contract', name: 'Contract', color: 'bg-purple-100 border-purple-300' },
    { id: 'closed', name: 'Closed', color: 'bg-green-100 border-green-300' }
  ];

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dealService.getAll();
      setDeals(result);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealService.update(draggedDeal.id, { stage: newStage });
      setDeals(deals.map(deal => 
        deal.id === draggedDeal.id ? updatedDeal : deal
      ));
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`);
    } catch (err) {
      toast.error('Failed to update deal');
    } finally {
      setDraggedDeal(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="bg-white rounded-lg p-4">
            <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load pipeline</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadDeals}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Handshake" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
        <p className="text-gray-500 mb-4">Start by creating your first deal to track progress through the pipeline</p>
        <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
          <ApperIcon name="Plus" size={16} className="inline mr-2" />
          Create Deal
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stages.map((stage) => {
        const stageDeals = deals.filter(deal => deal.stage === stage.id);
        
        return (
          <div
            key={stage.id}
            className={`bg-white rounded-lg p-4 border-2 border-dashed ${stage.color} min-h-96`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {stageDeals.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {stageDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  draggable
                  onDragStart={() => handleDragStart(deal)}
                  className="bg-white p-4 rounded-lg shadow-sm border cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {deal.contactName || 'Unknown Contact'}
                    </h4>
                    <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 truncate">
                    {deal.propertyAddress || 'No property'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      ${deal.value?.toLocaleString() || '0'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {deal.commission ? `$${deal.commission.toLocaleString()} comm` : ''}
                    </span>
                  </div>
                  
                  {deal.notes && (
                    <p className="text-xs text-gray-500 mt-2 truncate">{deal.notes}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealPipeline;