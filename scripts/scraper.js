import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of phones to scrape
const phones = [
  { brand: 'Samsung', model: 'A01' },
  { brand: 'Samsung', model: 'A01 CORE' },
  { brand: 'Samsung', model: 'A02' },
  { brand: 'Samsung', model: 'A02S' },
  { brand: 'Samsung', model: 'A2 CORE' },
  { brand: 'Samsung', model: 'A03' },
  { brand: 'Samsung', model: 'A03S' },
  { brand: 'Samsung', model: 'A03 CORE' },
  { brand: 'Samsung', model: 'M01' },
  { brand: 'Samsung', model: 'M01 CORE' },
  { brand: 'Samsung', model: 'M02' },
  { brand: 'Xiaomi', model: 'Redmi 9A' },
  { brand: 'Xiaomi', model: 'Redmi 9C' },
  { brand: 'Xiaomi', model: 'Redmi 10A' },
  { brand: 'Xiaomi', model: 'POCO C40' },
  { brand: 'Xiaomi', model: 'POCO C65' },
  // Add more phones as needed
];

/**
 * Formats the phone name for URL
 */
function formatPhoneNameForUrl(brand, model) {
  const brandFormatted = brand.toLowerCase();
  let modelFormatted = model
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\+/g, 'plus');
  
  if (brandFormatted === 'samsung') {
    return `samsung-galaxy-${modelFormatted}`;
  } else if (brandFormatted === 'xiaomi' && model.toLowerCase().includes('poco')) {
    return `xiaomi-poco-${modelFormatted.replace('poco-', '')}`;
  } else if (brandFormatted === 'xiaomi') {
    return `xiaomi-${modelFormatted}`;
  }
  
  return `${brandFormatted}-${modelFormatted}`;
}

/**
 * Function to detect camera position from image URL
 */
function detectCameraPosition(imageUrl) {
  // In a real implementation, you would use image recognition
  // For now, returning a placeholder based on common patterns
  if (imageUrl.includes('core')) {
    return 'top';
  }
  
  return 'notch';
}

/**
 * Extract text from a specification row
 */
function extractSpecValue($, row) {
  return $(row).text().trim();
}

/**
 * Scrape phone data from PhoneArena
 */
async function scrapePhoneData(brand, model) {
  try {
    const formattedName = formatPhoneNameForUrl(brand, model);
    const url = `https://www.phonearena.com/phones/${formattedName}`;
    
    console.log(`Scraping data for ${brand} ${model} from ${url}`);
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Get the phone name from the header
    const fullName = $('.page__section.page__section_quickSpecs_header').text().trim();
    const extractedBrand = fullName.split(' ')[0];
    
    // Extract display specifications
    let screenSize = '';
    let resolution = '';
    let screenToBody = '';
    
    $('.display_cPoint').each((_, element) => {
      const text = $(element).text().toLowerCase();
      if (text.includes('size')) {
        screenSize = extractSpecValue($, element);
      } else if (text.includes('resolution')) {
        resolution = extractSpecValue($, element);
      } else if (text.includes('screen-to-body')) {
        screenToBody = extractSpecValue($, element);
      }
    });
    
    // Extract dimensions
    let dimensions = '';
    $('.design_cPoint').each((_, element) => {
      const text = $(element).text().toLowerCase();
      if (text.includes('dimensions')) {
        dimensions = extractSpecValue($, element);
      }
    });
    
    // Get the main phone image
    const imageUrl = $('.square.gallery-facade-image img').attr('src') || '';
    
    // Detect camera position based on image analysis
    const cameraPosition = detectCameraPosition(imageUrl);
    
    return {
      brand: extractedBrand || brand,
      model: fullName.replace(extractedBrand, '').trim() || model,
      screenSize,
      resolution,
      screenToBody,
      dimensions,
      cameraPosition,
      imageUrl,
      phonearenaUrl: url
    };
    
  } catch (error) {
    console.error(`Error scraping data for ${brand} ${model}:`, error.message);
    return {
      brand,
      model,
      screenSize: 'N/A',
      resolution: 'N/A',
      screenToBody: 'N/A',
      dimensions: 'N/A',
      cameraPosition: 'unknown',
      imageUrl: '',
      phonearenaUrl: `https://www.phonearena.com/phones/${formatPhoneNameForUrl(brand, model)}`
    };
  }
}

/**
 * Main function to scrape all phones and save data
 */
async function scrapeAllPhones() {
  console.log('Starting phone data scraping...');
  const results = [];
  
  for (const phone of phones) {
    const phoneData = await scrapePhoneData(phone.brand, phone.model);
    results.push(phoneData);
    // Add a small delay to avoid overloading the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save the results
  const dataPath = path.join(__dirname, '..', 'src', 'data', 'scrapedPhoneData.json');
  fs.writeFileSync(dataPath, JSON.stringify(results, null, 2));
  
  console.log(`Scraping complete! Data saved to ${dataPath}`);
  
  // Also generate TypeScript file
  const tsDataPath = path.join(__dirname, '..', 'src', 'data', 'phoneData.ts');
  const tsContent = `import { PhoneType } from '../types/phoneTypes';

export const phoneData: PhoneType[] = ${JSON.stringify(results, null, 2)};
`;
  
  fs.writeFileSync(tsDataPath, tsContent);
  console.log(`TypeScript data file generated at ${tsDataPath}`);
}

// Run the scraper
scrapeAllPhones().catch(console.error);