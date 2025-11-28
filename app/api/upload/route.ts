import { NextRequest, NextResponse } from "next/server"
import { projectService } from "@/lib/services/project-service"

// Route segment config for handling file uploads
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        if (!file.name.endsWith(".zip")) {
            return NextResponse.json(
                { error: "Only ZIP files are supported" },
                { status: 400 }
            )
        }

        const project = await projectService.createProjectFromZip(file)

        return NextResponse.json({
            projectId: project.id,
            name: project.name,
            fileCount: project.fileCount,
            languages: project.languages
        })

    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: `Failed to process upload: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        )
    }
}
