export interface OllamaHealth {
    isRunning: boolean
    version?: string
    models: string[]
    error?: string
}

export async function checkOllamaHealth(): Promise<OllamaHealth> {
    try {
        const response = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // 5 second timeout
        })

        if (!response.ok) {
            return {
                isRunning: false,
                models: [],
                error: `Ollama API returned ${response.status}`
            }
        }

        const data = await response.json()
        const models = data.models?.map((m: any) => m.name) || []

        return {
            isRunning: true,
            models,
            version: data.version
        }
    } catch (error) {
        return {
            isRunning: false,
            models: [],
            error: error instanceof Error ? error.message : 'Failed to connect to Ollama'
        }
    }
}

export function getRecommendedModel(availableModels: string[]): string | null {
    const preferred = [
        'deepseek-coder:6.7b',
        'deepseek-coder',
        'codellama:7b',
        'codellama',
        'llama3:8b',
        'llama3'
    ]

    for (const model of preferred) {
        if (availableModels.some(m => m.startsWith(model))) {
            return availableModels.find(m => m.startsWith(model)) || null
        }
    }

    // Return first available model
    return availableModels[0] || null
}
