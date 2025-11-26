"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, File, X, Folder, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn, formatBytes } from "@/lib/utils"

interface FileUploaderProps {
    onUpload: (file: File) => Promise<void>
    isUploading: boolean
    progress: number
}

export function FileUploader({ onUpload, isUploading, progress }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            // Validate file type (zip)
            if (file.type === "application/zip" || file.type === "application/x-zip-compressed" || file.name.endsWith(".zip")) {
                setSelectedFile(file)
            } else {
                alert("Please upload a ZIP file")
            }
        }
    }, [])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }, [])

    const handleUpload = async () => {
        if (selectedFile) {
            await onUpload(selectedFile)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out text-center",
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50",
                    selectedFile ? "border-green-500 bg-green-50" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".zip"
                    onChange={handleChange}
                />

                {!selectedFile ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Drag & drop your codebase
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Supports .zip files up to 100MB
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => inputRef.current?.click()}
                            >
                                Select ZIP File
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-green-100 rounded-full text-green-600">
                            <File className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedFile.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {formatBytes(selectedFile.size)}
                            </p>
                        </div>

                        {isUploading ? (
                            <div className="w-full max-w-xs space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-gray-500">Uploading... {progress}%</p>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                                    Start Scan
                                </Button>
                                <Button variant="ghost" size="icon" onClick={removeFile} className="text-gray-500 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>Your code stays local. No data is uploaded to the cloud.</span>
                </p>
            </div>
        </div>
    )
}
