import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCopy,
  FiPrinter,
  FiBookOpen,
  FiLayers,
  FiCamera,
  FiCreditCard,
  FiImage,
  FiFileText,
  FiArrowRight,
  FiChevronDown,
  FiCheck,
  FiStar,
} from 'react-icons/fi';

/* ─────────────────────── static data ─────────────────────── */

const services = [
  {
    icon: FiCopy,
    title: 'Xerox / Photocopying',
    description:
      'High-speed black & white and color photocopying. Single-sided or double-sided, from A5 to A3 sizes. Bulk discounts available for large orders.',
    price: '₹1',
    priceSuffix: '/page (B&W)',
    color: 'blue',
  },
  {
    icon: FiPrinter,
    title: 'Digital Printing',
    description:
      'Premium digital prints on glossy, matte, or bond paper. Perfect for brochures, flyers, certificates, and marketing materials.',
    price: '₹5',
    priceSuffix: '/page',
    color: 'indigo',
  },
  {
    icon: FiBookOpen,
    title: 'Spiral / Comb Binding',
    description:
      'Professional binding for reports, project files, and manuals. Available in multiple ring sizes and colors to suit your needs.',
    price: '₹30',
    priceSuffix: '/bind',
    color: 'purple',
  },
  {
    icon: FiLayers,
    title: 'Lamination',
    description:
      'Protect your documents with glossy or matte lamination. ID cards, certificates, photos, and important documents kept safe.',
    price: '₹10',
    priceSuffix: '/sheet',
    color: 'pink',
  },
  {
    icon: FiCamera,
    title: 'Document Scanning',
    description:
      'Convert your physical documents into high-resolution digital files. PDF, JPEG, and PNG formats. Email or USB delivery.',
    price: '₹5',
    priceSuffix: '/page',
    color: 'teal',
  },
  {
    icon: FiCreditCard,
    title: 'ID Card Printing',
    description:
      'Custom PVC ID cards with photo, barcode, and QR code support. Ideal for offices, schools, and events.',
    price: '₹50',
    priceSuffix: '/card',
    color: 'orange',
  },
  {
    icon: FiImage,
    title: 'Banner / Poster Printing',
    description:
      'Large-format printing on vinyl, flex, and canvas. Eye-catching banners and posters for events, shops, and promotions.',
    price: '₹15',
    priceSuffix: '/sq ft',
    color: 'red',
  },
  {
    icon: FiFileText,
    title: 'Thesis / Project Binding',
    description:
      'Hard-cover and soft-cover binding with gold embossing. Designed for theses, dissertations, and academic submissions.',
    price: '₹150',
    priceSuffix: '/copy',
    color: 'emerald',
  },
];

const pricingRows = [
  { service: 'B&W Xerox (Single Side)', a4: '₹1', a3: '₹2', bulk: '₹0.75' },
  { service: 'B&W Xerox (Double Side)', a4: '₹1.50', a3: '₹3', bulk: '₹1.20' },
  { service: 'Color Xerox (Single Side)', a4: '₹7', a3: '₹15', bulk: '₹5' },
  { service: 'Color Xerox (Double Side)', a4: '₹12', a3: '₹25', bulk: '₹9' },
  { service: 'Digital Print (Bond Paper)', a4: '₹5', a3: '₹10', bulk: '₹3.50' },
  { service: 'Digital Print (Glossy Paper)', a4: '₹10', a3: '₹20', bulk: '₹7' },
  { service: 'Lamination (Pouch)', a4: '₹20', a3: '₹40', bulk: '₹15' },
  { service: 'Lamination (Roll)', a4: '₹10', a3: '₹20', bulk: '₹8' },
  { service: 'Spiral Binding', a4: '₹30', a3: '₹50', bulk: '₹25' },
  { service: 'Comb Binding', a4: '₹25', a3: '₹45', bulk: '₹20' },
  { service: 'Document Scanning', a4: '₹5', a3: '₹10', bulk: '₹3' },
];

