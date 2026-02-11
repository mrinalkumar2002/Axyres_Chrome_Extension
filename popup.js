// DOM Elements
const jobInfo = document.getElementById('jobInfo');
const noJob = document.getElementById('noJob');
const actions = document.getElementById('actions');
const loading = document.getElementById('loading');
const success = document.getElementById('success');
const connectionStatus = document.getElementById('connectionStatus');

// Job Info Elements
const jobTitle = document.getElementById('jobTitle');
const company = document.getElementById('company');
const location = document.getElementById('location');

// Buttons
const turboMode = document.getElementById('turboMode');
const precisionMode = document.getElementById('precisionMode');
const downloadResume = document.getElementById('downloadResume');

// User Elements
const userEmail = document.getElementById('userEmail');
const resumeCount = document.getElementById('resumeCount');
const loginLink = document.getElementById('loginLink');

// Template Selection
const templateOptions = document.querySelectorAll('.template-option');
let selectedTemplate = 'ats';

// Export Buttons
const exportButtons = document.querySelectorAll('.export-btn');
let selectedExportFormat = 'pdf';

// Backend API URL
const API_BASE = 'https://axyres-landingpage.onrender.com';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Check connection
  await checkConnection();
  
  // Check if user is logged in
  await checkUserStatus();
  
  // Get current tab and check if it's a job page
  await checkCurrentTab();
  
  // Load analytics
  await loadAnalytics();
  
  // Setup event listeners
  setupEventListeners();
});

// Check Backend Connection
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    if (response.ok) {
      connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Connected</span>';
      connectionStatus.style.color = '#00d9c9';
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>Offline</span>';
    connectionStatus.style.color = '#ff6b6b';
  }
}

// Check User Login Status
async function checkUserStatus() {
  const user = await chrome.storage.local.get(['axyres_user']);
  
  if (user.axyres_user && user.axyres_user.email) {
    userEmail.textContent = user.axyres_user.email;
    loginLink.textContent = 'Logout';
    loginLink.href = '#';
    loginLink.onclick = logoutUser;
  } else {
    userEmail.textContent = 'Not logged in';
    loginLink.textContent = 'Sign in';
    loginLink.href = 'https://axyres.vercel.app/login';
    loginLink.target = '_blank';
  }
}

// Logout User
async function logoutUser(e) {
  e.preventDefault();
  await chrome.storage.local.remove(['axyres_user']);
  userEmail.textContent = 'Not logged in';
  loginLink.textContent = 'Sign in';
  loginLink.href = 'https://axyres.vercel.app/login';
}

// Check Current Tab for Job
async function checkCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (isJobSite(tab.url)) {
    // Send message to content script to scrape job
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeJob' });
      
      if (response && response.success) {
        displayJobInfo(response.data);
      } else {
        showNoJob();
      }
    } catch (error) {
      // Content script not loaded or failed
      console.log('Could not scrape job:', error);
      showNoJob();
    }
  } else {
    showNoJob();
  }
}

// Check if URL is a job site
function isJobSite(url) {
  const jobPatterns = [
    /linkedin\.com\/jobs/,
    /indeed\.com\/viewjob/,
    /indeed\.com\/job/,
    /\/careers\//,
    /\/jobs\//,
    /greenhouse\.io/,
    /lever\.co/
  ];
  
  return jobPatterns.some(pattern => pattern.test(url));
}

// Display Scraped Job Info
function displayJobInfo(jobData) {
  jobTitle.value = jobData.title || 'Software Engineer';
  company.value = jobData.company || 'Tech Company';
  location.value = jobData.location || 'Remote';
  
  jobInfo.style.display = 'block';
  noJob.style.display = 'none';
  actions.style.display = 'flex';
}

// Show No Job Detected
function showNoJob() {
  jobInfo.style.display = 'none';
  noJob.style.display = 'block';
  actions.style.display = 'none';
}

// Load User Analytics
async function loadAnalytics() {
  const analytics = await chrome.storage.local.get(['axyres_analytics']);
  
  if (analytics.axyres_analytics) {
    resumeCount.textContent = analytics.axyres_analytics.resumesGenerated || 0;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Template Selection
  templateOptions.forEach(option => {
    option.addEventListener('click', () => {
      templateOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      selectedTemplate = option.dataset.template;
    });
  });
  
  // Export Format Selection
  exportButtons.forEach(button => {
    button.addEventListener('click', () => {
      exportButtons.forEach(btn => btn.style.background = 'rgba(255, 255, 255, 0.05)');
      button.style.background = 'rgba(0, 217, 201, 0.1)';
      selectedExportFormat = button.dataset.format;
    });
  });
  
  // Turbo Mode
  turboMode.addEventListener('click', async () => {
    const user = await chrome.storage.local.get(['axyres_user']);
    
    if (!user.axyres_user) {
      alert('Please sign in to use Axyres');
      window.open('https://axyres.vercel.app/login', '_blank');
      return;
    }
    
    const jobData = {
      title: jobTitle.value,
      company: company.value,
      location: location.value,
      url: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url
    };
    
    startResumeGeneration(jobData);
  });
  
  // Precision Mode
  precisionMode.addEventListener('click', () => {
    alert('Precision Mode: Coming soon! This will include:\n- Conversational AI tweaks\n- ATS scoring\n- Keyword optimization\n- Tone adjustment');
  });
  
  // Download Resume
  downloadResume.addEventListener('click', () => {
    simulateResumeDownload();
  });
  
  // View Analytics
  document.getElementById('viewAnalytics').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://axyres.vercel.app/analytics' });
  });
  
  // Settings
  document.getElementById('settings').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://axyres.vercel.app/settings' });
  });
}

// Start Resume Generation
function startResumeGeneration(jobData) {
  actions.style.display = 'none';
  loading.style.display = 'block';
  
  // Simulate API call (replace with actual API)
  setTimeout(async () => {
    loading.style.display = 'none';
    success.style.display = 'block';
    
    // Update analytics
    const analytics = await chrome.storage.local.get(['axyres_analytics']);
    const currentCount = analytics.axyres_analytics?.resumesGenerated || 0;
    
    await chrome.storage.local.set({
      axyres_analytics: {
        resumesGenerated: currentCount + 1,
        lastGenerated: new Date().toISOString()
      }
    });
    
    resumeCount.textContent = currentCount + 1;
  }, 8000); // 8 seconds for Turbo Mode
}

// Simulate Resume Download
function simulateResumeDownload() {
  const filename = `Axyres_Resume_${jobTitle.value.replace(/\s+/g, '_')}_${Date.now()}.${selectedExportFormat}`;
  
  // Create download link
  const link = document.createElement('a');
  link.href = `data:text/${selectedExportFormat};charset=utf-8,${encodeURIComponent('Resume content would be here')}`;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show success message
  alert(`Resume downloaded as ${filename}`);
}