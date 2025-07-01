import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Database, FileSpreadsheet, X, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { ExportOptions } from "@/lib/types";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ExportDialog({ open, onClose }: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeCapabilities: true,
    includeKillPoints: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const formatOptions = [
    { 
      id: 'json', 
      label: 'JSON Data', 
      description: 'Machine-readable format for integrations',
      icon: Database,
      color: 'text-blue-400'
    },
    { 
      id: 'csv', 
      label: 'CSV Spreadsheet', 
      description: 'Excel-compatible format for analysis',
      icon: FileSpreadsheet,
      color: 'text-green-400'
    },
    { 
      id: 'pdf', 
      label: 'PDF Report', 
      description: 'Formatted report for presentations',
      icon: FileText,
      color: 'text-purple-400'
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Make API call to export endpoint
      const response = await fetch(`/api/export/${exportOptions.format}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `onebeat-competitive-analysis.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Your ${exportOptions.format.toUpperCase()} export has been downloaded.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Competitive Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div>
            <Label className="text-white font-medium mb-4 block">Export Format</Label>
            <RadioGroup 
              value={exportOptions.format} 
              onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value as any }))}
              className="space-y-3"
            >
              {formatOptions.map((format) => (
                <motion.div
                  key={format.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <RadioGroupItem 
                    value={format.id} 
                    id={format.id}
                    className="border-white/30 text-white"
                  />
                  <Label 
                    htmlFor={format.id} 
                    className="flex items-center gap-3 cursor-pointer glass rounded-lg p-3 flex-1 hover:bg-white/10 transition-colors"
                  >
                    <format.icon className={`w-5 h-5 ${format.color}`} />
                    <div>
                      <div className="text-white font-medium">{format.label}</div>
                      <div className="text-white/70 text-sm">{format.description}</div>
                    </div>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </div>

          {/* Include Options */}
          <div>
            <Label className="text-white font-medium mb-4 block">Include in Export</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="capabilities"
                  checked={exportOptions.includeCapabilities}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeCapabilities: !!checked }))
                  }
                  className="border-white/30"
                />
                <Label htmlFor="capabilities" className="text-white cursor-pointer">
                  Capability Matrix Data
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="killpoints"
                  checked={exportOptions.includeKillPoints}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeKillPoints: !!checked }))
                  }
                  className="border-white/30"
                />
                <Label htmlFor="killpoints" className="text-white cursor-pointer">
                  Kill Points & Landmine Questions
                </Label>
              </div>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-white">
                <span>Exporting...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="bg-white/10" />
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
