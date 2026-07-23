import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { adminGetOrders, adminGetProducts } from '@/lib/admin-actions'
import type { OrderStatus } from '@/types'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300',
  confirmed: 'bg-blue-500/15 text-blue-300',
  dispatched: 'bg-purple-500/15 text-purple-300',
  delivered: 'bg-green-500/15 text-green-300',
  cancelled: 'bg-red-500/15 text-red-300',
}

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([
    adminGetOrders(),
    adminGetProducts(),
  ])

  const totalRevenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + Number(order.total_amount), 0)
  const pending = orders.filter((order) => order.status === 'pending').length
  const lowStock = products.filter((product) => product.stock_qty < 10).length
  const recentOrders = orders.slice(0, 10)

  const stats = [
    { label: 'Total Orders', value: orders.length, sub: `${pending} pending` },
    {
      label: 'Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      sub: 'All time',
    },
    {
      label: 'Products',
      value: products.filter((product) => product.is_active).length,
      sub: `${lowStock} low stock`,
    },
    {
      label: 'Avg Order',
      value: orders.length
        ? `₹${Math.round(totalRevenue / orders.length).toLocaleString('en-IN')}`
        : '—',
      sub: 'Per order',
    },
  ]

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold md:hidden">
          Overview
        </p>
        <h1 className="royal-title text-5xl sm:text-6xl">
          Dashboard
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:mb-10">
        {stats.map((stat) => (
          <section
            key={stat.label}
            className="min-w-0 rounded-[2px] border border-white/10 bg-dark p-4 sm:p-5"
          >
            <div className="mb-2 truncate text-[10px] font-medium uppercase tracking-[0.16em] text-white/45 sm:text-[11px] sm:tracking-[0.2em]">
              {stat.label}
            </div>
            <div className="mb-1 break-words font-display text-2xl leading-none text-gold sm:text-3xl">
              {stat.value}
            </div>
            <div className="text-xs text-white/45">{stat.sub}</div>
          </section>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50 sm:tracking-[0.3em]">
          Recent Orders
        </h2>
        <Link
          href="/admin/orders"
          className="flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          View all
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2px] border border-white/10 bg-dark">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.15em] text-white/35"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gold">
                    {order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-white/75">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {order.order_items?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-white">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/40">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-white/10 md:hidden">
          {recentOrders.map((order) => (
            <article key={order.id} className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-gold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="mt-1 truncate text-sm font-medium text-white">
                    {order.customer_name}
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${STATUS_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="text-xs leading-5 text-white/45">
                  <div>{order.order_items?.length ?? 0} items</div>
                  <time dateTime={order.created_at}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </time>
                </div>
                <div className="font-display text-2xl text-white">
                  ₹{Number(order.total_amount).toLocaleString('en-IN')}
                </div>
              </div>
            </article>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="px-4 py-14 text-center text-sm text-white/35">
            No orders yet.
          </div>
        ) : null}
      </section>
    </div>
  )
}
