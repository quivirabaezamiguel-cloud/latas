/**
 * GSAP + ScrollTrigger Choreographer
 * Links 3D can rotation, camera movement, scale, and HTML typography directly to scroll
 */
class ScrollController {
  constructor(experienceScene) {
    this.scene = experienceScene;
    this.can = experienceScene.canWrapper;
    this.camera = experienceScene.camera;

    this.initLenis();
    this.initScrollAnimations();
  }

  initLenis() {
    // Smooth inertial scrolling via Lenis
    if (window.Lenis) {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false
      });

      this.lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Initial can resting values
    this.can.baseRotX = 0.05;
    this.can.baseRotZ = -0.05;
    this.can.basePosY = 0;

    // Timeline spanning the entire page scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          // Play subtle swoosh sound on notable scroll velocities
          if (window.soundEngine && Math.abs(self.getVelocity()) > 800) {
            window.soundEngine.playSwoosh();
          }
        }
      }
    });

    // =========================================================================
    // STEP 1: Hero to Section 2 (Flavor Showcase)
    // Can glides right, rotates smoothly, tilts, camera pushes slightly in
    // =========================================================================
    tl.to(this.can.position, {
      x: 1.7,
      y: -0.1,
      z: 0.5,
      ease: 'power1.inOut'
    }, 0.05);

    tl.to(this.can.rotation, {
      y: Math.PI * 0.78,
      ease: 'power1.inOut'
    }, 0.05);

    tl.to(this.can, {
      baseRotX: 0.1,
      baseRotZ: -0.18,
      ease: 'power1.inOut'
    }, 0.05);

    tl.to(this.camera.position, {
      z: 8.4,
      ease: 'power1.inOut'
    }, 0.05);

    // =========================================================================
    // STEP 2: Section 2 to Section 3 (Nutritional Facts / Callouts)
    // Can rotates 180 deg to show nutritional table and barcode on the back!
    // Can moves to the left side
    // =========================================================================
    tl.to(this.can.position, {
      x: -1.7,
      y: 0.0,
      z: 0.2,
      ease: 'power1.inOut'
    }, 0.30);

    tl.to(this.can.rotation, {
      y: Math.PI * 1.55,
      ease: 'power1.inOut'
    }, 0.30);

    tl.to(this.can, {
      baseRotX: 0.0,
      baseRotZ: 0.05,
      ease: 'power1.inOut'
    }, 0.30);

    tl.to(this.camera.position, {
      z: 8.0,
      ease: 'power1.inOut'
    }, 0.30);

    // Trigger hotspot lines opacity
    ScrollTrigger.create({
      trigger: '#section-nutrition',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => document.body.classList.add('show-hotspots'),
      onLeave: () => document.body.classList.remove('show-hotspots'),
      onEnterBack: () => document.body.classList.add('show-hotspots'),
      onLeaveBack: () => document.body.classList.remove('show-hotspots')
    });

    // =========================================================================
    // STEP 3: Section 3 to Section 4 ("ZERO BULLSHIT" / Macro Close-Up)
    // Low camera angle looking UP at the pull-tab & lid rim
    // =========================================================================
    tl.to(this.can.position, {
      x: 0,
      y: -1.8,
      z: 1.5,
      ease: 'power2.inOut'
    }, 0.58);

    tl.to(this.can.rotation, {
      y: Math.PI * 0.35,
      ease: 'power2.inOut'
    }, 0.58);

    tl.to(this.can, {
      baseRotX: 0.85, // Tilting forward so top lid is in full dramatic view
      baseRotZ: -0.15,
      ease: 'power2.inOut'
    }, 0.58);

    tl.to(this.camera.position, {
      z: 6.8,
      ease: 'power2.inOut'
    }, 0.58);

    // Parallax background marquee
    gsap.to('#marquee-strip', {
      xPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#section-manifesto',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      }
    });

    // =========================================================================
    // STEP 4: Section 4 to Section 5 (Flavor Multiverse Carousel)
    // Can returns to center, level angle, ready for interactive spin
    // =========================================================================
    tl.to(this.can.position, {
      x: 0,
      y: 0.2,
      z: 0.5,
      ease: 'power2.inOut'
    }, 0.78);

    tl.to(this.can.rotation, {
      y: Math.PI * 2.5, // full spin back to front
      ease: 'power2.inOut'
    }, 0.78);

    tl.to(this.can, {
      baseRotX: 0.05,
      baseRotZ: 0.0,
      ease: 'power2.inOut'
    }, 0.78);

    tl.to(this.camera.position, {
      z: 8.6,
      ease: 'power2.inOut'
    }, 0.78);

    // =========================================================================
    // STEP 5: Section 5 to Section 6 (Pre-Order / Cart)
    // Can moves to left side in an isometric hero pose, purchase box on right
    // =========================================================================
    tl.to(this.can.position, {
      x: -1.8,
      y: 0.0,
      z: 0.8,
      ease: 'power1.inOut'
    }, 0.95);

    tl.to(this.can.rotation, {
      y: Math.PI * 0.65,
      ease: 'power1.inOut'
    }, 0.95);

    tl.to(this.can, {
      baseRotX: 0.12,
      baseRotZ: 0.08,
      ease: 'power1.inOut'
    }, 0.95);

    tl.to(this.camera.position, {
      z: 8.2,
      ease: 'power1.inOut'
    }, 0.95);

    // Fade-in animations for section headlines
    gsap.utils.toArray('.reveal-up').forEach((elem) => {
      gsap.fromTo(elem, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // Smooth 360 spin animation triggered when changing flavor
  spinCan360() {
    if (!this.can) return;
    gsap.to(this.can.rotation, {
      y: this.can.rotation.y + Math.PI * 2,
      duration: 1.0,
      ease: 'power3.inOut'
    });

    // Slight jump / levitate effect
    gsap.to(this.can.position, {
      y: this.can.position.y + 0.35,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  }
}
