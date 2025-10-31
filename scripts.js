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
        const savedChecklist = localStorage.getItem('checklist');
        
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
        <div class="metric">
            <h3>${metric.label}</h3>
            <div class="value" style="color: ${getMetricColor(metric.change)}">
                ${formatMetricValue(metric.value, metric.type)}
            </div>
            <div class="change" style="color: ${getMetricColor(metric.change)}">
                ${formatChange(metric.change)}
            </div>
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
                backgroundColor: data.colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
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
                backgroundColor: data.colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
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
    
    charts.campaign = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayChecklist(items) {
    const checklistContainer = document.getElementById('checklist');
    checklistContainer.innerHTML = items.map((item, index) => `
        <div class="checklist-item">
            <input type="checkbox" id="task-${index}" 
                   ${item.completed ? 'checked' : ''} 
                   onchange="updateChecklistItem(${index}, this.checked)">
            <label for="task-${index}">${item.task}</label>
        </div>
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
            const items = JSON.parse(localStorage.getItem('checklist') || '[]');
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
            return new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            }).format(value);
        case 'percentage':
            return `${value.toFixed(1)}%`;
        case 'number':
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
    fetch(`data/checklist.json`)
        .then(response => response.json())
        .then(data => {
            data[index].completed = completed;
            // Salvar no localStorage como alternativa
            localStorage.setItem('checklist', JSON.stringify(data));
            
            // Atualizar barra de progresso
            updateProgressBar(data);
        })
        .catch(error => console.error('Erro ao atualizar checklist:', error));
}

// Função para resetar o checklist
async function resetChecklist() {
    if (confirm('Tem certeza que deseja resetar todo o progresso do checklist?')) {
        try {
            // Limpar localStorage
            localStorage.removeItem('checklist');
            
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
        <div class="phase-card" data-status="${phase.status}">
            <div class="phase-header status-${phase.status}" onclick="togglePhase(${phaseIndex})">
                <div class="phase-title">
                    <h3>${phase.fase}</h3>
                    <div class="phase-meta">
                        <span>⏱️ Prazo: ${phase.prazo}</span>
                        <span>📊 Status: ${phase.status === 'em-andamento' ? 'Em Andamento' : 'Pendente'}</span>
                        <span>✓ ${phase.tarefas.length} tarefas</span>
                    </div>
                </div>
                <button class="phase-toggle" id="toggle-${phaseIndex}">▼</button>
            </div>
            <div class="phase-content" id="phase-${phaseIndex}" style="display: none;">
                <div class="tasks-list">
                    ${phase.tarefas.map((task, taskIndex) => `
                        <div class="task-card">
                            <div class="task-header">
                                <div class="task-info">
                                    <span class="task-id">${task.id}</span>
                                    <h4 class="task-title">${task.titulo}</h4>
                                    <div class="task-meta">
                                        <div class="task-meta-item">
                                            <strong>👤</strong> ${task.responsavel}
                                        </div>
                                        <div class="task-meta-item">
                                            <strong>⏱️</strong> ${task.prazo}
                                        </div>
                                    </div>
                                    <div class="metric-badge">
                                        🎯 Meta: ${task.metrica}
                                    </div>
                                </div>
                                <div class="task-actions">
                                    <button class="task-expand-btn" onclick="toggleTaskDetails(${phaseIndex}, ${taskIndex})">
                                        <span id="btn-text-${phaseIndex}-${taskIndex}">Ver Detalhes</span>
                                    </button>
                                </div>
                            </div>
                            <div class="task-details" id="task-details-${phaseIndex}-${taskIndex}" style="display: none;">
                                <p class="subtasks-title">📝 Subtarefas:</p>
                                <ul class="subtasks-list">
                                    ${task.subtarefas.map(subtask => `
                                        <li class="subtask-item">${subtask}</li>
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
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
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
        <div class="kpi-category-card">
            <h3 class="kpi-category-title">${categoria.categoria}</h3>
            <div class="kpi-items-list">
                ${categoria.indicadores.map(indicador => `
                    <div class="kpi-item">
                        <span class="kpi-item-name">${indicador.nome}</span>
                        <div class="kpi-item-values">
                            <span class="kpi-meta">Meta: ${indicador.meta}</span>
                            <span class="kpi-atual status-${indicador.status}">${indicador.atual}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function displayPriorityActions(acoesData) {
    const container = document.getElementById('priorityActions');
    if (!container) return;

    container.innerHTML = acoesData.acoes.map(acao => `
        <div class="action-card status-${acao.status}">
            <div class="action-header">
                <h3 class="action-metric">${acao.metrica}</h3>
                <span class="action-status-badge status-${acao.status}">
                    ${acao.status === 'alerta' ? '⚠️ Alerta' : '🔴 Crítico'}
                </span>
            </div>
            <div class="action-gap">${acao.gap}</div>
            <ul class="action-list">
                ${acao.acoes.map(item => `
                    <li class="action-item">${item}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function displayTimeline(timelineData) {
    const container = document.getElementById('timelineMetas');
    if (!container) return;

    container.innerHTML = timelineData.periodos.map(periodo => `
        <div class="timeline-card">
            <h3 class="timeline-month">${periodo.mes}</h3>
            <p class="timeline-objective">🎯 ${periodo.objetivo}</p>
            <ul class="timeline-metas-list">
                ${periodo.metas.map(meta => `
                    <li class="timeline-meta-item">${meta}</li>
                `).join('')}
            </ul>
            <div class="timeline-revenue">
                <span class="timeline-revenue-value">${periodo.faturamento_projetado}</span>
                <span class="timeline-revenue-growth">Projeção de Faturamento</span>
            </div>
        </div>
    `).join('');
}