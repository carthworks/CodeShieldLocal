import { Ollama } from 'ollama'

// Default to localhost:11434
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })

export class OllamaClient {

    async isAvailable(): Promise<boolean> {
        try {
            await ollama.list()
            return true
        } catch (error) {
            console.error("Ollama is not available:", error)
            return false
        }
    }

    async generate(model: string, prompt: string, format?: string): Promise<string> {
        try {
            const response = await ollama.generate({
                model,
                prompt,
                format: format as any, // 'json' is supported
                stream: false
            })
            return response.response
        } catch (error) {
            console.error("LLM generation failed:", error)
            throw error
        }
    }

    async listModels(): Promise<string[]> {
        try {
            const list = await ollama.list()
            return list.models.map(m => m.name)
        } catch (error) {
            return []
        }
    }
}

export const llmClient = new OllamaClient()
