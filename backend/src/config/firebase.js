import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isFirebaseAdminInitialized = false;

// Try to load from service account file
const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
let serviceAccount = null;

if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log("Loaded Firebase service account credentials from file.");
  } catch (error) {
    console.error("Failed to read firebase-service-account.json:", error);
  }
}

const projectId = serviceAccount?.project_id || process.env.FIREBASE_PROJECT_ID;
const clientEmail = serviceAccount?.client_email || process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = serviceAccount?.private_key || process.env.FIREBASE_PRIVATE_KEY;

if (projectId && clientEmail && privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n')
      })
    });
    isFirebaseAdminInitialized = true;
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
} else {
  console.warn("Firebase environment variables not set and service account file not found. Running in developer/fallback mode.");
}
// Initialize Firestore
let db = null;
if (isFirebaseAdminInitialized) {
  db = admin.firestore();
  console.log("Firestore initialized successfully.");
}

export { admin, isFirebaseAdminInitialized, db };
export default admin;
