export class InfoPanel {
    constructor() {
        this.element = this.createElement();
        this.visible = false;
        this.currentAgent = null;
        this.dataLogger = null;
    }

    createElement() {
        const panel = document.createElement('div');
        panel.className = 'info-panel';
        panel.innerHTML = `
            <div class="info-panel-header">
                <div class="header-content">
                    <span class="agent-avatar"></span>
                    <h2 class="agent-name"></h2>
                </div>
                <button class="close-btn">×</button>
            </div>
            <div class="info-panel-content"></div>
        `;

        panel.querySelector('.close-btn').addEventListener('click', () => this.hide());
        return panel;
    }

    setDataLogger(dataLogger) {
        this.dataLogger = dataLogger;
    }

    show(agent) {
        this.currentAgent = agent;
        
        // 更新头部信息
        const avatar = this.element.querySelector('.agent-avatar');
        const name = this.element.querySelector('.agent-name');
        avatar.textContent = agent.avatar;
        name.textContent = agent.name;

        // 如果面板已经显示，只更新需要实时更新的部分
        if (this.visible) {
            this.updateDynamicContent(agent);
            // 更新聊天历史
            const chatHistory = this.element.querySelector('.chat-history');
            if (chatHistory) {
                chatHistory.innerHTML = this.generateChatHistoryHtml(agent);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }
        } else {
            // 首次显示时加载完整内容
            this.element.querySelector('.info-panel-content').innerHTML = this.generateFullContent(agent);
            this.element.classList.add('visible');
            this.visible = true;

            // 自动滚动到最新消息
            const chatHistory = this.element.querySelector('.chat-history');
            if (chatHistory) {
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }
        }

        if (this.dataLogger) {
            this.dataLogger.minimizePanel();
        }
    }

    // 新增：只更新需要实时刷新的内容
    updateDynamicContent(agent) {
        // 更新状态信息
        const statusItems = this.element.querySelectorAll('.status-value');
        statusItems[0].textContent = `${Math.floor(agent.energy)}%`;
        statusItems[1].textContent = `${agent.experience}/100`;
        statusItems[2].textContent = Math.floor(agent.specialtyLevel);

        // 更新关系网络
        const relationshipsContainer = this.element.querySelector('.relationships-container');
        if (relationshipsContainer) {
            relationshipsContainer.innerHTML = this.generateRelationshipsHtml(agent);
        }

        // 更新互动历史
        const interactionsContainer = this.element.querySelector('.interactions-container');
        if (interactionsContainer) {
            interactionsContainer.innerHTML = this.generateInteractionsHtml(agent);
        }
    }

    // 新增：生成完整内容的方法
    generateFullContent(agent) {
        return `
            <div class="agent-status">
                <div class="status-item">
                    <span class="status-icon">⚡</span>
                    <span class="status-label">能量</span>
                    <span class="status-value">${Math.floor(agent.energy)}%</span>
                </div>
                <div class="status-item">
                    <span class="status-icon">📈</span>
                    <span class="status-label">经验</span>
                    <span class="status-value">${agent.experience}/100</span>
                </div>
                <div class="status-item">
                    <span class="status-icon">🎯</span>
                    <span class="status-label">等级</span>
                    <span class="status-value">${Math.floor(agent.specialtyLevel)}</span>
                </div>
            </div>
            <div class="agent-description">
                <p>${agent.description}</p>
                <div class="traits">
                    ${agent.traits.map(trait => `
                        <span class="trait-tag">
                            <span class="trait-icon">✨</span>
                            ${trait}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="agent-sections">
                <div class="relationships-section">
                    <div class="section-header">
                        <span class="section-icon">🤝</span>
                        <h3>关系网络</h3>
                    </div>
                    <div class="relationships-container">
                        ${this.generateRelationshipsHtml(agent)}
                    </div>
                </div>
                <div class="interactions-section">
                    <div class="section-header">
                        <span class="section-icon">📝</span>
                        <h3>最近互动</h3>
                    </div>
                    <div class="interactions-container">
                        ${this.generateInteractionsHtml(agent)}
                    </div>
                </div>
            </div>
            <div class="chat-interface">
                <div class="chat-header">
                    <span class="chat-icon">💭</span>
                    <h3>对话</h3>
                </div>
                <div class="chat-history">
                    ${this.generateChatHistoryHtml(agent)}
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="和${agent.name}对话..." id="chat-input-${agent.id}">
                    <button onclick="sendMessage(${agent.id})">
                        <span class="send-icon">📤</span>
                        发送
                    </button>
                </div>
            </div>
        `;
    }

    generateRelationshipsHtml(agent) {
        if (!agent.relationships || agent.relationships.size === 0) {
            return '<div class="no-data">暂无互动关系</div>';
        }

        return Array.from(agent.relationships.entries())
            .map(([id, value]) => {
                const partner = window.townManager.agents.find(a => a.id === parseInt(id));
                if (!partner) return '';
                return `
                    <div class="relationship-item">
                        <div class="relationship-header">
                            <div class="partner-info">
                                <span class="partner-avatar">${partner.avatar}</span>
                                <span class="partner-name">${partner.name}</span>
                            </div>
                            <span class="relationship-value">
                                <span class="value-icon">❤️</span>
                                ${Math.floor(value * 100)}%
                            </span>
                        </div>
                        <div class="relationship-bar">
                            <div class="relationship-fill" style="width: ${value * 100}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    generateInteractionsHtml(agent) {
        if (!agent.interactionHistory || agent.interactionHistory.length === 0) {
            return '<div class="no-data">暂无互动记录</div>';
        }

        return agent.interactionHistory
            .slice(-5)
            .reverse()
            .map(interaction => `
                <div class="interaction-item">
                    <div class="interaction-header">
                        <span class="interaction-time">
                            <span class="time-icon">🕒</span>
                            ${new Date(interaction.timestamp).toLocaleTimeString()}
                        </span>
                        <span class="interaction-type">
                            ${this.getInteractionIcon(interaction.type)}
                            ${interaction.type}
                        </span>
                    </div>
                    <div class="interaction-content">
                        <span class="interaction-partner">
                            <span class="partner-icon">👥</span>
                            与 ${interaction.partnerName}
                        </span>
                        <span class="interaction-result">
                            <span class="result-icon">📊</span>
                            ${interaction.result}
                        </span>
                    </div>
                </div>
            `).join('');
    }

    generateChatHistoryHtml(agent) {
        if (!agent.conversationHistory || agent.conversationHistory.length === 0) {
            return '<div class="no-data">暂无对话记录</div>';
        }

        return agent.conversationHistory.map(msg => {
            // 根据消息类型使用不同的样式
            const messageClass = msg.role === 'user' ? 'user' : 'assistant';
            const icon = msg.role === 'user' ? '👤' : agent.avatar;
            
            return `
                <div class="chat-message ${messageClass}">
                    <div class="message-header">
                        <span class="message-icon">${icon}</span>
                        <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div class="message-content">${msg.content}</div>
                </div>
            `;
        }).join('');
    }

    getInteractionIcon(type) {
        const icons = {
            '协作': '🤝',
            '指导': '📚',
            '学习': '🎓',
            '优化': '⚡',
            '共享': '🔄'
        };
        return icons[type] || '📝';
    }

    hide() {
        this.element.classList.remove('visible');
        this.visible = false;
        this.currentAgent = null;
    }

    update() {
        if (this.visible && this.currentAgent) {
            this.updateDynamicContent(this.currentAgent);
        }
    }
} 