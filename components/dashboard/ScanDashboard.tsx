"use client"

import { useState, useEffect, useMemo } from "react"
import { Project, Scan, ScanStatus, Finding } from "@/lib/types/models"
import { Shield, FileCode, AlertTriangle, CheckCircle, Play, Loader2, Brain, Download, FileText, FileJson, Globe, ExternalLink, LayoutList, LayoutGrid, ChevronDown, ChevronRight, Lightbulb, ArrowUpRight } from "lucide-react"
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
import { CodeViewer } from "@/components/viewer/CodeViewer"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generatePDFReport } from "@/lib/export/pdf-generator"
import { LLMStatus } from "@/components/layout/LLMStatus"

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
    const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list')
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

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

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to start scan")
            }

            const data = await res.json()
            setStatus('scanning')
            pollStatus(data.scanId)
        } catch (error) {
            console.error(error)
            const errorMessage = error instanceof Error ? error.message : "Failed to start scan"
            alert(`Failed to start scan: ${errorMessage}`)
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
            case 'critical': return 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]'
            case 'high': return 'bg-orange-500 hover:bg-orange-600'
            case 'medium': return 'bg-yellow-500 hover:bg-yellow-600'
            case 'low': return 'bg-blue-500 hover:bg-blue-600'
            default: return 'bg-gray-500'
        }
    }

    const handleFindingClick = (finding: Finding) => {
        setSelectedFinding(finding)
        setIsViewerOpen(true)
    }

    const handleExportPDF = () => {
        if (!scan) return
        generatePDFReport(scan, findings, project.name)
    }

    const handleExportMarkdown = async () => {
        if (!scan) return
        const url = `/api/scan/${scan.id}/report?format=markdown`
        window.open(url, '_blank')
    }

    const handleExportJSON = async () => {
        if (!scan) return
        const url = `/api/scan/${scan.id}/report?format=json`
        window.open(url, '_blank')
    }

    const handleExportHTML = async () => {
        if (!scan) return
        const url = `/api/scan/${scan.id}/report?format=html`
        window.open(url, '_blank')
    }

    const handleAnalyzeFinding = async (finding: Finding) => {
        if (!scan) return

        try {
            // Optimistic update
            const updatedFindings = findings.map(f =>
                f.id === finding.id
                    ? { ...f, aiAnalysis: { analyzed: true, isTruePositive: true, reasoning: "Analyzing...", confidence: 0 } }
                    : f
            )
            setFindings(updatedFindings)

            const res = await fetch(`/api/scan/${scan.id}/findings/${finding.id}/analyze`, {
                method: 'POST'
            })

            if (!res.ok) throw new Error("Analysis failed")

            const data = await res.json()

            // Update with real result
            setFindings(prev => prev.map(f =>
                f.id === finding.id ? data.finding : f
            ))

        } catch (error) {
            console.error("Failed to analyze finding:", error)
            // Revert on error
            fetchFindings(scan.id)
        }
    }

    const groupedFindings = useMemo(() => {
        const groups: Record<string, Finding[]> = {}
        findings.forEach(f => {
            const key = f.vulnerability
            if (!groups[key]) groups[key] = []
            groups[key].push(f)
        })
        return Object.entries(groups).map(([name, items]) => ({
            name,
            items,
            severity: items.reduce((max, curr) => {
                const order = { critical: 4, high: 3, medium: 2, low: 1, info: 0 }
                // @ts-ignore
                return order[curr.severity] > order[max] ? curr.severity : max
            }, 'info' as string),
            count: items.length
        })).sort((a, b) => {
            const order = { critical: 4, high: 3, medium: 2, low: 1, info: 0 }
            // @ts-ignore
            return order[b.severity] - order[a.severity]
        })
    }, [findings])

    const toggleGroup = (name: string) => {
        setExpandedGroups(prev => ({ ...prev, [name]: !prev[name] }))
    }

    const securityInsights = useMemo(() => {
        if (findings.length === 0) return null

        const topVulnerability = groupedFindings[0]
        const fileCounts: Record<string, number> = {}
        findings.forEach(f => {
            fileCounts[f.file] = (fileCounts[f.file] || 0) + 1
        })
        const topFile = Object.entries(fileCounts).sort((a, b) => b[1] - a[1])[0]

        return {
            topVulnerability,
            topFile
        }
    }, [findings, groupedFindings])


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
                        <LLMStatus />
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


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" disabled={!scan || status !== 'completed'}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Report
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleExportPDF}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportHTML}>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Export as HTML
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportMarkdown}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as Markdown
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportJSON}>
                                    <FileJson className="w-4 h-4 mr-2" />
                                    Export as JSON
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

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

                {/* Security Insights */}
                {securityInsights && (
                    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                Security Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Top Vulnerability</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium text-red-600">{securityInsights.topVulnerability.name}</span> accounts for {Math.round((securityInsights.topVulnerability.count / findings.length) * 100)}% of all findings.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FileCode className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Most Affected File</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium text-purple-600">{securityInsights.topFile[0]}</span> contains {securityInsights.topFile[1]} issues.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Findings Table */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="min-h-[500px]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Vulnerability Findings</CardTitle>
                            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={`h-8 px-3 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <LayoutList className="w-4 h-4 mr-2" />
                                    List
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('grouped')}
                                    className={`h-8 px-3 ${viewMode === 'grouped' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <LayoutGrid className="w-4 h-4 mr-2" />
                                    Grouped
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {findings.length > 0 ? (
                                viewMode === 'list' ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Severity</TableHead>
                                                <TableHead>Vulnerability</TableHead>
                                                <TableHead>Standards</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>AI Analysis</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {findings.map((finding) => (
                                                <TableRow
                                                    key={finding.id}
                                                    className="cursor-pointer hover:bg-gray-50"
                                                    onClick={() => handleFindingClick(finding)}
                                                >
                                                    <TableCell>
                                                        <Badge className={getSeverityColor(finding.severity)}>
                                                            {finding.severity.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{finding.vulnerability}</div>
                                                        {finding.fix && (
                                                            <Badge variant="outline" className="mt-1 text-xs border-green-200 text-green-700 bg-green-50">
                                                                Fix Available
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            {finding.cweId && (
                                                                <a
                                                                    href={`https://cwe.mitre.org/data/definitions/${finding.cweId.replace(/[^0-9]/g, '')}.html`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                                >
                                                                    {finding.cweId}
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                            {finding.owaspCategory && (
                                                                <span className="text-xs text-gray-500">
                                                                    {finding.owaspCategory}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm font-mono">{finding.file}</div>
                                                        <div className="text-xs text-gray-500">Line {finding.lineStart}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(finding.detectedAt).toLocaleDateString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {finding.aiAnalysis?.analyzed ? (
                                                            <div className="flex flex-col gap-1">
                                                                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 w-fit">
                                                                    <Brain className="w-3 h-3 mr-1" />
                                                                    Verified
                                                                </Badge>
                                                                {finding.aiAnalysis.confidence !== undefined && (
                                                                    <span className="text-[10px] text-gray-500">
                                                                        Conf: {Math.round(finding.aiAnalysis.confidence * 100)}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleAnalyzeFinding(finding)
                                                                }}
                                                            >
                                                                <Brain className="w-3 h-3 mr-1" />
                                                                Analyze
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="space-y-4">
                                        {groupedFindings.map((group) => (
                                            <div key={group.name} className="border rounded-lg overflow-hidden">
                                                <div
                                                    className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => toggleGroup(group.name)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {expandedGroups[group.name] ? (
                                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronRight className="w-5 h-5 text-gray-500" />
                                                        )}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {group.count} issues
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Highest Severity: <span className={`font-medium ${group.severity === 'critical' ? 'text-red-600' : group.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}`}>{group.severity.toUpperCase()}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm">
                                                        View Details
                                                    </Button>
                                                </div>

                                                {expandedGroups[group.name] && (
                                                    <div className="border-t">
                                                        {/* Group Intelligence */}
                                                        <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-start gap-3">
                                                            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                                                            <div>
                                                                <h4 className="font-semibold text-blue-900 text-sm">AI Insight</h4>
                                                                <p className="text-sm text-blue-800 mt-1">
                                                                    This vulnerability type typically indicates {group.name.toLowerCase().includes('injection') ? 'improper handling of untrusted data.' : 'security configuration issues.'}
                                                                    Review all instances and apply consistent validation or sanitization.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Location</TableHead>
                                                                    <TableHead>Description</TableHead>
                                                                    <TableHead>Action</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {group.items.map((finding) => (
                                                                    <TableRow
                                                                        key={finding.id}
                                                                        className="cursor-pointer hover:bg-gray-50"
                                                                        onClick={() => handleFindingClick(finding)}
                                                                    >
                                                                        <TableCell>
                                                                            <div className="font-mono text-sm">{finding.file}</div>
                                                                            <div className="text-xs text-gray-500">Line {finding.lineStart}</div>
                                                                        </TableCell>
                                                                        <TableCell className="max-w-md truncate">
                                                                            {finding.description}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button variant="ghost" size="sm" className="text-blue-600">
                                                                                View
                                                                                <ArrowUpRight className="w-3 h-3 ml-1" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )
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

            {/* Code Viewer Modal */}
            <CodeViewer
                finding={selectedFinding}
                projectId={project.id}
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
            />
        </div>
    )
}
