import { PhoneType, PhoneGroup } from '../types/phoneTypes';
import { phoneData } from '../data/phoneData';

// Helper function to get dimensions in mm
function getDimensionsInMM(dimensions: string): { width: number; height: number } {
  const match = dimensions.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/);
  return match ? {
    width: parseFloat(match[2]),
    height: parseFloat(match[1])
  } : { width: 0, height: 0 };
}

// Helper function to get screen size in inches
function getScreenSizeInInches(screenSize: string): number {
  const match = screenSize.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

export function categorizePhones(phones: PhoneType[]): PhoneGroup[] {
  const groups: PhoneGroup[] = [];
  const processedPhones = new Set<string>();

  // Group by similar dimensions (±2mm tolerance)
  phones.forEach((phone) => {
    if (processedPhones.has(`${phone.brand}-${phone.model}`)) return;

    const phoneDims = getDimensionsInMM(phone.dimensions);
    const phoneSize = getScreenSizeInInches(phone.screenSize);
    const similarPhones = phones.filter((p) => {
      const pDims = getDimensionsInMM(p.dimensions);
      const pSize = getScreenSizeInInches(p.screenSize);
      
      return Math.abs(phoneDims.width - pDims.width) <= 2 &&
             Math.abs(phoneDims.height - pDims.height) <= 2 &&
             Math.abs(phoneSize - pSize) <= 0.3 &&
             phone.cameraPosition === p.cameraPosition;
    });

    if (similarPhones.length > 0) {
      const groupId = `group-${groups.length + 1}`;
      const phoneList = similarPhones.map(p => ({
        ...p,
        groupId
      }));

      groups.push({
        id: groupId,
        name: `${phoneSize.toFixed(1)}" ${phone.cameraPosition} Display Group`,
        description: `Phones with ~${phoneSize.toFixed(1)}" screen, ${phone.cameraPosition} camera, and similar dimensions`,
        phones: phoneList
      });

      similarPhones.forEach(p => processedPhones.add(`${p.brand}-${p.model}`));
    }
  });

  return groups;
}

export function exportToCSV(groups: PhoneGroup[]): string {
  const csvRows = ['Group ID,Model'];
  
  groups.forEach(group => {
    group.phones.forEach(phone => {
      csvRows.push(`${group.id},"${phone.brand} ${phone.model}"`);
    });
  });

  return csvRows.join('\n');
}

export const phoneGroups = categorizePhones(phoneData);