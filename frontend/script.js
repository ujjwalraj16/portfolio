const API_BASE_URL = "https://portfolio-9ukd.onrender.com";;;
"use strict";

// =============================================
// PARTICLES BACKGROUND
// =============================================
function initParticles() {
  const container = document.getElementById("particles-bg");
  if (!container) return;

  const isDark =
    document.documentElement.getAttribute("data-theme") !== "light";
  const colors = isDark
    ? [
      "rgba(162,99,96,0.35)",
      "rgba(212,162,156,0.25)",
      "rgba(162,99,96,0.2)",
      "rgba(212,162,156,0.15)",
    ]
    : ["rgba(138,79,76,0.2)", "rgba(194,137,127,0.15)", "rgba(162,99,96,0.12)"];

  container.innerHTML = "";
  const count = Math.min(40, Math.floor(window.innerWidth / 30));

  for (let i = 0; i < count; i++) {
    createParticle(container, colors, i);
  }
}

function createParticle(container, colors, index) {
  const p = document.createElement("div");
  p.className = "particle";
  const size = Math.random() * 4 + 1;
  const left = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 20;
  const color = colors[Math.floor(Math.random() * colors.length)];

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -10px;
    background: ${color};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    box-shadow: 0 0 ${size * 3}px ${color};
  `;
  container.appendChild(p);
}

// =============================================
// DARK / LIGHT THEME TOGGLE
// =============================================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
  themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  // Re-init particles on theme switch
  initParticles();
}

// Load saved theme or detect system preference
(function loadTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
})();

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// =============================================
// STICKY NAVBAR & ACTIVE SECTION HIGHLIGHT
// =============================================
const navbar = document.getElementById("navbar");

const sections = Array.from(document.querySelectorAll("section[id]"));
const navLinks = Array.from(document.querySelectorAll(".nav-link"));

function updateActiveNav() {
  const scrollY = window.scrollY + 100;

  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active");
    }
  });

  // Navbar scrolled style
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateActiveNav, { passive: true });

// =============================================
// MOBILE MENU TOGGLE
// =============================================
const mobileToggle = document.getElementById("mobileToggle");
const navLinksContainer = document.getElementById("navLinks");

mobileToggle.addEventListener("click", () => {
  const isOpen = navLinksContainer.classList.toggle("open");
  mobileToggle.classList.toggle("active", isOpen);
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu on nav link click (mobile)
navLinksContainer.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("open");
    mobileToggle.classList.remove("active");
    mobileToggle.setAttribute("aria-expanded", "false");
  });
});

// =============================================
// SCROLL TO TOP BUTTON
// =============================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  },
  { passive: true },
);

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Trigger skill bar animation
          const skillBars = entry.target.querySelectorAll(".skill-fill");
          if (skillBars.length > 0) {
            setTimeout(() => {
              entry.target.classList.add("animated");
            }, 100);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

// Skill card observer for animated skill bars
function initSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillCards.forEach((card) => observer.observe(card));
}

// =============================================
// TYPEWRITER EFFECT FOR TAGLINE
// =============================================
function initTypewriter() {
  const el = document.getElementById("taglineText");
  if (!el) return;

  const phrases = [
    "Data Science Enthusiast",
    "Problem Solver | Data Storyteller",
    "Passionate about Delivering Data Driven Solutions",
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 80;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      delay = 80;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  // small initial delay
  setTimeout(type, 1200);
}

// =============================================
// STAGGERED HERO ANIMATIONS
// =============================================
function initHeroAnimations() {
  const heroElements = document.querySelectorAll(".hero-section .reveal");
  heroElements.forEach((el, index) => {
    setTimeout(
      () => {
        el.classList.add("visible");
      },
      200 + index * 150,
    );
  });
}
// =============================================
// ATTACHMENT BUTTON (Gmail-style paperclip)
// =============================================
const attachBtn = document.getElementById("attachBtn");
const attachmentInput = document.getElementById("attachments");
const attachmentList = document.getElementById("attachmentList");

// Keep our own list of selected files (lets us support "remove" per chip,
// since real FileList objects can't be edited directly)
let selectedFiles = [];

if (attachBtn && attachmentInput) {
  // Clicking the paperclip opens the native file picker
  attachBtn.addEventListener("click", () => {
    attachmentInput.click();
  });

  // When user picks files, add them to our list and render chips
  attachmentInput.addEventListener("change", () => {
    const newFiles = Array.from(attachmentInput.files);
    selectedFiles = selectedFiles.concat(newFiles);
    renderAttachmentChips();
    syncFileInput();
  });
}

function renderAttachmentChips() {
  if (!attachmentList) return;
  attachmentList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const chip = document.createElement("div");
    chip.className = "attachment-chip";

    const name = document.createElement("span");
    name.className = "chip-name";
    name.textContent = file.name;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "chip-remove";
    removeBtn.innerHTML = "&times;";
    removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
    removeBtn.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      renderAttachmentChips();
      syncFileInput();
    });

    chip.appendChild(name);
    chip.appendChild(removeBtn);
    attachmentList.appendChild(chip);
  });
}

// Keep the actual <input type="file"> in sync with our selectedFiles array
// so the browser's FileList matches what the user sees as chips
function syncFileInput() {
  const dataTransfer = new DataTransfer();
  selectedFiles.forEach((file) => dataTransfer.items.add(file));
  attachmentInput.files = dataTransfer.files;
}
// =============================================
// =============================================
// WHATSAPP CONTACT
// =============================================
const WA_NUMBER = "916203038580"; // Country code + number, no + or spaces

function sendWhatsApp() {
  const nameEl = document.getElementById("waName");
  const msgEl = document.getElementById("waMessage");
  const nameErr = document.getElementById("waNameError");
  const msgErr = document.getElementById("waMessageError");

  // Reset errors
  nameErr.textContent = "";
  msgErr.textContent = "";
  nameEl.classList.remove("wa-input-error");
  msgEl.classList.remove("wa-input-error");

  const name = nameEl.value.trim();
  const message = msgEl.value.trim();
  let valid = true;

  if (!name || name.length < 2) {
    nameErr.textContent = "Please enter your name (min 2 chars).";
    nameEl.classList.add("wa-input-error");
    valid = false;
  }
  if (!message || message.length < 5) {
    msgErr.textContent = "Please enter a message (min 5 chars).";
    msgEl.classList.add("wa-input-error");
    valid = false;
  }
  if (!valid) return;
  // Build WhatsApp URL and open
  const composed = encodeURIComponent(`Hello, I'm ${name}.\n\n${message}`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${composed}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

// Real-time error clearing for WhatsApp inputs
["waName", "waMessage"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => {
      el.classList.remove("wa-input-error");
      const errEl = document.getElementById(id + "Error");
      if (errEl) errEl.textContent = "";
    });
  }
});

