import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Competitor } from "@shared/schema";
import type { ChartDataPoint } from "@/lib/types";

interface PositioningChartProps {
  competitors: Competitor[];
}

export default function PositioningChart({ competitors }: PositioningChartProps) {
  // Create chart data points based on ease of implementation & fast ROI (x) vs automation & auto execution (y)
  const chartData: ChartDataPoint[] = [
    { name: "Onebeat", x: 85, y: 85, category: "reference", similarity: 10 },
    { name: "Oracle", x: 15, y: 85, category: "enterprise", similarity: 4 },
    { name: "Blue Yonder", x: 25, y: 75, category: "enterprise", similarity: 6 },
    { name: "Nextail", x: 45, y: 80, category: "global", similarity: 9 },
    { name: "Toolsgroup", x: 55, y: 75, category: "direct", similarity: 8 },
    { name: "Foresight Retail", x: 60, y: 65, category: "direct", similarity: 7 },
    { name: "INCREFF", x: 65, y: 55, category: "enterprise", similarity: 6 },
    { name: "Impact Analytics", x: 70, y: 60, category: "enterprise", similarity: 7 },
    { name: "MTS Retail", x: 50, y: 45, category: "direct", similarity: 5 },
    { name: "Analyticalways", x: 75, y: 35, category: "niche", similarity: 4 },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "reference": return "bg-onebeat-coral border-2 border-white shadow-lg";
      case "direct": return "bg-red-500 border-2 border-white shadow-lg";
      case "global": return "bg-onebeat-teal border-2 border-white shadow-lg";
      case "enterprise": return "bg-onebeat-purple border-2 border-white shadow-lg";
      case "niche": return "bg-orange-500 border-2 border-white shadow-lg";
      default: return "bg-gray-500 border-2 border-white shadow-lg";
    }
  };

  const getPointSize = (similarity: number) => {
    if (similarity >= 9) return "w-6 h-6";
    if (similarity >= 7) return "w-5 h-5";
    return "w-4 h-4";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Implementation Speed vs Automation Level</h3>
      
      {/* Chart Container */}
      <div className="relative h-96 bg-gray-50 rounded-xl p-6 overflow-hidden border border-gray-200">
        {/* Background Grid */}
        <div className="absolute inset-6 opacity-30">
          <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Axis Lines */}
        <div className="absolute inset-6 border-l-2 border-b-2 border-gray-400"></div>
        <div className="absolute left-1/2 top-6 bottom-6 w-0.5 bg-gray-400"></div>
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-400"></div>
        
        {/* Axis Labels */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-700 text-sm font-medium">
          Fast & Easy Implementation →
        </div>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-700 text-sm font-medium whitespace-nowrap">
          ← Auto Execution
        </div>
        
        {/* Corner Labels */}
        <div className="absolute top-6 left-6 bg-red-100 text-red-800 text-xs font-medium px-3 py-2 rounded-lg shadow-sm border">
          Expensive,<br />Complex Solutions
        </div>
        <div className="absolute top-6 right-6 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg shadow-sm border text-center">
          Generating Bottom<br />Line Results
        </div>
        <div className="absolute bottom-16 left-6 text-gray-600 text-xs font-medium">
          Hard and Long<br />Implementation
        </div>
        <div className="absolute bottom-16 right-6 bg-red-100 text-red-800 text-xs font-medium px-3 py-2 rounded-lg shadow-sm border text-center">
          Inexpensive,<br />Naive Solutions
        </div>
        
        {/* Data Points */}
        {chartData.map((point, index) => (
          <motion.div
            key={point.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${6 + (point.x / 100) * (100 - 12)}%`,
              top: `${94 - (point.y / 100) * (100 - 12)}%`,
            }}
          >
            <div className="relative group">
              {/* Point */}
              <div 
                className={`
                  ${getPointSize(point.similarity)} 
                  ${getCategoryColor(point.category)}
                  rounded-full
                  ${point.name === 'Onebeat' ? 'animate-glow ring-2 ring-onebeat-coral/50' : ''}
                  cursor-pointer transition-all duration-200 hover:scale-125
                `}
              />
              
              {/* Label */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Badge className="bg-white text-gray-900 text-xs whitespace-nowrap border border-gray-300 shadow-md">
                  {point.name}
                </Badge>
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <div className="bg-white rounded-lg p-3 text-gray-900 text-xs whitespace-nowrap border border-gray-300 shadow-lg">
                  <div className="font-semibold">{point.name}</div>
                  <div className="text-gray-600">Similarity: {point.similarity}/10</div>
                  <div className="text-gray-600">Implementation: {point.x}/100</div>
                  <div className="text-gray-600">Automation: {point.y}/100</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-onebeat-coral rounded-full"></div>
          <span className="text-gray-700 text-sm">Onebeat (Reference)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-700 text-sm">Direct Competitors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-onebeat-teal rounded-full"></div>
          <span className="text-gray-700 text-sm">Global Players</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-onebeat-purple rounded-full"></div>
          <span className="text-gray-700 text-sm">Enterprise Solutions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-700 text-sm">Niche Solutions</span>
        </div>
      </div>
    </motion.div>
  );
}
