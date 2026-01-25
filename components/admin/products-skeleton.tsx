import { Skeleton } from "@/components/ui/skeleton"

export function ProductsSkeleton() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block w-72 border-r border-gray-200 bg-white h-screen fixed left-0 top-0 p-4">
                <div className="h-16 mb-6 flex items-center px-2">
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                </div>
            </div>

            <div className="flex-1 lg:ml-72">
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Header Skeleton */}
                    <div className="flex flex-col gap-4 mb-8">
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-64 mb-4" />
                        <Skeleton className="h-11 w-40 rounded-lg" />
                    </div>

                    {/* Filters Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-200/50 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-11 w-full rounded-lg" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Products List Skeleton */}
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200/50 p-6 flex flex-col lg:flex-row gap-6">
                                <Skeleton className="w-full lg:w-24 h-48 lg:h-24 rounded-xl" />
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                        {[1, 2, 3, 4, 5].map((j) => (
                                            <Skeleton key={j} className="h-8 w-full rounded-md" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
