let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = slides.length;
let carouselInterval = null;
const userStorageKey = 'esppi_user';
const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;
const teamGalleryImages = Array.from(document.querySelectorAll('#teamModal .team-list-photo'));
let currentTeamImageIndex = 0;

function updateCarouselStatus(index) {
  const status = document.getElementById('carouselStatus');
  if (status) {
    status.textContent = `Slide ${index + 1} de ${totalSlides}`;
  }
}

function showSlide(index) {
  if (!slides.length || !dots.length) {
    return;
  }

  slides.forEach((slide) => slide.classList.remove('active'));
  dots.forEach((dot) => {
    dot.classList.remove('active');
    dot.removeAttribute('aria-current');
  });

  slides[index].classList.add('active');
  dots[index].classList.add('active');
  dots[index].setAttribute('aria-current', 'true');
  updateCarouselStatus(index);
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
  carouselEl.setAttribute('role', 'region');
  carouselEl.setAttribute('aria-label', 'Carrossel de destaques');
  dots.forEach((dot, index) => {
    dot.setAttribute('aria-controls', 'carousel');
    dot.setAttribute('aria-label', `Ir para o slide ${index + 1}`);
  });

  showSlide(currentSlide);
  startCarousel();

  carouselEl.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  carouselEl.addEventListener('mouseleave', startCarousel);
  carouselEl.addEventListener('focusin', () => clearInterval(carouselInterval));
  carouselEl.addEventListener('focusout', () => {
    if (!document.querySelector('.modal.open')) {
      startCarousel();
    }
  });

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

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(focusableSelector)).filter((element) => !element.hasAttribute('hidden'));
}

function trapFocus(event, container) {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = getFocusableElements(container);
  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function openModal(modalId, initialFocusSelector) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const initialFocus = initialFocusSelector ? modal.querySelector(initialFocusSelector) : null;
  const fallbackFocus = initialFocus || modal.querySelector(focusableSelector);
  if (fallbackFocus instanceof HTMLElement) {
    fallbackFocus.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

function openTeamModal() {
  openModal('teamModal', '.modal-header button');
}

function closeTeamModal() {
  closeModal('teamModal');
}

const teamModal = document.getElementById('teamModal');
if (teamModal) {
  teamModal.addEventListener('click', (event) => {
    if (event.target === teamModal) {
      closeTeamModal();
    }
  });
  teamModal.addEventListener('keydown', (event) => trapFocus(event, teamModal));
}

function openLoginModal() {
  const feedback = document.getElementById('loginFeedback');
  openModal('loginModal', '#loginName');
  if (feedback) {
    feedback.textContent = '';
  }
}

function closeLoginModal() {
  closeModal('loginModal');
}

function openImageModal(index) {
  const modal = document.getElementById('imageModal');
  const image = document.getElementById('imageModalImg');
  const captionEl = document.getElementById('imageModalCaption');
  const selectedImage = teamGalleryImages[index];

  if (!modal || !image || !captionEl || !selectedImage) {
    return;
  }

  currentTeamImageIndex = index;
  if (!modal.classList.contains('open')) {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  image.src = selectedImage.currentSrc || selectedImage.src;
  image.alt = selectedImage.alt;
  captionEl.textContent = selectedImage.closest('li')?.querySelector('strong')?.textContent || selectedImage.alt;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const closeButton = modal.querySelector('.image-modal-close');
  if (closeButton instanceof HTMLElement) {
    closeButton.focus();
  }
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  const image = document.getElementById('imageModalImg');
  const captionEl = document.getElementById('imageModalCaption');

  if (!modal || !image || !captionEl) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  image.src = '';
  image.alt = '';
  captionEl.textContent = '';
  document.body.classList.remove('modal-open');

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function showTeamImage(index) {
  if (!teamGalleryImages.length) {
    return;
  }

  const normalizedIndex = (index + teamGalleryImages.length) % teamGalleryImages.length;
  openImageModal(normalizedIndex);
}

function showPreviousTeamImage() {
  showTeamImage(currentTeamImageIndex - 1);
}

function showNextTeamImage() {
  showTeamImage(currentTeamImageIndex + 1);
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
    greeting.textContent = `Olá, ${user.name.trim().split(/\s+/)[0]}`;
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
        feedback.textContent = 'Preencha um nome válido e uma senha com pelo menos 6 caracteres.';
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
  loginModal.addEventListener('keydown', (event) => trapFocus(event, loginModal));
}

const imageModal = document.getElementById('imageModal');
if (imageModal) {
  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      closeImageModal();
    }
  });
  imageModal.addEventListener('keydown', (event) => trapFocus(event, imageModal));
}

teamGalleryImages.forEach((img, index) => {
  const trigger = img.closest('.team-list-photo-button');
  if (!trigger) {
    return;
  }

  trigger.addEventListener('click', () => {
    showTeamImage(index);
  });
});

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
        feedback.textContent = 'Não foi possível enviar a mensagem agora. Tente novamente em instantes.';
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
  const activeModal = document.querySelector('.modal.open');
  const isImageModalOpen = imageModal?.classList.contains('open');

  if (!activeModal) {
    if (event.key === 'ArrowRight') nextSlide();
    if (event.key === 'ArrowLeft') prevSlide();
  }

  if (isImageModalOpen) {
    if (event.key === 'ArrowRight') showNextTeamImage();
    if (event.key === 'ArrowLeft') showPreviousTeamImage();
  }

  if (event.key === 'Escape') {
    if (isImageModalOpen) {
      closeImageModal();
      return;
    }

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
