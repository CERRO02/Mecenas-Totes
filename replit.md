# CanvasCo - Artist Tote Bag Marketplace

## Overview

CanvasCo is a full-stack e-commerce application that connects sustainable fashion with emerging artists. The platform allows users to discover and purchase eco-friendly tote bags featuring artwork from featured artists. The application is built as a modern web platform with a React frontend, Express.js backend, and PostgreSQL database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for cart management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Comprehensive shadcn/ui component system with custom CanvasCo branding

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for artists, products, cart, and orders
- **Development**: Hot reload with tsx for TypeScript execution

### Database & ORM
- **Database**: PostgreSQL (configured for deployment)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless driver for PostgreSQL

## Key Components

### E-commerce Features
- **Product Catalog**: Browse and search tote bags with artist collaborations
- **Shopping Cart**: Session-based cart with persistent storage
- **Checkout Process**: Stripe integration for secure payment processing
- **Order Management**: Order tracking and confirmation system

### Artist Showcase
- **Featured Artists**: Weekly rotating featured artist system
- **Artist Profiles**: Detailed artist information with bio, location, and style
- **Product Attribution**: Clear artist credit on all products

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Progressive Enhancement**: Graceful degradation for accessibility
- **Toast Notifications**: User feedback for all interactions
- **Loading States**: Comprehensive loading indicators throughout the app

## Data Flow

### Client-Server Communication
1. **Frontend**: React components make API requests through TanStack Query
2. **API Layer**: Express routes handle business logic and data validation
3. **Database**: Drizzle ORM manages PostgreSQL interactions
4. **Response**: Typed data flows back through the same chain

### Shopping Cart Flow
1. **Session Management**: Browser generates unique session ID stored in localStorage
2. **Cart Operations**: Add/remove/update items via API endpoints
3. **Persistence**: Cart data stored in PostgreSQL with session association
4. **Checkout**: Cart contents transferred to order system upon payment

### Payment Processing
1. **Stripe Integration**: Frontend initializes Stripe Elements
2. **Payment Intent**: Backend creates Stripe payment intent
3. **Confirmation**: Frontend confirms payment and notifies backend
4. **Order Creation**: Backend creates order record upon successful payment

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full type safety across frontend and backend
- **Build Tools**: Vite for frontend, esbuild for backend production builds

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component primitives via shadcn/ui
- **Lucide React**: Icon library for consistent iconography

### Backend Services
- **Express.js**: Web application framework
- **Drizzle ORM**: Database toolkit and ORM
- **Stripe**: Payment processing platform
- **Zod**: Runtime type validation

### Development Tools
- **Replit**: Development environment with hot reload
- **ESLint/Prettier**: Code quality and formatting
- **PostCSS**: CSS processing and optimization

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles TypeScript server to `dist/index.js`
- **Static Assets**: Served through Express static middleware

### Environment Configuration
- **Development**: Hot reload with Vite dev server and tsx
- **Production**: Compiled JavaScript with Node.js execution
- **Database**: Environment-based connection strings for different stages

### Replit Deployment
- **Autoscale**: Configured for automatic scaling based on traffic
- **Port Configuration**: Express server on port 5000, external port 80
- **Build Process**: Automated build pipeline with npm scripts

## Changelog

Changelog:
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.