import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Phone URLs to scrape
const PHONE_URLS = [
  'https://www.gsmarena.com/samsung_galaxy_a01-9999.php',
  'https://www.gsmarena.com/samsung_galaxy_a01_core-10314.php',
  'https://www.gsmarena.com/samsung_galaxy_a02s-10603.php',
  'https://www.gsmarena.com/samsung_galaxy_a02-10708.php',
  'https://www.gsmarena.com/samsung_galaxy_a2_core-9636.php',
  'https://www.gsmarena.com/realme_c17-10439.php',
  'https://www.gsmarena.com/realme_c25-10793.php',
  'https://www.gsmarena.com/xiaomi_poco_m5-11850.php',
  'https://www.gsmarena.com/xiaomi_poco_m4_5g-11762.php'
];

// Selectors for GSMArena data
const SELECTORS = {
  title: 'h1.specs-phone-name-title',
  image: '.specs-photo-main img',
  displaySize: 'td[data-spec="displaysize"]',
  resolution: 'td[data-spec="displayresolution"]',
  dimensions: 'td[data-spec="dimensions"]',
  features: 'td[data-spec="displayother"]',
  displayType: 'td[data-spec="displaytype"]'
};

/**
 * Extracts the screen-to-body ratio from the display size text
 */
function extractScreenToBodyRatio(displaySizeText) {
  const match = displaySizeText.match(/\((~[\d.]+%)/);
  return match ? match[1].trim() : '';
}

/**
 * Extracts the screen size from the display size text
 */
function extractScreenSize(displaySizeText) {
  return displaySizeText.split(',')[0].trim();
}

/**
 * Determines camera position based on comprehensive analysis
 */
function detectCameraPosition(imageUrl, displayFeatures, displayType, model, screenToBody) {
  const modelLower = model.toLowerCase();
  const featuresLower = (displayFeatures || '').toLowerCase();
  const displayTypeLower = (displayType || '').toLowerCase();
  const screenToBodyRatio = parseFloat(screenToBody?.replace(/[^0-9.]/g, '') || '0');

  // Check for specific model patterns first
  if (modelLower.includes('core')) {
    // Core models typically have traditional bezels
    return 'top-bezel';
  }

  // Check display type and features
  if (displayTypeLower.includes('mini-drop') || 
      featuresLower.includes('mini-drop') ||
      displayTypeLower.includes('mini drop') || 
      featuresLower.includes('mini drop')) {
    return 'mini-drop';
  }

  if (displayTypeLower.includes('waterdrop') || 
      featuresLower.includes('waterdrop') ||
      displayTypeLower.includes('water drop') || 
      featuresLower.includes('water drop') ||
      displayTypeLower.includes('dewdrop') || 
      featuresLower.includes('dewdrop')) {
    return 'waterdrop';
  }

  if (displayTypeLower.includes('punch hole') || 
      featuresLower.includes('punch hole') ||
      displayTypeLower.includes('o-hole') || 
      featuresLower.includes('o-hole')) {
    // Check for position specifics
    if (displayTypeLower.includes('left') || featuresLower.includes('left')) {
      return 'punch-hole-left';
    }
    if (displayTypeLower.includes('right') || featuresLower.includes('right')) {
      return 'punch-hole-right';
    }
    if (displayTypeLower.includes('center') || featuresLower.includes('center')) {
      return 'punch-hole-center';
    }
    return 'punch-hole';
  }

  if (displayTypeLower.includes('notch') || featuresLower.includes('notch')) {
    if (displayTypeLower.includes('wide') || featuresLower.includes('wide')) {
      return 'wide-notch';
    }
    return 'notch';
  }

  // Screen-to-body ratio analysis
  if (screenToBodyRatio < 75) {
    return 'top-bezel'; // Older design with significant bezels
  }

  // Model-specific patterns
  if (modelLower.includes('a01') || modelLower.includes('a02')) {
    return 'waterdrop'; // These models typically use waterdrop notches
  }

  if (modelLower.includes('poco')) {
    return 'punch-hole-center'; // POCO phones typically use centered punch holes
  }

  if (modelLower.includes('realme c')) {
    return 'mini-drop'; // Realme C series typically uses mini-drop notches
  }

  return 'unknown';
}

/**
 * Scrapes phone data from a GSMArena URL
 */
async function scrapePhoneData(url) {
  try {
    console.log(`📱 Scraping data from ${url}`);
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract phone name and brand
    const fullName = $(SELECTORS.title).text().trim();
    const brand = fullName.split(' ')[0];
    const model = fullName.replace(brand, '').trim();
    
    // Get specifications
    const displaySizeText = $(SELECTORS.displaySize).text();
    const screenToBody = extractScreenToBodyRatio(displaySizeText);
    const imageUrl = $(SELECTORS.image).attr('src') || '';
    const displayFeatures = $(SELECTORS.features).text();
    const displayType = $(SELECTORS.displayType).text();
    
    return {
      brand,
      model,
      screenSize: extractScreenSize(displaySizeText),
      resolution: $(SELECTORS.resolution).text().trim(),
      screenToBody,
      dimensions: $(SELECTORS.dimensions).text().trim(),
      cameraPosition: detectCameraPosition(imageUrl, displayFeatures, displayType, model, screenToBody),
      imageUrl,
      gsmarenaUrl: url
    };
    
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return {
      brand: 'Unknown',
      model: 'Unknown',
      screenSize: '',
      resolution: '',
      screenToBody: '',
      dimensions: '',
      cameraPosition: 'unknown',
      imageUrl: '',
      gsmarenaUrl: url
    };
  }
}

/**
 * Saves data to both JSON and TypeScript files
 */
function saveData(data) {
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  
  // Save JSON file
  const jsonPath = path.join(dataDir, 'scrapedPhoneData.json');
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log(`📝 Data saved to ${jsonPath}`);
  
  // Generate TypeScript file
  const tsPath = path.join(dataDir, 'phoneData.ts');
  const tsContent = `import { PhoneType } from '../types/phoneTypes';

export const phoneData: PhoneType[] = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(tsPath, tsContent);
  console.log(`📝 TypeScript data generated at ${tsPath}`);
}

/**
 * Main function to scrape all phones
 */
async function scrapeAllPhones() {
  console.log('🚀 Starting phone data scraping from GSMArena...');
  
  const results = [];
  
  for (const url of PHONE_URLS) {
    const phoneData = await scrapePhoneData(url);
    results.push(phoneData);
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  saveData(results);
  console.log('✨ Scraping complete!');
}

// Execute scraper
scrapeAllPhones().catch(console.error);