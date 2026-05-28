import { Link } from 'react-router-dom';
import {
  FiPrinter,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiClock,
  FiDollarSign,
  FiArrowRight
} from 'react-icons/fi';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Upload, Print & Collect – Fast Xerox Services
              </h1>
              <p className="text-lg text-blue-100 mb-6">
                Get your documents printed and xeroxed in minutes, not hours. Fast, reliable, and affordable.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/order"
                  className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
                >
                  Place Order Now
                  <FiArrowRight />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  View Services
                </Link>
              </div>
            </div>
            <div className="text-6xl text-center opacity-20">
              📄📋📑
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Black & White Xerox',
                description: 'Fast and affordable xeroxing for documents'
              },
              {
                icon: '🌈',
                title: 'Color Xerox',
                description: 'Vibrant color copies for presentations'
              },
              {
                icon: '🖨️',
                title: 'Professional Printing',
                description: 'High-quality printing services'
              },
              {
                icon: '📎',
                title: 'Binding Services',
                description: 'Spiral and perfect binding available'
              },
              {
                icon: '🔍',
                title: 'Document Scanning',
                description: 'Convert physical documents to digital'
              },
              {
                icon: '📸',
                title: 'Passport Photos',
                description: 'Quick passport size photo printing'
              }
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiZap className="text-4xl text-blue-600" />,
                title: 'Lightning Fast',
                description: 'Orders ready in minutes'
              },
              {
                icon: <FiDollarSign className="text-4xl text-green-600" />,
                title: 'Best Prices',
                description: 'Competitive and transparent pricing'
              },
              {
                icon: <FiShield className="text-4xl text-purple-600" />,
                title: 'Secure & Safe',
                description: 'Your documents are safe with us'
              },
              {
                icon: <FiClock className="text-4xl text-orange-600" />,
                title: '24/7 Support',
                description: 'Always here to help you'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Student',
                text: 'Amazing service! Got my project prints done in 30 minutes. Highly recommended!',
                rating: 5
              },
              {
                name: 'Raj Patel',
                role: 'Business Owner',
                text: 'Professional quality and very affordable. Using their services for bulk orders.',
                rating: 5
              },
              {
                name: 'Emma Wilson',
                role: 'Teacher',
                text: 'Fast turnaround and excellent quality. My students love getting their work printed here.',
                rating: 4
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.text}"</p>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Upload your documents now and get them ready for pickup or delivery
          </p>
          <Link
            to="/order"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
          >
            Place Your Order →
          </Link>
        </div>
      </section>
    </div>
  );
}
