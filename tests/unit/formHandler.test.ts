import { describe, it, expect, beforeEach } from 'vitest';
import {
  collectFormData,
  collectPersonalInfo,
  collectSkills,
  collectJobs,
  collectEducation,
  collectCertifications,
  collectReferences,
  getInputValue,
  parseResponsibilities
} from '../../src/formHandler';

describe('getInputValue', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('retrieves value from input element', () => {
    document.body.innerHTML = '<input id="test" value="hello" />';
    expect(getInputValue('test')).toBe('hello');
  });

  it('retrieves value from textarea element', () => {
    document.body.innerHTML = '<textarea id="test">world</textarea>';
    expect(getInputValue('test')).toBe('world');
  });

  it('trims whitespace from values', () => {
    document.body.innerHTML = '<input id="test" value="  hello  " />';
    expect(getInputValue('test')).toBe('hello');
  });

  it('returns empty string for non-existent element', () => {
    expect(getInputValue('nonexistent')).toBe('');
  });

  it('returns empty string for element with no value', () => {
    document.body.innerHTML = '<input id="test" />';
    expect(getInputValue('test')).toBe('');
  });
});

describe('parseResponsibilities', () => {
  it('parses multi-line responsibilities', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    expect(parseResponsibilities(text)).toEqual(['Line 1', 'Line 2', 'Line 3']);
  });

  it('trims whitespace from each line', () => {
    const text = '  Line 1  \n  Line 2  \n  Line 3  ';
    expect(parseResponsibilities(text)).toEqual(['Line 1', 'Line 2', 'Line 3']);
  });

  it('filters out empty lines', () => {
    const text = 'Line 1\n\n\nLine 2\n  \nLine 3';
    expect(parseResponsibilities(text)).toEqual(['Line 1', 'Line 2', 'Line 3']);
  });

  it('handles empty string', () => {
    expect(parseResponsibilities('')).toEqual([]);
  });

  it('handles single line', () => {
    expect(parseResponsibilities('Single line')).toEqual(['Single line']);
  });
});

describe('collectPersonalInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="name" value="John Doe" />
      <input id="title" value="Developer" />
      <input id="phone" value="07722 524 190" />
      <input id="email" value="john@example.com" />
      <input id="location" value="London" />
      <textarea id="summary">Summary text</textarea>
    `;
  });

  it('collects all personal information fields', () => {
    const personal = collectPersonalInfo();
    expect(personal).toEqual({
      name: 'John Doe',
      title: 'Developer',
      phone: '07722 524 190',
      email: 'john@example.com',
      location: 'London',
      summary: 'Summary text'
    });
  });

  it('handles missing fields gracefully', () => {
    document.body.innerHTML = '';
    const personal = collectPersonalInfo();
    expect(personal.name).toBe('');
    expect(personal.email).toBe('');
  });
});

describe('collectSkills', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <textarea id="skills-automation">Playwright, Cypress</textarea>
      <textarea id="skills-programming">JavaScript, TypeScript</textarea>
      <textarea id="skills-performance">K6, JMeter</textarea>
      <textarea id="skills-leadership">Team Management</textarea>
    `;
  });

  it('collects and parses all skill categories', () => {
    // Clear existing and add test categories
    document.body.innerHTML = `
      <div class="skill-category">
        <input type="text" class="skill-category-name" value="Test Automation" />
        <div class="skill-items-container">
          <input type="text" class="skill-item-input" value="Playwright" />
          <input type="text" class="skill-item-input" value="Cypress" />
        </div>
      </div>
      <div class="skill-category">
        <input type="text" class="skill-category-name" value="Programming" />
        <div class="skill-items-container">
          <input type="text" class="skill-item-input" value="JavaScript" />
          <input type="text" class="skill-item-input" value="TypeScript" />
        </div>
      </div>
    `;
    const skills = collectSkills();
    expect(skills).toEqual({
      'Test Automation': ['Playwright', 'Cypress'],
      'Programming': ['JavaScript', 'TypeScript']
    });
  });

  it('handles empty skill categories', () => {
    document.body.innerHTML = `
      <div class="skill-category">
        <input type="text" class="skill-category-name" value="" />
        <div class="skill-items-container"></div>
      </div>
    `;
    const skills = collectSkills();
    expect(skills).toEqual({});
  });
});

