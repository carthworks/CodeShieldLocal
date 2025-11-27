"use client"

import { useState, useEffect } from "react"
import { Finding } from "@/lib/types/models"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, Check, AlertTriangle, Lightbulb } from "lucide-react"

interface CodeViewerProps {
    finding: Finding | null
    projectId: string
    isOpen: boolean
    onClose: () => void
}

export function CodeViewer({ finding, projectId, isOpen, onClose }: CodeViewerProps) {
    const [fileContent, setFileContent] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (finding && isOpen) {
            fetchFileContent()
        }
    }, [finding, isOpen])

    const fetchFileContent = async () => {
        if (!finding) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/project/${projectId}/file?file=${encodeURIComponent(finding.file)}`)
            const data = await res.json()
            setFileContent(data.content)
        } catch (error) {
            console.error("Failed to fetch file:", error)
            setFileContent("// Failed to load file content")
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (finding?.fix) {
            navigator.clipboard.writeText(finding.fix)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500 hover:bg-red-600'
            case 'high': return 'bg-orange-500 hover:bg-orange-600'
            case 'medium': return 'bg-yellow-500 hover:bg-yellow-600'
            case 'low': return 'bg-blue-500 hover:bg-blue-600'
            default: return 'bg-gray-500'
        }
    }

    const getLanguage = (filename: string): string => {
        const ext = filename.split('.').pop()?.toLowerCase()
        const langMap: Record<string, string> = {
            'js': 'javascript',
            'jsx': 'jsx',
            'ts': 'typescript',
            'tsx': 'tsx',
            'py': 'python',
            'java': 'java',
            'go': 'go',
            'rs': 'rust',
            'c': 'c',
            'cpp': 'cpp',
            'rb': 'ruby',
            'php': 'php',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'md': 'markdown',
            'sql': 'sql',
            'sh': 'bash',
            'yaml': 'yaml',
            'yml': 'yaml'
        }
        return langMap[ext || ''] || 'javascript'
    }

    if (!finding) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity.toUpperCase()}
                        </Badge>
                        <span>{finding.vulnerability}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {finding.file} • Line {finding.lineStart}
                        {finding.cweId && ` • ${finding.cweId}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto space-y-4">
                    {/* Vulnerability Details */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-orange-900 mb-1">Risk Analysis</h3>
                                <p className="text-sm text-orange-800">{finding.risk}</p>
                            </div>
                        </div>
                    </div>

                    {/* Code Display */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-sm text-gray-300 font-mono">{finding.file}</span>
                            <span className="text-xs text-gray-400">
                                Lines {finding.lineStart}-{finding.lineEnd}
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center h-64 bg-gray-900">
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                        ) : (
                            <div className="relative">
                                <SyntaxHighlighter
                                    language={getLanguage(finding.file)}
                                    style={vscDarkPlus}
                                    showLineNumbers
                                    startingLineNumber={1}
                                    wrapLines
                                    lineProps={(lineNumber) => {
                                        const isHighlighted = lineNumber >= finding.lineStart && lineNumber <= finding.lineEnd
                                        return {
                                            style: {
                                                backgroundColor: isHighlighted ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                                                borderLeft: isHighlighted ? '3px solid #ef4444' : 'none',
                                                display: 'block',
                                                paddingLeft: isHighlighted ? '0.5rem' : '0.75rem'
                                            }
                                        }
                                    }}
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: 0,
                                        fontSize: '0.875rem',
                                        maxHeight: '400px'
                                    }}
                                >
                                    {fileContent}
                                </SyntaxHighlighter>
                            </div>
                        )}
                    </div>

                    {/* Fix Suggestion */}
                    {finding.fix && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                    <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-green-900 mb-2">Suggested Fix</h3>
                                        <pre className="text-sm text-green-800 bg-white rounded p-3 overflow-x-auto border border-green-100">
                                            <code>{finding.fix}</code>
                                        </pre>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={copyToClipboard}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Additional Info */}
                    {finding.references && finding.references.length > 0 && (
                        <div className="text-sm text-gray-600">
                            <h3 className="font-semibold mb-2">References</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {finding.references.map((ref, idx) => (
                                    <li key={idx}>
                                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {ref}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
