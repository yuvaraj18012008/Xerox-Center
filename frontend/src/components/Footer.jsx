import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              🖨️ Smart Xerox Center
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Fast, reliable xerox and printing services at your fingertips.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-pink-400 transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-400 transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-blue-400 transition">
                  Place Order
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-blue-400 transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Xerox (B&W)</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Xerox (Color)</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Printing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Scanning</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Binding</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <FiPhone size={18} />
                <a href="tel:+919876543210" className="hover:text-blue-400 transition">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail size={18} />
                <a href="mailto:info@xeroxcenter.com" className="hover:text-blue-400 transition">
                  info@xeroxcenter.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <FiMapPin size={18} className="mt-1" />
                <p>123 Business Street,<br/>City, State 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-700">
            <div>
              <h5 className="text-white font-semibold mb-2">Business Hours</h5>
              <p className="text-sm text-gray-400">
                Monday - Friday: 9:00 AM - 8:00 PM<br />
                Saturday: 10:00 AM - 6:00 PM<br />
                Sunday: Closed
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-2">Payment Methods</h5>
              <p className="text-sm text-gray-400">
                Cash • UPI • Credit/Debit Cards<br />
                QR Payment • Digital Wallets
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-2">Legal</h5>
              <p className="text-sm text-gray-400">
                <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a><br />
                <a href="#" className="hover:text-blue-400 transition">Terms & Conditions</a><br />
                <a href="#" className="hover:text-blue-400 transition">Refund Policy</a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>
              © {currentYear} Smart Xerox Center. All rights reserved. | Made with ❤️ by the Development Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
