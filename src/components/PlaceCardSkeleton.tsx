import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PlaceCardSkeleton = () => (
  <Card className="p-4" aria-hidden="true">
    <div className="space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  </Card>
);

export const PlaceCardSkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <PlaceCardSkeleton key={i} />
    ))}
  </div>
);

export default PlaceCardSkeleton;