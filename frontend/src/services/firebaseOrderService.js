/**
 * Firebase Order Service
 * Handles order operations directly via Firestore & Storage
 * when no backend API server is available (e.g., GitHub Pages deployment).
 */
import { db, storage } from '../config/firebase';
import { auth } from '../config/firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Generate a short readable order ID like "ORD-A3F8K2"
 */
const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Upload files to Firebase Storage and return download URLs
 */
const uploadFilesToStorage = async (files, orderId) => {
  const uploadedFiles = [];

  for (const file of files) {
    const storageRef = ref(storage, `orders/${orderId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    uploadedFiles.push({
      name: file.name,
      size: file.size,
      type: file.type,
      url: downloadURL
    });
  }

  return uploadedFiles;
};

/**
 * Create an order in Firestore with file uploads to Storage
 */
export const createFirebaseOrder = async (formData, estimatedPrice, priceBreakdown) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be logged in to place an order');
  }

  const orderId = generateOrderId();

  // Upload files to Firebase Storage
  let uploadedFiles = [];
  try {
    uploadedFiles = await uploadFilesToStorage(formData.files, orderId);
  } catch (error) {
    console.error('File upload error:', error);
    // Continue without file URLs if storage fails
    uploadedFiles = formData.files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: null
    }));
  }

  // Create order document in Firestore
  const orderData = {
    orderId,
    userId: currentUser.uid,
    userEmail: currentUser.email,
    userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
    service: formData.service,
    paperSize: formData.paperSize,
    colorMode: formData.colorMode,
    copies: formData.copies,
    sided: formData.sided,
    bindingType: formData.bindingType,
    phone: formData.phone,
    notes: formData.notes,
    files: uploadedFiles,
    estimatedPrice,
    priceBreakdown,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await addDoc(collection(db, 'orders'), orderData);

  return {
    success: true,
    data: {
      orderId,
      ...orderData
    }
  };
};

/**
 * Get an order by orderId from Firestore
 */
export const getFirebaseOrder = async (orderId) => {
  const q = query(
    collection(db, 'orders'),
    where('orderId', '==', orderId.toUpperCase())
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

/**
 * Get all orders for the current user from Firestore
 */
export const getUserFirebaseOrders = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  const q = query(
    collection(db, 'orders'),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