describe('collectJobs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="job-entry">
        <input class="job-title" value="Software Engineer" />
        <input class="job-dates" value="2020 - 2023" />
        <input class="job-company" value="Tech Corp" />
        <input class="job-location" value="London" />
        <textarea class="job-resp">Built features\nFixed bugs</textarea>
      </div>
      <div class="job-entry">
        <input class="job-title" value="Junior Developer" />
        <input class="job-dates" value="2018 - 2020" />
        <input class="job-company" value="Startup Inc" />
        <input class="job-location" value="Manchester" />
        <textarea class="job-resp">Learned a lot</textarea>
      </div>
    `;
  });

  it('collects all job entries', () => {
    const jobs = collectJobs();
    expect(jobs).toHaveLength(2);
    expect(jobs[0].title).toBe('Software Engineer');
    expect(jobs[1].title).toBe('Junior Developer');
  });

  it('parses job responsibilities correctly', () => {
    const jobs = collectJobs();
    expect(jobs[0].responsibilities).toEqual(['Built features', 'Fixed bugs']);
    expect(jobs[1].responsibilities).toEqual(['Learned a lot']);
  });

  it('filters out entries without titles', () => {
    document.body.innerHTML = `
      <div class="job-entry">
        <input class="job-title" value="" />
        <input class="job-dates" value="2020 - 2023" />
        <input class="job-company" value="Tech Corp" />
        <input class="job-location" value="London" />
        <textarea class="job-resp">Some text</textarea>
      </div>
    `;
    const jobs = collectJobs();
    expect(jobs).toHaveLength(0);
  });

  it('handles no job entries', () => {
    document.body.innerHTML = '';
    const jobs = collectJobs();
    expect(jobs).toEqual([]);
  });

  it('trims whitespace from job fields', () => {
    document.body.innerHTML = `
      <div class="job-entry">
        <input class="job-title" value="  Engineer  " />
        <div class="job-dates-picker">
          <select class="month-select"></select>
          <select class="year-select"><option value="2020" selected>2020</option></select>
          <select class="month-select"></select>
          <select class="year-select"></select>
          <input type="checkbox" class="present-checkbox" />
        </div>
        <input class="job-company" value="  Corp  " />
        <input class="job-location" value="  London  " />
        <textarea class="job-resp">  Responsibility  </textarea>
      </div>
    `;
    const jobs = collectJobs();
    expect(jobs[0].title).toBe('Engineer');
    expect(jobs[0].dates).toBe('2020');
    expect(jobs[0].company).toBe('Corp');
  });
});

describe('collectEducation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="education-entry">
        <input class="edu-degree" value="BSc Computer Science" />
        <input class="edu-years" value="2015 - 2018" />
        <input class="edu-institution" value="University of London" />
      </div>
      <div class="education-entry">
        <input class="edu-degree" value="MSc Software Engineering" />
        <input class="edu-years" value="2018 - 2019" />
        <input class="edu-institution" value="Imperial College" />
      </div>
    `;
  });

  it('collects all education entries', () => {
    const education = collectEducation();
    expect(education).toHaveLength(2);
    expect(education[0].degree).toBe('BSc Computer Science');
    expect(education[1].degree).toBe('MSc Software Engineering');
  });

  it('filters out entries without degree', () => {
    document.body.innerHTML = `
      <div class="education-entry">
        <input class="edu-degree" value="" />
        <input class="edu-years" value="2015 - 2018" />
        <input class="edu-institution" value="University" />
      </div>
    `;
    const education = collectEducation();
    expect(education).toHaveLength(0);
  });

  it('handles no education entries', () => {
    document.body.innerHTML = '';
    const education = collectEducation();
    expect(education).toEqual([]);
  });

  it('trims whitespace from education fields', () => {
    document.body.innerHTML = `
      <div class="education-entry">
        <input class="edu-degree" value="  BSc  " />
        <div class="edu-years-picker">
          <select class="month-select" style="display: none;"></select>
          <select class="year-select"><option value="2015" selected>2015</option></select>
          <select class="month-select" style="display: none;"></select>
          <select class="year-select"></select>
          <input type="checkbox" class="present-checkbox" />
        </div>
        <input class="edu-institution" value="  University  " />
      </div>
    `;
    const education = collectEducation();
    expect(education[0].degree).toBe('BSc');
    expect(education[0].years).toBe('2015');
    expect(education[0].institution).toBe('University');
  });
});

