export class Connection {
    constructor(agent1, agent2) {
        this.agent1 = agent1;
        this.agent2 = agent2;
        this.element = null;
        this.active = false;
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'connection';
        this.element = element;
        return element;
    }

    updatePosition() {
        if (!this.element) return;

        const x1 = this.agent1.position.x;
        const y1 = this.agent1.position.y;
        const x2 = this.agent2.position.x;
        const y2 = this.agent2.position.y;

        const length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        const angle = Math.atan2(y2-y1, x2-x1);

        this.element.style.width = `${length}px`;
        this.element.style.left = `${x1}px`;
        this.element.style.top = `${y1}px`;
        this.element.style.transform = `rotate(${angle}rad)`;
    }

    activate() {
        this.active = true;
        this.element.classList.add('active');
    }

    deactivate() {
        this.active = false;
        this.element.classList.remove('active');
    }
}

export class ConnectionManager {
    constructor() {
        this.connections = [];
        this.layer = document.getElementById('connections-layer');
    }

    createConnections(agents) {
        this.layer.innerHTML = '';
        this.connections = [];

        agents.forEach((agent1, i) => {
            agents.forEach((agent2, j) => {
                if (i < j) {
                    const connection = new Connection(agent1, agent2);
                    this.layer.appendChild(connection.createElement());
                    connection.updatePosition();
                    this.connections.push(connection);
                }
            });
        });
    }

    updateAllConnections() {
        this.connections.forEach(connection => connection.updatePosition());
    }

    simulateSignal(fromAgent, toAgent) {
        const connection = this.connections.find(c => 
            (c.agent1 === fromAgent && c.agent2 === toAgent) ||
            (c.agent1 === toAgent && c.agent2 === fromAgent)
        );
        
        if (connection) {
            connection.activate();
            setTimeout(() => connection.deactivate(), 1000);
        }
    }
} 