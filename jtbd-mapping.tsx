import { motion } from "framer-motion";
import { Calendar, FolderSync, BarChart3, TrendingUp } from "lucide-react";

export default function JTBDMapping() {
  const inSeasonJobs = [
    {
      title: "Real-time Replenishment",
      description: "Dynamic inventory rebalancing based on live sales data",
      importance: "high"
    },
    {
      title: "Store Transfers",
      description: "Inter-location inventory optimization to maximize sell-through",
      importance: "high"
    },
    {
      title: "Special Events Dynamic Management",
      description: "AI-powered inventory and pricing optimization during promotional events",
      importance: "high"
    },
    {
      title: "Inventory Flow & Demand Sensing",
      description: "Continuous stock level optimization with real-time demand signal processing",
      importance: "high"
    },
    {
      title: "Markdown Optimization",
      description: "Strategic markdown timing and depth to clear inventory",
      importance: "medium"
    },
    {
      title: "Assortment Management & Validation",
      description: "In-season assortment performance tracking and optimization recommendations",
      importance: "medium"
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "border-l-orange-500 bg-orange-50";
      case "medium": return "border-l-purple-500 bg-purple-50";
      case "low": return "border-l-teal-500 bg-teal-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getImportanceDot = (importance: string) => {
    switch (importance) {
      case "high": return "bg-orange-500";
      case "medium": return "bg-purple-500";
      case "low": return "bg-teal-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Jobs-to-be-Done Mapping</h3>
      
      {/* In-Season Optimization - Single Column Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto"
      >
        <h4 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center justify-center">
          <FolderSync className="text-onebeat-coral w-8 h-8 mr-3" />
          In-Season Optimization
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inSeasonJobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className={`border-l-4 pl-4 py-4 rounded-r-lg ${getImportanceColor(job.importance)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 ${getImportanceDot(job.importance)} rounded-full mt-2 flex-shrink-0`}></div>
                <div>
                  <div className="text-gray-900 font-medium text-lg mb-2">{job.title}</div>
                  <div className="text-gray-600 text-sm">{job.description}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Job Importance Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h5 className="text-gray-900 font-semibold mb-4 text-center">In-Season Job Priorities</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-900 font-medium">High Priority</span>
            </div>
            <p className="text-gray-600 text-sm">
              Core in-season jobs where Onebeat delivers immediate ROI through real-time optimization
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-900 font-medium">Medium Priority</span>
            </div>
            <p className="text-gray-600 text-sm">
              Supporting in-season functions that enhance overall inventory performance
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
