"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const chartData = [
  { month: "Jan", optimal: 420, understock: 45, overstock: 32 },
  { month: "Feb", optimal: 445, understock: 38, overstock: 28 },
  { month: "Mar", optimal: 465, understock: 42, overstock: 35 },
  { month: "Apr", optimal: 490, understock: 35, overstock: 30 },
  { month: "May", optimal: 510, understock: 28, overstock: 25 },
  { month: "Jun", optimal: 485, understock: 23, overstock: 18 },
]

export function InventoryChart() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Inventory Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="optimal" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Optimal Stock" />
            <Bar dataKey="understock" fill="#f97316" radius={[4, 4, 0, 0]} name="Understock" />
            <Bar dataKey="overstock" fill="#a855f7" radius={[4, 4, 0, 0]} name="Overstock" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
