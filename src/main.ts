import './styles/main.css';
import { collectFormData } from './formHandler';
import { addJobEntry, addEducationEntry, addCertificationEntry, addSkillCategoryEntry } from './entryManager';
import { generatePDF } from './pdfGenerator';
import { createDatePicker, setDateRangeValue } from './datePicker';
import {
  defaultPersonalInfo,
  defaultSummary,
  defaultSkills,
  defaultJobs,
  defaultEducation,
  defaultCertifications,
  defaultReferences,
} from './defaultData';
import { loadFromFile, type PartialCVData } from './jsonLoader';

function populateFormWithData(data: PartialCVData): void {
  // Personal Information
  if (data.personal) {
    if (data.personal.name !== undefined) {
      (document.getElementById('name') as HTMLInputElement).value = data.personal.name;
    }
    if (data.personal.title !== undefined) {
      (document.getElementById('title') as HTMLInputElement).value = data.personal.title;
    }
    if (data.personal.phone !== undefined) {
      (document.getElementById('phone') as HTMLInputElement).value = data.personal.phone;
    }
    if (data.personal.email !== undefined) {
      (document.getElementById('email') as HTMLInputElement).value = data.personal.email;
    }
    if (data.personal.location !== undefined) {
      (document.getElementById('location') as HTMLInputElement).value = data.personal.location;
    }
    if (data.personal.summary !== undefined) {
      (document.getElementById('summary') as HTMLTextAreaElement).value = data.personal.summary;
    }
  }

  // Skills
  if (data.skills) {
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
    }
    Object.entries(data.skills).forEach(([categoryName, skillItems]) => {
      const category = addSkillCategoryEntry();
      const nameInput = category.querySelector('.skill-category-name') as HTMLInputElement;
      nameInput.value = categoryName;

      const skillsContainer = category.querySelector('.skill-items-container') as HTMLElement;
      skillsContainer.innerHTML = '';

      skillItems.forEach((skill) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.style.display = 'flex';
        skillItem.style.gap = '10px';
        skillItem.style.marginBottom = '5px';
        skillItem.style.alignItems = 'center';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'skill-item-input';
        input.value = skill;
        input.style.flex = '1';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger';
        removeBtn.textContent = '×';
        removeBtn.style.fontSize = '16px';
        removeBtn.style.padding = '2px 8px';
        removeBtn.style.minWidth = 'auto';
        removeBtn.onclick = (e) => {
          e.preventDefault();
          skillItem.remove();
        };

        skillItem.appendChild(input);
        skillItem.appendChild(removeBtn);
        skillsContainer.appendChild(skillItem);
      });
    });
  }

  // Work Experience
  if (data.jobs) {
    const jobsContainer = document.getElementById('jobs-container');
    if (jobsContainer) {
      jobsContainer.innerHTML = '';
      data.jobs.forEach((job) => {
      const jobEntry = document.createElement('div');
      jobEntry.className = 'job-entry';

      // Create structure manually to insert date picker
      const titleRow = document.createElement('div');
      titleRow.className = 'two-column';

      const titleGroup = document.createElement('div');
      titleGroup.className = 'form-group';
      titleGroup.innerHTML = `
        <label>Job Title</label>
        <input type="text" class="job-title" value="${job.title}">
      `;

      const dateGroup = document.createElement('div');
      dateGroup.className = 'form-group';
      const datePicker = createDatePicker('Dates');
      datePicker.container.classList.add('job-dates-picker');
      setDateRangeValue(datePicker, job.dates);
      dateGroup.appendChild(datePicker.container);

      titleRow.appendChild(titleGroup);
      titleRow.appendChild(dateGroup);

      const companyRow = document.createElement('div');
      companyRow.className = 'two-column';
      companyRow.innerHTML = `
        <div class="form-group">
          <label>Company</label>
          <input type="text" class="job-company" value="${job.company}">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="job-location" value="${job.location}">
        </div>
      `;

        const respSection = document.createElement('div');
        respSection.className = 'job-responsibilities';
        respSection.innerHTML = `
          <label>Responsibilities (one per line)</label>
          <textarea class="job-resp">${job.responsibilities.join('\n')}</textarea>
        `;

        jobEntry.appendChild(titleRow);
        jobEntry.appendChild(companyRow);
        jobEntry.appendChild(respSection);
        jobsContainer.appendChild(jobEntry);
      });
    }
  }

  // Education
  if (data.education) {
    const educationContainer = document.getElementById('education-container');
    if (educationContainer) {
      educationContainer.innerHTML = '';
      data.education.forEach((edu) => {
      const eduEntry = document.createElement('div');
      eduEntry.className = 'education-entry';

      const topRow = document.createElement('div');
      topRow.className = 'two-column';

      const degreeGroup = document.createElement('div');
      degreeGroup.className = 'form-group';
      degreeGroup.innerHTML = `
        <label>Degree</label>
        <input type="text" class="edu-degree" value="${edu.degree}">
      `;

      const dateGroup = document.createElement('div');
      dateGroup.className = 'form-group';
      const datePicker = createDatePicker('Years', true); // true = years only
      datePicker.container.classList.add('edu-years-picker');
      setDateRangeValue(datePicker, edu.years);
      dateGroup.appendChild(datePicker.container);

      topRow.appendChild(degreeGroup);
      topRow.appendChild(dateGroup);

      const institutionGroup = document.createElement('div');
      institutionGroup.className = 'form-group';
      institutionGroup.innerHTML = `
        <label>Institution</label>
        <input type="text" class="edu-institution" value="${edu.institution}">
      `;

        eduEntry.appendChild(topRow);
        eduEntry.appendChild(institutionGroup);
        educationContainer.appendChild(eduEntry);
      });
    }
  }

  // Certifications
  if (data.certifications) {
    const certsContainer = document.getElementById('certifications-container');
    if (certsContainer) {
      certsContainer.innerHTML = '';
      data.certifications.forEach((cert) => {
        const certEntry = document.createElement('div');
        certEntry.className = 'cert-entry';
        certEntry.innerHTML = `<input type="text" class="certification" value="${cert}">`;
        certsContainer.appendChild(certEntry);
      });
    }
  }

  // References
  if (data.references && data.references.length >= 2) {
    (document.getElementById('ref1-name') as HTMLInputElement).value = data.references[0].name;
    (document.getElementById('ref1-job-title') as HTMLInputElement).value = data.references[0].title;
    (document.getElementById('ref1-company') as HTMLInputElement).value = data.references[0].company;
    (document.getElementById('ref2-name') as HTMLInputElement).value = data.references[1].name;
    (document.getElementById('ref2-job-title') as HTMLInputElement).value = data.references[1].title;
    (document.getElementById('ref2-company') as HTMLInputElement).value = data.references[1].company;
  }

  // Theme color
  if (data.themeColor) {
    const colorPicker = document.getElementById('theme-color') as HTMLInputElement;
    if (colorPicker) {
      colorPicker.value = data.themeColor;
      handleColorChange({ target: colorPicker } as Event);
    }
  }
}

