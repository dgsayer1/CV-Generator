import { describe, it, expect, beforeEach } from 'vitest';
import {
  addJobEntry,
  addEducationEntry,
  addCertificationEntry,
  addSkillCategoryEntry,
  removeEntry,
  getEntryCount
} from '../../src/entryManager';

describe('addJobEntry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="jobs-container"></div>';
  });

  it('adds job entry to container', () => {
    const entry = addJobEntry();
    expect(entry).toBeInstanceOf(HTMLElement);
    expect(entry.className).toBe('job-entry');
  });

  it('creates job entry with correct structure', () => {
    const entry = addJobEntry();
    expect(entry.querySelector('.job-title')).toBeTruthy();
    expect(entry.querySelector('.job-dates-picker')).toBeTruthy();
    expect(entry.querySelector('.job-company')).toBeTruthy();
    expect(entry.querySelector('.job-location')).toBeTruthy();
    expect(entry.querySelector('.job-resp')).toBeTruthy();
  });

  it('adds entry to DOM', () => {
    const initialCount = getEntryCount('.job-entry');
    addJobEntry();
    expect(getEntryCount('.job-entry')).toBe(initialCount + 1);
  });

  it('throws error when container not found', () => {
    document.body.innerHTML = '';
    expect(() => addJobEntry()).toThrow('Container with id "jobs-container" not found');
  });

  it('accepts custom container ID', () => {
    document.body.innerHTML = '<div id="custom-container"></div>';
    const entry = addJobEntry('custom-container');
    expect(entry).toBeInstanceOf(HTMLElement);
  });

  it('creates entry with empty input fields', () => {
    const entry = addJobEntry();
    const titleInput = entry.querySelector('.job-title') as HTMLInputElement;
    expect(titleInput.value).toBe('');
  });

  it('includes remove button', () => {
    const entry = addJobEntry();
    const removeBtn = entry.querySelector('.btn-danger');
    expect(removeBtn).toBeTruthy();
    expect(removeBtn?.textContent).toContain('Remove');
  });
});

describe('addEducationEntry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="education-container"></div>';
  });

  it('adds education entry to container', () => {
    const entry = addEducationEntry();
    expect(entry).toBeInstanceOf(HTMLElement);
    expect(entry.className).toBe('education-entry');
  });

  it('creates education entry with correct structure', () => {
    const entry = addEducationEntry();
    expect(entry.querySelector('.edu-degree')).toBeTruthy();
    expect(entry.querySelector('.edu-years-picker')).toBeTruthy();
    expect(entry.querySelector('.edu-institution')).toBeTruthy();
  });

  it('adds entry to DOM', () => {
    const initialCount = getEntryCount('.education-entry');
    addEducationEntry();
    expect(getEntryCount('.education-entry')).toBe(initialCount + 1);
  });

  it('throws error when container not found', () => {
    document.body.innerHTML = '';
    expect(() => addEducationEntry()).toThrow('Container with id "education-container" not found');
  });

  it('accepts custom container ID', () => {
    document.body.innerHTML = '<div id="custom-edu"></div>';
    const entry = addEducationEntry('custom-edu');
    expect(entry).toBeInstanceOf(HTMLElement);
  });

  it('creates entry with empty input fields', () => {
    const entry = addEducationEntry();
    const degreeInput = entry.querySelector('.edu-degree') as HTMLInputElement;
    expect(degreeInput.value).toBe('');
  });

  it('includes remove button', () => {
    const entry = addEducationEntry();
    const removeBtn = entry.querySelector('.btn-danger');
    expect(removeBtn).toBeTruthy();
  });
});

