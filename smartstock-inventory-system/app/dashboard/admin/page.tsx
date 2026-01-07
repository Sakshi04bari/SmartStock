"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, CheckCircle, Clock, Package, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateLiveAlerts, products } from "@/lib/mock-data"

const AdminDashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [alerts, setAlerts] = useState(generateLiveAlerts(50))

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(storedUser)
    if (userData.role !== "admin") {
      router.push("/dashboard/manager")
      return
    }
    setUser(userData)
  }, [router])

  if (!user) return null

  const understockCount = products.filter((p) => p.stock < p.minStock).length
  const overstockCount = products.filter((p) => p.stock > p.maxStock).length
  const optimalCount = products.filter((p) => p.stock >= p.minStock && p.stock <= p.maxStock).length
  const totalAlerts = alerts.length

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Live Dashboard</h1>
          <p className="text-muted-foreground mt-1"></p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-4xl font-bold text-red-600">{understockCount}</div>
                <p className="text-sm text-muted-foreground">Understock</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-4xl font-bold text-amber-600">{overstockCount}</div>
                <p className="text-sm text-muted-foreground">Overstock</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600">{optimalCount}</div>
                <p className="text-sm text-muted-foreground">OK Stock</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-cyan-600" />
                </div>
                <div className="text-4xl font-bold text-cyan-600">{totalAlerts}</div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Stock Alerts (Live - Auto Refresh)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {/* Updated table header background from blue to dark purple */}
                  <tr style={{ backgroundColor: "#0893b3ff" }} className="text-white">
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">City</th>
                    <th className="text-left py-3 px-4 font-semibold">Store</th>
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-left py-3 px-4 font-semibold">Sale</th>
                    <th className="text-left py-3 px-4 font-semibold">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => (
                    <tr key={alert.id} className={`border-b ${index % 2 === 0 ? "bg-muted/30" : "bg-card"}`}>
                      <td className="py-3 px-4 text-sm">{alert.time}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="bg-gray-600 text-white">
                          {alert.city}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{alert.store}</td>
                      <td className="py-3 px-4 text-sm">{alert.product}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={alert.sale < 0 ? "text-red-600 font-semibold" : ""}>{alert.sale}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">{alert.stock}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={
                            alert.status === "Stock OK"
                              ? "bg-blue-600 text-white"
                              : alert.status === "Low Stock"
                                ? "bg-orange-600 text-white"
                                : "bg-purple-600 text-white"
                          }
                        >
                          {alert.status} ✓
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="bg-gray-700 text-white">
                          {alert.forecast}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button size="lg" variant="outline" className="h-16 text-base border-2 hover:border-primary bg-transparent">
            <Store className="h-5 w-5 mr-2 text-blue-600" />
            Manage Stores
          </Button>
          <Button size="lg" variant="outline" className="h-16 text-base border-2 hover:border-primary bg-transparent">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Store Dashboards
          </Button>
        </div>

        {/* Live update notice */}
        <div className="p-4 bg-cyan-50 dark:bg-cyan-950 border-2 border-cyan-200 dark:border-cyan-800 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-600" />
            <span className="font-bold">Live Updates:</span> 
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
