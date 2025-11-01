// Variáveis globais para os gráficos
const charts = {
    traffic: null,
    category: null,
    campaign: null
};

// Inicialização do aplicativo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Adicionar evento ao botão de reset
    const resetButton = document.getElementById('reset-checklist');
    if (resetButton) {
        resetButton.addEventListener('click', resetChecklist);
    }
});

// Função principal de inicialização
async function initializeApp() {
    await loadMetrics();
    await loadTrafficData();
    await loadCategoryData();
    await loadCampaignData();
    await loadChecklist();
    await loadExecutionPlan();
    await loadMonitoringData();
}

// Funções de carregamento de dados
async function loadMetrics() {
    try {
        const response = await fetch('data/metrics.json');
        const data = await response.json();
        displayMetrics(data);
    } catch (error) {
        console.error('Erro ao carregar métricas:', error);
    }
}

async function loadTrafficData() {
    try {
        const response = await fetch('data/traffic.json');
        const data = await response.json();
        createTrafficChart(data);
    } catch (error) {
        console.error('Erro ao carregar dados de tráfego:', error);
    }
}

async function loadCategoryData() {
    try {
        const response = await fetch('data/categories.json');
        const data = await response.json();
        createCategoryChart(data);
    } catch (error) {
        console.error('Erro ao carregar dados de categorias:', error);
    }
}

async function loadCampaignData() {
    try {
        const response = await fetch('data/campaigns.json');
        const data = await response.json();
        createCampaignChart(data);
    } catch (error) {
        console.error('Erro ao carregar dados de campanhas:', error);
    }
}

async function loadChecklist() {
    try {
        // Tentar carregar do localStorage primeiro
        const savedChecklist = localStorage.getItem('mantovan-checklist');
        
        if (savedChecklist) {
            const data = JSON.parse(savedChecklist);
            displayChecklist(data);
        } else {
            const response = await fetch('data/checklist.json');
            const data = await response.json();
            displayChecklist(data);
        }
    } catch (error) {
        console.error('Erro ao carregar checklist:', error);
    }
}

// Funções de exibição
function displayMetrics(metrics) {
    const metricsContainer = document.getElementById('metrics');
    metricsContainer.innerHTML = metrics.map(metric => `
        <div class="flex flex-col gap-2 rounded-xl p-4 md:p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors min-h-[140px]">
            <p class="text-gray-300 text-sm md:text-base font-medium leading-normal whitespace-nowrap overflow-hidden text-ellipsis">${metric.label}</p>
            <p class="text-white tracking-tighter text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                ${formatMetricValue(metric.value, metric.type)}
            </p>
            <p class="${metric.change >= 0 ? 'text-green-400' : 'text-red-400'} text-sm md:text-base font-medium leading-normal">
                ${formatChange(metric.change)}
            </p>
        </div>
    `).join('');
}

function createTrafficChart(data) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (charts.traffic) {
        charts.traffic.destroy();
    }
    
    charts.traffic = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#f4d125', // Meta Ads - Amarelo neon (principal)
                    '#3b82f6', // Google Ads - Azul
                    '#10b981', // Orgânico - Verde
                    '#8b5cf6'  // Outros - Roxo
                ],
                borderWidth: 2,
                borderColor: '#121212',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#000000',
                    titleColor: '#f4d125',
                    bodyColor: '#ffffff',
                    borderColor: '#f4d125',
                    borderWidth: 2,
                    padding: 16,
                    displayColors: true,
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    cornerRadius: 8,
                    caretSize: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function createCategoryChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (charts.category) {
        charts.category.destroy();
    }
    
    charts.category = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Valor (R$)',
                data: data.values,
                backgroundColor: [
                    '#f4d125', // Produto Principal - Amarelo neon
                    '#10b981', // Order Bump 1 - Verde
                    '#f59e0b', // Order Bump 2 - Laranja
                    '#8b5cf6'  // Upsells - Roxo
                ],
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: [
                    '#ffd700', // Amarelo mais claro
                    '#34d399', // Verde mais claro
                    '#fbbf24', // Laranja mais claro
                    '#a78bfa'  // Roxo mais claro
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#000000',
                    titleColor: '#f4d125',
                    bodyColor: '#ffffff',
                    borderColor: '#f4d125',
                    borderWidth: 2,
                    padding: 16,
                    displayColors: false,
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    cornerRadius: 8,
                    caretSize: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            family: 'Inter',
                            size: 10
                        },
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: false
                    }
                }
            }
        }
    });
}

