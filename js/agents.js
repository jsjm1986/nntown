// 定义Agent的状态枚举
const AgentState = {
    IDLE: 'idle',
    ACTIVE: 'active',
    PROCESSING: 'processing',
    LEARNING: 'learning'
};

// 定义Agent的个性特征
const Personalities = {
    LOGICAL: 'logical',      // 理性的
    CREATIVE: 'creative',    // 创造性的
    CAUTIOUS: 'cautious',    // 谨慎的
    ENERGETIC: 'energetic',  // 活跃的
    PRECISE: 'precise',      // 精确的
    ADAPTIVE: 'adaptive',    // 适应性的
    BALANCED: 'balanced',    // 平衡的
    EFFICIENT: 'efficient'   // 高效的
};

export const agentData = [
    { 
        id: 1, 
        name: '输入神经元', 
        role: '接收外部信息的门户',
        personality: Personalities.ENERGETIC,
        description: '活泼好动的信息收集者，总是第一个发现新事物，像一个永远充满好奇心的探索者。',
        catchphrase: '让我看看外面有什么新鲜事！',
        avatar: '🔍',
        traits: ['好奇', '敏锐', '开放']
    },
    {
        id: 2,
        name: '处理单元',
        role: '信息处理和转换中心',
        personality: Personalities.EFFICIENT,
        description: '效率至上的数据处理专家，将混乱的信息转化为有序的数据流。',
        catchphrase: '让我来整理这些数据！',
        avatar: '⚡',
        traits: ['专注', '高效', '严谨']
    },
    {
        id: 3,
        name: '记忆中枢',
        role: '存储历史信息',
        personality: Personalities.PRECISE,
        description: '记忆力超群的知识守护者，珍藏着网络的每一份重要记忆。',
        catchphrase: '这段记忆我会好好保存。',
        avatar: '📚',
        traits: ['细心', '可靠', '有序']
    },
    {
        id: 4,
        name: '决策核心',
        role: '评估和决策中心',
        personality: Personalities.LOGICAL,
        description: '冷静理性的决策者，在复杂的情况下保持清晰的判断。',
        catchphrase: '让我们理性分析这个问题。',
        avatar: '🎯',
        traits: ['理性', '果断', '稳重']
    },
    {
        id: 5,
        name: '输出控制器',
        role: '输出信号调节器',
        personality: Personalities.BALANCED,
        description: '精确的信号调节师，确保每个输出都恰到好处。',
        catchphrase: '输出信号已经调节完毕！',
        avatar: '🎚️',
        traits: ['平衡', '细致', '可控']
    },
    {
        id: 6,
        name: '学习优化器',
        role: '网络性能优化',
        personality: Personalities.CREATIVE,
        description: '创新的优化专家，总能找到提升性能的新方法。',
        catchphrase: '又发现了一个优化的机会！',
        avatar: '🚀',
        traits: ['创新', '进取', '灵活']
    },
    {
        id: 7,
        name: '权重调节器',
        role: '连接强度管理',
        personality: Personalities.CAUTIOUS,
        description: '谨慎的权重管理员，精确调整每个连接的重要性。',
        catchphrase: '让我来调整这个权重。',
        avatar: '⚖️',
        traits: ['谨慎', '精确', '负责']
    },
    {
        id: 8,
        name: '激活函数',
        role: '信号转换器',
        personality: Personalities.ADAPTIVE,
        description: '灵活的信号转换专家，能够适应各种不同的信号类型。',
        catchphrase: '信号转换正在进行中！',
        avatar: '✨',
        traits: ['适应', '灵活', '艺术']
    }
];

export class Agent {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.role = data.role;
        this.personality = data.personality;
        this.description = data.description;
        this.catchphrase = data.catchphrase;
        this.avatar = data.avatar;
        this.traits = data.traits;

        this.position = { x: 0, y: 0 };
        this.element = null;
        this.state = AgentState.IDLE;
        this.memory = new Map();
        this.connections = [];
        this.processingPower = Math.random() * 0.5 + 0.5;
        this.learningRate = Math.random() * 0.3 + 0.1;
        this.energy = 100;
        this.mood = 'happy';
        this.experience = 0;
        this.specialtyLevel = Math.random() * 100;
        this.relationships = new Map();
        this.conversationHistory = [];

        this.roleContext = `你是一个名为 ${this.name} 的AI智能体，
            性格特征是 ${this.traits.join('、')}。
            你的职责是 ${this.role}。
            ${this.description}
            请始终保持这个角色，用符合角色特征的方式回应。`;

