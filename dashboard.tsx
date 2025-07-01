import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChartLine, Users, Clock, TrendingUp, Download, Filter, Search } from "lucide-react";
import Navigation from "@/components/navigation";
import BattleCard from "@/components/battle-card";
import EditCompetitorDialog from "@/components/edit-competitor-dialog";
import CapabilityMatrix from "@/components/capability-matrix";
import PositioningChart from "@/components/positioning-chart";
import JTBDMapping from "@/components/jtbd-mapping";
import TeamResources from "@/components/team-resources";
import ExportDialog from "@/components/export-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Competitor, MarketSegment } from "@shared/schema";
import type { FilterOptions } from "@/lib/types";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [deletingCompetitorId, setDeletingCompetitorId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    similarity: null,
    searchTerm: ""
  });
  
  const { toast } = useToast();

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const { data: marketSegments, isLoading: segmentsLoading } = useQuery<MarketSegment[]>({
    queryKey: ["/api/market-segments"],
  });

  const filterDataForTeam = (data: Competitor[], team: 'sales' | 'product' | 'gtm') => {
    return data.map(competitor => {
      const baseData = {
        name: competitor.name,
        category: competitor.category,
        location: competitor.location,
        description: competitor.description,
        similarity: competitor.similarity,
        employees: competitor.employees,
        funding: competitor.funding,
        revenue: competitor.revenue
      };

      switch (team) {
        case 'sales':
          return {
            ...baseData,
            strengths: competitor.strengths,
            weaknesses: competitor.weaknesses,
            killPoints: competitor.killPoints,
            landmineQuestions: competitor.landmineQuestions,
            pricing: competitor.pricing,
            targetMarket: competitor.targetMarket,
            implementationTime: competitor.implementationTime
          };
        case 'product':
          return {
            ...baseData,
            capabilities: competitor.capabilities,
            uniqueFeatures: competitor.uniqueFeatures,
            strengths: competitor.strengths,
            weaknesses: competitor.weaknesses,
            pricing: competitor.pricing,
            implementationTime: competitor.implementationTime
          };
        case 'gtm':
          return {
            ...baseData,
            targetMarket: competitor.targetMarket,
            pricing: competitor.pricing,
            implementationTime: competitor.implementationTime,
            uniqueFeatures: competitor.uniqueFeatures,
            strengths: competitor.strengths,
            killPoints: competitor.killPoints
          };
        default:
          return competitor;
      }
    });
  };

  const handleExport = async (format: 'json' | 'csv' | 'pdf' = 'json', team?: 'sales' | 'product' | 'gtm') => {
    try {
      console.log(`Downloading resources for ${team ? team.toUpperCase() + ' Team' : 'Complete Database'}`);
      
      let endpoint = `/api/export/${format}`;
      if (team) {
        endpoint += `?team=${team}`;
      }
      
      const response = await fetch(endpoint);
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFilename = 'onebeat-export';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        downloadFilename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      } else {
        const teamSuffix = team ? `-${team}-package` : '-database';
        downloadFilename = `onebeat${teamSuffix}.${format}`;
      }
      
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleEditCompetitor = (competitor: Competitor) => {
    setEditingCompetitor(competitor);
  };

  const handleDeleteCompetitor = (id: number) => {
    setDeletingCompetitorId(id);
  };

  const confirmDelete = async () => {
    if (!deletingCompetitorId) return;
    
    try {
      await apiRequest("DELETE", `/api/competitors/${deletingCompetitorId}`);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      
      toast({
        title: "Success",
        description: "Competitor deleted successfully",
      });
      
      setDeletingCompetitorId(null);
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete competitor",
        variant: "destructive",
      });
    }
  };

  const filteredCompetitors = competitors?.filter(competitor => {
    if (filters.category !== "all" && competitor.category !== filters.category) return false;
    if (filters.similarity && competitor.similarity < filters.similarity) return false;
    if (filters.searchTerm && !competitor.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  const categoryFilters = [
    { id: "all", label: "All Competitors", count: competitors?.length || 0 },
    { id: "direct", label: "Direct (US)", count: competitors?.filter(c => c.category === "direct").length || 0 },
    { id: "global", label: "Global", count: competitors?.filter(c => c.category === "global").length || 0 },
    { id: "enterprise", label: "Enterprise", count: competitors?.filter(c => c.category === "enterprise").length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onExport={handleExport}
      />

      {/* Hero Section */}
      <section id="overview" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Competitive Landscape
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time inventory optimization that outperforms forecast-based planning across 200+ brands
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-onebeat-coral w-8 h-8" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Market Position</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">#1</div>
              <div className="text-sm text-gray-600">Real-time Optimization</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Users className="text-onebeat-teal w-8 h-8" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Clients</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">200+</div>
              <div className="text-sm text-gray-600">Active Brands</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-onebeat-purple w-8 h-8" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Implementation</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">8-12</div>
              <div className="text-sm text-gray-600">Weeks to Value</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <ChartLine className="text-onebeat-pink w-8 h-8" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">ROI Period</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">&lt;90</div>
              <div className="text-sm text-gray-600">Days</div>
            </motion.div>
          </div>

          {/* Unique Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-8 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
                <ChartLine className="text-onebeat-purple w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI for Special Events</h3>
              <p className="text-gray-600 mb-4">
                Only solution offering proactive AI insights for special events and seasonal demand spikes.
              </p>
              <div className="flex items-center text-onebeat-coral text-sm">
                <div className="w-2 h-2 bg-onebeat-coral rounded-full mr-2"></div>
                Onebeat Exclusive
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl p-8 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
                <TrendingUp className="text-onebeat-teal w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Store Transfers</h3>
              <p className="text-gray-600 mb-4">
                Real-time inventory rebalancing between locations to maximize sell-through rates.
              </p>
              <div className="flex items-center text-onebeat-coral text-sm">
                <div className="w-2 h-2 bg-onebeat-coral rounded-full mr-2"></div>
                Onebeat Exclusive
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-2xl p-8 hover-lift border border-gray-200 shadow-sm"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
                <Users className="text-onebeat-pink w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dynamic Inventory Targets</h3>
              <p className="text-gray-600 mb-4">
                AI powered sku-location optimization based on sales & supply chain performance to keep stock in its optimal distribution.
              </p>
              <div className="flex items-center text-onebeat-coral text-sm">
                <div className="w-2 h-2 bg-onebeat-coral rounded-full mr-2"></div>
                Onebeat Exclusive
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Battle Cards Section */}
      <section id="battlecards" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Battle Cards</h2>
            <p className="text-xl text-gray-600">Head-to-head competitive analysis</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search competitors..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={filters.category === filter.id ? "default" : "ghost"}
                  onClick={() => setFilters(prev => ({ ...prev, category: filter.id }))}
                  className={`bg-white border border-gray-300 ${filters.category === filter.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Battle Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {competitorsLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-8">
                  <Skeleton className="h-8 w-40 mb-4 bg-white/10" />
                  <Skeleton className="h-20 w-full mb-6 bg-white/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full bg-white/10" />
                    <Skeleton className="h-24 w-full bg-white/10" />
                  </div>
                </div>
              ))
            ) : (
              filteredCompetitors.map((competitor) => (
                <BattleCard 
                  key={competitor.id} 
                  competitor={competitor} 
                  onEdit={handleEditCompetitor}
                  onDelete={handleDeleteCompetitor}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Market Positioning */}
      <section id="positioning" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Market Positioning</h2>
            <p className="text-xl text-gray-600">Competitive positioning across key dimensions</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <PositioningChart competitors={competitors || []} />
            
            {/* Market Segments */}
            <div className="space-y-6">
              {segmentsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full bg-white/10" />
                ))
              ) : (
                marketSegments?.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-onebeat-teal rounded-full mr-3"></div>
                      {segment.name}
                    </h4>
                    <p className="text-gray-600 mb-4">{segment.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {segment.competitors?.map((comp) => (
                        <Badge key={comp} variant="secondary" className="bg-gray-100 text-gray-700">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Capabilities */}
      <section id="capabilities" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Product Capabilities</h2>
            <p className="text-xl text-gray-600">Feature comparison across key solutions</p>
          </motion.div>

          <CapabilityMatrix competitors={competitors || []} />
          
          <div className="mt-16">
            <JTBDMapping />
          </div>
        </div>
      </section>



      {/* Team Resources */}
      <section id="resources" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Team Resources</h2>
            <p className="text-xl text-gray-600">Tailored insights for different functions</p>
          </motion.div>

          <TeamResources />
        </div>
      </section>

      <ExportDialog 
        open={showExportDialog} 
        onClose={() => setShowExportDialog(false)} 
      />
      
      <EditCompetitorDialog
        competitor={editingCompetitor}
        open={!!editingCompetitor}
        onClose={() => setEditingCompetitor(null)}
      />

      <AlertDialog open={!!deletingCompetitorId} onOpenChange={() => setDeletingCompetitorId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Competitor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this competitor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
