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
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Helper to wrap a promise with a timeout.
 * Prevents Firestore/Storage operations from hanging indefinitely
 * when database/storage is not enabled, or network is blocked.
 */
const runWithTimeout = (promise, ms, operationName) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timed out after ${ms / 1000}s. This usually happens if Firebase is not fully configured, the database/storage is not created/enabled, or the network is blocked.`)), ms)
    )
  ]);
};

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
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `orders/${orderId}/${file.name}`);
    
    try {
      // 45-second timeout for uploading each file
      await runWithTimeout(
        uploadBytes(storageRef, file),
        45000,
        `Uploading file "${file.name}"`
      );
      
      // 15-second timeout for retrieving the file URL
      const downloadURL = await runWithTimeout(
        getDownloadURL(storageRef),
        15000,
        `Getting download URL for "${file.name}"`
      );
      
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: downloadURL
      };
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      
      // Provide actionable feedback based on common Firebase Storage errors
      let friendlyMessage = error.message;
      if (error.code === 'storage/unauthorized') {
        friendlyMessage = `Permission denied uploading "${file.name}". Please ensure your Firebase Storage rules allow authenticated uploads.`;
      } else if (error.code === 'storage/quota-exceeded') {
        friendlyMessage = `Firebase Storage quota exceeded. Please check your Firebase plan.`;
      } else if (error.code === 'storage/project-not-found') {
        friendlyMessage = `Firebase project not found. Verify your storage config.`;
      } else if (error.message && error.message.includes('timed out')) {
        friendlyMessage = error.message;
      } else {
        friendlyMessage = `Failed to upload "${file.name}". Ensure Firebase Storage is enabled (click "Get Started") in your Firebase Console and Storage Security Rules allow authenticated writes. (Detail: ${error.message || error})`;
      }
      
      throw new Error(friendlyMessage);
    }
  });

  return Promise.all(uploadPromises);
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
    // Don't silently fail; bubble the error so the user knows file upload failed.
    throw new Error(`File upload failed: ${error.message}`);
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

  try {
    // 15-second timeout for writing metadata to Firestore
    await runWithTimeout(
      addDoc(collection(db, 'orders'), orderData),
      15000,
      'Saving order to Firestore'
    );
  } catch (error) {
    console.error('Firestore order creation error:', error);
    
    // Provide actionable feedback based on common Firestore errors
    let friendlyMessage = error.message;
    if (error.code === 'permission-denied') {
      friendlyMessage = 'Database permission denied. Please verify that your Firestore Security Rules allow authenticated writes, and that Cloud Firestore is enabled (click "Create Database") in the Firebase Console.';
    } else if (error.code === 'unavailable') {
      friendlyMessage = 'Database service is temporarily unavailable. Check your network or if Cloud Firestore is enabled in the Firebase Console.';
    } else if (error.message && error.message.includes('timed out')) {
      friendlyMessage = error.message;
    } else {
      friendlyMessage = `Failed to create order in database. Ensure Cloud Firestore is enabled (click "Create Database") in your Firebase Console and rules allow writes. (Detail: ${error.message || error})`;
    }
    
    throw new Error(friendlyMessage);
  }

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
  
  try {
    const snapshot = await runWithTimeout(
      getDocs(q),
      15000,
      `Fetching order ${orderId}`
    );

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error(`Failed to load order: ${error.message}`);
  }
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

  try {
    const snapshot = await runWithTimeout(
      getDocs(q),
      15000,
      'Fetching user orders'
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error(`Failed to load your orders: ${error.message}`);
  }
};
