// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    const p = document.getElementById('preloader');
    if(p) { p.style.opacity='0'; p.style.visibility='hidden'; }
  }, 1500);
});

// Header scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Burger / mobile nav
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
});
function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target) {
      e.preventDefault();
      const offset = header.offsetHeight + 12;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Calculator
const slider = document.getElementById('guestSlider');
const countEl = document.getElementById('guestCount');
const weightEl = document.getElementById('meatWeight');
if(slider) {
  slider.addEventListener('input', () => {
    const g = parseInt(slider.value);
    countEl.textContent = g;
    weightEl.textContent = (g * 0.4).toFixed(1);
  });
}

// Sparks canvas
const canvas = document.getElementById('sparksCanvas');
const ctx = canvas.getContext('2d');
let sparks = [];
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createSpark(x, y) {
  for(let i = 0; i < 4; i++) {
    sparks.push({
      x, y,
      vx: (Math.random()-0.5)*2.5,
      vy: -(Math.random()*3+1.5),
      life: 1,
      size: Math.random()*2+1,
      color: Math.random()<0.5 ? '#e85d00' : '#c9a227'
    });
  }
}

// Auto sparks at bottom
setInterval(() => {
  const x = Math.random()*canvas.width;
  const y = canvas.height - Math.random()*60;
  createSpark(x,y);
}, 120);

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  createSpark(e.clientX - rect.left, e.clientY - rect.top);
});

function animateSparks() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  sparks = sparks.filter(s => s.life > 0);
  sparks.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.04;
    s.life -= 0.022;
    ctx.save();
    ctx.globalAlpha = Math.max(0,s.life);
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
  requestAnimationFrame(animateSparks);
}
animateSparks();
