export class DataLogger {
    constructor() {
        this.element = this.createElement();
        this.logs = [];
        this.maxLogs = 100;
        this.isVisible = true;
        this.updateTimeout = null;
        this.updateDelay = 500;
    }

    createElement() {
        const panel = document.createElement('div');
        panel.className = 'data-logger';
        panel.innerHTML = `
            <div class="logger-header">
                <h3>数据处理日志</h3>
                <div class="logger-controls">
                    <button class="clear-btn">清除</button>
                    <button class="minimize-btn">最小化</button>
                    <button class="close-btn">×</button>
                </div>
            </div>
            <div class="logger-content">
                <div class="log-entries"></div>
            </div>
        `;

        // 添加浮动按钮（初始隐藏）
        this.floatingBtn = document.createElement('button');
        this.floatingBtn.className = 'floating-logger-btn';
        this.floatingBtn.innerHTML = '📋 显示日志';
        this.floatingBtn.style.display = 'none';
        document.getElementById('ui-layer').appendChild(this.floatingBtn);

        // 添加事件监听器
        panel.querySelector('.clear-btn').addEventListener('click', () => this.clearLogs());
        panel.querySelector('.minimize-btn').addEventListener('click', () => this.minimizePanel());
        panel.querySelector('.close-btn').addEventListener('click', () => this.hidePanel());
        this.floatingBtn.addEventListener('click', () => this.showPanel());

        document.getElementById('ui-layer').appendChild(panel);
        return panel;
    }

    minimizePanel() {
        if (!this.element.classList.contains('minimized')) {
            this.element.classList.add('minimized');
            const btn = this.element.querySelector('.minimize-btn');
            btn.textContent = '展开';
        }
    }

    maximizePanel() {
        if (this.element.classList.contains('minimized')) {
            this.element.classList.remove('minimized');
            const btn = this.element.querySelector('.minimize-btn');
            btn.textContent = '最小化';
        }
    }

    hidePanel() {
        this.isVisible = false;
        this.element.classList.add('hidden');
        this.floatingBtn.style.display = 'block';
    }

    showPanel() {
        this.isVisible = true;
        this.element.classList.remove('hidden');
        this.floatingBtn.style.display = 'none';
    }

    logProcess(agent, inputData, outputData) {
        const timestamp = new Date().toLocaleTimeString();
        const log = {
            timestamp,
            agentName: agent.name,
            input: inputData,
            output: outputData,
            type: outputData.type
        };

        this.logs.unshift(log);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        this.throttledUpdateDisplay();
    }

