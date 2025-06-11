import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { dealService } from '@/services';

const DealPipelineBoard = ({ deals, onDealsUpdate, onDealUpdate, onDealDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-100 text-blue-800' },
    { id: 'qualified', name: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-100 text-purple-800' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
    { id: 'closed', name: 'Closed', color: 'bg-green-100 text-green-800' }
  ];

  const handleDeleteClick = (deal) => {
    setShowDeleteConfirm(deal);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    
    setDeleting(true);
    try {
      await onDealDelete(showDeleteConfirm.id);
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

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealService.update(draggedDeal.id, { stage: targetStage });
      const updatedDeals = deals.map(deal => 
        deal.id === draggedDeal.id ? updatedDeal : deal
      );
      onDealsUpdate(updatedDeals);
      toast.success(`Deal moved to ${stages.find(s => s.id === targetStage)?.name}`);
    } catch (err) {
      toast.error('Failed to update deal stage');
    } finally {
      setDraggedDeal(null);
    }
  };

  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getTotalValue = (stageId) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const totalValue = getTotalValue(stage.id);

          return (
            <div
              key={stage.id}
              className="bg-gray-50 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {formatValue(totalValue)}
                </p>
              </div>

              <div className="space-y-3">
                {stageDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className="bg-white rounded-lg p-4 shadow-sm border cursor-move hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {deal.title}
                      </h4>
                      
                      {/* Action buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button
                          onClick={() => onDealUpdate && onDealUpdate(deal)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit deal"
                        >
                          <ApperIcon name="Edit2" size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deal)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete deal"
                        >
                          <ApperIcon name="Trash2" size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="text-lg font-semibold text-primary mb-2">
                      {formatValue(deal.value || 0)}
                    </p>

                    {deal.client && (
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <ApperIcon name="User" size={12} className="mr-1" />
                        <span className="truncate">{deal.client}</span>
                      </div>
                    )}

                    {deal.property && (
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <ApperIcon name="MapPin" size={12} className="mr-1" />
                        <span className="truncate">{deal.property}</span>
                      </div>
                    )}

                    {deal.expectedCloseDate && (
                      <div className="flex items-center text-xs text-gray-600">
                        <ApperIcon name="Calendar" size={12} className="mr-1" />
                        <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {deal.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {deal.description}
                      </p>
                    )}
                  </motion.div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="Plus" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop deals here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Deal</h3>
                  <p className="text-gray-600">Are you sure you want to delete this deal?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="font-medium text-gray-900">{showDeleteConfirm.title}</p>
                <p className="text-sm text-gray-600">{formatValue(showDeleteConfirm.value || 0)}</p>
                {showDeleteConfirm.client && (
                  <p className="text-sm text-gray-600">Client: {showDeleteConfirm.client}</p>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The deal will be permanently removed from your pipeline.
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

export default DealPipelineBoard;