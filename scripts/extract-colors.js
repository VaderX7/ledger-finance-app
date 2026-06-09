const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Helper to convert rgb to hex
function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

// Helper for Euclidean distance
function distance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.r - p2.r, 2) +
    Math.pow(p1.g - p2.g, 2) +
    Math.pow(p1.b - p2.b, 2)
  );
}

async function extractColors(filePath) {
  try {
    const { data, info } = await sharp(filePath)
      .resize(40, 40, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = [];
    const channels = info.channels; // 3 or 4

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      // Skip transparent pixels
      if (a < 50) continue;

      pixels.push({ r, g, b });
    }

    if (pixels.length === 0) {
      return { primary: '#FFFFFF', accent: '#000000' };
    }

    // Filter out white background pixels only if we have enough colorful pixels
    const nonWhitePixels = pixels.filter(p => !(p.r > 240 && p.g > 240 && p.b > 240));
    const finalPixels = nonWhitePixels.length > 20 ? nonWhitePixels : pixels;

    // K-means with K = 2
    let centroids = [];
    
    // Initialize Centroid 1: first pixel
    centroids.push(finalPixels[0]);

    // Initialize Centroid 2: furthest color from Centroid 1
    let maxDist = -1;
    let c2 = finalPixels[0];
    for (const p of finalPixels) {
      const dist = distance(p, centroids[0]);
      if (dist > maxDist) {
        maxDist = dist;
        c2 = p;
      }
    }
    centroids.push(c2);

    // If they are identical (e.g. monochrome image), return a default accent
    if (distance(centroids[0], centroids[1]) < 5) {
      const pColor = centroids[0];
      const isDark = (pColor.r * 0.299 + pColor.g * 0.587 + pColor.b * 0.114) < 128;
      const accent = isDark ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
      return {
        primary: rgbToHex(pColor.r, pColor.g, pColor.b),
        accent: rgbToHex(accent.r, accent.g, accent.b)
      };
    }

    // K-means iterations (10 max)
    for (let iter = 0; iter < 10; iter++) {
      const clusters = [[], []];
      for (const p of finalPixels) {
        const d0 = distance(p, centroids[0]);
        const d1 = distance(p, centroids[1]);
        if (d0 <= d1) {
          clusters[0].push(p);
        } else {
          clusters[1].push(p);
        }
      }

      // Update centroids
      let changed = false;
      for (let k = 0; k < 2; k++) {
        if (clusters[k].length === 0) continue;
        const sum = clusters[k].reduce((acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }), { r: 0, g: 0, b: 0 });
        const newCentroid = {
          r: sum.r / clusters[k].length,
          g: sum.g / clusters[k].length,
          b: sum.b / clusters[k].length
        };
        if (distance(newCentroid, centroids[k]) > 1) {
          centroids[k] = newCentroid;
          changed = true;
        }
      }

      if (!changed) break;
    }

    // Sort centroids by cluster sizes
    const clusters = [[], []];
    for (const p of finalPixels) {
      const d0 = distance(p, centroids[0]);
      const d1 = distance(p, centroids[1]);
      if (d0 <= d1) clusters[0].push(p);
      else clusters[1].push(p);
    }

    if (clusters[0].length < clusters[1].length) {
      centroids = [centroids[1], centroids[0]];
    }

    return {
      primary: rgbToHex(centroids[0].r, centroids[0].g, centroids[0].b),
      accent: rgbToHex(centroids[1].r, centroids[1].g, centroids[1].b)
    };
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return { primary: '#FFFFFF', accent: '#000000' };
  }
}

async function main() {
  const logosDir = path.join(__dirname, '..', 'public', 'logos');
  if (!fs.existsSync(logosDir)) {
    console.error(`Logos directory not found at ${logosDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(logosDir).filter(f => f.toLowerCase().endsWith('.png'));
  const results = {};

  for (const file of files) {
    const filePath = path.join(logosDir, file);
    results[file] = await extractColors(filePath);
  }

  console.log(JSON.stringify(results, null, 2));
}

main();
