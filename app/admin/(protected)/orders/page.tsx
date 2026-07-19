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
      <h1 className="mb-8 font-display text-3xl uppercase tracking-wider text-white">
        Orders
      </h1>

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
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded border border-white/5 bg-dark p-5"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-1 font-mono text-xs text-gold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>

                  <div className="font-medium text-white">
                    {order.customer_name}
                  </div>

                  <div className="mt-0.5 text-xs text-white/40">
                    {order.customer_phone} · {order.customer_email}
                  </div>

                  <div className="mt-0.5 text-xs text-white/30">
                    {order.customer_address}, {order.customer_city} -{' '}
                    {order.customer_pincode}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-display text-2xl text-gold">
                    ₹
                    {Number(order.total_amount).toLocaleString(
                      'en-IN'
                    )}
                  </div>

                  <div className="text-xs text-white/35">
                    {new Date(order.created_at).toLocaleString(
                      'en-IN'
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-1">
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
                      className="flex justify-between border-b border-white/5 py-2 text-sm text-white/50"
                    >
                      <span>
                        {item.product_name} ({formattedWeight}) ×{' '}
                        {item.quantity}
                      </span>

                      <span>
                        ₹{Number(itemSubtotal).toFixed(0)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) =>
                    void handleUpdateStatus(
                      order.id,
                      event.target.value as OrderStatus
                    )
                  }
                  className="border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </option>
                  ))}
                </select>

                <span
                  className={`text-xs font-medium ${
                    STATUS_COLOR[order.status]
                  }`}
                >
                  Current: {order.status}
                </span>

                {order.notes && (
                  <span className="ml-2 text-xs italic text-white/30">
                    Note: {order.notes}
                  </span>
                )}
              </div>
            </div>
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