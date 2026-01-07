"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingDown, AlertTriangle, ShoppingCart } from "lucide-react"
import { StockAlerts } from "@/components/stock-alerts"
import { TopProducts } from "@/components/top-products"

export default function ManagerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(storedUser)
    if (userData.role !== "manager") {
      router.push("/dashboard/admin")
      return
    }
    setUser(userData)
  }, [router])

  if (!user) return null

  const stats = [
    {
      title: "Store Products",
      value: "342",
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Low Stock Items",
      value: "12",
      icon: TrendingDown,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Pending Orders",
      value: "8",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Critical Alerts",
      value: "5",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
    },
  ]

  return (
    <DashboardLayout role="manager">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}! Monitor your store inventory.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Alerts and Products */}
        <div className="grid gap-6 lg:grid-cols-2">
          <StockAlerts />
          <TopProducts />
        </div>
      </div>
    </DashboardLayout>
  )
}
