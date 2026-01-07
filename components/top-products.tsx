"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const topProducts = [
  { id: 1, name: 'Monitor 27"', sales: 234, revenue: 70197, trend: "+15%" },
  { id: 2, name: "Keyboard", sales: 189, revenue: 17001, trend: "+12%" },
  { id: 3, name: "Headphones", sales: 167, revenue: 25048, trend: "+8%" },
  { id: 4, name: "Webcam HD", sales: 145, revenue: 11598, trend: "+22%" },
]

export function TopProducts() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Top Performing Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0">
                <span className="font-bold text-blue-600">#{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm">${product.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">{product.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
