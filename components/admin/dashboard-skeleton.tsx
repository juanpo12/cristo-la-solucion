import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
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
                    <div className="mb-8">
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>

                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-40">
                                <div className="flex justify-between items-start mb-4">
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                    <Skeleton className="h-6 w-20 rounded-lg" />
                                </div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-16 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        ))}
                    </div>

                    {/* Recent Orders Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200/50 bg-gray-50/50">
                            <Skeleton className="h-7 w-40 mb-1" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Skeleton className="h-6 w-24 ml-auto" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
