import React from 'react';

export function Skeleton({ className = 'h-4 w-full' }) {
  return <div className={`v-skeleton ${className}`} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="v-card p-6 space-y-4" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function RouteSkeleton() {
  return (
    <div className="v-container py-12 space-y-8" role="status" aria-label="Loading page">
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
