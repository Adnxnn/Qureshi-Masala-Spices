'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  adminGetOrders,
  adminUpdateOrderStatus,
} from '@/lib/admin-actions'
import type { OrderStatus, OrderWithItems } from '@/types'

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'dispatched',
  'delivered',
  'cancelled',
]

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'text-amber-400',
  confirmed: 'text-blue-400',
  dispatched: 'text-purple-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setError('')

      const fetchedOrders = await adminGetOrders()

      setOrders(fetchedOrders)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load orders.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingId(orderId)
      setError('')

      await adminUpdateOrderStatus(orderId, newStatus)
      await fetchOrders()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update the order.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold md:hidden">
            Order management
          </p>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white sm:text-4xl">
            Orders
          </h1>
        </div>
        {!loading ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
            {orders.length} total
          </span>
        ) : null}
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-white/30">
          Loading orders…
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-dark p-4 sm:p-5"
            >
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 font-mono text-xs text-gold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>

                  <div className="font-medium text-white">
                    {order.customer_name}
                  </div>

                  <div className="mt-1 flex flex-col gap-0.5 text-xs leading-5 text-white/50 sm:flex-row sm:flex-wrap sm:gap-x-2">
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="w-fit break-all transition-colors hover:text-gold"
                    >
                      {order.customer_phone}
                    </a>
                    <span className="hidden text-white/20 sm:inline" aria-hidden="true">
                      ·
                    </span>
                    <a
                      href={`mailto:${order.customer_email}`}
                      className="w-fit break-all transition-colors hover:text-gold"
                    >
                      {order.customer_email}
                    </a>
                  </div>

                  <div className="mt-1 max-w-2xl text-xs leading-5 text-white/40">
                    {order.customer_address}, {order.customer_city} -{' '}
                    {order.customer_pincode}
                  </div>
                </div>

                <div className="flex flex-row-reverse items-end justify-between gap-3 border-t border-white/5 pt-3 text-left sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <div className="font-display text-2xl text-gold">
                    ₹
                    {Number(order.total_amount).toLocaleString(
                      'en-IN'
                    )}
                  </div>

                  <div className="text-xs leading-5 text-white/40">
                    {new Date(order.created_at).toLocaleString(
                      'en-IN'
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 divide-y divide-white/5 rounded-lg border border-white/5 bg-black/20 px-3 sm:px-4">
                {(order.order_items ?? []).map((item) => {
                  const itemSubtotal =
                    item.subtotal ??
                    Number(item.unit_price) *
                      Number(item.quantity)

                  const formattedWeight =
                    item.variant_weight_grams >= 1000
                      ? `${item.variant_weight_grams / 1000}kg`
                      : `${item.variant_weight_grams}g`

                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 py-3 text-sm text-white/60"
                    >
                      <span className="min-w-0 break-words pr-1 leading-5">
                        {item.product_name} ({formattedWeight}) ×{' '}
                        {item.quantity}
                      </span>

                      <span className="flex-shrink-0 font-medium text-white/75">
                        ₹{Number(itemSubtotal).toFixed(0)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <select
                  aria-label={`Status for order ${order.id.slice(0, 8)}`}
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) =>
                    void handleUpdateStatus(
                      order.id,
                      event.target.value as OrderStatus
                    )
                  }
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none disabled:opacity-50 sm:min-h-11 sm:w-auto sm:text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </option>
                  ))}
                </select>

                <span
                  className={`w-fit rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium ${
                    STATUS_COLOR[order.status]
                  }`}
                >
                  Current: {order.status}
                </span>

                {order.notes && (
                  <span className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs italic leading-5 text-white/45 sm:ml-0">
                    Note: {order.notes}
                  </span>
                )}
              </div>
            </article>
          ))}

          {orders.length === 0 && (
            <div className="py-20 text-center text-white/25">
              No orders have been placed yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
