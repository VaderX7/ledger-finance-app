const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'logos');

function rgbToHex(r, g, b) {
  const toHex = (c) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
}

function isGrayscale(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // Color is grayscale if the difference between components is small
  const isGray = (max - min) < 25;
  // White/near-white or black/near-black
  const isWhite = r > 230 && g > 230 && b > 230;
  const isBlack = r < 40 && g < 40 && b < 40;
  return isGray || isWhite || isBlack;
}

async function extractColors(filePath) {
  try {
    // Resize image to 40x40 to simplify analysis and merge noise/gradients
    const { data, info } = await sharp(filePath)
      .resize(40, 40, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const buckets = {};
    const channelCount = info.channels; // 3 for RGB, 4 for RGBA

    for (let i = 0; i < data.length; i += channelCount) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channelCount === 4 ? data[i + 3] : 255;

      // Ignore transparent pixels (alpha < 50)
      if (a < 50) continue;

      // Group colors by rounding components to the nearest 16 to consolidate similar shades
      const binR = Math.round(r / 16) * 16;
      const binG = Math.round(g / 16) * 16;
      const binB = Math.round(b / 16) * 16;
      const bucketKey = `${binR},${binG},${binB}`;

      if (!buckets[bucketKey]) {
        buckets[bucketKey] = {
          count: 0,
          rSum: 0,
          gSum: 0,
          bSum: 0
        };
      }
      buckets[bucketKey].count++;
      buckets[bucketKey].rSum += r;
      buckets[bucketKey].gSum += g;
      buckets[bucketKey].bSum += b;
    }

    // Convert buckets to an array of colors with their average RGB
    const colors = Object.keys(buckets).map(key => {
      const b = buckets[key];
      return {
        r: Math.round(b.rSum / b.count),
        g: Math.round(b.gSum / b.count),
        b: Math.round(b.bSum / b.count),
        count: b.count
      };
    });

    // Sort colors by frequency descending
    colors.sort((a, b) => b.count - a.count);

    if (colors.length === 0) {
      return { primary: '#FFFFFF', accent: '#000000' };
    }

    // Find primary: prefer non-grayscale colors first
    let primary = null;
    for (const c of colors) {
      if (!isGrayscale(c.r, c.g, c.b)) {
        primary = c;
        break;
      }
    }
    // Fallback to the absolute most common color if all are grayscale
    if (!primary) {
      primary = colors[0];
    }

    // Find accent: next most common color that is distinct from primary
    let accent = null;
    for (const c of colors) {
      // Must not be the same bucket as primary
      if (c.r === primary.r && c.g === primary.g && c.b === primary.b) continue;

      // Check distance in RGB space to ensure visual distinction
      const dist = colorDistance([primary.r, primary.g, primary.b], [c.r, c.g, c.b]);
      if (dist < 60) continue;

      // Prefer non-grayscale, but accept gray/black/white if it's the only distinct color
      if (!accent || (!isGrayscale(c.r, c.g, c.b) && isGrayscale(accent.r, accent.g, accent.b))) {
        accent = c;
      }
    }

    // Default fallbacks if no accent found
    if (!accent) {
      // Find any distinct color, even if grayscale
      for (const c of colors) {
        if (c.r === primary.r && c.g === primary.g && c.b === primary.b) continue;
        const dist = colorDistance([primary.r, primary.g, primary.b], [c.r, c.g, c.b]);
        if (dist >= 45) {
          accent = c;
          break;
        }
      }
    }

    // Ultimate fallback: create an accent by shifting brightness of primary
    if (!accent) {
      const shift = (primary.r + primary.g + primary.b) / 3 > 128 ? -40 : 40;
      accent = {
        r: Math.max(0, Math.min(255, primary.r + shift)),
        g: Math.max(0, Math.min(255, primary.g + shift)),
        b: Math.max(0, Math.min(255, primary.b + shift))
      };
    }

    return {
      primary: rgbToHex(primary.r, primary.g, primary.b),
      accent: rgbToHex(accent.r, accent.g, accent.b)
    };

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

async function run() {
  if (!fs.existsSync(LOGOS_DIR)) {
    console.error(`Logos directory not found at: ${LOGOS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(LOGOS_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  });

  const results = {};

  for (const file of files) {
    const filePath = path.join(LOGOS_DIR, file);
    const colors = await extractColors(filePath);
    if (colors) {
      results[file] = colors;
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

run();
