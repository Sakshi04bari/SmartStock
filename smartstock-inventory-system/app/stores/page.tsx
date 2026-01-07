"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Store, Search, MapPin, Phone, User, Package, Edit, Trash2 } from "lucide-react"
import { stores } from "@/lib/mock-data"

export default function StoresPage() {
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

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout role={user.role}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
              <Store className="h-6 w-6 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
              <p className="text-muted-foreground">Manage retail store locations and their inventory</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stores.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active locations</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stores.reduce((sum, s) => sum + s.products, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all stores</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-xl hover:shadow-[#00C5C8]/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg per Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(stores.reduce((sum, s) => sum + s.products, 0) / stores.length)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Products per location</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50">
          <CardHeader>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 border border-[#00C5C8]/20 hover:border-[#00C5C8]/50 transition-colors">
              <Search className="h-5 w-5 text-[#00C5C8]" />
              <Input
                placeholder="Search stores by name, city, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {filteredStores.map((store) => (
            <Card
              key={store.id}
              className="border-2 border-[#00C5C8]/30 dark:border-[#00C5C8]/50 hover:border-[#00C5C8] hover:shadow-2xl hover:shadow-[#00C5C8]/30 hover:scale-[1.02] transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#00C5C8] to-[#70E7D1] flex items-center justify-center shadow-lg flex-shrink-0 group-hover:shadow-xl group-hover:shadow-[#00C5C8]/50 transition-all">
                      <Store className="h-7 w-7 text-[#06191D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl group-hover:text-[#00C5C8] transition-colors">{store.name}</h3>
                        <Badge
                          variant="secondary"
                          className="bg-[#00C5C8]/20 text-[#00C5C8] border border-[#00C5C8]/50 group-hover:bg-[#00C5C8]/30 transition-all"
                        >
                          {store.products} products
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm p-2 rounded group-hover:bg-[#00C5C8]/10 transition-colors">
                          <MapPin className="h-4 w-4 text-[#00C5C8] flex-shrink-0" />
                          <div>
                            <p className="font-medium">{store.address}</p>
                            <p className="text-muted-foreground">{store.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded group-hover:bg-[#00C5C8]/10 transition-colors">
                          <User className="h-4 w-4 text-[#00C5C8] flex-shrink-0" />
                          <div>
                            <p className="font-medium">{store.manager}</p>
                            <p className="text-muted-foreground">Store Manager</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded group-hover:bg-[#00C5C8]/10 transition-colors">
                          <Phone className="h-4 w-4 text-[#00C5C8] flex-shrink-0" />
                          <p className="font-medium">{store.phone}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded group-hover:bg-[#00C5C8]/10 transition-colors">
                          <Package className="h-4 w-4 text-[#00C5C8] flex-shrink-0" />
                          <p className="font-medium">{store.products} items in stock</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#00C5C8]/50 text-[#00C5C8] hover:bg-[#00C5C8]/10 hover:border-[#00C5C8] bg-transparent"
                    >
                      View Details
                    </Button>
                    {user.role === "admin" && (
                      <>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-[#00C5C8]/20 text-[#00C5C8]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 p-0 hover:bg-red-500/20 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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
