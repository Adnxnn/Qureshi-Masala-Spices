import { redirect } from 'next/navigation'

// Keep existing links to the former storefront checkout on the single cart flow.
export default function LegacyOrderPage() {
  redirect('/order')
}
