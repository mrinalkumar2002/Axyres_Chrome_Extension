console.log("Axyres content loaded");

// =========================
// FLOATING BUTTON
// =========================
if (!document.getElementById("axyres-btn")) {

  const btn = document.createElement("div");
  btn.id = "axyres-btn";

  const logo = chrome.runtime.getURL("logo.jpeg");

  btn.innerHTML = `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:14px 6px;
    ">
      <span style="
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        font-weight:600;
        font-size:14px;
      ">
        Axyres
      </span>

      <img 
        src="${logo}" 
        style="
          width:20px;
          height:20px;
          margin-top:10px;
        "
      >
    </div>
  `;

  Object.assign(btn.style, {
    position: "fixed",
    top: "40%",
    right: "0",
    zIndex: "999999",
    background: "linear-gradient(135deg, #00d9c9, #00b3a6)",
    borderRadius: "14px 0 0 14px",
    cursor: "pointer",
    boxShadow: "0 6px 25px rgba(0,217,201,0.4)",
    transition: "all 0.3s ease"
  });

  btn.onmouseenter = () => {
    btn.style.transform = "translateX(-6px)";
  };

  btn.onmouseleave = () => {
    btn.style.transform = "translateX(0)";
  };

  btn.onclick = toggleAxyresPanel;

  document.body.appendChild(btn);
}


// =========================
// URL DETECTION
// =========================
function isJobPageURL(url) {

  url = url.toLowerCase();

  return (
    url.includes("/jobs/") ||
    url.includes("/job/") ||
    url.includes("linkedin.com/jobs") ||
    url.includes("indeed.com/viewjob") ||
    url.includes("naukri.com/job") ||
    url.includes("naukri.com") ||
    url.includes("careers") ||
    url.includes("workdayjobs") ||
    url.includes("greenhouse") ||
    url.includes("lever.co")
  );
}


// =========================
// CONTENT DETECTION
// =========================
function hasRealJobContent() {

  const text = document.body.innerText.toLowerCase();

  const jobIndicators = [
    "job description",
    "responsibilities",
    "requirements",
    "qualifications",
    "skills",
    "key skills",
    "experience",
    "salary",
    "apply",
    "role",
    "role at a glance",
    "full time",
    "part time",
    "internship",
    "job type",
    "company",
    "about the job"
  ];

  let score = 0;

  jobIndicators.forEach(keyword => {
    if (text.includes(keyword)) {
      score++;
    }
  });

  return score >= 4;
}


// =========================
// LIVE PAGE CHECK
// =========================
function checkCurrentPage() {

  const isJob =
    isJobPageURL(window.location.href) &&
    hasRealJobContent();

  const message = document.getElementById("panelMessage");
  const btn = document.getElementById("panelScrapeBtn");
  const output = document.getElementById("panelOutput");

  if (!message || !btn || !output) return;

  // =========================
  // NOT JOB PAGE
  // =========================
  if (!isJob) {

    message.innerHTML =
      "⚠️ Open a job posting to enable AI extraction.";

    message.style.background = "#2a1a1a";

    btn.disabled = true;

    btn.style.background = "#134e4a";
    btn.style.color = "#6b7280";
    btn.style.opacity = "0.6";
    btn.style.pointerEvents = "none";

    output.innerHTML = `
      <div style="
        height:70vh;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        text-align:center;
        padding:20px;
      ">

        <div style="
          font-size:20px;
          font-weight:600;
          margin-bottom:10px;
        ">
          You’re not on a job page ⚠️
        </div>

        <div style="
          font-size:13px;
          color:#9ca3af;
          max-width:260px;
          line-height:1.5;
          margin-bottom:20px;
        ">
          To use Axyres, open a real job posting on LinkedIn, Naukri, Indeed, or any career portal.
        </div>

        <div style="
          font-size:12px;
          color:#00d9c9;
        ">
          LinkedIn • Naukri • Indeed • Careers
        </div>

      </div>
    `;

  } else {

    // =========================
    // JOB PAGE DETECTED
    // =========================
    message.innerHTML =
      "✅ Job detected. Ready to extract.";

    message.style.background = "#1a2a22";

    btn.disabled = false;

    btn.style.pointerEvents = "auto";
    btn.style.opacity = "1";
    btn.style.background = "#00d9c9";
    btn.style.color = "#000";

    // clear "not job page" UI
    if (
      output.innerHTML.includes("You're not on a job page")
    ) {
      output.innerHTML = "";
    }
  }
}


