"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { InventoryCharts } from "@/components/inventory-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function ChartsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const salesTrendData = [
    { month: "Jan", sales: 4200, revenue: 24000 },
    { month: "Feb", sales: 3800, revenue: 22100 },
    { month: "Mar", sales: 5200, revenue: 29800 },
    { month: "Apr", sales: 4800, revenue: 27500 },
    { month: "May", sales: 6200, revenue: 35200 },
    { month: "Jun", sales: 5800, revenue: 32100 },
  ]

  const categoryData = [
    { category: "Electronics", products: 28, stock: 1200, sales: 3500 },
    { category: "Clothing", products: 22, stock: 980, sales: 2800 },
    { category: "Home & Garden", products: 18, stock: 750, sales: 1900 },
    { category: "Sports", products: 16, stock: 620, sales: 1600 },
    { category: "Books", products: 12, stock: 450, sales: 1200 },
    { category: "Toys", products: 4, stock: 200, sales: 600 },
  ]

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground text-lg">Real-time inventory analytics and business intelligence</p>
        </div>

        {/* Key metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2 border-l-[#00C5C8] border-t-[#00C5C8] border-r-[#00C5C8]/50 border-b-[#00C5C8]/50 shadow-lg hover:shadow-2xl hover:shadow-[#00C5C8]/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-transparent to-[#00C5C8]/5 dark:to-[#00C5C8]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#00C5C8]">{mockProducts.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Across all cities and stores</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-l-red-500 border-t-red-500 border-r-red-500/50 border-b-red-500/50 shadow-lg hover:shadow-2xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-transparent to-red-500/5 dark:to-red-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Understock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                {mockProducts.filter((p) => p.stock < p.minStock).length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-l-amber-500 border-t-amber-500 border-r-amber-500/50 border-b-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-transparent to-amber-500/5 dark:to-amber-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overstock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {mockProducts.filter((p) => p.stock > p.maxStock).length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Consider promotions</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-l-green-500 border-t-green-500 border-r-green-500/50 border-b-green-500/50 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-transparent to-green-500/5 dark:to-green-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Optimal Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {mockProducts.filter((p) => p.stock >= p.minStock && p.stock <= p.maxStock).length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Healthy inventory levels</p>
            </CardContent>
          </Card>
        </div>

        {/* Main charts */}
        <InventoryCharts products={mockProducts} />

        {/* Sales and category analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-2 border-[#00C5C8]/30 hover:border-[#00C5C8] hover:shadow-2xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[#00C5C8]">Sales Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.5} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#00C5C8" name="Units Sold" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#70E7D1" name="Revenue ($)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#00C5C8]/30 hover:border-[#00C5C8] hover:shadow-2xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[#00C5C8]">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.5} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="products" fill="#00C5C8" name="Products" />
                  <Bar dataKey="sales" fill="#70E7D1" name="Sales" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg border-2 border-[#00C5C8]/30 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base text-[#00C5C8]">Inventory Turnover Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00C5C8]">4.2x</div>
              <p className="text-sm text-muted-foreground mt-2">Items sold and replaced per year</p>
              <p className="text-xs text-[#70E7D1] font-medium mt-3">↑ 12% from last quarter</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#00C5C8]/30 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base text-[#00C5C8]">Average Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00C5C8]">$87.5K</div>
              <p className="text-sm text-muted-foreground mt-2">Total inventory value across stores</p>
              <p className="text-xs text-[#70E7D1] font-medium mt-3">↑ 8% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#00C5C8]/30 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base text-[#00C5C8]">Stock Out Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00C5C8]">3.2%</div>
              <p className="text-sm text-muted-foreground mt-2">Items below minimum threshold</p>
              <p className="text-xs text-red-600 font-medium mt-3">↑ 0.5% requires attention</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
