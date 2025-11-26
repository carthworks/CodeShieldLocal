import { FileNode, Finding, Rule, Severity } from "@/lib/types/models"
import { STATIC_RULES } from "./rules"
import { generateId } from "@/lib/utils"

export class StaticAnalysisEngine {

    analyzeFile(file: FileNode, scanId: string): Finding[] {
        if (file.type !== 'file' || !file.content) {
            return []
        }

        const findings: Finding[] = []
        const lines = file.content.split('\n')

        for (const rule of STATIC_RULES) {
            if (!rule.enabled) continue
            if (!this.isLanguageSupported(rule, file.language)) continue

            const matches = this.findMatches(file.content, rule.pattern)

            for (const match of matches) {
                const lineStart = this.getLineNumber(file.content, match.index)
                const lineEnd = this.getLineNumber(file.content, match.index + match.length)
                const codeSnippet = this.getCodeSnippet(lines, lineStart, lineEnd)

                findings.push({
                    id: generateId(),
                    scanId,
                    status: 'open',
                    type: 'static',
                    vulnerability: rule.name,
                    severity: rule.severity,
                    confidence: 1.0, // Static rules are deterministic (though regex can have false positives)

                    cweId: rule.cweId,
                    owaspCategory: rule.owaspCategory,

                    file: file.path,
                    lineStart,
                    lineEnd,
                    code: codeSnippet,

                    description: rule.description,
                    risk: `This pattern matches a known security vulnerability: ${rule.name}.`,
                    fix: "Review the code and replace the insecure pattern with a secure alternative.",

                    detectedAt: new Date(),
                    language: file.language
                })
            }
        }

        return findings
    }

    private isLanguageSupported(rule: Rule, fileLanguage?: string): boolean {
        if (!fileLanguage || fileLanguage === 'unknown') return false
        return rule.languages.includes(fileLanguage.toLowerCase())
    }

    private findMatches(content: string, pattern: RegExp | string): Array<{ index: number, length: number, text: string }> {
        const matches: Array<{ index: number, length: number, text: string }> = []

        if (typeof pattern === 'string') {
            // Simple string search
            let pos = content.indexOf(pattern)
            while (pos !== -1) {
                matches.push({ index: pos, length: pattern.length, text: pattern })
                pos = content.indexOf(pattern, pos + 1)
            }
        } else {
            // Regex search
            // We need to ensure the regex has the global flag to find all matches
            const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
            const regex = new RegExp(pattern.source, flags)

            let match
            while ((match = regex.exec(content)) !== null) {
                matches.push({ index: match.index, length: match[0].length, text: match[0] })
            }
        }

        return matches
    }

    private getLineNumber(content: string, index: number): number {
        return content.substring(0, index).split('\n').length
    }

    private getCodeSnippet(lines: string[], startLine: number, endLine: number): string {
        // Get a few lines of context around the match
        const contextStart = Math.max(0, startLine - 2)
        const contextEnd = Math.min(lines.length, endLine + 1)

        return lines.slice(contextStart, contextEnd).join('\n')
    }
}

export const staticEngine = new StaticAnalysisEngine()
