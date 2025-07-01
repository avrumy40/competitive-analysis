import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertCompetitor } from "@shared/schema";
import type { CompetitorCapabilities } from "@/lib/types";

export default function AddCompetitorDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    location: string;
    employees: string;
    funding: string;
    revenue: string;
    description: string;
    similarity: string;
    strengths: string;
    weaknesses: string;
    killPoints: string;
    landmineQuestions: string;
    pricing: string;
    targetMarket: string;
    implementationTime: string;
    uniqueFeatures: string;
    capabilities: CompetitorCapabilities;
  }>({
    name: "",
    category: "direct",
    location: "",
    employees: "",
    funding: "",
    revenue: "",
    description: "",
    similarity: "5",
    strengths: "",
    weaknesses: "",
    killPoints: "",
    landmineQuestions: "",
    pricing: "",
    targetMarket: "",
    implementationTime: "",
    uniqueFeatures: "",
    capabilities: {
      analytics: false,
      financialPlanning: false,
      assortmentPlanning: false,
      initialAllocations: false,
      replenishment: false,
      storeTransfers: false,
      pricing: false,
      markdownOptimization: false,
      aiSpecialEvents: false,
      proactiveInsights: false,
      dynamicInventoryTargets: false,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert string arrays back to arrays and prepare data
      const competitorData: InsertCompetitor = {
        name: formData.name,
        category: formData.category,
        location: formData.location || "",
        employees: formData.employees ? parseInt(formData.employees) : null,
        funding: formData.funding || null,
        revenue: formData.revenue || null,
        description: formData.description,
        similarity: parseInt(formData.similarity),
        strengths: formData.strengths ? formData.strengths.split('\n').filter(s => s.trim()) : null,
        weaknesses: formData.weaknesses ? formData.weaknesses.split('\n').filter(s => s.trim()) : null,
        killPoints: formData.killPoints ? formData.killPoints.split('\n').filter(s => s.trim()) : null,
        landmineQuestions: formData.landmineQuestions ? formData.landmineQuestions.split('\n').filter(s => s.trim()) : null,
        pricing: formData.pricing || null,
        targetMarket: formData.targetMarket || null,
        implementationTime: formData.implementationTime || null,
        uniqueFeatures: formData.uniqueFeatures ? formData.uniqueFeatures.split('\n').filter(s => s.trim()) : null,
        capabilities: formData.capabilities
      };

      await apiRequest("POST", "/api/competitors", competitorData);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });

      toast({
        title: "Success",
        description: "Competitor added successfully",
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        category: "direct",
        location: "",
        employees: "",
        funding: "",
        revenue: "",
        description: "",
        similarity: "5",
        strengths: "",
        weaknesses: "",
        killPoints: "",
        landmineQuestions: "",
        pricing: "",
        targetMarket: "",
        implementationTime: "",
        uniqueFeatures: "",
        capabilities: {
          analytics: false,
          financialPlanning: false,
          assortmentPlanning: false,
          initialAllocations: false,
          replenishment: false,
          storeTransfers: false,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false,
        }
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add competitor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapabilityChange = (capability: keyof CompetitorCapabilities, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [capability]: checked
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-onebeat-teal hover:bg-onebeat-teal/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Competitor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Competitor</DialogTitle>
          <DialogDescription>
            Add a new competitor to the database with optional information for battle cards, capabilities, and positioning.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct Competitor</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="adjacent">Adjacent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., New York, USA"
              />
            </div>
            <div>
              <Label htmlFor="employees">Employees</Label>
              <Input
                id="employees"
                type="number"
                value={formData.employees}
                onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
                placeholder="e.g., 100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="funding">Funding</Label>
              <Input
                id="funding"
                value={formData.funding}
                onChange={(e) => setFormData(prev => ({ ...prev, funding: e.target.value }))}
                placeholder="e.g., $10M Series A"
              />
            </div>
            <div>
              <Label htmlFor="revenue">Revenue</Label>
              <Input
                id="revenue"
                value={formData.revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                placeholder="e.g., $5M ARR"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the competitor"
              required
            />
          </div>

          <div>
            <Label htmlFor="similarity">Similarity Score (1-10)</Label>
            <Select value={formData.similarity} onValueChange={(value) => setFormData(prev => ({ ...prev, similarity: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Battle Card Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Battle Card Information</h3>
            
            <div>
              <Label htmlFor="strengths">Strengths (one per line)</Label>
              <Textarea
                id="strengths"
                value={formData.strengths}
                onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
                placeholder="Modern UX design&#10;Easy implementation&#10;Strong analytics"
              />
            </div>

            <div>
              <Label htmlFor="weaknesses">Weaknesses (one per line)</Label>
              <Textarea
                id="weaknesses"
                value={formData.weaknesses}
                onChange={(e) => setFormData(prev => ({ ...prev, weaknesses: e.target.value }))}
                placeholder="Limited AI capabilities&#10;High implementation cost&#10;Complex setup"
              />
            </div>

            <div>
              <Label htmlFor="killPoints">Kill Points (one per line)</Label>
              <Textarea
                id="killPoints"
                value={formData.killPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, killPoints: e.target.value }))}
                placeholder="Real-time optimization vs batch processing&#10;Lower total cost of ownership&#10;Faster implementation"
              />
            </div>

            <div>
              <Label htmlFor="landmineQuestions">Landmine Questions (one per line)</Label>
              <Textarea
                id="landmineQuestions"
                value={formData.landmineQuestions}
                onChange={(e) => setFormData(prev => ({ ...prev, landmineQuestions: e.target.value }))}
                placeholder="What is your average implementation timeline?&#10;Can you show ROI from similar clients?&#10;How do you handle mid-season demand changes?"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pricing">Pricing</Label>
              <Input
                id="pricing"
                value={formData.pricing}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
                placeholder="e.g., $50K-100K annual"
              />
            </div>
            <div>
              <Label htmlFor="targetMarket">Target Market</Label>
              <Input
                id="targetMarket"
                value={formData.targetMarket}
                onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                placeholder="e.g., Mid-market retailers"
              />
            </div>
            <div>
              <Label htmlFor="implementationTime">Implementation Time</Label>
              <Input
                id="implementationTime"
                value={formData.implementationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, implementationTime: e.target.value }))}
                placeholder="e.g., 3-6 months"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="uniqueFeatures">Unique Features (one per line)</Label>
            <Textarea
              id="uniqueFeatures"
              value={formData.uniqueFeatures}
              onChange={(e) => setFormData(prev => ({ ...prev, uniqueFeatures: e.target.value }))}
              placeholder="Visual line boards&#10;AI forecasting&#10;Real-time dashboards"
            />
          </div>

          {/* Capabilities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Capabilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(formData.capabilities).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => handleCapabilityChange(key as keyof CompetitorCapabilities, checked as boolean)}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Competitor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}