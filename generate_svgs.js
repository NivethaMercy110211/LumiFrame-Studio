const fs = require('fs');
const path = require('path');

function createSVG(width, height, title, subtitle, accentColor = '#C5A059', bgGradient = ['#121212', '#2A2620'], iconType = 'camera') {
  const icons = {
    camera: `<path d="M40 30 L48 20 L72 20 L80 30 L100 30 C105.5 30 110 34.5 110 40 L110 90 C110 95.5 105.5 100 100 100 L20 100 C14.5 100 10 95.5 10 90 L10 40 C10 34.5 14.5 30 20 30 Z" fill="none" stroke="${accentColor}" stroke-width="4"/><circle cx="60" cy="65" r="22" fill="none" stroke="${accentColor}" stroke-width="4"/><circle cx="60" cy="65" r="12" fill="${accentColor}" opacity="0.3"/><circle cx="92" cy="42" r="4" fill="${accentColor}"/>`,
    aperture: `<circle cx="60" cy="60" r="45" fill="none" stroke="${accentColor}" stroke-width="3"/><polygon points="60,20 85,45 60,70" fill="${accentColor}" opacity="0.4"/><polygon points="100,60 75,85 50,60" fill="${accentColor}" opacity="0.3"/><polygon points="60,100 35,75 60,50" fill="${accentColor}" opacity="0.5"/><polygon points="20,60 45,35 70,60" fill="${accentColor}" opacity="0.2"/>`,
    portrait: `<circle cx="60" cy="42" r="20" fill="none" stroke="${accentColor}" stroke-width="4"/><path d="M25 95 C25 70 40 62 60 62 C80 62 95 70 95 95" fill="none" stroke="${accentColor}" stroke-width="4"/>`,
    family: `<circle cx="42" cy="40" r="14" fill="none" stroke="${accentColor}" stroke-width="3"/><circle cx="78" cy="40" r="14" fill="none" stroke="${accentColor}" stroke-width="3"/><circle cx="60" cy="50" r="10" fill="none" stroke="${accentColor}" stroke-width="3"/><path d="M20 90 C20 72 32 64 45 64" fill="none" stroke="${accentColor}" stroke-width="3"/><path d="M100 90 C100 72 88 64 75 64" fill="none" stroke="${accentColor}" stroke-width="3"/><path d="M42 90 C42 76 50 70 60 70 C70 70 78 76 78 90" fill="none" stroke="${accentColor}" stroke-width="3"/>`,
    award: `<circle cx="60" cy="50" r="30" fill="none" stroke="${accentColor}" stroke-width="4"/><polygon points="60,28 66,42 80,42 68,52 73,66 60,56 47,66 52,52 40,42 54,42" fill="${accentColor}" opacity="0.8"/><path d="M45 78 L35 105 L60 92 L85 105 L75 78" fill="none" stroke="${accentColor}" stroke-width="3"/>`,
    map: `<rect x="20" y="20" width="80" height="80" rx="8" fill="none" stroke="${accentColor}" stroke-width="3"/><path d="M40 20 L40 100 M60 20 L60 100 M80 20 L80 100 M20 40 L100 40 M20 60 L100 60 M20 80 L100 80" stroke="${accentColor}" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/><circle cx="60" cy="52" r="12" fill="${accentColor}" opacity="0.9"/><circle cx="60" cy="52" r="5" fill="#121212"/>`
  };

  const selectedIcon = icons[iconType] || icons.camera;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradient[0]}"/>
      <stop offset="100%" stop-color="${bgGradient[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accentColor}" stroke-width="0.5" stroke-opacity="0.08"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>

  <!-- Artistic Ambient Lighting Effects -->
  <circle cx="${width * 0.5}" cy="${height * 0.4}" r="${Math.min(width, height) * 0.45}" fill="url(#glow)"/>
  <circle cx="${width * 0.8}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.25}" fill="url(#glow)"/>

  <!-- Fine Art Decorative Frame Lines -->
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.25"/>
  <rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="none" stroke="${accentColor}" stroke-width="0.5" stroke-opacity="0.15"/>

  <!-- Icon Visual -->
  <g transform="translate(${(width - 120) / 2}, ${(height - 180) / 2})">
    ${selectedIcon}
  </g>

  <!-- Typography Text Overlay -->
  <text x="50%" y="${height / 2 + 30}" font-family="'Playfair Display', Georgia, serif" font-size="${Math.max(16, Math.min(28, width / 25))}" font-weight="600" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${escapeXML(title.toUpperCase())}</text>
  <text x="50%" y="${height / 2 + 58}" font-family="'Montserrat', sans-serif" font-size="${Math.max(11, Math.min(14, width / 45))}" font-weight="400" fill="${accentColor}" text-anchor="middle" letter-spacing="3" opacity="0.9">${escapeXML(subtitle)}</text>
  <text x="50%" y="${height / 2 + 82}" font-family="'Montserrat', sans-serif" font-size="10" font-weight="300" fill="#AAAAAA" text-anchor="middle" letter-spacing="1">LUMIFRAME PORTRAIT STUDIO</text>