    throttledUpdateDisplay() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        this.updateTimeout = setTimeout(() => {
            this.updateDisplay();
            this.updateTimeout = null;
        }, this.updateDelay);
    }

    updateDisplay() {
        // 检查是否有正在进行的对话
        const chatMessages = document.querySelectorAll('.chat-message');
        const isTyping = Array.from(chatMessages).some(msg => 
            msg.classList.contains('assistant') && 
            !msg.querySelector('.message-content').textContent.trim()
        );

        // 如果正在进行对话，自动最小化日志面板
        if (isTyping && !this.element.classList.contains('minimized')) {
            this.minimizePanel();
        }

        const logEntries = this.element.querySelector('.log-entries');
        if (!logEntries) return;

        const wasAtBottom = logEntries.scrollHeight - logEntries.scrollTop === logEntries.clientHeight;
        
        logEntries.innerHTML = this.logs.map(log => this.createLogEntry(log)).join('');
        
        if (wasAtBottom) {
            logEntries.scrollTop = logEntries.scrollHeight;
        }
    }

    createLogEntry(log) {
        const thoughtProcess = this.generateThoughtProcess(log);
        const valueDisplay = this.formatActionResult(log.output, log.agentName);
        const mood = this.getMoodIndicator(log);
        
        return `
            <div class="log-entry ${log.type}">
                <div class="log-header">
                    <div class="log-time">${log.timestamp}</div>
                    <div class="log-mood">${mood}</div>
                </div>
                <div class="log-agent">
                    <span class="agent-avatar">${this.getAgentAvatar(log.agentName)}</span>
                    <span class="agent-name">${log.agentName}</span>
                </div>
                <div class="log-data">
                    <div class="thought-process">
                        <i class="thought-icon">💭</i>
                        ${thoughtProcess}
                    </div>
                    <div class="action-result">
                        <i class="result-icon">📊</i>
                        ${valueDisplay}
                    </div>
                </div>
            </div>
        `;
    }

    generateThoughtProcess(log) {
        const thoughts = {
            '输入神经元': [
                "嗯...让我感知一下这个信号的强度...",
                "这是个有趣的输入！让我仔细分析一下~",
                "收到新的信息流，开始初步处理...",
                "这个信号的模式很特别，需要重点关注！"
            ],
            '处理单元': [
                "开始数据清洗和标准化处理...",
                "这些数据需要重新排列和转换...",
                "检测到一些噪声，正在过滤...",
                "数据结构优化中，提升处理效率..."
            ],
            '记忆中枢': [
                "正在与历史数据进行对比分析...",
                "这个模式似曾相识，检索相关记忆...",
                "建立新的记忆索引，方便未来检索...",
                "对重要信息进行重点标记和存储..."
            ],
            '决策核心': [
                "权衡多个因素，计算最优方案...",
                "根据历史经验进行决策分析...",
                "评估各种可能性的风险和收益...",
                "正在进行多维度决策推理..."
            ],
            '输出控制器': [
                "调整输出信号的强度和频率...",
                "确保输出的稳定性和可控性...",
                "优化输出通道的传输效率...",
                "对输出结果进行最后的校准..."
            ],
            '学习优化器': [
                "分析性能瓶颈，寻找优化空间...",
                "应用新的学习策略，提升效果...",
                "调整学习参数，优化收敛速度...",
                "总结经验教训，改进学习方法..."
            ],
            '权重调节器': [
                "微调连接权重，平衡网络结构...",
                "强化重要连接，弱化次要路径...",
                "动态调整权重分配策略...",
                "优化网络的整体连接强度..."
            ],
            '激活函数': [
                "计算最佳的激活阈值...",
                "调整信号的非线性转换参数...",
                "优化信号的传递特性...",
                "确保激活响应的平滑性..."
            ]
        };

        const agentThoughts = thoughts[log.agentName] || ["思考中..."];
        return agentThoughts[Math.floor(Math.random() * agentThoughts.length)];
    }

    formatActionResult(output, agentName) {
        switch(output.type) {
            case 'input':
                return `接收到新的信号：
                        • 信号强度：${(output.value * 100).toFixed(1)}%
                        • 信号质量：${(output.quality * 100).toFixed(1)}%`;
            case 'processed':
                return `数据处理结果：
                        • 处理后的值：${output.value.toFixed(3)}
                        • 数据质量：${(output.quality * 100).toFixed(1)}%`;
            case 'stored':
                return `记忆存储完成：
                        • 当前记忆数量：${output.memorySize}条
                        • 存储状态：成功`;
            case 'decision':
                return `决策分析结果：
                        • 决定：${output.decision === 'accept' ? '✅ 通过' : '❌ 需要重新评估'}
                        • 置信度：${(output.confidence * 100).toFixed(1)}%
                        • 评估依据：${this.formatDecisionBasis(output.value)}`;
            case 'optimization':
                return `优化完成：
                        • 性能提升：${(output.improvement * 100).toFixed(1)}%
                        • 优化后的值：${output.value.toFixed(3)}`;
            case 'weight':
                const direction = output.adjustment > 0 ? '增强' : '减弱';
                return `权重调整完成：
                        • 调整方向：${direction}
                        • 调整幅度：${Math.abs(output.adjustment * 100).toFixed(1)}%
                        • 新权重值：${output.value.toFixed(3)}`;
            case 'activation':
                return `信号激活完成：
                        • 输出强度：${(output.value * 100).toFixed(1)}%
                        • 响应灵敏度：${(output.derivative * 100).toFixed(1)}%`;
            case 'output':
                return `输出信号生成：
                        • 信号强度：${(output.value * 100).toFixed(1)}%
                        • 信号质量：${(output.quality * 100).toFixed(1)}%
                        • 状态：✅ 稳定`;
            default:
                return '处理完成';
        }
    }

    formatDecisionBasis(value) {
        if (typeof value === 'object') {
            return '综合分析多个因素';
        }
        const confidence = Math.abs(value);
        if (confidence > 0.8) return '高度确信';
        if (confidence > 0.5) return '较为确信';
        return '需要更多信息';
    }

    getAgentAvatar(agentName) {
        const avatars = {
            '输入神经元': '🔍',
            '处理单元': '⚡',
            '记忆中枢': '📚',
            '决策核心': '🎯',
            '输出控制器': '🎚️',
            '学习优化器': '🚀',
            '权重调节器': '⚖️',
            '激活函数': '✨'
        };
        return avatars[agentName] || '🤖';
    }

    clearLogs() {
        this.logs = [];
        this.updateDisplay();
    }

    getMoodIndicator(log) {
        // 根据处理结果返回心情指示器
        if (log.output.quality > 0.8 || log.output.confidence > 0.8) return '😊';
        if (log.output.quality > 0.5 || log.output.confidence > 0.5) return '🙂';
        return '🤔';
    }
} 