/* legacy stubs – kept to avoid ReferenceErrors if called anywhere */
function closeModal() {
  document.body.style.overflow = "";
}

// Make closeModal globally accessible (called from HTML)
window.closeModal = closeModal;


// =============================================
// SMOOTH ANCHOR NAVIGATION
// =============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPos =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
    }
  });
});

// =============================================
// PARTICLE INTERACTION (mouse glow follow)
// =============================================
let mouseX = 0,
  mouseY = 0;
const glow = document.createElement("div");
glow.style.cssText = `
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79,157,255,0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: left 0.3s ease, top 0.3s ease;
`;
document.body.appendChild(glow);

document.addEventListener(
  "mousemove",
  (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  },
  { passive: true },
);

// =============================================
// COUNTER ANIMATION (for stats if needed)
// =============================================
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// =============================================
// INIT ALL ON DOM READY
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initReveal();
  initSkillBars();
  initHeroAnimations();
  initTypewriter();
  updateActiveNav();

  // Resize: re-create particles on significant width change
  let lastWidth = window.innerWidth;
  window.addEventListener(
    "resize",
    () => {
      if (Math.abs(window.innerWidth - lastWidth) > 100) {
        initParticles();
        lastWidth = window.innerWidth;
      }
    },
    { passive: true },
  );
});

// Handle scroll-based lazy loading of particles on first scroll
let particlesLoaded = false;
window.addEventListener(
  "scroll",
  () => {
    if (!particlesLoaded) {
      particlesLoaded = true;
    }
  },
  { passive: true, once: true },
);