// =========================
// PANEL FUNCTION
// =========================
function toggleAxyresPanel() {

  let panel = document.getElementById("axyres-panel");

  // Toggle existing panel
  if (panel) {
    panel.style.right =
      panel.style.right === "0px"
        ? "-420px"
        : "0px";
    return;
  }

  // Create panel
  panel = document.createElement("div");
  panel.id = "axyres-panel";

  panel.innerHTML = `
    <div style="
      padding:20px;
      font-family:sans-serif;
      height:100%;
      display:flex;
      flex-direction:column;
    ">

      <!-- HEADER -->
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:15px;
      ">

        <div style="
          display:flex;
          align-items:center;
          gap:10px;
        ">

          <img 
            src="${chrome.runtime.getURL("logo.jpeg")}" 
            style="
              width:28px;
              height:28px;
              border-radius:8px;
              object-fit:cover;
              transform: rotate(90deg);
            "
          >

          <div style="
            font-size:18px;
            font-weight:600;
          ">
            Axyres
          </div>

        </div>

        <div 
          id="closePanel" 
          style="
            cursor:pointer;
            font-size:18px;
          "
        >
          ✖
        </div>

      </div>

      <!-- STATUS -->
      <div id="panelMessage" style="
        font-size:13px;
        margin-bottom:15px;
        padding:10px;
        border-radius:8px;
        background:#1a1a2e;
      ">
        Checking page...
      </div>

      <!-- SCRAPE BUTTON -->
      <button id="panelScrapeBtn" style="
        width:100%;
        padding:14px;
        background:#00d9c9;
        border:none;
        border-radius:10px;
        cursor:pointer;
        font-weight:600;
        font-size:14px;
        transition:0.2s;
      ">
        Scrape with AI
      </button>

      <!-- OUTPUT -->
      <div 
        id="panelOutput" 
        style="
          margin-top:20px;
          overflow-y:auto;
          flex:1;
        "
      ></div>

    </div>
  `;

  Object.assign(panel.style, {
    position: "fixed",
    top: "0",
    right: "-420px",
    width: "380px",
    height: "100%",
    background: "#0a0a0f",
    color: "#fff",
    zIndex: "999999",
    boxShadow: "-6px 0 30px rgba(0,0,0,0.7)",
    transition: "right 0.3s ease"
  });

  document.body.appendChild(panel);

  setTimeout(() => {
    panel.style.right = "0px";
  }, 50);

  // close panel
  document.getElementById("closePanel").onclick = () => {
    panel.style.right = "-420px";
  };

  const btn = document.getElementById("panelScrapeBtn");
  const output = document.getElementById("panelOutput");

  // initial page check
  checkCurrentPage();

  // =========================
  // SCRAPE FUNCTION
  // =========================
  btn.onclick = async () => {

    if (btn.disabled) return;

    output.innerHTML = "⏳ Extracting job details...";

    try {

      const text =
        document.body.innerText.slice(0, 8000);

      const res = await fetch(
        "https://axyres-chrome-extension.onrender.com/extract",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text })
        }
      );

      const resData = await res.json();

      const job = resData.data || resData;

      // =========================
      // RESULT UI
      // =========================
      output.innerHTML = `
        <div style="
          display:flex;
          flex-direction:column;
          gap:18px;
        ">

          <div>
            <div style="
              font-size:18px;
              font-weight:600;
            ">
              ${job.title || "N/A"}
            </div>

            <div style="
              color:#9ca3af;
              font-size:13px;
            ">
              ${job.company || ""} • ${job.location || ""}
            </div>
          </div>

          <div style="
            background:#111827;
            padding:12px;
            border-radius:10px;
          ">
            <div style="
              font-size:12px;
              color:#00d9c9;
            ">
              Experience
            </div>

            <div style="
              font-size:15px;
              font-weight:600;
            ">
              ${job.experience || "Not specified"}
            </div>
          </div>

          <div>

            <div style="
              font-size:12px;
              color:#00d9c9;
              margin-bottom:6px;
            ">
              Skills
            </div>

            <div style="
              display:flex;
              flex-wrap:wrap;
              gap:8px;
            ">

              ${(job.skills || []).map(skill => `
                <span style="
                  background:#1f2937;
                  padding:6px 10px;
                  border-radius:8px;
                  font-size:12px;
                ">
                  ${skill}
                </span>
              `).join("")}

            </div>

          </div>

          <div>

            <div style="
              font-size:12px;
              color:#00d9c9;
              margin-bottom:6px;
            ">
              Responsibilities
            </div>

            <ul style="
              padding-left:16px;
              color:#d1d5db;
              font-size:13px;
            ">

              ${(job.responsibilities || []).map(item => `
                <li>${item}</li>
              `).join("")}

            </ul>

          </div>

          <!-- DOWNLOAD BUTTON -->
          <button style="
            width:100%;
            padding:14px;
            margin-top:10px;
            background:linear-gradient(135deg,#00d9c9,#00b3a6);
            border:none;
            border-radius:10px;
            cursor:pointer;
            font-weight:700;
            font-size:14px;
            color:#000;
            transition:0.3s;
            box-shadow:0 6px 20px rgba(0,217,201,0.25);
          ">
            ⬇ Download
          </button>

        </div>
      `;

    } catch (err) {

      console.error(err);

      output.innerHTML = `
        <div style="
          color:#ff6b6b;
          text-align:center;
          margin-top:30px;
        ">
          ❌ Failed to extract
        </div>
      `;
    }
  };

  // =========================
  // LIVE PAGE DETECTION
  // =========================
  setInterval(() => {
    checkCurrentPage();
  }, 1500);
}