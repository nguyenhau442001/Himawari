/**
 * sakura-canvas.js
 * Japanese Minimalism & Sakura Atmosphere Falling Petals Engine.
 * High-performance, lightweight Canvas animation with organic sway,
 * 3D tumbling pitch, depth layering, visibility pause, and prefers-reduced-motion.
 */
(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReduced = motionQuery.matches;

  var canvas = document.getElementById('sakuraCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'sakuraCanvas';
    canvas.className = 'sakura-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var width = 0;
  var height = 0;
  var animationFrameId = null;
  var isRunning = false;

  // Japanese Sakura Palette: pastel pink, dusty rose, soft blush
  var PETAL_COLORS = [
    { r: 255, g: 202, b: 212 }, // Soft Pastel Pink (#FFCAD4)
    { r: 244, g: 167, b: 185 }, // Sakura Pink (#F4A7B9)
    { r: 216, g: 138, b: 154 }, // Dusty Rose (#D88A9A)
    { r: 255, g: 229, b: 236 }, // Soft Blush (#FFE5EC)
    { r: 248, g: 187, b: 208 }  // Pale Blossom (#F8BBD0)
  ];

  function getTargetPetalCount() {
    // Low to medium density: 16 petals on mobile, 26 on desktop
    return window.innerWidth < 768 ? 16 : 26;
  }

  var petals = [];

  function createPetal(randomInitialY) {
    var color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    // Subtle size variation: 9px to 16px
    var size = 9 + Math.random() * 7;
    // Depth factor for subtle perspective layering
    var depth = (size - 9) / 7;
    var opacity = 0.28 + depth * 0.42;

    return {
      x: Math.random() * (width + 60) - 30,
      y: randomInitialY ? Math.random() * height : -20 - Math.random() * 40,
      size: size,
      speedY: 0.45 + depth * 0.55 + Math.random() * 0.25, // 0.45 to 1.25 px/frame
      driftAmp: 0.8 + Math.random() * 1.4,
      driftFreq: 0.012 + Math.random() * 0.016,
      driftPhase: Math.random() * Math.PI * 2,
      windDrift: 0.15 + Math.random() * 0.35, // gentle natural breeze
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.018,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.015 + Math.random() * 0.02,
      color: color,
      opacity: opacity
    };
  }

  function initPetals() {
    var count = getTargetPetalCount();
    petals = [];
    for (var i = 0; i < count; i++) {
      petals.push(createPetal(true));
    }
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    if (petals.length === 0) {
      initPetals();
    }
  }

  function drawPetalShape(c, size) {
    c.beginPath();
    // Authentic Japanese Sakura petal silhouette with gentle tip cleft
    c.moveTo(0, size * 0.55);
    c.bezierCurveTo(-size * 0.48, size * 0.2, -size * 0.45, -size * 0.32, -size * 0.16, -size * 0.55);
    c.quadraticCurveTo(0, -size * 0.42, size * 0.16, -size * 0.55);
    c.bezierCurveTo(size * 0.45, -size * 0.32, size * 0.48, size * 0.2, 0, size * 0.55);
    c.closePath();
    c.fill();
  }

  var lastTime = 0;
  function render(currentTime) {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(render);

    if (!lastTime) lastTime = currentTime;
    var delta = Math.min((currentTime - lastTime) / 16.67, 2.5);
    lastTime = currentTime;

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < petals.length; i++) {
      var p = petals[i];

      // Physics update
      p.driftPhase += p.driftFreq * delta;
      p.y += p.speedY * delta;
      p.x += (Math.sin(p.driftPhase) * p.driftAmp + p.windDrift) * delta;
      p.rotation += p.rotationSpeed * delta;
      p.flip += p.flipSpeed * delta;

      // Recycle if fallen below screen or past right edge
      if (p.y > height + 25 || p.x > width + 40) {
        petals[i] = createPetal(false);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      var scaleY = Math.cos(p.flip);
      ctx.scale(1, scaleY);

      ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + p.opacity + ')';
      drawPetalShape(ctx, p.size);

      ctx.restore();
    }
  }

  function start() {
    if (prefersReduced || isRunning) return;
    isRunning = true;
    lastTime = 0;
    animationFrameId = requestAnimationFrame(render);
  }

  function stop() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  // Accessibility: prefers-reduced-motion
  motionQuery.addEventListener('change', function (e) {
    prefersReduced = e.matches;
    if (prefersReduced) {
      stop();
      ctx.clearRect(0, 0, width, height);
    } else {
      start();
    }
  });

  // Pause when tab is not visible to prevent battery/GPU drain
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  window.addEventListener('resize', function () {
    resize();
  }, { passive: true });

  resize();
  initPetals();
  if (!prefersReduced) {
    start();
  }

  window.SakuraCanvas = {
    start: start,
    stop: stop,
    resize: resize
  };
})();
