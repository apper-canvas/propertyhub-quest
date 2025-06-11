import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import DealCard from '@/components/molecules/DealCard';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { dealService } from '@/services'; // Only import necessary services directly

const DealPipelineBoard = () => {
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
                {stages.map((stage) => (
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
            <EmptyState
                icon="AlertCircle"
                title="Failed to load pipeline"
                message={error}
            >
                <Button
                    onClick={loadDeals}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </Button>
            </EmptyState>
        );
    }

    if (deals.length === 0) {
        return (
            <EmptyState
                icon="Handshake"
                title="No deals yet"
                message="Start by creating your first deal to track progress through the pipeline"
            >
                <Button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                    <ApperIcon name="Plus" size={16} className="inline mr-2" />
                    Create Deal
                </Button>
            </EmptyState>
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
                            <Text as="h3" className="font-semibold text-gray-900">{stage.name}</Text>
                            <Text as="span" className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {stageDeals.length}
                            </Text>
                        </div>
                        
                        <div className="space-y-3">
                            {stageDeals.map((deal, index) => (
                                <DealCard
                                    key={deal.id}
                                    deal={deal}
                                    onDragStart={() => handleDragStart(deal)}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DealPipelineBoard;