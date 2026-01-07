<<<<<<< HEAD
# SmartStock Inventory Optimization System

A comprehensive retail inventory management system with real-time analytics, stock optimization, and role-based access control.

## Features

- **Black & Gold Modern UI** - Sleek, professional design with high contrast
- **Role-Based Access** - Admin and Manager portals with different permissions
- **Real-Time Dashboard** - Analytics with charts and inventory insights
- **Stock Management** - Track understock and overstock items
- **City Search** - Quick search functionality for filtering locations
- **SQLite Database** - Persistent storage for products, users, and cities
- **Python Backend** - RESTful API server for data operations

## Quick Start

### 1. Initialize Database
```bash
python scripts/init_database.py
```

### 2. Start API Server
```bash
python scripts/api_server.py
```
The server will run on `http://localhost:8000`

### 3. Run the Application
Open your browser and navigate to the application URL

### Default Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Manager**: username: `manager`, password: `manager123`

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Python HTTP Server
- **Database**: SQLite3
- **UI Components**: shadcn/ui with custom black/gold theme

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/cities` - Get all cities
- `POST /api/login` - User authentication

## Database Schema

### Products
- id, name, sku, stock, min_stock, max_stock, price, city, timestamps

### Users
- id, username, password, role, created_at

### Cities
- id, name, stores, created_at
=======
**SmartStock — Retail Inventory Optimization System**

SmartStock is a Flask-based retail inventory optimization and stock-forecasting dashboard.
It supports MySQL & PostgreSQL, provides live stock alerts, forecast insights, store-wise dashboards, and email notifications to managers using SendGrid.

The system dynamically syncs stores, cities, products, and sales data, and automatically creates required tables on startup.

**🚀 Features**

🔐 Role-based login (Admin / City Manager / Store Manager)

🗄️ Dual DB Support — MySQL + PostgreSQL (auto-switch)

⚙️ Auto-table creation & data initialization

📊 Inventory & Sales Dashboard

⏳ Live stock & forecast alerts (background updater)

✉️ Email alerts to store managers via SendGrid

🕒 Login logs with device + IP tracking

🧾 Supports demo mode if data files are missing
>>>>>>> e8aa8ff05d882b5f42343332e9cb6d174e3b9440
