export interface DateRange {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isPresent: boolean;
}

export interface DatePickerElements {
  container: HTMLElement;
  startMonth: HTMLSelectElement;
  startYear: HTMLSelectElement;
  endMonth: HTMLSelectElement;
  endYear: HTMLSelectElement;
  presentCheckbox: HTMLInputElement;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function createDatePicker(labelText: string, yearsOnly: boolean = false): DatePickerElements {
  const container = document.createElement('div');
  container.className = 'date-picker';

  const label = document.createElement('label');
  label.textContent = labelText;
  label.style.display = 'block';
  label.style.marginBottom = '5px';

  const dateRangeContainer = document.createElement('div');
  dateRangeContainer.className = 'date-range-container';
  dateRangeContainer.style.display = 'flex';
  dateRangeContainer.style.gap = '10px';
  dateRangeContainer.style.alignItems = 'center';
  dateRangeContainer.style.flexWrap = 'wrap';

  // Start date
  const startContainer = document.createElement('div');
  startContainer.style.display = 'flex';
  startContainer.style.gap = '5px';

  const startMonth = yearsOnly ? createHiddenMonthSelect() : createMonthSelect();
  const startYear = createYearSelect();
  startContainer.appendChild(startMonth);
  startContainer.appendChild(startYear);

  // Separator
  const separator = document.createElement('span');
  separator.textContent = '-';
  separator.style.fontWeight = 'bold';

  // End date
  const endContainer = document.createElement('div');
  endContainer.className = 'end-date-container';
  endContainer.style.display = 'flex';
  endContainer.style.gap = '5px';

  const endMonth = yearsOnly ? createHiddenMonthSelect() : createMonthSelect();
  const endYear = createYearSelect();
  endContainer.appendChild(endMonth);
  endContainer.appendChild(endYear);

  // Present checkbox
  const presentContainer = document.createElement('div');
  presentContainer.style.display = 'flex';
  presentContainer.style.alignItems = 'center';
  presentContainer.style.gap = '5px';

  const presentCheckbox = document.createElement('input');
  presentCheckbox.type = 'checkbox';
  presentCheckbox.className = 'present-checkbox';
  presentCheckbox.id = `present-${Date.now()}`;

  const presentLabel = document.createElement('label');
  presentLabel.htmlFor = presentCheckbox.id;
  presentLabel.textContent = 'Present';
  presentLabel.style.margin = '0';
  presentLabel.style.cursor = 'pointer';

  presentContainer.appendChild(presentCheckbox);
  presentContainer.appendChild(presentLabel);

  // Toggle end date fields when Present is checked
  presentCheckbox.addEventListener('change', () => {
    endMonth.disabled = presentCheckbox.checked;
    endYear.disabled = presentCheckbox.checked;
    if (presentCheckbox.checked) {
      endMonth.value = '';
      endYear.value = '';
      endContainer.style.opacity = '0.5';
    } else {
      endContainer.style.opacity = '1';
    }
  });

  dateRangeContainer.appendChild(startContainer);
  dateRangeContainer.appendChild(separator);
  dateRangeContainer.appendChild(endContainer);
  dateRangeContainer.appendChild(presentContainer);

  container.appendChild(label);
  container.appendChild(dateRangeContainer);

  return {
    container,
    startMonth,
    startYear,
    endMonth,
    endYear,
    presentCheckbox
  };
}

function createMonthSelect(): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'month-select';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Month';
  select.appendChild(defaultOption);

  MONTHS.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month;
    select.appendChild(option);
  });

  return select;
}

function createHiddenMonthSelect(): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'month-select';
  select.style.display = 'none';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  select.appendChild(defaultOption);

  return select;
}

function createYearSelect(): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'year-select';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Year';
  select.appendChild(defaultOption);

  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 50; year--) {
    const option = document.createElement('option');
    option.value = year.toString();
    option.textContent = year.toString();
    select.appendChild(option);
  }

  return select;
}

export function getDateRangeValue(elements: DatePickerElements): string {
  const { startMonth, startYear, endMonth, endYear, presentCheckbox } = elements;

  const start = formatDate(startMonth.value, startYear.value);
  const end = presentCheckbox.checked ? 'Present' : formatDate(endMonth.value, endYear.value);

  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;

  return `${start} - ${end}`;
}

export function setDateRangeValue(elements: DatePickerElements, value: string): void {
  const { startMonth, startYear, endMonth, endYear, presentCheckbox } = elements;

  // Reset all fields
  startMonth.value = '';
  startYear.value = '';
  endMonth.value = '';
  endYear.value = '';
  presentCheckbox.checked = false;
  endMonth.disabled = false;
  endYear.disabled = false;
  const endDateContainer = elements.container.querySelector('.end-date-container');
  if (endDateContainer) {
    endDateContainer.setAttribute('style', 'display: flex; gap: 5px; opacity: 1;');
  }

  if (!value.trim()) return;

  const parts = value.split('-').map(p => p.trim());

  if (parts.length >= 1 && parts[0]) {
    const [sMonth, sYear] = parseDate(parts[0]);
    if (sMonth) startMonth.value = sMonth;
    if (sYear) startYear.value = sYear;
  }

  if (parts.length >= 2 && parts[1]) {
    if (parts[1].toLowerCase() === 'present') {
      presentCheckbox.checked = true;
      endMonth.disabled = true;
      endYear.disabled = true;
      if (endDateContainer) {
        endDateContainer.setAttribute('style', 'display: flex; gap: 5px; opacity: 0.5;');
      }
    } else {
      const [eMonth, eYear] = parseDate(parts[1]);
      if (eMonth) endMonth.value = eMonth;
      if (eYear) endYear.value = eYear;
    }
  }
}

function formatDate(month: string, year: string): string {
  if (!month && !year) return '';
  if (!month) return year;
  if (!year) return month;
  return `${month} ${year}`;
}

function parseDate(dateStr: string): [string, string] {
  const parts = dateStr.trim().split(/\s+/).filter(p => p.length > 0);

  if (parts.length === 0) return ['', ''];

  const firstPart = parts[0];
  if (!firstPart) return ['', ''];

  if (parts.length === 1) {
    // Could be just a year like "2020" or just a month
    const isYear = /^\d{4}$/.test(firstPart);
    return isYear ? ['', firstPart] : [firstPart, ''];
  }

  const secondPart = parts[1] ?? '';

  // Format: "Month Year" or "Year Month"
  const isFirstYear = /^\d{4}$/.test(firstPart);
  if (isFirstYear) {
    return [secondPart, firstPart];
  }
  return [firstPart, secondPart];
}
