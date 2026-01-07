"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Package, TrendingDown, TrendingUp, BarChart3, Search } from "lucide-react"
import { cities } from "@/lib/mock-data"

export default function CitiesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) return null

  const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalStores = cities.reduce((sum, city) => sum + city.stores, 0)
  const totalProducts = cities.reduce((sum, city) => sum + city.products, 0)
  const totalValue = cities.reduce((sum, city) => sum + city.value, 0)

  return (
    <DashboardLayout role={user.role}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cities & Locations</h1>
              <p className="text-muted-foreground">Inventory distribution across retail locations</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cities.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{totalStores} retail stores</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all locations</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${(totalValue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground mt-1">Inventory value</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50">
          <CardHeader>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 border border-[#00C5C8]/20 hover:border-[#00C5C8]/50 transition-colors">
              <Search className="h-5 w-5 text-[#00C5C8]" />
              <Input
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map((city) => (
            <Card
              key={city.id}
              className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-2xl hover:shadow-[#00C5C8]/30 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl group-hover:text-[#00C5C8] transition-colors">
                      <MapPin className="h-5 w-5 text-[#00C5C8]" />
                      {city.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {city.stores} {city.stores === 1 ? "store" : "stores"}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#00C5C8]/20">
                    <BarChart3 className="h-4 w-4 text-[#00C5C8]" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#00C5C8]/10 dark:bg-[#00C5C8]/20 border border-[#00C5C8]/30 group-hover:border-[#00C5C8] group-hover:bg-[#00C5C8]/20 transition-all">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#00C5C8]" />
                    <span className="text-sm font-medium">Products</span>
                  </div>
                  <span className="font-bold text-[#00C5C8]">{city.products}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 group-hover:border-[#00C5C8] group-hover:bg-[#00C5C8]/10 transition-all">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      <span className="text-xs font-medium text-muted-foreground">Understock</span>
                    </div>
                    <span className="font-bold text-red-600 dark:text-red-400">{city.understock}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 group-hover:border-[#00C5C8] group-hover:bg-[#00C5C8]/10 transition-all">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-medium text-muted-foreground">Overstock</span>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{city.overstock}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#00C5C8]/20 group-hover:border-[#00C5C8]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Inventory Value</span>
                    <span className="font-bold text-lg text-[#00C5C8]">${(city.value / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
