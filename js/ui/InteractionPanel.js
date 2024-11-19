export class InteractionPanel {
    constructor(townManager) {
        this.townManager = townManager;
        this.element = this.createElement();
    }

    createElement() {
        const panel = document.createElement('div');
        panel.className = 'interaction-panel';
        panel.innerHTML = `
            <div class="interaction-header">
                <h3>AI互动面板</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="interaction-content">
                <div class="interaction-agents">
                    <div class="source-agent">
                        <h4>发起者</h4>
                        <div class="agent-select"></div>
                    </div>
                    <div class="target-agent">
                        <h4>目标</h4>
                        <div class="agent-select"></div>
                    </div>
                </div>
                <div class="interaction-types">
                    <h4>互动类型</h4>
                    <div class="type-buttons">
                        <button data-type="COLLABORATE">�� 协作</button>
                        <button data-type="TEACH">📚 指导</button>
                        <button data-type="LEARN">🎓 学习</button>
                        <button data-type="OPTIMIZE">⚡ 优化</button>
                        <button data-type="SHARE">🔄 共享</button>
                    </div>
                </div>
                <div class="interaction-history">
                    <h4>互动历史</h4>
                    <div class="history-list"></div>
                </div>
            </div>
        `;

        this.initializeEventListeners(panel);
        return panel;
    }

    initializeEventListeners(panel) {
        panel.querySelector('.close-btn').addEventListener('click', () => this.hide());
        
        const typeButtons = panel.querySelectorAll('.type-buttons button');
        typeButtons.forEach(button => {
            button.addEventListener('click', () => this.handleInteraction(button.dataset.type));
        });
    }

    show(sourceAgent) {
        this.currentSourceAgent = sourceAgent;
        this.updateAgentSelectors();
        this.updateHistory();
        this.element.classList.add('visible');
    }

    hide() {
        this.element.classList.remove('visible');
    }

    updateAgentSelectors() {
        const sourceSelect = this.element.querySelector('.source-agent .agent-select');
        const targetSelect = this.element.querySelector('.target-agent .agent-select');

        sourceSelect.innerHTML = `
            <div class="selected-agent">
                <span class="agent-avatar">${this.currentSourceAgent.avatar}</span>
                <span class="agent-name">${this.currentSourceAgent.name}</span>
            </div>
        `;

        targetSelect.innerHTML = this.townManager.agents
            .filter(agent => agent !== this.currentSourceAgent)
            .map(agent => `
                <div class="agent-option" data-agent-id="${agent.id}">
                    <span class="agent-avatar">${agent.avatar}</span>
                    <span class="agent-name">${agent.name}</span>
                </div>
            `).join('');

        targetSelect.querySelectorAll('.agent-option').forEach(option => {
            option.addEventListener('click', () => this.selectTargetAgent(option.dataset.agentId));
        });
    }

    async handleInteraction(type) {
        if (!this.currentSourceAgent || !this.currentTargetAgent) {
            this.townManager.showNotification('请选择互动对象', 'error');
            return;
        }

        const result = await this.currentSourceAgent.interactWith(
            this.currentTargetAgent,
            this.currentSourceAgent.interactionTypes[type]
        );

        this.updateHistory();
        this.townManager.showNotification(result.result, 'success');
    }

    selectTargetAgent(agentId) {
        this.currentTargetAgent = this.townManager.agents.find(a => a.id === parseInt(agentId));
        this.element.querySelectorAll('.agent-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.agentId === agentId);
        });
    }

    updateHistory() {
        const historyList = this.element.querySelector('.history-list');
        const history = this.currentSourceAgent.interactionHistory
            .slice(-5)
            .reverse()
            .map(interaction => `
                <div class="history-item">
                    <div class="history-time">
                        ${new Date(interaction.timestamp).toLocaleTimeString()}
                    </div>
                    <div class="history-content">
                        <span class="interaction-type">${interaction.type}</span>
                        <span class="interaction-partner">与 ${interaction.partnerName}</span>
                    </div>
                    <div class="history-result">${interaction.result}</div>
                </div>
            `).join('');

        historyList.innerHTML = history;
    }
} 