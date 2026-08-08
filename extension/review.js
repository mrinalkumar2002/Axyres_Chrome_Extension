document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log("Review JS Loaded");


        const result =
            await chrome.storage.local.get(
                "tailoredResume"
            );


        const resume =
            result.tailoredResume;


        console.log(
            "RESUME USED FOR UI:",
            resume
        );


        const container =
            document.getElementById(
                "resumeContainer"
            );


        if (!resume) {

            container.innerHTML =
                "No resume found.";

            return;

        }


        container.innerHTML = `
        <div class="resume-preview">
            
            <h1>${resume.personalInfo?.name || (resume.personalInfo?.firstName ? (resume.personalInfo.firstName + " " + (resume.personalInfo.lastName || "")).trim() : "") || "YOUR NAME"}</h1>
            
            <div class="contact-info">
                ${resume.personalInfo?.email ? `<span>${resume.personalInfo.email}</span>` : ""}
                ${resume.personalInfo?.email && resume.personalInfo?.phone ? `<span class="separator">|</span>` : ""}
                ${resume.personalInfo?.phone ? `<span>${resume.personalInfo.phone}</span>` : ""}
                ${(resume.personalInfo?.email || resume.personalInfo?.phone) && resume.personalInfo?.location ? `<span class="separator">|</span>` : ""}
                ${resume.personalInfo?.location ? `<span>${resume.personalInfo.location}</span>` : ""}
                ${(resume.personalInfo?.email || resume.personalInfo?.phone || resume.personalInfo?.location) && resume.personalInfo?.linkedin ? `<span class="separator">|</span>` : ""}
                ${resume.personalInfo?.linkedin ? `<span><a href="${resume.personalInfo.linkedin}" target="_blank">LinkedIn</a></span>` : ""}
                ${(resume.personalInfo?.email || resume.personalInfo?.phone || resume.personalInfo?.location || resume.personalInfo?.linkedin) && resume.personalInfo?.github ? `<span class="separator">|</span>` : ""}
                ${resume.personalInfo?.github ? `<span><a href="${resume.personalInfo.github}" target="_blank">GitHub</a></span>` : ""}
            </div>

            <h2>Professional Summary</h2>
            <p>
            ${
                typeof resume.summary === "string" 
                ? resume.summary 
                : resume.summary?.description || resume.summary?.headline || "No summary available"
            }
            </p>

            <h2>Technical Skills</h2>
            <ul class="chips-container">
            ${
                (resume.technicalSkills || [])
                .map(skill => `<li class="chip">${skill}</li>`)
                .join("")
            }
            </ul>

            <h2>Work Experience</h2>
            ${
                (resume.workExperience || [])
                .map(exp => `
                <div class="experience">
                    <div class="job-header">
                        <h3>${exp.position || exp.role || ""}</h3>
                        <span class="duration">${exp.duration || ""}</span>
                    </div>
                    <div class="job-company">${exp.company || ""}</div>

                    ${(exp.responsibilities && exp.responsibilities.length > 0) ? `
                    <h4>Responsibilities</h4>
                    <ul>
                    ${
                        (Array.isArray(exp.responsibilities) ? exp.responsibilities : [exp.responsibilities])
                        .filter(Boolean)
                        .map(item => `<li>${item}</li>`)
                        .join("")
                    }
                    </ul>
                    ` : ""}

                    ${exp.achievements?.length ? `
                    <h4>Achievements</h4>
                    <ul>
                    ${
                        (Array.isArray(exp.achievements) ? exp.achievements : [exp.achievements])
                        .filter(Boolean)
                        .map(item => `<li>${item}</li>`)
                        .join("")
                    }
                    </ul>
                    ` : ""}

                    ${exp.technologies?.length ? `
                    <h4>Technologies</h4>
                    <ul class="chips-container">
                        ${(Array.isArray(exp.technologies) ? exp.technologies : [exp.technologies])
                            .map(tech => `<li class="chip">${tech}</li>`).join("")}
                    </ul>
                    ` : ""}
                </div>
                `)
                .join("")
            }

            <h2>Projects</h2>
            ${
                (resume.projects || [])
                .map(project => `
                <div class="project">
                    <div class="project-header">
                        <h3>${project.name || project.title || ""}</h3>
                    </div>
                    ${
                        Array.isArray(project.description)
                        ? `<ul>${project.description.map(desc => `<li>${desc}</li>`).join("")}</ul>`
                        : `<p>${project.description || ""}</p>`
                    }

                    ${project.technologies?.length ? `
                    <h4>Technologies</h4>
                    <ul class="chips-container">
                        ${(Array.isArray(project.technologies) ? project.technologies : [project.technologies])
                            .map(tech => `<li class="chip">${tech}</li>`).join("")}
                    </ul>
                    ` : ""}
                </div>
                `)
                .join("")
            }

            ${resume.education?.length ? `
            <h2>Education</h2>
            ${
                resume.education.map(edu => `
                <div class="education-item">
                    <div class="education-header">
                        <h3>${edu.degree || edu.qualification || ""}</h3>
                        <span class="duration">${edu.year || edu.duration || ""}</span>
                    </div>
                    <div class="job-company">${edu.institution || edu.school || ""}</div>
                </div>
                `).join("")
            }
            ` : ""}
        </div>
        `;

    }
);