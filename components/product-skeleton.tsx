import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProductSkeleton() {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Imagen skeleton */}
        <div className="relative overflow-hidden">
          <Skeleton className="w-full h-64 bg-gray-200" />
        </div>
        
        {/* Contenido skeleton */}
        <div className="p-6">
          {/* Título y autor */}
          <div className="mb-3">
            <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
          </div>
          
          {/* Descripción */}
          <div className="mb-4">
            <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-5/6 bg-gray-200" />
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
          
          {/* Precio y botones */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Skeleton className="h-6 w-16 mb-1 bg-gray-200" />
              <Skeleton className="h-4 w-12 bg-gray-200" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
              <Skeleton className="h-10 w-24 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  )
}