export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}
