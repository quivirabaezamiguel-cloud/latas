/**
 * 3D Aluminum Beverage Can Mesh Constructor
 * Builds realistic sleek 330ml can with authentic rims, lid, pull-tab & PBR materials
 */
class BeverageCan {
  constructor(initialFlavor = 'litchi') {
    this.group = new THREE.Group();
    this.currentFlavor = initialFlavor;
    this.textures = {};
    this.materials = {};

    this.initTextures();
    this.buildGeometry();
  }

  initTextures() {
    // Generate bump map for condensation droplets
    const bumpCanvas = createCanBumpMap();
    this.bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    this.bumpTexture.wrapS = THREE.RepeatWrapping;
    this.bumpTexture.wrapT = THREE.RepeatWrapping;
    this.bumpTexture.repeat.set(2, 2);

    // Generate initial canvas texture
    const initialCanvas = createCanTexture(this.currentFlavor);
    this.bodyTexture = new THREE.CanvasTexture(initialCanvas);
    this.bodyTexture.wrapS = THREE.RepeatWrapping;
    this.bodyTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.bodyTexture.repeat.set(1, 1);
    this.bodyTexture.flipY = false;
  }

  buildGeometry() {
    // Standard 330ml sleek can dimensions
    const radius = 1.35;
    const height = 4.8;
    const segments = 64;

    // Materials
    // 1. Polished raw aluminum for rim, lid, pull tab & base
    this.aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8dce0,
      metalness: 0.95,
      roughness: 0.22,
      envMapIntensity: 1.5
    });

    // 2. Can Body with printed label & clearcoat lacquer
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      map: this.bodyTexture,
      bumpMap: this.bumpTexture,
      bumpScale: 0.015,
      metalness: 0.82,
      roughness: 0.28,
      envMapIntensity: 1.4
    });

    // --- A. MAIN CYLINDRICAL BODY ---
    const bodyGeom = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);
    // Align texture nicely around cylinder
    this.bodyMesh = new THREE.Mesh(bodyGeom, this.bodyMaterial);
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // --- B. UPPER TAPER (SHOULDER) ---
    const shoulderHeight = 0.45;
    const shoulderTopRadius = 1.18;
    const shoulderGeom = new THREE.CylinderGeometry(shoulderTopRadius, radius, shoulderHeight, segments, 1, true);
    const shoulderMesh = new THREE.Mesh(shoulderGeom, this.aluminumMaterial);
    shoulderMesh.position.y = height / 2 + shoulderHeight / 2;
    this.group.add(shoulderMesh);

    // --- C. TOP RIM (CHIME) ---
    const rimGeom = new THREE.TorusGeometry(shoulderTopRadius, 0.08, 16, segments);
    rimGeom.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeom, this.aluminumMaterial);
    rimMesh.position.y = height / 2 + shoulderHeight;
    this.group.add(rimMesh);

    // --- D. SUNKEN LID ---
    const lidGeom = new THREE.CylinderGeometry(shoulderTopRadius - 0.05, shoulderTopRadius - 0.05, 0.08, segments);
    const lidMesh = new THREE.Mesh(lidGeom, this.aluminumMaterial);
    lidMesh.position.y = height / 2 + shoulderHeight - 0.05;
    this.group.add(lidMesh);

    // Decorative inner groove on the lid
    const lidGrooveGeom = new THREE.TorusGeometry(0.75, 0.03, 12, 48);
    lidGrooveGeom.rotateX(Math.PI / 2);
    const lidGrooveMesh = new THREE.Mesh(lidGrooveGeom, this.aluminumMaterial);
    lidGrooveMesh.position.y = height / 2 + shoulderHeight - 0.02;
    this.group.add(lidGrooveMesh);

    // --- E. 3D PULL TAB ---
    this.buildPullTab(height / 2 + shoulderHeight - 0.02);

    // --- F. LOWER TAPER (BOTTOM BEVEL) ---
    const bottomBevelHeight = 0.35;
    const bottomRadius = 1.15;
    const bottomBevelGeom = new THREE.CylinderGeometry(radius, bottomRadius, bottomBevelHeight, segments, 1, true);
    const bottomBevelMesh = new THREE.Mesh(bottomBevelGeom, this.aluminumMaterial);
    bottomBevelMesh.position.y = -height / 2 - bottomBevelHeight / 2;
    this.group.add(bottomBevelMesh);

    // --- G. BOTTOM CONCAVE DOME ---
    const bottomDomeGeom = new THREE.CylinderGeometry(bottomRadius, bottomRadius * 0.9, 0.1, segments);
    const bottomDomeMesh = new THREE.Mesh(bottomDomeGeom, this.aluminumMaterial);
    bottomDomeMesh.position.y = -height / 2 - bottomBevelHeight - 0.05;
    this.group.add(bottomDomeMesh);

    // Soft fake ambient contact shadow underneath
    const shadowGeom = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    sGrad.addColorStop(1, 'transparent');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    this.contactShadow = new THREE.Mesh(shadowGeom, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = -height / 2 - bottomBevelHeight - 0.15;
    this.group.add(this.contactShadow);

    // Default rotation to present the front branding
    this.group.rotation.y = Math.PI * 0.5;
  }

  buildPullTab(yPos) {
    const tabGroup = new THREE.Group();

    // Rivet center
    const rivetGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16);
    const rivet = new THREE.Mesh(rivetGeom, this.aluminumMaterial);
    tabGroup.add(rivet);

    // Tab lever shape
    const tabShape = new THREE.Shape();
    tabShape.moveTo(-0.25, -0.4);
    tabShape.lineTo(0.25, -0.4);
    tabShape.lineTo(0.22, 0.6);
    tabShape.lineTo(-0.22, 0.6);
    tabShape.closePath();

    // Tab hole
    const holePath = new THREE.Path();
    holePath.moveTo(-0.12, 0.1);
    holePath.lineTo(0.12, 0.1);
    holePath.lineTo(0.1, 0.45);
    holePath.lineTo(-0.1, 0.45);
    holePath.closePath();
    tabShape.holes.push(holePath);

    const extrudeSettings = {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };

    const tabGeom = new THREE.ExtrudeGeometry(tabShape, extrudeSettings);
    tabGeom.rotateX(-Math.PI / 2);
    const tabMesh = new THREE.Mesh(tabGeom, this.aluminumMaterial);
    tabMesh.position.set(0, 0.02, -0.15);
    tabGroup.add(tabMesh);

    tabGroup.position.set(0, yPos + 0.03, 0);
    this.group.add(tabGroup);
  }

  setFlavor(flavorKey) {
    if (this.currentFlavor === flavorKey) return;
    this.currentFlavor = flavorKey;

    // Generate new canvas texture
    const newCanvas = createCanTexture(flavorKey);
    this.bodyTexture.image = newCanvas;
    this.bodyTexture.needsUpdate = true;
  }
}
