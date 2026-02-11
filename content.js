// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeJob') {
    const jobData = scrapeJobDetails();
    sendResponse({ success: true, data: jobData });
  }
  return true;
});

// Auto-detect job pages and inject UI
if (isJobPage()) {
  injectJobDetectedBadge();
}

// Check if current page is a job posting
function isJobPage() {
  const path = window.location.pathname;
  const jobIndicators = [
    '/jobs/view/',
    '/job/',
    '/careers/',
    '/viewjob',
    'greenhouse.io',
    'lever.co'
  ];
  
  return jobIndicators.some(indicator => 
    path.includes(indicator) || window.location.href.includes(indicator)
  );
}

// Inject job detected badge
function injectJobDetectedBadge() {
  const badge = document.createElement('div');
  badge.id = 'axyres-job-badge';
  badge.innerHTML = `
    <style>
      #axyres-job-badge {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d9c9 0%, #00b3a6 100%);
        color: #0a0a0f;
        padding: 12px 20px;
        border-radius: 25px;
        font-family: 'Segoe UI', sans-serif;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 217, 201, 0.3);
        animation: pulse 2s infinite;
      }
      #axyres-job-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 217, 201, 0.4);
      }
      @keyframes pulse {
        0% { box-shadow: 0 4px 15px rgba(0, 217, 201, 0.3); }
        50% { box-shadow: 0 4px 20px rgba(0, 217, 201, 0.5); }
        100% { box-shadow: 0 4px 15px rgba(0, 217, 201, 0.3); }
      }
      .axyres-icon {
        width: 20px;
        height: 20px;
        background: url(${chrome.runtime.getURL('icons/icon16.png')}) no-repeat center;
        background-size: contain;
      }
    </style>
    <div class="axyres-icon"></div>
    <span>Click Axyres icon to tailor resume</span>
  `;
  
  badge.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });
  
  document.body.appendChild(badge);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (badge.parentNode) {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(-10px)';
      setTimeout(() => badge.remove(), 300);
    }
  }, 10000);
}

// Scrape job details from various sites
function scrapeJobDetails() {
  const hostname = window.location.hostname;
  let jobData = {};
  
  if (hostname.includes('linkedin.com')) {
    jobData = scrapeLinkedIn();
  } else if (hostname.includes('indeed.com')) {
    jobData = scrapeIndeed();
  } else {
    jobData = scrapeGeneric();
  }
  
  return jobData;
}

// LinkedIn scraper
function scrapeLinkedIn() {
  let title = '';
  let company = '';
  let location = '';
  
  // Try multiple selectors for LinkedIn
  const titleSelectors = [
    '.job-details-jobs-unified-top-card__job-title',
    '.topcard__title',
    'h1.jobs-unified-top-card__job-title'
  ];
  
  const companySelectors = [
    '.job-details-jobs-unified-top-card__company-name a',
    '.topcard__org-name-link',
    '.jobs-unified-top-card__company-name a'
  ];
  
  const locationSelectors = [
    '.job-details-jobs-unified-top-card__primary-description-container div',
    '.topcard__flavor--bullet',
    '.jobs-unified-top-card__primary-description div'
  ];
  
  // Find title
  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      title = element.textContent.trim();
      break;
    }
  }
  
  // Find company
  for (const selector of companySelectors) {
    const element = document.querySelector(selector);
    if (element) {
      company = element.textContent.trim();
      break;
    }
  }
  
  // Find location
  for (const selector of locationSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent.trim();
      // Extract location from text (might include other info)
      if (text.includes('·')) {
        const parts = text.split('·');
        location = parts[parts.length - 1].trim();
      } else {
        location = text;
      }
      break;
    }
  }
  
  return { title, company, location };
}

// Indeed scraper
function scrapeIndeed() {
  let title = '';
  let company = '';
  let location = '';
  
  // Indeed job page selectors
  const titleElement = document.querySelector('.jobsearch-JobInfoHeader-title');
  if (titleElement) {
    title = titleElement.textContent.trim().replace(/\n/g, ' ');
  }
  
  const companyElement = document.querySelector('[data-company-name]');
  if (companyElement) {
    company = companyElement.textContent.trim();
  }
  
  const locationElement = document.querySelector('.jobsearch-JobInfoHeader-subtitle .jobsearch-DesktopStickyContainer-subtitle');
  if (locationElement) {
    location = locationElement.textContent.trim();
  }
  
  return { title, company, location };
}

// Generic scraper for other sites
function scrapeGeneric() {
  let title = '';
  let company = '';
  let location = '';
  
  // Try common selectors
  const possibleTitleSelectors = [
    'h1[class*="job"]',
    'h1[class*="title"]',
    '.job-title',
    '.job-header',
    '[class*="job-title"]',
    'h1'
  ];
  
  const possibleCompanySelectors = [
    '[class*="company"]',
    '.company-name',
    '[class*="employer"]',
    '.employer',
    'a[href*="company"]'
  ];
  
  const possibleLocationSelectors = [
    '[class*="location"]',
    '.job-location',
    '[class*="address"]',
    '.location'
  ];
  
  // Find title
  for (const selector of possibleTitleSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent.trim();
      if (text.length > 5 && text.length < 100 && !title) {
        title = text;
        break;
      }
    }
    if (title) break;
  }
  
  // Find company
  for (const selector of possibleCompanySelectors) {
    const element = document.querySelector(selector);
    if (element) {
      company = element.textContent.trim();
      break;
    }
  }
  
  // Find location
  for (const selector of possibleLocationSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      location = element.textContent.trim();
      break;
    }
  }
  
  // Fallback: Extract from meta tags
  if (!title) {
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) {
      title = metaTitle.getAttribute('content');
    }
  }
  
  return { title, company, location };
}