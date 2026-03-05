document.addEventListener('DOMContentLoaded', () => {

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile Navigation Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it has become visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.opacity-0');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Mouse Drag Scroll for Projects Grid
    const slider = document.querySelector('.projects-grid');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        slider.style.cursor = 'grab';
    }

    // Dynamic Project Fetching
    const projectGrid = document.querySelector('.projects-grid');
    if (projectGrid) {
        async function fetchProjects() {
            try {
                const response = await fetch('https://api.github.com/users/vipultikhe234/repos?sort=updated');
                const repos = await response.json();

                // We NO LONGER clear innerHTML here to preserve the static Paathner card

                repos.forEach((repo, index) => {
                    // Skip profile repo AND the static featured project (Paathner)
                    if (repo.name === 'vipultikhe234' || repo.name === 'navigation_project') return;

                    const card = document.createElement('div');
                    card.className = 'project-card glass-card opacity-0 slide-up';
                    // Offset index by 1 for transition delay because of the static card
                    card.style.transitionDelay = `${((index + 1) % 3) * 0.2}s`;

                    card.innerHTML = `
                        <div class="project-content">
                            <div class="project-header">
                                <h3>${repo.name.replace(/[-_]/g, ' ')}</h3>
                            </div>
                            <p class="project-desc">${repo.description || "High-performance backend solution focusing on scalability and clean architecture."}</p>
                            <div class="project-tags">
                                <span>${repo.language || 'Backend'}</span>
                                ${repo.topics ? repo.topics.map(t => `<span>${t}</span>`).join('') : ''}
                            </div>
                            <div class="project-actions">
                                <a href="project-detail.html?repo=${repo.name}" class="btn btn-primary">Details</a>
                                <a href="${repo.html_url}" target="_blank" class="btn btn-outline"><i class="fab fa-github"></i> GitHub</a>
                            </div>
                        </div>
                    `;
                    projectGrid.appendChild(card);
                    observer.observe(card);
                });
            } catch (error) {
                console.error("Error fetching projects:", error);
                // If fetch fails, we still have our static Paathner card
            }
        }
        fetchProjects();
    }
});
