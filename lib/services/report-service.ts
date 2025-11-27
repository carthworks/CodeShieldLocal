import { Scan, Finding, Report, ReportFormat, Project } from "@/lib/types/models"
import { store } from "@/lib/store"
import { generateId } from "@/lib/utils"

export class ReportService {

    async generateReport(
        scanId: string,
        format: ReportFormat,
        projectName: string
    ): Promise<Report> {
        const scan = store.getScan(scanId)
        if (!scan) {
            throw new Error("Scan not found")
        }

        const findings = store.getFindings(scanId)

        const report: Report = {
            id: generateId(),
            scanId,
            format,
            generatedAt: new Date(),
            metadata: {
                projectName,
                scanDate: scan.startedAt.toISOString(),
                riskScore: scan.stats.riskScore,
                totalFindings: findings.length,
                version: "1.0.0"
            },
            content: ""
        }

        switch (format) {
            case 'markdown':
                report.content = this.generateMarkdown(scan, findings, projectName)
                break
            case 'json':
                report.content = this.generateJSON(scan, findings, projectName)
                break
            case 'pdf':
                // PDF will be generated client-side due to jsPDF limitations
                report.content = this.generateMarkdown(scan, findings, projectName)
                break
            default:
                throw new Error(`Unsupported format: ${format}`)
        }

        return report
    }

    private generateMarkdown(scan: Scan, findings: Finding[], projectName: string): string {
        const date = new Date().toLocaleDateString()
        const criticalCount = findings.filter(f => f.severity === 'critical').length
        const highCount = findings.filter(f => f.severity === 'high').length
        const mediumCount = findings.filter(f => f.severity === 'medium').length
        const lowCount = findings.filter(f => f.severity === 'low').length

        let md = `# Security Scan Report\n\n`
        md += `**Project**: ${projectName}\n`
        md += `**Generated**: ${date}\n`
        md += `**Scan ID**: ${scan.id}\n`
        md += `**Risk Score**: ${scan.stats.riskScore}/10\n\n`

        md += `---\n\n`

        md += `## Executive Summary\n\n`
        md += `This report contains the results of a security scan performed on **${projectName}**.\n\n`
        md += `### Scan Statistics\n\n`
        md += `- **Files Scanned**: ${scan.stats.filesScanned}\n`
        md += `- **Lines Analyzed**: ${scan.stats.linesScanned}\n`
        md += `- **Scan Duration**: ${scan.stats.duration.toFixed(2)}s\n`
        md += `- **Total Findings**: ${findings.length}\n\n`

        md += `### Findings by Severity\n\n`
        md += `| Severity | Count |\n`
        md += `|----------|-------|\n`
        md += `| 🔴 Critical | ${criticalCount} |\n`
        md += `| 🟠 High | ${highCount} |\n`
        md += `| 🟡 Medium | ${mediumCount} |\n`
        md += `| 🔵 Low | ${lowCount} |\n\n`

        if (findings.length === 0) {
            md += `## ✅ No Vulnerabilities Found\n\n`
            md += `Great news! No security vulnerabilities were detected in this scan.\n\n`
            return md
        }

        md += `---\n\n`
        md += `## Detailed Findings\n\n`

        // Group by severity
        const bySeverity = {
            critical: findings.filter(f => f.severity === 'critical'),
            high: findings.filter(f => f.severity === 'high'),
            medium: findings.filter(f => f.severity === 'medium'),
            low: findings.filter(f => f.severity === 'low')
        }

        for (const [severity, items] of Object.entries(bySeverity)) {
            if (items.length === 0) continue

            const emoji = severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : severity === 'medium' ? '🟡' : '🔵'
            md += `### ${emoji} ${severity.toUpperCase()} Severity (${items.length})\n\n`

            items.forEach((finding, idx) => {
                md += `#### ${idx + 1}. ${finding.vulnerability}\n\n`
                md += `**File**: \`${finding.file}\`  \n`
                md += `**Line**: ${finding.lineStart}-${finding.lineEnd}  \n`
                if (finding.cweId) md += `**CWE**: ${finding.cweId}  \n`
                if (finding.owaspCategory) md += `**OWASP**: ${finding.owaspCategory}  \n`
                md += `**Confidence**: ${(finding.confidence * 100).toFixed(0)}%\n\n`

                md += `**Description**:\n${finding.description}\n\n`
                md += `**Risk**:\n${finding.risk}\n\n`

                if (finding.code) {
                    md += `**Vulnerable Code**:\n\`\`\`${finding.language || 'javascript'}\n${finding.code}\n\`\`\`\n\n`
                }

                if (finding.fix) {
                    md += `**Recommended Fix**:\n\`\`\`${finding.language || 'javascript'}\n${finding.fix}\n\`\`\`\n\n`
                }

                md += `---\n\n`
            })
        }

        md += `## Recommendations\n\n`
        md += `1. **Address Critical Issues First**: Focus on fixing critical and high severity vulnerabilities immediately.\n`
        md += `2. **Review Medium Issues**: Plan to address medium severity issues in the next sprint.\n`
        md += `3. **Monitor Low Issues**: Keep track of low severity issues for future improvements.\n`
        md += `4. **Regular Scans**: Run security scans regularly to catch new vulnerabilities early.\n\n`

        md += `---\n\n`
        md += `*Report generated by CodeShield Local v1.0.0*\n`

        return md
    }

    private generateJSON(scan: Scan, findings: Finding[], projectName: string): string {
        const report = {
            metadata: {
                projectName,
                scanId: scan.id,
                generatedAt: new Date().toISOString(),
                riskScore: scan.stats.riskScore,
                version: "1.0.0"
            },
            statistics: {
                filesScanned: scan.stats.filesScanned,
                linesScanned: scan.stats.linesScanned,
                duration: scan.stats.duration,
                totalFindings: findings.length,
                bySeverity: {
                    critical: scan.stats.critical,
                    high: scan.stats.high,
                    medium: scan.stats.medium,
                    low: scan.stats.low
                }
            },
            findings: findings.map(f => ({
                id: f.id,
                vulnerability: f.vulnerability,
                severity: f.severity,
                confidence: f.confidence,
                file: f.file,
                lineStart: f.lineStart,
                lineEnd: f.lineEnd,
                cweId: f.cweId,
                owaspCategory: f.owaspCategory,
                description: f.description,
                risk: f.risk,
                fix: f.fix,
                code: f.code,
                language: f.language,
                detectedAt: f.detectedAt
            }))
        }

        return JSON.stringify(report, null, 2)
    }
}

export const reportService = new ReportService()
