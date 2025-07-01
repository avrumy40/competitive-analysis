import { 
  competitors, 
  capabilities, 
  marketSegments,
  type Competitor, 
  type InsertCompetitor,
  type Capability,
  type InsertCapability,
  type MarketSegment,
  type InsertMarketSegment
} from "@shared/schema";

export interface IStorage {
  // Competitors
  getCompetitors(): Promise<Competitor[]>;
  getCompetitorById(id: number): Promise<Competitor | undefined>;
  getCompetitorsByCategory(category: string): Promise<Competitor[]>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  updateCompetitor(id: number, competitor: InsertCompetitor): Promise<Competitor | undefined>;
  deleteCompetitor(id: number): Promise<boolean>;
  
  // Capabilities
  getCapabilities(): Promise<Capability[]>;
  createCapability(capability: InsertCapability): Promise<Capability>;
  
  // Market Segments
  getMarketSegments(): Promise<MarketSegment[]>;
  createMarketSegment(segment: InsertMarketSegment): Promise<MarketSegment>;
}

export class MemStorage implements IStorage {
  private competitors: Map<number, Competitor>;
  private capabilities: Map<number, Capability>;
  private marketSegments: Map<number, MarketSegment>;
  private currentCompetitorId: number;
  private currentCapabilityId: number;
  private currentSegmentId: number;

  constructor() {
    this.competitors = new Map();
    this.capabilities = new Map();
    this.marketSegments = new Map();
    this.currentCompetitorId = 1;
    this.currentCapabilityId = 1;
    this.currentSegmentId = 1;

    // Initialize with real competitor data from PDFs
    this.initializeData();
  }