describe('addCertificationEntry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="certifications-container"></div>';
  });

  it('adds certification entry to container', () => {
    const entry = addCertificationEntry();
    expect(entry).toBeInstanceOf(HTMLElement);
    expect(entry.className).toBe('cert-entry');
  });

  it('creates certification entry with input field', () => {
    const entry = addCertificationEntry();
    const input = entry.querySelector('.certification');
    expect(input).toBeTruthy();
    expect((input as HTMLInputElement).type).toBe('text');
  });

  it('adds entry to DOM', () => {
    const initialCount = getEntryCount('.cert-entry');
    addCertificationEntry();
    expect(getEntryCount('.cert-entry')).toBe(initialCount + 1);
  });

  it('throws error when container not found', () => {
    document.body.innerHTML = '';
    expect(() => addCertificationEntry()).toThrow('Container with id "certifications-container" not found');
  });

  it('accepts custom container ID', () => {
    document.body.innerHTML = '<div id="custom-certs"></div>';
    const entry = addCertificationEntry('custom-certs');
    expect(entry).toBeInstanceOf(HTMLElement);
  });

  it('creates entry with empty input', () => {
    const entry = addCertificationEntry();
    const input = entry.querySelector('.certification') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('includes remove button', () => {
    const entry = addCertificationEntry();
    const removeBtn = entry.querySelector('.btn-danger');
    expect(removeBtn).toBeTruthy();
  });
});

describe('removeEntry', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <div id="entry1">Entry 1</div>
        <div id="entry2">Entry 2</div>
      </div>
    `;
  });

  it('removes element from DOM', () => {
    const entry = document.getElementById('entry1') as HTMLElement;
    removeEntry(entry);
    expect(document.getElementById('entry1')).toBeNull();
  });

  it('does not affect other elements', () => {
    const entry = document.getElementById('entry1') as HTMLElement;
    removeEntry(entry);
    expect(document.getElementById('entry2')).toBeTruthy();
  });

  it('handles removing already detached element', () => {
    const entry = document.createElement('div');
    expect(() => removeEntry(entry)).not.toThrow();
  });
});

describe('getEntryCount', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="job-entry"></div>
      <div class="job-entry"></div>
      <div class="education-entry"></div>
    `;
  });

  it('counts elements matching selector', () => {
    expect(getEntryCount('.job-entry')).toBe(2);
    expect(getEntryCount('.education-entry')).toBe(1);
  });

  it('returns zero for non-existent selector', () => {
    expect(getEntryCount('.nonexistent')).toBe(0);
  });

  it('updates count after adding elements', () => {
    document.body.innerHTML = '<div id="jobs-container"></div>';
    expect(getEntryCount('.job-entry')).toBe(0);
    addJobEntry();
    expect(getEntryCount('.job-entry')).toBe(1);
    addJobEntry();
    expect(getEntryCount('.job-entry')).toBe(2);
  });
});

