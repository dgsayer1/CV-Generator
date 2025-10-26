import type { CVData, CVStyle, PersonalInfo, Skills, JobEntry, EducationEntry, Reference } from './types';
import { getDateRangeValue } from './datePicker';

export function getSelectedStyle(): CVStyle {
  const gallery = document.getElementById('style-gallery');
  if (!gallery) return 'modern';

  const selectedCard = gallery.querySelector('.style-card.selected');
  if (!selectedCard) return 'modern';

  return (selectedCard.getAttribute('data-style-id') || 'modern') as CVStyle;
}

export function collectFormData(): CVData {
  const personal = collectPersonalInfo();
  const skills = collectSkills();
  const jobs = collectJobs();
  const education = collectEducation();
  const certifications = collectCertifications();
  const references = collectReferences();
  const cvStyle = getSelectedStyle();
  const themeColor = getInputValue('theme-color') || '#667eea';
  const fontFamily = (getInputValue('pdf-font') || 'helvetica') as 'helvetica' | 'times' | 'courier';

  return {
    personal,
    skills,
    jobs,
    education,
    certifications,
    references,
    cvStyle,
    themeColor,
    fontFamily
  };
}

export function collectPersonalInfo(): PersonalInfo {
  return {
    name: getInputValue('name'),
    title: getInputValue('title'),
    phone: getInputValue('phone'),
    email: getInputValue('email'),
    location: getInputValue('location'),
    summary: getInputValue('summary')
  };
}

export function collectSkills(): Skills {
  const skills: Skills = {};
  const skillCategories = document.querySelectorAll('.skill-category');

  skillCategories.forEach((category) => {
    const nameInput = category.querySelector('.skill-category-name') as HTMLInputElement;
    const categoryName = nameInput?.value.trim();

    if (categoryName) {
      const skillInputs = category.querySelectorAll('.skill-item-input') as NodeListOf<HTMLInputElement>;
      const skillItems: string[] = [];

      skillInputs.forEach((input) => {
        const value = input.value.trim();
        if (value) {
          skillItems.push(value);
        }
      });

      if (skillItems.length > 0) {
        skills[categoryName] = skillItems;
      }
    }
  });

  return skills;
}

export function collectJobs(): JobEntry[] {
  const jobEntries = document.querySelectorAll('.job-entry');
  const jobs: JobEntry[] = [];

  jobEntries.forEach((entry) => {
    const title = (entry.querySelector('.job-title') as HTMLInputElement)?.value || '';
    const company = (entry.querySelector('.job-company') as HTMLInputElement)?.value || '';
    const location = (entry.querySelector('.job-location') as HTMLInputElement)?.value || '';
    const respText = (entry.querySelector('.job-resp') as HTMLTextAreaElement)?.value || '';

    // Get dates from date picker
    const datePicker = entry.querySelector('.job-dates-picker');
    let dates = '';
    if (datePicker) {
      const monthSelects = datePicker.querySelectorAll('.month-select');
      const yearSelects = datePicker.querySelectorAll('.year-select');
      const startMonth = monthSelects[0] as HTMLSelectElement;
      const startYear = yearSelects[0] as HTMLSelectElement;
      const endMonth = monthSelects[1] as HTMLSelectElement;
      const endYear = yearSelects[1] as HTMLSelectElement;
      const presentCheckbox = datePicker.querySelector('.present-checkbox') as HTMLInputElement;

      if (startMonth && startYear && endMonth && endYear && presentCheckbox) {
        dates = getDateRangeValue({
          container: datePicker as HTMLElement,
          startMonth,
          startYear,
          endMonth,
          endYear,
          presentCheckbox
        });
      }
    }

    if (title.trim()) {
      jobs.push({
        title: title.trim(),
        dates: dates.trim(),
        company: company.trim(),
        location: location.trim(),
        responsibilities: parseResponsibilities(respText)
      });
    }
  });

  return jobs;
}

export function collectEducation(): EducationEntry[] {
  const eduEntries = document.querySelectorAll('.education-entry');
  const education: EducationEntry[] = [];

  eduEntries.forEach((entry) => {
    const degree = (entry.querySelector('.edu-degree') as HTMLInputElement)?.value || '';
    const institution = (entry.querySelector('.edu-institution') as HTMLInputElement)?.value || '';

    // Get years from date picker
    const datePicker = entry.querySelector('.edu-years-picker');
    let years = '';
    if (datePicker) {
      const monthSelects = datePicker.querySelectorAll('.month-select');
      const yearSelects = datePicker.querySelectorAll('.year-select');
      const startMonth = monthSelects[0] as HTMLSelectElement;
      const startYear = yearSelects[0] as HTMLSelectElement;
      const endMonth = monthSelects[1] as HTMLSelectElement;
      const endYear = yearSelects[1] as HTMLSelectElement;
      const presentCheckbox = datePicker.querySelector('.present-checkbox') as HTMLInputElement;

      if (startMonth && startYear && endMonth && endYear && presentCheckbox) {
        years = getDateRangeValue({
          container: datePicker as HTMLElement,
          startMonth,
          startYear,
          endMonth,
          endYear,
          presentCheckbox
        });
      }
    }

    if (degree.trim()) {
      education.push({
        degree: degree.trim(),
        years: years.trim(),
        institution: institution.trim()
      });
    }
  });

  return education;
}

export function collectCertifications(): string[] {
  const certEntries = document.querySelectorAll('.certification');
  const certifications: string[] = [];

  certEntries.forEach((input) => {
    const value = (input as HTMLInputElement).value.trim();
    if (value) {
      certifications.push(value);
    }
  });

  return certifications;
}

export function collectReferences(): [Reference, Reference] {
  return [
    {
      name: getInputValue('ref1-name'),
      title: getInputValue('ref1-job-title'),
      company: getInputValue('ref1-company')
    },
    {
      name: getInputValue('ref2-name'),
      title: getInputValue('ref2-job-title'),
      company: getInputValue('ref2-company')
    }
  ];
}

export function getInputValue(id: string): string {
  const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
  return element?.value.trim() || '';
}

export function parseResponsibilities(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}
