import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingCart,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiPrinter,
  FiPlus,
  FiDownload,
  FiSettings,
  FiTrendingUp,
  FiPackage,
  FiEdit,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const statsCards = [
  {
    title: 'Total Orders',
    value: '1,247',
    change: '+12.5%',
    positive: true,
    icon: FiShoppingCart,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Revenue',
    value: '₹45,680',
    change: '+8.2%',
    positive: true,
    icon: FiDollarSign,
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Active Users',
    value: '342',
    change: '+3.1%',
    positive: true,
    icon: FiUsers,
    color: 'from-violet-500 to-violet-600',
    bgLight: 'bg-violet-50 dark:bg-violet-900/30',
    textColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'Pending Orders',
    value: '18',
    change: '-2.4%',
    positive: false,
    icon: FiClock,
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
];

const recentOrders = [
  {
    id: 'ORD-1042',
    customer: 'Rahul Sharma',
    service: 'Color Xerox (20 pages)',
    status: 'Completed',
    amount: '₹340',
    date: '27 May 2026',
  },
  {
    id: 'ORD-1041',
    customer: 'Priya Patel',
    service: 'Spiral Binding + Print',
    status: 'Processing',
    amount: '₹580',
    date: '27 May 2026',
  },
  {
    id: 'ORD-1040',
    customer: 'Amit Verma',
    service: 'Lamination (5 sheets)',
    status: 'Pending',
    amount: '₹150',
    date: '26 May 2026',
  },
  {
    id: 'ORD-1039',
    customer: 'Sneha Reddy',
    service: 'B&W Print (100 pages)',
    status: 'Completed',
    amount: '₹200',
    date: '26 May 2026',
  },
  {
    id: 'ORD-1038',
    customer: 'Karthik Nair',
    service: 'ID Card Print (10 pcs)',
    status: 'Cancelled',
    amount: '₹750',
    date: '25 May 2026',
  },
];

const weeklyRevenue = [
  { day: 'Mon', amount: 5200, max: 8500 },
  { day: 'Tue', amount: 7100, max: 8500 },
  { day: 'Wed', amount: 4800, max: 8500 },
  { day: 'Thu', amount: 8500, max: 8500 },
  { day: 'Fri', amount: 6300, max: 8500 },
  { day: 'Sat', amount: 7800, max: 8500 },
  { day: 'Sun', amount: 3200, max: 8500 },
];

const quickActions = [
  { label: 'New Order', icon: FiPlus, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { label: 'Print Report', icon: FiPrinter, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { label: 'Export Data', icon: FiDownload, color: 'bg-violet-600 hover:bg-violet-700 text-white' },
  { label: 'Settings', icon: FiSettings, color: 'bg-gray-600 hover:bg-gray-700 text-white' },
];

const statusStyles = {
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                  <FiPrinter className="text-white" size={16} />
                </div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                  Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, Admin 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s what&apos;s happening with your xerox center today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.title}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgLight}`}>
                    <IconComp className={card.textColor} size={22} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      card.positive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    }`}
                  >
                    <FiTrendingUp
                      size={12}
                      className={card.positive ? '' : 'rotate-180'}
                    />
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {card.title}
                </p>
                {/* Bottom accent */}
                <div
                  className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r ${card.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Weekly Revenue
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Last 7 days performance
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ₹42,900
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-56">
              {weeklyRevenue.map((item) => {
                const heightPercent = (item.amount / item.max) * 100;
                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">
                      ₹{(item.amount / 1000).toFixed(1)}k
                    </span>
                    <div className="w-full relative flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 hover:from-blue-500 hover:to-blue-300 transition-all duration-300 cursor-pointer relative group"
                        style={{ height: `${heightPercent}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          ₹{item.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] ${action.color}`}
                  >
                    <ActionIcon size={18} />
                    {action.label}
                  </button>
                );
              })}
            </div>

            {/* Mini Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Today&apos;s Summary
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Orders Today
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    34
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue Today
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹7,240
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    94%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: '94%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Latest customer orders and their status
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <FiRefreshCw size={14} />
                Refresh
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.service}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {order.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {order.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          <FiEye size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
                          <FiEdit size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {order.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.service}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {order.amount}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {order.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing 5 of 1,247 orders
              </p>
              <Link
                to="/admin/orders"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
