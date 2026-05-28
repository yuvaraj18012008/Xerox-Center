import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiPrinter,
  FiUploadCloud,
  FiSettings,
  FiCheckCircle,
  FiFile,
  FiX,
  FiChevronRight,
  FiChevronLeft,
  FiCopy,
  FiBookOpen,
  FiImage,
  FiSearch,
  FiLayers,
  FiCreditCard,
  FiTrash2,
  FiFileText,
  FiPhone,
} from 'react-icons/fi';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Hardcoded price rates ────────────────────────────────────────────
const SERVICES = [
  {
    id: 'xerox',
    name: 'Xerox / Photocopy',
    icon: <FiCopy className="text-2xl" />,
    description: 'Fast black & white or color photocopies',
    baseRate: { bw: 1.5, color: 8 },
  },
  {
    id: 'printing',
    name: 'Printing',
    icon: <FiPrinter className="text-2xl" />,
    description: 'High-quality document printing',
    baseRate: { bw: 3, color: 12 },
  },
  {
    id: 'binding',
    name: 'Binding',
    icon: <FiBookOpen className="text-2xl" />,
    description: 'Spiral, perfect, or hardcover binding',
    baseRate: { bw: 3, color: 12 },
    bindingCost: { spiral: 30, softcover: 60, hardcover: 150 },
  },
  {
    id: 'lamination',
    name: 'Lamination',
    icon: <FiLayers className="text-2xl" />,
    description: 'Protect your documents with lamination',
    baseRate: { bw: 0, color: 0 },
    perPage: { A4: 20, A3: 35, Legal: 25, Letter: 20 },
  },
  {
    id: 'scanning',
    name: 'Scanning',
    icon: <FiSearch className="text-2xl" />,
    description: 'Convert physical documents to digital',
    baseRate: { bw: 0, color: 0 },
    perPage: { A4: 5, A3: 8, Legal: 6, Letter: 5 },
  },
  {
    id: 'photo_print',
    name: 'Photo Printing',
    icon: <FiImage className="text-2xl" />,
    description: 'Glossy or matte photo prints',
    baseRate: { bw: 0, color: 15 },
  },
];

const PAPER_SIZES = ['A4', 'A3', 'Legal', 'Letter'];
const PAPER_SIZE_MULTIPLIER = { A4: 1, A3: 1.8, Legal: 1.3, Letter: 1 };
const BINDING_TYPES = [
  { id: 'spiral', name: 'Spiral Binding', price: 30 },
  { id: 'softcover', name: 'Soft Cover', price: 60 },
  { id: 'hardcover', name: 'Hard Cover', price: 150 },
];

const STEPS = [
  { id: 1, label: 'Service', icon: <FiPrinter /> },
  { id: 2, label: 'Upload', icon: <FiUploadCloud /> },
  { id: 3, label: 'Specs', icon: <FiSettings /> },
  { id: 4, label: 'Review', icon: <FiCheckCircle /> },
];

const INITIAL_FORM = {
  service: '',
  files: [],
  paperSize: 'A4',
  colorMode: 'bw',
  copies: 1,
  sided: 'single',
  bindingType: 'spiral',
  notes: '',
  phone: '',
};