const faqs = [
  {
    question: 'What file formats do you accept for printing?',
    answer:
      'We accept PDF, DOCX, PPTX, XLSX, JPG, PNG, TIFF, and AI/PSD files. For the best quality, we recommend submitting files in PDF format with fonts embedded. You can upload files on our Order page or bring them on a USB drive.',
  },
  {
    question: 'How quickly can I get my order?',
    answer:
      'Standard orders are usually ready within 15–30 minutes. Large bulk orders (100+ pages) may take 1–2 hours. Thesis and project bindings typically require 24 hours. We also offer an express service for urgent orders at a small surcharge.',
  },
  {
    question: 'Do you offer bulk discounts?',
    answer:
      'Yes! Orders above 100 pages receive a 25% discount, and orders above 500 pages receive up to 40% off. We also have monthly plans for businesses and institutions with regular printing needs. Contact us for a custom quote.',
  },
  {
    question: 'Can I get my order delivered?',
    answer:
      'We offer delivery within a 10 km radius for orders above ₹200. Delivery charges start at ₹30 and vary by distance. For bulk orders, delivery is complimentary. You can also choose to pick up from our store.',
  },
  {
    question: 'What paper sizes and types are available?',
    answer:
      'We stock A5, A4, A3, Legal, and Letter-size papers in bond (70 GSM & 80 GSM), glossy, matte, and cardstock finishes. Special paper such as parchment, textured, or colored sheets can be arranged with prior notice.',
  },
  {
    question: 'Do you handle confidential documents?',
    answer:
      'Absolutely. All uploaded documents are automatically deleted from our servers within 24 hours of order completion. We can also sign an NDA for sensitive corporate or legal documents. Your privacy is our priority.',
  },
];

/* ─────────────────── colour helpers ─────────────────────── */

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    ring: 'group-hover:ring-blue-400',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    ring: 'group-hover:ring-indigo-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    ring: 'group-hover:ring-purple-400',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    icon: 'text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    ring: 'group-hover:ring-pink-400',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    icon: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    ring: 'group-hover:ring-teal-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    ring: 'group-hover:ring-orange-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    ring: 'group-hover:ring-red-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    ring: 'group-hover:ring-emerald-400',
  },
};

/* ─────────────────────── component ─────────────────────── */

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* ───────── Hero Section ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase bg-white/10 rounded-full backdrop-blur-sm">
            Trusted by 10,000+ customers
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Professional Printing &<br className="hidden sm:block" /> Document Services
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100 mb-10">
            From quick xerox copies to premium thesis binding — everything you need
            under one roof at unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/30"
            >
              Place an Order
              <FiArrowRight />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/60 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Services Grid ───────── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400">
              Comprehensive printing and document solutions for students,
              professionals, and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => {
              const c = colorMap[svc.color];
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className={`group relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:shadow-xl hover:ring-2 ${c.ring} transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* icon bubble */}
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-xl ${c.bg} mb-5`}
                  >
                    <Icon className={`text-2xl ${c.icon}`} />
                  </div>

                  <h3 className="text-lg font-bold mb-2">{svc.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-4">
                    {svc.description}
                  </p>

                  {/* price badge */}
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-extrabold">{svc.price}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      {svc.priceSuffix}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Pricing Table ───────── */}
      <section id="pricing" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Detailed Pricing
            </h2>
            <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400">
              Transparent pricing with no hidden charges. Bulk orders get
              additional discounts.
            </p>
          </div>

          {/* responsive wrapper */}
          <div className="overflow-x-auto rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider rounded-tl-2xl">
                    Service
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-center">
                    A4 Price
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-center">
                    A3 Price
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-center rounded-tr-2xl">
                    Bulk (100+)
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      idx % 2 === 0
                        ? 'bg-gray-50 dark:bg-gray-900/40'
                        : 'bg-white dark:bg-gray-800'
                    } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                  >
                    <td className="py-4 px-6 font-medium text-sm">
                      {row.service}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-sm">
                      {row.a4}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-sm">
                      {row.a3}
                    </td>
                    <td className="py-4 px-6 text-center text-sm">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold">
                        {row.bulk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            * All prices are per page/sheet and inclusive of GST. Prices may vary
            for special paper types.
          </p>
        </div>
      </section>

      {/* ───────── Highlights Strip ───────── */}
      <section className="py-14 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '50K+', label: 'Pages Printed Daily' },
            { value: '4.9', label: 'Google Rating', icon: <FiStar className="inline text-yellow-400" /> },
            { value: '15 min', label: 'Avg. Turnaround' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
            >
              <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                {stat.value} {stat.icon}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FAQ Section ───────── */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Got questions? We've got answers. If you don't find what you're
              looking for, feel free to{' '}
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">
                contact us
              </Link>
              .
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex items-center justify-between w-full px-6 py-5 text-left bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-900/60 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base pr-4">
                      {faq.question}
                    </span>
                    <FiChevronDown
                      className={`flex-shrink-0 text-xl text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 py-5 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── CTA Section ───────── */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Print?
          </h2>
          <p className="text-lg text-blue-100 mb-4 max-w-xl mx-auto">
            Upload your documents online and get them printed, bound, or
            laminated — ready for pickup in minutes.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-100 mb-8">
            {[
              'No minimum order',
              'Free file check',
              'Same-day service',
              'Cash & UPI accepted',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <FiCheck className="text-green-300" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/order"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/30 text-lg"
          >
            Place Your Order Now
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
