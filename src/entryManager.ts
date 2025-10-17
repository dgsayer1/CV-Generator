import { createDatePicker } from './datePicker';

export function addJobEntry(containerId: string = 'jobs-container'): HTMLElement {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const newJob = document.createElement('div');
  newJob.className = 'job-entry';

  // Create structure manually to insert date picker
  const titleRow = document.createElement('div');
  titleRow.className = 'two-column';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'form-group';
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Job Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'job-title';
  titleInput.placeholder = 'Enter job title';
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);

  const dateGroup = document.createElement('div');
  dateGroup.className = 'form-group';
  const datePicker = createDatePicker('Dates');
  datePicker.container.classList.add('job-dates-picker');
  dateGroup.appendChild(datePicker.container);

  titleRow.appendChild(titleGroup);
  titleRow.appendChild(dateGroup);

  const companyRow = document.createElement('div');
  companyRow.className = 'two-column';
  companyRow.innerHTML = `
    <div class="form-group">
      <label>Company</label>
      <input type="text" class="job-company" placeholder="Company name">
    </div>
    <div class="form-group">
      <label>Location</label>
      <input type="text" class="job-location" placeholder="City, Country">
    </div>
  `;

  const respSection = document.createElement('div');
  respSection.className = 'job-responsibilities';
  respSection.innerHTML = `
    <label>Responsibilities (one per line)</label>
    <textarea class="job-resp" placeholder="Enter each responsibility on a new line"></textarea>
  `;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-danger';
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => newJob.remove();

  newJob.appendChild(titleRow);
  newJob.appendChild(companyRow);
  newJob.appendChild(respSection);
  newJob.appendChild(removeBtn);

  container.appendChild(newJob);
  return newJob;
}

export function removeEntry(element: HTMLElement): void {
  element.remove();
}

export function addEducationEntry(containerId: string = 'education-container'): HTMLElement {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const newEdu = document.createElement('div');
  newEdu.className = 'education-entry';

  const topRow = document.createElement('div');
  topRow.className = 'two-column';

  const degreeGroup = document.createElement('div');
  degreeGroup.className = 'form-group';
  const degreeLabel = document.createElement('label');
  degreeLabel.textContent = 'Degree';
  const degreeInput = document.createElement('input');
  degreeInput.type = 'text';
  degreeInput.className = 'edu-degree';
  degreeInput.placeholder = 'Enter degree';
  degreeGroup.appendChild(degreeLabel);
  degreeGroup.appendChild(degreeInput);

  const dateGroup = document.createElement('div');
  dateGroup.className = 'form-group';
  const datePicker = createDatePicker('Years', true); // true = years only
  datePicker.container.classList.add('edu-years-picker');
  dateGroup.appendChild(datePicker.container);

  topRow.appendChild(degreeGroup);
  topRow.appendChild(dateGroup);

  const institutionGroup = document.createElement('div');
  institutionGroup.className = 'form-group';
  institutionGroup.innerHTML = `
    <label>Institution</label>
    <input type="text" class="edu-institution" placeholder="University/College name">
  `;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-danger';
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => newEdu.remove();

  newEdu.appendChild(topRow);
  newEdu.appendChild(institutionGroup);
  newEdu.appendChild(removeBtn);

  container.appendChild(newEdu);
  return newEdu;
}

export function addCertificationEntry(containerId: string = 'certifications-container'): HTMLElement {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const newCert = document.createElement('div');
  newCert.className = 'cert-entry';
  newCert.innerHTML = `
    <input type="text" class="certification" placeholder="Enter certification">
    <button class="btn btn-danger" onclick="this.parentElement.remove()" style="margin-top: 5px;">Remove</button>
  `;

  container.appendChild(newCert);
  return newCert;
}

export function addSkillCategoryEntry(containerId: string = 'skills-container'): HTMLElement {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const newCategory = document.createElement('div');
  newCategory.className = 'skill-category';

  const categoryName = document.createElement('input');
  categoryName.type = 'text';
  categoryName.className = 'skill-category-name';
  categoryName.placeholder = 'Category Name (e.g., Programming)';
  categoryName.style.width = '100%';
  categoryName.style.marginBottom = '10px';
  categoryName.style.fontWeight = '600';

  const skillsListContainer = document.createElement('div');
  skillsListContainer.className = 'skill-items-container';
  skillsListContainer.style.marginBottom = '10px';

  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '10px';
  buttonsContainer.style.marginTop = '10px';

  const addSkillBtn = document.createElement('button');
  addSkillBtn.className = 'btn btn-primary';
  addSkillBtn.textContent = '+ Add Skill';
  addSkillBtn.style.fontSize = '12px';
  addSkillBtn.style.padding = '5px 10px';
  addSkillBtn.onclick = (e) => {
    e.preventDefault();
    addSkillItem(skillsListContainer);
  };

  const removeCategoryBtn = document.createElement('button');
  removeCategoryBtn.className = 'btn btn-danger';
  removeCategoryBtn.textContent = 'Remove Category';
  removeCategoryBtn.style.fontSize = '12px';
  removeCategoryBtn.style.padding = '5px 10px';
  removeCategoryBtn.onclick = (e) => {
    e.preventDefault();
    newCategory.remove();
  };

  buttonsContainer.appendChild(addSkillBtn);
  buttonsContainer.appendChild(removeCategoryBtn);

  newCategory.appendChild(categoryName);
  newCategory.appendChild(skillsListContainer);
  newCategory.appendChild(buttonsContainer);

  // Add first skill item by default
  addSkillItem(skillsListContainer);

  container.appendChild(newCategory);
  return newCategory;
}

function addSkillItem(container: HTMLElement): void {
  const skillItem = document.createElement('div');
  skillItem.className = 'skill-item';
  skillItem.style.display = 'flex';
  skillItem.style.gap = '10px';
  skillItem.style.marginBottom = '5px';
  skillItem.style.alignItems = 'center';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'skill-item-input';
  input.placeholder = 'Enter skill';
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
  container.appendChild(skillItem);
}

export function getEntryCount(containerSelector: string): number {
  return document.querySelectorAll(containerSelector).length;
}
