import { Agent, agentData } from './agents.js';
import { BackgroundEffect } from './background.js';
import { DeepseekService } from './services/deepseekService.js';
import { ControlPanel } from './ui/ControlPanel.js';
import { DataLogger } from './ui/DataLogger.js';
import { InfoPanel } from './ui/InfoPanel.js';
import { Tutorial } from './ui/Tutorial.js';
import { DataFlow } from './visualization/DataFlow.js';

class TownManager {
    constructor() {
        this.agents = [];
        this.container = document.getElementById('town-container');
        this.agentsLayer = document.getElementById('agents-layer');
        this.deepseekService = new DeepseekService();
    }

    async init() {
        // 添加登录逻辑
        const loginBtn = document.getElementById('login-btn');
        const apiKeyInput = document.getElementById('api-key-input');
        const loginMessage = document.getElementById('login-message');
        const loginScreen = document.getElementById('login-screen');
        const gameContainer = document.getElementById('game-container');

        loginBtn.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();
            if (!apiKey) {
                loginMessage.textContent = '请输入 API Key';
                return;
            }

            loginBtn.disabled = true;
            loginMessage.textContent = '正在验证...';

            const result = await this.deepseekService.validateApiKey(apiKey);
            if (result.success) {
                console.log('API Key 验证成功');
                this.deepseekService.setApiKey(apiKey);
                localStorage.setItem('deepseek_api_key', apiKey);
                loginScreen.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                this.startGame();
            } else {
                loginMessage.textContent = result.error;
                loginBtn.disabled = false;
            }
        });

        // 检查是否有保存的API Key
        const savedApiKey = localStorage.getItem('deepseek_api_key');
        if (savedApiKey) {
            apiKeyInput.value = savedApiKey;
            loginBtn.click();
        }
    }

    startGame() {
        this.background = new BackgroundEffect();
        this.dataFlow = new DataFlow(this);
        this.infoPanel = new InfoPanel();
        this.dataLogger = new DataLogger();
        
        // 设置 InfoPanel 和 DataLogger 的关联
        this.infoPanel.setDataLogger(this.dataLogger);
        
        document.getElementById('ui-layer').appendChild(this.infoPanel.element);
        
        this.createAgents();
        this.positionAgents();
        this.addEventListeners();
        this.startSimulation();
        this.controlPanel = new ControlPanel(this);
        window.townManager = this;
        
        if (!localStorage.getItem('tutorialCompleted')) {
            setTimeout(() => {
                const tutorial = new Tutorial(this);
                tutorial.start();
            }, 1000);
        }

        // 确保所有 Agent 使用同一个 DeepseekService 实例
        this.agents.forEach(agent => {
            agent.deepseek = this.deepseekService;
        });
    }

    createAgents() {
        this.agents = agentData.map(data => new Agent(data));
        this.agents.forEach(agent => {
            const element = agent.createElement();
            agent.addInteractivity(); // 添加交互功能
            this.agentsLayer.appendChild(element);
        });
    }

    positionAgents() {
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // 定义每个Agent的固定位置（按照顺时针排列）
        const positions = [
            { name: '输入神经元', angle: -Math.PI/2 },    // 顶部
            { name: '处理单元', angle: -Math.PI/4 },      // 右上
            { name: '记忆中枢', angle: 0 },               // 右侧
            { name: '决策核心', angle: Math.PI/4 },       // 右下
            { name: '输出控制器', angle: Math.PI/2 },     // 底部
            { name: '学习优化器', angle: 3*Math.PI/4 },   // 左下
            { name: '权重调节器', angle: Math.PI },       // 左侧
            { name: '激活函数', angle: -3*Math.PI/4 }     // 左上
        ];

        // 为每个Agent分配位置
        positions.forEach(pos => {
            const agent = this.agents.find(a => a.name === pos.name);
            if (agent) {
                const x = centerX + radius * Math.cos(pos.angle);
                const y = centerY + radius * Math.sin(pos.angle);
                agent.updatePosition(x, y);
            }
        });

        // 更新连接线（如果有的话）
        if (this.connectionManager) {
            this.connectionManager.updateAllConnections();
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.positionAgents();
        });
        
        document.addEventListener('agent-clicked', (event) => {
            const agent = event.detail.agent;
            this.infoPanel.show(agent);
        });
    }

    startSimulation() {
        if (this.simulationTimer) clearInterval(this.simulationTimer);
        this.simulationTimer = setInterval(() => {
            this.simulateNetworkActivity();
            this.controlPanel.updateProcessCount();
        }, this.simulationInterval || 3000);
    }

    pauseSimulation() {
        if (this.simulationTimer) {
            clearInterval(this.simulationTimer);
            this.simulationTimer = null;
        }
    }

    resetSimulation() {
        this.pauseSimulation();
        this.agents.forEach(agent => {
            agent.energy = 100;
            agent.memory.clear();
            agent.setState(AgentState.IDLE);
        });
    }

    async simulateNetworkActivity() {
        try {
            // 生成随机输入数据
            const inputData = Math.random() * 2 - 1;
            
            // 1. 输入神经元处理
            const inputNeuron = this.agents.find(agent => agent.name === '输入神经元');
            const inputResult = await inputNeuron.processInput(inputData);
            this.dataLogger.logProcess(inputNeuron, inputData, inputResult);
            
            // 2. 处理单元处理
            const processor = this.agents.find(agent => agent.name === '处理单元');
            this.dataFlow.createParticle(inputNeuron, processor, inputResult.value);
            const processedData = await processor.processInput(inputResult.value);
            this.dataLogger.logProcess(processor, inputResult.value, processedData);
            
            // 添加互动记录：输入神经元与处理单元协作
            await inputNeuron.interactWith(processor, inputNeuron.interactionTypes.COLLABORATE);
            
            // 3. 记忆中枢处理
            const memory = this.agents.find(agent => agent.name === '记忆中枢');
            this.dataFlow.createParticle(processor, memory, processedData.value);
            const memoryResult = await memory.processInput(processedData);
            this.dataLogger.logProcess(memory, processedData, memoryResult);
            
            // 添加互动记录：处理单元与记忆中枢共享数据
            await processor.interactWith(memory, processor.interactionTypes.SHARE);
            
            // 4. 决策核心处理
            const decision = this.agents.find(agent => agent.name === '决策核心');
            this.dataFlow.createParticle(memory, decision, processedData.value);
            const decisionResult = await decision.processInput(processedData);
            this.dataLogger.logProcess(decision, processedData, decisionResult);
            
            // 添加互动记录：记忆中枢为决策核心提供信息
            await memory.interactWith(decision, memory.interactionTypes.TEACH);
            
            // 5. 学习优化器处理（如果决策通过）
            if (decisionResult.decision === 'accept') {
                const optimizer = this.agents.find(agent => agent.name === '学习优化器');
                this.dataFlow.createParticle(decision, optimizer, processedData.value);
                const optimized = await optimizer.processInput(processedData.value);
                this.dataLogger.logProcess(optimizer, processedData.value, optimized);
                
                // 添加互动记录：决策核心与学习优化器协作
                await decision.interactWith(optimizer, decision.interactionTypes.COLLABORATE);
                
                // 6. 权重调节器处理
                const weightAdjuster = this.agents.find(agent => agent.name === '权重调节器');
                this.dataFlow.createParticle(optimizer, weightAdjuster, optimized.value);
                const weightResult = await weightAdjuster.processInput(optimized.value);
                this.dataLogger.logProcess(weightAdjuster, optimized.value, weightResult);
                
                // 添加互动记录：学习优化器指导权重调节器
                await optimizer.interactWith(weightAdjuster, optimizer.interactionTypes.TEACH);
            }
            
            // 7. 激活函数处理
            const activation = this.agents.find(agent => agent.name === '激活函数');
            this.dataFlow.createParticle(decision, activation, processedData.value);
            const activationResult = await activation.processInput(processedData.value);
            this.dataLogger.logProcess(activation, processedData.value, activationResult);
            
            // 添加互动记录：决策核心与激活函数优化
            await decision.interactWith(activation, decision.interactionTypes.OPTIMIZE);
            
            // 8. 输出控制器处理
            const output = this.agents.find(agent => agent.name === '输出控制器');
            this.dataFlow.createParticle(activation, output, activationResult.value);
            const outputResult = await output.processInput(activationResult.value);
            this.dataLogger.logProcess(output, activationResult.value, outputResult);
            
            // 添加互动记录：激活函数与输出控制器协作
            await activation.interactWith(output, activation.interactionTypes.COLLABORATE);

            // 更新处理计数
            this.controlPanel?.updateProcessCount();
            
            // 更新当前显示的Agent信息面板
            if (this.infoPanel.visible && this.infoPanel.currentAgent) {
                this.infoPanel.show(this.infoPanel.currentAgent);
            }
            
        } catch (error) {
            console.error('处理过程出错:', error);
            this.showNotification('处理过程发生错误', 'error');
        }
    }

    updateSimulationSpeed(speed) {
        this.simulationInterval = 3000 / speed;
        if (this.simulationTimer) {
            clearInterval(this.simulationTimer);
            this.startSimulation();
        }
    }

    updateLearningRate(rate) {
        this.agents.forEach(agent => {
            agent.learningRate = rate;
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `system-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// 初始化
window.addEventListener('load', () => {
    const town = new TownManager();
    town.init();
}); 