"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  links?: Array<{ text: string; href: string }>
  chart?: {
    type: "pie" | "bar"
    data: any[]
    title: string
  }
}

const faqData = {
  understock: {
    answer:
      "Understock items are products that currently have inventory below the minimum required threshold. These need urgent attention to prevent stockouts.",
    links: [{ text: "View Understock Items", href: "/understock" }],
  },
  overstock: {
    answer:
      "Overstock items are products that currently exceed the maximum inventory level. These should be promoted or redistributed to reduce excess inventory.",
    links: [{ text: "View Overstock Items", href: "/overstock" }],
  },
  cities: {
    answer:
      "We currently operate in 15 major cities including New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose, Austin, Jacksonville, Fort Worth, Columbus, and Charlotte.",
    links: [{ text: "View All Cities", href: "/cities" }],
  },
  stores: {
    answer:
      "We have 9 retail stores across different cities. Each store is managed by a dedicated store manager and maintains inventory of products.",
    links: [{ text: "View All Stores", href: "/stores" }],
  },
  products: {
    answer:
      "We stock over 100 different products across various categories including Electronics, Accessories, Storage, Audio, Photography, and more.",
    links: [{ text: "View All Products", href: "/products" }],
  },
  alerts: {
    answer:
      "Stock alerts are real-time notifications about inventory changes. We track understock, overstock, and normal stock situations across all stores.",
    links: [],
  },
  dashboard: {
    answer:
      "The dashboard provides a real-time overview of your inventory status, showing total understock items, overstock items, optimal stock items, and recent stock alerts.",
    links: [{ text: "Go to Dashboard", href: "/dashboard/admin" }],
  },
  charts: {
    answer:
      "Our charts provide visual insights into your inventory data. The Stock Status Distribution pie chart shows the percentage of understock, optimal, and overstock items. The Top Products bar chart displays your highest stocked items and their thresholds.",
    links: [{ text: "View All Charts", href: "/charts" }],
    chart: {
      type: "pie",
      data: [
        { name: "Understock", value: 13, fill: "#EF4444" },
        { name: "Optimal", value: 77, fill: "#3B82F6" },
        { name: "Overstock", value: 10, fill: "#F59E0B" },
      ],
      title: "Stock Status Distribution",
    },
  },
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "Hello! I'm SmartStock Assistant. I can help you with questions about understock, overstock, cities, stores, products, charts, and inventory management. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])

    const lowerInput = input.toLowerCase()
    let botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content:
        "I didn't understand that. Could you ask about understock, overstock, cities, stores, products, charts, alerts, or dashboard?",
    }

    if (lowerInput.includes("chart") || lowerInput.includes("graph") || lowerInput.includes("visualiz")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.charts.answer,
        links: faqData.charts.links,
        chart: faqData.charts.chart,
      }
    } else if (lowerInput.includes("understock")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.understock.answer,
        links: faqData.understock.links,
      }
    } else if (lowerInput.includes("overstock")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.overstock.answer,
        links: faqData.overstock.links,
      }
    } else if (lowerInput.includes("cities") || lowerInput.includes("location")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.cities.answer,
        links: faqData.cities.links,
      }
    } else if (lowerInput.includes("stores")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.stores.answer,
        links: faqData.stores.links,
      }
    } else if (lowerInput.includes("products")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.products.answer,
        links: faqData.products.links,
      }
    } else if (lowerInput.includes("alert")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.alerts.answer,
      }
    } else if (lowerInput.includes("dashboard")) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: faqData.dashboard.answer,
        links: faqData.dashboard.links,
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse])
    }, 500)

    setInput("")
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat window */}
      {isOpen && (
        <div className="bg-card border-2 border-border rounded-2xl shadow-2xl w-[420px] 
                        max-h-[85vh] flex flex-col overflow-hidden mb-4">

          {/* Header */}
          <div
            style={{ backgroundColor: "#4A7FC1" }}
            className="text-white px-4 py-4 rounded-t-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-bold">SmartStock Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.type === "user" ? "text-white rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                  }`}
                  style={msg.type === "user" ? { backgroundColor: "#38cfdaff" } : {}}
                >
                  <p className="text-sm">{msg.content}</p>

                  {msg.chart && (
                    <div className="mt-3 bg-background p-2 rounded-lg">
                      <p className="text-xs font-semibold mb-2">{msg.chart.title}</p>
                      <ResponsiveContainer width="100%" height={200}>
                        {msg.chart.type === "pie" ? (
                          <PieChart>
                            <Pie
                              data={msg.chart.data}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {msg.chart.data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        ) : (
                          <BarChart data={msg.chart.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#38cfdaff" />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  )}

                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.links.map((link, idx) => (
                        <Link key={idx} href={link.href} onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                          >
                            {link.text}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about inventory..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="text-white h-10 w-10"
              style={{ backgroundColor: "#38cfdaff" }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="rounded-full h-14 w-14 shadow-lg text-white"
        style={{ backgroundColor: "#38cfdaff" }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
