export class DeepseekService {
    constructor() {
        this.apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
        this.apiKey = null;
        this.retryCount = 3;
        this.retryDelay = 1000;
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async validateApiKey(key) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "user",
                            content: "测试消息"
                        }
                    ]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                return { success: true };
            } else {
                const error = await response.json();
                return { 
                    success: false, 
                    error: error.error?.message || '验证失败，请检查API Key是否正确'
                };
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: '连接超时，请检查网络连接或API地址是否正确'
                };
            }
            return { 
                success: false, 
                error: '网络错误，请检查API地址是否正确或网络连接是否正常'
            };
        }
    }

    async generateResponse(prompt, context = '') {
        try {
            if (!this.apiKey || this.apiKey === 'your-api-key-here') {
                return this.generateMockResponse(prompt, context);
            }

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: context
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.warn('API调用失败，使用模拟响应:', error);
            return this.generateMockResponse(prompt, context);
        }
    }

    generateMockResponse(prompt, context) {
        const responses = [
            "我明白你的意思。让我从我的专业角度来看这个问题。",
            "这是个很有趣的观点！作为一个AI，我有一些独特的见解。",
            "根据我的经验和设定，我认为这个问题可以这样处理...",
            "让我分析一下这个情况，从我的职责出发...",
            "这确实值得深入探讨，我可以从我的专业领域提供一些见解。"
        ];

        const baseResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const roleSpecificContent = context.includes('输入神经元') ? 
            "作为输入神经元，我特别关注数据的接收和初步处理。" :
            context.includes('处理单元') ?
            "从数据处理的角度来看，这需要仔细的分析和转换。" :
            "让我根据我的专业知识来回答这个问题。";

        return `${baseResponse} ${roleSpecificContent} 关于"${prompt}"，我的想法是...`;
    }
} 