function populateDefaultData(): void {
  populateFormWithData({
    personal: {
      name: defaultPersonalInfo.name,
      title: defaultPersonalInfo.title,
      phone: defaultPersonalInfo.phone,
      email: defaultPersonalInfo.email,
      location: defaultPersonalInfo.location,
      summary: defaultSummary,
    },
    skills: Object.fromEntries(
      Object.entries(defaultSkills).map(([key, value]) => [
        key,
        value.split(',').map(s => s.trim())
      ])
    ),
    jobs: defaultJobs.map(job => ({
      ...job,
      responsibilities: job.responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
    })),
    education: defaultEducation,
    certifications: defaultCertifications,
    references: [
      {
        name: defaultReferences.ref1Name,
        title: defaultReferences.ref1JobTitle,
        company: defaultReferences.ref1Company,
      },
      {
        name: defaultReferences.ref2Name,
        title: defaultReferences.ref2JobTitle,
        company: defaultReferences.ref2Company,
      },
    ],
  });
}

function setupEventListeners(): void {
  const addJobBtn = document.getElementById('add-job-btn');
  const addEducationBtn = document.getElementById('add-education-btn');
  const addCertificationBtn = document.getElementById('add-certification-btn');
  const addSkillCategoryBtn = document.getElementById('add-skill-category-btn');
  const generateBtn = document.getElementById('generate-pdf-btn');
  const colorPicker = document.getElementById('theme-color') as HTMLInputElement;
  const loadFileBtn = document.getElementById('load-file-btn');
  const downloadTemplateBtn = document.getElementById('download-template-btn');

  addJobBtn?.addEventListener('click', () => addJobEntry());
  addEducationBtn?.addEventListener('click', () => addEducationEntry());
  addCertificationBtn?.addEventListener('click', () => addCertificationEntry());
  addSkillCategoryBtn?.addEventListener('click', () => addSkillCategoryEntry());
  generateBtn?.addEventListener('click', handleGeneratePDF);
  colorPicker?.addEventListener('input', handleColorChange);
  loadFileBtn?.addEventListener('click', handleLoadFromFile);
  downloadTemplateBtn?.addEventListener('click', handleDownloadTemplate);
}

function handleColorChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const color = input.value;

  // Update CSS custom property
  document.documentElement.style.setProperty('--theme-color', color);

  // Update gradient header
  const header = document.querySelector('.header') as HTMLElement;
  if (header) {
    header.style.background = `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`;
  }

  // Update generate button background
  const generateSection = document.querySelector('.generate-section') as HTMLElement;
  if (generateSection) {
    generateSection.style.background = `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`;
  }
}

function adjustColor(color: string, amount: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function handleGeneratePDF(): void {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = 'Generating PDF...';
  }

  const data = collectFormData();
  generatePDF(data);
}

async function handleLoadFromFile(): Promise<void> {
  const statusEl = document.getElementById('import-status');
  const fileInput = document.getElementById('json-file') as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (!file) {
    displayImportStatus('Please select a file', false);
    return;
  }

  displayImportStatus('Loading from file...', true);

  try {
    const data = await loadFromFile(file);
    populateFormWithData(data);
    displayImportStatus('✓ Data loaded successfully from file', true);
    fileInput.value = '';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load data from file';
    displayImportStatus(`✗ ${message}`, false);
    console.error('Load from file error:', error);
  }
}

function displayImportStatus(message: string, success: boolean): void {
  const statusEl = document.getElementById('import-status');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = 'import-status ' + (success ? 'success' : 'error');
  }
}

function handleDownloadTemplate(): void {
  const template = {
    personal: {
      name: 'Your Full Name',
      title: 'Your Job Title',
      phone: '07700 900000',
      email: 'your.email@example.com',
      location: 'City, Country',
      summary: 'A brief professional summary highlighting your key skills and experience...'
    },
    skills: {
      'Category 1': ['Skill 1', 'Skill 2', 'Skill 3'],
      'Category 2': ['Skill 4', 'Skill 5']
    },
    jobs: [
      {
        title: 'Job Title',
        dates: 'Jan 2020 - Present',
        company: 'Company Name',
        location: 'City, Country',
        responsibilities: [
          'First key responsibility or achievement',
          'Second key responsibility or achievement',
          'Third key responsibility or achievement'
        ]
      }
    ],
    education: [
      {
        degree: 'Degree Name',
        years: '2015 - 2019',
        institution: 'University Name'
      }
    ],
    certifications: [
      'Certification Name 1',
      'Certification Name 2'
    ],
    references: [
      {
        name: 'Reference Name',
        title: 'Their Job Title',
        company: 'Their Company'
      },
      {
        name: 'Reference Name',
        title: 'Their Job Title',
        company: 'Their Company'
      }
    ],
    themeColor: '#667eea'
  };

  const dataStr = JSON.stringify(template, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cv-data-template.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  displayImportStatus('✓ Template downloaded successfully', true);
}

document.addEventListener('DOMContentLoaded', () => {
  populateDefaultData();
  setupEventListeners();
});
