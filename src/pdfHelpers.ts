export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRGB(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

export function splitTextForWidth(text: string, maxWidth: number, charWidth: number = 2): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const estimatedWidth = testLine.length * charWidth;

    if (estimatedWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function calculateYPosition(
  currentY: number,
  lineHeight: number,
  numberOfLines: number
): number {
  return currentY + (lineHeight * numberOfLines);
}

export function shouldAddNewPage(currentY: number, threshold: number = 250): boolean {
  return currentY > threshold;
}

export function calculateLineCount(text: string, maxCharsPerLine: number): number {
  if (text.length === 0) return 0;
  return Math.ceil(text.length / maxCharsPerLine);
}

export function trimWhitespace(value: string | null | undefined): string {
  return (value || '').trim();
}

export function normalizeLineBreaks(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}
