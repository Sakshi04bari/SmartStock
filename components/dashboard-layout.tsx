"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Package,
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  MapPin,
  LogOut,
  Store,
  Users,
  Moon,
  Sun,
  Package2,
  BarChart3,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "admin" | "manager"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: role === "admin" ? "/dashboard/admin" : "/dashboard/manager",
      icon: LayoutDashboard,
    },
    { name: "Overstock", href: "/overstock", icon: TrendingUp },
    { name: "Understock", href: "/understock", icon: TrendingDown },
    { name: "Products", href: "/products", icon: Package2 },
    { name: "Cities", href: "/cities", icon: MapPin },
    { name: "Stores", href: "/stores", icon: Store, badge: "9" },
    ...(role === "admin" ? [{ name: "Charts", href: "/charts", icon: BarChart3 }] : []),
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header style={{ backgroundColor: "#00C5C8" }} className="sticky top-0 z-50 w-full border-b shadow-lg">
        <div className="flex h-16 items-center px-6 gap-6">
          {/* Logo */}
          <Link
            href={role === "admin" ? "/dashboard/admin" : "/dashboard/manager"}
            className="flex items-center gap-2 mr-4"
          >
            <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Package className="h-6 w-6 text-slate-900" />
            </div>
            <span className="font-bold text-xl text-slate-900">SmartStock</span>
          </Link>

          {/* User badge */}
          <div className="flex items-center gap-2 mr-auto">
            <Users className="h-4 w-4 text-slate-900/70" />
            <span className="text-sm text-slate-900/90">admin</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 text-xs font-semibold uppercase">
              {role}
            </span>
          </div>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 text-slate-900 hover:bg-slate-900/10 ${isActive ? "bg-slate-900/20" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && <span className="ml-1 text-xs text-slate-900/70">({item.badge})</span>}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-900 hover:bg-slate-900/10"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Logout */}
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-900 hover:bg-slate-900/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile navigation */}
        <div style={{ backgroundColor: "#00C5C8", borderColor: "#0A9CA0" }} className="lg:hidden border-t">
          <nav className="flex overflow-x-auto px-4 py-2 gap-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 text-slate-900 hover:bg-slate-900/10 whitespace-nowrap ${isActive ? "bg-slate-900/20" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                    {item.badge && <span className="text-xs text-slate-900/70">({item.badge})</span>}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  )
}
