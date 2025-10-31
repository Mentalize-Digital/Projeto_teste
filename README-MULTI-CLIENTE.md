# 📊 Dashboard de Mentorias - Multi-Cliente

Este projeto contém dashboards personalizados para diferentes clientes de mentoria.

## 🗂️ Estrutura do Projeto

```
Projeto_teste/
├── index.html              → Página 404 (Não encontrado)
├── ricardo/                → Ecossistema completo do Ricardo
│   ├── index.html
│   ├── scripts.js
│   ├── style.css
│   ├── assets/
│   │   └── logo-mastermind.png
│   └── data/
│       ├── metrics.json
│       ├── traffic.json
│       ├── categories.json
│       ├── campaigns.json
│       ├── checklist.json
│       ├── execution-plan.json
│       └── monitoring.json
└── victor/                 → Ecossistema completo do Victor
    ├── index.html
    ├── scripts.js
    ├── style.css
    ├── assets/
    │   └── logo-tag-advogados.png
    └── data/
        ├── metrics.json
        ├── traffic.json
        ├── categories.json
        ├── campaigns.json
        ├── checklist.json
        ├── execution-plan.json
        └── monitoring.json
```

## 🚀 Como Usar

### Dashboard Ricardo
**URL:** `http://localhost:5500/ricardo/`  
ou abra: `ricardo/index.html`

### Dashboard Victor (TAG Advogados)
**URL:** `http://localhost:5500/victor/`  
ou abra: `victor/index.html`

### Página 404
**URL:** `http://localhost:5500/`  
Página raiz com links para ambos os dashboards

## 📝 Como Adicionar Novo Cliente

1. **Criar Pasta do Cliente:**
   - Criar pasta `[nome-cliente]/` na raiz

2. **Copiar Estrutura:**
   - Copiar `ricardo/index.html` → `[nome-cliente]/index.html`
   - Copiar `ricardo/scripts.js` → `[nome-cliente]/scripts.js`
   - Copiar `ricardo/style.css` → `[nome-cliente]/style.css`
   - Copiar `ricardo/assets/` → `[nome-cliente]/assets/`
   - Copiar `ricardo/data/` → `[nome-cliente]/data/`

3. **Editar HTML:**
   - Abrir `[nome-cliente]/index.html`
   - Editar título, textos do header e nome do logo

4. **Editar Dados:**
   - Adaptar todos os JSONs em `[nome-cliente]/data/`
   - Trocar logo em `[nome-cliente]/assets/`

5. **Atualizar Página 404:**
   - Adicionar link no `index.html` da raiz:
   ```html
   <a href="/[nome-cliente]/" class="btn">Dashboard [Nome]</a>
   ```

**URL final:** `http://localhost:5500/[nome-cliente]/` ✅

## 📊 Estrutura dos Dados (JSON)

### metrics.json
KPIs principais do dashboard (8 métricas)

### traffic.json
Distribuição de tráfego (gráfico de rosca)

### categories.json
Estrutura de produtos (gráfico de barras)

### campaigns.json
Performance semanal - 6 semanas (gráfico de linhas)

### checklist.json
Lista de tarefas do plano de ação

### execution-plan.json
Plano de execução em 4 fases

### monitoring.json
KPIs de monitoramento, ações prioritárias e timeline

## 🎯 Clientes Ativos

### 1. Ricardo - Viabilizando Sua Construção
- **URL:** `index.html`
- **Dados:** `data/`
- **Foco:** Construção civil
- **Faturamento:** R$ 150k/mês

### 2. Victor - TAG Advogados
- **URL:** `victor.html`
- **Dados:** `data-victor/`
- **Foco:** Recuperação de contas Meta/Instagram
- **Faturamento:** R$ 120k/mês
- **ROI:** 10-12x

## 🔄 Atualização de Dados

Para atualizar os dados de qualquer cliente:

1. Navegue até a pasta `data/` ou `data-victor/`
2. Edite o JSON desejado
3. Salve o arquivo
4. Recarregue a página do dashboard

**Não precisa editar código HTML ou JavaScript!**

## 📱 Responsividade

Todos os dashboards são totalmente responsivos:
- 📱 Mobile: 320px+
- 📱 Tablet: 768px+
- 💻 Desktop: 1024px+

## 🎨 Personalização

### Cores Principais
Definidas no `tailwind.config` no HTML:
- **Primary:** `#f4d125` (amarelo)
- **Background Dark:** `#121212`

### Logo
Coloque na pasta `assets/`:
- Ricardo: `logo-mastermind.png`
- Victor: `logo-tag-advogados.png`

## 📄 Licença

Projeto desenvolvido por Mentalize Digital para mentorias empresariais.
