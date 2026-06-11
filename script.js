/* ============================================
   NEXO WEB — Script principal
   ============================================ */

// Año dinámico
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================
// Topbar smart-hide: oculta al bajar, vuelve al subir
// ============================================
const topbar = document.getElementById('topbar');
const stageEl = document.getElementById('stage');

if (topbar && stageEl) {
  let lastScroll = 0;
  let ticking = false;

  const onScroll = () => {
    const current = stageEl.scrollTop;
    const delta = current - lastScroll;

    if (Math.abs(delta) > 6) {
      if (delta > 0 && current > 40) {
        topbar.classList.add('is-hidden');
      } else {
        topbar.classList.remove('is-hidden');
      }
      lastScroll = current;
    }
    ticking = false;
  };

  stageEl.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
}

// Burger mobile
const burgerBtn = document.getElementById('burger');
const topbarNav = document.querySelector('.topbar__nav');
if (burgerBtn && topbarNav) {
  burgerBtn.addEventListener('click', () => topbarNav.classList.toggle('is-open'));
  document.querySelectorAll('.topbar__item').forEach(item => {
    item.addEventListener('click', () => topbarNav.classList.remove('is-open'));
  });
}

// ============================================
// Render de proyectos en panel TRABAJOS
// ============================================
// Velocidad de reproducción de los videos de proyectos (1.0 = normal, <1 = más lento)
const PROJECT_VIDEO_SPEED = 0.65;

