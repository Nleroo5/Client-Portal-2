// Firebase Configuration for Portal 2 - FINAL FIX
const firebaseConfig = {
    apiKey: "AIzaSyBb5ZBhQtAh-qMeX-La39-Nuf2mWmCtidg",
    authDomain: "client-portal-2-1d21e.firebaseapp.com",
    projectId: "client-portal-2-1d21e",
    storageBucket: "client-portal-2-1d21e.firebasestorage.app",
    messagingSenderId: "626281176830",
    appId: "1:626281176830:web:7f3026cd2f985bc6190faf"
};

// Initialize Firebase with better error handling - CRITICAL FIX
let db;
try {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK not loaded');
    }
    
    // Initialize Firebase app
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Portal 2 - Firebase initialized successfully');
    } else {
        firebase.app(); // Use existing app
        console.log('✅ Portal 2 - Using existing Firebase app');
    }
    
    // Initialize Firestore with settings
    db = firebase.firestore();
    
    // Configure Firestore settings for better performance
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    
    console.log('✅ Portal 2 - Firestore connected successfully');
    
} catch (error) {
    console.error('❌ Portal 2 - Firebase initialization error:', error);
    
    // Fallback error message for users
    setTimeout(() => {
        if (typeof showAlert === 'function') {
            showAlert('❌ Database connection failed. Please refresh the page.', 'error');
        }
    }, 1000);
}

// Portal Configuration - VERIFIED WORKING
const DLM_CONFIG = {
    // Portal Settings
    portal: {
        baseUrl: "https://portal2.driveleadmedia.com"
    },
    
    // DocuSign Links (Portal 2 specific)
    docuSign: {
        dpa: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=143e9c27-bc1d-4f0e-aab5-65a344a4f3e3&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2",
        serviceAgreement: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=a78e28e4-f9a0-4e5a-8795-d31c45721130&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2"
    },
    
    // Default Invoice Link (Portal 2 specific)
    invoiceLink: "https://buy.stripe.com/your-portal2-payment-link",
    
    // Google Drive
    googleDrive: {
        defaultUploadLink: "https://drive.google.com/drive/folders/1jds7K6SdV6G_SwTyZZjxqjuftqIHiaPY?usp=sharing"
    },
    
    // Support Contact Information
    support: {
        opsEmail: "Nicolas@driveleadmedia.com",
        opsPhone: "(678) 650-6411"
    }
};

// Export for global access
window.DLM_CONFIG = DLM_CONFIG;
window.db = db;
