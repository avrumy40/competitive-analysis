import { motion } from "framer-motion";
import { MapPin, Users, DollarSign, Target, Plus, Minus, ChevronDown, ChevronUp, Edit, Trash2, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import type { Competitor } from "@shared/schema";

interface BattleCardProps {
  competitor: Competitor;
  onEdit?: (competitor: Competitor) => void;
  onDelete?: (id: number) => void;
}

export default function BattleCard({ competitor, onEdit, onDelete }: BattleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const openNews = (companyName: string) => {
    const searchQuery = `"${companyName}"`;
    const googleNewsUrl = `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    window.open(googleNewsUrl, '_blank');
  };

  const getSimilarityColor = (similarity: number) => {
    return "text-gray-900";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "direct": return "bg-red-100 text-red-800";
      case "global": return "bg-teal-100 text-teal-800";
      case "enterprise": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl hover-lift battle-card border border-gray-200 shadow-sm"
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="relative">
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openNews(competitor.name);
              }}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              title={`View ${competitor.name} news`}
            >
              <Newspaper className="w-4 h-4 text-gray-600" />
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(competitor);
                }}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(competitor.id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </Button>
            )}
          </div>

          <CollapsibleTrigger className="w-full p-6 text-left hover:bg-gray-50 transition-colors rounded-t-2xl">
            <div className="flex items-start justify-between pr-20">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{competitor.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {competitor.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {competitor.location}
                    </span>
                  )}
                  {competitor.employees && (
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      ~{competitor.employees > 1000 ? `${Math.round(competitor.employees/1000)}k` : competitor.employees} FTE
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Badge className={`${getCategoryColor(competitor.category)} mb-2`}>
                    {competitor.category.charAt(0).toUpperCase() + competitor.category.slice(1)}
                  </Badge>
                  <div className={`text-sm ${getSimilarityColor(competitor.similarity)}`}>
                    Similarity: {competitor.similarity}/10
                  </div>
                </div>
                
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="px-6 pb-6">
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Facts</h4>
              <p className="text-gray-700">{competitor.description}</p>
            </div>

            {/* Funding & Revenue */}
            {(competitor.funding || competitor.revenue) && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="text-onebeat-coral w-5 h-5 mr-2" />
                  Financial Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competitor.funding && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm">Funding</div>
                      <div className="text-gray-900 font-semibold">{competitor.funding}</div>
                    </div>
                  )}
                  {competitor.revenue && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-gray-600 text-sm">Revenue</div>
                      <div className="text-gray-900 font-semibold">{competitor.revenue}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Strengths */}
            {competitor.strengths && competitor.strengths.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Plus className="text-onebeat-teal w-5 h-5 mr-2" />
                  Key Strengths
                </h4>
                <div className="space-y-2">
                  {competitor.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-onebeat-teal rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {competitor.weaknesses && competitor.weaknesses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Minus className="text-red-500 w-5 h-5 mr-2" />
                  Weaknesses & Kill Points
                </h4>
                <div className="space-y-2">
                  {competitor.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kill Points */}
            {competitor.killPoints && competitor.killPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="text-onebeat-coral w-5 h-5 mr-2" />
                  Competitive Kill Points
                </h4>
                <div className="space-y-2">
                  {competitor.killPoints.map((killPoint, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-onebeat-coral rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{killPoint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unique Features */}
            {competitor.uniqueFeatures && competitor.uniqueFeatures.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="text-onebeat-purple w-5 h-5 mr-2" />
                  Unique Features
                </h4>
                <div className="space-y-2">
                  {competitor.uniqueFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-onebeat-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}