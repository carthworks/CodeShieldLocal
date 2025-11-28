import { NextRequest, NextResponse } from "next/server"
import { reportService } from "@/lib/services/report-service"
import { store } from "@/lib/store"
import { ReportFormat } from "@/lib/types/models"

interface RouteParams {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { searchParams } = new URL(request.url)
        const format = (searchParams.get('format') || 'markdown') as ReportFormat

        const scan = store.getScan(params.id)
        if (!scan) {
            return NextResponse.json(
                { error: "Scan not found" },
                { status: 404 }
            )
        }

        const project = store.getProject(scan.projectId)
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        const report = await reportService.generateReport(
            params.id,
            format,
            project.name
        )

        // Set appropriate headers for download
        const headers = new Headers()

        if (format === 'markdown') {
            headers.set('Content-Type', 'text/markdown')
            headers.set('Content-Disposition', `attachment; filename="${project.name}-security-report.md"`)
            return new NextResponse(report.content as string, { headers })
        } else if (format === 'json') {
            headers.set('Content-Type', 'application/json')
            headers.set('Content-Disposition', `attachment; filename="${project.name}-security-report.json"`)
            return new NextResponse(report.content as string, { headers })
        } else if (format === 'html') {
            headers.set('Content-Type', 'text/html')
            headers.set('Content-Disposition', `attachment; filename="${project.name}-security-report.html"`)
            return new NextResponse(report.content as string, { headers })
        }

        return NextResponse.json(report)

    } catch (error) {
        console.error("Report generation error:", error)
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        )
    }
}
