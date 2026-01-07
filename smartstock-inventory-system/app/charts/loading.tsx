import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ChartsLoading() {
  return (
    <div className="space-y-8 p-8">
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    </div>
  )
}
