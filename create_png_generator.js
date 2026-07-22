const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Helper to compute CRC32 for PNG chunks
function crc32(buf) {
  let c = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c ^= buf[n];
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const checksum = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(checksum, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, r1, g1, b1, r2, g2, b2) {
  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth 8
  ihdr[9] = 2; // color type 2 (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw pixel data scanlines (Filter byte 0 + RGB for each pixel)
  const lineSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * lineSize);

  for (let y = 0; y < height; y++) {
    const offset = y * lineSize;
    rawData[offset] = 0; // Filter type 0 (None)
    const factor = y / height;
    // Interpolate vertical gradient
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    for (let x = 0; x < width; x++) {
      const pxOffset = offset + 1 + x * 3;
      // Add subtle radial warmth in center
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - dist) * 0.4;

      // Gold warm accent tint (#C5A059 => R:197, G:160, B:89)
      const pr = Math.min(255, Math.round(r + glow * 197 * 0.5));
      const pg = Math.min(255, Math.round(g + glow * 160 * 0.5));
      const pb = Math.min(255, Math.round(b + glow * 89 * 0.5));

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
    }
  }

  // Compress IDAT Chunk using Node zlib
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Image definitions with .jpg and .png file paths
const imageMap = [
  // Common
  { path: 'assets/images/common/logo.png', w: 300, h: 80, c1: [18,18,18], c2: [35,30,22] },
  { path: 'assets/images/common/favicon.png', w: 64, h: 64, c1: [18,18,18], c2: [40,32,20] },

  // Home 1
  { path: 'assets/images/home1/hero-banner.jpg', w: 1200, h: 650, c1: [10,10,10], c2: [40,32,22] },
  { path: 'assets/images/home1/cat-family.jpg', w: 600, h: 450, c1: [28,24,20], c2: [45,35,25] },
  { path: 'assets/images/home1/cat-newborn.jpg', w: 600, h: 450, c1: [22,24,28], c2: [38,40,48] },
  { path: 'assets/images/home1/cat-maternity.jpg', w: 600, h: 450, c1: [32,22,25], c2: [50,32,38] },
  { path: 'assets/images/home1/cat-corporate.jpg', w: 600, h: 450, c1: [18,22,28], c2: [30,38,48] },
  { path: 'assets/images/home1/service-indoor.jpg', w: 600, h: 450, c1: [24,24,24], c2: [45,40,30] },
  { path: 'assets/images/home1/service-outdoor.jpg', w: 600, h: 450, c1: [20,28,24], c2: [35,48,40] },
  { path: 'assets/images/home1/service-branding.jpg', w: 600, h: 450, c1: [28,22,30], c2: [48,32,50] },
  { path: 'assets/images/home1/portfolio-1.jpg', w: 600, h: 600, c1: [30,25,18], c2: [52,40,28] },
  { path: 'assets/images/home1/portfolio-2.jpg', w: 600, h: 600, c1: [24,26,30], c2: [40,42,48] },
  { path: 'assets/images/home1/portfolio-3.jpg', w: 600, h: 600, c1: [30,22,25], c2: [50,30,35] },
  { path: 'assets/images/home1/portfolio-4.jpg', w: 600, h: 600, c1: [18,22,28], c2: [32,38,48] },
  { path: 'assets/images/home1/process-consultation.jpg', w: 500, h: 350, c1: [22,22,22], c2: [40,35,28] },
  { path: 'assets/images/home1/process-styling.jpg', w: 500, h: 350, c1: [24,20,26], c2: [45,32,48] },
  { path: 'assets/images/home1/process-session.jpg', w: 500, h: 350, c1: [20,23,28], c2: [32,38,45] },
  { path: 'assets/images/home1/process-reveal.jpg', w: 500, h: 350, c1: [25,22,18], c2: [45,36,28] },
  { path: 'assets/images/home1/wall-art-preview.jpg', w: 800, h: 500, c1: [20,20,20], c2: [42,36,28] },
  { path: 'assets/images/home1/testimonial-1.jpg', w: 120, h: 120, c1: [35,28,22], c2: [60,45,30] },
  { path: 'assets/images/home1/testimonial-2.jpg', w: 120, h: 120, c1: [28,30,35], c2: [45,48,55] },
  { path: 'assets/images/home1/testimonial-3.jpg', w: 120, h: 120, c1: [35,26,30], c2: [58,40,48] },
  { path: 'assets/images/home1/cta-bg.jpg', w: 1200, h: 500, c1: [14,14,14], c2: [42,32,22] },

  // Home 2
  { path: 'assets/images/home2/hero-banner.jpg', w: 1200, h: 650, c1: [12,14,18], c2: [30,38,50] },
  { path: 'assets/images/home2/showcase-1.jpg', w: 600, h: 750, c1: [22,22,22], c2: [42,38,30] },
  { path: 'assets/images/home2/showcase-2.jpg', w: 600, h: 750, c1: [16,16,16], c2: [35,35,35] },
  { path: 'assets/images/home2/showcase-3.jpg', w: 600, h: 750, c1: [18,22,26], c2: [32,38,45] },
  { path: 'assets/images/home2/showcase-4.jpg', w: 600, h: 750, c1: [28,20,24], c2: [48,30,36] },
  { path: 'assets/images/home2/studio-exp-1.jpg', w: 600, h: 400, c1: [23,20,24], c2: [40,32,42] },
  { path: 'assets/images/home2/studio-exp-2.jpg', w: 600, h: 400, c1: [20,22,25], c2: [32,38,44] },
  { path: 'assets/images/home2/outdoor-exp-1.jpg', w: 600, h: 400, c1: [28,22,18], c2: [48,35,25] },
  { path: 'assets/images/home2/outdoor-exp-2.jpg', w: 600, h: 400, c1: [20,23,26], c2: [32,38,46] },
  { path: 'assets/images/home2/corp-service.jpg', w: 750, h: 450, c1: [18,22,26], c2: [30,36,44] },
  { path: 'assets/images/home2/photographer-spotlight.jpg', w: 750, h: 450, c1: [24,20,18], c2: [42,34,26] },
  { path: 'assets/images/home2/story-1.jpg', w: 600, h: 400, c1: [26,22,18], c2: [44,34,26] },
  { path: 'assets/images/home2/story-2.jpg', w: 600, h: 400, c1: [18,23,28], c2: [30,38,48] },
  { path: 'assets/images/home2/pricing-preview-bg.jpg', w: 1000, h: 400, c1: [16,18,22], c2: [34,38,48] },
  { path: 'assets/images/home2/cta-bg.jpg', w: 1200, h: 500, c1: [18,16,14], c2: [44,34,24] },

  // About
  { path: 'assets/images/about/banner.jpg', w: 1200, h: 450, c1: [14,14,16], c2: [34,34,40] },
  { path: 'assets/images/about/story-founding.jpg', w: 750, h: 450, c1: [26,22,18], c2: [44,34,26] },
  { path: 'assets/images/about/lead-photographer.jpg', w: 600, h: 700, c1: [20,20,20], c2: [40,36,30] },
  { path: 'assets/images/about/associate-photographer.jpg', w: 600, h: 700, c1: [24,20,23], c2: [42,32,40] },
  { path: 'assets/images/about/philosophy-art.jpg', w: 650, h: 400, c1: [20,23,22], c2: [32,40,36] },
  { path: 'assets/images/about/approach-lighting.jpg', w: 650, h: 400, c1: [22,20,25], c2: [36,32,42] },
  { path: 'assets/images/about/facility-studio-a.jpg', w: 600, h: 400, c1: [23,24,28], c2: [35,38,48] },
  { path: 'assets/images/about/facility-studio-b.jpg', w: 600, h: 400, c1: [16,16,16], c2: [32,32,32] },
  { path: 'assets/images/about/awards-seal.png', w: 400, h: 400, c1: [30,25,18], c2: [52,42,28] },
  { path: 'assets/images/about/cta-bg.jpg', w: 1200, h: 500, c1: [18,16,15], c2: [42,34,26] },

  // Services
  { path: 'assets/images/services/banner.jpg', w: 1200, h: 450, c1: [14,17,20], c2: [30,36,44] },
  { path: 'assets/images/services/serv-family.jpg', w: 600, h: 450, c1: [26,22,18], c2: [44,34,26] },
  { path: 'assets/images/services/serv-newborn.jpg', w: 600, h: 450, c1: [23,25,28], c2: [36,40,48] },
  { path: 'assets/images/services/serv-maternity.jpg', w: 600, h: 450, c1: [30,22,25], c2: [50,32,38] },
  { path: 'assets/images/services/serv-children.jpg', w: 600, h: 450, c1: [20,25,22], c2: [32,40,36] },
  { path: 'assets/images/services/serv-couples.jpg', w: 600, h: 450, c1: [24,20,25], c2: [40,32,42] },
  { path: 'assets/images/services/serv-corporate.jpg', w: 600, h: 450, c1: [18,22,26], c2: [30,36,44] },
  { path: 'assets/images/services/serv-branding.jpg', w: 600, h: 450, c1: [25,20,18], c2: [42,32,26] },
  { path: 'assets/images/services/cta-bg.jpg', w: 1200, h: 500, c1: [16,15,14], c2: [38,32,24] },

  // Portfolio
  { path: 'assets/images/portfolio/banner.jpg', w: 1200, h: 450, c1: [15,14,18], c2: [32,30,40] },
  { path: 'assets/images/portfolio/port-family-1.jpg', w: 600, h: 600, c1: [28,23,19], c2: [44,34,26] },
  { path: 'assets/images/portfolio/port-family-2.jpg', w: 600, h: 600, c1: [24,22,20], c2: [40,34,28] },
  { path: 'assets/images/portfolio/port-newborn-1.jpg', w: 600, h: 600, c1: [22,24,27], c2: [35,38,46] },
  { path: 'assets/images/portfolio/port-newborn-2.jpg', w: 600, h: 600, c1: [24,23,26], c2: [38,36,42] },
  { path: 'assets/images/portfolio/port-maternity-1.jpg', w: 600, h: 600, c1: [30,22,25], c2: [48,32,38] },
  { path: 'assets/images/portfolio/port-maternity-2.jpg', w: 600, h: 600, c1: [26,23,21], c2: [42,36,30] },
  { path: 'assets/images/portfolio/port-outdoor-1.jpg', w: 600, h: 600, c1: [20,25,22], c2: [30,40,34] },
  { path: 'assets/images/portfolio/port-outdoor-2.jpg', w: 600, h: 600, c1: [19,23,27], c2: [30,36,44] },
  { path: 'assets/images/portfolio/port-corporate-1.jpg', w: 600, h: 600, c1: [18,21,26], c2: [28,34,42] },
  { path: 'assets/images/portfolio/port-corporate-2.jpg', w: 600, h: 600, c1: [21,24,26], c2: [32,38,42] },
  { path: 'assets/images/portfolio/port-branding-1.jpg', w: 600, h: 600, c1: [26,22,25], c2: [42,32,40] },
  { path: 'assets/images/portfolio/port-branding-2.jpg', w: 600, h: 600, c1: [22,21,19], c2: [38,34,30] },
  { path: 'assets/images/portfolio/port-studio-1.jpg', w: 600, h: 600, c1: [17,17,17], c2: [34,32,28] },
  { path: 'assets/images/portfolio/port-studio-2.jpg', w: 600, h: 600, c1: [28,20,23], c2: [46,30,36] },
  { path: 'assets/images/portfolio/behind-lens.jpg', w: 600, h: 400, c1: [21,22,25], c2: [33,36,42] },
  { path: 'assets/images/portfolio/fineart-prints.jpg', w: 600, h: 400, c1: [26,22,19], c2: [43,35,27] },
  { path: 'assets/images/portfolio/styling-guide.jpg', w: 600, h: 400, c1: [25,21,24], c2: [40,32,42] },
  { path: 'assets/images/portfolio/motion-portraits.jpg', w: 600, h: 400, c1: [18,22,26], c2: [30,36,44] },
  { path: 'assets/images/portfolio/cta-bg.jpg', w: 1200, h: 500, c1: [13,13,15], c2: [34,32,42] },

  // Packages
  { path: 'assets/images/packages/banner.jpg', w: 1200, h: 450, c1: [17,19,21], c2: [34,38,43] },
  { path: 'assets/images/packages/pkg-family.jpg', w: 600, h: 400, c1: [26,22,19], c2: [44,34,26] },
  { path: 'assets/images/packages/pkg-newborn.jpg', w: 600, h: 400, c1: [22,24,27], c2: [35,38,46] },
  { path: 'assets/images/packages/pkg-maternity.jpg', w: 600, h: 400, c1: [30,22,25], c2: [48,32,38] },
  { path: 'assets/images/packages/pkg-corporate.jpg', w: 600, h: 400, c1: [18,21,26], c2: [28,34,42] },
  { path: 'assets/images/packages/pkg-outdoor.jpg', w: 600, h: 400, c1: [20,25,22], c2: [30,40,34] },
  { path: 'assets/images/packages/pkg-custom.jpg', w: 600, h: 400, c1: [25,21,24], c2: [40,32,42] },
  { path: 'assets/images/packages/addon-album.jpg', w: 400, h: 300, c1: [24,21,18], c2: [42,33,26] },
  { path: 'assets/images/packages/addon-canvas.jpg', w: 400, h: 300, c1: [20,23,26], c2: [32,38,44] },
  { path: 'assets/images/packages/addon-makeup.jpg', w: 400, h: 300, c1: [25,21,23], c2: [41,32,38] },
  { path: 'assets/images/packages/cta-bg.jpg', w: 1200, h: 500, c1: [14,14,16], c2: [36,32,26] },

  // Blog
  { path: 'assets/images/blog/banner.jpg', w: 1200, h: 450, c1: [18,17,20], c2: [36,33,42] },
  { path: 'assets/images/blog/blog-featured.jpg', w: 800, h: 500, c1: [26,22,18], c2: [46,34,24] },
  { path: 'assets/images/blog/blog-1.jpg', w: 600, h: 400, c1: [22,24,27], c2: [35,38,46] },
  { path: 'assets/images/blog/blog-2.jpg', w: 600, h: 400, c1: [28,23,19], c2: [44,34,26] },
  { path: 'assets/images/blog/blog-3.jpg', w: 600, h: 400, c1: [18,21,26], c2: [28,34,42] },
  { path: 'assets/images/blog/blog-4.jpg', w: 600, h: 400, c1: [20,25,22], c2: [30,40,34] },
  { path: 'assets/images/blog/blog-5.jpg', w: 600, h: 400, c1: [25,21,24], c2: [40,32,42] },
  { path: 'assets/images/blog/blog-6.jpg', w: 600, h: 400, c1: [30,22,25], c2: [48,32,38] },
  { path: 'assets/images/blog/blog-7.jpg', w: 600, h: 400, c1: [21,22,24], c2: [34,36,40] },
  { path: 'assets/images/blog/cta-bg.jpg', w: 1200, h: 500, c1: [16,15,18], c2: [36,32,42] },

  // Contact
  { path: 'assets/images/contact/banner.jpg', w: 1200, h: 450, c1: [15,17,21], c2: [31,37,48] },
  { path: 'assets/images/contact/map-visual.jpg', w: 750, h: 450, c1: [17,20,24], c2: [30,37,46] },
  { path: 'assets/images/contact/studio-storefront.jpg', w: 600, h: 400, c1: [24,21,18], c2: [42,33,26] },
  { path: 'assets/images/contact/consultation-room.jpg', w: 600, h: 400, c1: [22,21,25], c2: [36,32,42] },
  { path: 'assets/images/contact/cta-bg.jpg', w: 1200, h: 500, c1: [14,13,12], c2: [40,33,25] },

  // Auth
  { path: 'assets/images/auth/login-bg.jpg', w: 1200, h: 800, c1: [10,10,11], c2: [30,27,23] },
  { path: 'assets/images/auth/signup-bg.jpg', w: 1200, h: 800, c1: [12,11,14], c2: [29,24,34] },
  { path: 'assets/images/auth/forgot-bg.jpg', w: 1200, h: 800, c1: [9,11,13], c2: [21,29,36] }
];

let count = 0;
imageMap.forEach(item => {
  const fullPath = path.join(__dirname, item.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const pngBuffer = generatePNG(item.w, item.h, item.c1[0], item.c1[1], item.c1[2], item.c2[0], item.c2[1], item.c2[2]);
  fs.writeFileSync(fullPath, pngBuffer);
  count++;
});

console.log(`Generated ${count} PNG/JPG image assets successfully.`);
