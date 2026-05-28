import { useState } from 'react';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiChevronDown,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const contactCards = [
  {
    icon: <FiPhone className="text-3xl text-blue-600" />,
    title: 'Phone',
    lines: ['+91 98765 43210', '+91 98765 43211'],
    action: 'tel:+919876543210',
    actionLabel: 'Call Now',
  },
  {
    icon: <FiMail className="text-3xl text-blue-600" />,
    title: 'Email',
    lines: ['info@xeroxcenter.com', 'support@xeroxcenter.com'],
    action: 'mailto:info@xeroxcenter.com',
    actionLabel: 'Send Email',
  },
  {
    icon: <FiMapPin className="text-3xl text-blue-600" />,
    title: 'Address',
    lines: ['123 Business Street,', 'Near University Gate,', 'Hyderabad, Telangana 500001'],
    action: 'https://maps.google.com/?q=Hyderabad+Telangana+500001',
    actionLabel: 'Get Directions',
  },
  {
    icon: <FiClock className="text-3xl text-blue-600" />,
    title: 'Business Hours',
    lines: ['Mon – Sat: 8:00 AM – 9:00 PM', 'Sunday: 10:00 AM – 6:00 PM'],
    action: null,
    actionLabel: null,
  },
];

const subjectOptions = [
  'General Inquiry',
  'Printing Services',
  'Bulk Order Request',
  'Binding & Lamination',
  'Pricing Information',
  'Complaint / Feedback',
  'Partnership / Business',
  'Other',
];

const socialLinks = [
  { icon: <FiFacebook />, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
  { icon: <FiTwitter />, label: 'Twitter', href: '#', color: 'hover:bg-sky-500' },
  { icon: <FiInstagram />, label: 'Instagram', href: '#', color: 'hover:bg-pink-600' },
  { icon: <FiLinkedin />, label: 'LinkedIn', href: '#', color: 'hover:bg-blue-700' },
  { icon: <FiYoutube />, label: 'YouTube', href: '#', color: 'hover:bg-red-600' },
];

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.phone && !/^[+]?[\d\s-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast.success('Message sent successfully! We will get back to you within 24 hours.', {
      duration: 5000,
      icon: '🎉',
    });

    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
  };

  const inputBase =
    'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none';
  const inputNormal = 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
  const inputError = 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ───── Hero Section ───── */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions or need a quote? We&apos;d love to hear from you. Reach out and our team
            will respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ───── Contact Info Cards ───── */}
      <section className="py-12 px-4 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{card.title}</h3>
              {card.lines.map((line, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {line}
                </p>
              ))}
              {card.action && (
                <a
                  href={card.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
                >
                  {card.actionLabel} →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───── Contact Form + Map ───── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Send Us a Message
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.name ? inputError : inputNormal}`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputBase} pl-10 ${errors.email ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${inputBase} pl-10 ${errors.phone ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 pr-10 appearance-none ${errors.subject ? inputError : inputNormal}`}
                  >
                    <option value="">— Select a subject —</option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help you…"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Find Us</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Visit our store near University Gate, Hyderabad.
            </p>
            <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <iframe
                title="Xerox Center Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.5!2d78.4867!3d17.385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDIzJzA2LjAiTiA3OMKwMjknMTIuMSJF!5e0!3m2!1sen!2sin!4v1690000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Social Media & CTA ───── */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Connect With Us</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Follow us on social media for the latest offers, tips, and updates.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white text-xl transition-all duration-300 hover:text-white hover:scale-110 ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/20 max-w-2xl mx-auto">
            <p className="text-blue-100 text-sm">
              🖨️ Xerox &amp; Printing Center · Trusted by 5,000+ customers · Serving Hyderabad since 2015
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
