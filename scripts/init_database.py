import sqlite3
import os
from datetime import datetime

# Create database directory if it doesn't exist
os.makedirs('database', exist_ok=True)

# Connect to SQLite database
conn = sqlite3.connect('database/smartstock.db')
cursor = conn.cursor()

# Create products table
cursor.execute('''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    max_stock INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Create users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'manager')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Create cities table
cursor.execute('''
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    stores INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# -----------------------------
# NEW TABLE — Understock Reorders
# -----------------------------
cursor.execute('''
CREATE TABLE IF NOT EXISTS understock_reorders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    reorder_qty INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_cost REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- pending / ordered / received
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
)
''')

# -----------------------------
# NEW TABLE — Overstock Promotions
# -----------------------------
cursor.execute('''
CREATE TABLE IF NOT EXISTS overstock_promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    promotion_type TEXT NOT NULL,  -- e.g., "discount", "bundle", "flash sale"
    discount_percent REAL DEFAULT 0,
    affected_units INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
)
''')

# Insert sample data
cities = [
    ('New York', 5),
    ('Los Angeles', 4),
    ('Chicago', 3),
    ('Houston', 3),
    ('Phoenix', 2),
    ('Philadelphia', 2),
]

for city in cities:
    cursor.execute('INSERT OR IGNORE INTO cities (name, stores) VALUES (?, ?)', city)

# Insert sample products
products = [
    ('Wireless Mouse', 'WM-001', 45, 20, 100, 29.99, 'New York'),
    ('USB-C Cable', 'UC-002', 15, 30, 150, 12.99, 'Los Angeles'),
    ('Laptop Stand', 'LS-003', 156, 25, 80, 49.99, 'Chicago'),
    ('Keyboard', 'KB-004', 8, 15, 60, 89.99, 'New York'),
    ('Webcam HD', 'WC-005', 67, 20, 100, 79.99, 'Houston'),
    ('Monitor 27"', 'MN-006', 34, 10, 40, 299.99, 'Phoenix'),
    ('Headphones', 'HP-007', 5, 25, 100, 149.99, 'Philadelphia'),
    ('Mouse Pad', 'MP-008', 203, 50, 150, 19.99, 'New York'),
]

for product in products:
    cursor.execute('''
        INSERT OR IGNORE INTO products (name, sku, stock, min_stock, max_stock, price, city)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', product)

# Insert default users
users = [
    ('admin', 'admin123', 'admin'),
    ('manager', 'manager123', 'manager'),
]

for user in users:
    cursor.execute('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)', user)

conn.commit()
conn.close()

print("✅ Database initialized successfully!")
print("📊 Tables created: products, users, cities, understock_reorders, overstock_promotions")
print("👤 Default users: admin/admin123, manager/manager123")
