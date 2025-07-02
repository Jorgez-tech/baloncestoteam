// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Utilidades para hacer requests a la API
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint);
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

const api = new APIClient(API_BASE_URL);

// Sistema de notificaciones Toast
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        this.container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);

        return toast;
    }

    success(message) {
        return this.show(message, 'success');
    }

    error(message) {
        return this.show(message, 'error');
    }

    info(message) {
        return this.show(message, 'info');
    }

    warning(message) {
        return this.show(message, 'warning');
    }
}

const toast = new ToastManager();

// Manejador de jugadores
class PlayersManager {
    constructor() {
        this.players = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.loading = false;
    }

    async loadPlayers(page = 1) {
        if (this.loading) return;

        this.loading = true;
        const loadingElement = document.getElementById('players-loading');
        const container = document.getElementById('players-container');

        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        try {
            const response = await api.get(`/players?page=${page}&limit=6`);
            const { data, meta } = response;

            if (page === 1) {
                this.players = data;
                container.innerHTML = '';
            } else {
                this.players = [...this.players, ...data];
            }

            this.currentPage = meta.page;
            this.totalPages = Math.ceil(meta.total / meta.limit);

            this.renderPlayers();
            this.updateLoadMoreButton();

        } catch (error) {
            console.error('Error loading players:', error);
            container.innerHTML = `
                <div class="error-message">
                    <h3>Error al cargar jugadores</h3>
                    <p>No se pudieron cargar los jugadores. Inténtalo más tarde.</p>
                    <button onclick="playersManager.loadPlayers()" class="btn btn-secondary">
                        Reintentar
                    </button>
                </div>
            `;
        } finally {
            this.loading = false;
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    }

    renderPlayers() {
        const container = document.getElementById('players-container');

        if (this.players.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No hay jugadores registrados</h3>
                    <p>Sé el primero en unirte al equipo</p>
                    <a href="#inscripcion" class="btn btn-primary">Inscríbete Ahora</a>
                </div>
            `;
            return;
        }

        const playersHTML = this.players.map(player => `
            <div class="player-card">
                <div class="player-avatar">
                    <img src="${player.avatar || '/api/placeholder/100/100'}" 
                         alt="${player.name || 'Jugador'}" 
                         onerror="this.src='/api/placeholder/100/100'">
                </div>
                <div class="player-info">
                    <h3>${player.name || 'Nombre no disponible'}</h3>
                    <p class="player-position">${player.position || 'Posición no especificada'}</p>
                    <div class="player-stats">
                        <div class="stat">
                            <span>Altura:</span>
                            <span>${player.height || 'N/A'} cm</span>
                        </div>
                        <div class="stat">
                            <span>Peso:</span>
                            <span>${player.weight || 'N/A'} kg</span>
                        </div>
                    </div>
                    ${player.stats ? `
                        <div class="player-performance">
                            <div class="perf-stats">
                                <div><span>Partidos:</span> <span>${player.stats.games_played || 0}</span></div>
                                <div><span>Puntos/P:</span> <span>${player.stats.points_per_game || 0}</span></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = playersHTML;
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-players');
        if (loadMoreBtn) {
            if (this.currentPage < this.totalPages) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.onclick = () => this.loadPlayers(this.currentPage + 1);
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
}

const playersManager = new PlayersManager();

// Manejador de formulario de inscripción
class SignupFormManager {
    constructor() {
        this.form = document.getElementById('form-inscripcion');
        this.setupForm();
    }

    setupForm() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Simular envío a API (aquí conectarías con tu backend)
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('¡Solicitud enviada exitosamente! Te contactaremos pronto.');
            this.form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validación de campo requerido
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo es requerido';
            isValid = false;
        }
        // Validación de email
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Ingresa un email válido';
                isValid = false;
            }
        }
        // Validación de teléfono
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Ingresa un teléfono válido';
                isValid = false;
            }
        }
        // Validación de edad
        else if (field.name === 'edad' && value) {
            const age = parseInt(value);
            if (age < 16 || age > 50) {
                errorMessage = 'La edad debe estar entre 16 y 50 años';
                isValid = false;
            }
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        if (message) {
            field.classList.add('error');
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            field.parentElement.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Manejador de galería
class GalleryManager {
    constructor() {
        this.setupGallery();
    }

    setupGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-image');

        if (!mainImage || thumbnails.length === 0) return;

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Remover clase active de todas las miniaturas
                thumbnails.forEach(t => t.classList.remove('active'));

                // Agregar clase active a la seleccionada
                thumbnail.classList.add('active');

                // Cambiar imagen principal
                const newSrc = thumbnail.dataset.src;
                if (newSrc) {
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.src = newSrc;
                        mainImage.style.opacity = '1';
                    }, 150);
                }
            });
        });

        // Auto-rotate gallery every 5 seconds
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % thumbnails.length;
            thumbnails[currentIndex].click();
        }, 5000);
    }
}

// Navegación suave
class SmoothNavigation {
    constructor() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));

                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');

        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });

            // Cerrar menú al hacer click en un enlace
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                });
            });
        }
    }
}

// Animaciones y contador
class AnimationManager {
    constructor() {
        this.setupCounterAnimation();
        this.setupScrollAnimations();
    }

    setupCounterAnimation() {
        const stats = document.querySelectorAll('.stat h3');
        let animated = false;

        const animateCounters = () => {
            if (animated) return;

            stats.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/\D/g, ''));
                const suffix = stat.textContent.replace(/\d/g, '');
                let current = 0;
                const increment = target / 50;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        stat.textContent = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target + suffix;
                    }
                };

                updateCounter();
            });

            animated = true;
        };

        // Trigger animation when stats section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        });

        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    console.log('Basketball Team Website Loaded!');

    // Inicializar managers
    new GalleryManager();
    new SignupFormManager();
    new SmoothNavigation();
    new AnimationManager();

    // Cargar jugadores
    playersManager.loadPlayers();

    // Mensaje de bienvenida
    setTimeout(() => {
        toast.info('¡Bienvenido al sitio del Basketball Team! 🏀');
    }, 1000);
});

// Manejo de errores globales
window.addEventListener('error', function (event) {
    console.error('Global error:', event.error);
});

// Export para uso en otros scripts
window.BasketballTeam = {
    api,
    toast,
    playersManager
};