import { useState } from 'react';
import {
  FiSearch,
  FiPackage,
  FiSettings,
  FiPrinter,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiCopy,
  FiDollarSign,
  FiCalendar,
  FiHash,
  FiAlertCircle,
  FiChevronRight,
  FiArchive,
} from 'react-icons/fi';

/* ------------------------------------------------------------------ */
/*  Static demo data                                                   */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: 'Received', icon: FiPackage, description: 'Order has been received' },
  { label: 'Processing', icon: FiSettings, description: 'Preparing your files' },
  { label: 'Printing', icon: FiPrinter, description: 'Currently printing' },
  { label: 'Ready for Pickup', icon: FiCheckCircle, description: 'Come pick it up!' },
  { label: 'Completed', icon: FiArchive, description: 'Order completed' },
];

const CURRENT_STEP = 2; // 0-indexed → "Printing"

const buildDemoOrder = (orderId) => ({
  id: orderId || 'XRX-29174',
  service: 'Color Printing – A4 Glossy',
  pages: 48,
  copies: 3,
  totalAmount: 720,
  placedAt: 'May 27, 2026 – 02:15 PM',
  estimatedReady: 'May 27, 2026 – 04:30 PM',
  currentStep: CURRENT_STEP,
  notes: 'Double-sided, stapled',
});

const PAST_ORDERS = [
  {
    id: 'XRX-28910',
    service: 'B&W Xerox – A4',
    pages: 120,
    copies: 1,
    totalAmount: 240,
    date: 'May 24, 2026',
    status: 'Completed',
  },
  {
    id: 'XRX-28732',
    service: 'Color Printing – A3',
    pages: 16,
    copies: 2,
    totalAmount: 640,
    date: 'May 20, 2026',
    status: 'Completed',
  },
  {
    id: 'XRX-28501',
    service: 'Spiral Binding + Print',
    pages: 85,
    copies: 5,
    totalAmount: 1750,
    date: 'May 15, 2026',
    status: 'Completed',
  },
  {
    id: 'XRX-28220',
    service: 'Passport Photos',
    pages: 1,
    copies: 8,
    totalAmount: 160,
    date: 'May 10, 2026',
    status: 'Completed',
  },
];

/* ------------------------------------------------------------------ */
/*  Status badge helper                                                */
/* ------------------------------------------------------------------ */
const statusColor = (step) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  ];
  return colors[step] ?? colors[4];
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TimelineStepper({ currentStep }) {
  return (
    <div className="w-full py-6">
      {/* Desktop horizontal stepper */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* Connector line (background) */}
        <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        {/* Connector line (progress) */}
        <div
          className="absolute top-6 left-[10%] h-1 bg-blue-600 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(currentStep / (STEPS.length - 1)) * 80}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isFuture = idx > currentStep;

          return (
            <div key={step.label} className="flex flex-col items-center z-10 flex-1">
              {/* Circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-500 ease-out
                  ${isCompleted
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900 shadow-xl shadow-blue-600/40 scale-110'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }
                `}
              >
                {isCompleted ? (
                  <FiCheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              {/* Label */}
              <span
                className={`
                  mt-3 text-xs font-semibold text-center leading-tight
                  transition-colors duration-300
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : isCompleted
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                  }
                `}
              >
                {step.label}
              </span>
              {/* Description (active only) */}
              {isActive && (
                <span className="mt-1 text-[11px] text-blue-500 dark:text-blue-400 animate-pulse">
                  {step.description}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile vertical stepper */}
      <div className="md:hidden flex flex-col gap-0">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.label} className="flex items-start gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    transition-all duration-500
                    ${isCompleted
                      ? 'bg-blue-600 text-white'
                      : isActive
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900 scale-110'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? <FiCheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-10 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    } transition-colors duration-500`}
                  />
                )}
              </div>
              {/* Text */}
              <div className="pt-2 pb-4">
                <p
                  className={`text-sm font-semibold ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : isCompleted
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-blue-500 dark:text-blue-400 animate-pulse mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderDetailCard({ order }) {
  const details = [
    { icon: FiFileText, label: 'Service', value: order.service },
    { icon: FiCopy, label: 'Pages / Copies', value: `${order.pages} pages × ${order.copies} copies` },
    { icon: FiDollarSign, label: 'Total Amount', value: `₹${order.totalAmount.toLocaleString()}` },
    { icon: FiCalendar, label: 'Placed On', value: order.placedAt },
    { icon: FiClock, label: 'Estimated Ready', value: order.estimatedReady },
    { icon: FiHash, label: 'Notes', value: order.notes },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {details.map((d) => {
        const Icon = d.icon;
        return (
          <div
            key={d.label}
            className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <Icon className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                {d.label}
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                {d.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function TrackOrder() {
  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    // Simulate a short loading state
    setIsSearching(true);
    setTrackedOrder(null);

    setTimeout(() => {
      setTrackedOrder(buildDemoOrder(searchId.trim().toUpperCase()));
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ---- Hero / Search Section ---- */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Enter your order ID below to see real-time status updates and estimated completion time.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleTrack}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. XRX-29174"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 shadow-lg text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Searching…
                </>
              ) : (
                <>
                  Track Order
                  <FiChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* ---- Tracked Order Result ---- */}
      <section className="max-w-5xl mx-auto px-4 -mt-6 relative z-20">
        {trackedOrder && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-[fadeSlideUp_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Order ID
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {trackedOrder.id}
                </h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusColor(
                  trackedOrder.currentStep
                )}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
                {STEPS[trackedOrder.currentStep].label}
              </span>
            </div>

            {/* Timeline */}
            <div className="px-6 py-4">
              <TimelineStepper currentStep={trackedOrder.currentStep} />
            </div>

            {/* Order details */}
            <div className="px-6 pb-6">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                Order Details
              </h3>
              <OrderDetailCard order={trackedOrder} />
            </div>
          </div>
        )}

        {/* Empty-state hint */}
        {!trackedOrder && !isSearching && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
              <FiPackage className="w-9 h-9 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              No order tracked yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Enter your order ID above to view the current status, estimated completion time, and full
              order details.
            </p>
          </div>
        )}
      </section>

      {/* ---- Order History ---- */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FiClock className="text-blue-600" />
          Recent Order History
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold text-center">Pages</th>
                <th className="px-6 py-4 font-semibold text-center">Copies</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Date</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {PAST_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.service}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{order.pages}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{order.copies}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-gray-200">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      <FiCheckCircle className="w-3 h-3" />
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-4">
          {PAST_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {order.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  <FiCheckCircle className="w-3 h-3" />
                  {order.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {order.service}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>{order.pages} pages</span>
                <span>{order.copies} copies</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{order.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Inline keyframe for fade-slide animation ---- */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
