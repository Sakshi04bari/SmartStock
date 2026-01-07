"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (
        email === "sakshibari04@gmail.com" ||
        email === "admin@smartstock.com" ||
        email === "manager@smartstock.com"
      ) {
        setVerificationSent(true)
        setVerificationStep(true)
        localStorage.setItem("pendingVerificationEmail", email)
        setLoading(false)
      } else {
        setError("Email not found in system")
        setLoading(false)
      }
    }, 600)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      // Mock verification - in production, this would validate against sent code
      if (verificationCode === "123456") {
        localStorage.setItem("emailVerified", "true")
        handleLogin()
      } else {
        setError("Invalid verification code")
        setLoading(false)
      }
    }, 600)
  }

  const handleLogin = async () => {
    // Mock authentication - in production, this would be a real API call
    if (email === "admin@smartstock.com" && password === "admin123") {
      localStorage.setItem("user", JSON.stringify({ email, role: "admin", name: "Admin User" }))
      router.push("/dashboard/admin")
    } else if (email === "manager@smartstock.com" && password === "manager123") {
      localStorage.setItem("user", JSON.stringify({ email, role: "manager", name: "Store Manager" }))
      router.push("/dashboard/manager")
    } else if (email === "sakshibari04@gmail.com" && password === "password123") {
      localStorage.setItem("user", JSON.stringify({ email, role: "admin", name: "Sakshi Bari" }))
      router.push("/dashboard/admin")
    } else {
      setError("Invalid email or password")
      setLoading(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (email === "sakshibari04@gmail.com" && password === "password123") {
        setVerificationStep(true)
        setLoading(false)
      } else if (email === "admin@smartstock.com" && password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ email, role: "admin", name: "Admin User" }))
        router.push("/dashboard/admin")
      } else if (email === "manager@smartstock.com" && password === "manager123") {
        localStorage.setItem("user", JSON.stringify({ email, role: "manager", name: "Store Manager" }))
        router.push("/dashboard/manager")
      } else {
        setError("Invalid email or password")
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#06191D] dark:to-[#0a2a33] p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-slate-200 dark:border-[#00C5C8] dark:bg-[#0a2a33]">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#00C5C8] to-[#70E7D1] flex items-center justify-center shadow-lg">
              <Package className="h-9 w-9 text-[#06191D]" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-blue-600 dark:text-[#00C5C8]">SmartStock</CardTitle>
            <CardDescription className="text-base mt-2 dark:text-[#70E7D1]">
              Inventory Optimization System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {verificationStep ? (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="bg-blue-50 dark:bg-[#1a4d50] border border-blue-200 dark:border-[#00C5C8] rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-[#70E7D1] font-medium">
                  Verification code has been sent to <strong>{email}</strong>. Please check your email and enter the
                  code below. (Demo code: 123456)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-semibold text-slate-700 dark:text-[#70E7D1]">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                  className="h-11 border-slate-300 dark:border-[#00C5C8] dark:bg-[#06191D] dark:text-white dark:placeholder-[#70E7D1] placeholder-slate-400"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 dark:border-[#00C5C8] dark:text-[#00C5C8] dark:hover:bg-[#1a4d50] bg-transparent"
                  onClick={() => {
                    setVerificationStep(false)
                    setVerificationCode("")
                    setError("")
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-[#00C5C8] hover:bg-[#00b8bb] text-[#06191D] font-semibold shadow-lg dark:bg-[#00C5C8] dark:hover:bg-[#70E7D1]"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-[#70E7D1]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@smartstock.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-slate-300 dark:border-[#00C5C8] dark:bg-[#06191D] dark:text-white dark:placeholder-[#70E7D1] placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-[#70E7D1]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-slate-300 dark:border-[#00C5C8] dark:bg-[#06191D] dark:text-white dark:placeholder-[#70E7D1] placeholder-slate-400"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#00C5C8] hover:bg-[#00b8bb] text-[#06191D] font-semibold shadow-lg dark:bg-[#00C5C8] dark:hover:bg-[#70E7D1]"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              
              
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
