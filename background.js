/* ============================================================
   Fondo NEXO-WEB animado (optimizado): grilla en perspectiva que
   ondula + globos wireframe girando con glow neón (sin shadowBlur)
   + orbes de luz. Liviano: trazos en lote, DPR limitado, ~30fps,
   se pausa con la pestaña oculta. Reutilizable en toda la web.
   ============================================================ */
(function () {
  if (document.getElementById('bgfx')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'bgfx';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;z-index:-1;display:block;pointer-events:none;';
  const mount = () => { if (document.body && !document.getElementById('bgfx')) document.body.prepend(canvas); };
  if (document.body) mount(); else addEventListener('DOMContentLoaded', mount);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1, small = false;
  function resize() {
    small = innerWidth < 760;
    DPR = Math.min(devicePixelRatio || 1, small ? 1 : 1.5);   // menos píxeles = más fluido
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  /* ---- Icosfera (icosaedro subdividido) para los globos ---- */
  function icosphere(subdiv) {
    const t = (1 + Math.sqrt(5)) / 2;
    let verts = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ].map(v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; });
    let faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
    const cache = {};
    function mid(a, b) {
      const key = a < b ? a + '_' + b : b + '_' + a;
      if (cache[key] != null) return cache[key];
      const va = verts[a], vb = verts[b];
      let m = [(va[0] + vb[0]) / 2, (va[1] + vb[1]) / 2, (va[2] + vb[2]) / 2];
      const l = Math.hypot(m[0], m[1], m[2]);
      verts.push([m[0] / l, m[1] / l, m[2] / l]);
      cache[key] = verts.length - 1;
      return cache[key];
    }
    for (let s = 0; s < subdiv; s++) {
      const nf = [];
      for (const f of faces) {
        const a = mid(f[0], f[1]), b = mid(f[1], f[2]), c = mid(f[2], f[0]);
        nf.push([f[0], a, c], [f[1], b, a], [f[2], c, b], [a, b, c]);
      }
      faces = nf;
    }
    const seen = new Set(), edges = [];
    for (const f of faces) {
      const ed = [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]];
      for (const [a, b] of ed) {
        const k = a < b ? a + '_' + b : b + '_' + a;
        if (!seen.has(k)) { seen.add(k); edges.push([a, b]); }
      }
    }
    return { verts, edges };
  }
  const SPHERE = icosphere(1);
  const COL = ['90,120,255', '60,220,255', '150,90,255']; // azul, cian, violeta

  const globes = [
    { x: 0.20, y: 0.24, r: 0.13, sx: 0.36, sy: 0.50, c: 0 },
    { x: 0.66, y: 0.17, r: 0.075, sx: 0.46, sy: 0.30, c: 1 },
    { x: 0.30, y: 0.48, r: 0.10, sx: 0.30, sy: 0.44, c: 1 },
    { x: 0.80, y: 0.40, r: 0.095, sx: 0.40, sy: 0.34, c: 2 }
  ];
  const orbs = [
    { x: 0.04, y: 0.30, r: 0.30, c: '150,90,255', a: 0.16, p: 0.0 },
    { x: 0.96, y: 0.14, r: 0.32, c: '150,90,255', a: 0.14, p: 1.6 },
    { x: 0.52, y: 0.55, r: 0.26, c: '60,200,255', a: 0.13, p: 3.1 }
  ];

  function rot(v, ax, ay) {
    const x = v[0], y = v[1], z = v[2];
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    const cx = Math.cos(ax), sx = Math.sin(ax);
    const y1 = y * cx - z1 * sx;
    return [x1, y1];
  }

  /* ---- Grilla en perspectiva (piso) con efecto de ola ---- */
  function drawGrid(t) {
    const horizonY = H * 0.52, focal = H * 0.95, camH = 1.35;
    const GX = small ? 6 : 9, gx = 1;
    const gz = 0.80, rows = small ? 12 : 18, zNear = 0.55;
    const waveAmp = 0.60, kx = 0.85, kz = 0.55, waveSpeed = 0.48, scrollSpeed = 0.47;
    const phase = (t * scrollSpeed) % gz;

    const pts = [];
    for (let r = 0; r <= rows; r++) {
      const z = zNear + r * gz - phase;
      const row = [];
      for (let c = -GX; c <= GX; c++) {
        if (z <= 0.06) { row.push(null); continue; }
        const x = c * gx;
        const yw = waveAmp * Math.sin(x * kx + z * kz - t * waveSpeed);
        row.push({ sx: W / 2 + x * focal / z, sy: horizonY + (camH - yw) * focal / z, fade: Math.max(0, 1 - (z - zNear) / (rows * gz)) });
      }
      pts.push(row);
    }
    ctx.lineWidth = 1;
    // líneas a lo largo de Z (un solo trazo, color fijo)
    ctx.strokeStyle = 'rgba(70,140,255,0.16)';
    ctx.beginPath();
    for (let c = 0; c < pts[0].length; c++) {
      let started = false;
      for (let r = 0; r < pts.length; r++) {
        const p = pts[r][c]; if (!p) { started = false; continue; }
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
    }
    ctx.stroke();
    // filas (alpha por distancia) — un trazo por fila
    for (let r = 0; r < pts.length; r++) {
      let fade = 0; for (const p of pts[r]) { if (p) { fade = p.fade; break; } }
      ctx.strokeStyle = 'rgba(60,200,255,' + (0.05 + 0.32 * fade).toFixed(3) + ')';
      ctx.beginPath(); let started = false;
      for (let c = 0; c < pts[r].length; c++) {
        const p = pts[r][c]; if (!p) { started = false; continue; }
        if (!started) { ctx.moveTo(p.sx, p.sy); started = true; } else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();
    }
  }

  /* ---- Globos wireframe girando, con glow neón barato (aditivo, sin shadowBlur) ---- */
  function drawGlobes(t) {
    const m = Math.min(W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const gl of globes) {
      const cx = (gl.x + Math.sin(t * 0.05 + gl.c) * 0.01) * W;
      const cy = (gl.y + Math.cos(t * 0.045 + gl.c) * 0.01) * H;
      const R = gl.r * m;
      const ay = t * gl.sx, ax = t * gl.sy;
      const pts = SPHERE.verts.map(v => { const r = rot(v, ax, ay); return [cx + r[0] * R, cy + r[1] * R]; });
      // todas las aristas en UN path; dos pasadas = halo + línea (neón) sin shadowBlur
      ctx.beginPath();
      for (const e of SPHERE.edges) { const pa = pts[e[0]], pb = pts[e[1]]; ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); }
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(' + COL[gl.c] + ',0.05)'; ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(' + COL[gl.c] + ',0.34)'; ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function draw(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#06080f');
    g.addColorStop(0.5, '#0a0e22');
    g.addColorStop(1, '#070a16');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';
    const mx = Math.max(W, H);
    for (const o of orbs) {
      const ox = (o.x + Math.sin(t * 0.07 + o.p) * 0.03) * W;
      const oy = (o.y + Math.cos(t * 0.05 + o.p) * 0.03) * H;
      const rr = o.r * mx;
      const rg = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
      rg.addColorStop(0, 'rgba(' + o.c + ',' + o.a + ')');
      rg.addColorStop(1, 'rgba(' + o.c + ',0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(ox, oy, rr, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    drawGrid(t);
    drawGlobes(t);
  }

  // Loop limitado a ~30fps (suficiente para el fondo y mucho más liviano)
  const t0 = performance.now();
  let last = -1e9;
  (function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    if (now - last < 33) return;   // ~30fps
    last = now;
    draw((now - t0) / 1000);
  })(t0);
})();
