import { jsPDF } from 'jspdf';
import type { CVData } from './types';
import { getStyleConfig, type StyleConfig } from './styles/styleConfig';

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  return [r, g, b];
}

function getAccentColor(config: StyleConfig, themeColor: RGB): RGB {
  // Use style-specific accent color if defined, otherwise use theme color
  return config.colors.headerBackground ?? themeColor;
}

function fadeColor(color: RGB, fadeFactor: number = 0.9): RGB {
  // Mix color with white by the fade factor (0.9 = 90% white, 10% color)
  // Result is a very light, faded version of the original color
  const [r, g, b] = color;
  const fadedR = Math.round(r + (255 - r) * fadeFactor);
  const fadedG = Math.round(g + (255 - g) * fadeFactor);
  const fadedB = Math.round(b + (255 - b) * fadeFactor);
  return [fadedR, fadedG, fadedB];
}

function getBoxBackground(config: StyleConfig, themeColor: RGB): RGB {
  // Use config color if defined, otherwise generate faded theme color
  return config.colors.boxBackground ?? fadeColor(themeColor, 0.95);
}

function getBoxBorder(config: StyleConfig, themeColor: RGB): RGB {
  // Use config color if defined, otherwise generate faded theme color
  return config.colors.boxBorder ?? fadeColor(themeColor, 0.7);
}

function getPillBorder(config: StyleConfig, themeColor: RGB): RGB {
  // Use config color if defined, otherwise generate faded theme color
  return config.colors.pillBorder ?? fadeColor(themeColor, 0.6);
}

export function createPDFDocument(data: CVData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const config = getStyleConfig(data.cvStyle);
  const themeColor = hexToRgb(data.themeColor);
  const fontFamily = data.fontFamily;

  // Check if this is a sidebar layout (tech style)
  const isSidebarLayout = config.layout.sidebarWidth !== undefined;

  if (isSidebarLayout) {
    renderSidebarLayout(doc, data, themeColor, fontFamily, config);
  } else {
    renderHeader(doc, data, themeColor, fontFamily, config);
    let y = renderSummary(doc, data, config.layout.summaryTopMargin, fontFamily, config, themeColor);
    y = renderSkills(doc, data, y + config.layout.skillsSpacing, themeColor, fontFamily, config);
    y = renderWorkExperience(doc, data, y + config.layout.workExperienceSpacing, themeColor, fontFamily, config);
    y = renderEducationAndCertifications(doc, data, y, themeColor, fontFamily, config);
    renderReferences(doc, data, y, fontFamily, config, themeColor);
  }

  return doc;
}