        // 添加能量恢复相关属性
        this.maxEnergy = 100;
        this.energyRecoveryRate = 2; // 每秒恢复的能量值
        this.lastEnergyUpdate = Date.now();
        
        // 启动能量恢复计时器
        this.startEnergyRecovery();

        // 添加互动相关的属性
        this.relationships = new Map(); // 存储与其他Agent的关系值
        this.interactionHistory = []; // 存储互动历史
        this.collaborationBonus = 1.0; // 协作效果加成
        
        // 定义互动类型
        this.interactionTypes = {
            COLLABORATE: '协作',
            TEACH: '指导',
            LEARN: '学习',
            OPTIMIZE: '优化',
            SHARE: '共享'
        };
    }

    // 添加能量恢复方法
    startEnergyRecovery() {
        setInterval(() => {
            if (this.energy < this.maxEnergy) {
                const now = Date.now();
                const deltaTime = (now - this.lastEnergyUpdate) / 1000; // 转换为秒
                const recoveryAmount = this.energyRecoveryRate * deltaTime;
                
                this.energy = Math.min(this.maxEnergy, this.energy + recoveryAmount);
                this.updateEnergyVisuals();
                
                // 当能量恢复到一定程度时更新心情
                if (this.energy > 80 && this.mood === 'tired') {
                    this.updateMood('happy');
                    // 添加恢复动画
                    this.element.classList.add('energy-recovered');
                    setTimeout(() => this.element.classList.remove('energy-recovered'), 1000);
                }
            }
            this.lastEnergyUpdate = Date.now();
        }, 1000); // 每秒更新一次
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'agent';
        element.innerHTML = `
            <div class="agent-avatar">${this.avatar}</div>
            <div class="agent-name">${this.name}</div>
        `;
        element.setAttribute('data-agent-id', this.id);
        element.setAttribute('data-personality', this.personality);
        this.element = element;
        return element;
    }

    async chat(input) {
        try {
            console.log('开始处理对话:', input);
            const context = `
                ${this.roleContext}
                当前状态：
                - 能量水平：${this.energy}%
                - 心情：${this.mood}
                - 专业水平：${Math.floor(this.specialtyLevel)}级
                
                请根据以上信息和角色设定来回应用户的输入。
            `;

            // 立即添加用户消息到历史记录
            const userMessage = {
                role: 'user',
                content: input,
                timestamp: Date.now()
            };
            this.conversationHistory.push(userMessage);

            // 创建一个临时的回复条目
            const responseEntry = {
                role: 'assistant',
                content: '',
                timestamp: Date.now()
            };
            this.conversationHistory.push(responseEntry);

            // 更新显示
            if (window.townManager.infoPanel.currentAgent === this) {
                window.townManager.infoPanel.show(this);
            }

            // 获取响应
            const response = await this.deepseek.generateResponse(input, context);
            if (response) {
                // 流式输出文字
                for (let i = 0; i < response.length; i++) {
                    responseEntry.content += response[i];
                    // 更新显示
                    if (window.townManager.infoPanel.currentAgent === this) {
                        window.townManager.infoPanel.show(this);
                    }
                    await new Promise(resolve => setTimeout(resolve, 30));
                }

                this.consumeEnergy(5);
                this.gainExperience(2);
                this.updateMoodBasedOnResponse(response);

                return response;
            }
        } catch (error) {
            console.error('对话生成失败:', error);
            return this.catchphrase;
        }
    }

    async processInput(data) {
        try {
            console.log(`${this.name} 正在处理数据:`, data);
            this.setState(AgentState.PROCESSING);
            
            // 根据角色不同，处理方式不同
            let result;
            switch(this.name) {
                case '输入神经元':
                    result = {
                        type: 'input',
                        value: data,
                        quality: this.processingPower
                    };
                    break;
                    
                case '处理单元':
                    result = {
                        type: 'processed',
                        value: data * this.processingPower,
                        quality: Math.random()
                    };
                    break;
                    
                case '记忆中枢':
                    this.memory.set(Date.now(), data);
                    result = {
                        type: 'stored',
                        value: data,
                        memorySize: this.memory.size
                    };
                    break;
                    
                case '决策核心':
                    const confidence = Math.random();
                    result = {
                        type: 'decision',
                        decision: confidence > 0.5 ? 'accept' : 'reject',
                        confidence: confidence,
                        value: data
                    };
                    break;
                    
                case '输出控制器':
                    result = {
                        type: 'output',
                        value: data * this.processingPower,
                        quality: Math.random()
                    };
                    break;
                    
                case '学习优化器':
                    const improvement = Math.random() * this.learningRate;
                    result = {
                        type: 'optimization',
                        value: data * (1 + improvement),
                        improvement: improvement
                    };
                    break;
                    
                case '权重调节器':
                    const adjustment = (Math.random() - 0.5) * this.learningRate;
                    result = {
                        type: 'weight',
                        value: data + adjustment,
                        adjustment: adjustment
                    };
                    break;
                    
                case '激活函数':
                    result = {
                        type: 'activation',
                        value: Math.tanh(data),
                        derivative: 1 - Math.pow(Math.tanh(data), 2)
                    };
                    break;
            }

            // 消耗能量
            this.consumeEnergy(10);
            
            // 获得经验
            this.gainExperience(5);
            
            // 模拟处理时间
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.setState(AgentState.IDLE);
            console.log(`${this.name} 处理完成:`, result);
            return result;
            
        } catch (error) {
            console.error(`${this.name} 处理数据失败:`, error);
            this.setState(AgentState.IDLE);
            throw error;
        }
    }

    setState(state) {
        this.state = state;
        if (this.element) {
            this.element.setAttribute('data-state', state);
            
            // 添加视觉反馈
            if (state === AgentState.PROCESSING) {
                this.element.classList.add('processing');
            } else {
                this.element.classList.remove('processing');
            }
        }
    }

    // ... 其他方法 ...

    updatePosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        if (this.element) {
            this.element.style.left = `${x - 40}px`;
            this.element.style.top = `${y - 40}px`;
        }
    }

    addInteractivity() {
        this.element.addEventListener('click', () => {
            const event = new CustomEvent('agent-clicked', {
                detail: { agent: this }
            });
            document.dispatchEvent(event);
        });
    }

    showDetailedInfo() {
        // 移除 super.showDetailedInfo() 调用，直接返回完整的HTML
        const baseInfo = `
            <div class="agent-detail">
                <div class="agent-header">
                    <span class="avatar">${this.avatar}</span>
                    <h2>${this.name}</h2>
                </div>
                <div class="agent-description">
                    <p>${this.description}</p>
                    <div class="traits">
                        ${this.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                    </div>
                </div>
                <div class="agent-stats">
                    <div class="stat">能量: ${this.energy}%</div>
                    <div class="stat">经验: ${this.experience}/100</div>
                    <div class="stat">等级: ${Math.floor(this.specialtyLevel)}</div>
                </div>
            </div>
        `;

        const relationshipsHtml = Array.from(this.relationships.entries())
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
                            <span class="relationship-value">${Math.floor(value * 100)}%</span>
                        </div>
                        <div class="relationship-bar">
                            <div class="relationship-fill" style="width: ${value * 100}%"></div>
                        </div>
                    </div>
                `;
            }).join('') || '<div class="no-relationships">暂无互动关系</div>';

        const interactionsHtml = this.interactionHistory
            .slice(-5)
            .reverse()
            .map(interaction => `
                <div class="interaction-item">
                    <div class="interaction-header">
                        <span class="interaction-time">
                            ${new Date(interaction.timestamp).toLocaleTimeString()}
                        </span>
                        <span class="interaction-type ${interaction.type.toLowerCase()}">
                            ${interaction.type}
                        </span>
                    </div>
                    <div class="interaction-content">
                        <span class="interaction-partner">与 ${interaction.partnerName}</span>
                        <span class="interaction-result">${interaction.result}</span>
                    </div>
                </div>
            `).join('') || '<div class="no-interactions">暂无互动记录</div>';

        const chatInterface = `
            <div class="chat-interface">
                <div class="chat-history">
                    ${this.conversationHistory.map(msg => `
                        <div class="chat-message ${msg.role}">
                            <div class="message-content">${msg.content}</div>
                            <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="和${this.name}对话..." id="chat-input-${this.id}">
                    <button onclick="sendMessage(${this.id})">发送</button>
                </div>
            </div>
        `;

        return `
            ${baseInfo}
            <div class="agent-sections">
                <div class="relationships-section">
                    <h3>关系网络</h3>
                    <div class="relationships-container">
                        ${relationshipsHtml}
                    </div>
                </div>
                <div class="interactions-section">
                    <h3>最近互动</h3>
                    <div class="interactions-container">
                        ${interactionsHtml}
                    </div>
                </div>
            </div>
            ${chatInterface}
        `;
    }

    consumeEnergy(amount) {
        const previousEnergy = this.energy;
        this.energy = Math.max(0, this.energy - amount);
        this.updateEnergyVisuals();

        // 当能量低于某个阈值时更新心情
        if (this.energy < 30 && previousEnergy >= 30) {
            this.updateMood('tired');
            // 添加视觉反馈
            this.element.classList.add('energy-low');
            setTimeout(() => this.element.classList.remove('energy-low'), 1000);
        }

        // 当能量耗尽时
        if (this.energy === 0) {
            this.handleEnergyDepletion();
        }
    }

    handleEnergyDepletion() {
        this.updateMood('stressed');
        // 显示疲劳提示
        if (this.element) {
            const exhaustedIndicator = document.createElement('div');
            exhaustedIndicator.className = 'exhausted-indicator';
            exhaustedIndicator.textContent = '😴';
            this.element.appendChild(exhaustedIndicator);
            
            setTimeout(() => exhaustedIndicator.remove(), 3000);
        }
    }

    updateEnergyVisuals() {
        const energyLevel = this.energy / this.maxEnergy;
        if (this.element) {
            // 更新透明度
            this.element.style.opacity = 0.7 + (energyLevel * 0.3);
            
            // 更新能量指示器
            let energyIndicator = this.element.querySelector('.energy-indicator');
            if (!energyIndicator) {
                energyIndicator = document.createElement('div');
                energyIndicator.className = 'energy-indicator';
                this.element.appendChild(energyIndicator);
            }

            // 计算圆形进度条的角度
            const degrees = energyLevel * 360;
            energyIndicator.style.transform = `rotate(${degrees}deg)`;
            
            // 设置能量等级
            if (energyLevel > 0.7) {
                energyIndicator.setAttribute('data-level', 'high');
            } else if (energyLevel > 0.3) {
                energyIndicator.setAttribute('data-level', 'medium');
            } else {
                energyIndicator.setAttribute('data-level', 'low');
            }

            // 添加恢复动画
            if (this.energy < this.maxEnergy) {
                energyIndicator.classList.add('recovering');
            } else {
                energyIndicator.classList.remove('recovering');
            }
        }
    }

    getEnergyColor(level) {
        if (level > 0.7) return '#4CAF50'; // 绿色 - 能量充足
        if (level > 0.3) return '#FFC107'; // 黄色 - 能量一般
        return '#F44336'; // 红色 - 能量不足
    }

    gainExperience(amount) {
        this.experience += amount;
        if (this.experience >= 100) {
            this.levelUp();
        }
    }

    levelUp() {
        this.specialtyLevel += 1;
        this.experience = 0;
        this.element.classList.add('level-up');
        setTimeout(() => {
            this.element.classList.remove('level-up');
        }, 1000);
    }

    updateMoodBasedOnResponse(response) {
        const positiveWords = ['开心', '很好', '成功', '优秀', '完美'];
        const negativeWords = ['失败', '错误', '问题', '困难', '糟糕'];
        
        let positiveCount = positiveWords.filter(word => response.includes(word)).length;
        let negativeCount = negativeWords.filter(word => response.includes(word)).length;
        
        if (positiveCount > negativeCount) {
            this.updateMood('happy');
        } else if (negativeCount > positiveCount) {
            this.updateMood('stressed');
        } else {
            this.updateMood('neutral');
        }
    }

    updateMood(newMood) {
        this.mood = newMood;
        this.element.setAttribute('data-mood', newMood);
    }

    // 添加互动方法
    async interactWith(otherAgent, interactionType) {
        console.log(`${this.name} 正在与 ${otherAgent.name} 进行 ${interactionType} 互动`);
        
        // 消耗能量
        this.consumeEnergy(3);
        otherAgent.consumeEnergy(3);

        let interactionResult = '';

        try {
            // 根据互动类型执行不同的行为
            switch(interactionType) {
                case this.interactionTypes.COLLABORATE:
                    // 协作提升双方的处理效率
                    const collaborationResult = await this.collaborate(otherAgent);
                    this.collaborationBonus *= 1.1;
                    otherAgent.collaborationBonus *= 1.1;
                    interactionResult = `协作效率提升至 ${(collaborationResult.efficiency * 100).toFixed(1)}%`;
                    this.updateRelationship(otherAgent, 0.2);
                    break;

                case this.interactionTypes.TEACH:
                    // 教导提升对方的经验，消耗自己更多能量
                    this.consumeEnergy(5);
                    otherAgent.gainExperience(10);
                    interactionResult = `成功传授经验，${otherAgent.name}获得10点经验`;
                    this.updateRelationship(otherAgent, 0.15);
                    break;

                case this.interactionTypes.LEARN:
                    // 学习获得经验，提升自己的专业水平
                    this.gainExperience(8);
                    this.specialtyLevel += 0.5;
                    interactionResult = `学习成功，专业水平提升0.5级`;
                    this.updateRelationship(otherAgent, 0.1);
                    break;

                case this.interactionTypes.OPTIMIZE:
                    // 优化提升双方的学习率
                    const oldRate = this.learningRate;
                    this.learningRate *= 1.05;
                    otherAgent.learningRate *= 1.05;
                    interactionResult = `优化完成，学习率提升${((this.learningRate - oldRate) * 100).toFixed(1)}%`;
                    this.updateRelationship(otherAgent, 0.25);
                    break;

                case this.interactionTypes.SHARE:
                    // 共享知识，交换部分记忆
                    const sharedCount = await this.shareKnowledge(otherAgent);
                    interactionResult = `成功共享${sharedCount}条知识`;
                    this.updateRelationship(otherAgent, 0.3);
                    break;
            }

            // 记录互动历史
            const interaction = {
                timestamp: Date.now(),
                type: interactionType,
                partnerId: otherAgent.id,
                partnerName: otherAgent.name,
                result: interactionResult
            };

            // 双方都记录这次互动
            this.interactionHistory.push(interaction);
            otherAgent.interactionHistory.push({
                ...interaction,
                partnerId: this.id,
                partnerName: this.name
            });

            // 触发视觉效果
            this.showInteractionEffect(otherAgent, interactionType);

            return interaction;

        } catch (error) {
            console.error('互动失败:', error);
            return {
                timestamp: Date.now(),
                type: interactionType,
                partnerId: otherAgent.id,
                partnerName: otherAgent.name,
                result: '互动失败'
            };
        }
    }

    // 更新关系值的方法
    updateRelationship(otherAgent, value) {
        const currentValue = this.relationships.get(otherAgent.id) || 0;
        const newValue = Math.min(currentValue + value, 1.0);
        this.relationships.set(otherAgent.id, newValue);
        otherAgent.relationships.set(this.id, newValue);
    }

    // 修改共享知识的方法，返回共享的数量
    async shareKnowledge(otherAgent) {
        const myMemories = Array.from(this.memory.entries());
        const theirMemories = Array.from(otherAgent.memory.entries());
        
        if (myMemories.length > 0 && theirMemories.length > 0) {
            const shareCount = Math.min(3, Math.min(myMemories.length, theirMemories.length));
            for (let i = 0; i < shareCount; i++) {
                const myIndex = Math.floor(Math.random() * myMemories.length);
                const theirIndex = Math.floor(Math.random() * theirMemories.length);
                
                const myShared = myMemories[myIndex];
                const theirShared = theirMemories[theirIndex];
                
                this.memory.set(theirShared[0], theirShared[1]);
                otherAgent.memory.set(myShared[0], myShared[1]);
            }
            return shareCount;
        }
        return 0;
    }

    // 协作方法
    async collaborate(otherAgent) {
        const combinedPower = this.processingPower * this.collaborationBonus + 
                            otherAgent.processingPower * otherAgent.collaborationBonus;
        return {
            efficiency: combinedPower,
            quality: (this.specialtyLevel + otherAgent.specialtyLevel) / 2
        };
    }

    // 显示互动视觉效果
    showInteractionEffect(otherAgent, interactionType) {
        // 创建连接线动画
        const line = document.createElement('div');
        line.className = `interaction-line ${interactionType.toLowerCase()}`;
        
        // 计算连接线位置和角度
        const x1 = this.position.x;
        const y1 = this.position.y;
        const x2 = otherAgent.position.x;
        const y2 = otherAgent.position.y;
        
        const length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        const angle = Math.atan2(y2-y1, x2-x1);
        
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}rad)`;
        
        document.getElementById('agents-layer').appendChild(line);
        
        // 添加图标效果
        const icon = document.createElement('div');
        icon.className = `interaction-icon ${interactionType.toLowerCase()}`;
        icon.textContent = this.getInteractionIcon(interactionType);
        icon.style.left = `${(x1 + x2) / 2}px`;
        icon.style.top = `${(y1 + y2) / 2}px`;
        
        document.getElementById('agents-layer').appendChild(icon);
        
        // 移除动画元素
        setTimeout(() => {
            line.remove();
            icon.remove();
        }, 2000);
    }

    // 获取互动图标
    getInteractionIcon(interactionType) {
        const icons = {
            [this.interactionTypes.COLLABORATE]: '🤝',
            [this.interactionTypes.TEACH]: '📚',
            [this.interactionTypes.LEARN]: '🎓',
            [this.interactionTypes.OPTIMIZE]: '⚡',
            [this.interactionTypes.SHARE]: '🔄'
        };
        return icons[interactionType];
    }
}
  