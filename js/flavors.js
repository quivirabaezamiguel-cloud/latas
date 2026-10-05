// Flavor configurations & dynamic 4K texture generator for the 3D Can
const FLAVORS = {
  litchi: {
    id: 'litchi',
    name: 'DOUBLE LITCHI',
    tagline: 'WILD TROPICAL NOOTROPICS',
    badge: 'EDITION LIMITÉE',
    primaryColor: '#a855f7',
    secondaryColor: '#ec4899',
    accentColor: '#c084fc',
    bgGradient: 'radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.22) 0%, rgba(15, 7, 24, 0.8) 55%, #050208 100%)',
    ambientLight: 0xb566ff,
    description: 'Infusion botanique de litchi sauvage d\'Asie et grenade acidulée. Formulée pour stimuler le flow créatif sans aucun pic de sucre.',
    nutrition: {
      sugar: '0.0g',
      calories: '4 kcal',
      caffeine: '160mg',
      nootropics: '500mg'
    },
    ingredients: ['Eau gazéifiée des Alpes', 'Pur jus de litchi fermenté', 'L-Théanine', 'Crinière de Lion bio', 'Caféine naturelle de thé vert', 'Extrait de Stevia'],
    accentHex: '#d946ef'
  },
  kiwi: {
    id: 'kiwi',
    name: 'KIWI CONCOMBRE',
    tagline: 'CRISP BOTANICAL BOOST',
    badge: 'BEST SELLER',
    primaryColor: '#22c55e',
    secondaryColor: '#10b981',
    accentColor: '#4ade80',
    bgGradient: 'radial-gradient(circle at 50% 40%, rgba(34, 197, 94, 0.2) 0%, rgba(5, 20, 10, 0.8) 55%, #020704 100%)',
    ambientLight: 0x34d399,
    description: 'Électrolytes purs et concombre pressé à froid avec un zeste de kiwi sauvage. Clarté mentale immédiate et hydratation cellulaire maximale.',
    nutrition: {
      sugar: '0.0g',
      calories: '5 kcal',
      caffeine: '140mg',
      nootropics: '600mg'
    },
    ingredients: ['Eau de source osmosée', 'Extrait de kiwi vert', 'Jus de concombre frais', 'Magnésium marin', 'Caféine de Yerba Maté', 'Zinc biodisponible'],
    accentHex: '#22c55e'
  },
  orange: {
    id: 'orange',
    name: 'SOLAR BLOOD ORANGE',
    tagline: 'HIGH VIBRATION CITRUS',
    badge: 'SIGNATURE 2026',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    accentColor: '#fb923c',
    bgGradient: 'radial-gradient(circle at 50% 40%, rgba(249, 115, 22, 0.22) 0%, rgba(25, 8, 4, 0.8) 55%, #0a0302 100%)',
    ambientLight: 0xfb923c,
    description: 'Oranges sanguines de Sicile infusées au gingembre rouge et racine de Rhodiola. Énergie explosive sans anxiété ni crash.',
    nutrition: {
      sugar: '0.0g',
      calories: '6 kcal',
      caffeine: '180mg',
      nootropics: '450mg'
    },
    ingredients: ['Eau de glacier pétillante', 'Oranges sanguines siciliennes', 'Rhodiola Rosea', 'Ginseng rouge coréen', 'Vitamines B-Complex', 'Arômes naturels'],
    accentHex: '#f97316'
  },
  frost: {
    id: 'frost',
    name: 'ARCTIC FROST',
    tagline: 'SUB-ZERO FOCUS MATRIX',
    badge: 'LAB PROTOTYPE',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    accentColor: '#38bdf8',
    bgGradient: 'radial-gradient(circle at 50% 40%, rgba(6, 182, 212, 0.22) 0%, rgba(3, 15, 30, 0.8) 55%, #01060e 100%)',
    ambientLight: 0x38bdf8,
    description: 'Yuzu givré et menthe des glaciers avec complexe d\'acides aminés. Refroidit le système nerveux et aiguise les réflexes.',
    nutrition: {
      sugar: '0.0g',
      calories: '3 kcal',
      caffeine: '175mg',
      nootropics: '550mg'
    },
    ingredients: ['Eau des fjords ionisée', 'Zeste de Yuzu bio', 'Menthe polaire', 'Alpha-GPC', 'Tyrosine pure', 'Électrolytes de l\'Himalaya'],
    accentHex: '#00f0ff'
  }
};