// ─── Helper: format file size ─────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Step Indicator ───────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-600/20'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {isCompleted ? <FiCheckCircle /> : step.icon}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-10 sm:w-20 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-500 ${
                  currentStep > step.id
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Service Selection ────────────────────────────────────────
function ServiceSelection({ formData, setFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Choose a Service
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Select the type of service you need for your documents.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((svc) => {
          const selected = formData.service === svc.id;
          return (
            <button
              type="button"
              key={svc.id}
              onClick={() => setFormData((f) => ({ ...f, service: svc.id }))}
              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-lg shadow-blue-600/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
              }`}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-white text-sm" />
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600'
                }`}
              >
                {svc.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {svc.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {svc.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Upload Documents ─────────────────────────────────────────
function UploadDocuments({ formData, setFormData }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFormData((f) => ({
        ...f,
        files: [
          ...f.files,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ],
      }));
    },
    [setFormData]
  );

  const removeFile = (index) => {
    setFormData((f) => ({
      ...f,
      files: f.files.filter((_, i) => i !== index),
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
    },
    maxSize: 25 * 1024 * 1024, // 25 MB
  });

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <FiImage className="text-pink-500" />;
    if (file.type.includes('pdf')) return <FiFileText className="text-red-500" />;
    return <FiFile className="text-blue-500" />;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Upload Documents
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Drag &amp; drop your files or click to browse. Max 25 MB per file.
      </p>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
        }`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud
          className={`mx-auto text-5xl mb-4 transition-colors ${
            isDragActive
              ? 'text-blue-500'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        />
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
            Drop your files here...
          </p>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
              Drag &amp; drop files here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or <span className="text-blue-600 dark:text-blue-400 underline">browse</span> to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              PDF, DOC, DOCX, PPT, PPTX, PNG, JPG — up to 25 MB
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {formData.files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Uploaded Files ({formData.files.length})
          </h3>
          {formData.files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                  {getFileIcon(file)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                aria-label="Remove file"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Specifications ───────────────────────────────────────────
function Specifications({ formData, setFormData }) {
  const selectedService = SERVICES.find((s) => s.id === formData.service);
  const showColorOption = !['scanning', 'lamination'].includes(formData.service);
  const showBindingOption = formData.service === 'binding';
  const showCopies = !['scanning'].includes(formData.service);
  const showSided = !['lamination', 'scanning', 'photo_print'].includes(formData.service);

  const labelClass =
    'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2';
  const selectClass =
    'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Specifications
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Configure options for{' '}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {selectedService?.name}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paper Size */}
        <div>
          <label className={labelClass}>Paper Size</label>
          <div className="grid grid-cols-2 gap-3">
            {PAPER_SIZES.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setFormData((f) => ({ ...f, paperSize: size }))}
                className={`py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                  formData.paperSize === size
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Mode */}
        {showColorOption && (
          <div>
            <label className={labelClass}>Color Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'bw', label: 'Black & White', icon: '◐' },
                { id: 'color', label: 'Color', icon: '🌈' },
              ].map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() =>
                    setFormData((f) => ({ ...f, colorMode: mode.id }))
                  }
                  className={`py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all flex items-center gap-2 justify-center ${
                    formData.colorMode === mode.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  }`}
                >
                  <span>{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Copies */}
        {showCopies && (
          <div>
            <label className={labelClass}>Number of Copies</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({
                    ...f,
                    copies: Math.max(1, f.copies - 1),
                  }))
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 transition flex items-center justify-center text-xl font-bold"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.copies}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    copies: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                className="w-20 h-12 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((f) => ({
                    ...f,
                    copies: Math.min(999, f.copies + 1),
                  }))
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 transition flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Sided */}
        {showSided && (
          <div>
            <label className={labelClass}>Print Sides</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'single', label: 'Single Sided' },
                { id: 'double', label: 'Double Sided' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() =>
                    setFormData((f) => ({ ...f, sided: opt.id }))
                  }
                  className={`py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                    formData.sided === opt.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Binding Type */}
        {showBindingOption && (
          <div className="md:col-span-2">
            <label className={labelClass}>Binding Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BINDING_TYPES.map((bt) => (
                <button
                  type="button"
                  key={bt.id}
                  onClick={() =>
                    setFormData((f) => ({ ...f, bindingType: bt.id }))
                  }
                  className={`py-4 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                    formData.bindingType === bt.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div>{bt.name}</div>
                  <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    ₹{bt.price}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Number */}
        <div>
          <label className={labelClass}>
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                setFormData((f) => ({ ...f, phone: val }));
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className={`${selectClass} pl-12`}
            />
          </div>
          {formData.phone && formData.phone.length < 10 && (
            <p className="text-xs text-amber-500 mt-1">Please enter a valid 10-digit number</p>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className={labelClass}>Special Instructions (optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((f) => ({ ...f, notes: e.target.value }))
            }
            rows={3}
            placeholder="E.g., Print only pages 1-5, staple top-left corner..."
            className={`${selectClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Review & Confirm ─────────────────────────────────────────
function ReviewConfirm({ formData, estimatedPrice, priceBreakdown }) {
  const selectedService = SERVICES.find((s) => s.id === formData.service);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Review Your Order
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Please verify all details before placing your order.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Service
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                {selectedService?.icon}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                {selectedService?.name}
              </span>
            </div>
          </div>

          {/* Files */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Files ({formData.files.length})
            </h3>
            <div className="space-y-2">
              {formData.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <FiFile className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-400 ml-auto text-xs flex-shrink-0">
                    {formatBytes(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Contact
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center">
                <FiPhone size={18} />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.phone || 'Not provided'}
              </span>
            </div>
          </div>

          {/* Specifications */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Paper Size</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formData.paperSize}
                </p>
              </div>
              {!['scanning', 'lamination'].includes(formData.service) && (
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Color</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.colorMode === 'bw' ? 'Black & White' : 'Color'}
                  </p>
                </div>
              )}
              {formData.service !== 'scanning' && (
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Copies</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.copies}
                  </p>
                </div>
              )}
              {!['lamination', 'scanning', 'photo_print'].includes(formData.service) && (
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Sides</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {formData.sided}
                  </p>
                </div>
              )}
              {formData.service === 'binding' && (
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Binding</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {BINDING_TYPES.find((b) => b.id === formData.bindingType)?.name}
                  </p>
                </div>
              )}
            </div>
            {formData.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow-xl shadow-blue-600/20">
            <div className="flex items-center gap-2 mb-5">
              <FiCreditCard className="text-xl" />
              <h3 className="font-bold text-lg">Price Estimate</h3>
            </div>
            <div className="space-y-3 mb-5 text-sm">
              {priceBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-blue-200">{item.label}</span>
                  <span className="font-medium">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-blue-500/40 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-100">Total</span>
                <span className="text-3xl font-bold">
                  ₹{estimatedPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-blue-300 mt-2">
                * Final price may vary based on actual page count
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function OrderManagement() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ── Price calculation ───────────────────────────────────────────────
  const { estimatedPrice, priceBreakdown } = useMemo(() => {
    const breakdown = [];
    const service = SERVICES.find((s) => s.id === formData.service);
    if (!service) return { estimatedPrice: 0, priceBreakdown: [] };

    const pageEstimate = Math.max(formData.files.length * 5, 1); // rough estimate: 5 pages per file
    const sizeMultiplier = PAPER_SIZE_MULTIPLIER[formData.paperSize] || 1;

    if (['lamination'].includes(formData.service)) {
      const perPage = service.perPage?.[formData.paperSize] || 20;
      const laminationCost = perPage * pageEstimate * formData.copies;
      breakdown.push({
        label: `Lamination (${formData.paperSize}) × ${pageEstimate} pg`,
        amount: laminationCost,
      });
      return { estimatedPrice: laminationCost, priceBreakdown: breakdown };
    }

    if (['scanning'].includes(formData.service)) {
      const perPage = service.perPage?.[formData.paperSize] || 5;
      const scanCost = perPage * pageEstimate;
      breakdown.push({
        label: `Scanning (${formData.paperSize}) × ${pageEstimate} pg`,
        amount: scanCost,
      });
      return { estimatedPrice: scanCost, priceBreakdown: breakdown };
    }

    // Print / Xerox / Photo / Binding base cost
    const rate = service.baseRate[formData.colorMode] || service.baseRate.bw;
    const baseCost = rate * pageEstimate * sizeMultiplier;
    breakdown.push({
      label: `${formData.colorMode === 'color' ? 'Color' : 'B&W'} × ${pageEstimate} pages`,
      amount: baseCost,
    });

    // Copies
    const copiesCost = baseCost * (formData.copies - 1);
    if (formData.copies > 1) {
      breakdown.push({
        label: `Additional copies (×${formData.copies - 1})`,
        amount: copiesCost,
      });
    }

    // Double sided discount (−20%)
    let sidedDiscount = 0;
    if (formData.sided === 'double' && !['lamination', 'scanning', 'photo_print'].includes(formData.service)) {
      sidedDiscount = (baseCost + copiesCost) * 0.2;
      breakdown.push({
        label: 'Double-sided discount (−20%)',
        amount: -sidedDiscount,
      });
    }

    // Binding cost
    let bindingCost = 0;
    if (formData.service === 'binding') {
      const bt = BINDING_TYPES.find((b) => b.id === formData.bindingType);
      bindingCost = (bt?.price || 0) * formData.copies;
      breakdown.push({
        label: `${bt?.name} × ${formData.copies}`,
        amount: bindingCost,
      });
    }

    const total = baseCost + copiesCost - sidedDiscount + bindingCost;
    return { estimatedPrice: total, priceBreakdown: breakdown };
  }, [formData]);

  // ── Validation per step ─────────────────────────────────────────────
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return formData.service !== '';
      case 2:
        return formData.files.length > 0;
      case 3:
        return formData.phone.length === 10;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData.service, formData.files.length, formData.phone]);

  const handleNext = () => {
    if (!canProceed) {
      if (currentStep === 1) toast.error('Please select a service to continue.');
      if (currentStep === 2) toast.error('Please upload at least one file.');
      if (currentStep === 3) toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build FormData with actual files
      const formDataToSend = new FormData();
      formDataToSend.append('service', formData.service);
      formDataToSend.append('paperSize', formData.paperSize);
      formDataToSend.append('colorMode', formData.colorMode);
      formDataToSend.append('copies', formData.copies);
      formDataToSend.append('sided', formData.sided);
      formDataToSend.append('bindingType', formData.bindingType);
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('estimatedPrice', estimatedPrice);
      formDataToSend.append('priceBreakdown', JSON.stringify(priceBreakdown));

      // Append actual files
      formData.files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      const response = await orderService.createOrder(formDataToSend);

      if (response.data.success) {
        toast.success(
          <div>
            <p className="font-bold">Order Placed Successfully! 🎉</p>
            <p className="text-sm mt-1">
              Order #{response.data.data.orderId} has been received.
            </p>
          </div>,
          { duration: 5000, style: { padding: '16px' } }
        );
        setFormData(INITIAL_FORM);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      const message = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render current step ─────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection formData={formData} setFormData={setFormData} />;
      case 2:
        return <UploadDocuments formData={formData} setFormData={setFormData} />;
      case 3:
        return <Specifications formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <ReviewConfirm
            formData={formData}
            estimatedPrice={estimatedPrice}
            priceBreakdown={priceBreakdown}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Place Your Order
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Complete the steps below to place a new print order
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FiChevronLeft />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
              <FiChevronRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                isSubmitting
                  ? 'bg-green-400 cursor-wait text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 hover:shadow-green-600/40'
              }`}
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
                  Placing Order...
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  Place Order — ₹{estimatedPrice.toFixed(2)}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
