/**
 * Three.js 3D Scene Controller
 * Handles camera, studio lighting, environment maps, particles, mouse parallax & render loop
 */
class CanExperienceScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.initScene();
    this.initLights();
    this.initEnvironment();
    this.initCan();
    this.initParticles();
    this.initEvents();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();

    const isMobile = window.innerWidth < 768;
    this.camera = new THREE.PerspectiveCamera(
      isMobile ? 54 : 38,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, isMobile ? 10.6 : 9.2);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    // 1. Soft Ambient base
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(this.ambientLight);

    // 2. Key Light (Crisp directional light from top right)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.keyLight.position.set(5, 7, 5);
    this.scene.add(this.keyLight);

    // 3. Fill Light (Soft cool blue/cyan from left)
    this.fillLight = new THREE.DirectionalLight(0xd0e8ff, 1.2);
    this.fillLight.position.set(-6, -2, 4);
    this.scene.add(this.fillLight);

    // 4. Rim / Kicker Light (High-intensity light from back right to catch metallic edge)
    this.rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    this.rimLight.position.set(3, 4, -5);
    this.scene.add(this.rimLight);

    // 5. Dynamic Flavor Accent Light (changes color with flavor)
    this.accentLight = new THREE.PointLight(0xc084fc, 3.5, 15);
    this.accentLight.position.set(-2.5, 0, 3.5);
    this.scene.add(this.accentLight);

    // 6. Secondary soft accent
    this.accentLight2 = new THREE.PointLight(0xa855f7, 2.0, 12);
    this.accentLight2.position.set(2.5, -2, 2.5);
    this.scene.add(this.accentLight2);
  }

  initEnvironment() {
    // Generate high-contrast studio softbox texture for metallic reflections
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');

    // Dark studio gradient
    const grad = ctx.createLinearGradient(0, 0, 0, envCanvas.height);
    grad.addColorStop(0, '#1a1a24');
    grad.addColorStop(0.5, '#0a0a0f');
    grad.addColorStop(1, '#050508');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, envCanvas.width, envCanvas.height);

    // Softbox 1 (White key strip)
    ctx.fillStyle = '#ffffff';
    ctx.filter = 'blur(20px)';
    ctx.fillRect(150, 80, 180, 350);

    // Softbox 2 (Secondary fill strip)
    ctx.fillStyle = '#90b0e0';
    ctx.filter = 'blur(30px)';
    ctx.fillRect(600, 100, 150, 300);

    // Top softbox
    ctx.fillStyle = '#ffffff';
    ctx.filter = 'blur(15px)';
    ctx.fillRect(350, 0, 300, 60);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = envTexture;
  }

  initCan() {
    this.can = new BeverageCan('litchi');
    this.scene.add(this.can.group);

    // Group wrapper for scroll animations & parallax
    this.canWrapper = this.can.group;
  }

  initParticles() {
    // Floating carbonation bubbles & glowing cyber spores
    const count = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      scales[i] = Math.random() * 0.08 + 0.03;
      speeds[i] = Math.random() * 0.4 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pGrad.addColorStop(0.3, 'rgba(192, 132, 252, 0.6)');
    pGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTex = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.18,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.particleSpeeds = speeds;
    this.scene.add(this.particleSystem);
  }

  initEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Touch support for mobile phones
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        this.mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });
  }

  onMouseMove(e) {
    // Normalized mouse (-1 to 1)
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onWindowResize() {
    const isMobile = window.innerWidth < 768;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.fov = isMobile ? 54 : 38;
    this.camera.position.z = isMobile ? 10.6 : 9.2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setFlavorTheme(flavorKey) {
    const flavor = FLAVORS[flavorKey];
    if (!flavor) return;

    this.can.setFlavor(flavorKey);

    // Smoothly transition accent lights
    if (window.gsap) {
      const targetColor = new THREE.Color(flavor.ambientLight);
      gsap.to(this.accentLight.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.8,
        ease: 'power2.out'
      });
      gsap.to(this.accentLight2.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.8,
        ease: 'power2.out'
      });
    } else {
      this.accentLight.color.setHex(flavor.ambientLight);
      this.accentLight2.color.setHex(flavor.ambientLight);
    }
  }

  /**
   * Projects a 3D coordinate from the can group into 2D screen pixels (x, y)
   * Used for locking UI callout lines and badges to points on the can
   */
  projectToScreen(localPos) {
    const worldPos = localPos.clone();
    this.canWrapper.localToWorld(worldPos);

    const projected = worldPos.clone().project(this.camera);

    const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

    return { x, y, z: projected.z };
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth mouse parallax damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Apply subtle parallax to can group rotation & position
    if (this.canWrapper) {
      this.canWrapper.rotation.x = (this.canWrapper.baseRotX || 0) + this.mouse.y * 0.12;
      this.canWrapper.rotation.z = (this.canWrapper.baseRotZ || 0) - this.mouse.x * 0.08;

      // Gentle floating / breathing idle animation
      const floatY = Math.sin(elapsedTime * 1.5) * 0.08;
      this.canWrapper.position.y = (this.canWrapper.basePosY || 0) + floatY;
    }

    // 2. Animate floating particles
    if (this.particleSystem) {
      const posAttr = this.particleSystem.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        y += this.particleSpeeds[i] * delta * 0.6;
        if (y > 4.5) y = -4.5;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      this.particleSystem.rotation.y = elapsedTime * 0.03;
    }

    // 3. Render
    this.renderer.render(this.scene, this.camera);

    // Fire callback if external listeners need screen positions (like hotspots)
    if (this.onPostRender) {
      this.onPostRender();
    }
  }
}
