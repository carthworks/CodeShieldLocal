"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Project } from "@/lib/types/models"
import { ScanDashboard } from "@/components/dashboard/ScanDashboard"
import { Loader2 } from "lucide-react"

export default function ScanPage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/project/${params.id}`)

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Project not found. It may have been deleted or the server was restarted.")
                    } else {
                        setError("Failed to load project")
                    }
                    setLoading(false)
                    return
                }

                const data = await response.json()
                setProject(data)
                setLoading(false)
            } catch (err) {
                console.error("Failed to fetch project:", err)
                setError("Failed to load project")
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProject()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        {error || "The project you're looking for doesn't exist."}
                    </p>
                    <button
                        onClick={() => router.push('/scan/upload')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Upload New Project
                    </button>
                </div>
            </div>
        )
    }

    return <ScanDashboard project={project} />
}
