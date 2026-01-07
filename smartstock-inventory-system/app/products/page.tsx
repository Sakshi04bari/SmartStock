"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Package, X } from "lucide-react"
import { products as initialProducts } from "@/lib/mock-data"
import { InventoryCharts } from "@/components/inventory-charts"

export default function ProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(initialProducts)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    stock: "",
    minStock: "",
    maxStock: "",
    price: "",
    city: "",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))

    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [router])

  const handleAddProduct = () => {
    if (!formData.name || !formData.sku || !formData.stock || !formData.price) {
      alert("Please fill in all required fields")
      return
    }

    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      minStock: Number.parseInt(formData.minStock) || 10,
      maxStock: Number.parseInt(formData.maxStock) || 100,
      price: Number.parseFloat(formData.price),
      city: formData.city || "New York",
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    setFormData({
      name: "",
      sku: "",
      category: "",
      stock: "",
      minStock: "",
      maxStock: "",
      price: "",
      city: "",
    })
    setShowModal(false)
  }

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const handleEditProduct = (id: number) => {
    const productToEdit = products.find((p) => p.id === id)
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        category: productToEdit.category,
        stock: productToEdit.stock.toString(),
        minStock: productToEdit.minStock.toString(),
        maxStock: productToEdit.maxStock.toString(),
        price: productToEdit.price.toString(),
        city: productToEdit.city,
      })
      setShowModal(true)
    }
  }

  if (!user) return null

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (stock: number, minStock: number, maxStock: number) => {
    if (stock < minStock) return { label: "Understock", color: "text-red-600 bg-red-100 dark:bg-red-950" }
    if (stock > maxStock) return { label: "Overstock", color: "text-amber-600 bg-amber-100 dark:bg-amber-950" }
    return { label: "Optimal", color: "text-blue-600 bg-blue-100 dark:bg-blue-950" }
  }

  const understockCount = products.filter((p) => p.stock < p.minStock).length
  const overstockCount = products.filter((p) => p.stock > p.maxStock).length
  const optimalCount = products.filter((p) => p.stock >= p.minStock && p.stock <= p.maxStock).length

  return (
    <DashboardLayout role={user.role}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your inventory products and stock levels</p>
          </div>
          {user.role === "admin" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        <InventoryCharts products={products} />

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total Products</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{understockCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Understock</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{overstockCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Overstock</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{optimalCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Optimal Stock</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-slate-700" style={{ backgroundColor: "#2D5AA0" }}>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">Product</th>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">SKU</th>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">Category</th>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">Stock</th>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">City</th>
                    <th className="text-left py-3 px-4 font-bold text-sm text-white">Price</th>
                    {user.role === "admin" && (
                      <th className="text-right py-3 px-4 font-bold text-sm text-white">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock, product.minStock, product.maxStock)
                    return (
                      <tr
                        key={product.id}
                        className="border-b dark:border-slate-700 bg-cyan-50 dark:bg-slate-700 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-bold text-foreground dark:text-white">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground dark:text-white font-semibold text-sm">
                          {product.sku}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <Badge variant="outline" className="dark:bg-slate-600 dark:text-white font-semibold">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-foreground dark:text-white">{product.stock}</span>
                          <span className="text-xs text-foreground dark:text-slate-300 ml-1">/ {product.maxStock}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className={`${status.color} border-0 font-semibold`}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-foreground dark:text-white font-semibold text-sm">
                          {product.city}
                        </td>
                        <td className="py-4 px-4 font-bold text-foreground dark:text-white text-sm">
                          ${product.price}
                        </td>
                        {user.role === "admin" && (
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditProduct(product.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm dark:bg-slate-800 shadow-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b dark:border-slate-700">
              <h2 className="text-lg font-bold">Add Product</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wireless Mouse"
                  className="dark:bg-slate-700 text-sm h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">SKU *</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., WM-001"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Electronics"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Stock *</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Min</label>
                  <Input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="10"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Max</label>
                  <Input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    placeholder="100"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Price *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className="dark:bg-slate-700 text-sm h-8"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-8 text-sm">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 h-8 text-sm"
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
