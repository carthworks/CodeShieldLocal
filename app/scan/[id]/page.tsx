import { notFound } from "next/navigation"
import { store } from "@/lib/store"
import { ScanDashboard } from "@/components/dashboard/ScanDashboard"

interface PageProps {
    params: {
        id: string
    }
}

// Since we are using in-memory store, we can't pre-render paths
export const dynamic = 'force-dynamic'

export default function ScanPage({ params }: PageProps) {
    const project = store.getProject(params.id)

    if (!project) {
        return notFound()
    }

    return <ScanDashboard project={project} />
}
