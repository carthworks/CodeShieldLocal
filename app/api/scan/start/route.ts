import { NextRequest, NextResponse } from "next/server"
import { scanService } from "@/lib/services/scan-service"
import { ScanConfig } from "@/lib/types/models"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { projectId, config } = body

        if (!projectId) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            )
        }

        const scanConfig: ScanConfig = config || {
            enableStatic: true,
            enableLLM: false, // Default to false for MVP
            llmModel: 'deepseek-coder',
            maxConcurrentLLM: 2,
            excludePaths: [],
        }

        const scan = await scanService.startScan(projectId, scanConfig)

        return NextResponse.json({
            scanId: scan.id,
            status: scan.status
        })

    } catch (error) {
        console.error("Start scan error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to start scan"
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
