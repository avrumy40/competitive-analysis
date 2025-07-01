import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Competitor, InsertCompetitor } from "@shared/schema";
import type { CompetitorCapabilities } from "@/lib/types";

interface EditCompetitorDialogProps {
  competitor: Competitor | null;
  open: boolean;
  onClose: () => void;
}

interface FormData {
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

  capabilities: CompetitorCapabilities;
  uniqueFeatures: string;
}

export default function EditCompetitorDialog({ competitor, open, onClose }: EditCompetitorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
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
    },
    uniqueFeatures: ""
  });

  // Load competitor data when dialog opens
  useEffect(() => {
    if (competitor && open) {
      const capabilities = typeof competitor.capabilities === 'object' && competitor.capabilities !== null 
        ? competitor.capabilities as CompetitorCapabilities
        : {
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
          };

      setFormData({
        name: competitor.name,
        category: competitor.category,
        location: competitor.location || "",
        employees: competitor.employees?.toString() || "",
        funding: competitor.funding || "",
        revenue: competitor.revenue || "",
        description: competitor.description,
        similarity: competitor.similarity.toString(),
        strengths: competitor.strengths?.join('\n') || "",
        weaknesses: competitor.weaknesses?.join('\n') || "",
        killPoints: competitor.killPoints?.join('\n') || "",
        landmineQuestions: competitor.landmineQuestions?.join('\n') || "",
        pricing: competitor.pricing || "",

        capabilities,
        uniqueFeatures: competitor.uniqueFeatures?.join('\n') || ""
      });
    }
  }, [competitor, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitor) return;

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

        uniqueFeatures: formData.uniqueFeatures ? formData.uniqueFeatures.split('\n').filter(s => s.trim()) : null,
        capabilities: formData.capabilities
      };

      await apiRequest("PUT", `/api/competitors/${competitor.id}`, competitorData);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });

      toast({
        title: "Success",
        description: "Competitor updated successfully",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update competitor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCapability = (key: keyof CompetitorCapabilities, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Competitor: {competitor?.name}</DialogTitle>
          <DialogDescription>
            Update competitor information including battle card data, capabilities, and positioning details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Competitor</SelectItem>
                    <SelectItem value="global">Global Platform</SelectItem>
                    <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <Label htmlFor="funding">Funding</Label>
                <Input
                  id="funding"
                  value={formData.funding}
                  onChange={(e) => setFormData(prev => ({ ...prev, funding: e.target.value }))}
                  placeholder="e.g., Series B, $50M"
                />
              </div>
              <div>
                <Label htmlFor="revenue">Revenue</Label>
                <Input
                  id="revenue"
                  value={formData.revenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                  placeholder="e.g., $10M ARR"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the company and what they do..."
                required
              />
            </div>
            <div>
              <Label htmlFor="similarity">Similarity Score (1-10) *</Label>
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
          </div>

          {/* Battle Card Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Battle Card Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strengths">Strengths (one per line)</Label>
                <Textarea
                  id="strengths"
                  value={formData.strengths}
                  onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
                  placeholder="Strong in retail analytics&#10;Good customer support"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="weaknesses">Weaknesses (one per line)</Label>
                <Textarea
                  id="weaknesses"
                  value={formData.weaknesses}
                  onChange={(e) => setFormData(prev => ({ ...prev, weaknesses: e.target.value }))}
                  placeholder="Limited AI capabilities&#10;High implementation cost"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="killPoints">Kill Points (one per line)</Label>
                <Textarea
                  id="killPoints"
                  value={formData.killPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, killPoints: e.target.value }))}
                  placeholder="No real-time optimization&#10;Manual processes"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="landmineQuestions">Landmine Questions (one per line)</Label>
                <Textarea
                  id="landmineQuestions"
                  value={formData.landmineQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, landmineQuestions: e.target.value }))}
                  placeholder="How do you handle real-time demand changes?&#10;What's your implementation timeline?"
                  rows={4}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pricing">Pricing Model</Label>
              <Textarea
                id="pricing"
                value={formData.pricing}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
                placeholder="Enterprise licensing model, $X per user per month"
                rows={3}
              />
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Capabilities Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.capabilities).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => updateCapability(key as keyof CompetitorCapabilities, !!checked)}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Unique Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Unique Features</h3>
            <div>
              <Label htmlFor="uniqueFeatures">Unique Features (one per line)</Label>
              <Textarea
                id="uniqueFeatures"
                value={formData.uniqueFeatures}
                onChange={(e) => setFormData(prev => ({ ...prev, uniqueFeatures: e.target.value }))}
                placeholder="Patented algorithm for demand prediction&#10;Integration with major ERP systems"
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Competitor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}