  private async initializeData() {
    // Initialize competitors from battle cards data
    const competitorData: InsertCompetitor[] = [
      {
        name: "Toolio",
        category: "direct",
        location: "Brooklyn, New York, USA",
        employees: 61,
        funding: "$10.3M Series A",
        revenue: "~$45K median ARR",
        description: "Cloud-based merchandising platform for forecast-based inventory planning with real-time insights and remote collaboration capabilities.",
        similarity: 8,
        strengths: ["Modern UX with visual line boards", "Easy Excel replacement", "Budget & assortment modules", "Strong scenario planning"],
        weaknesses: ["Forecast-centric approach", "Limited AI/ML depth", "Small-brand focus", "Manual rule configuration"],
        killPoints: [
          "Onebeat offers in-season dynamic flow & pricing; Toolio stops at plan",
          "Algorithms field-proven at >200 brands vs. pilot-stage",
          "Handles store transfers & real-time rebalancing"
        ],
        landmineQuestions: [
          "How do you handle unexpected demand spikes mid-season?",
          "What is your largest brick-and-mortar rollout to date?",
          "Can you show ROI proof from enterprise implementations?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: false,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "€5,000+ (Mackage case), median ARR ~$45K",
        targetMarket: "DTC brands, mid-market retailers",
        implementationTime: "2-3 months",
        uniqueFeatures: ["Visual line boards", "PLM integration", "Scenario planning"]
      },
      {
        name: "Syrup Tech",
        category: "direct",
        location: "New York, USA",
        employees: 50,
        funding: "$25.1M Series A",
        revenue: "Early stage",
        description: "AI-powered inventory optimization for apparel & footwear with neural-net forecasting and granular SKU-store allocation.",
        similarity: 7,
        strengths: ["Neural-net 'newness' forecasting", "Granular SKU-store suggestions", "Attractive modern UI", "AI-first approach"],
        weaknesses: ["Early-stage with few production clients", "Opaque black-box models", "No pricing/markdown engine", "Limited enterprise proof"],
        killPoints: [
          "Goldratt methodology with explainable analytics",
          "End-to-end solution from budget to in-season vs. allocation silo",
          "Broader vertical fit beyond fashion"
        ],
        landmineQuestions: [
          "How many clients are fully live outside design partnership?",
          "Can users adjust recommendations without ML retrain?",
          "What's your track record with non-fashion retailers?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: false,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "Undisclosed, likely premium SaaS model",
        targetMarket: "Fashion & footwear brands",
        implementationTime: "3-4 months",
        uniqueFeatures: ["Neural-net forecasting", "Newness prediction", "AI co-pilot interface"]
      },
      {
        name: "Blue Yonder",
        category: "enterprise",
        location: "Global (Panasonic-owned)",
        employees: 6000,
        funding: "Panasonic acquisition",
        revenue: "$600M+ revenue",
        description: "Legacy leader in supply chain optimization with broadest suite covering category management, space planning, and enterprise planning.",
        similarity: 6,
        strengths: ["Broadest supply-chain suite", "Category management & space planning", "Large enterprise install base", "Mature platform"],
        weaknesses: ["Expensive multi-year rollouts", "Few live cloud references", "Retail not priority vertical", "Complex implementation"],
        killPoints: [
          "Rapid SaaS setup vs. multi-year implementations",
          "Real-time adaptive vs. batch optimization",
          "Lower TCO for mid-tier retailers"
        ],
        landmineQuestions: [
          "What is the typical ROI payback period?",
          "Can you show recent cloud reference implementations < 12 months?",
          "What's the total cost of ownership over 3 years?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: false,
          pricing: true,
          markdownOptimization: true,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise: $500K+ annual licenses",
        targetMarket: "Large enterprises",
        implementationTime: "12-24 months",
        uniqueFeatures: ["Category management", "Space planning", "Supply chain breadth"]
      },
      {
        name: "Impact Analytics",
        category: "enterprise",
        location: "US/India",
        employees: 550,
        funding: "$60M funding",
        revenue: "Growth stage",
        description: "Modular suite covering assortment, pricing, and markdown optimization with fast-to-deploy SaaS and intelligent clustering.",
        similarity: 7,
        strengths: ["Fast-to-deploy SaaS", "Intelligent clustering", "Strong promo/price optimization", "Modular approach"],
        weaknesses: ["Heavy on historical forecast", "Light on in-season agility", "Complex setup for smaller retailers"],
        killPoints: [
          "Continuous flow optimization vs. pre-season focus",
          "Plug-and-play with small & mid retailers",
          "Lower cost structure"
        ],
        landmineQuestions: [
          "How do you handle mid-season demand shifts?",
          "What's your average implementation timeline?",
          "Can you show ROI from retailers under $100M revenue?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: false,
          pricing: true,
          markdownOptimization: true,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "SaaS: $50K-200K annual",
        targetMarket: "Mid to large retailers",
        implementationTime: "4-6 months",
        uniqueFeatures: ["Intelligent clustering", "Price optimization", "Fast deployment"]
      },
      {
        name: "Analytic Always",
        category: "global",
        location: "Spain, Mexico, Colombia, Brazil",
        employees: 200,
        funding: "Private",
        revenue: "Established",
        description: "Pre-season and in-season planning platform with emphasis on European and Latin American markets.",
        similarity: 9,
        strengths: ["Strong European presence", "In-season capabilities", "Established client base", "Regional expertise"],
        weaknesses: ["Hard implementation requiring human intervention", "Limited global reach", "UI/UX not as modern"],
        killPoints: [
          "Time to Value – faster implementation and results",
          "Simulation-based sales process showing ROI upfront",
          "Global reach vs. regional focus"
        ],
        landmineQuestions: [
          "What's your implementation success rate?",
          "How long to see first ROI results?",
          "Do you have references outside Europe/LATAM?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: true,
          markdownOptimization: true,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise SaaS model",
        targetMarket: "European & LATAM retailers",
        implementationTime: "6-8 months",
        uniqueFeatures: ["Regional specialization", "Pre & in-season coverage"]
      },
      {
        name: "RELEX Solutions",
        category: "global",
        location: "Helsinki, Finland",
        employees: 2000,
        funding: "$500M+ funding",
        revenue: "$200M+ ARR",
        description: "Unified supply chain and retail planning platform with strong demand forecasting and automated replenishment capabilities.",
        similarity: 8,
        strengths: ["Strong demand forecasting", "Unified platform", "Automated replenishment", "Global deployment experience"],
        weaknesses: ["Complex implementation", "Higher cost structure", "Less fashion-specific", "Heavy on technical resources"],
        killPoints: [
          "Real-time flow optimization vs. batch processing",
          "Simpler deployment model for mid-market",
          "Fashion-retail specific workflows",
          "Lower total cost of ownership"
        ],
        landmineQuestions: [
          "How long is typical implementation for mid-market retailer?",
          "What's the technical team size required?",
          "Fashion-specific functionality vs. generic forecasting?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: true,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise SaaS: $200K-1M+ annually",
        targetMarket: "Large global retailers",
        implementationTime: "6-12 months",
        uniqueFeatures: ["Unified planning platform", "Advanced forecasting", "Automated execution"]
      },
      {
        name: "Anaplan",
        category: "enterprise",
        location: "San Francisco, USA",
        employees: 2500,
        funding: "Public company",
        revenue: "$600M+ revenue",
        description: "Connected planning platform with modeling capabilities for financial and operational planning across enterprises.",
        similarity: 4,
        strengths: ["Flexible modeling", "Connected planning", "Enterprise scale", "Financial integration"],
        weaknesses: ["Generic platform requiring customization", "Long implementation", "Not retail-specific", "Complex user experience"],
        killPoints: [
          "Purpose-built for retail vs. generic platform",
          "Faster time to value with pre-built workflows",
          "Industry-specific functionality out-of-box",
          "Simpler user experience for merchandisers"
        ],
        landmineQuestions: [
          "How many retail-specific templates are included?",
          "What's implementation time for merchandise planning?",
          "Can merchandisers use it without IT support?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: false,
          initialAllocations: false,
          replenishment: false,
          storeTransfers: false,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: true,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise: $100K-500K+ annually",
        targetMarket: "Large enterprises",
        implementationTime: "6-18 months",
        uniqueFeatures: ["Connected planning", "Flexible modeling", "Enterprise integration"]
      },
      {
        name: "Aptos",
        category: "enterprise",
        location: "Atlanta, Georgia, USA",
        employees: 1200,
        funding: "Private equity backed",
        revenue: "Growth stage",
        description: "Retail enterprise software suite with merchandise planning, allocation, and pricing optimization for large retailers.",
        similarity: 6,
        strengths: ["Comprehensive retail suite", "Large retailer experience", "Integrated POS/inventory", "Proven implementations"],
        weaknesses: ["Legacy technology stack", "Complex implementations", "Higher cost", "Limited innovation"],
        killPoints: [
          "Modern cloud-first architecture vs. legacy systems",
          "Faster deployment and lower implementation cost",
          "Continuous innovation and feature updates",
          "Better user experience and adoption"
        ],
        landmineQuestions: [
          "What percentage of clients are on cloud vs. on-premise?",
          "How often do you release new features?",
          "What's user adoption rate post-implementation?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: true,
          markdownOptimization: true,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise: $200K-1M+ annually",
        targetMarket: "Large retailers",
        implementationTime: "12-24 months",
        uniqueFeatures: ["Full retail suite", "POS integration", "Large retailer focus"]
      },
      {
        name: "Nextail",
        category: "global",
        location: "Europe focused",
        employees: 150,
        funding: "Series B",
        revenue: "Growth stage",
        description: "In-season optimization platform with impressive UI/UX, founded by ZARA veterans with strong European market presence.",
        similarity: 9,
        strengths: ["Impressive UI/UX", "ZARA veteran founders", "Strong in-season focus", "European market knowledge"],
        weaknesses: ["Long implementation with manual configs", "Europe-focused limited global reach", "High customization requirements"],
        killPoints: [
          "Repeatability of ROI with standard implementation",
          "Attractive SaaS pricing with no implementation costs",
          "Global market presence vs. Europe focus"
        ],
        landmineQuestions: [
          "What's the standard vs. customized implementation ratio?",
          "Can you show US market references?",
          "What are the total implementation costs?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: true,
          markdownOptimization: true,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "SaaS with implementation fees",
        targetMarket: "European fashion retailers",
        implementationTime: "4-6 months",
        uniqueFeatures: ["ZARA methodology", "Fashion-first approach", "Premium UI/UX"]
      },
      {
        name: "Celonis",
        category: "enterprise",
        location: "Munich, Germany",
        employees: 2500,
        funding: "$1B+ funding",
        revenue: "Growth stage",
        description: "Process mining and execution management platform that can be applied to retail planning and optimization workflows.",
        similarity: 3,
        strengths: ["Process mining capabilities", "Execution management", "Large enterprise focus", "Data analytics"],
        weaknesses: ["Not retail-specific", "Requires heavy customization", "Complex implementation", "Generic platform"],
        killPoints: [
          "Purpose-built retail solution vs. generic platform",
          "Out-of-box functionality for merchandising",
          "Industry expertise and best practices",
          "Faster deployment with pre-built workflows"
        ],
        landmineQuestions: [
          "How many retail merchandise planning implementations?",
          "What's the customization effort required?",
          "Do you have retail-specific process templates?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: false,
          assortmentPlanning: false,
          initialAllocations: false,
          replenishment: false,
          storeTransfers: false,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: true,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise: $200K-1M+ annually",
        targetMarket: "Large enterprises",
        implementationTime: "6-18 months",
        uniqueFeatures: ["Process mining", "Execution management", "Analytics focus"]
      },
      {
        name: "Oracle Retail",
        category: "enterprise",
        location: "Redwood City, California, USA",
        employees: 5000,
        funding: "Public company",
        revenue: "$42B+ revenue",
        description: "Comprehensive retail management suite including merchandise planning, pricing, and supply chain optimization.",
        similarity: 5,
        strengths: ["Complete retail suite", "Enterprise scale", "Global presence", "Integration capabilities"],
        weaknesses: ["Complex implementations", "High cost", "Legacy technology", "Over-engineered for mid-market"],
        killPoints: [
          "Modern cloud-native architecture vs. legacy systems",
          "Faster implementation and lower TCO",
          "Purpose-built for mid-market vs. enterprise-only",
          "Better user experience and adoption rates"
        ],
        landmineQuestions: [
          "What's the average implementation timeline?",
          "How many mid-market (<$500M) clients do you have?",
          "What percentage of new implementations are cloud-native?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: true,
          markdownOptimization: true,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise: $500K-2M+ annually",
        targetMarket: "Large enterprises",
        implementationTime: "12-36 months",
        uniqueFeatures: ["Complete retail suite", "Enterprise integration", "Legacy market presence"]
      },
      {
        name: "SAP Retail",
        category: "enterprise",
        location: "Walldorf, Germany",
        employees: 8000,
        funding: "Public company",
        revenue: "$30B+ revenue",
        description: "Enterprise resource planning with retail-specific modules for merchandise management and planning.",
        similarity: 4,
        strengths: ["Enterprise ERP integration", "Global presence", "Comprehensive functionality", "Industry standard"],
        weaknesses: ["Complex and expensive", "Long implementations", "Not agile for fast fashion", "Heavy IT requirements"],
        killPoints: [
          "Purpose-built retail vs. ERP add-on modules",
          "Agile deployment vs. multi-year projects",
          "Modern user experience vs. complex enterprise UI",
          "Mid-market accessibility vs. enterprise-only"
        ],
        landmineQuestions: [
          "How long is typical retail module implementation?",
          "What's the total cost including customization?",
          "Do you have retail-specific UI for merchandisers?"
        ],
        capabilities: {
          analytics: true,
          financialPlanning: true,
          assortmentPlanning: true,
          initialAllocations: true,
          replenishment: true,
          storeTransfers: true,
          pricing: false,
          markdownOptimization: false,
          aiSpecialEvents: false,
          proactiveInsights: false,
          dynamicInventoryTargets: false
        },
        pricing: "Enterprise: $1M+ annually",
        targetMarket: "Large enterprises",
        implementationTime: "18-36 months",
        uniqueFeatures: ["ERP integration", "Enterprise standard", "Global deployment"]
      }
    ];

    // Add competitors to storage
    for (const comp of competitorData) {
      await this.createCompetitor(comp);
    }

    // Initialize capabilities
    const capabilityData: InsertCapability[] = [
      { name: "Analytics", description: "Reporting and business intelligence", category: "analytics" },
      { name: "Financial Planning", description: "Budget and OTB management", category: "pre-season" },
      { name: "Assortment Planning", description: "Product mix optimization", category: "pre-season" },
      { name: "Initial Allocations", description: "First allocation to stores", category: "pre-season" },
      { name: "Replenishment", description: "Ongoing inventory replenishment", category: "in-season" },
      { name: "Store Transfers", description: "Inter-store inventory movement", category: "in-season" },
      { name: "Pricing + Promotions", description: "Dynamic pricing optimization", category: "in-season" },
      { name: "Markdown Optimization", description: "End-of-season clearance", category: "in-season" },
      { name: "AI Special Events", description: "AI-powered event demand prediction", category: "in-season" },
      { name: "Proactive Insights", description: "Predictive recommendations", category: "in-season" },
      { name: "Planning Assistant", description: "AI-guided planning decisions", category: "in-season" }
    ];

    for (const cap of capabilityData) {
      await this.createCapability(cap);
    }

    // Initialize market segments
    const segmentData: InsertMarketSegment[] = [
      {
        name: "Direct Competitors",
        description: "Similar products with similar revenue goals",
        competitors: ["Toolio", "Syrup Tech"],
        characteristics: ["Similar target market", "Comparable features", "Direct competition for deals"]
      },
      {
        name: "Secondary Competitors", 
        description: "Similar products, solving the same problem in a different way",
        competitors: ["Blue Yonder", "Impact Analytics", "Nextail", "Analytic Always"],
        characteristics: ["Different approach", "Overlapping use cases", "Indirect competition"]
      },
      {
        name: "Tertiary Competitors",
        description: "Substitute products, fighting over customer time/money",
        competitors: ["Oracle Retail", "SAP Retail", "Manhattan Associates"],
        characteristics: ["Broad platforms", "Different primary focus", "Budget competition"]
      }
    ];

    for (const segment of segmentData) {
      await this.createMarketSegment(segment);
    }
  }

  // Competitor methods
  async getCompetitors(): Promise<Competitor[]> {
    return Array.from(this.competitors.values());
  }

  async getCompetitorById(id: number): Promise<Competitor | undefined> {
    return this.competitors.get(id);
  }

  async getCompetitorsByCategory(category: string): Promise<Competitor[]> {
    return Array.from(this.competitors.values()).filter(c => c.category === category);
  }

  async createCompetitor(insertCompetitor: InsertCompetitor): Promise<Competitor> {
    const id = this.currentCompetitorId++;
    const competitor: Competitor = { 
      ...insertCompetitor, 
      id,
      employees: insertCompetitor.employees ?? null,
      funding: insertCompetitor.funding ?? null,
      revenue: insertCompetitor.revenue ?? null,
      strengths: insertCompetitor.strengths ?? null,
      weaknesses: insertCompetitor.weaknesses ?? null,
      killPoints: insertCompetitor.killPoints ?? null,
      landmineQuestions: insertCompetitor.landmineQuestions ?? null,
      pricing: insertCompetitor.pricing ?? null,
      uniqueFeatures: insertCompetitor.uniqueFeatures ?? null,
      capabilities: insertCompetitor.capabilities ?? {},
      targetMarket: insertCompetitor.targetMarket ?? null,
      implementationTime: insertCompetitor.implementationTime ?? null
    };
    this.competitors.set(id, competitor);
    return competitor;
  }

  async updateCompetitor(id: number, insertCompetitor: InsertCompetitor): Promise<Competitor | undefined> {
    const existing = this.competitors.get(id);
    if (!existing) {
      return undefined;
    }
    
    const updated: Competitor = { 
      ...insertCompetitor, 
      id,
      employees: insertCompetitor.employees ?? null,
      funding: insertCompetitor.funding ?? null,
      revenue: insertCompetitor.revenue ?? null,
      strengths: insertCompetitor.strengths ?? null,
      weaknesses: insertCompetitor.weaknesses ?? null,
      killPoints: insertCompetitor.killPoints ?? null,
      landmineQuestions: insertCompetitor.landmineQuestions ?? null,
      pricing: insertCompetitor.pricing ?? null,
      uniqueFeatures: insertCompetitor.uniqueFeatures ?? null,
      capabilities: insertCompetitor.capabilities ?? {},
      targetMarket: insertCompetitor.targetMarket ?? null,
      implementationTime: insertCompetitor.implementationTime ?? null
    };
    this.competitors.set(id, updated);
    return updated;
  }

  async deleteCompetitor(id: number): Promise<boolean> {
    return this.competitors.delete(id);
  }

  // Capability methods
  async getCapabilities(): Promise<Capability[]> {
    return Array.from(this.capabilities.values());
  }

  async createCapability(insertCapability: InsertCapability): Promise<Capability> {
    const id = this.currentCapabilityId++;
    const capability: Capability = { 
      ...insertCapability, 
      id,
      description: insertCapability.description ?? null
    };
    this.capabilities.set(id, capability);
    return capability;
  }

  // Market segment methods
  async getMarketSegments(): Promise<MarketSegment[]> {
    return Array.from(this.marketSegments.values());
  }

  async createMarketSegment(insertSegment: InsertMarketSegment): Promise<MarketSegment> {
    const id = this.currentSegmentId++;
    const segment: MarketSegment = { 
      ...insertSegment, 
      id,
      competitors: insertSegment.competitors ?? null,
      characteristics: insertSegment.characteristics ?? null
    };
    this.marketSegments.set(id, segment);
    return segment;
  }
}

export const storage = new MemStorage();
