import fs from 'fs/promises'
import path from 'path'
import { Scan, ScanConfig, Project, FileNode, Finding, ScanStatus } from "@/lib/types/models"
import { store } from "@/lib/store"
import { staticEngine } from "@/lib/analysis/static/engine"
import { llmEngine } from "@/lib/analysis/llm/engine"
import { generateId } from "@/lib/utils"

export class ScanService {

    async startScan(projectId: string, config: ScanConfig): Promise<Scan> {
        const project = store.getProject(projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        const scanId = generateId()
        const scan: Scan = {
            id: scanId,
            projectId,
            config,
            status: 'pending',
            progress: {
                stage: 'static',
                filesProcessed: 0,
                totalFiles: project.fileCount,
                percentage: 0,
                message: "Initializing scan..."
            },
            findings: [],
            stats: {
                filesScanned: 0,
                linesScanned: 0,
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                riskScore: 0,
                duration: 0
            },
            startedAt: new Date()
        }

        store.saveScan(scan)

        // Start scanning in background
        this.runScan(scan, project)

        return scan
    }

    private async runScan(scan: Scan, project: Project) {
        try {
            store.updateScanStatus(scan.id, 'scanning')

            // 1. Static Analysis
            await this.runStaticAnalysis(scan, project)

            // 2. LLM Analysis
            if (scan.config.enableLLM) {
                await this.runLLMAnalysis(scan)
            }

            // 3. Finalize
            this.finalizeScan(scan)

        } catch (error) {
            console.error(`Scan ${scan.id} failed:`, error)
            store.updateScanStatus(scan.id, 'failed')
            const currentScan = store.getScan(scan.id)
            if (currentScan) {
                currentScan.error = error instanceof Error ? error.message : "Unknown error"
            }
        }
    }

    private async runStaticAnalysis(scan: Scan, project: Project) {
        const filesToScan = this.flattenFileTree(project.tree)
        let processed = 0

        for (const fileNode of filesToScan) {
            // Update progress
            processed++
            const percentage = Math.round((processed / filesToScan.length) * 100)

            store.updateScanProgress(scan.id, {
                stage: 'static',
                currentFile: fileNode.path,
                filesProcessed: processed,
                totalFiles: filesToScan.length,
                percentage,
                message: `Scanning ${fileNode.name}...`
            })

            // Read file content
            const fullPath = path.join(project.path, fileNode.path)
            try {
                const content = await fs.readFile(fullPath, 'utf-8')
                fileNode.content = content // Temporarily load content

                // Analyze
                const findings = staticEngine.analyzeFile(fileNode, scan.id)

                // Save findings
                for (const finding of findings) {
                    store.addFinding(scan.id, finding)
                }

                // Update stats
                const currentScan = store.getScan(scan.id)
                if (currentScan) {
                    currentScan.stats.filesScanned++
                    currentScan.stats.linesScanned += fileNode.lines || 0
                }

                // Free memory
                fileNode.content = undefined

            } catch (err) {
                console.error(`Failed to read file ${fullPath}:`, err)
            }

            // Small delay to allow UI updates and not block event loop completely
            if (processed % 10 === 0) await new Promise(resolve => setTimeout(resolve, 0))
        }
    }

    private async runLLMAnalysis(scan: Scan) {
        const findings = store.getFindings(scan.id)
        // Filter for findings that need analysis (e.g., exclude low severity if needed)
        // For now, analyze all open findings
        const openFindings = findings.filter(f => f.status !== 'false_positive')

        if (openFindings.length === 0) return

        store.updateScanProgress(scan.id, {
            stage: 'llm',
            filesProcessed: 0,
            totalFiles: openFindings.length,
            percentage: 0,
            message: "Running AI analysis..."
        })

        await llmEngine.analyzeFindings(scan.id, openFindings, scan.config, (processed) => {
            const percentage = Math.round((processed / openFindings.length) * 100)
            store.updateScanProgress(scan.id, {
                stage: 'llm',
                filesProcessed: processed,
                totalFiles: openFindings.length,
                percentage,
                message: `Analyzing finding ${processed}/${openFindings.length}...`
            })
        })
    }

    private flattenFileTree(nodes: FileNode[]): FileNode[] {
        let files: FileNode[] = []
        for (const node of nodes) {
            if (node.type === 'file') {
                files.push(node)
            } else if (node.children) {
                files = files.concat(this.flattenFileTree(node.children))
            }
        }
        return files
    }

    private finalizeScan(scan: Scan) {
        const currentScan = store.getScan(scan.id)
        if (!currentScan) return

        const findings = store.getFindings(scan.id)

        // Calculate stats
        let critical = 0, high = 0, medium = 0, low = 0

        findings.forEach(f => {
            if (f.severity === 'critical') critical++
            else if (f.severity === 'high') high++
            else if (f.severity === 'medium') medium++
            else if (f.severity === 'low') low++
        })

        currentScan.stats.critical = critical
        currentScan.stats.high = high
        currentScan.stats.medium = medium
        currentScan.stats.low = low

        // Calculate risk score (0-10)
        // Simple formula: (Critical * 10 + High * 5 + Medium * 2 + Low * 1) / Total Files * Scale
        // Capped at 10
        const rawScore = (critical * 10 + high * 5 + medium * 2 + low * 1)
        currentScan.stats.riskScore = Math.min(10, Math.round(rawScore / Math.max(1, currentScan.stats.filesScanned) * 10))

        currentScan.stats.duration = (new Date().getTime() - scan.startedAt.getTime()) / 1000
        currentScan.completedAt = new Date()
        currentScan.status = 'completed'
        currentScan.progress.percentage = 100
        currentScan.progress.message = "Scan completed"
        currentScan.progress.stage = 'report'
    }

    getScan(id: string): Scan | undefined {
        return store.getScan(id)
    }
}

export const scanService = new ScanService()
