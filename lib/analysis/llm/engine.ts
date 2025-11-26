import { Finding, ScanConfig } from "@/lib/types/models"
import { llmClient } from "@/lib/llm/client"
import { generateAnalysisPrompt, SYSTEM_PROMPT } from "@/lib/llm/prompts"
import { store } from "@/lib/store"

interface LLMAnalysisResult {
    isTruePositive: boolean
    confidence: number
    riskAnalysis: string
    fixSuggestion: string
    reasoning: string
}

export class LLMAnalysisEngine {

    async analyzeFindings(scanId: string, findings: Finding[], config: ScanConfig, onProgress: (processed: number) => void) {
        const model = config.llmModel || 'deepseek-coder'
        const concurrency = config.maxConcurrentLLM || 1

        // Check if Ollama is available
        const isAvailable = await llmClient.isAvailable()
        if (!isAvailable) {
            console.warn("Ollama is not available. Skipping LLM analysis.")
            return
        }

        // Process in chunks
        let processed = 0
        for (let i = 0; i < findings.length; i += concurrency) {
            const batch = findings.slice(i, i + concurrency)

            await Promise.all(batch.map(async (finding) => {
                try {
                    // Skip if already analyzed or low severity (optional optimization)
                    if (finding.type === 'llm') return

                    const prompt = generateAnalysisPrompt(finding, finding.code)

                    // Call LLM
                    const response = await llmClient.generate(model, SYSTEM_PROMPT + prompt, 'json')

                    // Parse JSON
                    const result = this.parseResponse(response)

                    if (result) {
                        // Update finding
                        finding.risk = result.riskAnalysis
                        finding.fix = result.fixSuggestion
                        finding.confidence = result.confidence

                        // If LLM says it's a False Positive with high confidence, mark it
                        if (!result.isTruePositive && result.confidence > 0.8) {
                            finding.status = 'false_positive'
                        }

                        // Mark as LLM verified
                        finding.type = 'llm'
                    }
                } catch (error) {
                    console.error(`LLM analysis failed for finding ${finding.id}:`, error)
                } finally {
                    processed++
                    onProgress(processed)
                }
            }))
        }
    }

    private parseResponse(response: string): LLMAnalysisResult | null {
        try {
            // Clean up markdown code blocks if present (Ollama sometimes adds them even with json mode)
            const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim()
            return JSON.parse(cleaned)
        } catch (error) {
            console.error("Failed to parse LLM response:", response)
            return null
        }
    }
}

export const llmEngine = new LLMAnalysisEngine()
