export default function BrandMark({ className = '' }: { className?: string }) {
  return <span className={`qms-wordmark ${className}`} aria-label="QMS">Q<span>M</span>S</span>
}
