"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

const alerts = [
  { id: 1, type: "understock", product: "Keyboard", sku: "KB-004", stock: 8, level: "critical" },
  { id: 2, type: "understock", product: "Headphones", sku: "HP-007", stock: 5, level: "critical" },
  { id: 3, type: "understock", product: "USB-C Cable", sku: "UC-002", stock: 15, level: "warning" },
  { id: 4, type: "overstock", product: "Mouse Pad", sku: "MP-008", stock: 203, level: "warning" },
  { id: 5, type: "overstock", product: "Laptop Stand", sku: "LS-003", stock: 156, level: "warning" },
]

export function StockAlerts() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-2 ${
                alert.level === "critical" ? "border-red-200 bg-red-50/50" : "border-orange-200 bg-orange-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {alert.type === "understock" ? (
                    <TrendingDown
                      className={`h-5 w-5 flex-shrink-0 ${
                        alert.level === "critical" ? "text-red-600" : "text-orange-600"
                      }`}
                    />
                  ) : (
                    <TrendingUp className="h-5 w-5 flex-shrink-0 text-purple-600" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{alert.product}</p>
                      {alert.level === "critical" && (
                        <Badge variant="destructive" className="text-xs h-5">
                          Critical
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SKU: {alert.sku} • Stock: {alert.stock} units
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
