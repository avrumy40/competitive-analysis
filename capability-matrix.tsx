import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Competitor } from "@shared/schema";
import type { CompetitorCapabilities } from "@/lib/types";

interface CapabilityMatrixProps {
  competitors: Competitor[];
}

export default function CapabilityMatrix({ competitors }: CapabilityMatrixProps) {
  const capabilities = [
    { key: 'analytics', name: 'Analytics', category: 'Core' },
    { key: 'financialPlanning', name: 'Financial Planning', category: 'Pre-Season' },
    { key: 'assortmentPlanning', name: 'Assortment Planning', category: 'Pre-Season' },
    { key: 'initialAllocations', name: 'Initial Allocations', category: 'Pre-Season' },
    { key: 'replenishment', name: 'Replenishment', category: 'In-Season' },
    { key: 'storeTransfers', name: 'Store Transfers', category: 'In-Season' },
    { key: 'pricing', name: 'Pricing + Promotions', category: 'In-Season' },
    { key: 'markdownOptimization', name: 'Markdown Optimization', category: 'In-Season' },
    { key: 'aiSpecialEvents', name: 'AI Special Events', category: 'Onebeat Exclusive' },
    { key: 'proactiveInsights', name: 'Proactive Insights', category: 'Onebeat Exclusive' },
    { key: 'dynamicInventoryTargets', name: 'Dynamic Inventory Targets', category: 'Onebeat Exclusive' },
  ];

  // Add Onebeat as reference competitor
  const onebeatCapabilities: CompetitorCapabilities = {
    analytics: true,
    financialPlanning: true,
    assortmentPlanning: true,
    initialAllocations: true,
    replenishment: true,
    storeTransfers: true,
    pricing: true,
    markdownOptimization: true,
    aiSpecialEvents: true,
    proactiveInsights: true,
    dynamicInventoryTargets: true,
  };

  const onebeatCompetitor: Competitor = {
    id: 0,
    name: "Onebeat",
    category: "reference",
    location: "Global",
    employees: null,
    funding: null,
    revenue: null,
    description: "Real-time inventory optimization platform",
    similarity: 10,
    strengths: null,
    weaknesses: null,
    killPoints: null,
    landmineQuestions: null,
    capabilities: onebeatCapabilities,
    pricing: null,
    targetMarket: null,
    implementationTime: null,
    uniqueFeatures: null,
  };

  const allCompetitors = [onebeatCompetitor, ...competitors.slice(0, 5)];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core': return 'bg-teal-100 text-teal-800';
      case 'Pre-Season': return 'bg-purple-100 text-purple-800';
      case 'In-Season': return 'bg-orange-100 text-orange-800';
      case 'Onebeat Exclusive': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasCapability = (competitor: Competitor, capabilityKey: string): boolean => {
    if (!competitor.capabilities) return false;
    const caps = competitor.capabilities as CompetitorCapabilities;
    return caps[capabilityKey as keyof CompetitorCapabilities] || false;
  };

  const isOnebeatExclusive = (capabilityKey: string): boolean => {
    return ['aiSpecialEvents', 'proactiveInsights', 'dynamicInventoryTargets'].includes(capabilityKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 overflow-x-auto border border-gray-200 shadow-sm"
    >
      <div className="min-w-[800px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-gray-900 font-semibold py-4 px-4">Feature</th>
              {allCompetitors.map((competitor) => (
                <th key={competitor.id} className="text-center text-gray-900 font-semibold py-4 px-4 min-w-[120px]">
                  <div className="flex flex-col items-center">
                    <span className={competitor.name === 'Onebeat' ? 'text-onebeat-coral font-bold' : ''}>
                      {competitor.name}
                    </span>
                    {competitor.name === 'Onebeat' && (
                      <Badge className="mt-1 bg-orange-100 text-orange-800 text-xs">
                        Reference
                      </Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {capabilities.map((capability, index) => (
              <motion.tr
                key={capability.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`
                  border-b border-gray-100 
                  ${isOnebeatExclusive(capability.key) ? 'bg-yellow-50' : ''}
                `}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <span className={isOnebeatExclusive(capability.key) ? 'font-semibold text-gray-900' : 'text-gray-900'}>
                      {capability.name}
                    </span>
                    <Badge className={getCategoryColor(capability.category)}>
                      {capability.category}
                    </Badge>
                  </div>
                </td>
                {allCompetitors.map((competitor) => {
                  const hasFeature = hasCapability(competitor, capability.key);
                  const isExclusive = isOnebeatExclusive(capability.key) && competitor.name === 'Onebeat';
                  
                  return (
                    <td key={competitor.id} className="text-center py-4 px-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          capability-cell inline-flex items-center justify-center w-8 h-8 rounded-full
                          ${hasFeature 
                            ? (isExclusive ? 'bg-orange-100 border-2 border-orange-300' : 'bg-teal-100 border-2 border-teal-300') 
                            : 'bg-red-100 border-2 border-red-300'
                          }
                        `}
                      >
                        {hasFeature ? (
                          <Check className={`w-5 h-5 ${isExclusive ? 'text-orange-700' : 'text-teal-700'}`} />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </motion.div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center border border-orange-300">
              <Check className="w-3 h-3 text-orange-700" />
            </div>
            <span className="text-gray-700 text-sm">Onebeat Exclusive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-teal-100 rounded-full flex items-center justify-center border border-teal-300">
              <Check className="w-3 h-3 text-teal-700" />
            </div>
            <span className="text-gray-700 text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center border border-red-300">
              <X className="w-3 h-3 text-red-600" />
            </div>
            <span className="text-gray-700 text-sm">Not Available</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
