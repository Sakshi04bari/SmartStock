"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingDown, Package, AlertCircle, ShoppingCart, X } from "lucide-react"
import { products } from "@/lib/mock-data"

export default function UnderstockPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState<any>(null)
  const [showReorderModal, setShowReorderModal] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) return null

  const understockedItems = products
    .filter((p) => p.stock < p.minStock)
    .map((p) => ({
      ...p,
      reorderQty: p.minStock * 1.5 - p.stock,
    }))

  return (
    <DashboardLayout role={user.role}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Understocked Items</h1>
              <p className="text-muted-foreground">Items below minimum stock levels requiring attention</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Total Understocked</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{understockedItems.length}</div>
                <p className="text-xs font-semibold text-foreground mt-1">Items below minimum</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Reorder Value</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ${understockedItems.reduce((sum, item) => sum + item.reorderQty * item.price, 0).toLocaleString()}
                </div>
                <p className="text-xs font-semibold text-foreground mt-1">Total reorder cost</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Critical Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {understockedItems.filter((item) => item.stock / item.minStock < 0.5).length}
                </div>
                <p className="text-xs font-semibold text-foreground mt-1">Below 50% of minimum</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 dark:border-cyan-500/30 bg-cyan-50 dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-foreground">
              <AlertCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              Items Requiring Reorder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {understockedItems.map((item) => {
                const stockPercentage = (item.stock / item.minStock) * 100
                const isCritical = stockPercentage < 50

                return (
                  <div key={item.id}>
                    <div className={`p-4 rounded-xl border-2 dark:border-cyan-500/30 bg-cyan-50 dark:bg-slate-900`}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`h-12 w-12 rounded-lg flex items-center justify-center bg-cyan-100 dark:bg-cyan-950`}
                          >
                            <Package className={`h-6 w-6 text-cyan-600 dark:text-cyan-400`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-foreground dark:text-white">{item.name}</h3>
                              {isCritical && (
                                <Badge className="bg-cyan-600 dark:bg-cyan-700 text-white border-0 text-xs font-bold">
                                  Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-foreground dark:text-slate-100 mb-2">
                              SKU: {item.sku} • {item.city}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-foreground dark:text-slate-100">Current: </span>
                                <span className="font-bold text-cyan-600 dark:text-cyan-300">{item.stock}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground dark:text-slate-100">Min: </span>
                                <span className="font-bold text-foreground dark:text-slate-100">{item.minStock}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground dark:text-slate-100">Reorder: </span>
                                <span className="font-bold text-cyan-600 dark:text-cyan-300">
                                  {Math.round(item.reorderQty)} units
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground dark:text-slate-100">Cost: </span>
                                <span className="font-bold text-foreground dark:text-slate-100">
                                  ${(item.reorderQty * item.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="font-bold bg-transparent"
                            onClick={() => setShowDetailsModal(item)}
                          >
                            View Details
                          </Button>
                          {user.role === "admin" && (
                            <Button
                              size="sm"
                              style={{ backgroundColor: "#00C5C8", color: "#06191D" }}
                              className="hover:opacity-90 font-bold"
                              onClick={() => setShowReorderModal(item)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal for View Details */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md dark:bg-slate-800 shadow-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b dark:border-slate-700">
              <h2 className="text-lg font-bold">Product Details</h2>
              <Button size="sm" variant="ghost" onClick={() => setShowDetailsModal(null)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div>
                <span className="font-bold text-foreground">Product: </span>
                <span className="font-semibold">{showDetailsModal.name}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">SKU: </span>
                <span className="font-semibold">{showDetailsModal.sku}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">City: </span>
                <span className="font-semibold">{showDetailsModal.city}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">Current Stock: </span>
                <span className="font-semibold">{showDetailsModal.stock}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">Min Stock: </span>
                <span className="font-semibold">{showDetailsModal.minStock}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">Reorder Qty: </span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-300">
                  {Math.round(showDetailsModal.reorderQty)} units
                </span>
              </div>
              <div>
                <span className="font-bold text-foreground">Reorder Cost: </span>
                <span className="font-semibold">
                  ${(showDetailsModal.reorderQty * showDetailsModal.price).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-bold text-foreground">Price per Unit: </span>
                <span className="font-semibold">${showDetailsModal.price}</span>
              </div>
              <Button
                onClick={() => setShowDetailsModal(null)}
                className="w-full mt-4 font-bold"
                style={{ backgroundColor: "#00C5C8", color: "#06191D" }}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal for Reorder confirmation */}
      {showReorderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md dark:bg-slate-800 shadow-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b dark:border-slate-700">
              <h2 className="text-lg font-bold">Confirm Reorder</h2>
              <Button size="sm" variant="ghost" onClick={() => setShowReorderModal(null)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <span className="font-bold text-foreground">Product: </span>
                <span className="font-semibold">{showReorderModal.name}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">Current Stock: </span>
                <span className="font-semibold text-red-600 dark:text-red-400">{showReorderModal.stock}</span>
              </div>
              <div>
                <span className="font-bold text-foreground">Min Required: </span>
                <span className="font-semibold">{showReorderModal.minStock}</span>
              </div>
              <div className="bg-cyan-100 dark:bg-cyan-950 p-3 rounded-lg">
                <p className="font-bold text-foreground mb-2">Reorder Summary:</p>
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-foreground">Qty to Reorder: </span>
                    <span className="font-bold text-cyan-600">{Math.round(showReorderModal.reorderQty)} units</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Unit Price: </span>
                    <span className="font-bold">${showReorderModal.price}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Total Cost: </span>
                    <span className="font-bold">
                      ${(showReorderModal.reorderQty * showReorderModal.price).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Est. Delivery: </span>
                    <span className="font-bold">3-5 business days</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReorderModal(null)} className="flex-1 font-bold">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowReorderModal(null)
                    alert("Reorder confirmed!")
                  }}
                  className="flex-1 font-bold"
                  style={{ backgroundColor: "#00C5C8", color: "#06191D" }}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
