import { adminGetOrders, adminGetProducts } from '@/lib/admin-actions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [orders, products] = await Promise.all([adminGetOrders(), adminGetProducts()])

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total_amount), 0)
  const pending = orders.filter(o => o.status === 'pending').length
  const lowStock = products.filter(p => p.stock_qty < 10).length

  const stats = [
    { label: 'Total Orders', value: orders.length, sub: `${pending} pending` },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'All time' },
    { label: 'Products', value: products.filter(p => p.is_active).length, sub: `${lowStock} low stock` },
    { label: 'Avg Order', value: orders.length ? `₹${Math.round(totalRevenue / orders.length)}` : '—', sub: 'Per order' },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-white tracking-wider mb-8">Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-dark border border-white/5 p-5 rounded">
            <div className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-2">{s.label}</div>
            <div className="font-display text-3xl text-gold leading-none mb-1">{s.value}</div>
            <div className="text-xs text-white/30">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <h2 className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">Recent Orders</h2>
      <div className="bg-dark border border-white/5 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Order ID','Customer','Items','Amount','Status','Date'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-white/30 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map(o => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gold">{o.id.slice(0,8).toUpperCase()}</td>
                <td className="px-4 py-3 text-white/70">{o.customer_name}</td>
                <td className="px-4 py-3 text-white/50">{(o as any).order_items?.length ?? 0}</td>
                <td className="px-4 py-3 text-white">₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase rounded ${
                    o.status === 'pending'    ? 'bg-amber-500/15 text-amber-400' :
                    o.status === 'confirmed'  ? 'bg-blue-500/15 text-blue-400' :
                    o.status === 'dispatched' ? 'bg-purple-500/15 text-purple-400' :
                    o.status === 'delivered'  ? 'bg-green-500/15 text-green-400' :
                                               'bg-red-500/15 text-red-400'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/35 text-xs">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12 text-white/25 text-sm">No orders yet.</div>
        )}
      </div>
    </div>
  )
}
