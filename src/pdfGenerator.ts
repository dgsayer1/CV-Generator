import { jsPDF } from 'jspdf';
import type { CVData } from './types';

type RGB = [number, number, number];

const COLORS = {
  textDark: [45, 55, 72] as RGB,
  textGrey: [102, 102, 102] as RGB,
  lightGrey: [85, 85, 85] as RGB,
  italicGrey: [136, 136, 136] as RGB,
};

function hexToRgb(hex: string): RGB {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  return [r, g, b];
}

export function generatePDF(data: CVData): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const themeColor = hexToRgb(data.themeColor);
    const fontFamily = data.fontFamily;

    renderHeader(doc, data, themeColor, fontFamily);
    let y = renderSummary(doc, data, 52, themeColor, fontFamily);
    y = renderSkills(doc, data, y + 10, themeColor, fontFamily);
    y = renderWorkExperience(doc, data, y + 5, themeColor, fontFamily);
    y = renderEducationAndCertifications(doc, data, y, themeColor, fontFamily);
    renderReferences(doc, data, y, fontFamily);

    const filename = `${data.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
    doc.save(filename);

    displayStatus(`PDF downloaded as ${filename}`, true);
  } catch (error) {
    displayStatus('Error generating PDF. Please check your inputs and try again.', false);
    console.error('PDF generation error:', error);
  }
}

function renderHeader(doc: jsPDF, data: CVData, themeColor: RGB, fontFamily: string): void {
  const { name, title, phone, email, location } = data.personal;

  doc.setFillColor(...themeColor);
  doc.rect(0, 0, 210, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(fontFamily, 'bold');
  doc.text(name, 105, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont(fontFamily, 'normal');
  doc.text(title.toUpperCase(), 105, 26, { align: 'center' });

  // Contact info
  doc.setFontSize(9);
  doc.text(`${phone}  |  ${email}  |  ${location}`, 105, 35, { align: 'center' });
}

function renderSummary(doc: jsPDF, data: CVData, y: number, _themeColor: RGB, fontFamily: string): number {
  // Draw box background
  doc.setFont(fontFamily, 'normal');
  const summaryLines = doc.splitTextToSize(data.personal.summary, 170);
  const boxHeight = 10 + (summaryLines.length * 4);

  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, y, 180, boxHeight, 2, 2, 'FD');

  // Render text
  doc.setTextColor(...COLORS.textDark);
  doc.setFontSize(9);
  doc.text(summaryLines, 20, y + 6);

  return y + boxHeight + 8;
}

function renderSkills(doc: jsPDF, data: CVData, y: number, themeColor: RGB, fontFamily: string): number {
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.textDark);
  doc.text('Skills & Expertise', 15, y);
  doc.setDrawColor(...themeColor);
  doc.setLineWidth(0.5);
  doc.line(15, y + 1.5, 195, y + 1.5);

  y += 9;

  // Convert skills object to array format
  const skills = Object.entries(data.skills)
    .filter(([_, items]) => items && items.length > 0)
    .map(([category, items]) => ({ cat: category, items }));

  // Two-column grid layout
  const boxWidth = 87;
  const boxPadding = 4;
  const colX = [15, 108];
  const colY = [y, y];

  skills.forEach((skill, idx) => {
    if (skill.items && skill.items.length > 0) {
      const col = idx % 2;
      const x = colX[col] ?? 15;
      let cy = colY[col] ?? y;

      // Calculate actual rows needed by simulating the layout
      doc.setFontSize(8);
      doc.setFont(fontFamily, 'normal');
      let rowCount = 1;
      let simulatedRowWidth = 0;
      const maxRowWidthForCalc = boxWidth - (boxPadding * 2);

      skill.items.forEach((item, itemIdx) => {
        const textWidth = doc.getTextWidth(item);
        const pillWidth = textWidth + 4 + 2; // pill width + gap

        if (simulatedRowWidth + pillWidth > maxRowWidthForCalc && itemIdx > 0) {
          rowCount++;
          simulatedRowWidth = pillWidth;
        } else {
          simulatedRowWidth += pillWidth;
        }
      });

      const boxHeight = 12 + (rowCount * 6);

      // Draw box background
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, cy, boxWidth, boxHeight, 2, 2, 'FD');

      // Render category name
      doc.setFontSize(10);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...COLORS.textDark);
      doc.text(skill.cat, x + boxPadding, cy + 6);

      // Draw underline
      doc.setDrawColor(...themeColor);
      doc.setLineWidth(0.5);
      doc.line(x + boxPadding, cy + 7.5, x + boxWidth - boxPadding, cy + 7.5);

      // Render skill pills in rows
      let px = x + boxPadding;
      let py = cy + 13;
      let currentRowWidth = 0;
      const maxRowWidth = boxWidth - (boxPadding * 2);

      doc.setFontSize(8);
      doc.setFont(fontFamily, 'normal');

      skill.items.forEach((item, itemIdx) => {
        const textWidth = doc.getTextWidth(item);
        const pillWidth = textWidth + 4;

        // Check if we need to wrap to next row
        if (currentRowWidth + pillWidth > maxRowWidth && itemIdx > 0) {
          px = x + boxPadding;
          py += 6;
          currentRowWidth = 0;
        }

        // Draw pill background
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.2);
        doc.roundedRect(px, py - 3.5, pillWidth, 4.5, 1, 1, 'FD');

        // Draw text
        doc.setTextColor(...COLORS.textDark);
        doc.text(item, px + 2, py);

        px += pillWidth + 2;
        currentRowWidth += pillWidth + 2;
      });

      colY[col] = cy + boxHeight + 5;
    }
  });

  return Math.max(...colY);
}

function renderWorkExperience(doc: jsPDF, data: CVData, y: number, themeColor: RGB, fontFamily: string): number {
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.textDark);
  doc.text('Work Experience', 15, y);
  doc.setDrawColor(...themeColor);
  doc.setLineWidth(0.5);
  doc.line(15, y + 1.5, 195, y + 1.5);

  y += 9;

  data.jobs.forEach((job) => {
    if (y > 235) {
      doc.addPage();
      y = 20;
    }

    // Calculate box height
    let contentHeight = 18;
    doc.setFontSize(8.5); // Set font size before calculating
    job.responsibilities.forEach((resp) => {
      const respLines = doc.splitTextToSize('• ' + resp, 155);
      contentHeight += respLines.length * 3.8;
    });

    // Draw box background
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, y, 180, contentHeight, 2, 2, 'FD');

    // Job title and dates
    doc.setFontSize(10.5);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...COLORS.textDark);
    const titleLines = doc.splitTextToSize(job.title, 135);
    doc.text(titleLines[0], 20, y + 6);

    // Date badge
    doc.setFontSize(9);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...themeColor);
    const dateText = job.dates;
    const dateWidth = doc.getTextWidth(dateText) + 6;
    const dateX = 190 - dateWidth;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...themeColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(dateX, y + 2.5, dateWidth, 5.5, 1.5, 1.5, 'FD');
    doc.text(dateText, dateX + 3, y + 6.5);

    // Company and location
    doc.setTextColor(...COLORS.textGrey);
    doc.setFontSize(9);
    const companyLines = doc.splitTextToSize(`${job.company} | ${job.location}`, 155);
    doc.text(companyLines[0], 20, y + 11);

    // Responsibilities
    let respY = y + 16;
    doc.setTextColor(...COLORS.textDark);
    doc.setFontSize(8.5);

    job.responsibilities.forEach((resp) => {
      const respLines = doc.splitTextToSize('• ' + resp, 155);
      doc.text(respLines, 22, respY);
      respY += respLines.length * 3.8;
    });

    y += contentHeight + 5;
  });

  return y;
}

function renderEducationAndCertifications(doc: jsPDF, data: CVData, y: number, themeColor: RGB, fontFamily: string): number {
  if (y > 180) {
    doc.addPage();
    y = 20;
  }

  const colWidth = 87;
  const leftX = 15;
  const rightX = 108;
  let leftY = y;
  let rightY = y;

  // Education (Left Column)
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.textDark);
  doc.text('Education', leftX, leftY);
  doc.setDrawColor(...themeColor);
  doc.setLineWidth(0.5);
  doc.line(leftX, leftY + 1.5, leftX + colWidth, leftY + 1.5);

  leftY += 9;

  data.education.forEach((edu) => {
    // Calculate degree title height
    doc.setFontSize(9);
    const degreeLines = doc.splitTextToSize(edu.degree, colWidth - 30); // Reserve space for date badge
    const titleHeight = degreeLines.length * 4;
    const boxHeight = Math.max(14, 8 + titleHeight + 6); // Minimum 14mm, or calculated height

    // Draw box
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(leftX, leftY, colWidth, boxHeight, 2, 2, 'FD');

    // Degree (multi-line support)
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...COLORS.textDark);
    doc.text(degreeLines, leftX + 4, leftY + 5);

    // Years badge (positioned at top right)
    if (edu.years) {
      doc.setFontSize(8);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...themeColor);
      const yearText = edu.years;
      const yearWidth = doc.getTextWidth(yearText) + 4;
      const yearX = leftX + colWidth - yearWidth - 4;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...themeColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(yearX, leftY + 2, yearWidth, 5, 1.5, 1.5, 'FD');
      doc.text(yearText, yearX + 2, leftY + 5.5);
    }

    // Institution (positioned below degree title)
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...COLORS.textGrey);
    doc.setFontSize(8);
    const instY = leftY + 5 + titleHeight + 1;
    const instLines = doc.splitTextToSize(edu.institution, colWidth - 10);
    doc.text(instLines[0], leftX + 4, instY);

    leftY += boxHeight + 3;
  });

  // Certifications (Right Column)
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.textDark);
  doc.text('Certifications', rightX, rightY);
  doc.setDrawColor(...themeColor);
  doc.setLineWidth(0.5);
  doc.line(rightX, rightY + 1.5, rightX + colWidth, rightY + 1.5);

  rightY += 9;

  data.certifications.forEach((cert) => {
    // Draw box
    const certLines = doc.splitTextToSize(cert, colWidth - 10);
    const boxHeight = 4 + (certLines.length * 4);

    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(rightX, rightY, colWidth, boxHeight, 2, 2, 'FD');

    // Text
    doc.setFontSize(8);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...COLORS.textDark);
    doc.text(certLines, rightX + 4, rightY + 4);

    rightY += boxHeight + 3;
  });

  return Math.max(leftY, rightY) + 5;
}

function renderReferences(doc: jsPDF, data: CVData, y: number, fontFamily: string): void {
  y += 10;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...COLORS.textDark);
  doc.text('References', 15, y);
  doc.line(15, y + 1.5, 195, y + 1.5);

  y += 9;

  const ref1 = data.references[0];
  const ref2 = data.references[1];
  const boxWidth = 87;

  if (ref1?.name) {
    // Draw box
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, y, boxWidth, 16, 2, 2, 'FD');

    // Name
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...COLORS.textDark);
    doc.text(ref1.name, 20, y + 6);

    // Title and Company
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...COLORS.textGrey);
    doc.setFontSize(8.5);
    const titleCompany = ref1.company ? `${ref1.title}, ${ref1.company}` : ref1.title;
    doc.text(titleCompany, 20, y + 10);

    // Contact note
    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.italicGrey);
    doc.text('Contact details can be provided upon request', 20, y + 14);
  }

  if (ref2?.name) {
    // Draw box
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(108, y, boxWidth, 16, 2, 2, 'FD');

    // Name
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...COLORS.textDark);
    doc.text(ref2.name, 113, y + 6);

    // Title and Company
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...COLORS.textGrey);
    doc.setFontSize(8.5);
    const titleCompany = ref2.company ? `${ref2.title}, ${ref2.company}` : ref2.title;
    doc.text(titleCompany, 113, y + 10);

    // Contact note
    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.italicGrey);
    doc.text('Contact details can be provided upon request', 113, y + 14);
  }
}

function displayStatus(message: string, success: boolean): void {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = success ? `✓ ${message}` : `✗ ${message}`;
  }
}
