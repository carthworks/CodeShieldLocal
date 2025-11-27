import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Scan, Finding } from '@/lib/types/models'

export function generatePDFReport(
    scan: Scan,
    findings: Finding[],
    projectName: string
): void {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = 20

    // Title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Security Scan Report', pageWidth / 2, yPos, { align: 'center' })

    yPos += 15

    // Metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Project: ${projectName}`, 20, yPos)
    yPos += 6
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos)
    yPos += 6
    doc.text(`Scan ID: ${scan.id}`, 20, yPos)
    yPos += 6
    doc.text(`Risk Score: ${scan.stats.riskScore}/10`, 20, yPos)

    yPos += 15

    // Executive Summary
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Executive Summary', 20, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    const summaryData = [
        ['Files Scanned', scan.stats.filesScanned.toString()],
        ['Lines Analyzed', scan.stats.linesScanned.toString()],
        ['Scan Duration', `${scan.stats.duration.toFixed(2)}s`],
        ['Total Findings', findings.length.toString()]
    ]

    autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Findings by Severity
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Findings by Severity', 20, yPos)
    yPos += 10

    const severityData = [
        ['Critical', scan.stats.critical.toString(), '#EF4444'],
        ['High', scan.stats.high.toString(), '#F97316'],
        ['Medium', scan.stats.medium.toString(), '#EAB308'],
        ['Low', scan.stats.low.toString(), '#3B82F6']
    ]

    autoTable(doc, {
        startY: yPos,
        head: [['Severity', 'Count', '']],
        body: severityData.map(row => [row[0], row[1]]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 },
        didDrawCell: (data) => {
            if (data.column.index === 0 && data.section === 'body') {
                const severity = severityData[data.row.index][0]
                const color = severityData[data.row.index][2]
                doc.setFillColor(color)
                doc.circle(data.cell.x + 5, data.cell.y + data.cell.height / 2, 2, 'F')
            }
        }
    })

    if (findings.length === 0) {
        yPos = (doc as any).lastAutoTable.finalY + 15
        doc.setFontSize(14)
        doc.setTextColor(34, 197, 94)
        doc.text('✓ No Vulnerabilities Found', 20, yPos)
        doc.save(`${projectName}-security-report.pdf`)
        return
    }

    // Detailed Findings
    doc.addPage()
    yPos = 20

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Detailed Findings', 20, yPos)
    yPos += 10

    const findingsData = findings.map((f, idx) => [
        (idx + 1).toString(),
        f.vulnerability,
        f.severity.toUpperCase(),
        f.file,
        `${f.lineStart}-${f.lineEnd}`
    ])

    autoTable(doc, {
        startY: yPos,
        head: [['#', 'Vulnerability', 'Severity', 'File', 'Lines']],
        body: findingsData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 50 },
            2: { cellWidth: 25 },
            3: { cellWidth: 60 },
            4: { cellWidth: 20 }
        },
        didParseCell: (data) => {
            if (data.column.index === 2 && data.section === 'body') {
                const finding = findings[data.row.index]
                if (finding) {
                    const severity = finding.severity
                    let color: [number, number, number] = [156, 163, 175]

                    if (severity === 'critical') color = [239, 68, 68]
                    else if (severity === 'high') color = [249, 115, 22]
                    else if (severity === 'medium') color = [234, 179, 8]
                    else if (severity === 'low') color = [59, 130, 246]

                    data.cell.styles.textColor = color
                    data.cell.styles.fontStyle = 'bold'
                }
            }
        }
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(
            `CodeShield Local v1.0.0 | Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        )
    }

    // Save
    doc.save(`${projectName}-security-report.pdf`)
}
