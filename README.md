# Inventory Management Frontend

Modern React + TypeScript + Vite frontend for the Inventory Management System.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

## Features

- Dashboard with statistics and low stock alerts
- Product management (CRUD operations)
- Search and filter products
- Low stock notifications
- Responsive design
- Type-safe API integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn)

### Installation

Choose one of the following methods:

**Using npm:**
```bash
# Install dependencies
npm install
```

**Using yarn (recommended):**
```bash
# Install yarn if not already installed
npm install -g yarn

# Install dependencies
yarn install
```

### Development

**Using npm:**
```bash
# Start development server (runs on http://localhost:3000)
npm run dev
```

**Using yarn:**
```bash
# Start development server (runs on http://localhost:3000)
yarn dev
```

The dev server includes a proxy configuration that forwards `/api` requests to `http://localhost:8080` (the backend).

### Build

**Using npm:**
```bash
# Build for production
npm run build
```

**Using yarn:**
```bash
# Build for production
yarn build
```

### Preview Production Build

**Using npm:**
```bash
# Preview production build
npm run preview
```

**Using yarn:**
```bash
# Preview production build
yarn preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── ProductForm.tsx  # Product form component
├── pages/
│   ├── Dashboard.tsx    # Dashboard page
│   └── Products.tsx     # Products list page
├── services/
│   ├── api.ts          # Axios instance
│   └── productService.ts # Product API service
├── types/
│   └── product.types.ts # TypeScript types
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## API Integration

The frontend connects to the Spring Boot backend running on port 8080. Make sure the backend is running before starting the frontend.

Backend API endpoints:
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/stats/low-stock-count` - Get low stock count

## Environment Variables

Configure the backend URL in `vite.config.ts` if needed (default: `http://localhost:8080`).

