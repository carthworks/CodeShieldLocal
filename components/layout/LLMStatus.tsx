"use client"

import { useState, useEffect } from "react"
import { Server, Cpu, AlertCircle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface OllamaHealth {
    isRunning: boolean
    version?: string
    models: string[]
    error?: string
}

export function LLMStatus() {
    const [health, setHealth] = useState<OllamaHealth | null>(null)
    const [loading, setLoading] = useState(true)

    const checkHealth = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/ollama/health')
            const data = await res.json()
            setHealth(data)
        } catch (error) {
            console.error("Failed to check LLM health", error)
            setHealth({ isRunning: false, models: [], error: "Connection failed" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkHealth()
        const interval = setInterval(checkHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    if (!health) return null

    const activeModel = health.models.find(m => m.includes('deepseek-coder')) || health.models[0] || 'None'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 border border-gray-200 bg-white hover:bg-gray-50">
                    <Server className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600 hidden sm:inline">LLM Runner:</span>
                    {health.isRunning ? (
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-green-700">Active</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            <span className="text-xs font-medium text-red-700">Inactive</span>
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>System Status</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.preventDefault(); checkHealth(); }}>
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="p-2 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Service</span>
                        <Badge variant={health.isRunning ? "outline" : "destructive"} className={health.isRunning ? "text-green-600 border-green-200 bg-green-50" : ""}>
                            {health.isRunning ? "Ollama Running" : "Stopped"}
                        </Badge>
                    </div>

                    {health.isRunning && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Version</span>
                                <span className="text-xs font-mono">{health.version}</span>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 block">Active Model</span>
                                <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded border border-blue-100">
                                    <Cpu className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-900 truncate">{activeModel}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-gray-500 block">Installed Models ({health.models.length})</span>
                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {health.models.map(model => (
                                        <div key={model} className={`text-xs px-2 py-1 rounded ${model === activeModel ? 'bg-gray-100 font-medium' : 'text-gray-600'}`}>
                                            {model}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {!health.isRunning && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                            {health.error || "Could not connect to Ollama. Please ensure it is installed and running."}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
