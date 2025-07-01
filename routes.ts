import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import pdf from 'html-pdf-node';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint for Render
  app.get("/health", (_req, res) => {
    res.json({ status: "healthy", service: "onebeat-competitive-intelligence", timestamp: new Date().toISOString() });
  });
  
  // Get all competitors
  app.get("/api/competitors", async (req, res) => {
    try {
      const competitors = await storage.getCompetitors();
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitors" });
    }
  });

  // Get competitors by category
  app.get("/api/competitors/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const competitors = await storage.getCompetitorsByCategory(category);
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitors by category" });
    }
  });

  // Get specific competitor
  app.get("/api/competitors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const competitor = await storage.getCompetitorById(id);
      if (!competitor) {
        return res.status(404).json({ error: "Competitor not found" });
      }
      res.json(competitor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch competitor" });
    }
  });

  // Create new competitor
  app.post("/api/competitors", async (req, res) => {
    try {
      const competitor = await storage.createCompetitor(req.body);
      res.status(201).json(competitor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create competitor" });
    }
  });

  // Update competitor
  app.put("/api/competitors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const competitor = await storage.updateCompetitor(id, req.body);
      if (!competitor) {
        return res.status(404).json({ error: "Competitor not found" });
      }
      res.json(competitor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update competitor" });
    }
  });

  // Delete competitor
  app.delete("/api/competitors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCompetitor(id);
      if (!success) {
        return res.status(404).json({ error: "Competitor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete competitor" });
    }
  });

  // Get all capabilities
  app.get("/api/capabilities", async (req, res) => {
    try {
      const capabilities = await storage.getCapabilities();
      res.json(capabilities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch capabilities" });
    }
  });

  // Get market segments
  app.get("/api/market-segments", async (req, res) => {
    try {
      const segments = await storage.getMarketSegments();
      res.json(segments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market segments" });
    }
  });

  // Export data endpoint with team filtering
  app.get("/api/export/:format", async (req, res) => {
    try {
      const { format } = req.params;
      const { team } = req.query;
      const competitors = await storage.getCompetitors();
      const capabilities = await storage.getCapabilities();
      const marketSegments = await storage.getMarketSegments();
      
      // Filter data based on team requirements
      let filteredCompetitors = competitors;
      let filename = '';

      if (team === 'sales') {
        filteredCompetitors = competitors.map(comp => ({
          id: comp.id,
          name: comp.name,
          category: comp.category,
          location: comp.location,
          description: comp.description,
          similarity: comp.similarity,
          employees: comp.employees,
          funding: comp.funding,
          revenue: comp.revenue,
          strengths: comp.strengths,
          weaknesses: comp.weaknesses,
          killPoints: comp.killPoints,
          landmineQuestions: comp.landmineQuestions,
          pricing: comp.pricing,
          targetMarket: comp.targetMarket,
          implementationTime: comp.implementationTime,
          capabilities: comp.capabilities,
          uniqueFeatures: comp.uniqueFeatures
        }));
        filename = format === 'json' ? 'onebeat-sales-package.json' : 'onebeat-sales-package.csv';
      } else if (team === 'product') {
        filteredCompetitors = competitors.map(comp => ({
          id: comp.id,
          name: comp.name,
          category: comp.category,
          location: comp.location,
          description: comp.description,
          similarity: comp.similarity,
          employees: comp.employees,
          funding: comp.funding,
          revenue: comp.revenue,
          capabilities: comp.capabilities,
          uniqueFeatures: comp.uniqueFeatures,
          strengths: comp.strengths,
          weaknesses: comp.weaknesses,
          pricing: comp.pricing,
          implementationTime: comp.implementationTime,
          killPoints: comp.killPoints,
          landmineQuestions: comp.landmineQuestions,
          targetMarket: comp.targetMarket
        }));
        filename = format === 'json' ? 'onebeat-product-package.json' : 'onebeat-product-package.csv';
      } else if (team === 'gtm') {
        filteredCompetitors = competitors.map(comp => ({
          id: comp.id,
          name: comp.name,
          category: comp.category,
          location: comp.location,
          description: comp.description,
          similarity: comp.similarity,
          targetMarket: comp.targetMarket,
          pricing: comp.pricing,
          implementationTime: comp.implementationTime,
          uniqueFeatures: comp.uniqueFeatures,
          strengths: comp.strengths,
          killPoints: comp.killPoints,
          employees: comp.employees,
          funding: comp.funding,
          revenue: comp.revenue,
          weaknesses: comp.weaknesses,
          landmineQuestions: comp.landmineQuestions,
          capabilities: comp.capabilities
        }));
        filename = format === 'json' ? 'onebeat-gtm-package.json' : 'onebeat-gtm-package.csv';
      } else {
        filename = format === 'json' ? 'onebeat-competitive-database.json' : 'onebeat-competitors.csv';
      }
      
      const exportData = {
        competitors: filteredCompetitors,
        capabilities: team ? undefined : capabilities,
        marketSegments: team ? undefined : marketSegments,
        exportedAt: new Date().toISOString(),
        totalRecords: {
          competitors: filteredCompetitors.length,
          capabilities: team ? 0 : capabilities.length,
          marketSegments: team ? 0 : marketSegments.length
        },
        format,
        team: team || 'complete'
      };

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.json(exportData);
      } else if (format === 'csv') {
        // Convert filtered competitors to CSV format
        let csvHeaders = '';
        let csvRows = '';
        
        if (team === 'sales') {
          csvHeaders = 'Name,Category,Location,Description,Similarity,Employees,Funding,Revenue,Strengths,Weaknesses,Kill Points,Pricing,Target Market,Implementation Time\n';
          csvRows = filteredCompetitors.map(comp => {
            const strengths = comp.strengths ? comp.strengths.join('; ') : '';
            const weaknesses = comp.weaknesses ? comp.weaknesses.join('; ') : '';
            const killPoints = comp.killPoints ? comp.killPoints.join('; ') : '';
            return `"${comp.name}","${comp.category}","${comp.location}","${comp.description}",${comp.similarity},"${comp.employees || ''}","${comp.funding || ''}","${comp.revenue || ''}","${strengths}","${weaknesses}","${killPoints}","${comp.pricing || ''}","${comp.targetMarket || ''}","${comp.implementationTime || ''}"`;
          }).join('\n');
        } else if (team === 'product') {
          csvHeaders = 'Name,Category,Location,Description,Similarity,Employees,Funding,Revenue,Capabilities,Unique Features,Strengths,Weaknesses,Pricing,Implementation Time\n';
          csvRows = filteredCompetitors.map(comp => {
            const capabilities = comp.capabilities ? JSON.stringify(comp.capabilities) : '';
            const uniqueFeatures = comp.uniqueFeatures ? comp.uniqueFeatures.join('; ') : '';
            const strengths = comp.strengths ? comp.strengths.join('; ') : '';
            const weaknesses = comp.weaknesses ? comp.weaknesses.join('; ') : '';
            return `"${comp.name}","${comp.category}","${comp.location}","${comp.description}",${comp.similarity},"${comp.employees || ''}","${comp.funding || ''}","${comp.revenue || ''}","${capabilities}","${uniqueFeatures}","${strengths}","${weaknesses}","${comp.pricing || ''}","${comp.implementationTime || ''}"`;
          }).join('\n');
        } else if (team === 'gtm') {
          csvHeaders = 'Name,Category,Location,Description,Similarity,Target Market,Pricing,Implementation Time,Unique Features,Strengths,Kill Points\n';
          csvRows = filteredCompetitors.map(comp => {
            const uniqueFeatures = comp.uniqueFeatures ? comp.uniqueFeatures.join('; ') : '';
            const strengths = comp.strengths ? comp.strengths.join('; ') : '';
            const killPoints = comp.killPoints ? comp.killPoints.join('; ') : '';
            return `"${comp.name}","${comp.category}","${comp.location}","${comp.description}",${comp.similarity},"${comp.targetMarket || ''}","${comp.pricing || ''}","${comp.implementationTime || ''}","${uniqueFeatures}","${strengths}","${killPoints}"`;
          }).join('\n');
        } else {
          csvHeaders = 'Name,Category,Location,Description,Similarity,Employees,Funding,Revenue,Strengths,Weaknesses,Kill Points,Unique Features\n';
          csvRows = filteredCompetitors.map(comp => {
            const strengths = comp.strengths ? comp.strengths.join('; ') : '';
            const weaknesses = comp.weaknesses ? comp.weaknesses.join('; ') : '';
            const killPoints = comp.killPoints ? comp.killPoints.join('; ') : '';
            const uniqueFeatures = comp.uniqueFeatures ? comp.uniqueFeatures.join('; ') : '';
            return `"${comp.name}","${comp.category}","${comp.location}","${comp.description}",${comp.similarity},"${comp.employees || ''}","${comp.funding || ''}","${comp.revenue || ''}","${strengths}","${weaknesses}","${killPoints}","${uniqueFeatures}"`;
          }).join('\n');
        }
        
        const csvContent = csvHeaders + csvRows;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
      } else if (format === 'pdf') {
        const pdfFilename = filename.replace('.csv', '.pdf').replace('.json', '.pdf');
        
        let htmlContent = '';
        if (team === 'sales') {
          htmlContent = generateSalesReportHTML(filteredCompetitors, team);
        } else if (team === 'product') {
          htmlContent = generateProductReportHTML(filteredCompetitors, team);
        } else if (team === 'gtm') {
          htmlContent = generateGTMReportHTML(filteredCompetitors, team);
        } else {
          htmlContent = generateFullReportHTML(filteredCompetitors);
        }

        try {
          const options = { 
            format: 'A4',
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
          };
          const file = { content: htmlContent };
          const pdfBuffer = await pdf.generatePdf(file, options);
          
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
          res.send(pdfBuffer);
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
          // Fallback to text if PDF generation fails
          let textContent = '';
          if (team === 'sales') {
            textContent = generateSalesReportText(filteredCompetitors, team);
          } else if (team === 'product') {
            textContent = generateProductReportText(filteredCompetitors, team);
          } else if (team === 'gtm') {
            textContent = generateGTMReportText(filteredCompetitors, team);
          } else {
            textContent = generateFullReportText(filteredCompetitors);
          }
          const txtFilename = pdfFilename.replace('.pdf', '.txt');
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Disposition', `attachment; filename="${txtFilename}"`);
          res.send(textContent);
        }
      } else {
        res.status(400).json({ error: "Unsupported export format. Use 'json', 'csv', or 'pdf'" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Text report generation functions
function generateSalesReportText(competitors: any[], team: string): string {
  let report = `
ONEBEAT SALES TEAM BATTLE CARDS
Competitive Intelligence Package
Generated: ${new Date().toLocaleDateString()}
==================================================

`;

  competitors.forEach((comp, index) => {
    report += `
[${index + 1}] ${comp.name.toUpperCase()} (${comp.category})
==================================================

COMPANY INFO:
• Location: ${comp.location}
• Employees: ${comp.employees || 'Unknown'}
• Funding: ${comp.funding || 'Unknown'}  
• Revenue: ${comp.revenue || 'Unknown'}

DESCRIPTION:
${comp.description}

PRICING & MARKET:
• Pricing: ${comp.pricing || 'Pricing not disclosed'}
• Implementation Time: ${comp.implementationTime || 'Unknown'}
• Target Market: ${comp.targetMarket || 'Unknown'}

STRENGTHS:
${comp.strengths ? comp.strengths.map((s: string) => `• ${s}`).join('\n') : '• No data available'}

WEAKNESSES:
${comp.weaknesses ? comp.weaknesses.map((w: string) => `• ${w}`).join('\n') : '• No data available'}

KEY BATTLE POINTS:
${comp.killPoints ? comp.killPoints.map((kp: string) => `• ${kp}`).join('\n') : '• No battle points available'}

--------------------------------------------------
`;
  });

  report += `

Generated by Onebeat Competitive Intelligence Platform
`;
  return report;
}

function generateProductReportText(competitors: any[], team: string): string {
  let report = `
ONEBEAT PRODUCT TEAM ANALYSIS
Technical Capability Matrix
Generated: ${new Date().toLocaleDateString()}
==================================================

`;

  competitors.forEach((comp, index) => {
    report += `
[${index + 1}] ${comp.name.toUpperCase()} (${comp.category})
==================================================

COMPANY OVERVIEW:
• Location: ${comp.location}
• Team Size: ${comp.employees || 'Unknown'}
• Funding: ${comp.funding || 'Unknown'}
• Implementation Time: ${comp.implementationTime || 'Unknown'}

TECHNICAL DESCRIPTION:
${comp.description}

TECHNICAL CAPABILITIES:
${comp.capabilities ? Object.entries(comp.capabilities).map(([key, value]: [string, any]) => 
  `• ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value ? 'YES' : 'NO'}`
).join('\n') : '• No capability data available'}

UNIQUE FEATURES:
${comp.uniqueFeatures ? comp.uniqueFeatures.map((f: string) => `• ${f}`).join('\n') : '• No unique features documented'}

TECHNICAL STRENGTHS:
${comp.strengths ? comp.strengths.map((s: string) => `• ${s}`).join('\n') : '• No strengths documented'}

TECHNICAL LIMITATIONS:
${comp.weaknesses ? comp.weaknesses.map((w: string) => `• ${w}`).join('\n') : '• No weaknesses documented'}

PRICING & IMPLEMENTATION:
• Pricing: ${comp.pricing || 'Pricing not disclosed'}
• Implementation Time: ${comp.implementationTime || 'Unknown'}

--------------------------------------------------
`;
  });

  report += `

Generated by Onebeat Competitive Intelligence Platform
`;
  return report;
}

function generateGTMReportText(competitors: any[], team: string): string {
  let report = `
ONEBEAT GTM MARKET ANALYSIS
Competitive Positioning & Market Intelligence
Generated: ${new Date().toLocaleDateString()}
==================================================

`;

  competitors.forEach((comp, index) => {
    report += `
[${index + 1}] ${comp.name.toUpperCase()} (${comp.category})
==================================================

MARKET POSITION:
• Target Market: ${comp.targetMarket || 'Unknown'}
• Similarity Score: ${comp.similarity}/10
• Location: ${comp.location}
• Implementation Time: ${comp.implementationTime || 'Unknown'}

MARKET DESCRIPTION:
${comp.description}

PRICING STRATEGY:
${comp.pricing || 'Pricing not disclosed'}

UNIQUE VALUE PROPOSITIONS:
${comp.uniqueFeatures ? comp.uniqueFeatures.map((f: string) => `• ${f}`).join('\n') : '• No unique features documented'}

COMPETITIVE ADVANTAGES:
${comp.killPoints ? comp.killPoints.map((kp: string) => `• ${kp}`).join('\n') : '• No competitive points documented'}

MARKET STRENGTHS:
${comp.strengths ? comp.strengths.map((s: string) => `• ${s}`).join('\n') : '• No strengths documented'}

--------------------------------------------------
`;
  });

  report += `

Generated by Onebeat Competitive Intelligence Platform
`;
  return report;
}

function generateFullReportText(competitors: any[]): string {
  let report = `
ONEBEAT COMPLETE COMPETITIVE ANALYSIS
Full Database Export
Generated: ${new Date().toLocaleDateString()}
==================================================

`;

  competitors.forEach((comp, index) => {
    report += `
[${index + 1}] ${comp.name.toUpperCase()} (${comp.category})
==================================================

DESCRIPTION:
${comp.description}

COMPANY INFO:
• Location: ${comp.location}
• Employees: ${comp.employees || 'Unknown'}
• Funding: ${comp.funding || 'Unknown'}
• Revenue: ${comp.revenue || 'Unknown'}
• Similarity: ${comp.similarity}/10
• Implementation: ${comp.implementationTime || 'Unknown'}
• Target Market: ${comp.targetMarket || 'Unknown'}

--------------------------------------------------
`;
  });

  report += `

Generated by Onebeat Competitive Intelligence Platform
`;
  return report;
}

function generateSalesReportHTML(competitors: any[], team: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Onebeat Sales Team Battle Cards</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #059669, #0d9488); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
        .competitor { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .competitor h2 { color: #059669; margin-top: 0; }
        .section { margin: 15px 0; }
        .section h3 { color: #0d9488; margin-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .badge { background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .kill-points { background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; }
        .pricing { background: #ecfdf5; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981; }
        .highlight { background: #fee2e2; padding: 10px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⚔️ Onebeat Sales Team Battle Cards</h1>
        <p>Competitive Intelligence Package • Generated ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${competitors.map(comp => `
        <div class="competitor">
          <h2>${comp.name} <span class="badge">${comp.category}</span></h2>
          
          <div class="grid">
            <div>
              <div class="section">
                <h3>🏢 Company Info</h3>
                <p><strong>Location:</strong> ${comp.location}</p>
                <p><strong>Employees:</strong> ${comp.employees || 'Unknown'}</p>
                <p><strong>Funding:</strong> ${comp.funding || 'Unknown'}</p>
                <p><strong>Revenue:</strong> ${comp.revenue || 'Unknown'}</p>
              </div>
              
              <div class="pricing">
                <h3>💰 Pricing & Market</h3>
                <p>${comp.pricing || 'Pricing not disclosed'}</p>
                <p><strong>Similarity:</strong> ${comp.similarity}/10</p>
                <p><strong>Implementation:</strong> ${comp.implementationTime || 'Unknown'}</p>
              </div>
            </div>
            
            <div>
              <div class="kill-points">
                <h3>🎯 Kill Points</h3>
                <ul>
                  ${comp.killPoints ? comp.killPoints.map((kp: string) => `<li>${kp}</li>`).join('') : '<li>No competitive points documented</li>'}
                </ul>
              </div>
              
              <div class="section">
                <h3>✨ Unique Features</h3>
                <ul>
                  ${comp.uniqueFeatures ? comp.uniqueFeatures.map((f: string) => `<li>${f}</li>`).join('') : '<li>No unique features documented</li>'}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>📋 Description</h3>
            <p>${comp.description}</p>
          </div>
          
          <div class="grid">
            <div class="section">
              <h3>💪 Strengths</h3>
              <ul>
                ${comp.strengths ? comp.strengths.map((s: string) => `<li>${s}</li>`).join('') : '<li>No strengths documented</li>'}
              </ul>
            </div>
            
            <div class="section">
              <h3>⚠️ Weaknesses</h3>
              <ul>
                ${comp.weaknesses ? comp.weaknesses.map((w: string) => `<li>${w}</li>`).join('') : '<li>No weaknesses documented</li>'}
              </ul>
            </div>
          </div>
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 40px; color: #666;">
        <p>Generated by Onebeat Competitive Intelligence Platform</p>
      </div>
    </body>
    </html>
  `;
}

function generateProductReportHTML(competitors: any[], team: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Onebeat Product Team Analysis</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
        .competitor { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .competitor h2 { color: #7c3aed; margin-top: 0; }
        .section { margin: 15px 0; }
        .section h3 { color: #2563eb; margin-bottom: 5px; }
        .capabilities { background: #f0f9ff; padding: 15px; border-radius: 5px; border-left: 4px solid #0ea5e9; }
        .features { background: #faf5ff; padding: 15px; border-radius: 5px; border-left: 4px solid #8b5cf6; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .badge { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .capability-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 12px; }
        .cap-item { background: #dbeafe; padding: 5px 10px; border-radius: 5px; text-align: center; }
        .cap-yes { background: #dcfce7; color: #166534; }
        .cap-no { background: #fecaca; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔧 Onebeat Product Team Analysis</h1>
        <p>Technical Capability Matrix • Generated ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${competitors.map(comp => `
        <div class="competitor">
          <h2>${comp.name} <span class="badge">${comp.category}</span></h2>
          <div class="grid">
            <div>
              <div class="section">
                <h3>🏢 Company Overview</h3>
                <p><strong>Location:</strong> ${comp.location}</p>
                <p><strong>Team Size:</strong> ${comp.employees || 'Unknown'}</p>
                <p><strong>Funding:</strong> ${comp.funding || 'Unknown'}</p>
                <p><strong>Implementation:</strong> ${comp.implementationTime || 'Unknown'}</p>
              </div>
              
              <div class="features">
                <h3>✨ Unique Features</h3>
                <ul>
                  ${comp.uniqueFeatures ? comp.uniqueFeatures.map((f: string) => `<li>${f}</li>`).join('') : '<li>No unique features documented</li>'}
                </ul>
              </div>
            </div>
            
            <div>
              <div class="capabilities">
                <h3>⚙️ Technical Capabilities</h3>
                <div class="capability-grid">
                  ${comp.capabilities ? Object.entries(comp.capabilities).map(([key, value]: [string, any]) => 
                    `<div class="cap-item ${value ? 'cap-yes' : 'cap-no'}">${key.replace(/([A-Z])/g, ' $1').trim()}</div>`
                  ).join('') : '<div>No capability data available</div>'}
                </div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>📋 Technical Description</h3>
            <p>${comp.description}</p>
          </div>
          
          <div class="grid">
            <div class="section">
              <h3>💪 Technical Strengths</h3>
              <ul>
                ${comp.strengths ? comp.strengths.map((s: string) => `<li>${s}</li>`).join('') : '<li>No strengths documented</li>'}
              </ul>
            </div>
            
            <div class="section">
              <h3>⚠️ Technical Limitations</h3>
              <ul>
                ${comp.weaknesses ? comp.weaknesses.map((w: string) => `<li>${w}</li>`).join('') : '<li>No weaknesses documented</li>'}
              </ul>
            </div>
          </div>
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 40px; color: #666;">
        <p>Generated by Onebeat Competitive Intelligence Platform</p>
      </div>
    </body>
    </html>
  `;
}

function generateGTMReportHTML(competitors: any[], team: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Onebeat GTM Team Market Analysis</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
        .competitor { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .competitor h2 { color: #dc2626; margin-top: 0; }
        .section { margin: 15px 0; }
        .section h3 { color: #ea580c; margin-bottom: 5px; }
        .market-info { background: #fef2f2; padding: 15px; border-radius: 5px; border-left: 4px solid #ef4444; }
        .positioning { background: #fff7ed; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .badge { background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Onebeat GTM Market Analysis</h1>
        <p>Competitive Positioning & Market Intelligence • Generated ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${competitors.map(comp => `
        <div class="competitor">
          <h2>${comp.name} <span class="badge">${comp.category}</span></h2>
          <div class="grid">
            <div>
              <div class="market-info">
                <h3>🎯 Market Position</h3>
                <p><strong>Target Market:</strong> ${comp.targetMarket || 'Unknown'}</p>
                <p><strong>Similarity Score:</strong> ${comp.similarity}/10</p>
                <p><strong>Location:</strong> ${comp.location}</p>
                <p><strong>Implementation Time:</strong> ${comp.implementationTime || 'Unknown'}</p>
              </div>
              
              <div class="positioning">
                <h3>💰 Pricing Strategy</h3>
                <p>${comp.pricing || 'Pricing not disclosed'}</p>
              </div>
            </div>
            
            <div>
              <div class="section">
                <h3>✨ Unique Value Props</h3>
                <ul>
                  ${comp.uniqueFeatures ? comp.uniqueFeatures.map((f: string) => `<li>${f}</li>`).join('') : '<li>No unique features documented</li>'}
                </ul>
              </div>
              
              <div class="section">
                <h3>🎯 Competitive Advantages</h3>
                <ul>
                  ${comp.killPoints ? comp.killPoints.map((kp: string) => `<li>${kp}</li>`).join('') : '<li>No competitive points documented</li>'}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>📋 Market Description</h3>
            <p>${comp.description}</p>
          </div>
          
          <div class="section">
            <h3>💪 Market Strengths</h3>
            <ul>
              ${comp.strengths ? comp.strengths.map((s: string) => `<li>${s}</li>`).join('') : '<li>No strengths documented</li>'}
            </ul>
          </div>
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 40px; color: #666;">
        <p>Generated by Onebeat Competitive Intelligence Platform</p>
      </div>
    </body>
    </html>
  `;
}

function generateFullReportHTML(competitors: any[]): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Onebeat Complete Competitive Analysis</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #1e3a8a, #7c3aed, #dc2626); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
        .competitor { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .competitor h2 { color: #1e3a8a; margin-top: 0; }
        .section { margin: 15px 0; }
        .section h3 { color: #7c3aed; margin-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .badge { background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Onebeat Complete Competitive Analysis</h1>
        <p>Full Database Export • Generated ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${competitors.map(comp => `
        <div class="competitor">
          <h2>${comp.name} <span class="badge">${comp.category}</span></h2>
          <div class="section">
            <h3>📋 Description</h3>
            <p>${comp.description}</p>
          </div>
          <div class="grid">
            <div>
              <p><strong>Location:</strong> ${comp.location}</p>
              <p><strong>Employees:</strong> ${comp.employees || 'Unknown'}</p>
              <p><strong>Funding:</strong> ${comp.funding || 'Unknown'}</p>
              <p><strong>Revenue:</strong> ${comp.revenue || 'Unknown'}</p>
            </div>
            <div>
              <p><strong>Similarity:</strong> ${comp.similarity}/10</p>
              <p><strong>Implementation:</strong> ${comp.implementationTime || 'Unknown'}</p>
              <p><strong>Target Market:</strong> ${comp.targetMarket || 'Unknown'}</p>
            </div>
          </div>
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 40px; color: #666;">
        <p>Generated by Onebeat Competitive Intelligence Platform</p>
      </div>
    </body>
    </html>
  `;
}
