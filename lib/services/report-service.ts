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
            case 'html':
                report.content = this.generateHTML(scan, findings, projectName)
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

    private generateHTML(scan: Scan, findings: Finding[], projectName: string): string {
        const date = new Date().toLocaleDateString()
        const criticalCount = findings.filter(f => f.severity === 'critical').length
        const highCount = findings.filter(f => f.severity === 'high').length
        const mediumCount = findings.filter(f => f.severity === 'medium').length
        const lowCount = findings.filter(f => f.severity === 'low').length

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Report - ${projectName}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #333; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
        .title { font-size: 2rem; font-weight: bold; margin: 0 0 0.5rem 0; }
        .subtitle { color: #666; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #f9fafb; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb; }
        .stat-value { font-size: 1.5rem; font-weight: bold; color: #111; }
        .stat-label { color: #6b7280; font-size: 0.875rem; }
        .severity-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: white; }
        .severity-critical { background-color: #ef4444; }
        .severity-high { background-color: #f97316; }
        .severity-medium { background-color: #eab308; }
        .severity-low { background-color: #3b82f6; }
        .finding { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 1.5rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .finding-header { background: #f9fafb; padding: 1rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .finding-title { font-weight: 600; font-size: 1.1rem; }
        .finding-body { padding: 1rem; }
        .code-block { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: monospace; margin: 1rem 0; font-size: 0.9rem; }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; font-size: 0.875rem; background: #f8fafc; padding: 1rem; border-radius: 6px; }
        .meta-item { display: flex; flex-direction: column; }
        .meta-label { font-weight: 600; color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
        .meta-value { color: #334155; font-weight: 500; }
        .fix-section { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 6px; margin-top: 1rem; }
        .fix-title { color: #166534; font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .description { margin-bottom: 1rem; white-space: pre-wrap; }
        .risk { margin-bottom: 1rem; color: #b91c1c; background: #fef2f2; padding: 1rem; border-radius: 6px; border: 1px solid #fecaca; }
        .risk-title { font-weight: 600; color: #991b1b; margin-bottom: 0.5rem; }
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Security Scan Report</h1>
        <p class="subtitle">Project: <strong>${projectName}</strong> | Generated: ${date} | Scan ID: ${scan.id}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">${scan.stats.riskScore}/10</div>
            <div class="stat-label">Risk Score</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${findings.length}</div>
            <div class="stat-label">Total Findings</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #ef4444">${criticalCount}</div>
            <div class="stat-label">Critical</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #f97316">${highCount}</div>
            <div class="stat-label">High</div>
        </div>
    </div>

    <h2>Detailed Findings</h2>
    
    ${findings.length === 0 ? '<p>No vulnerabilities found. Great job!</p>' : ''}

    ${findings.map((finding, index) => `
    <div class="finding">
        <div class="finding-header">
            <div class="finding-title">#${index + 1} ${finding.vulnerability}</div>
            <span class="severity-badge severity-${finding.severity}">${finding.severity}</span>
        </div>
        <div class="finding-body">
            <div class="meta-grid">
                <div class="meta-item">
                    <span class="meta-label">File</span>
                    <span class="meta-value">${finding.file}:${finding.lineStart}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Category</span>
                    <span class="meta-value">
                        ${finding.cweId ? `<a href="https://cwe.mitre.org/data/definitions/${finding.cweId.replace(/[^0-9]/g, '')}.html" target="_blank">${finding.cweId}</a>` : ''}
                        ${finding.cweId && finding.owaspCategory ? ' | ' : ''}
                        ${finding.owaspCategory || '-'}
                    </span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Detected At</span>
                    <span class="meta-value">${new Date(finding.detectedAt).toLocaleString()}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Confidence</span>
                    <span class="meta-value">${Math.round(finding.confidence * 100)}%</span>
                </div>
            </div>

            <div class="description">
                <strong>Description:</strong><br>
                ${finding.description}
            </div>

            <div class="risk">
                <div class="risk-title">Risk Analysis</div>
                ${finding.risk}
            </div>

            ${finding.code ? `
            <div class="code-block">
                <pre><code>${finding.code}</code></pre>
            </div>
            ` : ''}

            ${finding.fix ? `
            <div class="fix-section">
                <div class="fix-title">✅ Recommended Fix</div>
                <div class="code-block" style="background: #14532d; margin: 0;">
                    <pre><code>${finding.fix}</code></pre>
                </div>
            </div>
            ` : ''}
        </div>
    </div>
    `).join('')}

    <div style="margin-top: 3rem; text-align: center; color: #666; font-size: 0.875rem;">
        Generated by CodeShield Local
    </div>
</body>
</html>`
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