/**
 * Creates high-resolution procedural texture for the beverage can
 * Renders metallic branding, barcodes, nutrition table, typography & foil accents
 */
function createCanTexture(flavorKey) {
  const flavor = FLAVORS[flavorKey] || FLAVORS.litchi;
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Dark Brushed Metallic Aluminum Background
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  bgGrad.addColorStop(0.00, '#0d0d11');
  bgGrad.addColorStop(0.20, '#15151c');
  bgGrad.addColorStop(0.40, '#0c0c10');
  bgGrad.addColorStop(0.60, '#1a1a24');
  bgGrad.addColorStop(0.85, '#0e0e13');
  bgGrad.addColorStop(1.00, '#0d0d11');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro-texture / brushed metal lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  for (let i = 0; i < canvas.height; i += 3) {
    if (Math.random() > 0.4) {
      ctx.fillRect(0, i, canvas.width, 1);
    }
  }

  // 2. Flavor Ambient Gradient Splashes on the can surface
  const splash = ctx.createRadialGradient(700, 512, 50, 700, 512, 600);
  splash.addColorStop(0, flavor.primaryColor + '55');
  splash.addColorStop(0.5, flavor.secondaryColor + '22');
  splash.addColorStop(1, 'transparent');
  ctx.fillStyle = splash;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle diagonal geometric patterns
  ctx.save();
  ctx.strokeStyle = flavor.accentColor + '18';
  ctx.lineWidth = 1.5;
  for (let x = -500; x < canvas.width + 500; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 500, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

  // Top and Bottom metallic foil accent bands
  const bandGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  bandGrad.addColorStop(0, '#777');
  bandGrad.addColorStop(0.25, '#fff');
  bandGrad.addColorStop(0.5, '#666');
  bandGrad.addColorStop(0.75, '#eee');
  bandGrad.addColorStop(1, '#777');

  ctx.fillStyle = flavor.primaryColor;
  ctx.fillRect(0, 40, canvas.width, 14);
  ctx.fillRect(0, canvas.height - 54, canvas.width, 14);

  ctx.fillStyle = bandGrad;
  ctx.fillRect(0, 54, canvas.width, 4);
  ctx.fillRect(0, canvas.height - 58, canvas.width, 4);

  // ------------------------------------------------------------------------
  // FRONT OF CAN (Around X = 500 to 900)
  // ------------------------------------------------------------------------
  ctx.save();
  ctx.translate(680, 512);

  // Vertical "OHIO" or "VORTEX" Mega Display Text
  ctx.rotate(-Math.PI / 2);

  // Glowing backdrop for the brand
  ctx.shadowColor = flavor.accentHex;
  ctx.shadowBlur = 35;

  ctx.font = '900 190px "Syne", "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Fill in vibrant gradient with metallic foil reflection
  const textGrad = ctx.createLinearGradient(0, -100, 0, 100);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.4, '#f5f5f7');
  textGrad.addColorStop(0.6, flavor.accentHex);
  textGrad.addColorStop(1, '#ffffff');

  ctx.fillStyle = textGrad;
  ctx.fillText('OHIO', 0, 0);

  // Chrome Stroke overlay
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeText('OHIO', 0, 0);

  ctx.restore();

  // Subtitle / Badge on front
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('CLEAN FLOW ENERGY', 680, 150);

  // Pill badge for the flavor name
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeStyle = flavor.accentHex;
  ctx.lineWidth = 2;
  roundRect(ctx, 480, 830, 400, 44, 22, true, true);

  ctx.fillStyle = flavor.accentColor;
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText(flavor.name, 680, 859);

  // Volume
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '500 16px "Space Grotesk", sans-serif';
  ctx.fillText('330 ML  •  11.2 FL OZ', 680, 920);
  ctx.restore();

  // ------------------------------------------------------------------------
  // BACK OF CAN (Around X = 1400 to 1850) - NUTRITION & SPECS
  // ------------------------------------------------------------------------
  const backX = 1580;

  // Title: VALEURS NUTRITIONNELLES / NUTRITIONAL FACTS
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('VALEURS NUTRITIONNELLES', backX - 220, 140);
  ctx.font = '500 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('Pour 100ml / Par canette (330ml)', backX - 220, 165);

  // Table separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(backX - 220, 180);
  ctx.lineTo(backX + 220, 180);
  ctx.stroke();

  // Nutrition rows
  const rows = [
    ['Énergie / Calories', '1.2 kcal / 4.0 kcal'],
    ['Matières grasses', '0.0g'],
    ['dont acides gras saturés', '0.0g'],
    ['Glucides totaux', '0.0g'],
    ['dont Sucres naturels', '0.0g (0% AJR)'],
    ['Protéines bioactives', '0.2g'],
    ['Sel / Électrolytes', '0.08g'],
    ['Caféine pure thé vert', flavor.nutrition.caffeine],
    ['L-Théanine + Nootropiques', flavor.nutrition.nootropics],
    ['Vitamine B6 / B12', '100% VNR']
  ];

  let currentY = 210;
  rows.forEach(([label, val]) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '500 15px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, backX - 220, currentY);

    ctx.fillStyle = flavor.accentColor;
    ctx.font = '700 15px "Space Grotesk", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val, backX + 220, currentY);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(backX - 220, currentY + 8);
    ctx.lineTo(backX + 220, currentY + 8);
    ctx.stroke();

    currentY += 28;
  });

  // Highlight Box: ZERO BULLSHIT CERTIFICATION
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = flavor.accentHex;
  ctx.lineWidth = 1.5;
  roundRect(ctx, backX - 220, currentY + 20, 440, 90, 8, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ FORMULE 100% TRANSPARENTE', backX, currentY + 52);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '500 13px "Space Grotesk", sans-serif';
  ctx.fillText('Sans taurine • Sans sucre raffiné • Sans colorant', backX, currentY + 80);

  // Ingredients text block
  currentY += 140;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '400 11px sans-serif';
  ctx.textAlign = 'left';
  const ingText = 'INGRÉDIENTS: ' + flavor.ingredients.join(', ') + '. Sans conservateur. À consommer très frais. Fabriqué en France.';
  wrapText(ctx, ingText, backX - 220, currentY, 440, 16);

  // Barcode & Recycle Icon at bottom back
  drawBarcode(ctx, backX - 220, currentY + 85, 220, 60);

  // Recycle badge
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(backX + 160, currentY + 115, 25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 10px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ALU 100%', backX + 160, currentY + 112);
  ctx.fillText('RECYCLABLE', backX + 160, currentY + 125);

  return canvas;
}

/**
 * Creates normal / bump map for condensation droplets & metallic seams
 */
function createCanBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw condensation droplets
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 4 + 1.5;

    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#a0a0a0');
    grad.addColorStop(1, '#606060');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

// Helpers
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function drawBarcode(ctx, x, y, w, h) {
  ctx.fillStyle = '#ffffff';
  let curX = x;
  while (curX < x + w) {
    const barWidth = Math.random() > 0.6 ? 3 : 1.5;
    ctx.fillRect(curX, y, barWidth, h);
    curX += barWidth + (Math.random() > 0.4 ? 2 : 4);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '600 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('7 439021 884029', x + w / 2, y + h + 14);
}
