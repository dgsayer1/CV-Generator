import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDatePicker,
  getDateRangeValue,
  setDateRangeValue,
  type DatePickerElements
} from '../../src/datePicker';

describe('createDatePicker', () => {
  it('creates date picker with correct structure', () => {
    const picker = createDatePicker('Test Label');

    expect(picker.container).toBeInstanceOf(HTMLElement);
    expect(picker.startMonth).toBeInstanceOf(HTMLSelectElement);
    expect(picker.startYear).toBeInstanceOf(HTMLSelectElement);
    expect(picker.endMonth).toBeInstanceOf(HTMLSelectElement);
    expect(picker.endYear).toBeInstanceOf(HTMLSelectElement);
    expect(picker.presentCheckbox).toBeInstanceOf(HTMLInputElement);
  });

  it('creates label with correct text', () => {
    const picker = createDatePicker('My Label');
    const label = picker.container.querySelector('label');

    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('My Label');
  });

  it('creates month selects with 12 months plus default option', () => {
    const picker = createDatePicker('Dates');

    expect(picker.startMonth.options.length).toBe(13); // 1 default + 12 months
    expect(picker.endMonth.options.length).toBe(13);
    expect(picker.startMonth.options[0].value).toBe('');
    expect(picker.startMonth.options[1].value).toBe('Jan');
    expect(picker.startMonth.options[12].value).toBe('Dec');
  });

  it('creates year selects with years plus default option', () => {
    const picker = createDatePicker('Dates');
    const currentYear = new Date().getFullYear();

    expect(picker.startYear.options.length).toBeGreaterThanOrEqual(51); // 1 default + at least 50 years
    expect(picker.endYear.options.length).toBeGreaterThanOrEqual(51);
    expect(picker.startYear.options[0].value).toBe('');
    expect(picker.startYear.options[1].value).toBe(currentYear.toString());
  });

  it('creates present checkbox', () => {
    const picker = createDatePicker('Dates');

    expect(picker.presentCheckbox.type).toBe('checkbox');
    expect(picker.presentCheckbox.checked).toBe(false);
  });

  it('disables end date fields when present is checked', () => {
    const picker = createDatePicker('Dates');

    picker.presentCheckbox.checked = true;
    picker.presentCheckbox.dispatchEvent(new Event('change'));

    expect(picker.endMonth.disabled).toBe(true);
    expect(picker.endYear.disabled).toBe(true);
    expect(picker.endMonth.value).toBe('');
    expect(picker.endYear.value).toBe('');
  });

  it('enables end date fields when present is unchecked', () => {
    const picker = createDatePicker('Dates');

    picker.presentCheckbox.checked = true;
    picker.presentCheckbox.dispatchEvent(new Event('change'));
    picker.presentCheckbox.checked = false;
    picker.presentCheckbox.dispatchEvent(new Event('change'));

    expect(picker.endMonth.disabled).toBe(false);
    expect(picker.endYear.disabled).toBe(false);
  });
});

describe('getDateRangeValue', () => {
  let picker: DatePickerElements;

  beforeEach(() => {
    picker = createDatePicker('Dates');
  });

  it('returns empty string when no dates selected', () => {
    const value = getDateRangeValue(picker);
    expect(value).toBe('');
  });

  it('returns formatted date with month and year', () => {
    picker.startMonth.value = 'Jan';
    picker.startYear.value = '2020';
    picker.endMonth.value = 'Dec';
    picker.endYear.value = '2023';

    const value = getDateRangeValue(picker);
    expect(value).toBe('Jan 2020 - Dec 2023');
  });

  it('returns "Present" as end date when checkbox is checked', () => {
    picker.startMonth.value = 'Jan';
    picker.startYear.value = '2020';
    picker.presentCheckbox.checked = true;

    const value = getDateRangeValue(picker);
    expect(value).toBe('Jan 2020 - Present');
  });

  it('returns only start date when end date is empty', () => {
    picker.startMonth.value = 'Jan';
    picker.startYear.value = '2020';

    const value = getDateRangeValue(picker);
    expect(value).toBe('Jan 2020');
  });

  it('returns only end date when start date is empty', () => {
    picker.endMonth.value = 'Dec';
    picker.endYear.value = '2023';

    const value = getDateRangeValue(picker);
    expect(value).toBe('Dec 2023');
  });

  it('handles only year without month', () => {
    picker.startYear.value = '2020';
    picker.endYear.value = '2023';

    const value = getDateRangeValue(picker);
    expect(value).toBe('2020 - 2023');
  });

  it('handles only month without year', () => {
    picker.startMonth.value = 'Jan';
    picker.endMonth.value = 'Dec';

    const value = getDateRangeValue(picker);
    expect(value).toBe('Jan - Dec');
  });

  it('handles mixed date formats', () => {
    picker.startMonth.value = 'Jan';
    picker.startYear.value = '2020';
    picker.endYear.value = '2023';

    const value = getDateRangeValue(picker);
    expect(value).toBe('Jan 2020 - 2023');
  });
});

