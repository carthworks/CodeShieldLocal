import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import { llmEngine } from "@/lib/analysis/llm/engine"
import { ScanConfig } from "@/lib/types/models"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string, findingId: string } }
) {
    try {
        const { id: scanId, findingId } = params
        const finding = store.getFinding(findingId)

        if (!finding) {
            return NextResponse.json(
                { error: "Finding not found" },
                { status: 404 }
            )
        }

        // Get scan config
        const scan = store.getScan(scanId)
        if (!scan) {
            return NextResponse.json(
                { error: "Scan not found" },
                { status: 404 }
            )
        }

        // Run analysis on single finding
        console.log(`Starting analysis for finding ${findingId} with model ${scan.config.llmModel}`)
        await llmEngine.analyzeFindings(scanId, [finding], scan.config, () => { })
        console.log(`Analysis complete for finding ${findingId}. Result:`, finding.aiAnalysis)

        return NextResponse.json({
            finding
        })

    } catch (error) {
        console.error("Analysis error:", error)
        return NextResponse.json(
            { error: "Failed to analyze finding" },
            { status: 500 }
        )
    }
}
