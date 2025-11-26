import { Rule, Severity } from "@/lib/types/models"

export const STATIC_RULES: Rule[] = [
    // ---------------------------------------------------------------------------
    // 1. Secrets & Credentials
    // ---------------------------------------------------------------------------
    {
        id: "SEC001",
        name: "Hardcoded AWS Access Key",
        description: "Detected a hardcoded AWS Access Key ID. Never commit credentials to version control.",
        severity: "critical",
        cweId: "CWE-798",
        owaspCategory: "A07:2021",
        pattern: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/,
        languages: ["javascript", "typescript", "python", "java", "go", "php"],
        enabled: true
    },
    {
        id: "SEC002",
        name: "Hardcoded AWS Secret Key",
        description: "Detected a potential AWS Secret Access Key. This grants access to your AWS resources.",
        severity: "critical",
        cweId: "CWE-798",
        owaspCategory: "A07:2021",
        pattern: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/, // Simplified for performance, usually paired with ID
        languages: ["javascript", "typescript", "python", "java", "go", "php"],
        enabled: true
    },
    {
        id: "SEC003",
        name: "Hardcoded Private Key",
        description: "Detected a private key block (RSA/DSA/EC).",
        severity: "critical",
        cweId: "CWE-798",
        owaspCategory: "A07:2021",
        pattern: /-----BEGIN ((EC|PGP|DSA|RSA|OPENSSH) )?PRIVATE KEY( BLOCK)?-----/,
        languages: ["javascript", "typescript", "python", "java", "go", "php"],
        enabled: true
    },
    {
        id: "SEC004",
        name: "Hardcoded API Key / Token",
        description: "Detected a variable named 'apiKey', 'token', or 'secret' with a string assignment.",
        severity: "high",
        cweId: "CWE-798",
        owaspCategory: "A07:2021",
        // Matches: const apiKey = "..." or var token = '...'
        pattern: /(const|let|var|String)\s+(apiKey|api_key|accessToken|access_token|secret|token)\s*=\s*['"][a-zA-Z0-9_\-]{20,}['"]/,
        languages: ["javascript", "typescript", "java"],
        enabled: true
    },
    {
        id: "SEC005",
        name: "Hardcoded Password",
        description: "Detected a hardcoded password assignment.",
        severity: "high",
        cweId: "CWE-259",
        owaspCategory: "A07:2021",
        pattern: /(password|passwd|pwd|pass)\s*=\s*['"][^'"]{3,}['"]/,
        languages: ["javascript", "typescript", "python", "java"],
        enabled: true
    },

    // ---------------------------------------------------------------------------
    // 2. Injection Vulnerabilities
    // ---------------------------------------------------------------------------
    {
        id: "INJ001",
        name: "SQL Injection (String Concatenation)",
        description: "Detected SQL query construction using string concatenation. Use parameterized queries instead.",
        severity: "critical",
        cweId: "CWE-89",
        owaspCategory: "A03:2021",
        pattern: /(SELECT|INSERT|UPDATE|DELETE)\s+.*(\+|concat).*(WHERE|VALUES|SET)/i,
        languages: ["javascript", "typescript", "python", "java"],
        enabled: true
    },
    {
        id: "INJ002",
        name: "Command Injection (exec/spawn)",
        description: "Detected execution of system commands with potentially unsafe arguments.",
        severity: "critical",
        cweId: "CWE-78",
        owaspCategory: "A03:2021",
        pattern: /(child_process|cp)\.(exec|spawn|execSync|spawnSync)\s*\(\s*[^,)]+/,
        languages: ["javascript", "typescript"],
        enabled: true
    },
    {
        id: "INJ003",
        name: "Unsafe Eval",
        description: "Usage of eval() allows execution of arbitrary code.",
        severity: "high",
        cweId: "CWE-95",
        owaspCategory: "A03:2021",
        pattern: /\beval\s*\(/,
        languages: ["javascript", "typescript", "python"],
        enabled: true
    },

    // ---------------------------------------------------------------------------
    // 3. Cross-Site Scripting (XSS)
    // ---------------------------------------------------------------------------
    {
        id: "XSS001",
        name: "React dangerouslySetInnerHTML",
        description: "Directly setting HTML bypasses React's XSS protection.",
        severity: "high",
        cweId: "CWE-79",
        owaspCategory: "A03:2021",
        pattern: /dangerouslySetInnerHTML/,
        languages: ["javascript", "typescript"],
        enabled: true
    },
    {
        id: "XSS002",
        name: "Unsafe InnerHTML Assignment",
        description: "Assigning to innerHTML can lead to XSS if content is not sanitized.",
        severity: "medium",
        cweId: "CWE-79",
        owaspCategory: "A03:2021",
        pattern: /\.innerHTML\s*=/,
        languages: ["javascript", "typescript"],
        enabled: true
    },

    // ---------------------------------------------------------------------------
    // 4. Authentication & Authorization
    // ---------------------------------------------------------------------------
    {
        id: "AUTH001",
        name: "Weak JWT Secret",
        description: "Detected a potentially weak or hardcoded JWT secret.",
        severity: "high",
        cweId: "CWE-312",
        owaspCategory: "A01:2021",
        pattern: /jwt\.sign\s*\([^,]+,\s*['"](secret|key|123456)['"]/,
        languages: ["javascript", "typescript"],
        enabled: true
    },

    // ---------------------------------------------------------------------------
    // 5. Cryptography
    // ---------------------------------------------------------------------------
    {
        id: "CRY001",
        name: "Weak Hashing Algorithm (MD5/SHA1)",
        description: "MD5 and SHA1 are collision-prone. Use SHA-256 or better.",
        severity: "medium",
        cweId: "CWE-327",
        owaspCategory: "A02:2021",
        pattern: /createHash\s*\(\s*['"](md5|sha1)['"]\s*\)/i,
        languages: ["javascript", "typescript"],
        enabled: true
    },
    {
        id: "CRY002",
        name: "Insecure Random Number Generator",
        description: "Math.random() is not cryptographically secure. Use crypto.getRandomValues().",
        severity: "low",
        cweId: "CWE-330",
        owaspCategory: "A02:2021",
        pattern: /Math\.random\(\)/,
        languages: ["javascript", "typescript"],
        enabled: true
    },

    // ---------------------------------------------------------------------------
    // 6. Logging & Data Exposure
    // ---------------------------------------------------------------------------
    {
        id: "LOG001",
        name: "Console Log of Sensitive Data",
        description: "Logging sensitive data (tokens, passwords) exposes them to logs.",
        severity: "medium",
        cweId: "CWE-532",
        owaspCategory: "A09:2021",
        pattern: /console\.(log|info|error|warn)\s*\(.*(password|token|secret|key|auth)/i,
        languages: ["javascript", "typescript"],
        enabled: true
    },
    {
        id: "LOG002",
        name: "Debugger Statement",
        description: "Debugger statements should not be present in production code.",
        severity: "low",
        cweId: "CWE-489",
        owaspCategory: "A05:2021",
        pattern: /\bdebugger;?/,
        languages: ["javascript", "typescript"],
        enabled: true
    }
]
