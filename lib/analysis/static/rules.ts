import { Rule, Severity } from "@/lib/types/models"

export const STATIC_RULES: Rule[] = [
   // ---------------------------
// Additional 20 Security Rules
// ---------------------------
{
  id: "SEC100",
  name: "Hardcoded Password Assignment",
  description: "Detects likely hardcoded plaintext passwords or credentials assigned in source.",
  severity: "critical",
  cweId: "CWE-798",
  owaspCategory: "A01:2021",
  pattern: /\b(password|passwd|pwd|secret|api_key|apikey)\b\s*[:=]\s*["'][^"']{4,}["']/i,
  languages: ["javascript", "typescript", "python", "java", "php", "go", "ruby"],
  enabled: true
},
{
  id: "SEC101",
  name: "Private Key / PEM Literal",
  description: "Private key or PEM material embedded directly in code or text file.",
  severity: "critical",
  cweId: "CWE-200",
  owaspCategory: "A01:2021",
  pattern: /-----BEGIN (RSA|EC|PRIVATE) KEY-----[\s\S]{50,}-----END (RSA|EC|PRIVATE) KEY-----/i,
  languages: ["*"],
  enabled: true
},
{
  id: "SEC102",
  name: "AWS/GCP/Azure Metadata Access URL",
  description: "Access to cloud metadata service (instance credentials) may indicate attempts to retrieve instance role credentials.",
  severity: "high",
  cweId: "CWE-200",
  owaspCategory: "A05:2021",
  pattern: /169\.254\.169\.254|metadata\.google|azure\.metadata\.service/i,
  languages: ["javascript", "python", "go", "bash", "ruby"],
  enabled: true
},
{
  id: "SEC103",
  name: "Basic Auth Credentials in URL",
  description: "Basic auth credentials embedded in URLs (user:pass@host) — exposes credentials in logs and VCS.",
  severity: "high",
  cweId: "CWE-200",
  owaspCategory: "A02:2021",
  pattern: /https?:\/\/[^\/\s:@]+:[^\/\s:@]+@/i,
  languages: ["*"],
  enabled: true
},
{
  id: "SEC104",
  name: "Use of eval / dynamic code execution",
  description: "Use of eval or equivalent dynamic code execution functions can lead to remote code execution or injection.",
  severity: "high",
  cweId: "CWE-95",
  owaspCategory: "A03:2021",
  pattern: /\b(eval|new Function|Function\()\s*\(/i,
  languages: ["javascript", "typescript", "python", "ruby", "php"],
  enabled: true
},
{
  id: "SEC105",
  name: "Command Execution / Shell Spawn",
  description: "Direct command execution (exec/spawn/popen) with potentially unsanitized input can allow command injection.",
  severity: "critical",
  cweId: "CWE-77",
  owaspCategory: "A03:2021",
  pattern: /\b(exec|execSync|spawn|spawnSync|popen|system)\b\s*\(/i,
  languages: ["javascript", "python", "php", "ruby", "go", "java"],
  enabled: true
},
{
  id: "SEC106",
  name: "SQL-like Query Strings in Code",
  description: "Presence of SQL keywords in concatenated strings or unparameterized queries — possible SQL injection vectors.",
  severity: "high",
  cweId: "CWE-89",
  owaspCategory: "A03:2021",
  pattern: /\b(select|insert|update|delete|drop|truncate)\b[\s\S]{0,100}(\bfrom\b|\binto\b)/i,
  languages: ["javascript", "typescript", "python", "java", "php", "ruby", "go"],
  enabled: true
},
{
  id: "SEC107",
  name: "NoSQL Injection Patterns (MongoDB \$where / \$where usage)",
  description: "Detects potentially unsafe use of MongoDB \$where or string-based query building that can lead to injection.",
  severity: "high",
  cweId: "CWE-943",
  owaspCategory: "A03:2021",
  pattern: /\$(where|eval)\b|\{[^\}]*\$where[^\}]*\}/i,
  languages: ["javascript", "typescript", "python", "node"],
  enabled: true
},
{
  id: "SEC108",
  name: "Insecure Random for Crypto",
  description: "Use of non-cryptographic randomness (Math.random, random.random without secrets) for security-sensitive tasks.",
  severity: "high",
  cweId: "CWE-330",
  owaspCategory: "A02:2021",
  pattern: /\bMath\.random\b|\brandom\.random\(\)/i,
  languages: ["javascript", "typescript", "python"],
  enabled: true
},
{
  id: "SEC109",
  name: "Weak Hash Algorithm (MD5 / SHA1) Usage",
  description: "Use of cryptographically weak hash functions like MD5 or SHA-1 for security purposes.",
  severity: "high",
  cweId: "CWE-327",
  owaspCategory: "A02:2021",
  pattern: /\b(createHash\(['"]md5|sha1['"]\))|\bCryptoJS\.MD5\b|\bMessageDigest\.getInstance\(['"](MD5|SHA-1)['"]\)/i,
  languages: ["javascript", "typescript", "java", "python", "php"],
  enabled: true
},
{
  id: "SEC110",
  name: "Insecure TLS / SSL Protocol Usage",
  description: "Explicit use of outdated or insecure TLS/SSL versions or disabling certificate checks (rejectUnauthorized: false).",
  severity: "critical",
  cweId: "CWE-295",
  owaspCategory: "A05:2021",
  pattern: /\b(TLSv1|TLSv1\.0|SSLv3|rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=|allowInsecureTLS)\b/i,
  languages: ["javascript", "python", "java", "go"],
  enabled: true
},
{
  id: "SEC111",
  name: "Insecure CORS — Wildcard Origin",
  description: "CORS policies allowing all origins with credentials or allowed methods can expose endpoints to CSRF and data exfiltration.",
  severity: "high",
  cweId: "CWE-942",
  owaspCategory: "A05:2021",
  pattern: /Access-Control-Allow-Origin\s*:\s*\*|cors\(\)\.allowAll|origin:\s*['"]\*['"]/i,
  languages: ["javascript", "typescript", "node", "express"],
  enabled: true
},
{
  id: "SEC112",
  name: "Exposed Sensitive Environment Variable in Code",
  description: "Directly logging or hardcoding environment variables (e.g., process.env.SECRET) in code or strings.",
  severity: "high",
  cweId: "CWE-200",
  owaspCategory: "A01:2021",
  pattern: /\b(process\.env|ENV)\b\.[A-Z0-9_]*\b.*\b(console\.log|print|puts|fmt\.Print)/i,
  languages: ["javascript", "typescript", "python", "go", "ruby"],
  enabled: true
},
{
  id: "SEC113",
  name: "Directory Traversal / Path Traversal",
  description: "Patterns indicating unsafe file path concatenation containing ../ sequences or user-controlled path joins.",
  severity: "high",
  cweId: "CWE-22",
  owaspCategory: "A01:2021",
  pattern: /(\.\.\/|\/\.\.)|path\s*\+\s*["']\/\.\.|fs\.readFileSync\(\s*userInput|open\(\s*userInput\)/i,
  languages: ["javascript", "python", "php", "ruby", "java", "go"],
  enabled: true
},
{
  id: "SEC114",
  name: "Insecure File Permissions (chmod 0777)",
  description: "Files or scripts setting world-writable permissions may expose sensitive files.",
  severity: "medium",
  cweId: "CWE-732",
  owaspCategory: "A05:2021",
  pattern: /\b(chmod|fs\.chmod|os\.chmod)\s*\(\s*[^,]+,\s*0?777\b/i,
  languages: ["javascript", "python", "ruby", "bash"],
  enabled: true
},
{
  id: "SEC115",
  name: "Excessive Logging of Sensitive Data",
  description: "Logging of tokens, passwords, credit card numbers, or PII in application logs.",
  severity: "high",
  cweId: "CWE-532",
  owaspCategory: "A06:2021",
  pattern: /\b(token|access_token|refresh_token|creditcard|ccnum|ssn|socialsecurity)\b.*(console\.log|logger\.)/i,
  languages: ["javascript", "typescript", "python", "java", "php"],
  enabled: true
},
{
  id: "SEC116",
  name: "Document.write / innerHTML Assignment",
  description: "Direct use of document.write or assigning to innerHTML with unsanitized content — XSS risk.",
  severity: "high",
  cweId: "CWE-79",
  owaspCategory: "A07:2021",
  pattern: /\b(document\.write|innerHTML\s*=|outerHTML\s*=)/i,
  languages: ["javascript", "typescript"],
  enabled: true
},
{
  id: "SEC117",
  name: "Insecure Use of setTimeout / setInterval with String",
  description: "Passing string arguments to setTimeout/setInterval executes code via the interpreter and can lead to injection.",
  severity: "medium",
  cweId: "CWE-95",
  owaspCategory: "A03:2021",
  pattern: /\b(setTimeout|setInterval)\s*\(\s*['"][^'"]+['"]\s*,/i,
  languages: ["javascript", "typescript"],
  enabled: true
},
{
  id: "SEC118",
  name: "Hardcoded OAuth / JWT Secret",
  description: "Hardcoded secret used for signing JWTs or OAuth tokens (check common variable names and literal secrets).",
  severity: "critical",
  cweId: "CWE-259",
  owaspCategory: "A02:2021",
  pattern: /\b(secret|jwtSecret|jwt_secret|JWT_SECRET|HMAC_SECRET)\b\s*[:=]\s*['"][A-Za-z0-9\-_\.]{8,}['"]/i,
  languages: ["javascript", "typescript", "python", "java", "go", "php"],
  enabled: true
},
{
  id: "SEC119",
  name: "Dangerous Shell Patterns (rm -rf, wget | sh)",
  description: "Commands that download and execute remote scripts or delete recursively in code or scripts.",
  severity: "critical",
  cweId: "CWE-78",
  owaspCategory: "A03:2021",
  pattern: /\b(rm\s+-rf|curl\s+[^|]+\|\s*sh|wget\s+[^|]+\|\s*sh)\b/i,
  languages: ["bash", "sh", "python", "ruby", "javascript"],
  enabled: true
}

]