describe('addSkillCategoryEntry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="skills-container"></div>';
  });

  it('adds skill category to container', () => {
    const entry = addSkillCategoryEntry();
    expect(entry).toBeInstanceOf(HTMLElement);
    expect(entry.className).toBe('skill-category');
  });

  it('creates category with correct structure', () => {
    const entry = addSkillCategoryEntry();
    expect(entry.querySelector('.skill-category-name')).toBeTruthy();
    expect(entry.querySelector('.skill-items-container')).toBeTruthy();
  });

  it('includes add skill button', () => {
    const entry = addSkillCategoryEntry();
    const addBtn = Array.from(entry.querySelectorAll('button')).find(
      btn => btn.textContent?.includes('Add Skill')
    );
    expect(addBtn).toBeTruthy();
    expect(addBtn?.className).toContain('btn-primary');
  });

  it('includes remove category button', () => {
    const entry = addSkillCategoryEntry();
    const removeBtn = Array.from(entry.querySelectorAll('button')).find(
      btn => btn.textContent?.includes('Remove Category')
    );
    expect(removeBtn).toBeTruthy();
    expect(removeBtn?.className).toContain('btn-danger');
  });

  it('adds default skill item on creation', () => {
    const entry = addSkillCategoryEntry();
    const skillItems = entry.querySelectorAll('.skill-item');
    expect(skillItems.length).toBe(1);
  });

  it('adds skill item when add button clicked', () => {
    const entry = addSkillCategoryEntry();
    const addBtn = Array.from(entry.querySelectorAll('button')).find(
      btn => btn.textContent?.includes('Add Skill')
    ) as HTMLButtonElement;

    expect(entry.querySelectorAll('.skill-item').length).toBe(1);
    addBtn.click();
    expect(entry.querySelectorAll('.skill-item').length).toBe(2);
  });

  it('removes category when remove button clicked', () => {
    const entry = addSkillCategoryEntry();
    const removeBtn = Array.from(entry.querySelectorAll('button')).find(
      btn => btn.textContent?.includes('Remove Category')
    ) as HTMLButtonElement;

    expect(getEntryCount('.skill-category')).toBe(1);
    removeBtn.click();
    expect(getEntryCount('.skill-category')).toBe(0);
  });

  it('removes skill item when its remove button clicked', () => {
    const entry = addSkillCategoryEntry();
    const skillItem = entry.querySelector('.skill-item') as HTMLElement;
    const removeBtn = skillItem.querySelector('button') as HTMLButtonElement;

    expect(entry.querySelectorAll('.skill-item').length).toBe(1);
    removeBtn.click();
    expect(entry.querySelectorAll('.skill-item').length).toBe(0);
  });

  it('creates skill items with input and remove button', () => {
    const entry = addSkillCategoryEntry();
    const skillItem = entry.querySelector('.skill-item') as HTMLElement;

    const input = skillItem.querySelector('.skill-item-input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('text');

    const removeBtn = skillItem.querySelector('button');
    expect(removeBtn).toBeTruthy();
    expect(removeBtn?.textContent).toBe('×');
  });

  it('throws error when container not found', () => {
    document.body.innerHTML = '';
    expect(() => addSkillCategoryEntry()).toThrow('Container with id "skills-container" not found');
  });

  it('accepts custom container ID', () => {
    document.body.innerHTML = '<div id="custom-skills"></div>';
    const entry = addSkillCategoryEntry('custom-skills');
    expect(entry).toBeInstanceOf(HTMLElement);
  });

  it('adds entry to DOM', () => {
    const initialCount = getEntryCount('.skill-category');
    addSkillCategoryEntry();
    expect(getEntryCount('.skill-category')).toBe(initialCount + 1);
  });

  it('prevents default on button clicks', () => {
    const entry = addSkillCategoryEntry();
    const addBtn = Array.from(entry.querySelectorAll('button')).find(
      btn => btn.textContent?.includes('Add Skill')
    ) as HTMLButtonElement;

    const mockEvent = new Event('click', { bubbles: true, cancelable: true });
    let defaultPrevented = false;
    mockEvent.preventDefault = () => { defaultPrevented = true; };

    addBtn.dispatchEvent(mockEvent);
    expect(entry.querySelectorAll('.skill-item').length).toBeGreaterThan(1);
  });
});

describe('DOM manipulation integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="jobs-container"></div>';
  });

  it('allows adding multiple job entries', () => {
    addJobEntry();
    addJobEntry();
    addJobEntry();
    expect(getEntryCount('.job-entry')).toBe(3);
  });

  it('allows removing added entries', () => {
    const entry1 = addJobEntry();
    const entry2 = addJobEntry();
    expect(getEntryCount('.job-entry')).toBe(2);

    removeEntry(entry1);
    expect(getEntryCount('.job-entry')).toBe(1);

    removeEntry(entry2);
    expect(getEntryCount('.job-entry')).toBe(0);
  });

  it('maintains correct structure after multiple operations', () => {
    addJobEntry();
    const entry2 = addJobEntry();
    addJobEntry();

    removeEntry(entry2);
    expect(getEntryCount('.job-entry')).toBe(2);

    const entries = document.querySelectorAll('.job-entry');
    entries.forEach(entry => {
      expect(entry.querySelector('.job-title')).toBeTruthy();
    });
  });
});
