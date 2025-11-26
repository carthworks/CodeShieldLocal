import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

interface RouteParams {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const findings = store.getFindings(params.id)

    return NextResponse.json({
        findings
    })
}
