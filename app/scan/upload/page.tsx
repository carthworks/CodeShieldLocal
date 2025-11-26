"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUploader } from "@/components/upload/FileUploader"
import { Shield } from "lucide-react"

export default function UploadPage() {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleUpload = async (file: File) => {
        setIsUploading(true)
        setProgress(0)

        try {
            const formData = new FormData()
            formData.append("file", file)

            // Simulate upload progress
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return prev + 10
                })
            }, 500)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            clearInterval(interval)
            setProgress(100)

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()

            // Redirect to scan dashboard
            router.push(`/scan/${data.projectId}`)
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload project")
            setIsUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b px-6 py-4">
                <div className="container mx-auto flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-gray-900">CodeShield Local</span>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Import Your Project
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Upload a ZIP file of your source code to start scanning.
                        We'll analyze it locally for security vulnerabilities.
                    </p>
                </div>

                <FileUploader
                    onUpload={handleUpload}
                    isUploading={isUploading}
                    progress={progress}
                />
            </main>
        </div>
    )
}
