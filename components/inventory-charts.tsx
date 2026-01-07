"use client"

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InventoryChartsProps {
  products: any[]
}

export function InventoryCharts({ products }: InventoryChartsProps) {
  const stockStatusData = [
    {
      name: "Understock",
      value: products.filter((p) => p.stock < p.minStock).length,
      fill: "#EF4444",
    },
    {
      name: "Optimal",
      value: products.filter((p) => p.stock >= p.minStock && p.stock <= p.maxStock).length,
      fill: "#3B82F6",
    },
    {
      name: "Overstock",
      value: products.filter((p) => p.stock > p.maxStock).length,
      fill: "#F59E0B",
    },
  ]

  const topProductsData = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8)
    .map((p) => ({
      name: p.name.substring(0, 12),
      stock: p.stock,
      minStock: p.minStock,
      maxStock: p.maxStock,
    }))

  const citiesData = {}
  products.forEach((p) => {
    if (!citiesData[p.city]) {
      citiesData[p.city] = { city: p.city, products: 0, stock: 0 }
    }
    citiesData[p.city].products += 1
    citiesData[p.city].stock += p.stock
  })

  const citiesChartData = Object.values(citiesData).slice(0, 8)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Stock Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Top Products by Stock Level</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#3B82F6" name="Current Stock" />
              <Bar dataKey="maxStock" fill="#F59E0B" name="Max Stock" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-2 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Products by City</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={citiesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#10B981" name="Total Stock" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
