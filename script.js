document.addEventListener('DOMContentLoaded', () => {
    // 1. INTERSECTION OBSERVER (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: parar de observar após revelar
                // revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. HEADER GLASSMORPHISM ON SCROLL
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // 4. FAQ ACCORDION
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;
            
            // Fechar todos os outros
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle atual
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // 5. COOKIE CONSENT & TRACK EVENT
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
        trackEvent('cookie_consent', 'accepted');
    });

    // Função global de rastreamento segura
    window.trackEvent = function(eventName, category) {
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            console.log(`[Track] Event: ${eventName}, Category: ${category}`);
            // Aqui você injetaria: gtag('event', eventName, { event_category: category });
            // Ou dataLayer.push({ event: eventName, category: category });
        }
    };

    // 6. FORM DRAFT AUTOSAVE (LocalStorage)
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');

    // Carregar rascunho
    inputs.forEach(input => {
        const saved = localStorage.getItem(`draft_${input.name}`);
        if (saved) input.value = saved;

        // Salvar ao digitar
        input.addEventListener('input', (e) => {
            localStorage.setItem(`draft_${e.target.name}`, e.target.value);
        });
    });

    // Limpar rascunho ao enviar com sucesso
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        inputs.forEach(input => localStorage.removeItem(`draft_${input.name}`));
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
        trackEvent('form_submit', 'contato');
    });

    // 7. WHATSAPP CONTEXTUAL (Mensagem baseada no horário)
    const waLink = document.getElementById('whatsapp-float');
    const waTooltip = document.getElementById('whatsapp-tooltip');
    const hour = new Date().getHours();
    let greeting = 'Olá!';
    
    if (hour < 12) greeting = 'Bom dia!';
    else if (hour < 18) greeting = 'Boa tarde!';
    else greeting = 'Boa noite!';

    const contextualMsg = `${greeting} Vi o site da Brasa do Reino e quero fazer um pedido!`;
    waLink.href = `https://wa.me/5511933791450?text=${encodeURIComponent(contextualMsg)}`;
    waTooltip.textContent = contextualMsg;

    // 8. ANIMATED COUNTER (Estatísticas)
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current).toLocaleString('pt-BR');
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target.toLocaleString('pt-BR') + (target === 98 ? '%' : '+');
                    }
                };
                updateCounter();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
});