describe('setDateRangeValue', () => {
  let picker: DatePickerElements;

  beforeEach(() => {
    picker = createDatePicker('Dates');
  });

  it('sets empty values for empty string input', () => {
    setDateRangeValue(picker, '');

    expect(picker.startMonth.value).toBe('');
    expect(picker.startYear.value).toBe('');
    expect(picker.endMonth.value).toBe('');
    expect(picker.endYear.value).toBe('');
    expect(picker.presentCheckbox.checked).toBe(false);
  });

  it('parses full date range with months and years', () => {
    setDateRangeValue(picker, 'Jan 2020 - Dec 2023');

    expect(picker.startMonth.value).toBe('Jan');
    expect(picker.startYear.value).toBe('2020');
    expect(picker.endMonth.value).toBe('Dec');
    expect(picker.endYear.value).toBe('2023');
    expect(picker.presentCheckbox.checked).toBe(false);
  });

  it('parses date range with "Present" as end date', () => {
    setDateRangeValue(picker, '2025 - Present');

    expect(picker.startYear.value).toBe('2025');
    expect(picker.presentCheckbox.checked).toBe(true);
    expect(picker.endMonth.disabled).toBe(true);
    expect(picker.endYear.disabled).toBe(true);
  });

  it('parses "Present" with case insensitivity', () => {
    setDateRangeValue(picker, 'Jan 2020 - present');

    expect(picker.startMonth.value).toBe('Jan');
    expect(picker.startYear.value).toBe('2020');
    expect(picker.presentCheckbox.checked).toBe(true);
  });

  it('parses only start date without end date', () => {
    setDateRangeValue(picker, 'Jan 2020');

    expect(picker.startMonth.value).toBe('Jan');
    expect(picker.startYear.value).toBe('2020');
    expect(picker.endMonth.value).toBe('');
    expect(picker.endYear.value).toBe('');
  });

  it('parses year-only dates', () => {
    setDateRangeValue(picker, '2020 - 2023');

    expect(picker.startMonth.value).toBe('');
    expect(picker.startYear.value).toBe('2020');
    expect(picker.endMonth.value).toBe('');
    expect(picker.endYear.value).toBe('2023');
  });

  it('parses month-only dates', () => {
    setDateRangeValue(picker, 'Jan - Dec');

    expect(picker.startMonth.value).toBe('Jan');
    expect(picker.startYear.value).toBe('');
    expect(picker.endMonth.value).toBe('Dec');
    expect(picker.endYear.value).toBe('');
  });

  it('handles year-first format', () => {
    setDateRangeValue(picker, '2020 Jan - 2023 Dec');

    expect(picker.startMonth.value).toBe('Jan');
    expect(picker.startYear.value).toBe('2020');
    expect(picker.endMonth.value).toBe('Dec');
    expect(picker.endYear.value).toBe('2023');
  });

  it('resets disabled state when setting new value', () => {
    picker.presentCheckbox.checked = true;
    picker.endMonth.disabled = true;
    picker.endYear.disabled = true;

    setDateRangeValue(picker, 'Jan 2020 - Dec 2023');

    expect(picker.presentCheckbox.checked).toBe(false);
    expect(picker.endMonth.disabled).toBe(false);
    expect(picker.endYear.disabled).toBe(false);
  });

  it('handles whitespace in input', () => {
    setDateRangeValue(picker, '  Jan 2020  -  Dec 2023  ');

    expect(picker.startMonth.value).toBe('Jan');
    expect(picker.startYear.value).toBe('2020');
    expect(picker.endMonth.value).toBe('Dec');
    expect(picker.endYear.value).toBe('2023');
  });
});

describe('date picker integration', () => {
  it('supports round-trip get and set operations', () => {
    const picker = createDatePicker('Dates');

    setDateRangeValue(picker, 'Jan 2020 - Dec 2023');
    const value1 = getDateRangeValue(picker);
    expect(value1).toBe('Jan 2020 - Dec 2023');

    setDateRangeValue(picker, '2025 - Present');
    const value2 = getDateRangeValue(picker);
    expect(value2).toBe('2025 - Present');
  });

  it('maintains state across user interactions', () => {
    const picker = createDatePicker('Dates');

    picker.startMonth.value = 'Mar';
    picker.startYear.value = '2021';
    picker.endMonth.value = 'Sep';
    picker.endYear.value = '2024';

    let value = getDateRangeValue(picker);
    expect(value).toBe('Mar 2021 - Sep 2024');

    picker.presentCheckbox.checked = true;
    picker.presentCheckbox.dispatchEvent(new Event('change'));

    value = getDateRangeValue(picker);
    expect(value).toBe('Mar 2021 - Present');
  });
});
