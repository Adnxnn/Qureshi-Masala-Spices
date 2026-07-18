'use client'

import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/admin-actions'
import { useEffect, useState } from 'react'
import type { OrderWithItems } from '@/types'

const STATUS_OPTIONS = ['pending','confirmed','dispatched','delivered','cancelled']
const STATUS_COLOR: Record<string,string> = {
  pending:    'text-amber-400',
  confirmed:  'text-blue-400',
  dispatched: 'text-purple-400',
  delivered:  'text-green-400',
  cancelled:  'text-red-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await adminGetOrders()
      setOrders(fetchedOrders)
    }
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await adminUpdateOrderStatus(orderId, newStatus)

    const updatedOrders = await adminGetOrders()
    setOrders(updatedOrders)
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-white tracking-wider mb-8">Orders</h1>

      <div className="space-y-4">
        {orders.map((o: OrderWithItems) => (
          <div key={o.id} className="bg-dark border border-white/5 rounded p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="font-mono text-xs text-gold mb-1">#{o.id.slice(0,8).toUpperCase()}</div>
                <div className="font-medium text-white">{o.customer_name}</div>
                <div className="text-xs text-white/40 mt-0.5">{o.customer_phone} · {o.customer_email}</div>
                <div className="text-xs text-white/30 mt-0.5">{o.customer_address}, {o.customer_city} - {o.customer_pincode}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-gold">₹{Number(o.total_amount).toLocaleString('en-IN')}</div>
                <div className="text-xs text-white/35">{new Date(o.created_at).toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Order items */}
            <div className="space-y-1 mb-4">
              {(o as any).order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm text-white/50 py-1 border-b border-white/5">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>₹{Number(item.subtotal).toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Status update */}
            <div className="flex items-center gap-3">
              <select
                value={o.status}
                onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                className="bg-black border border-white/10 text-white text-xs px-3 py-2 focus:border-gold focus:outline-none"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <span className={`text-xs font-medium ${STATUS_COLOR[o.status]}`}>
                Current: {o.status}
              </span>
              {o.notes && <span className="text-xs text-white/30 italic ml-2">Note: {o.notes}</span>}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 text-white/25">No orders yet. Share your website to start getting orders!</div>
        )}
      </div>
    </div>
  )
}
