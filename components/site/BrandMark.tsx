import Image from 'next/image'

export default function BrandMark({ className = '' }: { className?: string }) {
  return <span className={`qms-wordmark ${className}`}><Image src="/images/qms-logo.png" alt="QMS" width={1802} height={873} priority /></span>
}