</svg>`;
}

function escapeXML(str) {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

const imagesToCreate = [
  // common
  { path: 'assets/images/common/logo.svg', w: 240, h: 70, title: 'LUMIFRAME', sub: 'STUDIO & PORTRAITS', bg: ['#121212', '#1A1815'], icon: 'aperture' },
  { path: 'assets/images/common/favicon.svg', w: 64, h: 64, title: 'LF', sub: 'PRO', bg: ['#121212', '#2A2620'], icon: 'aperture' },

  // home1
  { path: 'assets/images/home1/hero-banner.svg', w: 1920, h: 800, title: 'Timeless Fine Art Portraiture', sub: 'EMOTIONAL • ARTISTIC • UNFORGETTABLE', bg: ['#0A0A0A', '#261F17'], icon: 'camera' },
  { path: 'assets/images/home1/cat-family.svg', w: 800, h: 600, title: 'Family Legacy Portraits', sub: 'CREATING MEMORIES FOR GENERATIONS', bg: ['#1A1714', '#2C2318'], icon: 'family' },
  { path: 'assets/images/home1/cat-newborn.svg', w: 800, h: 600, title: 'Newborn Fine Art', sub: 'PURE & GENTLE FIRST MOMENTS', bg: ['#17191C', '#24201C'], icon: 'portrait' },
  { path: 'assets/images/home1/cat-maternity.svg', w: 800, h: 600, title: 'Maternity Portraits', sub: 'CELEBRATING NEW LIFE & BEAUTY', bg: ['#1F181B', '#2A1F22'], icon: 'portrait' },
  { path: 'assets/images/home1/cat-corporate.svg', w: 800, h: 600, title: 'Corporate Headshots', sub: 'EXECUTIVE BRANDING & PRESENCE', bg: ['#14181E', '#1F252E'], icon: 'portrait' },
  { path: 'assets/images/home1/service-indoor.svg', w: 600, h: 450, title: 'Indoor Studio Suite', sub: 'CONTROLLED LIGHTING & PRIVACY', bg: ['#181818', '#2B251D'], icon: 'camera' },
  { path: 'assets/images/home1/service-outdoor.svg', w: 600, h: 450, title: 'Outdoor Location Sessions', sub: 'NATURAL LIGHT & LANDSCAPES', bg: ['#151C18', '#202E26'], icon: 'camera' },
  { path: 'assets/images/home1/service-branding.svg', w: 600, h: 450, title: 'Personal Branding', sub: 'TAILORED CREATIVE IMAGE COLLECTIONS', bg: ['#1C171E', '#2A1E2B'], icon: 'portrait' },
  { path: 'assets/images/home1/portfolio-1.svg', w: 600, h: 600, title: 'The Vance Family', sub: 'GOLDEN HOUR OUTDOOR PORTRAIT', bg: ['#1F1A14', '#33271A'], icon: 'family' },
  { path: 'assets/images/home1/portfolio-2.svg', w: 600, h: 600, title: 'Baby Oliver (12 Days)', sub: 'STUDIO NEWBORN FINE ART', bg: ['#181A1D', '#26292E'], icon: 'portrait' },
  { path: 'assets/images/home1/portfolio-3.svg', w: 600, h: 600, title: 'Sophia & Alexander', sub: 'FINE ART MATERNITY SILHOUETTE', bg: ['#1E1618', '#302024'], icon: 'portrait' },
  { path: 'assets/images/home1/portfolio-4.svg', w: 600, h: 600, title: 'Julian Sterling', sub: 'EXECUTIVE HEADSHOT COLLECTION', bg: ['#13171C', '#1E252D'], icon: 'portrait' },
  { path: 'assets/images/home1/process-consultation.svg', w: 500, h: 350, title: '1. Creative Consultation', sub: 'VISION, STYLING & LOCATION PLAN', bg: ['#161616', '#26221C'], icon: 'aperture' },
  { path: 'assets/images/home1/process-styling.svg', w: 500, h: 350, title: '2. Wardrobe & Preparation', sub: 'PROFESSIONAL MAKEUP & STYLING GUIDE', bg: ['#181519', '#2B202D'], icon: 'portrait' },
  { path: 'assets/images/home1/process-session.svg', w: 500, h: 350, title: '3. Guided Photo Shoot', sub: 'RELAXED, EXPERT POSED SESSIONS', bg: ['#14171A', '#1F272E'], icon: 'camera' },
  { path: 'assets/images/home1/process-reveal.svg', w: 500, h: 350, title: '4. Gallery & Print Ordering', sub: 'PRIVATE CINEMATIC REVEAL SUITE', bg: ['#191613', '#2B241C'], icon: 'award' },
  { path: 'assets/images/home1/wall-art-preview.svg', w: 1000, h: 600, title: 'Heirloom Gallery Wall Art', sub: 'HANDCRAFTED CANVAS & ACRYLIC PRINTS', bg: ['#141414', '#28231C'], icon: 'aperture' },
  { path: 'assets/images/home1/testimonial-1.svg', w: 120, h: 120, title: 'CL', sub: 'CLIENT', bg: ['#221D17', '#382D20'], icon: 'portrait' },
  { path: 'assets/images/home1/testimonial-2.svg', w: 120, h: 120, title: 'MR', sub: 'CLIENT', bg: ['#1D1E22', '#2B2E38'], icon: 'portrait' },
  { path: 'assets/images/home1/testimonial-3.svg', w: 120, h: 120, title: 'SK', sub: 'CLIENT', bg: ['#221B1D', '#38282B'], icon: 'portrait' },
  { path: 'assets/images/home1/cta-bg.svg', w: 1920, h: 500, title: 'Reserve Your Exclusive Session', sub: 'LIMITED CALENDAR AVAILABILITY EACH MONTH', bg: ['#0E0E0E', '#2A2016'], icon: 'camera' },

  // home2
  { path: 'assets/images/home2/hero-banner.svg', w: 1920, h: 800, title: 'The Portrait Editorial', sub: 'LUXURY FINE ART & PERSONAL BRANDING', bg: ['#0B0E12', '#1B2430'], icon: 'aperture' },
  { path: 'assets/images/home2/showcase-1.svg', w: 600, h: 750, title: 'Elegance In Shadow', sub: 'HIGH-KEY EDITORIAL PORTRAIT', bg: ['#161616', '#292520'], icon: 'portrait' },
  { path: 'assets/images/home2/showcase-2.svg', w: 600, h: 750, title: 'Monochrome Majesty', sub: 'CHIAROSCURO FINE ART', bg: ['#111111', '#222222'], icon: 'portrait' },
  { path: 'assets/images/home2/showcase-3.svg', w: 600, h: 750, title: 'The Executive Stance', sub: 'MODERN BRANDING SUITE', bg: ['#12161A', '#1E252C'], icon: 'portrait' },
  { path: 'assets/images/home2/showcase-4.svg', w: 600, h: 750, title: 'Maternal Grace', sub: 'EDITORIAL FINE ART MATERNITY', bg: ['#1C1518', '#2E1E23'], icon: 'portrait' },
  { path: 'assets/images/home2/studio-exp-1.svg', w: 600, h: 400, title: 'Private Styling Lounge', sub: 'LUXURY REFRESHMENTS & WARDROBE RACKS', bg: ['#171518', '#261F29'], icon: 'camera' },
  { path: 'assets/images/home2/studio-exp-2.svg', w: 600, h: 400, title: 'Hasselblad & Broncolor Rig', sub: 'MEDIUM FORMAT UNMATCHED DETAIL', bg: ['#141618', '#1F252B'], icon: 'aperture' },
  { path: 'assets/images/home2/outdoor-exp-1.svg', w: 600, h: 400, title: 'Golden Hour Fields', sub: 'DREAMY SUNSET ATMOSPHERE', bg: ['#1B1712', '#2D2319'], icon: 'camera' },
  { path: 'assets/images/home2/outdoor-exp-2.svg', w: 600, h: 400, title: 'Urban Architecture', sub: 'SOPHISTICATED CITYSCAPE BACKDROPS', bg: ['#14171A', '#20272F'], icon: 'camera' },
  { path: 'assets/images/home2/corp-service.svg', w: 800, h: 500, title: 'Executive Team Portraits', sub: 'CONSISTENT CORPORATE BRANDING FOR TEAMS', bg: ['#12151A', '#1D242D'], icon: 'portrait' },
  { path: 'assets/images/home2/photographer-spotlight.svg', w: 800, h: 500, title: 'Marcus Vance', sub: 'MASTER PHOTOGRAPHER IN ACTION', bg: ['#181512', '#2A221B'], icon: 'camera' },
  { path: 'assets/images/home2/story-1.svg', w: 600, h: 400, title: 'The Montgomery Legacy', sub: 'A 4-GENERATION FAMILY CHRONICLE', bg: ['#1A1613', '#2C221A'], icon: 'family' },
  { path: 'assets/images/home2/story-2.svg', w: 600, h: 400, title: 'Evelyn Reed, CEO', sub: 'REBRANDING A GLOBAL MEDIA IMPRESS', bg: ['#13171C', '#1E2630'], icon: 'portrait' },
  { path: 'assets/images/home2/pricing-preview-bg.svg', w: 1200, h: 450, title: 'Investment In Memories', sub: 'TRANSPARENT VALUE & UNCOMPROMISED QUALITY', bg: ['#111316', '#222730'], icon: 'aperture' },
  { path: 'assets/images/home2/cta-bg.svg', w: 1920, h: 500, title: 'Transform Moments Into Art', sub: 'BOOK YOUR EDITORIAL SESSION TODAY', bg: ['#13110E', '#2B2217'], icon: 'camera' },

  // about
  { path: 'assets/images/about/banner.svg', w: 1920, h: 450, title: 'About LumiFrame Studio', sub: 'OUR HERITAGE • OUR CRAFT • OUR PASSION', bg: ['#0E0E10', '#222228'], icon: 'aperture' },
  { path: 'assets/images/about/story-founding.svg', w: 800, h: 500, title: '15 Years of Fine Art', sub: 'ESTABLISHED IN 2011 IN SAN FRANCISCO', bg: ['#1A1612', '#2B2219'], icon: 'camera' },
  { path: 'assets/images/about/lead-photographer.svg', w: 600, h: 700, title: 'Marcus Vance', sub: 'FOUNDER & MASTER PORTRAITIS', bg: ['#151515', '#282520'], icon: 'portrait' },
  { path: 'assets/images/about/associate-photographer.svg', w: 600, h: 700, title: 'Elena Rostova', sub: 'ASSOCIATE DIRECTOR & NEWBORN SPECIALIST', bg: ['#181517', '#292026'], icon: 'portrait' },
  { path: 'assets/images/about/philosophy-art.svg', w: 700, h: 450, title: 'Artistic Excellence', sub: 'LIGHTING AS EMOTION • POSE AS COMPOSITION', bg: ['#141716', '#202824'], icon: 'aperture' },
  { path: 'assets/images/about/approach-lighting.svg', w: 700, h: 450, title: 'Mastery of Light', sub: 'CUSTOM BRONCOLOR FLASH & DAYLIGHT CONTROL', bg: ['#161519', '#24202B'], icon: 'camera' },
  { path: 'assets/images/about/facility-studio-a.svg', w: 600, h: 400, title: 'Suite A: Daylight Loft', sub: 'NORTH-FACING 16FT WINDOWS', bg: ['#17181C', '#232730'], icon: 'camera' },
  { path: 'assets/images/about/facility-studio-b.svg', w: 600, h: 400, title: 'Suite B: Drama Stage', sub: 'BLACKOUT THEATER & CYCLORAMA WALL', bg: ['#101010', '#202020'], icon: 'aperture' },
  { path: 'assets/images/about/awards-seal.svg', w: 400, h: 400, title: 'WPPI Master Award', sub: 'INTERNATIONAL PORTRAIT WINNER 2024', bg: ['#1F1A13', '#33291B'], icon: 'award' },
  { path: 'assets/images/about/cta-bg.svg', w: 1920, h: 500, title: 'Experience The LumiFrame Touch', sub: 'MEET OUR TEAM & VISIT THE STUDIO', bg: ['#121110', '#29231A'], icon: 'camera' },

  // services
  { path: 'assets/images/services/banner.svg', w: 1920, h: 450, title: 'Photography Services', sub: 'TAILORED SESSIONS FOR EVERY MILESTONE', bg: ['#0E1114', '#1E252D'], icon: 'camera' },
  { path: 'assets/images/services/serv-family.svg', w: 600, h: 450, title: 'Family Portraiture', sub: 'INDOOR & OUTDOOR HEIRLOOM COLLECTIONS', bg: ['#1A1612', '#2C2219'], icon: 'family' },
  { path: 'assets/images/services/serv-newborn.svg', w: 600, h: 450, title: 'Newborn & Infant Art', sub: 'SAFE, WARM & GENTLE STUDIO POSING', bg: ['#17191C', '#242930'], icon: 'portrait' },
  { path: 'assets/images/services/serv-maternity.svg', w: 600, h: 450, title: 'Maternity Portraits', sub: 'CELEBRATING MOTHERHOOD & STYLING', bg: ['#1F1618', '#302024'], icon: 'portrait' },
  { path: 'assets/images/services/serv-children.svg', w: 600, h: 450, title: 'Children & Milestones', sub: 'PLAYFUL, AUTHENTIC EXPRESSIONS', bg: ['#151917', '#202824'], icon: 'portrait' },
  { path: 'assets/images/services/serv-couples.svg', w: 600, h: 450, title: 'Couples & Engagements', sub: 'ROMANTIC EDITORIAL STORYTELLING', bg: ['#181519', '#27202B'], icon: 'portrait' },
  { path: 'assets/images/services/serv-corporate.svg', w: 600, h: 450, title: 'Corporate Headshots', sub: 'EXECUTIVE & TEAM IMAGE BRANDING', bg: ['#121519', '#1E242E'], icon: 'portrait' },
  { path: 'assets/images/services/serv-branding.svg', w: 600, h: 450, title: 'Personal Branding', sub: 'COMPREHENSIVE CONTENT & MEDIA KITS', bg: ['#191512', '#2A211B'], icon: 'portrait' },
  { path: 'assets/images/services/cta-bg.svg', w: 1920, h: 500, title: 'Let Us Capture Your Story', sub: 'CUSTOM CONSULTATION & SESSION PLANNING', bg: ['#100F0E', '#261F17'], icon: 'aperture' },

  // portfolio
  { path: 'assets/images/portfolio/banner.svg', w: 1920, h: 450, title: 'Portfolio Gallery', sub: 'A CURATED COLLECTION OF FINE ART PORTRAITURE', bg: ['#0F0E12', '#211F28'], icon: 'aperture' },
  { path: 'assets/images/portfolio/port-family-1.svg', w: 600, h: 600, title: 'The Sterling Family', sub: 'AUTUMN GOLDEN HOUR SESSION', bg: ['#1C1713', '#2C2219'], icon: 'family' },
  { path: 'assets/images/portfolio/port-family-2.svg', w: 600, h: 600, title: 'The Davies Trio', sub: 'STUDIO HEARTH PORTRAIT', bg: ['#181614', '#28231C'], icon: 'family' },
  { path: 'assets/images/portfolio/port-newborn-1.svg', w: 600, h: 600, title: 'Baby Clara', sub: 'DREAM NEST FINE ART', bg: ['#16181B', '#232830'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-newborn-2.svg', w: 600, h: 600, title: 'Twin Joy: Leo & Maya', sub: 'SOFT LINEN WRAP SESSION', bg: ['#18171A', '#27252C'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-maternity-1.svg', w: 600, h: 600, title: 'Victoria In Silk', sub: 'MATERNITY FINE ART FLOW', bg: ['#1E1619', '#302025'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-maternity-2.svg', w: 600, h: 600, title: 'Seraphina', sub: 'MODERN MINIMALIST MATERNITY', bg: ['#1A1715', '#2A241F'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-outdoor-1.svg', w: 600, h: 600, title: 'Whispering Pines', sub: 'FOREST NATURAL LIGHT SESSION', bg: ['#141916', '#1E2822'], icon: 'camera' },
  { path: 'assets/images/portfolio/port-outdoor-2.svg', w: 600, h: 600, title: 'Coastal Horizon', sub: 'SUNSET PACIFICA SESSION', bg: ['#13171B', '#1E252D'], icon: 'camera' },
  { path: 'assets/images/portfolio/port-corporate-1.svg', w: 600, h: 600, title: 'Arthur Vance, Esq.', sub: 'BOARDROOM EXECUTIVE HEADSHOT', bg: ['#12151A', '#1C222B'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-corporate-2.svg', w: 600, h: 600, title: 'Dr. Helen Chen', sub: 'MEDICAL & RESEARCH HEADSHOT', bg: ['#15181A', '#21272A'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-branding-1.svg', w: 600, h: 600, title: 'Maya Lin, Architect', sub: 'CREATIVE DESIGNER PROFILE', bg: ['#1A1619', '#2A2028'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-branding-2.svg', w: 600, h: 600, title: 'David Ross, Author', sub: 'LITERARY PORTRAIT COLLECTION', bg: ['#161513', '#26221E'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-studio-1.svg', w: 600, h: 600, title: 'Rembrandt Light', sub: 'DRAMATIC STUDIO PORTRAIT', bg: ['#111111', '#22201C'], icon: 'portrait' },
  { path: 'assets/images/portfolio/port-studio-2.svg', w: 600, h: 600, title: 'The Velvet Stance', sub: 'GLAMOUR FINE ART PORTRAIT', bg: ['#1C1417', '#2E1F24'], icon: 'portrait' },
  { path: 'assets/images/portfolio/behind-lens.svg', w: 600, h: 400, title: 'Lighting Architecture', sub: '3-POINT SOFTBOX DIAGRAM & SETUP', bg: ['#151619', '#21242A'], icon: 'aperture' },
  { path: 'assets/images/portfolio/fineart-prints.svg', w: 600, h: 400, title: 'Museum Quality Wall Art', sub: 'Hahnemühle Cotton Paper & Custom Frames', bg: ['#1A1613', '#2B231B'], icon: 'award' },
  { path: 'assets/images/portfolio/styling-guide.svg', w: 600, h: 400, title: 'Wardrobe & Styling', sub: 'COLOR HARMONY GUIDELINE SAMPLE', bg: ['#191518', '#28202A'], icon: 'portrait' },
  { path: 'assets/images/portfolio/motion-portraits.svg', w: 600, h: 400, title: '4K Motion Video', sub: 'CINEMATIC STILL & MOTION HYBRIDS', bg: ['#12161A', '#1E252D'], icon: 'camera' },
  { path: 'assets/images/portfolio/cta-bg.svg', w: 1920, h: 500, title: 'Create Your Personal Gallery', sub: 'SCHEDULE A CREATIVE CONSULTATION WITH OUR TEAM', bg: ['#0D0D0F', '#22202A'], icon: 'camera' },

  // packages
  { path: 'assets/images/packages/banner.svg', w: 1920, h: 450, title: 'Packages & Investment', sub: 'TRANSPARENT PRICING • HEIRLOOM INCLUSIONS', bg: ['#111315', '#22262B'], icon: 'aperture' },
  { path: 'assets/images/packages/pkg-family.svg', w: 600, h: 400, title: 'Heirloom Family Collection', sub: 'FULL STUDIO & OUTDOOR SESSION + ALBUM', bg: ['#1A1613', '#2C2219'], icon: 'family' },
  { path: 'assets/images/packages/pkg-newborn.svg', w: 600, h: 400, title: 'Pure Wonder Newborn', sub: '3-HOUR GENTLE SESSION + DIGITAL GALLERY', bg: ['#16181B', '#232830'], icon: 'portrait' },
  { path: 'assets/images/packages/pkg-maternity.svg', w: 600, h: 400, title: 'Goddess Maternity', sub: 'WARDROBE ACCESS & FINE ART CANVAS', bg: ['#1E1619', '#302025'], icon: 'portrait' },
  { path: 'assets/images/packages/pkg-corporate.svg', w: 600, h: 400, title: 'Executive Headshots', sub: 'FAST TURNAROUND & COMMERCIAL LICENSE', bg: ['#12151A', '#1C222B'], icon: 'portrait' },
  { path: 'assets/images/packages/pkg-outdoor.svg', w: 600, h: 400, title: 'Golden Hour Outdoor', sub: 'SCENIC LOCATION + HIGH-RES DIGITALS', bg: ['#141916', '#1E2822'], icon: 'camera' },
  { path: 'assets/images/packages/pkg-custom.svg', w: 600, h: 400, title: 'Bespoke Private Art', sub: 'FULLY TAILORED EXPERIENCE & WALL GALLERIES', bg: ['#191518', '#28202A'], icon: 'aperture' },
  { path: 'assets/images/packages/addon-album.svg', w: 400, h: 300, title: 'Italian Leather Album', sub: 'FLUSH MOUNT HEIRLOOM ALBUMS', bg: ['#181512', '#2A211B'], icon: 'award' },
  { path: 'assets/images/packages/addon-canvas.svg', w: 400, h: 300, title: 'Acrylic Wall Canvas', sub: 'HD ARCHIVAL WALL DISPLAY', bg: ['#14171A', '#20272E'], icon: 'aperture' },
  { path: 'assets/images/packages/addon-makeup.svg', w: 400, h: 300, title: 'Pro Makeup & Hair', sub: 'ON-SITE ARTISTRY STYLING', bg: ['#191517', '#292027'], icon: 'portrait' },
  { path: 'assets/images/packages/cta-bg.svg', w: 1920, h: 500, title: 'Ready To Select Your Package?', sub: 'CONTACT OUR STUDIO MANAGER FOR CUSTOM QUOTES', bg: ['#0E0E10', '#25201A'], icon: 'camera' },

  // blog
  { path: 'assets/images/blog/banner.svg', w: 1920, h: 450, title: 'Journal & Journal Articles', sub: 'PHOTOGRAPHY TIPS • WARDROBE ADVICE • BEHIND THE SCENES', bg: ['#121114', '#24212A'], icon: 'aperture' },
  { path: 'assets/images/blog/blog-featured.svg', w: 900, h: 550, title: 'The Secrets of Master Portrait Lighting', sub: 'HOW LIGHTING CREATES EMOTION & DEPTH IN FINE ART', bg: ['#1A1612', '#2E2218'], icon: 'camera' },
  { path: 'assets/images/blog/blog-1.svg', w: 600, h: 400, title: 'Newborn Session Prep', sub: '7 TIPS FOR A STRESS-FREE STUDIO SHOOT', bg: ['#16181B', '#232830'], icon: 'portrait' },
  { path: 'assets/images/blog/blog-2.svg', w: 600, h: 400, title: 'Family Color Palettes', sub: 'HOW TO COORDINATE OUTFITS WITHOUT MATCHING', bg: ['#1C1713', '#2C2219'], icon: 'family' },
  { path: 'assets/images/blog/blog-3.svg', w: 600, h: 400, title: 'Executive Headshot Tips', sub: 'WHAT TO WEAR FOR A POWERFUL BRAND IMAGE', bg: ['#12151A', '#1C222B'], icon: 'portrait' },
  { path: 'assets/images/blog/blog-4.svg', w: 600, h: 400, title: 'Studio vs Natural Light', sub: 'CHOOSING THE RIGHT AMBIANCE FOR YOUR PORTRAIT', bg: ['#141916', '#1E2822'], icon: 'camera' },
  { path: 'assets/images/blog/blog-5.svg', w: 600, h: 400, title: 'Archival Fine Art Prints', sub: 'WHY PRINTING MATTERS IN THE DIGITAL AGE', bg: ['#191518', '#28202A'], icon: 'award' },
  { path: 'assets/images/blog/blog-6.svg', w: 600, h: 400, title: 'Maternity Session Styling', sub: 'WHEN TO SCHEDULE & DRESS SELECTION GUIDE', bg: ['#1E1619', '#302025'], icon: 'portrait' },
  { path: 'assets/images/blog/blog-7.svg', w: 600, h: 400, title: 'Behind The Lens: Day At LF', sub: 'AN INSIDE LOOK AT OUR SAN FRANCISCO STUDIO', bg: ['#151618', '#22252A'], icon: 'aperture' },
  { path: 'assets/images/blog/cta-bg.svg', w: 1920, h: 500, title: 'Subscribe To The LumiFrame Journal', sub: 'GET STYLING GUIDES & EXCLUSIVE SESSION INVITATIONS', bg: ['#100F12', '#24202B'], icon: 'camera' },

  // contact
  { path: 'assets/images/contact/banner.svg', w: 1920, h: 450, title: 'Contact LumiFrame Studio', sub: 'GET IN TOUCH • RESERVE A SESSION • VISIT US', bg: ['#0F1115', '#1F2530'], icon: 'camera' },
  { path: 'assets/images/contact/map-visual.svg', w: 800, h: 500, title: 'San Francisco Flagship', sub: '450 PORTRAIT WAY, SUITE 800, SAN FRANCISCO, CA', bg: ['#111418', '#1E252E'], icon: 'map' },
  { path: 'assets/images/contact/studio-storefront.svg', w: 600, h: 400, title: 'Studio Entrance', sub: 'VALET PARKING & PRIVATE CLIENT LOUNGE', bg: ['#181512', '#2A211B'], icon: 'aperture' },
  { path: 'assets/images/contact/consultation-room.svg', w: 600, h: 400, title: 'Viewing & Reveal Suite', sub: '4K CINEMATIC PROJECTION & LEATHER SEATING', bg: ['#161519', '#24202B'], icon: 'camera' },
  { path: 'assets/images/contact/cta-bg.svg', w: 1920, h: 500, title: 'We Look Forward To Capturing Your Moments', sub: 'SUBMIT AN ENQUIRY OR CALL US DIRECTLY', bg: ['#0E0D0C', '#282119'], icon: 'camera' },

  // auth
  { path: 'assets/images/auth/login-bg.svg', w: 1920, h: 1080, title: 'LumiFrame Studio Client Portal', sub: 'PRIVATE GALLERY ACCESS & SESSION MANAGEMENT', bg: ['#0A0A0B', '#1E1B17'], icon: 'aperture' },
  { path: 'assets/images/auth/signup-bg.svg', w: 1920, h: 1080, title: 'Join LumiFrame Members Circle', sub: 'EXPRESS BOOKING & EXCLUSIVE PRINT DISCOUNTS', bg: ['#0C0B0E', '#1D1822'], icon: 'camera' },
  { path: 'assets/images/auth/forgot-bg.svg', w: 1920, h: 1080, title: 'Password Recovery', sub: 'SECURE ACCOUNT ACCESS RESTORATION', bg: ['#090B0D', '#151D24'], icon: 'aperture' }
];

let createdCount = 0;
imagesToCreate.forEach(img => {
  const fullPath = path.join(__dirname, img.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const svgContent = createSVG(img.w, img.h, img.title, img.sub, '#C5A059', img.bg, img.icon);
  fs.writeFileSync(fullPath, svgContent, 'utf8');
  createdCount++;
});

console.log(`Successfully generated ${createdCount} unique SVG photography assets across all page folders.`);
