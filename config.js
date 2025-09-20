// Firebase Configuration - REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:your-app-id-here"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Portal Configuration
const DLM_CONFIG = {
    // Default DocuSign Links (will be used if no custom links are set via admin)
    docuSign: {
        serviceAgreement: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=a78e28e4-f9a0-4e5a-8795-d31c45721130&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2",
        dpa: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=143e9c27-bc1d-4f0e-aab5-65a344a4f3e3&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2"
    },
    
    // Default Invoice Link (will be used if no custom link is set via admin)
    invoiceLink: "https://stripe-first-invoice-payment-link",
    
    // Default Google Drive Link (will be used if no custom link is set via admin)
    googleDrive: {
        defaultUploadLink: "https://drive.google.com/drive/folders/1jds7K6SdV6G_SwTyZZjxqjuftqIHiaPY?usp=sharing"
    },
    
    // Support Contact Information
    support: {
        opsEmail: "Nicolas@driveleadmedia.com",
        opsPhone: "(678) 650-6411"
    },
    
    // Admin Panel Settings
    admin: {
        password: "dlm2024" // Change this to your preferred admin password
    },
    
    // Portal Settings
    portal: {
        baseUrl: "https://your-portal-domain.com" // Change to your actual domain
    }
};
