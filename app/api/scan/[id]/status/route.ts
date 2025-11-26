import { NextRequest, NextResponse } from "next/server"
import { scanService } from "@/lib/services/scan-service"
import { store } from "@/lib/store"

interface RouteParams {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const scan = scanService.getScan(params.id)

    if (!scan) {
        return NextResponse.json(
            { error: "Scan not found" },
            { status: 404 }
        )
    }

    // Get findings count
    const findings = store.getFindings(params.id)

    return NextResponse.json({
        id: scan.id,
        status: scan.status,
        progress: scan.progress,
        stats: scan.stats,
        findingsCount: findings.length,
        // We don't return all findings here to keep payload small during polling
        // Findings will be fetched separately
    })
}
