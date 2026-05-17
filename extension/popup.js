// ✅ Detect job page
async function isJobPage() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const url = tab.url.toLowerCase();

  return (
    url.includes("linkedin.com/jobs") ||
    url.includes("indeed.com") ||
    url.includes("careers") ||
    url.includes("job")
  );
}

// ✅ On load → hide Open Job card if already on job page
document.addEventListener("DOMContentLoaded", async () => {

  const openCard = document.getElementById("openJobCard");
  const scrapeCard = document.getElementById("scrapeBtn");

  const jobPage = await isJobPage();

  console.log("Job Page:", jobPage);

  if (jobPage) {
    // ✅ On job page → show scrape, hide open job
    if (openCard) openCard.style.display = "none";
    if (scrapeCard) scrapeCard.style.display = "flex";
  } else {
    // ❌ Not job page → show open job, hide scrape
    if (openCard) openCard.style.display = "flex";
    if (scrapeCard) scrapeCard.style.display = "none";
  }

});


// ✅ SCRAPE LOGIC
const scrapeBtn = document.getElementById("scrapeBtn");
const output = document.getElementById("output");

let isScraped = false;

scrapeBtn.addEventListener("click", async () => {

  // 👉 DOWNLOAD MODE
  if (isScraped) {
    const blob = new Blob([output.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    a.click();

    URL.revokeObjectURL(url);
    return;
  }

  output.innerHTML = "⏳ Extracting with AI...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    });

    const rawText = result[0].result.slice(0, 8000);

    const response = await fetch("http://localhost:5000/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: rawText })
    });

    const data = await response.json();

    displayData(data.data || data);

    // 🔄 Change card to Download
    scrapeBtn.innerHTML = `
      <div class="card-icon"><i class="fas fa-download"></i></div>
      <div class="card-text">
        <h4>Download Resume</h4>
        <p>Click to download</p>
      </div>
    `;

    isScraped = true;

  } catch (err) {
    console.error(err);
    output.innerHTML = "❌ Error extracting data";
  }
});


// ✅ DISPLAY DATA (FIXED ERROR)
function displayData(job) {
  output.innerHTML = `
    <div class="field"><span class="label">Title:</span> ${job.title || ""}</div>
    <div class="field"><span class="label">Company:</span> ${job.company || ""}</div>
    <div class="field"><span class="label">Location:</span> ${job.location || ""}</div>
    <div class="field"><span class="label">Experience:</span> ${job.experience || ""}</div>
    <div class="field"><span class="label">Skills:</span> ${(job.skills || []).join(", ")}</div>
    <div class="field"><span class="label">Responsibilities:</span> ${(job.responsibilities || []).join(", ")}</div>
  `;
}