describe('collectCertifications', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input class="certification" value="ISTQB Foundation" />
      <input class="certification" value="AWS Certified" />
      <input class="certification" value="" />
      <input class="certification" value="   Scrum Master   " />
    `;
  });

  it('collects all non-empty certifications', () => {
    const certs = collectCertifications();
    expect(certs).toHaveLength(3);
    expect(certs).toEqual(['ISTQB Foundation', 'AWS Certified', 'Scrum Master']);
  });

  it('filters out empty certifications', () => {
    document.body.innerHTML = `
      <input class="certification" value="" />
      <input class="certification" value="   " />
    `;
    const certs = collectCertifications();
    expect(certs).toHaveLength(0);
  });

  it('handles no certification inputs', () => {
    document.body.innerHTML = '';
    const certs = collectCertifications();
    expect(certs).toEqual([]);
  });
});

describe('collectReferences', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="ref1-name" value="Alice Smith" />
      <input id="ref1-job-title" value="Senior Manager" />
      <input id="ref1-company" value="Tech Corp" />
      <input id="ref2-name" value="Bob Jones" />
      <input id="ref2-job-title" value="Director" />
      <input id="ref2-company" value="Business Inc" />
    `;
  });

  it('collects both references', () => {
    const refs = collectReferences();
    expect(refs).toHaveLength(2);
    expect(refs[0]).toEqual({ name: 'Alice Smith', title: 'Senior Manager', company: 'Tech Corp' });
    expect(refs[1]).toEqual({ name: 'Bob Jones', title: 'Director', company: 'Business Inc' });
  });

  it('handles missing reference fields', () => {
    document.body.innerHTML = '';
    const refs = collectReferences();
    expect(refs[0].name).toBe('');
    expect(refs[1].name).toBe('');
  });
});

describe('collectFormData', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="name" value="John Doe" />
      <input id="title" value="Developer" />
      <input id="phone" value="07722 524 190" />
      <input id="email" value="john@example.com" />
      <input id="location" value="London" />
      <textarea id="summary">Professional summary</textarea>
      <div class="skill-category">
        <input type="text" class="skill-category-name" value="Test Automation" />
        <div class="skill-items-container">
          <input type="text" class="skill-item-input" value="Playwright" />
        </div>
      </div>
      <div class="job-entry">
        <input class="job-title" value="Engineer" />
        <input class="job-dates" value="2020" />
        <input class="job-company" value="Corp" />
        <input class="job-location" value="City" />
        <textarea class="job-resp">Task 1</textarea>
      </div>
      <div class="education-entry">
        <input class="edu-degree" value="BSc" />
        <input class="edu-years" value="2015" />
        <input class="edu-institution" value="University" />
      </div>
      <input class="certification" value="Cert 1" />
      <input id="ref1-name" value="Ref 1" />
      <input id="ref1-job-title" value="Title 1" />
      <input id="ref1-company" value="Company 1" />
      <input id="ref2-name" value="Ref 2" />
      <input id="ref2-job-title" value="Title 2" />
      <input id="ref2-company" value="Company 2" />
    `;
  });

  it('collects all form data into CVData object', () => {
    const data = collectFormData();

    expect(data.personal.name).toBe('John Doe');
    expect(data.personal.title).toBe('Developer');
    expect(data.skills['Test Automation']).toEqual(['Playwright']);
    expect(data.jobs).toHaveLength(1);
    expect(data.jobs[0].title).toBe('Engineer');
    expect(data.education).toHaveLength(1);
    expect(data.education[0].degree).toBe('BSc');
    expect(data.certifications).toEqual(['Cert 1']);
    expect(data.references).toHaveLength(2);
    expect(data.references[0].name).toBe('Ref 1');
  });

  it('returns complete CVData structure', () => {
    const data = collectFormData();

    expect(data).toHaveProperty('personal');
    expect(data).toHaveProperty('skills');
    expect(data).toHaveProperty('jobs');
    expect(data).toHaveProperty('education');
    expect(data).toHaveProperty('certifications');
    expect(data).toHaveProperty('references');
  });
});
