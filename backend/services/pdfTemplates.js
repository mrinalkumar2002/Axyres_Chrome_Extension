export function buildTemplate1(data) {
  const hasSkills = (data.technicalSkills || data.skills || [])?.some(skill => skill && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && lang.trim());
  const hasExperience = (data.workExperience || data.experience || [])?.length > 0;
  const hasProjects = data.projects?.length > 0;
  const hasCertifications = data.certifications?.length > 0;
  const hasEducation = data.education?.length > 0;

  return `
    <div class="resume-scroll-wrapper">
      <div class="template-classic-container">
        
        <!-- HEADER SECTION -->
        <header class="classic-header">
          <h1 class="name">${(data.personalInfo?.firstName ? (data.personalInfo.firstName + " " + (data.personalInfo.lastName || "")).trim() : "") || data.personalInfo?.name || "YOUR NAME"}</h1>
          <p class="title">${data.personalInfo?.title || ""}</p>
          <div class="contact-info">
            ${data.personalInfo?.phone ? `<span class="contact-item">• ${data.personalInfo.phone}</span>` : ""}
            ${data.personalInfo?.email ? `<span class="contact-item">• ${data.personalInfo.email}</span>` : ""}
            ${data.personalInfo?.linkedin ? `<span class="contact-item">• ${data.personalInfo.linkedin}</span>` : ""}
            ${data.personalInfo?.location ? `<span class="contact-item">• ${data.personalInfo.location}</span>` : ""}
          </div>
        </header>

        <!-- SUMMARY SECTION -->
        ${(data.summary || data.personalInfo?.summary) ? `
          <section class="classic-section print-avoid-break">
            <h2 class="section-title">Summary</h2>
            <p class="summary-text">${data.summary || data.personalInfo.summary}</p>
          </section>
        ` : ""}

        <!-- EXPERIENCE SECTION -->
        ${hasExperience ? `
          <section class="classic-section">
            <h2 class="section-title">Experience</h2>
            ${(data.workExperience || data.experience || []).map(exp => `
              <div class="experience-item print-avoid-break">
                <div class="item-row-header">
                  <span class="company-name">${exp.company || "Company Name"}</span>
                  <span class="location-text">${exp.location || "Location"}</span>
                </div>
                <div class="item-row-subheader">
                  <span class="role-title">${exp.role || "Title"}</span>
                  <span class="date-text">
                    ${exp.startDate ? `${exp.startDate} - ${exp.endDate || "Present"}` : ""}
                  </span>
                </div>
                ${exp.description ? `<p class="item-description">• ${exp.description}</p>` : ""}
              </div>
            `).join("")}
          </section>
        ` : ""}

        <!-- SKILLS SECTION -->
        ${hasSkills ? `
          <section class="classic-section print-avoid-break">
            <h2 class="section-title">Skills</h2>
            <div class="skills-pill-box" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px;">
              ${(data.technicalSkills || data.skills || []).filter(skill => skill && skill.trim()).flatMap(skill => skill.split(',')).map(s => `
                <span class="skill-badge-tag" style="padding: 4px 10px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.85rem; background: #fff;">${s.trim()}</span>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- PROJECTS SECTION -->
        ${hasProjects ? `
          <section class="classic-section">
            <h2 class="section-title">Projects</h2>
            ${data.projects.map(project => `
              <div class="course-item print-avoid-break">
                <span class="course-title">${project.title || "Course Title"}</span>
                ${project.description ? `<span class="course-provider"> — ${project.description}</span>` : ""}
                ${project.technologies ? `<div class="course-tech-meta">Tech: ${project.technologies}</div>` : ""}
              </div>
            `).join("")}
          </section>
        ` : ""}

        <!-- EDUCATION SECTION -->
        ${hasEducation ? `
          <section class="classic-section">
            <h2 class="section-title">Education</h2>
            ${data.education.map(edu => `
              <div class="experience-item print-avoid-break">
                <div class="item-row-header">
                  <span class="company-name">${edu.school || "Institution Name"}</span>
                  <span class="location-text">${edu.location || "Location"}</span>
                </div>
                <div class="item-row-subheader">
                  <span class="role-title">${edu.degree || "Degree Title"}</span>
                  <span class="date-text">${edu.year || "Year"}</span>
                </div>
              </div>
            `).join("")}
          </section>
        ` : ""}

        <!-- CERTIFICATIONS SECTION -->
        ${hasCertifications ? `
          <section class="classic-section">
            <h2 class="section-title">Certifications</h2>
            <div class="skills-comma-list">
              ${data.certifications.map((cert, idx, arr) => `
                <span class="skill-text-item">
                  ${cert.name || "Certification"} 
                  ${cert.issuer ? `(${cert.issuer})` : ""}
                  ${idx < arr.length - 1 ? ', ' : ''}
                </span>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- LANGUAGES SECTION -->
        ${hasLanguages ? `
          <section class="classic-section print-avoid-break">
            <h2 class="section-title">Languages</h2>
            <div class="skills-pill-box" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px;">
              ${data.languages.filter(lang => lang && lang.trim()).map(lang => `
                <span class="skill-badge-tag" style="padding: 4px 10px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.85rem; background: #fff;">${lang.trim()}</span>
              `).join("")}
            </div>
          </section>
        ` : ""}
      </div>
    </div>
  `;
}

export function buildTemplate2(data) {
  const getFullName = () => (data.personalInfo?.firstName ? (data.personalInfo.firstName + " " + (data.personalInfo.lastName || "")).trim() : "") || data.personalInfo?.name || "John Doe";
  const hasSkills = (data.technicalSkills || data.skills || [])?.some(skill => skill && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && lang.trim());
  const hasExperience = (data.workExperience || data.experience || [])?.length > 0;
  const hasProjects = data.projects?.length > 0;
  const hasCertifications = data.certifications?.length > 0;
  const hasEducation = data.education?.length > 0;
  
  const contactInfo = [
    data.personalInfo?.email,
    data.personalInfo?.phone,
    data.personalInfo?.location,
    data.personalInfo?.linkedin
  ].filter(Boolean);

  return `
    <div class="template-classic">
      <header class="resume-header">
        <h1 class="name">${getFullName()}</h1>
        <p class="title">${data.personalInfo?.title || "Professional Title"}</p>
        
        ${contactInfo.length > 0 ? `
          <div class="contact-info">
            ${contactInfo.map(item => `
              <div class="contact-item">${item}</div>
            `).join("")}
          </div>
        ` : ""}
      </header>

      ${data.personalInfo?.summary ? `
        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary-text">${data.personalInfo.summary}</p>
        </section>
      ` : ""}

      ${hasExperience ? `
        <section class="section">
          <h2 class="section-title">Professional Experience</h2>
          ${(data.workExperience || data.experience || []).map(exp => `
            <div class="experience-item">
              <div class="exp-header">
                <span class="exp-role">${exp.role || "Position"}</span>
                ${exp.company ? `<span class="exp-company">${exp.company}</span>` : ""}
              </div>
              <div class="exp-details">
                ${exp.location ? `<span class="exp-location">${exp.location}</span>` : ""}
                ${(exp.startDate || exp.endDate) ? `
                  <span class="exp-dates">
                    ${exp.startDate ? `${exp.startDate} - ${exp.endDate || "Present"}` : ""}
                  </span>
                ` : ""}
              </div>
              ${exp.description ? `<p class="exp-description">${exp.description}</p>` : ""}
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${hasEducation ? `
        <section class="section">
          <h2 class="section-title">Education</h2>
          ${data.education.map(edu => `
            <div class="education-item">
              <div class="edu-degree">${edu.degree || "Degree"}</div>
              <div class="edu-school">${edu.school || "Institution"}</div>
              <div class="edu-details">
                ${edu.location ? `<span class="edu-location">${edu.location}</span>` : ""}
                ${edu.year ? `<span class="edu-year">${edu.year}</span>` : ""}
              </div>
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${hasSkills ? `
        <section class="section">
          <h2 class="section-title">Skills & Expertise</h2>
          <div class="skills-list">
            ${(data.technicalSkills || data.skills || []).filter(skill => skill && skill.trim()).map(skill => `
              <div class="skill-item">
                <div class="skill-items">${skill}</div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}

      ${hasProjects ? `
        <section class="section">
          <h2 class="section-title">Projects</h2>
          ${data.projects.map(project => `
            <div class="project-item">
              <div class="project-title">${project.title || "Project Title"}</div>
              ${project.description ? `<p class="project-description">${project.description}</p>` : ""}
              ${project.technologies ? `<div class="project-tech">${project.technologies}</div>` : ""}
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${hasCertifications ? `
        <section class="section">
          <h2 class="section-title">Certifications</h2>
          <div class="certifications">
            ${data.certifications.map(cert => `
              <div class="cert-item">
                <div class="cert-name">${cert.name || "Certification Name"}</div>
                <div class="cert-issuer">${cert.issuer || "Issuing Organization"}</div>
                ${cert.date ? `<div class="cert-date">${cert.date}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}

      ${hasLanguages ? `
        <section class="section">
          <h2 class="section-title">Languages</h2>
          <div class="languages-list">
            ${data.languages.filter(lang => lang && lang.trim()).map(lang => `
              <div class="language-item">
                <div class="language-name">${lang}</div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

export function buildTemplate3(data) {
  const hasSkills = (data.technicalSkills || data.skills || [])?.some(skill => skill && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && lang.trim());
  const hasExperience = (data.workExperience || data.experience || [])?.length > 0;
  const hasProjects = data.projects?.length > 0;
  const hasCertifications = data.certifications?.length > 0;
  const hasEducation = data.education?.length > 0;

  return `
    <div class="resume-scroll-wrapper">
      <div class="template-timeline-container">
        
        <!-- HEADER SECTION -->
        <header class="timeline-header">
          <h1 class="name">${(data.personalInfo?.firstName ? (data.personalInfo.firstName + " " + (data.personalInfo.lastName || "")).trim() : "") || data.personalInfo?.name || "YOUR NAME"}</h1>
          <p class="title">${data.personalInfo?.title || ""}</p>
          
          <div class="contact-info">
            ${data.personalInfo?.phone ? `<span class="contact-item">📞 ${data.personalInfo.phone}</span>` : ""}
            ${data.personalInfo?.email ? `<span class="contact-item">✉️ ${data.personalInfo.email}</span>` : ""}
            ${data.personalInfo?.linkedin ? `<span class="contact-item">🔗 ${data.personalInfo.linkedin}</span>` : ""}
            ${data.personalInfo?.location ? `<span class="contact-item">📍 ${data.personalInfo.location}</span>` : ""}
          </div>
        </header>

        <!-- SUMMARY SECTION -->
        ${data.personalInfo?.summary ? `
          <section class="timeline-section print-avoid-break">
            <h2 class="section-title">SUMMARY</h2>
            <p class="summary-text">${data.personalInfo.summary}</p>
          </section>
        ` : ""}

        <!-- EXPERIENCE SECTION -->
        ${hasExperience ? `
          <section class="timeline-section">
            <h2 class="section-title">EXPERIENCE</h2>
            <div class="timeline-wrapper">
              ${(data.workExperience || data.experience || []).map(exp => `
                <div class="timeline-item print-avoid-break">
                  <div class="timeline-left-meta">
                    <span class="date-period">
                      ${exp.startDate ? `${exp.startDate} - ${exp.endDate || "Present"}` : ""}
                    </span>
                    ${exp.location ? `<span class="location-text">${exp.location}</span>` : ""}
                  </div>
                  
                  <div class="timeline-content-block">
                    <h3 class="exp-role">${exp.role || "Title"}</h3>
                    <h4 class="exp-company">${exp.company || "Company Name"}</h4>
                    ${exp.description ? `<p class="item-description">• ${exp.description}</p>` : ""}
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- SKILLS SECTION -->
        ${hasSkills ? `
          <section class="timeline-section print-avoid-break">
            <h2 class="section-title">SKILLS</h2>
            <div class="skills-pill-box">
              ${(data.technicalSkills || data.skills || []).filter(skill => skill && skill.trim()).flatMap(skill => skill.split(',')).map(s => `
                <div class="skill-badge-tag">${s.trim()}</div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- PROJECTS SECTION -->
        ${hasProjects ? `
          <section class="timeline-section">
            <h2 class="section-title">PROJECTS</h2>
            <div class="courses-grid-layout">
              ${data.projects.map(project => `
                <div class="course-card-cell print-avoid-break">
                  <h3 class="course-main-title">${project.title || "Course Title"}</h3>
                  ${project.description ? `<p class="course-desc-text">${project.description}</p>` : ""}
                  ${project.technologies ? `<div class="course-tech-sub">Tech: ${project.technologies}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- EDUCATION SECTION -->
        ${hasEducation ? `
          <section class="timeline-section">
            <h2 class="section-title">EDUCATION</h2>
            <div class="timeline-wrapper">
              ${data.education.map(edu => `
                <div class="timeline-item print-avoid-break">
                  <div class="timeline-left-meta">
                    <span class="date-period">${edu.year || "Year"}</span>
                    ${edu.location ? `<span class="location-text">${edu.location}</span>` : ""}
                  </div>
                  <div class="timeline-content-block">
                    <h3 class="exp-role">${edu.degree || "Degree"}</h3>
                    <h4 class="exp-company">${edu.school || "Institution"}</h4>
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- CERTIFICATIONS SECTION -->
        ${hasCertifications ? `
          <section class="timeline-section print-avoid-break">
            <h2 class="section-title">CERTIFICATIONS</h2>
            <div class="courses-grid-layout">
              ${data.certifications.map(cert => `
                <div class="course-card-cell">
                  <h3 class="course-main-title">${cert.name || "Certification"}</h3>
                  <p class="course-desc-text">${cert.issuer || "Issuer"}</p>
                  ${cert.date ? `<div class="course-tech-sub">${cert.date}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}

        <!-- LANGUAGES SECTION -->
        ${hasLanguages ? `
          <section class="timeline-section print-avoid-break">
            <h2 class="section-title">LANGUAGES</h2>
            <div class="skills-pill-box">
              ${data.languages.filter(lang => lang && lang.trim()).map(lang => `
                <div class="skill-badge-tag">${lang}</div>
              `).join("")}
            </div>
          </section>
        ` : ""}
      </div>
    </div>
  `;
}

export function buildTemplate4(data) {
  const getFullName = () => (data.personalInfo?.firstName ? (data.personalInfo.firstName + " " + (data.personalInfo.lastName || "")).trim() : "") || data.personalInfo?.name || "John Doe";
  const hasSkills = (data.technicalSkills || data.skills || [])?.some(skill => skill && skill.trim());
  const hasLanguages = data.languages?.some(lang => lang && lang.trim());
  const hasExperience = (data.workExperience || data.experience || [])?.length > 0;
  const hasProjects = data.projects?.length > 0;
  const hasCertifications = data.certifications?.length > 0;
  const hasEducation = data.education?.length > 0;

  return `
    <div class="template-professional">
      <header class="resume-header">
        <div class="header-left">
          <h1 class="name">${getFullName()}</h1>
          <p class="title">${data.personalInfo?.title || "Professional Title"}</p>
        </div>
        
        <div class="header-right">
          <div class="contact-info">
            ${data.personalInfo?.email ? `
              <div class="contact-item">
                <span>${data.personalInfo.email}</span>
              </div>
            ` : ""}
            ${data.personalInfo?.phone ? `
              <div class="contact-item">
                <span>${data.personalInfo.phone}</span>
              </div>
            ` : ""}
            ${data.personalInfo?.location ? `
              <div class="contact-item">
                <span>${data.personalInfo.location}</span>
              </div>
            ` : ""}
          </div>
        </div>
      </header>

      <div class="resume-body">
        <aside class="sidebar">
          ${data.personalInfo?.summary ? `
            <section class="section">
              <h2 class="section-title">Summary</h2>
              <p class="summary-text">${data.personalInfo.summary}</p>
            </section>
          ` : ""}

          ${hasSkills ? `
            <section class="section">
              <h2 class="section-title">Skills</h2>
              <div class="skills-list">
                ${(data.technicalSkills || data.skills || []).filter(skill => skill && skill.trim()).map(skill => `
                  <div class="skill-category">
                    <div class="skill-items">${skill}</div>
                  </div>
                `).join("")}
              </div>
            </section>
          ` : ""}

          ${hasEducation ? `
            <section class="section">
              <h2 class="section-title">Education</h2>
              ${data.education.map(edu => `
                <div class="education-item">
                  <div class="edu-degree">${edu.degree || "Degree"}</div>
                  <div class="edu-school">${edu.school || "Institution"}</div>
                  <div class="edu-details">
                    ${edu.location ? `<div>${edu.location}</div>` : ""}
                    ${edu.year ? `<div>${edu.year}</div>` : ""}
                  </div>
                </div>
              `).join("")}
            </section>
          ` : ""}

          ${hasCertifications ? `
            <section class="section">
              <h2 class="section-title">Certifications</h2>
              ${data.certifications.map(cert => `
                <div class="cert-item">
                  <div class="cert-name">${cert.name || "Certification"}</div>
                  <div class="cert-details">
                    <span>${cert.issuer || "Issuer"}</span>
                    ${cert.date ? `<span>${cert.date}</span>` : ""}
                  </div>
                </div>
              `).join("")}
            </section>
          ` : ""}

          ${hasLanguages ? `
            <section class="section">
              <h2 class="section-title">Languages</h2>
              <div class="languages-list">
                ${data.languages.filter(lang => lang && lang.trim()).map(lang => `
                  <div class="language-item">
                    <span class="language-name">${lang}</span>
                  </div>
                `).join("")}
              </div>
            </section>
          ` : ""}
        </aside>

        <main class="main-content">
          ${hasExperience ? `
            <section class="section">
              <h2 class="section-title">Experience</h2>
              ${(data.workExperience || data.experience || []).map(exp => `
                <div class="experience-item">
                  <div class="exp-header">
                    <div class="exp-left">
                      <div class="exp-role">${exp.role || "Position"}</div>
                      <div class="exp-company">${exp.company || "Company"}</div>
                      ${exp.location ? `<div class="exp-location">${exp.location}</div>` : ""}
                    </div>
                    ${(exp.startDate || exp.endDate) ? `
                      <div class="exp-dates">
                        ${exp.startDate ? `${exp.startDate} - ${exp.endDate || "Present"}` : ""}
                      </div>
                    ` : ""}
                  </div>
                  ${exp.description ? `<p class="exp-description">${exp.description}</p>` : ""}
                </div>
              `).join("")}
            </section>
          ` : ""}

          ${hasProjects ? `
            <section class="section">
              <h2 class="section-title">Projects</h2>
              ${data.projects.map(project => `
                <div class="project-item">
                  <div class="project-header">
                    <div class="project-title">${project.title || "Project Title"}</div>
                    ${(project.startDate || project.endDate) ? `
                      <div class="project-dates">
                        ${project.startDate ? `${project.startDate} - ${project.endDate || "Present"}` : ""}
                      </div>
                    ` : ""}
                  </div>
                  ${project.description ? `<p class="project-description">${project.description}</p>` : ""}
                  ${project.technologies ? `<div class="project-tech"><strong>Tech:</strong> ${project.technologies}</div>` : ""}
                </div>
              `).join("")}
            </section>
          ` : ""}
        </main>
      </div>
    </div>
  `;
}
