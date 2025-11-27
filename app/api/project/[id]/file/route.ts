import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import fs from 'fs/promises'
import path from 'path'

interface RouteParams {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { searchParams } = new URL(request.url)
        const filePath = searchParams.get('file')

        if (!filePath) {
            return NextResponse.json(
                { error: "File path is required" },
                { status: 400 }
            )
        }

        const project = store.getProject(params.id)
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        // Read file content
        const fullPath = path.join(project.path, filePath)

        // Security check: ensure the file is within the project directory
        const normalizedProjectPath = path.normalize(project.path)
        const normalizedFilePath = path.normalize(fullPath)

        if (!normalizedFilePath.startsWith(normalizedProjectPath)) {
            return NextResponse.json(
                { error: "Invalid file path" },
                { status: 403 }
            )
        }

        const content = await fs.readFile(fullPath, 'utf-8')

        return NextResponse.json({
            content,
            path: filePath
        })

    } catch (error) {
        console.error("File read error:", error)
        return NextResponse.json(
            { error: "Failed to read file" },
            { status: 500 }
        )
    }
}