const grid = document.getElementById('works-grid');
if (grid && typeof PROJECTS !== 'undefined') {
  grid.innerHTML = PROJECTS.map(p => {
    let mediaContent;
    if (p.video) {
      // Video con poster (imagen) — autoplay mudo en loop
      mediaContent = `
        <video
          class="work-card__video"
          src="${p.video}"
          ${p.image ? `poster="${p.image}"` : ''}
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        ></video>
      `;
    } else if (p.image) {
      mediaContent = `<img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'work-card__placeholder\\'>[ Cargá la imagen en<br>/portadaproyecto/ ]</div>'">`;
    } else {
      mediaContent = `<div class="work-card__placeholder">[ Cargá la imagen en<br>/portadaproyecto/ ]</div>`;
    }

    const igSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.12 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.32.79.74 1.46 1.38 2.12.66.66 1.33 1.06 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/></svg>`;

    const links = [];
    if (p.link)      links.push(`<a href="${p.link}" target="_blank" rel="noopener" class="work-card__btn work-card__btn--web">Ver Web →</a>`);
    if (p.instagram) links.push(`<a href="${p.instagram}" target="_blank" rel="noopener" class="work-card__btn work-card__btn--ig">${igSvg} Instagram</a>`);
    const linkContent = links.length
      ? `<div class="work-card__actions">${links.join('')}</div>`
      : `<span class="work-card__link">Próximamente</span>`;

    const mediaEl = p.link
      ? `<a href="${p.link}" target="_blank" rel="noopener" class="work-card__media">${mediaContent}</a>`
      : `<div class="work-card__media">${mediaContent}</div>`;

    return `
      <article class="work-card">
        <div class="work-card__media-wrap">
          <span class="work-card__chip">${p.category}</span>
          ${mediaEl}
        </div>
        <div class="work-card__body">
          <div class="work-card__head">
            <h3 class="work-card__title">${p.title}</h3>
          </div>

          <div class="work-card__info">
            <div class="work-info">
              <span class="work-info__label">Desafío</span>
              <p>${p.challenge}</p>
            </div>
            <div class="work-info">
              <span class="work-info__label">Qué hicimos</span>
              <p>${p.solution}</p>
            </div>
            <div class="work-info">
              <span class="work-info__label">El resultado</span>
              <p>${p.result}</p>
            </div>
          </div>

          ${linkContent}
        </div>
      </article>
    `;
  }).join('');

  // Optimización de videos de proyectos
  const projectVideos = grid.querySelectorAll('.work-card__video');
  projectVideos.forEach(video => {
    // Velocidad reducida → percepción más fluida y compensa lag de decodificación
    const applySpeed = () => { video.playbackRate = PROJECT_VIDEO_SPEED; };
    video.addEventListener('loadedmetadata', applySpeed);
    video.addEventListener('play', applySpeed);
    applySpeed();
  });

  // Pausar videos cuando la pestaña de Trabajos no está visible (libera CPU/GPU)
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { root: stageEl || null, threshold: 0.2 });

    projectVideos.forEach(v => videoObserver.observe(v));
  }
}

// ============================================
// Navegación dock — scroll-snap a cada panel
// ============================================
const stage = document.getElementById('stage');
const dockItems = document.querySelectorAll('[data-target]');
const panels = document.querySelectorAll('.panel[data-panel]');

dockItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const targetId = item.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (target && stage) {
      e.preventDefault();
      stage.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// Active state en sidebar al scrollear
// ============================================
const setActive = (id) => {
  document.querySelectorAll('.topbar__item').forEach(item => {
    item.classList.toggle(
      'is-active',
      item.getAttribute('data-target') === id
    );
  });
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    root: stage,
    threshold: 0.5
  });

  panels.forEach(p => observer.observe(p));
}

// Marcar primera pestaña activa al cargar
setActive('que-hacemos');

// ============================================
// CLICK A LETRA → CAE (efecto desarmar título)
// ============================================
const heroTitle = document.querySelector('.hero-title');

function splitIntoLetters(element) {
  const nodes = [...element.childNodes];
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      for (const char of text) {
        if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
          frag.appendChild(document.createTextNode(char));
        } else {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = char;
          frag.appendChild(span);
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      splitIntoLetters(node);
    }
  });
}

if (heroTitle) {
  splitIntoLetters(heroTitle);

  let fallCounter = 0;

  function dropLetter(letter) {
    if (!letter || letter.classList.contains('is-unhooking') || letter.classList.contains('is-falling')) return;

    const direction = (fallCounter % 2 === 0) ? 'left' : 'right';
    fallCounter++;

    letter.classList.add(`dir-${direction}`);
    letter.classList.add('is-unhooking');

    setTimeout(() => {
      letter.classList.remove('is-unhooking');
      letter.classList.add('is-falling');
      letter.addEventListener('animationend', () => {
        letter.style.visibility = 'hidden';
      }, { once: true });
    }, 500);
  }

  heroTitle.addEventListener('click', (e) => {
    const letter = e.target.closest('.letter');
    if (letter) dropLetter(letter);
  });

  // ============================================
  // DEMO CURSOR — muestra al usuario cómo funciona
  // ============================================
  const demoCursor = document.getElementById('demoCursor');
  const allLetters = heroTitle.querySelectorAll('.letter');
  const targetS = allLetters[6]; // H(0) A(1) C(2) E(3) M(4) O(5) S(6)

  function runDemo() {
    if (!demoCursor || !targetS) return;

    const rect = targetS.getBoundingClientRect();
    // Punta del cursor (top-left del SVG) al centro de la letra
    const targetX = rect.left + rect.width / 2 - 6;
    const targetY = rect.top + rect.height / 2 - 4;

    // Posición inicial: cerca, abajo-derecha de la S (recorrido corto pero visible)
    const startX = targetX + 45;
    const startY = targetY + 40;

    // 1) Posicionar instantáneamente (sin transición) en el punto de partida
    demoCursor.style.transition = 'none';
    demoCursor.style.transform = `translate(${startX}px, ${startY}px)`;

    // Forzar reflow para que la posición inicial sea respetada
    void demoCursor.offsetWidth;

    requestAnimationFrame(() => {
      // 2) Activar transición y aparecer
      demoCursor.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
      demoCursor.classList.add('is-visible');

      // 3) Mover hacia la S
      requestAnimationFrame(() => {
        demoCursor.style.transform = `translate(${targetX}px, ${targetY}px)`;
      });

      // 4) Llegada → click + caída
      setTimeout(() => {
        demoCursor.classList.add('is-clicking');
        dropLetter(targetS);

        setTimeout(() => demoCursor.classList.remove('is-clicking'), 700);

        // 5) Apartar el cursor para que la caída sea visible
        setTimeout(() => {
          demoCursor.style.transition = 'transform 0.5s ease, opacity 0.4s ease';
          demoCursor.style.transform = `translate(${targetX + 60}px, ${targetY + 50}px)`;
          demoCursor.classList.remove('is-visible');
        }, 450);
      }, 750);
    });
  }

  // Disparar la demo una sola vez, 2 seg después de cargar
  setTimeout(runDemo, 2000);
}

// ============================================
// FALL-LETTERS — letras caen al inclinar la tarjeta del hero
// ============================================
(function setupFallingCards() {
  const cards = document.querySelectorAll('.hero-side .card');
  if (!cards.length) return;

  const rand = (min, max) => Math.random() * (max - min) + min;

  cards.forEach(card => {
    const targets = card.querySelectorAll('.card__title, .card__sub');
    let letterIndex = 0;

    targets.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      for (const ch of text) {
        if (ch === ' ') {
          el.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'fall-letter';
          span.textContent = ch;
          // Rotación final aleatoria entre -35 y 35 grados
          span.style.setProperty('--fall-rot', rand(-35, 35).toFixed(1) + 'deg');
          // Desplazamiento lateral leve (-8 a 8 px)
          span.style.setProperty('--fall-jx', rand(-8, 8).toFixed(1) + 'px');
          // Delay de caída escalonado (efecto cascada)
          span.style.setProperty('--fall-delay', (letterIndex * 18) + 'ms');
          // Delay de retorno en orden inverso (las últimas caídas se levantan primero)
          span.dataset.idx = letterIndex;
          letterIndex++;
          el.appendChild(span);
        }
      }
    });

    const totalLetters = letterIndex;
    let returnTimer = null;

    const computeFall = () => {
      const cardRect = card.getBoundingClientRect();
      const letters = card.querySelectorAll('.fall-letter');
      letters.forEach(letter => {
        const lr = letter.getBoundingClientRect();
        // Distancia al fondo de la tarjeta (con 10px de margen)
        const dy = cardRect.bottom - lr.bottom - 10 + rand(-4, 4);
        letter.style.setProperty('--fall-dy', dy.toFixed(1) + 'px');
      });
    };

    card.addEventListener('mouseenter', () => {
      if (returnTimer) {
        clearTimeout(returnTimer);
        returnTimer = null;
      }
      computeFall();
      card.classList.add('is-tilted');
    });

    card.addEventListener('mouseleave', () => {
      returnTimer = setTimeout(() => {
        // Antes de retornar, asignar delay inverso para que las letras se levanten en orden contrario
        card.querySelectorAll('.fall-letter').forEach(letter => {
          const idx = parseInt(letter.dataset.idx || '0', 10);
          letter.style.setProperty('--fall-delay-return', ((totalLetters - idx) * 12) + 'ms');
        });
        card.classList.remove('is-tilted');
        returnTimer = null;
      }, 1500);
    });
  });
})();
