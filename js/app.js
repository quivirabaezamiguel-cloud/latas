/**
 * Main Application Orchestrator
 * Binds 3D WebGL scene, UI event listeners, dynamic 3D hotspots, flavor switcher, and cart
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Scene
  const scene = new CanExperienceScene('webgl-canvas-container');

  // 2. Initialize Scroll Choreography
  const scrollCtrl = new ScrollController(scene);

  // 3. State Management
  let currentFlavor = 'litchi';
  let selectedPack = 12;
  let packQuantity = 1;
  let cartCount = 0;

  const packPrices = {
    4: 14.99,
    12: 38.99,
    24: 69.99
  };

  // ---------------------------------------------------------------------------
  // 3D Hotspot Coordinates & SVG Connector Lines
  // ---------------------------------------------------------------------------
  const hotspotsData = [
    {
      id: 'hotspot-sugar',
      localPos: new THREE.Vector3(0.0, 0.6, 1.35),
      cardId: 'card-sugar',
      lineId: 'line-sugar'
    },
    {
      id: 'hotspot-caffeine',
      localPos: new THREE.Vector3(0.0, -0.4, 1.35),
      cardId: 'card-caffeine',
      lineId: 'line-caffeine'
    },
    {
      id: 'hotspot-naturel',
      localPos: new THREE.Vector3(0.0, -1.3, 1.35),
      cardId: 'card-naturel',
      lineId: 'line-naturel'
    }
  ];

  const svgOverlay = document.getElementById('hotspots-svg');

  // Attach post-render callback to project 3D points to 2D screen positions
  scene.onPostRender = () => {
    if (!document.body.classList.contains('show-hotspots')) return;

    hotspotsData.forEach((item) => {
      const screenPos = scene.projectToScreen(item.localPos);
      const dotEl = document.getElementById(item.id);
      const cardEl = document.getElementById(item.cardId);
      const lineEl = document.getElementById(item.lineId);

      if (dotEl && cardEl && lineEl) {
        // Position the pulsing dot in screen coordinates
        dotEl.style.transform = `translate3d(${screenPos.x}px, ${screenPos.y}px, 0)`;

        // Get card bounding box
        const cardRect = cardEl.getBoundingClientRect();
        const cardAnchorX = cardRect.left; // Connect to left side of card
        const cardAnchorY = cardRect.top + cardRect.height / 2;

        // Draw curved SVG bezier line from 3D dot to card
        const dx = cardAnchorX - screenPos.x;
        const cp1x = screenPos.x + dx * 0.45;
        const cp1y = screenPos.y;
        const cp2x = screenPos.x + dx * 0.55;
        const cp2y = cardAnchorY;

        lineEl.setAttribute(
          'd',
          `M ${screenPos.x} ${screenPos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cardAnchorX} ${cardAnchorY}`
        );
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Flavor Switcher System
  // ---------------------------------------------------------------------------
  function switchFlavor(flavorKey) {
    if (flavorKey === currentFlavor) return;
    currentFlavor = flavorKey;
    const data = FLAVORS[flavorKey];
    if (!data) return;

    // Play sounds
    if (window.soundEngine) {
      window.soundEngine.playSelect();
    }

    // 3D Scene updates
    scene.setFlavorTheme(flavorKey);
    scrollCtrl.spinCan360();

    // Update CSS variables & background atmosphere
    document.documentElement.style.setProperty('--color-primary', data.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', data.secondaryColor);
    document.documentElement.style.setProperty('--color-accent', data.accentColor);
    document.documentElement.style.setProperty('--color-accent-hex', data.accentHex);
    document.getElementById('ambient-bg').style.background = data.bgGradient;

    // Update Text & UI Badges
    document.querySelectorAll('.flavor-name-dynamic').forEach((el) => {
      el.textContent = data.name;
    });
    document.querySelectorAll('.flavor-tagline-dynamic').forEach((el) => {
      el.textContent = data.tagline;
    });
    document.querySelectorAll('.flavor-badge-dynamic').forEach((el) => {
      el.textContent = data.badge;
    });
    document.querySelectorAll('.flavor-desc-dynamic').forEach((el) => {
      el.textContent = data.description;
    });

    // Update active state in switcher UI
    document.querySelectorAll('.flavor-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.flavor === flavorKey);
    });
    document.querySelectorAll('.flavor-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.flavor === flavorKey);
    });

    // Update nutrition stats
    document.getElementById('stat-sugar').textContent = data.nutrition.sugar;
    document.getElementById('stat-caffeine').textContent = data.nutrition.caffeine;
    document.getElementById('stat-nootropics').textContent = data.nutrition.nootropics;
  }

  // Bind flavor tabs & cards
  document.querySelectorAll('[data-flavor]').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const flavorKey = elem.dataset.flavor;
      switchFlavor(flavorKey);
    });
  });

  // ---------------------------------------------------------------------------
  // Audio Toggle Button
  // ---------------------------------------------------------------------------
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleSound();
      soundBtn.classList.toggle('active', isPlaying);
      const textEl = soundBtn.querySelector('.sound-btn-text');
      if (textEl) {
        textEl.textContent = isPlaying ? 'AUDIO ON' : 'AUDIO OFF';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // WhatsApp Checkout & Merchant Phone System
  // ---------------------------------------------------------------------------
  let merchantPhone = localStorage.getItem('ohio_wsp_phone') || '5491123456789';

  function updateMerchantDisplay() {
    const displayEl = document.getElementById('current-wsp-display');
    if (displayEl) {
      displayEl.textContent = `📲 Recibe pedidos al: +${merchantPhone}`;
    }
  }
  updateMerchantDisplay();

  const configPhoneBtn = document.getElementById('config-wsp-phone-btn');
  if (configPhoneBtn) {
    configPhoneBtn.addEventListener('click', () => {
      const userPhone = prompt(
        'Ingresa tu número de WhatsApp con código de país (sin + ni espacios, ej: 5491123456789):',
        merchantPhone
      );
      if (userPhone && userPhone.trim().length >= 8) {
        merchantPhone = userPhone.replace(/[^0-9]/g, '');
        localStorage.setItem('ohio_wsp_phone', merchantPhone);
        updateMerchantDisplay();
        alert(`¡Número actualizado! Ahora los pedidos llegarán a: +${merchantPhone}`);
      }
    });
  }

  function launchWhatsAppCheckout() {
    if (window.soundEngine) {
      window.soundEngine.playCanOpen();
    }

    const flavor = FLAVORS[currentFlavor];
    const customerName = document.getElementById('customer-name')?.value.trim() || 'No especificado';
    const customerAddress = document.getElementById('customer-address')?.value.trim() || 'A coordinar';
    const totalPrice = (packPrices[selectedPack] * packQuantity).toFixed(2);

    const message = 
`👋 *¡Hola! Quiero hacer un pedido desde la web de OHIO:*

🥤 *Producto:* OHIO Clean Flow Energy
⚡ *Sabor:* ${flavor.name}
📦 *Formato:* Pack de ${selectedPack} latas
🔢 *Cantidad:* ${packQuantity} pack(s)
💰 *Total:* $${totalPrice}

👤 *Cliente:* ${customerName}
📍 *Entrega:* ${customerAddress}

¿Me confirman disponibilidad y datos de pago? ¡Muchas gracias!`;

    const cleanPhone = merchantPhone.replace(/[^0-9]/g, '');
    const wspUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab/app
    window.open(wspUrl, '_blank');
  }

  // Bind WhatsApp order buttons
  const wspOrderBtn = document.getElementById('order-whatsapp-btn');
  if (wspOrderBtn) {
    wspOrderBtn.addEventListener('click', launchWhatsAppCheckout);
  }

  const cartWspCheckoutBtn = document.getElementById('cart-wsp-checkout-btn');
  if (cartWspCheckoutBtn) {
    cartWspCheckoutBtn.addEventListener('click', launchWhatsAppCheckout);
  }

  const stickyWspBtn = document.getElementById('sticky-wsp-btn');
  if (stickyWspBtn) {
    stickyWspBtn.addEventListener('click', () => {
      const orderSec = document.getElementById('section-order');
      if (orderSec) {
        orderSec.scrollIntoView({ behavior: 'smooth' });
        // Focus name input if available
        setTimeout(() => {
          document.getElementById('customer-name')?.focus();
        }, 600);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Pack Selector & Cart System
  // ---------------------------------------------------------------------------
  function updateOrderDisplay() {
    const basePrice = packPrices[selectedPack];
    const totalPrice = (basePrice * packQuantity).toFixed(2);
    const priceText = `$${totalPrice}`;

    document.getElementById('order-total-price').textContent = priceText;
    document.getElementById('pack-qty-display').textContent = packQuantity;

    // Mobile sticky bar price update
    const stickyPriceEl = document.getElementById('sticky-price-display');
    if (stickyPriceEl) {
      stickyPriceEl.textContent = priceText;
    }
  }

  document.querySelectorAll('.pack-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pack-option-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPack = parseInt(btn.dataset.pack, 10);
      if (window.soundEngine) window.soundEngine.playClick();
      updateOrderDisplay();
    });
  });

  const qtyMinusBtn = document.getElementById('qty-minus');
  const qtyPlusBtn = document.getElementById('qty-plus');

  if (qtyMinusBtn && qtyPlusBtn) {
    qtyMinusBtn.addEventListener('click', () => {
      if (packQuantity > 1) {
        packQuantity--;
        if (window.soundEngine) window.soundEngine.playClick();
        updateOrderDisplay();
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      if (packQuantity < 20) {
        packQuantity++;
        if (window.soundEngine) window.soundEngine.playClick();
        updateOrderDisplay();
      }
    });
  }

  // Pre-Order CTA Button
  const orderBtn = document.getElementById('order-submit-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBadge = document.getElementById('cart-badge');

  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      // Crack open can sound effect!
      if (window.soundEngine) {
        window.soundEngine.playCanOpen();
      }

      // Add to cart badge
      cartCount += packQuantity;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.classList.add('pulse');
        setTimeout(() => cartBadge.classList.remove('pulse'), 600);
      }

      // Fill Drawer details
      const activeFlavor = FLAVORS[currentFlavor];
      document.getElementById('cart-flavor-name').textContent = activeFlavor.name;
      document.getElementById('cart-pack-details').textContent = `Pack de ${selectedPack} canettes (${packQuantity}x)`;
      document.getElementById('cart-subtotal').textContent = `$${(packPrices[selectedPack] * packQuantity).toFixed(2)}`;

      // Open drawer
      if (cartDrawer) {
        cartDrawer.classList.add('open');
      }
    });
  }

  if (cartCloseBtn && cartDrawer) {
    cartCloseBtn.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  });

  // Initial calculation
  updateOrderDisplay();
});
