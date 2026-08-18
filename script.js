// ============================================
// MENU HAMBÚRGUER - RESPONSIVO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Animar as barras do hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(10px, 10px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : 'none';
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
});

// ============================================
// SMOOTH SCROLLING E NAVEGAÇÃO ATIVA
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Atualizar link ativo ao scroll
window.addEventListener('scroll', function() {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// FORM SUBMISSION - CONTATO
// ============================================
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Validação
        if (name.trim() === '' || email.trim() === '' || subject === '' || message.trim() === '') {
            showNotification('Por favor, preencha todos os campos!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido!', 'error');
            return;
        }
        
        // Simular envio
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification(`Obrigado, ${name}! Sua mensagem foi recebida com sucesso. Entraremos em contato em breve.`, 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Validar email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============================================
// ANIMAÇÃO DE CARDS AO SCROLL
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .team-member, .prevention-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// ABAS INTERATIVAS - CARDS COM DETALHES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Criar sistema de abas para cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Adicionar botão para mostrar detalhes
        const cardLink = card.querySelector('.card-link');
        if (cardLink) {
            cardLink.addEventListener('click', function(e) {
                e.preventDefault();
                showCardDetails(card, this.getAttribute('href'));
            });
        }
    });
});

// Função para mostrar detalhes do card em modal/abas
function showCardDetails(card, href) {
    const cardTitle = card.querySelector('h3').textContent;
    const cardDescription = card.querySelector('p').textContent;
    const cardFeatures = card.querySelector('.card-features');
    
    // Criar modal com abas
    let existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    let featuresHTML = '';
    if (cardFeatures) {
        const features = cardFeatures.querySelectorAll('li');
        featuresHTML = '<ul class="modal-features">';
        features.forEach(feature => {
            featuresHTML += `<li><i class="fas fa-check"></i> ${feature.textContent}</li>`;
        });
        featuresHTML += '</ul>';
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <h2>${cardTitle}</h2>
            </div>
            <div class="modal-tabs">
                <button class="tab-button active" data-tab="overview">Visão Geral</button>
                <button class="tab-button" data-tab="details">Detalhes</button>
                <button class="tab-button" data-tab="resources">Recursos</button>
            </div>
            <div class="modal-body">
                <div class="tab-content active" id="overview">
                    <p>${cardDescription}</p>
                    <p style="margin-top: 15px; padding: 15px; background: #f0f0f0; border-left: 4px solid #d32f2f; border-radius: 8px;">
                        <strong>ℹ️ Informação:</strong> Clique nas abas acima para explorar mais detalhes, recursos e informações adicionais sobre este tópico.
                    </p>
                </div>
                <div class="tab-content" id="details">
                    ${featuresHTML}
                    <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #f5f5f5, #ececec); border-radius: 8px;">
                        <h4 style="color: #d32f2f; margin-bottom: 10px;">Características Principais</h4>
                        <p>Este módulo fornece informações essenciais e práticas para sua segurança ocupacional. Todos os conteúdos foram desenvolvidos com base em normas regulamentadoras brasileiras e padrões internacionais.</p>
                    </div>
                </div>
                <div class="tab-content" id="resources">
                    <div class="resources-list">
                        <div class="resource-item">
                            <i class="fas fa-file-pdf"></i>
                            <div>
                                <h4>Guia Completo em PDF</h4>
                                <p>Baixe o guia detalhado sobre este tópico</p>
                                <a href="#" class="resource-link">Baixar PDF →</a>
                            </div>
                        </div>
                        <div class="resource-item">
                            <i class="fas fa-video"></i>
                            <div>
                                <h4>Vídeos Educativos</h4>
                                <p>Assista vídeos práticos e informativos</p>
                                <a href="#" class="resource-link">Ver Vídeos →</a>
                            </div>
                        </div>
                        <div class="resource-item">
                            <i class="fas fa-book"></i>
                            <div>
                                <h4>Normas Relacionadas</h4>
                                <p>Consulte as normas regulamentadoras aplicáveis</p>
                                <a href="#" class="resource-link">Ver Normas →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Fechar</button>
                <button class="btn-primary">Compartilhar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animar modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Funcionalidade das abas
    const tabButtons = modal.querySelectorAll('.tab-button');
    const tabContents = modal.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remover ativo de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar ativo ao clicado
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
    
    // Fechar modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
            setTimeout(() => {
                this.remove();
            }, 300);
        }
    });
}

// ============================================
// ANIMAÇÕES DE SCROLL
// ============================================
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach(element => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        });
        
        observer.observe(element);
    });
}

// ============================================
// EFEITOS ESPECIAIS
// ============================================
// Adicionar efeito de ripple aos botões
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ============================================
// INICIALIZAR AO CARREGAR
// ============================================
window.addEventListener('load', function() {
    animateOnScroll();
});
