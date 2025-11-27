import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const project = store.getProject(params.id)

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("Get project error:", error)
        return NextResponse.json(
            { error: "Failed to get project" },
            { status: 500 }
        )
    }
}
