export interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  summary: string;
}

export interface Skills {
  [category: string]: string[];
}

export interface DatePickerData {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isPresent: boolean;
}

export interface JobEntry {
  title: string;
  dates: string;
  company: string;
  location: string;
  responsibilities: string[];
}

export interface EducationEntry {
  degree: string;
  years: string;
  institution: string;
}

export interface Reference {
  name: string;
  title: string;
  company: string;
}

export interface CVData {
  personal: PersonalInfo;
  skills: Skills;
  jobs: JobEntry[];
  education: EducationEntry[];
  certifications: string[];
  references: [Reference, Reference];
  themeColor: string;
  fontFamily: 'helvetica' | 'times' | 'courier';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormValidators {
  email: (value: string) => boolean;
  phone: (value: string) => boolean;
  required: (value: string) => boolean;
  maxLength: (value: string, max: number) => boolean;
}
