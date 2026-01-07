from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
from urllib.parse import urlparse, parse_qs
import os

DB_PATH = 'database/smartstock.db'

class SmartStockHandler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/products':
            self.get_products()
        elif path == '/api/cities':
            self.get_cities()
        elif path.startswith('/api/products/'):
            product_id = path.split('/')[-1]
            self.get_product(product_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_POST(self):
        if self.path == '/api/products':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            self.create_product(data)
        elif self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            self.login(data)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_PUT(self):
        if self.path.startswith('/api/products/'):
            product_id = self.path.split('/')[-1]
            content_length = int(self.headers['Content-Length'])
            put_data = self.rfile.read(content_length)
            data = json.loads(put_data.decode('utf-8'))
            self.update_product(product_id, data)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_DELETE(self):
        if self.path.startswith('/api/products/'):
            product_id = self.path.split('/')[-1]
            self.delete_product(product_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def get_products(self):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM products ORDER BY id DESC')
            products = []
            for row in cursor.fetchall():
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'sku': row[2],
                    'stock': row[3],
                    'minStock': row[4],
                    'maxStock': row[5],
                    'price': row[6],
                    'city': row[7],
                    'createdAt': row[8],
                    'updatedAt': row[9]
                })
            conn.close()
            self._set_headers()
            self.wfile.write(json.dumps(products).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def get_product(self, product_id):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                product = {
                    'id': row[0],
                    'name': row[1],
                    'sku': row[2],
                    'stock': row[3],
                    'minStock': row[4],
                    'maxStock': row[5],
                    'price': row[6],
                    'city': row[7],
                    'createdAt': row[8],
                    'updatedAt': row[9]
                }
                self._set_headers()
                self.wfile.write(json.dumps(product).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({'error': 'Product not found'}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def create_product(self, data):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO products (name, sku, stock, min_stock, max_stock, price, city)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (data['name'], data['sku'], data['stock'], data['minStock'], 
                  data['maxStock'], data['price'], data['city']))
            conn.commit()
            product_id = cursor.lastrowid
            conn.close()
            
            self._set_headers(201)
            self.wfile.write(json.dumps({'id': product_id, 'message': 'Product created successfully'}).encode())
        except sqlite3.IntegrityError:
            self._set_headers(400)
            self.wfile.write(json.dumps({'error': 'Product with this SKU already exists'}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def update_product(self, product_id, data):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE products 
                SET name=?, sku=?, stock=?, min_stock=?, max_stock=?, price=?, city=?, updated_at=CURRENT_TIMESTAMP
                WHERE id=?
            ''', (data['name'], data['sku'], data['stock'], data['minStock'], 
                  data['maxStock'], data['price'], data['city'], product_id))
            conn.commit()
            conn.close()
            
            self._set_headers()
            self.wfile.write(json.dumps({'message': 'Product updated successfully'}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def delete_product(self, product_id):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('DELETE FROM products WHERE id=?', (product_id,))
            conn.commit()
            conn.close()
            
            self._set_headers()
            self.wfile.write(json.dumps({'message': 'Product deleted successfully'}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def get_cities(self):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM cities ORDER BY name')
            cities = []
            for row in cursor.fetchall():
                cities.append({
                    'id': row[0],
                    'name': row[1],
                    'stores': row[2],
                    'createdAt': row[3]
                })
            conn.close()
            self._set_headers()
            self.wfile.write(json.dumps(cities).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def login(self, data):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE username=? AND password=?', 
                         (data['username'], data['password']))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                user = {
                    'id': row[0],
                    'username': row[1],
                    'role': row[3]
                }
                self._set_headers()
                self.wfile.write(json.dumps(user).encode())
            else:
                self._set_headers(401)
                self.wfile.write(json.dumps({'error': 'Invalid credentials'}).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SmartStockHandler)
    print(f'🚀 SmartStock API Server running on http://localhost:{port}')
    print(f'📡 Endpoints available:')
    print(f'   GET    /api/products')
    print(f'   POST   /api/products')
    print(f'   PUT    /api/products/:id')
    print(f'   DELETE /api/products/:id')
    print(f'   GET    /api/cities')
    print(f'   POST   /api/login')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
