import { Skeleton } from "@/components/ui/skeleton"

export function OrdersSkeleton() {
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

                    {/* Filters Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-200/50 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-11 w-full rounded-lg" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Orders List Skeleton */}
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200/50 p-6">
                                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-32" />
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-48" />
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Skeleton className="h-8 w-32" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-24 rounded-lg" />
                                            <Skeleton className="h-8 w-32 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <Skeleton className="h-5 w-32 mb-3" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
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
