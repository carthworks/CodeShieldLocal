import { Finding } from "@/lib/types/models"

export const SYSTEM_PROMPT = `You are CodeShield, an expert Application Security Engineer. 
Your task is to analyze code vulnerabilities with high precision.
You must output ONLY valid JSON.
Do not include markdown formatting like \`\`\`json.
`

export function generateAnalysisPrompt(finding: Finding, contextCode: string): string {
    return `
Analyze the following potential security vulnerability detected by static analysis.

VULNERABILITY: ${finding.vulnerability}
FILE: ${finding.file}
SEVERITY: ${finding.severity}

CODE CONTEXT:
${contextCode}

TASK:
1. Determine if this is a True Positive (actual vulnerability) or False Positive.
2. Explain the risk concisely.
3. Provide a fixed version of the code snippet.

OUTPUT FORMAT (JSON):
{
  "isTruePositive": boolean,
  "confidence": number, // 0.0 to 1.0
  "riskAnalysis": "string",
  "fixSuggestion": "string", // The fixed code snippet only
  "reasoning": "string" // Why it is TP or FP
}
`
}
