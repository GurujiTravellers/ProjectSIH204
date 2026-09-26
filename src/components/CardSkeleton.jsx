import React from "react";

export function DestinationCardSkeleton() {
  return (
    <div className="destination-card-skeleton">
      <div className="skeleton-image-box shimmer"></div>
      <div className="skeleton-content-box">
        <div className="skeleton-line shimmer title"></div>
        <div className="skeleton-line shimmer subtitle"></div>
        <div className="skeleton-line shimmer desc"></div>
        <div className="skeleton-row">
          <div className="skeleton-pill shimmer"></div>
          <div className="skeleton-btn shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="destination-grid skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <DestinationCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default DestinationCardSkeleton;
