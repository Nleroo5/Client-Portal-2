// =====================================================
// FIREBASE CONFIGURATION - UPDATE WITH YOUR ACTUAL SETTINGS
// =====================================================
const firebaseConfig = {
    apiKey: "AIzaSyBb5ZBhQtAh-qMeX-La39-Nuf2mWmCtidg",
    authDomain: "client-portal-2-1d21e.firebaseapp.com",
    projectId: "client-portal-2-1d21e",
    storageBucket: "client-portal-2-1d21e.firebasestorage.app",
    messagingSenderId: "626281176830",
    appId: "1:626281176830:web:7f3026cd2f985bc6190faf"
};

// Initialize Firebase (only if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// =====================================================
// PORTAL CONFIGURATION - UPDATE THESE VALUES
// =====================================================
const DLM_CONFIG = {
    // Portal Settings - UPDATE THIS TO YOUR ACTUAL DOMAIN
    portal: {
        baseUrl: "https://portal2.driveleadmedia.com"
    },
    
    // Default DocuSign Links - UPDATE WITH YOUR ACTUAL POWERFORM URLS
    docuSign: {
        serviceAgreement: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=a78e28e4-f9a0-4e5a-8795-d31c45721130&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2",
        dpa: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=143e9c27-bc1d-4f0e-aab5-65a344a4f3e3&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2"
    },
    
    // Default Invoice Link - UPDATE WITH YOUR ACTUAL STRIPE PAYMENT LINK
    invoiceLink: "https://buy.stripe.com/your-default-payment-link",
    
    // Default Google Drive Link
    googleDrive: {
        defaultUploadLink: "https://drive.google.com/drive/folders/1jds7K6SdV6G_SwTyZZjxqjuftqIHiaPY?usp=sharing"
    },
    
    // Support Contact Information
    support: {
        opsEmail: "Nicolas@driveleadmedia.com",
        opsPhone: "(678) 650-6411"
    }
};

// =====================================================
// BEFORE DEPLOYMENT - UPDATE THESE CRITICAL VALUES:
// =====================================================
/*
1. FIREBASE CONFIG (lines 3-10):
   - Replace with your actual Firebase project settings
   - Get from Firebase Console > Project Settings > Web App

2. PORTAL URL (line 18):
   - Replace "https://portal2.driveleadmedia.com" with your actual domain
   - This is used in admin dashboard to generate portal links

3. DOCUSIGN LINKS (lines 21-24):
   - Replace with your actual DocuSign PowerForm URLs
   - Get from DocuSign admin panel

4. STRIPE PAYMENT LINK (line 27):
   - Replace with your actual Stripe payment link
   - Get from Stripe dashboard

5. CONTACT INFO (lines 34-37):
   - Update email and phone to your actual contact information
*/
