// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize Counters
    const counterOptions = {
        duration: 2.5,
        useEasing: true,
        useGrouping: true,
    };

    // Inicializar contadores com verificação de elementos
    const initCounter = (id, start, end, decimals = 0, options = {}) => {
        const element = document.getElementById(id);
        if (element) {
            new CountUp(id, start, end, decimals, 2.5, {
                ...counterOptions,
                ...options
            }).start();
        }
    };

    // Inicializar todos os contadores
    initCounter('revenue-counter', 0, 1.2, 1, { prefix: '$', suffix: 'M' });
    initCounter('customers-counter', 0, 3450, 0);
    initCounter('avg-order-counter', 0, 349.50, 2, { prefix: '$' });
    initCounter('conversion-counter', 0, 4.8, 1, { suffix: '%' });
    initCounter('visitors-counter', 0, 150, 0, { suffix: 'k' });

    // Configuração comum para os gráficos
    Chart.defaults.color = '#888';
    Chart.defaults.borderColor = '#333';

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jul', 'Aug', 'Sep'],
                datasets: [{
                    label: 'Revenue',
                    data: [800000, 1100000, 1200000],
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#333'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#333'
                        }
                    }
                }
            }
        });
    }

    // Traffic Distribution Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Paid', 'Organic', 'Direct', 'Referral'],
                datasets: [{
                    data: [60, 20, 5, 15],
                    backgroundColor: ['#FFD700', '#4CAF50', '#2196F3', '#f44336']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            color: '#888',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: ['Apparel', 'Electronics', 'Home Goods', 'Books'],
                datasets: [{
                    data: [85, 70, 55, 40],
                    backgroundColor: '#FFD700',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: '#333'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Add hover effects to metric cards
    document.querySelectorAll('.metric-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});