"use client"

import { useState, useEffect } from "react"
import { Project, Scan, ScanStatus, Finding } from "@/lib/types/models"
import { Shield, FileCode, AlertTriangle, CheckCircle, Play, Loader2, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatBytes } from "@/lib/utils"

interface ScanDashboardProps {
    project: Project
}

export function ScanDashboard({ project }: ScanDashboardProps) {
    const [scan, setScan] = useState<Scan | null>(null)
    const [status, setStatus] = useState<ScanStatus>('pending')
    const [progress, setProgress] = useState(0)
    const [findings, setFindings] = useState<Finding[]>([])
    const [isStarting, setIsStarting] = useState(false)
    const [enableLLM, setEnableLLM] = useState(false)

    const startScan = async () => {
        setIsStarting(true)
        try {
            const res = await fetch('/api/scan/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project.id,
                    config: {
                        enableStatic: true,
                        enableLLM: enableLLM,
                        llmModel: 'deepseek-coder'
                    }
                })
            })

            if (!res.ok) throw new Error("Failed to start scan")

            const data = await res.json()
            setStatus('scanning')
            pollStatus(data.scanId)
        } catch (error) {
            console.error(error)
            alert("Failed to start scan")
            setIsStarting(false)
        }
    }

    const pollStatus = async (scanId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/scan/${scanId}/status`)
                const data = await res.json()

                setScan(data)
                setStatus(data.status)
                setProgress(data.progress.percentage)

                if (data.status === 'completed' || data.status === 'failed') {
                    clearInterval(interval)
                    setIsStarting(false)
                    if (data.status === 'completed') {
                        fetchFindings(scanId)
                    }
                }
            } catch (error) {
                console.error("Polling error:", error)
            }
        }, 1000)
    }

    const fetchFindings = async (scanId: string) => {
        const res = await fetch(`/api/scan/${scanId}/findings`)
        const data = await res.json()
        setFindings(data.findings)
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <span className="font-bold text-gray-900">CodeShield Local</span>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="font-medium text-gray-600">{project.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="ai-mode"
                                checked={enableLLM}
                                onCheckedChange={setEnableLLM}
                                disabled={isStarting || status === 'scanning'}
                            />
                            <Label htmlFor="ai-mode" className="flex items-center gap-1 cursor-pointer">
                                <Brain className="w-4 h-4 text-purple-600" />
                                <span>AI Analysis</span>
                            </Label>
                        </div>

                        <Button variant="outline">Export Report</Button>
                        <Button onClick={startScan} disabled={isStarting || status === 'scanning'}>
                            {isStarting || status === 'scanning' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Scan
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Files</CardTitle>
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{project.fileCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatBytes(project.size)} total size
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Languages</CardTitle>
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{project.languages.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {project.languages.slice(0, 3).join(", ")}
                                {project.languages.length > 3 && ` +${project.languages.length - 3}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {scan?.stats ? (
                                    scan.stats.critical + scan.stats.high + scan.stats.medium + scan.stats.low
                                ) : 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {scan?.status === 'completed' ? 'Scan completed' : 'Ready to scan'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {scan?.stats ? `${scan.stats.riskScore}/10` : '-'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {scan?.stats?.riskScore ? (scan.stats.riskScore > 7 ? 'High Risk' : 'Low Risk') : 'Not assessed'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                {status === 'scanning' && (
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Scanning... {scan?.progress?.message}</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </CardContent>
                    </Card>
                )}

                {/* Findings Table */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="min-h-[500px]">
                        <CardHeader>
                            <CardTitle>Vulnerability Findings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {findings.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Vulnerability</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>AI Analysis</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {findings.map((finding) => (
                                            <TableRow key={finding.id}>
                                                <TableCell>
                                                    <Badge className={getSeverityColor(finding.severity)}>
                                                        {finding.severity.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{finding.vulnerability}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{finding.file}</div>
                                                    <div className="text-xs text-gray-500">Line {finding.lineStart}</div>
                                                </TableCell>
                                                <TableCell className="max-w-md truncate" title={finding.description}>
                                                    {finding.description}
                                                </TableCell>
                                                <TableCell>
                                                    {finding.type === 'llm' ? (
                                                        <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                                            <Brain className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                                    {status === 'completed' ? (
                                        <>
                                            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                                            <p className="text-lg font-medium">No vulnerabilities found!</p>
                                            <p className="text-sm">Your code looks clean.</p>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-12 h-12 text-gray-300 mb-4" />
                                            <p>Start a scan to detect vulnerabilities.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
