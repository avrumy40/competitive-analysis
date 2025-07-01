# Onebeat Competitive Intelligence Platform

## Overview

This is a competitive intelligence dashboard built for Onebeat to track and analyze competitors in the retail inventory optimization space. The application provides battle cards, capability matrices, positioning charts, and team resources to support sales, product, and go-to-market teams.

## System Architecture

### Full-Stack TypeScript Application
- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Monorepo Structure
The application follows a monorepo pattern with shared types and schemas:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript schemas and types

## Key Components

### Frontend Architecture
- **Component-based UI**: Built with React and shadcn/ui components
- **Responsive Design**: Tailwind CSS with glassmorphism styling effects
- **Interactive Visualizations**: Custom charts and matrices for competitive analysis
- **Modern Animations**: Framer Motion for smooth transitions and interactions

### Backend Architecture
- **RESTful API**: Express.js with TypeScript for type safety
- **Modular Storage**: Interface-based storage abstraction (currently in-memory, designed for database integration)
- **Route Organization**: Centralized route registration with proper error handling
- **Development Tools**: Hot reload with Vite integration in development

### Data Layer
- **Schema Definition**: Centralized schemas using Drizzle ORM with Zod validation
- **Type Safety**: End-to-end TypeScript types from database to frontend
- **Migration Support**: Drizzle Kit for database schema management

## Data Flow

### Client-Server Communication
1. Frontend components use TanStack Query hooks for data fetching
2. API requests go through centralized query client with error handling
3. Server responds with validated data using shared TypeScript interfaces
4. Client updates UI reactively based on server state changes

### Storage Layer
- Current implementation uses in-memory storage with predefined competitor data
- Storage interface allows easy migration to PostgreSQL database
- Drizzle ORM configured for PostgreSQL with connection string from environment

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, Vite for build tooling
- **Backend**: Express.js, Node.js runtime
- **Database**: PostgreSQL (configured), Neon serverless connector
- **ORM**: Drizzle ORM with PostgreSQL dialect

### UI and Styling
- **Component Library**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Icons**: Lucide React icons
- **Animations**: Framer Motion for interactions

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Build Tools**: Vite for frontend, esbuild for backend bundling
- **Replit Integration**: Configured for Replit development environment

## Deployment Strategy

### Production Build Process
1. Frontend built with Vite to static assets in `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static assets served by Express in production
4. Database migrations run via Drizzle Kit

### Environment Configuration
- **Development**: Hot reload with Vite dev server proxy
- **Production**: Express serves static files and API routes
- **Database**: PostgreSQL connection via environment variable
- **Deployment**: Configured for Replit autoscale deployment

### Performance Optimizations
- Code splitting and lazy loading ready
- Static asset optimization through Vite
- Query caching and invalidation with TanStack Query
- Database query optimization through Drizzle ORM

## Deployment

### Render Free Deployment
The application is configured for deployment on Render Free tier with:
- **render.yaml**: Service configuration with Node.js environment
- **Health check**: `/health` endpoint for monitoring
- **Build process**: Frontend (Vite) + Backend (esbuild) bundling
- **Environment**: Production-ready with PORT configuration
- **Static serving**: Optimized asset delivery

### Deployment Files
- `render.yaml` - Render service configuration
- `Dockerfile` - Container setup (optional)
- `README.md` - Deployment instructions
- Health check endpoint at `/health`

## Changelog
- June 30, 2025: Added Render Free deployment configuration with render.yaml, Dockerfile, health check endpoint, and comprehensive deployment documentation
- June 30, 2025: Added news button to battle cards opening Google News with simple company name search queries in new tabs
- June 30, 2025: Updated positioning chart axes to "Implementation Speed vs Automation Level" focusing on ease of implementation & fast ROI vs level of automation and auto execution, repositioned competitors to match strategic landscape
- June 30, 2025: Added comprehensive edit and delete functionality for competitors with validation dialogs and proper error handling
- June 30, 2025: Updated JTBD jobs: Dynamic Pricing → Special Events Dynamic Management, combined Demand Sensing with Inventory Flow Management, added Assortment Management & Validation as Medium Priority
- June 30, 2025: Focused JTBD mapping on In-Season Optimization only, removing Pre-Season Planning section to align with current capabilities
- June 30, 2025: Replaced "Planning Assistant" with "Dynamic Inventory Targets" - AI powered sku-location optimization based on sales & supply chain performance to keep stock in its optimal distribution (Onebeat's third exclusive feature)
- June 28, 2025: Updated to clean, minimal design with white backgrounds, subtle gradients, and dark text
- June 27, 2025: Added PDF/text export functionality and team-specific download buttons on resource cards
- June 27, 2025: Enhanced team-specific export functionality with CSV format for Sales, Product, and GTM teams
- June 26, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.