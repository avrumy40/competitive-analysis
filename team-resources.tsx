import { motion } from "framer-motion";
import { Handshake, Cog, Rocket, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamResources() {
  const resources = [
    {
      team: "Sales Team",
      icon: Handshake,
      color: "text-green-600",
      bgColor: "bg-green-50",
      resources: [
        "Battle cards with kill points",
        "Landmine questions for discovery",
        "ROI comparison data",
        "Implementation timeline comparisons"
      ],
      downloadLabel: "Download Sales Kit"
    },
    {
      team: "Product Team", 
      icon: Cog,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      resources: [
        "Feature gap analysis",
        "Technical architecture comparisons", 
        "Integration capabilities matrix",
        "Roadmap positioning insights"
      ],
      downloadLabel: "Download Product Brief"
    },
    {
      team: "GTM Team",
      icon: Rocket,
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
      resources: [
        "Market positioning analysis",
        "Pricing strategy insights",
        "Competitive messaging framework", 
        "Market opportunity sizing"
      ],
      downloadLabel: "Download GTM Package"
    }
  ];

  const handleDownload = async (team: string, format: 'csv' | 'pdf' = 'csv') => {
    console.log(`Downloading resources for ${team}`);
    
    let teamKey: 'sales' | 'product' | 'gtm';
    if (team === 'Sales Team') teamKey = 'sales';
    else if (team === 'Product Team') teamKey = 'product';
    else if (team === 'GTM Team') teamKey = 'gtm';
    else return;

    try {
      const endpoint = `/api/export/${format}?team=${teamKey}`;
      const response = await fetch(endpoint);
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = `onebeat-${teamKey}-package.${format}`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        downloadFilename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }
      
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.team}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover-lift h-full">
            <CardContent className="p-8">
              {/* Icon & Title */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${resource.bgColor} border border-gray-200`}>
                <resource.icon className={`${resource.color} w-6 h-6`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {resource.team}
              </h3>

              {/* Resources List */}
              <ul className="text-gray-700 space-y-3 mb-6">
                {resource.resources.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + itemIndex * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <div className={`w-1.5 h-1.5 ${resource.color.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                    <span className="text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Download Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => handleDownload(resource.team, 'csv')}
                  className="bg-gray-900 w-full py-3 rounded-lg text-white hover:bg-gray-800 transition-all duration-200 group"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  {resource.downloadLabel} (CSV)
                </Button>
                
                <Button 
                  onClick={() => handleDownload(resource.team, 'pdf')}
                  className="bg-white w-full py-3 rounded-lg text-gray-900 hover:bg-gray-50 transition-all duration-200 group border border-gray-300"
                >
                  <FileText className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  {resource.downloadLabel} (PDF)
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => console.log(`Sharing ${resource.team} resources`)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm" 
                    className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => handleDownload(resource.team, 'pdf')}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Print PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
