export const SkeletonBox = ({ width, height, style = {} }) => (
  <div className="skeleton" style={{ width: width || '100%', height: height || '1rem', ...style }} />
);

export const ProductCardSkeleton = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div className="skeleton" style={{ height: '200px' }} />
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <SkeletonBox height="0.75rem" width="60%" />
      <SkeletonBox height="1rem" />
      <SkeletonBox height="1rem" width="80%" />
      <SkeletonBox height="1.25rem" width="40%" />
      <SkeletonBox height="2.25rem" />
    </div>
  </div>
);

export default SkeletonBox;
