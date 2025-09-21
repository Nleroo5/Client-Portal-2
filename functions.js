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
        
        // Hide loading screen function
        const hideLoading = () => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        };
        
        if (!clientId) {
            document.body.innerHTML = '<div style="text-align:center; padding:50px; color:#012E40; background: linear-gradient(135deg, #012E40 0%, #05908C 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;"><div style="background: #EEF4D9; padding: 40px; border-radius: 15px; max-width: 500px;"><h1 style="font-family: Young Serif, serif; margin-bottom: 20px;">Invalid Access</h1><p style="font-size: 1.1rem;">Please use the link provided by Drive Lead Media.</p><p style="margin-top: 20px; color: #05908C;">Contact: Nicolas@driveleadmedia.com</p></div></div>';
            return;
        }
        
        try {
            const doc = await db.collection('clients').doc(clientId).get();
            
            if (!doc.exists) {
                document.body.innerHTML = '<div style="text-align:center; padding:50px; color:#012E40; background: linear-gradient(135deg, #012E40 0%, #05908C 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;"><div style="background: #EEF4D9; padding: 40px; border-radius: 15px; max-width: 500px;"><h1 style="font-family: Young Serif, serif; margin-bottom: 20px;">Portal Not Found</h1><p style="font-size: 1.1rem;">Please contact Drive Lead Media for assistance.</p><p style="margin-top: 20px; color: #05908C;">Contact: Nicolas@driveleadmedia.com</p></div></div>';
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
                const dpaBtn = document.getElementById('dpaBtn');
                if (dpaBtn) dpaBtn.href = data.dpaLink;
            }
            
            if (data.serviceAgreementLink) {
                portalState.docuSignLinks.serviceAgreement = data.serviceAgreementLink;
                const serviceBtn = document.getElementById('serviceAgreementBtn');
                if (serviceBtn) serviceBtn.href = data.serviceAgreementLink;
            }
            
            // Load invoice link
            if (data.invoiceLink) {
                portalState.invoiceLink = data.invoiceLink;
                const invoiceBtn = document.getElementById('invoiceBtn');
                if (invoiceBtn) invoiceBtn.href = data.invoiceLink;
            }
            
            // Load Google Drive link
            if (data.googleDriveLink) {
                portalState.googleDriveLink = data.googleDriveLink;
                const uploadBtn = document.getElementById('uploadBtn');
                if (uploadBtn) uploadBtn.href = data.googleDriveLink;
            }
            
            // Load creative link
            if (data.creativeLink) {
                portalState.creativeLink = data.creativeLink;
                updateCreativeGallery(data.creativeLink);
            }
            
            // Store client ID for saving
            window.currentClientId = clientId;
            
            // Hide loading screen after successful load
            hideLoading();
            
        } catch (error) {
            console.error('Error loading:', error);
            document.body.innerHTML = '<div style="text-align:center; padding:50px; color:#012E40; background: linear-gradient(135deg, #012E40 0%, #05908C 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;"><div style="background: #EEF4D9; padding: 40px; border-radius: 15px; max-width: 500px;"><h1 style="font-family: Young Serif, serif; margin-bottom: 20px;">Loading Error</h1><p style="font-size: 1.1rem;">Please refresh the page or contact support.</p><p style="margin-top: 20px; color: #05908C;">Contact: Nicolas@driveleadmedia.com</p></div></div>';
        }
    }

    // Save state to Firebase - THIS SAVES TO FIREBASE INSTEAD OF LOCALSTORAGE
    async function saveState() {
        if (!window.currentClientId) return;
        
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
            console.error('Error saving:', error);
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
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 1000);
            }
        }
    }

    // Submit Revisions
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
        await loadState(); // This loads from Firebase
        updateStepStates();
        
        // Set default DocuSign links if no custom links
        const serviceAgreementBtn = document.getElementById('serviceAgreementBtn');
        const dpaBtn = document.getElementById('dpaBtn');
        const invoiceBtn = document.getElementById('invoiceBtn');
        const uploadBtn = document.getElementById('uploadBtn');
        
        if (serviceAgreementBtn && !portalState.docuSignLinks?.serviceAgreement) {
            serviceAgreementBtn.href = DLM_CONFIG.docuSign.serviceAgreement;
        }
        if (dpaBtn && !portalState.docuSignLinks?.dpa) {
            dpaBtn.href = DLM_CONFIG.docuSign.dpa;
        }
        if (invoiceBtn && !portalState.invoiceLink) {
            invoiceBtn.href = DLM_CONFIG.stripeLinks.invoiceLink;
        }
        if (uploadBtn && !portalState.googleDriveLink) {
            uploadBtn.href = DLM_CONFIG.googleDrive.defaultUploadLink;
        }
        
        // Step 4 website access event listeners
        document.querySelectorAll('input[name="websiteAccess"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const connectForm = document.getElementById('connectAdminForm');
                const tempForm = document.getElementById('tempAccessForm');
                if (connectForm) connectForm.style.display = this.value === 'connect' ? 'block' : 'none';
                if (tempForm) tempForm.style.display = this.value === 'temporary' ? 'block' : 'none';
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
        
        console.log('✓ Portal 2 initialized successfully with Firebase');
    });
        
        // Step 4 website access event listeners
        document.querySelectorAll('input[name="websiteAccess"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const connectForm = document.getElementById('connectAdminForm');
                const tempForm = document.getElementById('tempAccessForm');
                if (connectForm) connectForm.style.display = this.value === 'connect' ? 'block' : 'none';
                if (tempForm) tempForm.style.display = this.value === 'temporary' ? 'block' : 'none';
            });
        });
    // Expose functions globally
    window.markStepComplete = markStepComplete;
    window.toggleBrandKitInfo = toggleBrandKitInfo;
    window.toggleGA4Info = toggleGA4Info;
    window.togglePixelInfo = togglePixelInfo;
    window.emailAdminDetails = emailAdminDetails;
    window.emailAccessDetails = emailAccessDetails;
    window.approveCreatives = approveCreatives;
    window.requestRevisions = requestRevisions;
    window.submitRevisions = submitRevisions;
})();
