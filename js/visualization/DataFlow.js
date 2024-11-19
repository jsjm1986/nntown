export class DataFlow {
    constructor(townManager) {
        this.townManager = townManager;
        this.particles = [];
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.className = 'data-flow-layer';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        document.getElementById('town-container').appendChild(canvas);
        
        // 设置画布大小
        this.resizeCanvas(canvas);
        window.addEventListener('resize', () => this.resizeCanvas(canvas));
        
        return canvas;
    }

    resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    createParticle(fromAgent, toAgent, value) {
        const startX = fromAgent.position.x;
        const startY = fromAgent.position.y;
        const endX = toAgent.position.x;
        const endY = toAgent.position.y;

        // 根据数据值设置粒子颜色
        const color = this.getValueColor(value);

        this.particles.push({
            startX,
            startY,
            endX,
            endY,
            x: startX,
            y: startY,
            progress: 0,
            speed: 0.02,
            color,
            size: Math.abs(value) * 3 + 2, // 粒子大小根据数据值变化
            value
        });
    }

    getValueColor(value) {
        // 根据数值返回不同的颜色
        if (value > 0.7) return 'rgba(64, 224, 208, 0.8)'; // 青色 - 高值
        if (value > 0.3) return 'rgba(255, 223, 0, 0.8)';  // 黄色 - 中值
        return 'rgba(255, 105, 180, 0.8)';                 // 粉色 - 低值
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制所有粒子
        this.particles = this.particles.filter(particle => {
            particle.progress += particle.speed;

            if (particle.progress >= 1) {
                return false;
            }

            // 使用贝塞尔曲线创建弧形路径
            const controlX = (particle.startX + particle.endX) / 2;
            const controlY = (particle.startY + particle.endY) / 2 - 100;

            particle.x = this.quadraticBezier(
                particle.startX,
                controlX,
                particle.endX,
                particle.progress
            );
            particle.y = this.quadraticBezier(
                particle.startY,
                controlY,
                particle.endY,
                particle.progress
            );

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // 添加发光效果
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;

            // 绘制数值标签
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                particle.value.toFixed(2),
                particle.x,
                particle.y - particle.size - 5
            );

            return true;
        });

        requestAnimationFrame(this.animate);
    }

    quadraticBezier(p0, p1, p2, t) {
        const term1 = Math.pow(1 - t, 2) * p0;
        const term2 = 2 * (1 - t) * t * p1;
        const term3 = Math.pow(t, 2) * p2;
        return term1 + term2 + term3;
    }
} 