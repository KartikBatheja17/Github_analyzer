import React from "react";
function SkeletonCard(){
    return (
        <div className="bg-black/60 backdrop-blur-md border border-red-900 rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            {/* lines */}
            <div className = "space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>

    );
}
export default SkeletonCard;