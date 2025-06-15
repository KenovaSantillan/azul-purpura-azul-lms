
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoader() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
