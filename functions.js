(function() {
    // Portal State
    let portalState = {
        "1": false,
        "2": false,
        "3": false,
        "4": false,
        "5": false,
        "creativeLink": null,
        "googleDriveLink": null,
        "invoiceLink": null,
        "docuSignLinks": {
            "serviceAgreement": null,
            "dpa": null
        }
    };

    // Load state from Firebase - THIS IS THE CRITICAL FIREBASE FUNCTION
    async function loadState() {
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('c');
        
        if (!clientId) {
            // Use localStorage for local admin testing
            loadStateFromLocalStorage();
            return;
        }
        
        try {
            const doc = await db.collection('clients').doc(clientId).get();
            
            if (!doc.exists) {
                console.warn('Client not found, using localStorage');
                loadStateFromLocalStorage();
                return;
            }
            
            const data = doc.data();
            
            if (!data.active) {
                document.body.innerHTML = '<div style="text-align:center; padding:50px; color:#012E40; background: linear-gradient(135deg, #012E40 0%, #05908C 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;"><div style="background: #EEF4D9; padding: 40px; border-radius: 15px; max-width: 500px;"><h1 style="font-family: Young Serif, serif; margin-bottom: 20px;">Portal Inactive</h1><p style="font-size: 1.1rem;">This portal is currently inactive. Please contact Drive Lead Media.</p><p style="margin-top: 20px; color: #05908C;">Contact: Nicolas@driveleadmedia.com</p></div></div>';
                return;
            }
            
            // Load client name if available
            if (data.clientName) {
                const hero = document.querySelector('.hero h1');
                if (hero) {
                    hero.textContent = `Welcome, ${data.clientName}!`;
                }
            }
            
            // Load progress from Firebase
            portalState['1'] = data.step1Complete || false;
            portalState['2'] = data.step2Complete || false;
            portalState['3'] = data.step3Complete || false;
            portalState['4'] = data.step4Complete || false;
            portalState['5'] = data.step5Complete || false;
            
            // Load custom DocuSign links
            if (data.dpaLink) {
                portalState.docuSignLinks.dpa = data.dpaLink;
            }
            
            if (data.serviceAgreementLink) {
                portalState.docuSignLinks.serviceAgreement = data.serviceAgreementLink;
            }
            
            // Load invoice link
            if (data.invoiceLink) {
                portalState.invoiceLink = data.invoiceLink;
            }
            
            // Load Google Drive link
            if (data.googleDriveLink) {
                portalState.googleDriveLink = data.googleDriveLink;
            }
            
            // Load creative link
            if (data.creativeLink) {
                portalState.creativeLink = data.creativeLink;
            }
            
            // Store client ID for saving
            window.currentClientId = clientId;
            
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            loadStateFromLocalStorage();
        }
    }

    // Fallback to localStorage if Firebase fails or no client ID
    function loadStateFromLocalStorage() {
        const STORAGE_KEY = 'dlm_portal_v1';
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const savedState = JSON.parse(saved);
                portalState = { ...portalState, ...savedState };
            }
        } catch (e) {
            console.warn('Could not load state from localStorage:', e);
        }
    }

    // Save state to Firebase - THIS SAVES TO FIREBASE INSTEAD OF LOCALSTORAGE
    async function saveState() {
        if (window.currentClientId) {
            try {
                await db.collection('clients').doc(window.currentClientId).update({
                    step1Complete: portalState['1'],
                    step2Complete: portalState['2'],
                    step3Complete: portalState['3'],
                    step4Complete: portalState['4'],
                    step5Complete: portalState['5'],
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (error) {
                console.error('Error saving to Firebase:', error);
                saveStateToLocalStorage();
            }
        } else {
            // Fallback to localStorage if no client ID
            saveStateToLocalStorage();
        }
    }

    // Fallback save to localStorage
    function saveStateToLocalStorage() {
        const STORAGE_KEY = 'dlm_portal_v1';
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(portalState));
        } catch (e) {
            console.warn('Could not save state to localStorage:', e);
        }
    }

    // Update Progress Bar
    function updateProgressBar() {
        const completedSteps = Object.keys(portalState)
            .filter(key => !isNaN(key) && portalState[key]).length;
        const totalSteps = 5;
        const percentage = Math.round((completedSteps / totalSteps) * 100);
        
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        const percent = document.getElementById('progressPercent');
        
        if (fill) fill.style.width = percentage + '%';
        if (text) text.textContent = `${completedSteps} of ${totalSteps} steps completed`;
        if (percent) percent.textContent = percentage + '%';
        
        return { completedSteps, percentage };
    }

    // Update Floating Sidebar
    function updateFloatingSidebar() {
        const { completedSteps, percentage } = updateProgressBar();
        
        // Update circle
        const circle = document.getElementById('sidebarProgressCircle');
        if (circle) {
            const offset = 126 - (percentage / 100 * 126);
            circle.style.strokeDashoffset = offset;
        }
        
        // Update percentage text
        const percentText = document.getElementById('sidebarProgressPercent');
        if (percentText) percentText.textContent = percentage + '%';
        
        // Update dynamic message
        const msg = document.getElementById('sidebarProgressMessage');
        if (msg) {
            if (percentage === 0) msg.textContent = "Let's get started!";
            else if (percentage === 20) msg.textContent = "Great beginning!";
            else if (percentage === 40) msg.textContent = "Making progress";
            else if (percentage === 60) msg.textContent = "Over halfway!";
            else if (percentage === 80) msg.textContent = "Almost there!";
            else if (percentage === 100) msg.textContent = "All complete! 🎉";
        }
        
        // Update step bubbles
        for (let i = 1; i <= 5; i++) {
            const bubble = document.getElementById(`sidebarBubble${i}`);
            if (bubble) {
                bubble.className = 'sidebar-step-bubble upcoming';
                if (portalState[i.toString()]) {
                    bubble.className = 'sidebar-step-bubble completed';
                } else if (i === 1 || portalState[(i - 1).toString()]) {
                    if (!portalState[i.toString()]) {
                        bubble.className = 'sidebar-step-bubble current';
                    }
                }
            }
        }
    }

    // Update Step States
    function updateStepStates() {
        for (let i = 1; i <= 5; i++) {
            const step = document.getElementById(`step${i}`);
            if (step) {
                const isCompleted = portalState[i.toString()];
                const isUnlocked = i === 1 || portalState[(i - 1).toString()];
                
                step.classList.toggle('completed', isCompleted);
                step.classList.toggle('locked', !isUnlocked);
                
                const btn = step.querySelector('.btn-complete');
                if (btn) {
                    btn.textContent = isCompleted ? `✓ Step ${i} Completed` : `Mark Step ${i} Complete`;
                    if (isCompleted) btn.setAttribute('disabled', 'true');
                    else btn.removeAttribute('disabled');
                }
            }
        }
        updateFloatingSidebar();
    }

    // Mark Step Complete - SAVES TO FIREBASE
    function markStepComplete(stepNum) {
        portalState[stepNum.toString()] = true;
        saveState(); // This now saves to Firebase
        
        // Add completing animation to button
        const step = document.getElementById(`step${stepNum}`);
        const btn = step?.querySelector('.btn-complete');
        if (btn) {
            btn.classList.add('completing');
            setTimeout(() => btn.classList.remove('completing'), 600);
        }
        
        // Add green flash effect to step
        if (step) {
            step.style.transition = 'none';
            step.style.boxShadow = '0 0 0 rgba(34, 197, 94, 0)';
            setTimeout(() => {
                step.style.transition = 'all 0.8s ease';
                step.style.boxShadow = '0 0 50px rgba(34, 197, 94, 0.8)';
                setTimeout(() => {
                    updateStepStates();
                }, 200);
            }, 10);
        } else {
            updateStepStates();
        }
        
        // Check if all complete
        const allComplete = [1,2,3,4,5].every(n => portalState[n.toString()]);
        if (allComplete) {
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                setTimeout(() => {
                    successMsg.style.display = 'block';
                    successMsg.classList.add('celebrate');
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Trigger confetti animation
                    const confetti = document.getElementById('confetti');
                    if (confetti) {
                        // Restart confetti animation by removing and re-adding the container
                        const parent = confetti.parentNode;
                        const newConfetti = confetti.cloneNode(true);
                        parent.removeChild(confetti);
                        parent.appendChild(newConfetti);
                    }
                    
                    // Remove celebrate class after animation
                    setTimeout(() => {
                        successMsg.classList.remove('celebrate');
                    }, 600);
                }, 1000);
            }
        }
    }

    // Admin Functions
    function toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function adminLogin() {
        const password = document.getElementById('adminPassword').value;
        if (password === DLM_CONFIG.admin.password) {
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminControls').style.display = 'block';
            showAdminStatus('✓ Logged in successfully', 'success');
            loadAdminLinks();
        } else {
            showAdminStatus('✗ Invalid password', 'error');
        }
    }

    function showAdminStatus(message, type) {
        const status = document.getElementById('adminStatus');
        status.textContent = message;
        status.className = `admin-status ${type}`;
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
    }

    function setCreativeLink() {
        const link = document.getElementById('creativeLink').value.trim();
        if (!link) {
            showAdminStatus('✗ Please enter a link', 'error');
            return;
        }
        portalState.creativeLink = link;
        saveState();
        updateCreativeGallery(link);
        showAdminStatus('✓ Creative link set', 'success');
    }

    function removeCreativeLink() {
        portalState.creativeLink = null;
        saveState();
        updateCreativeGallery(null);
        document.getElementById('creativeLink').value = '';
        showAdminStatus('✓ Creative link removed', 'success');
    }

    function loadAdminLinks() {
        // Load creative link
        if (portalState.creativeLink) {
            document.getElementById('creativeLink').value = portalState.creativeLink;
        }
        
        // Load Google Drive link
        if (portalState.googleDriveLink) {
            document.getElementById('googleDriveLink').value = portalState.googleDriveLink;
        }
        
        // Load invoice link
        if (portalState.invoiceLink) {
            document.getElementById('invoiceLink').value = portalState.invoiceLink;
        }
        
        // Load DocuSign links
        if (portalState.docuSignLinks) {
            if (portalState.docuSignLinks.serviceAgreement) {
                document.getElementById('serviceAgreementLink').value = portalState.docuSignLinks.serviceAgreement;
            }
            if (portalState.docuSignLinks.dpa) {
                document.getElementById('dpaLink').value = portalState.docuSignLinks.dpa;
            }
        }
    }

    function setInvoiceLink() {
        const link = document.getElementById('invoiceLink').value.trim();
        
        if (!link) {
            showAdminStatus('✗ Please enter an invoice link', 'error');
            return;
        }
        
        try {
            new URL(link);
        } catch {
            showAdminStatus('✗ Please enter a valid URL', 'error');
            return;
        }
        
        portalState.invoiceLink = link;
        saveState();
        
        // Update invoice button
        const invoiceBtn = document.getElementById('invoiceBtn');
        if (invoiceBtn) invoiceBtn.href = link;
        
        showAdminStatus('✓ Invoice link updated', 'success');
    }

    function setDocuSignLink(type) {
        const inputId = type + 'Link';
        const link = document.getElementById(inputId).value.trim();
        
        if (!link) {
            showAdminStatus(`✗ Please enter a ${type.toUpperCase()} link`, 'error');
            return;
        }
        
        try {
            new URL(link);
        } catch {
            showAdminStatus('✗ Please enter a valid URL', 'error');
            return;
        }
        
        // Initialize docuSignLinks if it doesn't exist
        if (!portalState.docuSignLinks) {
            portalState.docuSignLinks = {};
        }
        
        portalState.docuSignLinks[type] = link;
        saveState();
        
        // Update the button immediately
        const btn = document.getElementById(type + 'Btn');
        if (btn) btn.href = link;
        
        showAdminStatus(`✓ ${type === 'serviceAgreement' ? 'Service Agreement' : type.toUpperCase()} link updated`, 'success');
    }

    function setGoogleDriveLink() {
        const link = document.getElementById('googleDriveLink').value.trim();
        
        if (!link) {
            showAdminStatus('✗ Please enter a Google Drive link', 'error');
            return;
        }
        
        try {
            new URL(link);
        } catch {
            showAdminStatus('✗ Please enter a valid URL', 'error');
            return;
        }
        
        portalState.googleDriveLink = link;
        saveState();
        
        // Update upload button
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) uploadBtn.href = link;
        
        showAdminStatus('✓ Google Drive link updated', 'success');
    }

    function removeDocuSignLink(type) {
        // Initialize docuSignLinks if it doesn't exist
        if (!portalState.docuSignLinks) {
            portalState.docuSignLinks = {};
        }
        
        portalState.docuSignLinks[type] = null;
        saveState();
        
        // Reset the button to default
        const btn = document.getElementById(type + 'Btn');
        if (btn) btn.href = DLM_CONFIG.docuSign[type] || '#';
        
        // Clear the input field
        document.getElementById(type + 'Link').value = '';
        
        showAdminStatus(`✓ ${type === 'serviceAgreement' ? 'Service Agreement' : type.toUpperCase()} link removed`, 'success');
    }

    function removeInvoiceLink() {
        portalState.invoiceLink = null;
        saveState();
        
        // Reset to default
        const invoiceBtn = document.getElementById('invoiceBtn');
        if (invoiceBtn) invoiceBtn.href = DLM_CONFIG.invoiceLink;
        
        document.getElementById('invoiceLink').value = '';
        showAdminStatus('✓ Invoice link removed', 'success');
    }

    function removeGoogleDriveLink() {
        portalState.googleDriveLink = null;
        saveState();
        
        // Reset to default
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) uploadBtn.href = DLM_CONFIG.googleDrive.defaultUploadLink;
        
        document.getElementById('googleDriveLink').value = '';
        showAdminStatus('✓ Google Drive link removed', 'success');
    }

    function updateCreativeGallery(link) {
        const gallery = document.getElementById('galleryPlaceholder');
        if (link) {
            gallery.innerHTML = `
                <p style="color: #012E40; margin-bottom: 15px; font-weight: 600;">
                    🎨 Your Creative Previews Are Ready!
                </p>
                <a href="${link}" class="btn" target="_blank" rel="noopener">
                    View Creative Previews
                </a>
            `;
        } else {
            gallery.innerHTML = `
                <p>Creative previews will be shared via secure link</p>
                <p style="font-size: 0.9rem; color: #85C7B3; margin-top: 10px;">
                    Links will be provided once creatives are ready for review
                </p>
            `;
        }
    }

    function resetProgress() {
        if (confirm('Are you sure you want to reset all progress?')) {
            if (window.currentClientId) {
                // Reset Firebase data
                db.collection('clients').doc(window.currentClientId).update({
                    step1Complete: false,
                    step2Complete: false,
                    step3Complete: false,
                    step4Complete: false,
                    step5Complete: false,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    location.reload();
                }).catch(() => {
                    localStorage.removeItem('dlm_portal_v1');
                    location.reload();
                });
            } else {
                localStorage.removeItem('dlm_portal_v1');
                location.reload();
            }
        }
    }

    // Step 3 Functions
    function toggleBrandKitInfo() {
        const infoBox = document.getElementById('brandKitInfo');
        const isVisible = infoBox.style.display === 'block';
        infoBox.style.display = isVisible ? 'none' : 'block';
    }

    // Step 4 Functions
    function toggleGA4Info() {
        const infoBox = document.getElementById('ga4Info');
        const isVisible = infoBox.style.display === 'block';
        infoBox.style.display = isVisible ? 'none' : 'block';
    }

    function togglePixelInfo() {
        const infoBox = document.getElementById('pixelInfo');
        const isVisible = infoBox.style.display === 'block';
        infoBox.style.display = isVisible ? 'none' : 'block';
    }

    function emailAdminDetails() {
        const adminName = document.getElementById('adminName').value;
        const adminEmail = document.getElementById('adminEmail').value;
        const adminPhone = document.getElementById('adminPhone').value;
        const platform = document.getElementById('websitePlatform').value;
        const platformOther = document.getElementById('websitePlatformOther').value;
        
        if (!adminEmail) {
            alert('Please enter admin email address');
            return;
        }
        
        const platformText = platform === 'other' ? platformOther : platform;
        const subject = 'Website Admin Contact Details - Client Portal';
        const body = `Website Admin Contact Details:\n\n` +
            `Name: ${adminName || 'Not provided'}\n` +
            `Email: ${adminEmail}\n` +
            `Phone: ${adminPhone || 'Not provided'}\n` +
            `Platform: ${platformText || 'Not specified'}\n\n` +
            `Please contact them to coordinate tracking installation.`;
        
        window.open(`mailto:${DLM_CONFIG.support.opsEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    function emailAccessDetails() {
        const websiteUrl = document.getElementById('websiteUrl').value;
        const loginUrl = document.getElementById('loginUrl').value;
        const username = document.getElementById('tempUsername').value;
        const password = document.getElementById('tempPassword').value;
        const platform = document.getElementById('sitePlatform').value;
        const platformOther = document.getElementById('sitePlatformOther').value;
        
        if (!websiteUrl || !username || !password) {
            alert('Please fill in all required fields');
            return;
        }
        
        const platformText = platform === 'other' ? platformOther : platform;
        const subject = 'Temporary Website Access Details - Client Portal';
        const body = `Temporary Website Access Details:\n\n` +
            `Website URL: ${websiteUrl}\n` +
            `Login URL: ${loginUrl || 'Not provided'}\n` +
            `Username: ${username}\n` +
            `Password: ${password}\n` +
            `Platform: ${platformText || 'Not specified'}\n\n` +
            `Please install tracking and remove access when complete.`;
        
        window.open(`mailto:${DLM_CONFIG.support.opsEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    // Step 5 Functions
    function approveCreatives() {
        if (confirm('Approve creatives for launch?')) {
            markStepComplete(5);
            alert('Approved! Your campaign will launch within 24-48 hours.');
        }
    }

    function requestRevisions() {
        const form = document.getElementById('revisionForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    function submitRevisions() {
        const notes = document.getElementById('revisionNotes').value;
        if (!notes) {
            alert('Please enter revision notes');
            return;
        }
        const subject = 'Creative Revision Request';
        window.open(`mailto:${DLM_CONFIG.support.opsEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(notes)}`);
    }

    // Initialize on DOM ready - USES FIREBASE LOADING
    document.addEventListener('DOMContentLoaded', async function() {
        await loadState(); // This loads from Firebase or falls back to localStorage
        updateStepStates();
        
        // Set DocuSign links (use custom if available, otherwise use default)
        const serviceAgreementBtn = document.getElementById('serviceAgreementBtn');
        const dpaBtn = document.getElementById('dpaBtn');
        const invoiceBtn = document.getElementById('invoiceBtn');
        
        if (serviceAgreementBtn) {
            serviceAgreementBtn.href = (portalState.docuSignLinks?.serviceAgreement) || DLM_CONFIG.docuSign.serviceAgreement;
        }
        if (dpaBtn) {
            dpaBtn.href = (portalState.docuSignLinks?.dpa) || DLM_CONFIG.docuSign.dpa;
        }
        if (invoiceBtn) {
            invoiceBtn.href = portalState.invoiceLink || DLM_CONFIG.invoiceLink;
        }
        
        // Set contact info
        document.getElementById('contactEmail').textContent = DLM_CONFIG.support.opsEmail;
        document.getElementById('contactPhone').textContent = DLM_CONFIG.support.opsPhone;
        
        // Load creative gallery
        if (portalState.creativeLink) {
            updateCreativeGallery(portalState.creativeLink);
        }
        
        // Set Google Drive link if custom one exists
        if (portalState.googleDriveLink) {
            const uploadBtn = document.getElementById('uploadBtn');
            if (uploadBtn) uploadBtn.href = portalState.googleDriveLink;
        }
        
        // Step 4 website access event listeners
        document.querySelectorAll('input[name="websiteAccess"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.getElementById('connectAdminForm').style.display = 
                    this.value === 'connect' ? 'block' : 'none';
                document.getElementById('tempAccessForm').style.display = 
                    this.value === 'temporary' ? 'block' : 'none';
            });
        });
        
        // Platform selection handlers for Step 4
        ['websitePlatform', 'sitePlatform'].forEach(selectId => {
            const selectElement = document.getElementById(selectId);
            const otherInput = document.getElementById(selectId + 'Other');
            
            if (selectElement && otherInput) {
                selectElement.addEventListener('change', function() {
                    if (this.value === 'other') {
                        otherInput.style.display = 'block';
                        otherInput.required = true;
                    } else {
                        otherInput.style.display = 'none';
                        otherInput.required = false;
                        otherInput.value = '';
                    }
                });
            }
        });
        
        console.log('✓ Portal initialized successfully with Firebase support');
    });

    // Expose all functions globally
    window.markStepComplete = markStepComplete;
    window.toggleAdminPanel = toggleAdminPanel;
    window.adminLogin = adminLogin;
    window.setCreativeLink = setCreativeLink;
    window.removeCreativeLink = removeCreativeLink;
    window.setDocuSignLink = setDocuSignLink;
    window.removeDocuSignLink = removeDocuSignLink;
    window.setInvoiceLink = setInvoiceLink;
    window.removeInvoiceLink = removeInvoiceLink;
    window.setGoogleDriveLink = setGoogleDriveLink;
    window.removeGoogleDriveLink = removeGoogleDriveLink;
    window.resetProgress = resetProgress;
    window.toggleBrandKitInfo = toggleBrandKitInfo;
    window.toggleGA4Info = toggleGA4Info;
    window.togglePixelInfo = togglePixelInfo;
    window.emailAdminDetails = emailAdminDetails;
    window.emailAccessDetails = emailAccessDetails;
    window.approveCreatives = approveCreatives;
    window.requestRevisions = requestRevisions;
    window.submitRevisions = submitRevisions;
})();
