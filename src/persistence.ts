import type { CVData, CVStyle } from './types';

const STORAGE_KEY = 'cv-generator-data';
const CURRENT_VERSION = '1.0';

interface PersistedData {
  version: string;
  selectedStyle: CVStyle;
  cvData: CVData;
}

export function saveData(cvData: CVData, selectedStyle: CVStyle): void {
  try {
    const data: PersistedData = {
      version: CURRENT_VERSION,
      selectedStyle,
      cvData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
}

export function loadData(): { cvData: CVData; selectedStyle: CVStyle } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: PersistedData = JSON.parse(stored);

    if (data.version !== CURRENT_VERSION) {
      console.warn('Data version mismatch. Clearing old data.');
      clearData();
      return null;
    }

    return {
      cvData: data.cvData,
      selectedStyle: data.selectedStyle
    };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    clearData();
    return null;
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
