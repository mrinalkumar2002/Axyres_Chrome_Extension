import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { v4 as uuid } from "uuid";

const GENERATED_FOLDER = path.resolve("generated");

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
 * Convert Resume JSON to HTML
 */
function buildHTML(resume) {

    const skills = (resume.technicalSkills || [])
        .map(skill => `<li>${escapeHTML(skill)}</li>`)
        .join("");

    const experience = (resume.workExperience || [])
        .map(job => `
            <div class="item">
                <h3>${escapeHTML(job.position || "")}</h3>
                <strong>${escapeHTML(job.company || "")}</strong>

                <ul>
                    ${(job.responsibilities || [])
                        .map(r => `<li>${escapeHTML(r)}</li>`)
                        .join("")}
                </ul>
            </div>
        `)
        .join("");

    const projects = (resume.projects || [])
        .map(project => `
            <div class="item">
                <h3>${escapeHTML(project.title || "")}</h3>

                <p>${escapeHTML(project.description || "")}</p>
            </div>
        `)
        .join("");

    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body{

font-family:Arial,sans-serif;

padding:40px;

color:#222;

line-height:1.5;

}

h1{

margin-bottom:5px;

}

h2{

border-bottom:1px solid #ccc;

padding-bottom:4px;

margin-top:30px;

}

ul{

padding-left:20px;

}

.item{

margin-bottom:20px;

}

</style>

</head>

<body>

<h1>${escapeHTML(resume.personalInfo?.name || "")}</h1>

<p>

${escapeHTML(resume.personalInfo?.email || "")}

<br>

${escapeHTML(resume.personalInfo?.phone || "")}

</p>

<h2>Professional Summary</h2>

<p>

${escapeHTML(resume.summary || "")}

</p>

<h2>Technical Skills</h2>

<ul>

${skills}

</ul>

<h2>Work Experience</h2>

${experience}

<h2>Projects</h2>

${projects}

</body>

</html>
`;
}

/**
 * Generate PDF
 */
export async function generateResumePDF(resume) {

    await fs.mkdir(GENERATED_FOLDER, {
        recursive: true
    });

    const filename = `${uuid()}.pdf`;

    const filePath = path.join(
        GENERATED_FOLDER,
        filename
    );

    const browser = await puppeteer.launch({

        headless: true,

        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]

    });

    try {

        const page = await browser.newPage();

        await page.setContent(buildHTML(resume), {

            waitUntil: "networkidle0"

        });

        await page.pdf({

            path: filePath,

            format: "A4",

            printBackground: true,

            margin: {

                top: "20px",

                bottom: "20px",

                left: "20px",

                right: "20px"

            }

        });

    } finally {

        await browser.close();

    }

    return {

        filename,

        filePath,

        downloadUrl: `/generated/${filename}`

    };

}