function createCampaignChart(data) {
    const ctx = document.getElementById('campaignChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (charts.campaign) {
        charts.campaign.destroy();
    }
    
    // Atualizar cores dos datasets
    const updatedDatasets = data.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: index === 0 ? '#ef4444' : '#10b981',
        backgroundColor: index === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: index === 0 ? '#ef4444' : '#10b981',
        pointBorderColor: '#121212',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#f4d125',
        pointHoverBorderColor: '#121212',
        pointHoverBorderWidth: 3
    }));
    
    charts.campaign = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: updatedDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#d1d5db',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    backgroundColor: '#000000',
                    titleColor: '#f4d125',
                    bodyColor: '#ffffff',
                    borderColor: '#f4d125',
                    borderWidth: 2,
                    padding: 16,
                    displayColors: true,
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    cornerRadius: 8,
                    caretSize: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': R$ ' + context.parsed.y.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: function(value) {
                            return 'R$ ' + (value/1000) + 'k';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function displayChecklist(items) {
    const checklistContainer = document.getElementById('checklist');
    checklistContainer.innerHTML = items.map((item, index) => `
        <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${item.completed ? 'opacity-60' : ''}">
            <input type="checkbox" 
                   id="task-${index}" 
                   ${item.completed ? 'checked' : ''} 
                   onchange="updateChecklistItem(${index}, this.checked)"
                   class="form-checkbox bg-transparent border-white/20 rounded text-primary focus:ring-primary focus:ring-offset-background-dark w-5 h-5">
            <span class="text-sm text-gray-200 ${item.completed ? 'line-through' : ''}">${item.task}</span>
        </label>
    `).join('');
    
    // Atualizar barra de progresso inicial
    updateProgressBar(items);
}

function updateProgressBar(items) {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Atualizar texto
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `${completed} de ${total} concluídas (${percentage}%)`;
    }
    
    // Atualizar barra
    const progressBarFill = document.getElementById('progress-bar-fill');
    if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
        progressBarFill.setAttribute('data-progress', `${percentage}%`);
        
        // Adicionar classe quando completar 100%
        if (percentage === 100) {
            progressBarFill.classList.add('complete');
            // Efeito de celebração
            showCelebration();
        } else {
            progressBarFill.classList.remove('complete');
        }
    }
}

// Função de celebração quando completar 100%
function showCelebration() {
    const progressText = document.getElementById('progress-text');
    if (progressText && !progressText.classList.contains('celebrated')) {
        progressText.classList.add('celebrated');
        progressText.textContent = '🎉 Parabéns! Todas as tarefas concluídas! 🎉';
        
        // Voltar ao texto normal após 3 segundos
        setTimeout(() => {
            progressText.classList.remove('celebrated');
            const items = JSON.parse(localStorage.getItem('mantovan-checklist') || '[]');
            const completed = items.filter(item => item.completed).length;
            const total = items.length;
            const percentage = Math.round((completed / total) * 100);
            progressText.textContent = `${completed} de ${total} concluídas (${percentage}%)`;
        }, 3000);
    }
}

// Funções utilitárias
function getMetricColor(change) {
    return change >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
}

function formatMetricValue(value, type) {
    switch(type) {
        case 'currency':
            // Formatação mais compacta para valores grandes
            if (value >= 1000000) {
                return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')}M`;
            } else if (value >= 1000) {
                return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
            }
            return new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(value);
        case 'percentage':
            return `${value.toFixed(1)}%`;
        case 'number':
            // Formatação compacta para números grandes
            if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1).replace('.', ',')}M`;
            } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1).replace('.', ',')}k`;
            }
            return new Intl.NumberFormat('pt-BR').format(value);
        default:
            return value;
    }
}

function formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
}

// Função de atualização do checklist
function updateChecklistItem(index, completed) {
    // Carregar do localStorage primeiro
    const savedChecklist = localStorage.getItem('mantovan-checklist');
    
    if (savedChecklist) {
        const data = JSON.parse(savedChecklist);
        data[index].completed = completed;
        localStorage.setItem('mantovan-checklist', JSON.stringify(data));
        
        // Atualizar barra de progresso imediatamente
        updateProgressBar(data);
    } else {
        // Se não tiver no localStorage, carregar do arquivo
        fetch(`data/checklist.json`)
            .then(response => response.json())
            .then(data => {
                data[index].completed = completed;
                localStorage.setItem('mantovan-checklist', JSON.stringify(data));
                
                // Atualizar barra de progresso
                updateProgressBar(data);
            })
            .catch(error => console.error('Erro ao atualizar checklist:', error));
    }
}

// Função para resetar o checklist
async function resetChecklist() {
    if (confirm('Tem certeza que deseja resetar todo o progresso do checklist?')) {
        try {
            // Limpar localStorage
            localStorage.removeItem('mantovan-checklist');
            
            // Recarregar checklist do arquivo original
            const response = await fetch('data/checklist.json');
            const data = await response.json();
            
            // Resetar todos os itens
            data.forEach(item => item.completed = false);
            
            // Atualizar display
            displayChecklist(data);
        } catch (error) {
            console.error('Erro ao resetar checklist:', error);
        }
    }
}

// Funções do Plano de Execução
let executionPlanData = [];
let currentFilter = 'all';

async function loadExecutionPlan() {
    try {
        const response = await fetch('data/execution-plan.json');
        executionPlanData = await response.json();
        displayExecutionPlan(executionPlanData);
        setupFilterButtons();
    } catch (error) {
        console.error('Erro ao carregar plano de execução:', error);
    }
}

