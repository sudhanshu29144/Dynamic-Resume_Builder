



document.addEventListener("input", function(e) {
  const input = e.target;
  const previewId = input.dataset.preview;
  if (!previewId) return;

  const target = document.getElementById(previewId);
  if (!target) return;

  target.textContent = input.value || "";
  
  // Trigger page break check after content update
  
});

function updateSummaryPreview() {
    const input = document.getElementById("summaryInput");
    const preview = document.getElementById("preview-summary");
    const value = input.value.trim();
    
    if (value) {
        preview.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-700 border-b border-gray-300 ">PROFESSIONAL SUMMARY</h3>
            <p class="text-xs text-gray-600 leading-normal break-words ml-4">${value}</p>
        `;
    } else {
        preview.innerHTML = "";
    }
    
    
}

document.getElementById("summaryInput").addEventListener("input", updateSummaryPreview);

// ========== EDUCATION ==========
function updateEducationPreview() {
    const blocks = document.querySelectorAll("#educationContainer .education-block");
    const preview = document.getElementById("preview-education");
    const section = document.getElementById("education-section");
    let html = "";
    
    blocks.forEach(block => {
        const college = block.querySelector('input[name="college[]"]').value.trim();
        const degree = block.querySelector('input[name="degree[]"]').value.trim();
        const marks = block.querySelector('input[name="marks[]"]').value.trim();
        const year = block.querySelector('input[name="year[]"]').value.trim();
        const location = block.querySelector('input[name="location[]"]').value.trim();
        const grading = block.querySelector('select[name="grading[]"]').value;
        
        if (college || degree || marks || year || location) {
            html += `
                <div class=" break-inside-avoid">
                    <div class="flex justify-between items-start">
                        <div class="flex-1 pr-4">
                            <h4 class="font-semibold text-gray-800 break-words uppercase">${college}</h4>
                            <p class=" font-semibold text-gray-800 break-words text-sm ">${degree}</p>
                        </div>
                        <div class="text-right flex-shrink-0">
                            <p class="text-sm text-gray-600 break-words">${year}</p>
                            <p class="text-sm text-gray-600 break-words">${location}</p>
                        </div>
                    </div>
                    ${grading && marks ? `<p class="text-xs text-gray-600 mt-1 break-words">${grading}: ${marks}</p>` : ''}
                </div>
            `;
        }
    });
    
    if (html) {
        section.style.display = "";
        preview.innerHTML = html;
    } else {
        section.style.display = "none";
    }
    
    
}

// ========== SKILLS ==========
function updateSkillsPreview() {
    const inputs = document.querySelectorAll(".skill-input");
    const preview = document.getElementById("preview-skills");
    const section = document.getElementById("skills-section");

    let html = "";
    let hasSkills = false;

    inputs.forEach(input => {
        if (input.value.trim()) {
            const skillType = input.placeholder.replace(/[^a-zA-Z\s/]/g, '').trim();
            html += `
                <div class="flex leading-[1.1]">
                    <span class="w-52 font-semibold uppercase text-sm text-gray-700">${skillType}</span>
                    <span class="flex-1 text-sm leading-normal break-words break-all text-gray-700">${input.value.trim()}</span>
                </div>
            `;
            hasSkills = true;
        }
    });

    if (hasSkills) {
        section.style.display = "";
        preview.innerHTML = html;
    } else {
        section.style.display = "none";
    }

    
}


document.querySelectorAll(".skill-input").forEach(inp => {
    inp.addEventListener("input", updateSkillsPreview);
});

// ========== PROJECTS ==========
function updateProjectPreview() {
    const blocks = document.querySelectorAll("#projectContainer .project-block");
    const preview = document.getElementById("preview-projects");
    const section = document.getElementById("projects-section");
    let html = "";

    blocks.forEach(block => {
        const title = block.querySelector('input[name="project_title[]"]').value.trim();
        const tech = block.querySelector('input[name="project_tech[]"]').value.trim();
        const desc = block.querySelector('textarea[name="project_desc[]"]').value.trim();

        if (title || desc || tech) {
            html += `
                 <div class=" break-inside-avoid">
                    <div class="flex justify-between items-start ">
                        <div class="flex-1 pr-4">
                            <h4 class="font-semibold text-gray-800 uppercase break-words inline">${title}</h4>
                            
                        </div>
                        <p class="text-sm font-semibold text-gray-600 flex-shrink-0 break-all inline break-words">${tech}</p>
                    </div>
                    ${desc ? `<p class="text-xs text-gray-600 leading-relaxed ml-7 break-words">${desc}</p>` : ''}
                </div>
            `;
        }
    });

    if (html) {
        section.style.display = "";
        preview.innerHTML = html;
    } else {
        section.style.display = "none";
    }
    
    
}

// ========== EXPERIENCE ==========
function updateExperiencePreview() {
    const blocks = document.querySelectorAll("#experienceContainer .experience-block");
    const preview = document.getElementById("preview-experience");
    const section = document.getElementById("experience-section");
    let html = "";
    
    blocks.forEach(block => {
        const role = block.querySelector('input[name="role[]"]').value.trim();
        const org = block.querySelector('input[name="org[]"]').value.trim();
        const duration = block.querySelector('input[name="duration[]"]').value.trim();
        const desc = block.querySelector('textarea[name="exp_desc[]"]').value.trim();

        if (role || org || duration || desc) {
            html += `
                <div class=" break-inside-avoid">
                    <div class="flex justify-between items-start ">
                        <div class="flex-1 pr-4">
                            <h4 class="font-semibold text-gray-800 uppercase break-words inline">${org}</h4>
                            <span class="mx-1">-</span>
                            <h4 class="font-semibold text-gray-600 break-words inline">${role}</h4>
                        </div>
                        <p class="text-sm text-gray-600 flex-shrink-0 break-words">${duration}</p>
                    </div>
                    ${desc ? `<p class="text-xs text-gray-600 leading-relaxed ml-7 break-words">${desc}</p>` : ''}
                </div>
            `;
        }
    });
    
    if (html) {
        section.style.display = "";
        preview.innerHTML = html;
    } else {
        section.style.display = "none";
    }
    
    
}

// ========== CERTIFICATIONS ==========
function updateCertPreview() {
    const blocks = document.querySelectorAll("#certificationContainer .cert-block");
    const preview = document.getElementById("preview-certifications");
    const section = document.getElementById("certifications-section");
    let html = "";
    
    blocks.forEach(block => {
        const name = block.querySelector('input[name="cert_name[]"]').value.trim();
        const org = block.querySelector('input[name="cert_org[]"]').value.trim();
        const year = block.querySelector('input[name="cert_year[]"]').value.trim();
        
        if (name || org || year) {
            html += `
                <div class=" break-inside-avoid">
                    <div class="flex justify-between items-center">
                        <div class="flex-1 pr-4">
                            <span class=" text-gray-800 break-words">${name}</span>
                            ${org ? ` - <span class="font-semibold uppercase text-gray-700 break-words">${org}</span>` : ''}
                        </div>
                        ${year ? `<span class="text-sm text-gray-600 flex-shrink-0">${year}</span>` : ''}
                    </div>
                </div>
            `;
        }
    });
    
    if (html) {
        section.style.display = "";
        preview.innerHTML = html;
    } else {
        section.style.display = "none";
    }
    
    
}

// ========== ADD/REMOVE BLOCKS ==========
document.getElementById("addEducation").addEventListener("click", () => {
    const block = document.createElement("div");
    block.className = "education-block grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3 rounded border relative";
    block.innerHTML = `
        <button type="button" class="removeBtn absolute top-1 right-1 text-red-600 hover:text-red-800 text-lg font-bold">×</button>
        <input type="text" name="college[]" placeholder="College/University" class="input-box live-edu ">
        <input type="text" name="degree[]" placeholder="Degree (e.g., B.Tech, MBA)" class="input-box live-edu ">
        <select name="grading[]" class="input-box live-edu h-10 py-2 px-3 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Grading System</option>
            <option value="CGPA">CGPA</option>
            <option value="Percentage">Percentage</option>
            <option value="GPA">GPA</option>
            <option value="Grade">Grade</option>
        </select>
        <input type="text" name="marks[]" placeholder="Your Score" class="input-box live-edu ">
        <input type="text" name="year[]" placeholder="Year (e.g., 2020-2024)" class="input-box live-edu ">
        <input type="text" name="location[]" placeholder="Location" class="input-box live-edu ">
    `;
    document.getElementById("educationContainer").appendChild(block);
    block.querySelectorAll(".live-edu").forEach(inp => inp.addEventListener("input", updateEducationPreview));
    block.querySelector(".removeBtn").addEventListener("click", () => {
        block.remove();
        updateEducationPreview();
    });
});

  document.getElementById("addProject").addEventListener("click", () => {
  const block = document.createElement("div");
  block.className = "project-block relative bg-gray-50 p-4 rounded border mb-3";

  block.innerHTML = `
    <button type="button"
            class="removeBtn absolute top-1 right-1 text-red-600 hover:text-red-800 text-lg font-bold">
      ×
    </button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <input type="text" name="project_title[]" placeholder="Project Title" class="input-box live-project">
      <input type="text" name="project_tech[]" placeholder="Technologies Used" class="input-box live-project">
    </div>
    <textarea name="project_desc[]" maxlength="300"placeholder="Describe your project..." class="textarea-box live-project h-20"></textarea>
  `;

  // Container में append
  document.getElementById("projectContainer").appendChild(block);

  // 🔑 नये block के सारे fields पर listener लगाओ
  block.querySelectorAll(".live-project").forEach(inp => {
    inp.addEventListener("input", updateProjectPreview);
  });

  // remove button
  block.querySelector(".removeBtn").addEventListener("click", () => {
    block.remove();
    updateProjectPreview(); // hatnate ke baad bhi refresh
  });

  updateProjectPreview(); // block bante preview refresh
});


document.getElementById("addCertification").addEventListener("click", () => {
    const block = document.createElement("div");
    block.className = "cert-block grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3 rounded border relative";
    block.innerHTML = `
        <button type="button" class="removeBtn absolute top-1 right-1 text-red-600 hover:text-red-800 text-lg font-bold">×</button>
        <input type="text" name="cert_name[]" placeholder="Certificate Name" class="input-box live-cert ">
        <input type="text" name="cert_org[]" placeholder="Organization" class="input-box live-cert ">
        <input type="text" name="cert_year[]" placeholder="Year" class="input-box live-cert  md:col-span-2">
    `;
    document.getElementById("certificationContainer").appendChild(block);
    block.querySelectorAll(".live-cert").forEach(inp => inp.addEventListener("input", updateCertPreview));
    block.querySelector(".removeBtn").addEventListener("click", () => {
        block.remove();
        updateCertPreview();
    });
});

document.getElementById("addExperience").addEventListener("click", () => {
    const block = document.createElement("div");
    block.className = "experience-block bg-gray-50 p-3 rounded border mb-3 relative";
    block.innerHTML = `
        <button type="button"
              class="removeBtn absolute top-1 right-1 text-red-600 hover:text-red-800 text-lg font-bold">
        ×
      </button>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input type="text" name="org[]" placeholder="Company/Organization" class="input-box live-exp">
        <input type="text" name="role[]" placeholder="Job Title/Role" class="input-box live-exp">
        <input type="text" name="duration[]" placeholder="Duration (e.g., Jan 2021 - Dec 2023)" class="input-box live-exp md:col-span-2">
      </div>
      <textarea name="exp_desc[]" maxlength="400" placeholder="Describe your responsibilities..." class="textarea-box live-exp h-20"></textarea>
    `;
    document.getElementById("experienceContainer").appendChild(block);
    block.querySelectorAll(".live-exp").forEach(inp => inp.addEventListener("input", updateExperiencePreview));
    block.querySelector(".removeBtn").addEventListener("click", () => {
        block.remove();
        updateExperiencePreview();
    });
});

// ========== INITIAL EVENT LISTENERS ==========
document.querySelectorAll("#educationContainer .live-edu").forEach(inp => {
    inp.addEventListener("input", updateEducationPreview);
});
document.querySelectorAll("#projectContainer .live-project").forEach(inp => {
    inp.addEventListener("input", updateProjectPreview);
});
document.querySelectorAll("#certificationContainer .live-cert").forEach(inp => {
    inp.addEventListener("input", updateCertPreview);
});
document.querySelectorAll("#experienceContainer .live-exp").forEach(inp => {
    inp.addEventListener("input", updateExperiencePreview);
});

// Initialize all previews
updateSummaryPreview();
updateEducationPreview();
updateSkillsPreview();
updateProjectPreview();
updateCertPreview();
updateExperiencePreview();


function adjustFontSize(page) {
    const content = page.querySelector(".page-content");
    let fontSize = 16; // base font size

    while (page.scrollHeight > page.clientHeight && fontSize > 10) {
        fontSize -= 1;
        content.style.fontSize = fontSize + "px";
    }
}

// Apply on all pages
function checkAllPages() {
    document.querySelectorAll(".a4-page").forEach(page => adjustFontSize(page));
}

// Run after content update
document.addEventListener("input", checkAllPages);
window.addEventListener("load", checkAllPages);




    // Resume Preview ka HTML lo
document.getElementById("downloadBtn").addEventListener("click", function (e) {
    e.preventDefault();



    if (validateForm()) {
        alert("⚠️ Please fill all required fields before downloading the PDF.");
        return;
    }
    // Resume Preview Container
    const element = document.getElementById("resumePreviewContainer");

    // Filename user ke naam se
    const nameElement = document.getElementById("preview-name");
    const userName = nameElement ? nameElement.textContent.trim() : "Resume";
    const filename = `${userName.replace(/\s+/g, "_")}_Resume.pdf`;

    // Options for html2pdf
   const opt = {
    margin:       0,
    filename:     filename,
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 4, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }  // केवल overflow पर break
};

html2pdf().set(opt).from(element).save();
});


