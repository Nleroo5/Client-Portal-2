# Drive Lead Media Portal - Complete Setup Guide

## 🎯 Quick File Reference

### **Need to change...** → **Edit this file:**

| What You Want to Change | File | Configuration |
|-------------------------|------|---------------|
| **Firebase settings** | `config.js` | Replace firebaseConfig object |
| **Email addresses** | `config.js` | DLM_CONFIG.support.opsEmail |
| **Phone numbers** | `config.js` | DLM_CONFIG.support.opsPhone |
| **Admin password** | `config.js` | DLM_CONFIG.admin.password |
| **DocuSign links** | `config.js` | DLM_CONFIG.docuSign |
| **Portal domain** | `config.js` | DLM_CONFIG.portal.baseUrl |
| **Step content/text** | `index.html` | Find the step section |
| **Button colors** | `styles.css` | Lines 400-500 |
| **Background colors** | `styles.css` | Lines 15-45 |

## 📂 Complete File Structure

```
portal/
├── index.html          # Main portal page with all steps
├── admin.html          # Enhanced admin dashboard with edit functionality
├── styles.css          # All styling, animations, and responsive design
├── config.js           # Firebase config and portal settings
├── functions.js        # All JavaScript functionality
└── README.md           # This setup guide
```

## 🚀 How to Upload to GitHub

### **Method 1: GitHub Web Interface**
1. Create a new repository on GitHub
2. Click **"Upload files"**
3. Drag all 6 files into the upload area
4. Commit with message: "Initial portal setup with Firebase"

### **Method 2: Git Commands**
```bash
git init
git add .
git commit -m "Initial portal setup with Firebase"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## 🔥 Firebase Setup Instructions

### **Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it something like "dlm-client-portal"
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### **Step 2: Get Firebase Configuration**
1. In your Firebase project, click **"Project Settings"** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **"Web app"** (</> icon)
4. Register app with a name like "DLM Portal"
5. Copy the `firebaseConfig` object

### **Step 3: Update config.js**
Replace the placeholder Firebase config in `config.js`:
```javascript
// REPLACE THIS SECTION in config.js
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:your-actual-app-id"
};
```

### **Step 4: Setup Firestore Database**
1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for now)
4. Select a location close to your users
5. Click **"Done"**

### **Step 5: Configure Firestore Security Rules**
In Firestore, go to **"Rules"** tab and update:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      allow read, write: if true; // Update this for production
    }
  }
}
```

## ⚙️ Portal Configuration

### **Update Portal Settings in config.js:**

```javascript
// Portal Configuration
const DLM_CONFIG = {
    // Update these DocuSign links with your actual PowerForm URLs
    docuSign: {
        serviceAgreement: "your-service-agreement-powerform-url",
        dpa: "your-dpa-powerform-url"
    },
    
    // Update this with your actual Stripe payment link
    invoiceLink: "your-stripe-payment-link",
    
    // Update contact information
    support: {
        opsEmail: "your-email@driveleadmedia.com",
        opsPhone: "(your) phone-number"
    },
    
    // Change admin password
    admin: {
        password: "your-secure-admin-password"
    },
    
    // Update with your actual domain
    portal: {
        baseUrl: "https://your-actual-domain.com"
    }
};
```

## 🌐 Domain Setup

### **Option 1: GitHub Pages (Free)**
1. In your GitHub repo, go to **Settings** → **Pages**
2. Select source: **Deploy from a branch**
3. Choose **main** branch
4. Your portal will be available at: `https://username.github.io/repo-name`

### **Option 2: Custom Domain**
1. Purchase domain from registrar (GoDaddy, Namecheap, etc.)
2. Point DNS to your hosting provider
3. Upload files to hosting provider
4. Update `DLM_CONFIG.portal.baseUrl` in config.js

## 👨‍💼 Admin Dashboard Usage

### **Accessing Admin Dashboard:**
- Navigate to: `https://your-domain.com/admin.html`
- The admin dashboard is completely separate from client portals
- No special URL parameters needed

### **Admin Features:**
- **Create Clients:** Add new client portals with custom settings
- **Edit Everything:** Modify any client's progress, links, and settings
- **Progress Control:** Mark steps complete/incomplete manually
- **Link Management:** Update DocuSign, Stripe, Google Drive, and creative links
- **Status Control:** Activate/deactivate client portals
- **Safe Deletion:** Delete clients with confirmation protection

### **Creating Client Portals:**
1. Open admin dashboard
2. Fill in client name (required) and email (optional)
3. Add custom links (optional - will use defaults if blank)
4. Click "Create Client Portal"
5. Copy the generated portal link
6. Send link to client: `https://your-domain.com?c=client_id_here`

## 🔧 Customization Guide

### **Changing Colors:**
Edit `styles.css` - main color variables:
- `#012E40` - Dark blue/navy
- `#05908C` - Teal
- `#F2A922` - Gold/yellow
- `#85C7B3` - Light green
- `#EEF4D9` - Light cream

### **Modifying Steps:**
Edit `index.html` - each step is in a div with id `step1`, `step2`, etc.

### **Updating Contact Info:**
Edit `config.js` - update `DLM_CONFIG.support` object

### **Adding Custom Links:**
Use the admin dashboard to set custom DocuSign, Stripe, and other links per client

## 🛡️ Security Considerations

### **For Production:**
1. **Update Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

2. **Change Admin Password:**
   - Update `DLM_CONFIG.admin.password` in config.js
   - Use a strong, unique password

3. **Environment Variables:**
   - Consider moving sensitive config to environment variables
   - Use server-side rendering for enhanced security

## 📊 How It Works

### **Client Experience:**
1. Client receives portal link: `https://your-domain.com?c=client_123`
2. Portal loads their specific data from Firebase
3. Progress is saved automatically to Firebase
4. Admin can track progress in real-time

### **Admin Experience:**
1. Admin creates client portals with custom settings
2. Each client gets unique ID and portal link
3. Admin can edit any aspect of any portal
4. Real-time progress tracking and management

### **Data Flow:**
- **Client Portal:** Uses client ID from URL to load/save data
- **Admin Dashboard:** Full access to create/edit/delete all clients
- **Firebase:** Stores all client data, progress, and custom settings

## 🎯 Quick Start Checklist

- [ ] Upload all 6 files to GitHub
- [ ] Create Firebase project
- [ ] Copy Firebase config to `config.js`
- [ ] Setup Firestore database
- [ ] Update contact info in `config.js`
- [ ] Change admin password in `config.js`
- [ ] Update portal domain in `config.js`
- [ ] Test admin dashboard functionality
- [ ] Create test client portal
- [ ] Test client portal functionality

## 🆘 Troubleshooting

### **Common Issues:**

**Firebase not connecting:**
- Check Firebase config is correct
- Ensure Firestore is enabled
- Verify security rules allow access

**Admin dashboard not working:**
- Check password in config.js
- Ensure Firebase config is loaded
- Check browser console for errors

**Client portal not loading:**
- Verify client ID exists in Firebase
- Check client is marked as "active"
- Ensure all file paths are correct

**Need help?** Check browser console (F12) for error messages.

---

## 🎉 You're Ready!

Your complete client portal system is now set up with:
- ✅ Full Firebase integration
- ✅ Enhanced admin dashboard with edit functionality  
- ✅ Real-time progress tracking
- ✅ Custom link management per client
- ✅ Responsive design and animations
- ✅ Complete client management system

Send portal links to clients and manage everything through the admin dashboard!
