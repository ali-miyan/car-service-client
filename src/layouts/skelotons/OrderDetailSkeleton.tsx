import React from "react";
const SkeletonCard = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`}>
    <div className="h-24 bg-gray-300  mb-4"></div>
    <div className="h-4 bg-gray-300 mb-2"></div>
    <div className="h-4 bg-gray-300 mb-2"></div>
    <div className="h-4 bg-gray-300"></div>
  </div>
);

const OrderDetailSkeleton: React.FC = () => (
  <div className="mx-32 my-20 lowercase">
    <div className="flex w-full justify-between items-center mb-8">
      <SkeletonCard className="flex-1 mb-4" />
      <SkeletonCard className="flex-1 mb-4" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border-2 p-8 mb-8">
      <SkeletonCard className="flex flex-col items-center text-center" />
      <SkeletonCard className="flex flex-col items-center text-center" />
      <SkeletonCard className="flex flex-col items-center text-center" />
    </div>

    <div className="overflow-y-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          <div className="flex-1 border border-slate-200 bg-white rounded-lg shadow-sm divide-y divide-slate-200">
            <div className="p-6">
              <SkeletonCard className="h-6 mb-4" />
              <SkeletonCard className="h-4 mb-4" />
            </div>
            <div className="pt-6 pb-8 px-6">
              <SkeletonCard className="h-4 mb-4" />
              <div className="space-y-2 mt-4">
                <SkeletonCard className="h-4" />
                <SkeletonCard className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetailSkeleton;
