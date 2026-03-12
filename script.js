    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dot');
    const totalSlides = slides.length;

    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      slides[n].classList.add('active');
      dots[n].classList.add('active');
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }

    function goToSlide(n) {
      currentSlide = n;
      showSlide(currentSlide);
    }

    // Auto-play do carrossel a cada 4 segundos, com possibilidade de pausar ao passar o mouse
    let carouselInterval = setInterval(nextSlide, 4000);
    const carouselEl = document.getElementById('carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      carouselEl.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 4000);
      });
      // básico para deslizar em dispositivos touch
      let startX = 0;
      carouselEl.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].clientX;
      });
      carouselEl.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) prevSlide();
        if (startX - endX > 50) nextSlide();
      });
    }

    function toggleMenu() {
      const menu = document.getElementById('menu');
      const hamburger = document.querySelector('.hamburger');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      menu.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(!expanded));
    }

    function toggleSubmenu(e) {
      const submenu = e.currentTarget.nextElementSibling;
      if (window.innerWidth <= 768) {
        e.preventDefault();
        submenu.classList.toggle('open');
      }
    }

    // Fechar menu ao clicar em um link (pula o toggle do submenu em mobile)
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.dataset.submenu === 'true' && window.innerWidth <= 768) {
          // clique no link que abre o submenu no mobile - não fechar o menu
          return;
        }
        document.getElementById('menu').classList.remove('active');
        const ham = document.querySelector('.hamburger');
        ham.classList.remove('active');
        ham.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.submenu.open').forEach(s => s.classList.remove('open'));
      });
    });

      // Funções para modal da equipe
      function openTeamModal() {
        document.getElementById('teamModal').classList.add('open');
        document.getElementById('teamModal').querySelector('button[aria-label]')?.focus();
      }

      function closeTeamModal() {
        document.getElementById('teamModal').classList.remove('open');
      }

      // Fechar modal ao clicar fora do conteúdo
      document.getElementById('teamModal').addEventListener('click', function(e) {
        if (e.target === this) closeTeamModal();
      });

      // Mostrar/ocultar iniciais dependendo do carregamento da imagem
      document.querySelectorAll('.team-photo').forEach(img => {
        const initials = img.parentElement.querySelector('.team-initials');
        img.addEventListener('load', () => {
          if (initials) initials.style.display = 'none';
        });
        img.addEventListener('error', () => {
          img.style.display = 'none';
          if (initials) initials.style.display = 'flex';
        });
        // se a imagem já estiver em cache e carregada
        if (img.complete && img.naturalWidth !== 0) {
          if (initials) initials.style.display = 'none';
        }
      });

      // keyboard support for carousel and menu
      document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      });

      const hamburgerEl = document.querySelector('.hamburger');
      if (hamburgerEl) {
        hamburgerEl.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
          }
        });
      }

      // Tratamento do formulário de contato
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          // e.preventDefault() é removido para enviar via Formspree
          // Mostrar mensagem de sucesso após envio
          setTimeout(() => {
            const success = document.getElementById('contactSuccess');
            if (success) {
              success.style.display = 'block';
              setTimeout(() => {
                success.style.display = 'none';
              }, 4000);
            }
          }, 500);
        });
      }

      // Filtro de Cursos
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter');
          
          // Remover classe active de todos os botões
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          
          // Adicionar classe active ao botão clicado
          btn.classList.add('active');
          
          // Filtrar cursos
          const courses = document.querySelectorAll('.course-card');
          courses.forEach(course => {
            const status = course.getAttribute('data-status');
            
            if (filter === 'all') {
              course.style.display = 'block';
            } else if (filter === 'available' && status === 'available') {
              course.style.display = 'block';
            } else if (filter === 'unavailable' && status === 'unavailable') {
              course.style.display = 'block';
            } else {
              course.style.display = 'none';
            }
          });
        });
      });

      // Gallery Image Modal Functions
      function openImageModal(imageSrc, imageAlt) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('imageModalImg');
        const modalCaption = document.getElementById('imageModalCaption');
        
        modalImg.src = imageSrc;
        modalImg.alt = imageAlt;
        modalCaption.textContent = imageAlt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }

      function closeImageModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
      }

      // Add click listeners to gallery images using Event Delegation
      document.addEventListener('click', function(e) {
        // Only target gallery images for the modal
        const image = e.target.closest('.gallery-thumb');
        if (image) {
          e.preventDefault();
          const imageSrc = image.src;
          const imageAlt = image.alt;
          openImageModal(imageSrc, imageAlt);
        }
      });

      // Close modal when clicking overlay
      const imageModal = document.getElementById('imageModal');
      if (imageModal) {
        imageModal.addEventListener('click', function(e) {
          if (e.target === this || e.target.classList.contains('image-modal-overlay')) {
            closeImageModal();
          }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeImageModal();
          }
        });
      }