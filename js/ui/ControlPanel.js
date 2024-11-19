export class ControlPanel {
    constructor(townManager) {
        this.townManager = townManager;
        this.processCount = 0;
        this.isRunning = true;
        this.simulationSpeed = 5;
        this.learningRate = 0.5;
        this.initElements();
        this.addEventListeners();
        this.initChart();
    }

    initElements() {
        this.panel = document.getElementById('control-panel');
        this.panel.classList.add('expanded');
        this.toggleBtn = this.panel.querySelector('.toggle-btn');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.speedControl = document.getElementById('speed-control');
        this.learningRateControl = document.getElementById('learning-rate');
        this.systemStatus = document.getElementById('system-status');
        this.processCountDisplay = document.getElementById('process-count');

        this.floatingBtn = document.createElement('button');
        this.floatingBtn.className = 'floating-control-btn';
        this.floatingBtn.textContent = '显示控制面板';
        this.floatingBtn.style.display = 'none';
        document.getElementById('ui-layer').appendChild(this.floatingBtn);
    }

    addEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.floatingBtn.addEventListener('click', () => this.togglePanel());

        this.startBtn.addEventListener('click', () => this.startSimulation());
        this.pauseBtn.addEventListener('click', () => this.pauseSimulation());
        this.resetBtn.addEventListener('click', () => this.resetSimulation());

        this.speedControl.addEventListener('input', (e) => {
            this.simulationSpeed = parseInt(e.target.value);
            this.townManager.updateSimulationSpeed(this.simulationSpeed);
        });

        this.learningRateControl.addEventListener('input', (e) => {
            this.learningRate = e.target.value / 100;
            this.townManager.updateLearningRate(this.learningRate);
        });
    }

    togglePanel() {
        const isHidden = this.panel.classList.toggle('collapsed');
        this.floatingBtn.style.display = isHidden ? 'block' : 'none';
        
        this.toggleBtn.textContent = isHidden ? '显示' : '≡';
    }

    startSimulation() {
        this.isRunning = true;
        this.systemStatus.textContent = '运行中';
        this.townManager.startSimulation();
    }

    pauseSimulation() {
        this.isRunning = false;
        this.systemStatus.textContent = '已暂停';
        this.townManager.pauseSimulation();
    }

    resetSimulation() {
        this.processCount = 0;
        this.processCountDisplay.textContent = '0';
        this.townManager.resetSimulation();
    }

    updateProcessCount() {
        this.processCount++;
        this.processCountDisplay.textContent = this.processCount;
        this.updateChart();
    }

    initChart() {
        const canvas = document.getElementById('performance-chart');
        this.ctx = canvas.getContext('2d');
        this.chartData = {
            values: [],
            maxItems: 20
        };

        this.resizeChart();
        window.addEventListener('resize', () => this.resizeChart());
    }

    resizeChart() {
        const canvas = this.ctx.canvas;
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    updateChart() {
        const ctx = this.ctx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 20;

        this.chartData.values.push(Math.random() * 100);
        if (this.chartData.values.length > this.chartData.maxItems) {
            this.chartData.values.shift();
        }

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * (i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(64, 224, 208, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = this.chartData.values;
        const step = (width - 2 * padding) / (this.chartData.maxItems - 1);

        points.forEach((value, index) => {
            const x = padding + index * step;
            const y = height - padding - ((height - 2 * padding) * value / 100);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 5; i++) {
            const value = (i * 20).toString();
            const y = padding + (height - 2 * padding) * (1 - i / 5);
            ctx.fillText(value, padding - 5, y + 4);
        }
    }
} 