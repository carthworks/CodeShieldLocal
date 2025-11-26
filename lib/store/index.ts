import { Project, Scan, Finding, ScanProgress, ScanStatus, FindingFilters } from "../types/models"

class InMemoryStore {
    private projects: Map<string, Project> = new Map()
    private scans: Map<string, Scan> = new Map()
    // findings map scanId to an array of findings for that scan
    private findings: Map<string, Finding[]> = new Map()

    // Projects
    saveProject(project: Project): void {
        this.projects.set(project.id, project)
    }
    getProject(id: string): Project | undefined {
        return this.projects.get(id)
    }
    deleteProject(id: string): void {
        this.projects.delete(id)
    }

    // Scans
    saveScan(scan: Scan): void {
        this.scans.set(scan.id, scan)
    }
    getScan(id: string): Scan | undefined {
        return this.scans.get(id)
    }
    updateScanProgress(id: string, progress: ScanProgress): void {
        const scan = this.scans.get(id)
        if (scan) {
            scan.progress = progress
        }
    }
    updateScanStatus(id: string, status: ScanStatus): void {
        const scan = this.scans.get(id)
        if (scan) {
            scan.status = status
        }
    }
    addFinding(scanId: string, finding: Finding): void {
        const findings = this.findings.get(scanId) || []
        findings.push(finding)
        this.findings.set(scanId, findings)
    }

    // Findings
    getFindings(scanId: string, filters?: FindingFilters): Finding[] {
        let scanFindings = this.findings.get(scanId) || []

        if (filters) {
            // Apply filters if provided
            if (filters.status) {
                scanFindings = scanFindings.filter(f => f.status === filters.status);
            }
            if (filters.severity) {
                scanFindings = scanFindings.filter(f => f.severity === filters.severity);
            }
            // Add more filter conditions as needed
        }

        return scanFindings
    }

    // This method needs to search through all findings across all scans to find a specific finding by its ID.
    getFinding(id: string): Finding | undefined {
        for (const scanFindings of this.findings.values()) {
            const found = scanFindings.find(finding => finding.id === id)
            if (found) {
                return found
            }
        }
        return undefined
    }

    // Cleanup
    cleanup(): void {
        this.projects.clear()
        this.scans.clear()
        this.findings.clear()
    }
}

export const store = new InMemoryStore()