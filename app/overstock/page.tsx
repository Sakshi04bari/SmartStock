"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Package, AlertCircle, Tag, X } from "lucide-react"
import { products } from "@/lib/mock-data"

export default function OverstockPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) return null

  const overstockedItems = products
    .filter((p) => p.stock > p.maxStock)
    .map((p) => ({
      ...p,
      excessQty: p.stock - p.maxStock,
    }))

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setShowDetailsModal(true)
  }

  const handleRunPromotion = (item) => {
    setSelectedItem(item)
    setShowPromotionModal(true)
  }

  return (
    <DashboardLayout role={user.role}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Overstocked Items</h1>
              <p className="text-muted-foreground">Items above maximum stock levels with excess inventory</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Total Overstocked</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{overstockedItems.length}</div>
                <p className="text-xs font-semibold text-foreground mt-1">Items above maximum</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Excess Value</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ${overstockedItems.reduce((sum, item) => sum + item.excessQty * item.price, 0).toLocaleString()}
                </div>
                <p className="text-xs font-semibold text-foreground mt-1">Capital tied up</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Excess Units</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {overstockedItems.reduce((sum, item) => sum + item.excessQty, 0)}
                </div>
                <p className="text-xs font-semibold text-foreground mt-1">Total excess inventory</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 dark:border-cyan-500/30 bg-cyan-50 dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-foreground">
              <AlertCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              Items With Excess Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overstockedItems.map((item) => {
                const excessPercentage = ((item.stock - item.maxStock) / item.maxStock) * 100

                return (
                  <div key={item.id}>
                    <div className="p-4 rounded-xl border-2 dark:border-cyan-500/30 bg-cyan-50 dark:bg-slate-900">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
                            <Package className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-foreground dark:text-white">{item.name}</h3>
                              <Badge className="bg-cyan-600 dark:bg-cyan-700 text-white border-0 text-xs font-bold">
                                +{excessPercentage.toFixed(0)}% over
                              </Badge>
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
                                <span className="font-semibold text-foreground dark:text-slate-100">Max: </span>
                                <span className="font-bold text-foreground dark:text-slate-100">{item.maxStock}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground dark:text-slate-100">Excess: </span>
                                <span className="font-bold text-cyan-600 dark:text-cyan-300">
                                  {item.excessQty} units
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground dark:text-slate-100">Value: </span>
                                <span className="font-bold text-foreground dark:text-slate-100">
                                  ${(item.excessQty * item.price).toFixed(2)}
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
                            onClick={() => handleViewDetails(item)}
                          >
                            View Details
                          </Button>
                          {user.role === "admin" && (
                            <Button
                              size="sm"
                              style={{ backgroundColor: "#00C5C8", color: "#06191D" }}
                              className="hover:opacity-90 font-bold"
                              onClick={() => handleRunPromotion(item)}
                            >
                              <Tag className="h-4 w-4 mr-2" />
                              Run Promotion
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

        {/* Modal for View Details */}
        {showDetailsModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md dark:bg-slate-800 shadow-2xl border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b dark:border-slate-700">
                <h2 className="text-lg font-bold">Product Details</h2>
                <Button size="sm" variant="ghost" onClick={() => setShowDetailsModal(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div>
                  <span className="font-bold text-foreground">Product: </span>
                  <span className="font-semibold">{selectedItem.name}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">SKU: </span>
                  <span className="font-semibold">{selectedItem.sku}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">City: </span>
                  <span className="font-semibold">{selectedItem.city}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Current Stock: </span>
                  <span className="font-semibold">{selectedItem.stock}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Max Stock: </span>
                  <span className="font-semibold">{selectedItem.maxStock}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Excess Qty: </span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-300">{selectedItem.excessQty} units</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Excess Value: </span>
                  <span className="font-semibold">${(selectedItem.excessQty * selectedItem.price).toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Price per Unit: </span>
                  <span className="font-semibold">${selectedItem.price}</span>
                </div>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full mt-4 font-bold"
                  style={{ backgroundColor: "#00C5C8", color: "#06191D" }}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal for Run Promotion */}
        {showPromotionModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md dark:bg-slate-800 shadow-2xl border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b dark:border-slate-700">
                <h2 className="text-lg font-bold">Run Promotion</h2>
                <Button size="sm" variant="ghost" onClick={() => setShowPromotionModal(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <span className="font-bold text-foreground">Product: </span>
                  <span className="font-semibold">{selectedItem.name}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Excess Inventory: </span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-300">{selectedItem.excessQty} units</span>
                </div>
                <div className="bg-cyan-100 dark:bg-cyan-950 p-3 rounded-lg">
                  <p className="font-bold text-foreground mb-2">Promotion Summary:</p>
                  <div className="space-y-1">
                    <div>
                      <span className="font-semibold text-foreground">Discount: </span>
                      <span className="font-bold text-cyan-600">15%</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Original Value: </span>
                      <span className="font-bold">${(selectedItem.excessQty * selectedItem.price).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Revenue at 15% Off: </span>
                      <span className="font-bold">
                        ${(selectedItem.excessQty * selectedItem.price * 0.85).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPromotionModal(false)} className="flex-1 font-bold">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPromotionModal(false)
                      alert("Promotion activated!")
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
      </div>
    </DashboardLayout>
  )
}
