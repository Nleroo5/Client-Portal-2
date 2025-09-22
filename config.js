// Firebase Configuration - Portal 2
const firebaseConfig = {
    apiKey: "AIzaSyC6nhisBnue09mvJuFzBb7m6zcMtqBRZEQ",
    authDomain: "client-portal-2fa80.firebaseapp.com",
    projectId: "client-portal-2fa80",
    storageBucket: "client-portal-2fa80.firebasestorage.app",
    messagingSenderId: "417272730660",
    appId: "1:417272730660:web:9530a097347fbbf72f5771"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Portal Configuration - PORTAL 2 SIMPLE STRUCTURE
const DLM_CONFIG = {
    docuSign: {
        dpa: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=143e9c27-bc1d-4f0e-aab5-65a344a4f3e3&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2",
        serviceAgreement: "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=PORTAL2-SERVICE-AGREEMENT&env=na4&acct=ab9821cd-da5d-4091-8f74-e8602b87929d&v=2"
    },
    stripeLinks: {
        invoiceLink: "https://buy.stripe.com/portal2-invoice-payment-link"
    },
    googleDrive: {
        defaultUploadLink: "https://drive.google.com/drive/folders/1jds7K6SdV6G_SwTyZZjxqjuftqIHiaPY?usp=sharing"
    },
    support: {
        opsEmail: "Nicolas@driveleadmedia.com",
        opsPhone: "(678) 650-6411"
    }
};
