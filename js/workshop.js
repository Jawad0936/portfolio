/* ===================================================================
 * workshop.js — Jawad's Workshop Page
 * Project filter tabs + entrance animations
 * =================================================================== */

(function () {
    'use strict';

    /* Project Filter Tabs
     * -------------------------------------------------- */
    const ssWorkshopFilter = function () {
        const tabs = document.querySelectorAll('.filter-tab');
        const cards = document.querySelectorAll('.proj-card');

        if (!tabs.length || !cards.length) return;

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const filter = tab.getAttribute('data-filter');

                // Update active tab
                tabs.forEach(function (t) { t.classList.remove('is-active'); });
                tab.classList.add('is-active');

                // Filter cards with fade animation
                cards.forEach(function (card) {
                    const cat = card.getAttribute('data-category');
                    const match = filter === 'all' || cat === filter;

                    if (!match) {
                        // fade out then hide
                        card.classList.add('filter-fade-out');
                        setTimeout(function () {
                            card.classList.add('is-hidden');
                            card.classList.remove('filter-fade-out');
                        }, 250);
                    } else {
                        // show then fade in
                        card.classList.remove('is-hidden');
                        // small delay so DOM paints before animating
                        requestAnimationFrame(function () {
                            card.classList.add('filter-fade-in');
                            setTimeout(function () {
                                card.classList.remove('filter-fade-in');
                            }, 350);
                        });
                    }
                });
            });
        });
    };


    /* Scroll-triggered card entrance for projects grid
     * -------------------------------------------------- */
    const ssWorkshopCards = function () {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.proj-card');

        // Set initial state
        cards.forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(32px)';
            card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    // stagger by card index
                    const idx = Array.from(cards).indexOf(card);
                    setTimeout(function () {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, idx * 80);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.12 });

        cards.forEach(function (card) {
            observer.observe(card);
        });
    };


    /* Skill Domain hover count-up accent  
     * -------------------------------------------------- */
    const ssSkillDomains = function () {
        const domains = document.querySelectorAll('.skill-domain');
        if (!domains.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        domains.forEach(function (d, i) {
            d.style.opacity = '0';
            d.style.transform = 'translateY(24px)';
            d.style.transition = 'opacity 0.55s ease ' + (i * 0.08) + 's, transform 0.55s ease ' + (i * 0.08) + 's';
            observer.observe(d);
        });
    };


    /* Init
     * -------------------------------------------------- */
    (function wsInit() {
        ssWorkshopFilter();
        ssWorkshopCards();
        ssSkillDomains();
        ssStackChart();
    })();


    /* Stack Chart (pie) using Chart.js
     * -------------------------------------------------- */
    function ssStackChart() {
        const canvas = document.getElementById('stackChart');
        if (!canvas || typeof Chart === 'undefined') return;

        // Labels and values: edit these to match your actual experience
        const stackData = {
            labels: ['Elixir', 'Java', 'MERN', 'Python', 'DevOps'],
            values: [28, 24, 20, 16, 12]
        };

        const colors = [
            '#7DD3FC', // Elixir (blue)
            '#F59E0B', // Java (amber)
            '#34D399', // MERN (green)
            '#A78BFA', // Python (purple)
            '#F87171'  // DevOps (red)
        ];

        const ctx = canvas.getContext('2d');
        // eslint-disable-next-line no-unused-vars
        const pie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: stackData.labels,
                datasets: [{
                    data: stackData.values,
                    backgroundColor: colors,
                    hoverOffset: 8,
                    borderColor: 'rgba(255,255,255,0.06)',
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: 'white', boxWidth: 12, padding: 12 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a,b)=>a+b,0);
                                const pct = ((value/total)*100).toFixed(1) + '%';
                                return label + ': ' + value + ' (' + pct + ')';
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

})();
