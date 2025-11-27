import { NextResponse } from "next/server"
import { checkOllamaHealth } from "@/lib/llm/health"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const health = await checkOllamaHealth()

        return NextResponse.json(health)
    } catch (error) {
        console.error("Ollama health check error:", error)
        return NextResponse.json(
            {
                isRunning: false,
                models: [],
                error: error instanceof Error ? error.message : "Health check failed"
            },
            { status: 500 }
        )
    }
}
