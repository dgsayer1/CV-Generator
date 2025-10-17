import type { CVData } from './types';

export type PartialCVData = {
  personal?: Partial<CVData['personal']>;
  skills?: CVData['skills'];
  jobs?: CVData['jobs'];
  education?: CVData['education'];
  certifications?: CVData['certifications'];
  references?: CVData['references'];
  themeColor?: string;
};

export async function loadFromURL(url: string): Promise<PartialCVData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return validateAndTransform(data);
}

export async function loadFromFile(file: File): Promise<PartialCVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(validateAndTransform(data));
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function validateAndTransform(data: any): PartialCVData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }

  const result: PartialCVData = {};

  // Personal info - flexible
  if (data.personal && typeof data.personal === 'object') {
    result.personal = {};
    if (data.personal.name) result.personal.name = String(data.personal.name);
    if (data.personal.title) result.personal.title = String(data.personal.title);
    if (data.personal.phone) result.personal.phone = String(data.personal.phone);
    if (data.personal.email) result.personal.email = String(data.personal.email);
    if (data.personal.location) result.personal.location = String(data.personal.location);
    if (data.personal.summary) result.personal.summary = String(data.personal.summary);
  }

  // Skills - flexible object
  if (data.skills && typeof data.skills === 'object') {
    result.skills = {};
    Object.entries(data.skills).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        result.skills![category] = items.map(String);
      } else if (typeof items === 'string') {
        // Support comma-separated string format
        result.skills![category] = items.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    });
  }

  // Jobs
  if (Array.isArray(data.jobs)) {
    result.jobs = data.jobs.map((job: any) => ({
      title: String(job.title || ''),
      dates: String(job.dates || ''),
      company: String(job.company || ''),
      location: String(job.location || ''),
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities.map(String)
        : typeof job.responsibilities === 'string'
        ? job.responsibilities.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : []
    }));
  }

  // Education
  if (Array.isArray(data.education)) {
    result.education = data.education.map((edu: any) => ({
      degree: String(edu.degree || ''),
      years: String(edu.years || ''),
      institution: String(edu.institution || '')
    }));
  }

  // Certifications
  if (Array.isArray(data.certifications)) {
    result.certifications = data.certifications.map(String);
  }

  // References
  if (Array.isArray(data.references) && data.references.length >= 2) {
    result.references = [
      {
        name: String(data.references[0]?.name || ''),
        title: String(data.references[0]?.title || ''),
        company: String(data.references[0]?.company || '')
      },
      {
        name: String(data.references[1]?.name || ''),
        title: String(data.references[1]?.title || ''),
        company: String(data.references[1]?.company || '')
      }
    ];
  }

  // Theme color
  if (data.themeColor && typeof data.themeColor === 'string') {
    result.themeColor = data.themeColor;
  }

  return result;
}
