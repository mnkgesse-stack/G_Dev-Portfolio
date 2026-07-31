 const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const root = document.documentElement;

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ---------- Thème clair / sombre ----------
function applyTheme(theme){
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ---------- Langue FR / EN ----------
function applyLang(lang){
  document.querySelectorAll('[data-fr]').forEach(el => {
    el.textContent = lang === 'fr' ? el.dataset.fr : el.dataset.en;
  });
  langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';
  root.setAttribute('lang', lang);
  localStorage.setItem('lang', lang);
  updateTypedText(lang);
}

const savedLang = localStorage.getItem('lang') || 'fr';

langToggle.addEventListener('click', () => {
  const current = root.getAttribute('lang') === 'en' ? 'en' : 'fr';
  applyLang(current === 'fr' ? 'en' : 'fr');
});

// ---------- Animation "machine à écrire" du titre du hero ----------
const typedEl = document.getElementById('typedText');
const cursorEl = document.getElementById('cursor');

const headline = {
  fr: "J'apprends à construire des choses qui marchent vraiment.",
  en: "I'm learning to build things that actually work."
};

let typingTimeout;

function updateTypedText(lang){
  clearTimeout(typingTimeout);
  const text = headline[lang] || headline.fr;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    typedEl.textContent = text;
    return;
  }

  typedEl.textContent = '';
  let i = 0;

  function type(){
    if (i <= text.length){
      typedEl.textContent = text.slice(0, i);
      i++;
      typingTimeout = setTimeout(type, 45);
    }
  }
  type();
}

applyLang(savedLang);

// ---------- Animation d'apparition au scroll ----------
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ---------- Formulaire de contact (ouvre l'appli mail) ----------
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value;
  const email = contactForm.email.value;
  const message = contactForm.message.value;

  const subject = encodeURIComponent(`Message de ${name} — via portfolio`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  window.location.href = `mailto:ton.email@gmail.com?subject=${subject}&body=${body}`;
});

// ---------- Bouton flottant retour en haut ----------
const fabTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500){
    fabTop.classList.add('visible');
  } else {
    fabTop.classList.remove('visible');
  }
});

fabTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});