function displayExecutionPlan(phases) {
    const container = document.getElementById('executionPlanContainer');
    if (!container) return;

    container.innerHTML = phases.map((phase, phaseIndex) => `
        <div class="phase-card border border-white/10 rounded-xl overflow-hidden" data-status="${phase.status}">
            <div class="bg-gradient-to-r ${phase.status === 'em-andamento' ? 'from-orange-500 to-orange-600' : 'from-gray-600 to-gray-700'} text-white p-4 cursor-pointer flex justify-between items-center" onclick="togglePhase(${phaseIndex})">
                <div class="flex-1">
                    <h3 class="font-semibold text-lg mb-2">${phase.fase}</h3>
                    <div class="flex flex-wrap gap-3 text-sm opacity-95">
                        <span>⏱️ Prazo: ${phase.prazo}</span>
                        <span>📊 Status: ${phase.status === 'em-andamento' ? 'Em Andamento' : 'Pendente'}</span>
                        <span>✓ ${phase.tarefas.length} tarefas</span>
                    </div>
                </div>
                <button class="phase-toggle text-2xl" id="toggle-${phaseIndex}">▼</button>
            </div>
            <div class="bg-white/5 p-4" id="phase-${phaseIndex}" style="display: none;">
                <div class="flex flex-col gap-4">
                    ${phase.tarefas.map((task, taskIndex) => `
                        <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div class="flex justify-between items-start gap-4 mb-3">
                                <div class="flex-1">
                                    <span class="inline-block bg-primary text-background-dark font-semibold py-1 px-3 rounded text-sm mb-2">${task.id}</span>
                                    <h4 class="text-white font-semibold text-base mb-2">${task.titulo}</h4>
                                    <div class="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                                        <span><strong class="text-gray-300">👤</strong> ${task.responsavel}</span>
                                        <span><strong class="text-gray-300">⏱️</strong> ${task.prazo}</span>
                                    </div>
                                    <div class="inline-block bg-green-500/20 text-green-400 py-1 px-3 rounded text-sm font-semibold">
                                        🎯 Meta: ${task.metrica}
                                    </div>
                                </div>
                                <button class="bg-primary text-background-dark font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform" onclick="toggleTaskDetails(${phaseIndex}, ${taskIndex})">
                                    <span id="btn-text-${phaseIndex}-${taskIndex}">Ver Detalhes</span>
                                </button>
                            </div>
                            <div class="border-t border-white/10 pt-3 mt-3" id="task-details-${phaseIndex}-${taskIndex}" style="display: none;">
                                <p class="text-gray-300 font-semibold text-sm mb-2">📝 Subtarefas:</p>
                                <ul class="flex flex-col gap-2">
                                    ${task.subtarefas.map(subtask => `
                                        <li class="flex items-center gap-2 text-sm text-gray-400 bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                                            <span class="text-primary font-bold">→</span>
                                            ${subtask}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function togglePhase(phaseIndex) {
    const content = document.getElementById(`phase-${phaseIndex}`);
    const toggle = document.getElementById(`toggle-${phaseIndex}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.classList.add('expanded');
    } else {
        content.style.display = 'none';
        toggle.classList.remove('expanded');
    }
}

function navigateToPhase(phaseIndex) {
    // Atualizar estilos dos botões de navegação
    document.querySelectorAll('.phase-nav-btn').forEach(btn => {
        if (parseInt(btn.dataset.phase) === phaseIndex) {
            btn.classList.remove('bg-white/10', 'text-white');
            btn.classList.add('bg-primary', 'text-background-dark');
        } else {
            btn.classList.remove('bg-primary', 'text-background-dark');
            btn.classList.add('bg-white/10', 'text-white');
        }
    });
    
    // Atualizar cores de todos os headers das fases
    document.querySelectorAll('.phase-card').forEach((card, index) => {
        const header = card.querySelector('.bg-gradient-to-r');
        if (header) {
            if (index === phaseIndex) {
                // Fase selecionada - laranja
                header.classList.remove('from-gray-600', 'to-gray-700');
                header.classList.add('from-orange-500', 'to-orange-600');
            } else {
                // Outras fases - cinza
                header.classList.remove('from-orange-500', 'to-orange-600');
                header.classList.add('from-gray-600', 'to-gray-700');
            }
        }
    });
    
    // Fechar todas as fases
    document.querySelectorAll('[id^="phase-"]').forEach(content => {
        if (content.id !== `phase-${phaseIndex}`) {
            content.style.display = 'none';
            const index = content.id.split('-')[1];
            const toggle = document.getElementById(`toggle-${index}`);
            if (toggle) {
                toggle.classList.remove('expanded');
            }
        }
    });
    
    // Abrir a fase selecionada
    const targetContent = document.getElementById(`phase-${phaseIndex}`);
    const targetToggle = document.getElementById(`toggle-${phaseIndex}`);
    
    if (targetContent) {
        targetContent.style.display = 'block';
        if (targetToggle) {
            targetToggle.classList.add('expanded');
        }
        
        // Scroll suave até a fase
        const phaseCard = targetContent.closest('.phase-card');
        if (phaseCard) {
            phaseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function toggleTaskDetails(phaseIndex, taskIndex) {
    const details = document.getElementById(`task-details-${phaseIndex}-${taskIndex}`);
    const btnText = document.getElementById(`btn-text-${phaseIndex}-${taskIndex}`);
    const btn = btnText.parentElement;
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        btnText.textContent = 'Ocultar Detalhes';
        btn.classList.add('expanded');
    } else {
        details.style.display = 'none';
        btnText.textContent = 'Ver Detalhes';
        btn.classList.remove('expanded');
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active classes from all buttons
            filterButtons.forEach(b => {
                b.classList.remove('bg-primary', 'text-background-dark');
                b.classList.add('bg-white/10', 'text-white');
            });
            
            // Add active classes to clicked button
            this.classList.remove('bg-white/10', 'text-white');
            this.classList.add('bg-primary', 'text-background-dark');
            
            // Get filter value
            const filter = this.dataset.filter;
            currentFilter = filter;
            
            // Filter phases
            filterPhases(filter);
        });
    });
}

function filterPhases(filter) {
    const phaseCards = document.querySelectorAll('.phase-card');
    
    phaseCards.forEach(card => {
        if (filter === 'all') {
            card.classList.remove('hidden');
        } else {
            const status = card.dataset.status;
            if (status === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// Funções de Monitoramento
async function loadMonitoringData() {
    try {
        const response = await fetch('data/monitoring.json');
        const data = await response.json();
        
        displayMonitoringKPIs(data.kpis_mensais);
        displayPriorityActions(data.acoes_prioritarias);
        displayTimeline(data.timeline_metas);
    } catch (error) {
        console.error('Erro ao carregar dados de monitoramento:', error);
    }
}

function displayMonitoringKPIs(kpisData) {
    const container = document.getElementById('monitoringKPIs');
    if (!container) return;

    container.innerHTML = kpisData.metricas.map(categoria => `
        <div class="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 class="text-white font-semibold text-base mb-3">${categoria.categoria}</h3>
            <div class="flex flex-col gap-2">
                ${categoria.indicadores.map(indicador => {
                    const statusColors = {
                        'ok': 'bg-green-500/20 text-green-400',
                        'alerta': 'bg-yellow-500/20 text-yellow-400',
                        'critico': 'bg-red-500/20 text-red-400',
                        'excelente': 'bg-blue-500/20 text-blue-400'
                    };
                    return `
                    <div class="flex justify-between items-center p-2 bg-background-dark rounded text-sm">
                        <span class="text-gray-300 font-medium">${indicador.nome}</span>
                        <div class="flex gap-2 items-center">
                            <span class="text-gray-400 text-xs">Meta: ${indicador.meta}</span>
                            <span class="font-semibold py-1 px-2 rounded ${statusColors[indicador.status]}">${indicador.atual}</span>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>
    `).join('');
}

function displayPriorityActions(acoesData) {
    const container = document.getElementById('priorityActions');
    if (!container) return;

    container.innerHTML = acoesData.acoes.map(acao => {
        const borderColor = acao.status === 'alerta' ? 'border-l-yellow-500' : 'border-l-red-500';
        const badgeColor = acao.status === 'alerta' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400';
        return `
        <div class="bg-white/5 border border-white/10 ${borderColor} border-l-4 rounded-lg p-4">
            <div class="flex justify-between items-start gap-4 mb-3">
                <h3 class="text-white font-semibold text-base">${acao.metrica}</h3>
                <span class="font-semibold py-1 px-3 rounded text-sm ${badgeColor}">
                    ${acao.status === 'alerta' ? '⚠️ Alerta' : '🔴 Crítico'}
                </span>
            </div>
            <div class="bg-background-dark p-3 rounded mb-3 text-sm text-gray-400">${acao.gap}</div>
            <ul class="flex flex-col gap-2">
                ${acao.acoes.map(item => `
                    <li class="flex items-start gap-2 text-sm text-gray-300 bg-background-dark p-3 rounded hover:bg-white/5 transition-colors">
                        <span class="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-background-dark flex items-center justify-center text-xs font-bold">✓</span>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `}).join('');
}

function displayTimeline(timelineData) {
    const container = document.getElementById('timelineMetas');
    if (!container) return;

    const gradients = [
        'from-pink-500 to-rose-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500'
    ];

    container.innerHTML = timelineData.periodos.map((periodo, index) => `
        <div class="timeline-card bg-gradient-to-br ${gradients[index]} text-white rounded-xl p-6 relative overflow-hidden">
            <h3 class="text-xl font-bold mb-2">${periodo.mes}</h3>
            <p class="text-sm opacity-90 mb-4">🎯 ${periodo.objetivo}</p>
            <ul class="flex flex-col gap-2 mb-4">
                ${periodo.metas.map(meta => `
                    <li class="flex items-start gap-2 text-sm opacity-95">
                        <span class="font-bold">→</span>
                        <span>${meta}</span>
                    </li>
                `).join('')}
            </ul>
            <div class="bg-white/20 p-4 rounded-lg text-center">
                <span class="block text-2xl font-bold">${periodo.faturamento_projetado}</span>
                <span class="text-sm opacity-90">Projeção de Faturamento</span>
            </div>
        </div>
    `).join('');
}