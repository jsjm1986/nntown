export class Tutorial {
    constructor(townManager) {
        this.townManager = townManager;
        this.steps = [
            {
                title: '欢迎来到神经网络小镇！',
                content: '这是一个由8个AI智能体组成的互动系统，让我们一起来了解它的运作方式。',
                target: '#town-container'
            },
            {
                title: '认识控制面板',
                content: '这里是系统的控制中心，你可以开始/暂停系统，调整运行速度和学习率。',
                target: '#control-panel'
            },
            {
                title: '认识AI居民',
                content: '点击任何一个AI角色，都可以查看它的详细信息并与它对话。让我们先认识输入神经元！',
                target: '[data-agent-id="1"]'
            },
            {
                title: '系统运行',
                content: '观察AI们是如何协同工作的：从输入神经元开始，数据在各个AI之间传递和处理。',
                target: '#agents-layer'
            },
            {
                title: '性能监控',
                content: '在控制面板底部，你可以看到系统运行的实时性能图表。',
                target: '#performance-chart'
            }
        ];
        this.currentStep = 0;
    }

    start() {
        this.createTutorialElement();
        this.showStep(0);
        document.body.classList.add('tutorial-active');
    }

    createTutorialElement() {
        this.element = document.createElement('div');
        this.element.className = 'tutorial-container';
        this.element.innerHTML = `
            <div class="tutorial-overlay"></div>
            <div class="tutorial-box">
                <h3 class="tutorial-title"></h3>
                <p class="tutorial-content"></p>
                <div class="tutorial-buttons">
                    <button class="tutorial-prev">上一步</button>
                    <div class="tutorial-dots"></div>
                    <button class="tutorial-next">下一步</button>
                </div>
            </div>
        `;

        this.element.querySelector('.tutorial-prev').addEventListener('click', () => this.prevStep());
        this.element.querySelector('.tutorial-next').addEventListener('click', () => this.nextStep());
        
        document.body.appendChild(this.element);
    }

    showStep(index) {
        const step = this.steps[index];
        const box = this.element.querySelector('.tutorial-box');
        const target = document.querySelector(step.target);
        
        // 更新内容
        box.querySelector('.tutorial-title').textContent = step.title;
        box.querySelector('.tutorial-content').textContent = step.content;
        
        // 更新按钮状态
        box.querySelector('.tutorial-prev').disabled = index === 0;
        box.querySelector('.tutorial-next').textContent = 
            index === this.steps.length - 1 ? '完成' : '下一步';

        // 更新进度点
        const dots = box.querySelector('.tutorial-dots');
        dots.innerHTML = this.steps.map((_, i) => 
            `<span class="tutorial-dot ${i === index ? 'active' : ''}"></span>`
        ).join('');

        // 高亮目标元素
        this.highlightElement(target);
    }

    highlightElement(element) {
        const overlay = this.element.querySelector('.tutorial-overlay');
        if (element) {
            const rect = element.getBoundingClientRect();
            overlay.style.setProperty('--highlight-top', `${rect.top}px`);
            overlay.style.setProperty('--highlight-left', `${rect.left}px`);
            overlay.style.setProperty('--highlight-width', `${rect.width}px`);
            overlay.style.setProperty('--highlight-height', `${rect.height}px`);
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(++this.currentStep);
        } else {
            this.complete();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(--this.currentStep);
        }
    }

    complete() {
        document.body.classList.remove('tutorial-active');
        this.element.remove();
        localStorage.setItem('tutorialCompleted', 'true');
    }
} 