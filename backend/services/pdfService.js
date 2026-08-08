import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";
import { buildTemplate1, buildTemplate2, buildTemplate3, buildTemplate4 } from "./pdfTemplates.js";

const GENERATED_FOLDER = path.resolve("generated");
const GLOBAL_CSS_PATH = path.join(path.resolve(), "services", "frontend_styles.css");

/**
 * Escape HTML special characters
 */
function escapeHTML(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Convert Resume JSON to HTML (compact single-page layout)
 */
function buildHTML(resume) {
    const templateId = resume.templateId ? Number(resume.templateId) : 1;
    let templateHTML = "";

    switch (templateId) {
        case 2:
            templateHTML = buildTemplate2(resume);
            break;
        case 3:
            templateHTML = buildTemplate3(resume);
            break;
        case 4:
            templateHTML = buildTemplate4(resume);
            break;
        case 1:
        default:
            templateHTML = buildTemplate1(resume);
            break;
    }

    let globalCSS = "";
    try {
        // If cwd is Axyres_Chrome_Extension/backend, this resolves properly
        // However, __dirname equivalent in ES modules is preferred if path issues arise.
        // Let's use simple path resolve as the backend runs from the backend folder.
        globalCSS = fsSync.readFileSync(path.resolve("services/frontend_styles.css"), "utf-8");
    } catch (e) {
        console.error("Could not load global CSS:", e);
    }

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
/* Basic resets and standard fonts missing from frontend CSS */
* { box-sizing: border-box; }
body { font-family: 'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif; background: #fff; margin: 0; padding: 0; }

${globalCSS}

/* Aggressive tight spacing for 1-page PDF fit */
@media print {
  .print-resume { width: 100% !important; padding: 15px !important; margin: 0 !important; }
  
  .template-classic, .template-professional, .template-timeline-container, .resume-scroll-wrapper {
    padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important;
  }
  
  /* Reduce Margins */
  .section, .classic-section, .timeline-section, .resume-body > aside, .resume-body > main {
    margin-bottom: 8px !important;
  }
  .experience-item, .project-item, .education-item, .cert-item, .timeline-item {
    margin-bottom: 6px !important;
    padding: 0 !important;
    page-break-inside: avoid;
  }
  
  /* Tighter headings */
  h1.name { font-size: 22px !important; margin-bottom: 2px !important; }
  p.title { font-size: 14px !important; margin-bottom: 4px !important; }
  .section-title { 
    font-size: 13px !important; 
    margin-top: 6px !important; 
    margin-bottom: 6px !important; 
    padding-bottom: 2px !important; 
  }
  
  /* Tighter text */
  p, li, .summary-text, .exp-description, .project-description, .item-description {
    margin-bottom: 2px !important;
    line-height: 1.3 !important;
    font-size: 11px !important;
  }
  
  /* Tighter grids / lists */
  .contact-info { margin-bottom: 8px !important; gap: 8px !important; }
  .contact-item { padding: 0 !important; font-size: 11px !important; }
  .skills-list, .certifications, .languages-list { gap: 6px !important; }
  .skill-category, .skill-items, .language-item { padding: 2px 4px !important; margin-bottom: 2px !important; font-size: 11px !important; }
  
  /* Timeline specific */
  .timeline-wrapper { gap: 8px !important; margin-left: 10px !important; border-left-width: 1px !important; }
  .timeline-item::before { width: 8px !important; height: 8px !important; left: -14px !important; }
}
</style>
</head>
<body>
<div class="print-resume">
${templateHTML}
</div>
</body>
</html>
`;
}
/**
 * Generate PDF
 */
export async function generateResumePDF(resume) {
    console.log("[PDF] Starting generation...");
    await fs.mkdir(GENERATED_FOLDER, { recursive: true });

    const filename = `${uuid()}.pdf`;
    const filePath = path.join(GENERATED_FOLDER, filename);

    let browser;
    try {
        console.log("[PDF] Launching browser...");
        browser = await puppeteer.launch({
            headless: "new",
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: [ "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage" ]
        });
        console.log("[PDF] Browser launched with explicit path.");
    } catch (launchError) {
        console.log("[PDF] Failed to launch explicit Chrome, trying default...");
        browser = await puppeteer.launch({
            headless: "new",
            args: [ "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage" ]
        });
        console.log("[PDF] Browser launched with default path.");
    }

    try {
        console.log("[PDF] Creating new page...");
        const page = await browser.newPage();
        
        console.log("[PDF] Setting content...");
        const html = buildHTML(resume);
        await page.setContent(html, {
            waitUntil: "domcontentloaded",
            timeout: 10000
        });

        console.log("[PDF] Printing to PDF...");
        await page.pdf({
            path: filePath,
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px"
            },
            timeout: 15000
        });
        console.log("[PDF] PDF saved to", filePath);
    } catch (err) {
        console.log("[PDF] Error during page operations:", err);
        throw err;
    } finally {
        console.log("[PDF] Closing browser...");
        if (browser) await browser.close();
        console.log("[PDF] Browser closed.");
    }

    return {
        filename,
        filePath,
        downloadUrl: `/generated/${filename}`
    };
}