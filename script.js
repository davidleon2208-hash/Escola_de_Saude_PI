let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = slides.length;
let carouselInterval = null;
const userStorageKey = 'esppi_user';

function showSlide(index) {
  if (!slides.length || !dots.length) {
    return;
  }

  slides.forEach((slide) => slide.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  if (!totalSlides) {
    return;
  }

  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  if (!totalSlides) {
    return;
  }

  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function goToSlide(index) {
  if (!totalSlides) {
    return;
  }

  currentSlide = index;
  showSlide(currentSlide);
}

function startCarousel() {
  if (!totalSlides) {
    return;
  }

  clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 4000);
}

const carouselEl = document.getElementById('carousel');
if (carouselEl && totalSlides) {
  startCarousel();

  carouselEl.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  carouselEl.addEventListener('mouseleave', startCarousel);

  let startX = 0;
  carouselEl.addEventListener('touchstart', (event) => {
    startX = event.changedTouches[0].clientX;
  });

  carouselEl.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    if (endX - startX > 50) prevSlide();
    if (startX - endX > 50) nextSlide();
  });
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  const hamburger = document.querySelector('.hamburger');
  const backdrop = document.querySelector('.menu-backdrop');

  if (!menu || !hamburger) {
    return;
  }

  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  menu.classList.toggle('active');
  hamburger.classList.toggle('active');
  document.body.classList.toggle('menu-open', !expanded);
  hamburger.setAttribute('aria-expanded', String(!expanded));
  hamburger.setAttribute('aria-label', expanded ? 'Abrir menu principal' : 'Fechar menu principal');
  if (backdrop) {
    backdrop.hidden = expanded;
    backdrop.classList.toggle('active', !expanded);
  }
}

function toggleSubmenu(event) {
  const submenu = event.currentTarget.nextElementSibling;
  if (window.innerWidth <= 768 && submenu) {
    event.preventDefault();
    submenu.classList.toggle('open');
  }
}

function closeMenu() {
  const menu = document.getElementById('menu');
  const hamburger = document.querySelector('.hamburger');
  const backdrop = document.querySelector('.menu-backdrop');

  if (menu) {
    menu.classList.remove('active');
  }

  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu principal');
  }

  if (backdrop) {
    backdrop.classList.remove('active');
    backdrop.hidden = true;
  }

  document.body.classList.remove('menu-open');

  document.querySelectorAll('.submenu.open').forEach((submenu) => submenu.classList.remove('open'));
}

document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

function openTeamModal() {
  const modal = document.getElementById('teamModal');
  if (!modal) {
    return;
  }

  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeTeamModal() {
  const modal = document.getElementById('teamModal');
  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

const teamModal = document.getElementById('teamModal');
if (teamModal) {
  teamModal.addEventListener('click', (event) => {
    if (event.target === teamModal) {
      closeTeamModal();
    }
  });
}

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  const feedback = document.getElementById('loginFeedback');
  if (!modal) {
    return;
  }

  modal.classList.add('open');
  document.body.classList.add('modal-open');
  if (feedback) {
    feedback.textContent = '';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function updateUserInterface() {
  const savedUser = localStorage.getItem(userStorageKey);
  const loginButtons = document.querySelectorAll('.btn-login');
  const userStatus = document.getElementById('userStatus');
  const greeting = document.getElementById('userGreeting');

  if (!savedUser) {
    loginButtons.forEach((button) => {
      button.hidden = false;
    });
    if (userStatus) {
      userStatus.hidden = true;
    }
    return;
  }

  let user;
  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem(userStorageKey);
    loginButtons.forEach((button) => {
      button.hidden = false;
    });
    if (userStatus) {
      userStatus.hidden = true;
    }
    return;
  }

  if (!user || typeof user.name !== 'string' || !user.name.trim()) {
    localStorage.removeItem(userStorageKey);
    loginButtons.forEach((button) => {
      button.hidden = false;
    });
    if (userStatus) {
      userStatus.hidden = true;
    }
    return;
  }

  loginButtons.forEach((button) => {
    button.hidden = true;
  });
  if (userStatus) {
    userStatus.hidden = false;
  }
  if (greeting) {
    greeting.textContent = `Ol\u00E1, ${user.name.trim().split(/\s+/)[0]}`;
  }
}

function logoutUser() {
  localStorage.removeItem(userStorageKey);
  updateUserInterface();
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const name = String(formData.get('loginName') || '').trim();
    const email = String(formData.get('loginEmail') || '').trim();
    const password = String(formData.get('loginPassword') || '').trim();
    const feedback = document.getElementById('loginFeedback');

    if (name.length < 3 || password.length < 6) {
      if (feedback) {
        feedback.textContent = 'Preencha um nome v\u00E1lido e uma senha com pelo menos 6 caracteres.';
      }
      return;
    }

    localStorage.setItem(userStorageKey, JSON.stringify({ name, email }));

    if (feedback) {
      feedback.textContent = 'Login realizado com sucesso.';
    }

    loginForm.reset();
    updateUserInterface();
    setTimeout(closeLoginModal, 700);
  });
}

const loginModal = document.getElementById('loginModal');
if (loginModal) {
  loginModal.addEventListener('click', (event) => {
    if (event.target === loginModal) {
      closeLoginModal();
    }
  });
}

document.querySelectorAll('.team-photo').forEach((img) => {
  const initials = img.parentElement.querySelector('.team-initials');
  img.addEventListener('load', () => {
    if (initials) {
      initials.style.display = 'none';
    }
  });
  img.addEventListener('error', () => {
    img.style.display = 'none';
    if (initials) {
      initials.style.display = 'flex';
    }
  });
  if (img.complete && img.naturalWidth !== 0 && initials) {
    initials.style.display = 'none';
  }
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) {
      return;
    }
    const feedback = document.getElementById('contactSuccess');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    if (feedback) {
      feedback.hidden = true;
      feedback.classList.remove('is-error');
      feedback.textContent = '';
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }
    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      contactForm.reset();
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = 'Mensagem enviada com sucesso. Entraremos em contato em breve.';
      }
    } catch (error) {
      if (feedback) {
        feedback.hidden = false;
        feedback.classList.add('is-error');
        feedback.textContent = 'N\u00E3o foi poss\u00EDvel enviar a mensagem agora. Tente novamente em instantes.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
      }
    }
  });
}

document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.course-card').forEach((course) => {
      const status = course.getAttribute('data-status');
      const shouldShow = filter === 'all' || filter === status;
      course.classList.toggle('hidden', !shouldShow);
    });
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') prevSlide();
  if (event.key === 'Escape') {
    closeTeamModal();
    closeLoginModal();
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1170) {
    closeMenu();
  }
});

const hamburgerEl = document.querySelector('.hamburger');
if (hamburgerEl) {
  hamburgerEl.addEventListener('click', toggleMenu);
}

const menuBackdropEl = document.querySelector('.menu-backdrop');
if (menuBackdropEl) {
  menuBackdropEl.addEventListener('click', closeMenu);
}

updateUserInterface();