export function generatePDF(data: CVData): void {
  try {
    const doc = createPDFDocument(data);
    const filename = `${data.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
    doc.save(filename);

    displayStatus(`PDF downloaded as ${filename}`, true);
  } catch (error) {
    displayStatus('Error generating PDF. Please check your inputs and try again.', false);
    console.error('PDF generation error:', error);
  }
}

function renderHeader(doc: jsPDF, data: CVData, themeColor: RGB, fontFamily: string, config: StyleConfig): void {
  const { name, title, phone, email, location } = data.personal;

  if (config.visual.useColoredHeader) {
    // Colored header background - use style-specific color if defined, otherwise use theme color
    const headerColor = config.colors.headerBackground ?? themeColor;
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, 210, config.layout.headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
  } else {
    // White background with dark text (minimalist)
    doc.setTextColor(...config.colors.textDark);
  }

  doc.setFontSize(config.typography.nameSize);
  doc.setFont(fontFamily, 'bold');
  doc.text(name, 105, 18, { align: 'center' });

  doc.setFontSize(config.typography.headerTitleSize);
  doc.setFont(fontFamily, 'normal');
  doc.text(title.toUpperCase(), 105, 26, { align: 'center' });

  // Contact info
  doc.setFontSize(config.typography.headerContactSize);
  if (config.visual.useColoredHeader) {
    doc.text(`${phone}  |  ${email}  |  ${location}`, 105, 35, { align: 'center' });
  } else {
    // Minimalist: Add a simple line separator instead of colored box
    doc.text(`${phone}  |  ${email}  |  ${location}`, 105, 35, { align: 'center' });
    const accentColor = getAccentColor(config, themeColor);
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(config.visual.thickLineWidth);
    doc.line(config.layout.pageMargins, config.layout.headerHeight - 2, 210 - config.layout.pageMargins, config.layout.headerHeight - 2);
  }
}

function renderSummary(doc: jsPDF, data: CVData, y: number, fontFamily: string, config: StyleConfig, themeColor: RGB): number {
  // Professional style: Add section title and no box, no line
  if (config.visual.badgeStyle === 'filled') {
    doc.setFontSize(config.typography.sectionTitleSize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text('Professional Summary', config.layout.pageMargins, y);

    y += config.layout.sectionSpacing;

    doc.setFont(fontFamily, 'normal');
    const summaryLines = doc.splitTextToSize(data.personal.summary, 170);
    doc.setTextColor(...config.colors.textDark);
    doc.setFontSize(config.typography.bodySize);
    doc.text(summaryLines, config.layout.pageMargins, y);

    return y + (summaryLines.length * 4) + 8;
  }

  // Modern/Minimalist style: Add section title with box and background
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('Professional Summary', config.layout.pageMargins, y);
  const accentColor = getAccentColor(config, themeColor);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(config.visual.thickLineWidth);
  doc.line(config.layout.pageMargins, y + 1.5, 195, y + 1.5);

  y += config.layout.sectionSpacing;

  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(config.typography.bodySize);
  const summaryMaxWidth = 170;
  const summaryLines = doc.splitTextToSize(data.personal.summary, summaryMaxWidth);
  const boxHeight = 10 + (summaryLines.length * 4);

  doc.setFillColor(...getBoxBackground(config, themeColor));
  doc.setDrawColor(...getBoxBorder(config, themeColor));
  doc.setLineWidth(config.visual.thinLineWidth);
  doc.roundedRect(config.layout.pageMargins, y, 180, boxHeight, config.visual.borderRadius, config.visual.borderRadius, 'FD');

  doc.setTextColor(...config.colors.textDark);
  doc.text(data.personal.summary, config.layout.pageMargins + 3, y + 6, {
    maxWidth: summaryMaxWidth,
    align: 'justify'
  });

  return y + boxHeight + 8;
}

function renderSkills(doc: jsPDF, data: CVData, y: number, themeColor: RGB, fontFamily: string, config: StyleConfig): number {
  const accentColor = getAccentColor(config, themeColor);
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('Skills & Expertise', config.layout.pageMargins, y);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(config.visual.thickLineWidth);
  doc.line(config.layout.pageMargins, y + 1.5, 195, y + 1.5);

  y += config.layout.sectionSpacing;

  // Convert skills object to array format
  const skills = Object.entries(data.skills)
    .filter(([_, items]) => items && items.length > 0)
    .map(([category, items]) => ({ cat: category, items }));

  // Professional style: Two-column bullet list format
  if (config.visual.badgeStyle === 'filled') {
    const colX = [config.layout.pageMargins, 108];
    const colY = [y, y];

    skills.forEach((skill, idx) => {
      if (skill.items && skill.items.length > 0) {
        const col = idx % 2;
        const x = colX[col] ?? config.layout.pageMargins;
        let cy = colY[col] ?? y;

        // Render category name
        doc.setFontSize(config.typography.headerTitleSize);
        doc.setFont(fontFamily, 'bold');
        doc.setTextColor(...config.colors.textDark);
        doc.text(skill.cat, x, cy);

        cy += 6;

        // Render bullet points
        doc.setFontSize(config.typography.bodySize);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(...config.colors.textDark);

        skill.items.forEach((item) => {
          doc.text(`• ${item}`, x + 3, cy);
          cy += 5;
        });

        cy += 3; // Extra spacing between categories
        colY[col] = cy;
      }
    });

    return Math.max(...colY);
  }

  // Modern/Minimalist style: Two-column grid layout with boxes
  const boxWidth = 87;
  const boxPadding = config.layout.boxPadding;
  const colX = [config.layout.pageMargins, 108];
  const colY = [y, y];

  skills.forEach((skill, idx) => {
    if (skill.items && skill.items.length > 0) {
      const col = idx % 2;
      const x = colX[col] ?? config.layout.pageMargins;
      let cy = colY[col] ?? y;

      // Calculate actual rows needed by simulating the layout
      doc.setFontSize(config.typography.smallSize);
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
      doc.setFillColor(...getBoxBackground(config, themeColor));
      doc.setDrawColor(...getBoxBorder(config, themeColor));
      doc.setLineWidth(config.visual.thinLineWidth);
      doc.roundedRect(x, cy, boxWidth, boxHeight, config.visual.borderRadius, config.visual.borderRadius, 'FD');

      // Render category name
      doc.setFontSize(config.typography.headerTitleSize);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...config.colors.textDark);
      doc.text(skill.cat, x + boxPadding, cy + 6);

      // Draw underline
      const accentColor = getAccentColor(config, themeColor);
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(config.visual.thickLineWidth);
      doc.line(x + boxPadding, cy + 7.5, x + boxWidth - boxPadding, cy + 7.5);

      // Render skill pills in rows
      let px = x + boxPadding;
      let py = cy + 13;
      let currentRowWidth = 0;
      const maxRowWidth = boxWidth - (boxPadding * 2);

      doc.setFontSize(config.typography.smallSize);
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
        doc.setFillColor(...config.colors.pillBackground);
        doc.setDrawColor(...getPillBorder(config, themeColor));
        doc.setLineWidth(0.2);
        doc.roundedRect(px, py - 3.5, pillWidth, 4.5, config.visual.pillBorderRadius, config.visual.pillBorderRadius, 'FD');

        // Draw text
        doc.setTextColor(...config.colors.textDark);
        doc.text(item, px + 2, py);

        px += pillWidth + 2;
        currentRowWidth += pillWidth + 2;
      });

      colY[col] = cy + boxHeight + config.layout.boxSpacing;
    }
  });

  return Math.max(...colY);
}

function renderWorkExperience(doc: jsPDF, data: CVData, y: number, themeColor: RGB, fontFamily: string, config: StyleConfig): number {
  const accentColor = getAccentColor(config, themeColor);
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('Work Experience', config.layout.pageMargins, y);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(config.visual.thickLineWidth);
  doc.line(config.layout.pageMargins, y + 1.5, 195, y + 1.5);

  y += config.layout.sectionSpacing;

  data.jobs.forEach((job) => {
    if (y > 235) {
      doc.addPage();
      y = 20;
    }

    // Professional style: No boxes, no date badges
    if (config.visual.badgeStyle === 'filled') {
      // Job title
      doc.setFontSize(config.typography.jobTitleSize);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...config.colors.textDark);
      const titleLines = doc.splitTextToSize(job.title, 170);
      doc.text(titleLines[0], config.layout.pageMargins, y);

      // Company, location, and dates (inline)
      doc.setTextColor(...config.colors.textGrey);
      doc.setFontSize(config.typography.bodySize);
      doc.setFont(fontFamily, 'normal');
      const companyText = `${job.company} | ${job.location} | ${job.dates}`;
      doc.text(companyText, config.layout.pageMargins, y + 5);

      // Responsibilities
      let respY = y + 10;
      doc.setTextColor(...config.colors.textDark);
      doc.setFontSize(config.typography.responsibilitySize);

      job.responsibilities.forEach((resp) => {
        const respLines = doc.splitTextToSize('• ' + resp, 170);
        doc.text(respLines, config.layout.pageMargins + 2, respY);
        respY += respLines.length * 3.8;
      });

      y = respY + 6; // Spacing between jobs
      return;
    }

    // Modern/Minimalist style: Boxes with date badges
    // Calculate box height
    let contentHeight = 18;
    doc.setFontSize(config.typography.responsibilitySize); // Set font size before calculating
    job.responsibilities.forEach((resp) => {
      const respLines = doc.splitTextToSize('• ' + resp, 155);
      contentHeight += respLines.length * 3.8;
    });

    // Draw box background
    doc.setFillColor(...getBoxBackground(config, themeColor));
    doc.setDrawColor(...getBoxBorder(config, themeColor));
    doc.setLineWidth(config.visual.thinLineWidth);
    doc.roundedRect(config.layout.pageMargins, y, 180, contentHeight, config.visual.borderRadius, config.visual.borderRadius, 'FD');

    // Job title and dates
    doc.setFontSize(config.typography.jobTitleSize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    const titleLines = doc.splitTextToSize(job.title, 135);
    doc.text(titleLines[0], 20, y + 6);

    // Date badge
    const accentColor = getAccentColor(config, themeColor);
    doc.setFontSize(config.typography.badgeSize);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...accentColor);
    const dateText = job.dates;
    const dateWidth = doc.getTextWidth(dateText) + 6;
    const dateX = 190 - dateWidth;

    // Outlined badge (minimalist/modern)
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(config.visual.thinLineWidth);
    doc.roundedRect(dateX, y + 2.5, dateWidth, 5.5, config.visual.badgeBorderRadius, config.visual.badgeBorderRadius, 'S');
    doc.text(dateText, dateX + 3, y + 6.5);

    // Company and location
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.bodySize);
    const companyLines = doc.splitTextToSize(`${job.company} | ${job.location}`, 155);
    doc.text(companyLines[0], 20, y + 11);

    // Responsibilities
    let respY = y + 16;
    doc.setTextColor(...config.colors.textDark);
    doc.setFontSize(config.typography.responsibilitySize);

    job.responsibilities.forEach((resp) => {
      const respLines = doc.splitTextToSize('• ' + resp, 155);
      doc.text(respLines, 22, respY);
      respY += respLines.length * 3.8;
    });

    y += contentHeight + config.layout.boxSpacing;
  });

  return y;
}

function renderEducationAndCertifications(doc: jsPDF, data: CVData, y: number, themeColor: RGB, fontFamily: string, config: StyleConfig): number {
  if (y > config.layout.educationPageThreshold) {
    doc.addPage();
    y = 20;
  }

  const colWidth = 87;
  const leftX = config.layout.pageMargins;
  const rightX = 108;
  let leftY = y;
  let rightY = y;

  // Education (Left Column)
  const accentColor = getAccentColor(config, themeColor);
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('Education', leftX, leftY);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(config.visual.thickLineWidth);
  doc.line(leftX, leftY + 1.5, leftX + colWidth, leftY + 1.5);

  leftY += config.layout.sectionSpacing;

  data.education.forEach((edu) => {
    // Professional style: No boxes, inline years
    if (config.visual.badgeStyle === 'filled') {
      doc.setFontSize(config.typography.bodySize);
      const degreeLines = doc.splitTextToSize(edu.degree, colWidth - 5);

      // Degree
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...config.colors.textDark);
      doc.text(degreeLines, leftX, leftY);

      leftY += degreeLines.length * 4 + 1;

      // Institution and years inline
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...config.colors.textGrey);
      doc.setFontSize(config.typography.smallSize);
      const instText = edu.years ? `${edu.institution} | ${edu.years}` : edu.institution;
      const instLines = doc.splitTextToSize(instText, colWidth - 5);
      doc.text(instLines[0], leftX, leftY);

      leftY += 7;
      return;
    }

    // Modern/Minimalist style: Boxes with badges
    // Calculate degree title height
    doc.setFontSize(config.typography.bodySize);
    const degreeLines = doc.splitTextToSize(edu.degree, colWidth - 30); // Reserve space for date badge
    const titleHeight = degreeLines.length * 4;
    const boxHeight = Math.max(14, 8 + titleHeight + 6); // Minimum 14mm, or calculated height

    // Draw box
    doc.setFillColor(...getBoxBackground(config, themeColor));
    doc.setDrawColor(...getBoxBorder(config, themeColor));
    doc.setLineWidth(config.visual.thinLineWidth);
    doc.roundedRect(leftX, leftY, colWidth, boxHeight, config.visual.borderRadius, config.visual.borderRadius, 'FD');

    // Degree (multi-line support)
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text(degreeLines, leftX + 4, leftY + 5);

    // Years badge (positioned at top right)
    if (edu.years) {
      const accentColor = getAccentColor(config, themeColor);
      doc.setFontSize(config.typography.smallSize);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...accentColor);
      const yearText = edu.years;
      const yearWidth = doc.getTextWidth(yearText) + 4;
      const yearX = leftX + colWidth - yearWidth - 4;

      // Outlined badge (minimalist/modern)
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(config.visual.thinLineWidth);
      doc.roundedRect(yearX, leftY + 2, yearWidth, 5, config.visual.badgeBorderRadius, config.visual.badgeBorderRadius, 'S');
      doc.text(yearText, yearX + 2, leftY + 5.5);
    }

    // Institution (positioned below degree title)
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.smallSize);
    const instY = leftY + 5 + titleHeight + 1;
    const instLines = doc.splitTextToSize(edu.institution, colWidth - 10);
    doc.text(instLines[0], leftX + 4, instY);

    leftY += boxHeight + 3;
  });

  // Certifications (Right Column)
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('Certifications', rightX, rightY);
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(config.visual.thickLineWidth);
  doc.line(rightX, rightY + 1.5, rightX + colWidth, rightY + 1.5);

  rightY += config.layout.sectionSpacing;

  data.certifications.forEach((cert) => {
    // Professional style: No boxes, bullet points
    if (config.visual.badgeStyle === 'filled') {
      const certLines = doc.splitTextToSize(`• ${cert}`, colWidth - 5);

      doc.setFontSize(config.typography.bodySize);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...config.colors.textDark);
      doc.text(certLines, rightX, rightY);

      rightY += certLines.length * 4 + 2;
      return;
    }

    // Modern/Minimalist style: Boxes
    const certLines = doc.splitTextToSize(cert, colWidth - 10);
    const boxHeight = 4 + (certLines.length * 4);

    doc.setFillColor(...getBoxBackground(config, themeColor));
    doc.setDrawColor(...getBoxBorder(config, themeColor));
    doc.setLineWidth(config.visual.thinLineWidth);
    doc.roundedRect(rightX, rightY, colWidth, boxHeight, config.visual.borderRadius, config.visual.borderRadius, 'FD');

    // Text
    doc.setFontSize(config.typography.smallSize);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textDark);
    doc.text(certLines, rightX + 4, rightY + 4);

    rightY += boxHeight + 3;
  });

  return Math.max(leftY, rightY) + config.layout.boxSpacing;
}

function renderReferences(doc: jsPDF, data: CVData, y: number, fontFamily: string, config: StyleConfig, themeColor: RGB): void {
  y += config.layout.referencesTopSpacing;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('References', config.layout.pageMargins, y);
  doc.line(config.layout.pageMargins, y + 1.5, 195, y + 1.5);

  y += config.layout.sectionSpacing;

  const ref1 = data.references[0];
  const ref2 = data.references[1];
  const boxWidth = 87;

  // Professional style: No boxes
  if (config.visual.badgeStyle === 'filled') {
    if (ref1?.name) {
      // Name
      doc.setFontSize(config.typography.headerTitleSize);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...config.colors.textDark);
      doc.text(ref1.name, config.layout.pageMargins, y);

      // Title and Company
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...config.colors.textGrey);
      doc.setFontSize(config.typography.responsibilitySize);
      const titleCompany = ref1.company ? `${ref1.title}, ${ref1.company}` : ref1.title;
      doc.text(titleCompany, config.layout.pageMargins, y + 4);

      // Contact note
      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(config.typography.tinySize);
      doc.setTextColor(...config.colors.italicGrey);
      doc.text('Contact details can be provided upon request', config.layout.pageMargins, y + 8);
    }

    if (ref2?.name) {
      // Name
      doc.setFontSize(config.typography.headerTitleSize);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...config.colors.textDark);
      doc.text(ref2.name, 108, y);

      // Title and Company
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...config.colors.textGrey);
      doc.setFontSize(config.typography.responsibilitySize);
      const titleCompany = ref2.company ? `${ref2.title}, ${ref2.company}` : ref2.title;
      doc.text(titleCompany, 108, y + 4);

      // Contact note
      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(config.typography.tinySize);
      doc.setTextColor(...config.colors.italicGrey);
      doc.text('Contact details can be provided upon request', 108, y + 8);
    }
    return;
  }

  // Modern/Minimalist style: Boxes
  if (ref1?.name) {
    // Draw box
    doc.setFillColor(...getBoxBackground(config, themeColor));
    doc.setDrawColor(...getBoxBorder(config, themeColor));
    doc.setLineWidth(config.visual.thinLineWidth);
    doc.roundedRect(config.layout.pageMargins, y, boxWidth, 16, config.visual.borderRadius, config.visual.borderRadius, 'FD');

    // Name
    doc.setFontSize(config.typography.headerTitleSize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text(ref1.name, 20, y + 6);

    // Title and Company
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.responsibilitySize);
    const titleCompany = ref1.company ? `${ref1.title}, ${ref1.company}` : ref1.title;
    doc.text(titleCompany, 20, y + 10);

    // Contact note
    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(config.typography.tinySize);
    doc.setTextColor(...config.colors.italicGrey);
    doc.text('Contact details can be provided upon request', 20, y + 14);
  }

  if (ref2?.name) {
    // Draw box
    doc.setFillColor(...getBoxBackground(config, themeColor));
    doc.setDrawColor(...getBoxBorder(config, themeColor));
    doc.setLineWidth(config.visual.thinLineWidth);
    doc.roundedRect(108, y, boxWidth, 16, config.visual.borderRadius, config.visual.borderRadius, 'FD');

    // Name
    doc.setFontSize(config.typography.headerTitleSize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text(ref2.name, 113, y + 6);

    // Title and Company
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.responsibilitySize);
    const titleCompany = ref2.company ? `${ref2.title}, ${ref2.company}` : ref2.title;
    doc.text(titleCompany, 113, y + 10);

    // Contact note
    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(config.typography.tinySize);
    doc.setTextColor(...config.colors.italicGrey);
    doc.text('Contact details can be provided upon request', 113, y + 14);
  }
}

function displayStatus(message: string, success: boolean): void {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = success ? `✓ ${message}` : `✗ ${message}`;
  }
}

// Sidebar Layout Rendering (Tech Style)
function renderSidebarLayout(doc: jsPDF, data: CVData, themeColor: RGB, fontFamily: string, config: StyleConfig): void {
  const accentColor = themeColor; // Use theme color directly
  const fadedColor = fadeColor(themeColor, 0.9); // Very light faded version for sidebar
  const sidebarWidth = config.layout.sidebarWidth!;
  const sidebarX = config.layout.pageMargins;
  const mainX = config.layout.mainContentX!;
  const mainWidth = 210 - mainX - config.layout.pageMargins;

  // Header banner across the top (theme color)
  doc.setFillColor(...accentColor);
  doc.rect(0, 0, 210, config.layout.headerHeight, 'F');

  // Render header text on top of banner
  renderSidebarHeader(doc, data, fontFamily, config);

  // Sidebar background (faded theme color) - starts below header
  doc.setFillColor(...fadedColor);
  doc.rect(0, config.layout.headerHeight, sidebarWidth + config.layout.pageMargins, 297 - config.layout.headerHeight, 'F');

  // Sidebar content
  let sidebarY = config.layout.sidebarStartY!;
  sidebarY = renderSidebarContact(doc, data, sidebarX, sidebarY, sidebarWidth, fontFamily, config, accentColor);
  sidebarY = renderSidebarSkills(doc, data, sidebarX, sidebarY, sidebarWidth, fontFamily, config, accentColor);

  // Main content area
  let mainY = config.layout.summaryTopMargin;
  mainY = renderSidebarSummary(doc, data, mainX, mainY, mainWidth, fontFamily, config, accentColor);
  mainY = renderSidebarWorkExperience(doc, data, mainX, mainY, mainWidth, fontFamily, config, accentColor);
  mainY = renderSidebarEducationAndCerts(doc, data, mainX, mainY, mainWidth, fontFamily, config, accentColor);

  // References
  if (data.references && (data.references[0]?.name || data.references[1]?.name)) {
    renderSidebarReferences(doc, data, mainX, mainY, mainWidth, fontFamily, config, accentColor);
  }
}

function renderSidebarHeader(doc: jsPDF, data: CVData, fontFamily: string, config: StyleConfig): void {
  const { name, title } = data.personal;

  // White text on teal banner
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(config.typography.nameSize);
  doc.setFont(fontFamily, 'bold');
  doc.text(name, config.layout.pageMargins, 18);

  doc.setFontSize(config.typography.headerTitleSize);
  doc.setFont(fontFamily, 'normal');
  doc.text(title.toUpperCase(), config.layout.pageMargins, 28);
}

function renderSidebarContact(doc: jsPDF, data: CVData, x: number, y: number, width: number, fontFamily: string, config: StyleConfig, accentColor: RGB): number {
  const { phone, email, location } = data.personal;

  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('CONTACT', x, y);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1, x + width, y + 1);

  y += config.layout.sectionSpacing;

  doc.setFontSize(config.typography.smallSize);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(...config.colors.textGrey);

  const contactItems = [
    { label: 'Phone', value: phone },
    { label: 'Email', value: email },
    { label: 'Location', value: location }
  ];

  contactItems.forEach(item => {
    doc.setFont(fontFamily, 'bold');
    doc.text(item.label, x, y);
    y += 4;
    doc.setFont(fontFamily, 'normal');
    const lines = doc.splitTextToSize(item.value, width);
    doc.text(lines, x, y);
    y += (lines.length * 4) + 3;
  });

  return y + 5;
}

function renderSidebarSkills(doc: jsPDF, data: CVData, x: number, y: number, width: number, fontFamily: string, config: StyleConfig, accentColor: RGB): number {
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('SKILLS', x, y);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1, x + width, y + 1);

  y += config.layout.sectionSpacing;

  const skills = Object.entries(data.skills)
    .filter(([_, items]) => items && items.length > 0)
    .map(([category, items]) => ({ cat: category, items }));

  skills.forEach(skill => {
    if (skill.items && skill.items.length > 0) {
      doc.setFontSize(config.typography.bodySize);
      doc.setFont(fontFamily, 'bold');
      doc.setTextColor(...config.colors.textDark);
      doc.text(skill.cat, x, y);
      y += 5;

      doc.setFontSize(config.typography.smallSize);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...config.colors.textGrey);

      skill.items.forEach(item => {
        const itemLines = doc.splitTextToSize(`• ${item}`, width);
        doc.text(itemLines, x, y);
        y += (itemLines.length * 3.5);
      });

      y += 4;
    }
  });

  return y;
}

function renderSidebarSummary(doc: jsPDF, data: CVData, x: number, y: number, width: number, fontFamily: string, config: StyleConfig, accentColor: RGB): number {
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('PROFESSIONAL SUMMARY', x, y);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1, x + width, y + 1);

  y += config.layout.sectionSpacing;

  doc.setFontSize(config.typography.bodySize);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(...config.colors.textDark);
  doc.text(data.personal.summary, x, y, { maxWidth: width, align: 'justify' });
  const summaryLines = doc.splitTextToSize(data.personal.summary, width);

  return y + (summaryLines.length * 4) + 8;
}

function renderSidebarWorkExperience(doc: jsPDF, data: CVData, x: number, y: number, width: number, fontFamily: string, config: StyleConfig, accentColor: RGB): number {
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('WORK EXPERIENCE', x, y);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1, x + width, y + 1);

  y += config.layout.sectionSpacing;

  data.jobs.forEach((job) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Job title
    doc.setFontSize(config.typography.jobTitleSize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    const titleLines = doc.splitTextToSize(job.title, width - 30);
    doc.text(titleLines[0], x, y);

    // Date (right-aligned)
    doc.setFontSize(config.typography.badgeSize);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...accentColor);
    const dateWidth = doc.getTextWidth(job.dates);
    doc.text(job.dates, x + width - dateWidth, y);

    y += 5;

    // Company and location
    doc.setFontSize(config.typography.bodySize);
    doc.setTextColor(...config.colors.textGrey);
    const companyLines = doc.splitTextToSize(`${job.company} | ${job.location}`, width);
    doc.text(companyLines[0], x, y);

    y += 5;

    // Responsibilities
    doc.setFontSize(config.typography.responsibilitySize);
    doc.setTextColor(...config.colors.textDark);

    job.responsibilities.forEach(resp => {
      const respLines = doc.splitTextToSize(`• ${resp}`, width);
      doc.text(respLines, x, y);
      y += respLines.length * 3.8;
    });

    y += config.layout.boxSpacing;
  });

  return y;
}

function renderSidebarEducationAndCerts(doc: jsPDF, data: CVData, x: number, y: number, width: number, fontFamily: string, config: StyleConfig, accentColor: RGB): number {
  if (y > 200) {
    doc.addPage();
    y = 20;
  }

  // Education
  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('EDUCATION', x, y);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1, x + width, y + 1);

  y += config.layout.sectionSpacing;

  data.education.forEach(edu => {
    doc.setFontSize(config.typography.bodySize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    const degreeLines = doc.splitTextToSize(edu.degree, width - 25);
    doc.text(degreeLines, x, y);

    if (edu.years) {
      doc.setFontSize(config.typography.smallSize);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...accentColor);
      const yearWidth = doc.getTextWidth(edu.years);
      doc.text(edu.years, x + width - yearWidth, y);
    }

    y += degreeLines.length * 4 + 1;

    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.smallSize);
    const instLines = doc.splitTextToSize(edu.institution, width);
    doc.text(instLines[0], x, y);

    y += 7;
  });

  y += 5;

  // Certifications
  if (data.certifications.length > 0) {
    doc.setFontSize(config.typography.sectionTitleSize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text('CERTIFICATIONS', x, y);

    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(x, y + 1, x + width, y + 1);

    y += config.layout.sectionSpacing;

    data.certifications.forEach(cert => {
      doc.setFontSize(config.typography.bodySize);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(...config.colors.textDark);
      const certLines = doc.splitTextToSize(`• ${cert}`, width);
      doc.text(certLines, x, y);
      y += certLines.length * 4 + 2;
    });
  }

  return y;
}

function renderSidebarReferences(doc: jsPDF, data: CVData, x: number, y: number, width: number, fontFamily: string, config: StyleConfig, accentColor: RGB): number {
  y += 10;

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(config.typography.sectionTitleSize);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(...config.colors.textDark);
  doc.text('REFERENCES', x, y);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1, x + width, y + 1);

  y += config.layout.sectionSpacing;

  const ref1 = data.references[0];
  const ref2 = data.references[1];

  if (ref1?.name) {
    doc.setFontSize(config.typography.bodySize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text(ref1.name, x, y);
    y += 4;

    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.smallSize);
    const titleCompany = ref1.company ? `${ref1.title}, ${ref1.company}` : ref1.title;
    const titleLines = doc.splitTextToSize(titleCompany, width);
    doc.text(titleLines, x, y);
    y += titleLines.length * 3.5 + 2;

    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(config.typography.tinySize);
    doc.setTextColor(...config.colors.italicGrey);
    const noteLines = doc.splitTextToSize('Contact details available upon request', width);
    doc.text(noteLines, x, y);
    y += noteLines.length * 3.5 + 6;
  }

  if (ref2?.name) {
    doc.setFontSize(config.typography.bodySize);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(...config.colors.textDark);
    doc.text(ref2.name, x, y);
    y += 4;

    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...config.colors.textGrey);
    doc.setFontSize(config.typography.smallSize);
    const titleCompany = ref2.company ? `${ref2.title}, ${ref2.company}` : ref2.title;
    const titleLines = doc.splitTextToSize(titleCompany, width);
    doc.text(titleLines, x, y);
    y += titleLines.length * 3.5 + 2;

    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(config.typography.tinySize);
    doc.setTextColor(...config.colors.italicGrey);
    const noteLines = doc.splitTextToSize('Contact details available upon request', width);
    doc.text(noteLines, x, y);
    y += noteLines.length * 3.5;
  }

  return y;
}
