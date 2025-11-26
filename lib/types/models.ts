
/**
 * Project represents an uploaded codebase
 */
export interface Project {
    id: string                    // UUID
    name: string                  // Project name (from folder/zip)
    path: string                  // Absolute path to extracted files
    uploadedAt: Date              // Upload timestamp
    fileCount: number             // Total files in project
    totalLines: number            // Total lines of code
    languages: string[]           // Detected languages
    size: number                  // Total size in bytes
    tree: FileNode[]              // File tree structure
}

/**
 * FileNode represents a file or directory in the project
 */
export interface FileNode {
    path: string                  // Relative path from project root
    name: string                  // File/directory name
    type: 'file' | 'directory'    // Node type
    extension?: string            // File extension (e.g., 'js', 'py')
    language?: string             // Detected language
    size: number                  // Size in bytes
    lines?: number                // Number of lines (files only)
    content?: string              // File content (lazy loaded)
    children?: FileNode[]         // Child nodes (directories only)
}

/**
 * ScanConfig defines scan parameters
 */
export interface ScanConfig {
    enableStatic: boolean         // Enable static analysis
    enableLLM: boolean            // Enable LLM analysis
    llmModel: LLMModel            // Which Ollama model to use
    maxConcurrentLLM: number      // Max parallel LLM requests
    languages?: string[]          // Languages to scan (default: all)
    excludePaths: string[]        // Paths to exclude
    severityThreshold?: Severity  // Minimum severity to report
}

export type LLMModel = 'deepseek-coder' | 'codellama' | 'llama3'

/**
 * Scan represents a security scan session
 */
export interface Scan {
    id: string                    // UUID
    projectId: string             // Reference to Project
    config: ScanConfig            // Scan configuration
    status: ScanStatus            // Current status
    progress: ScanProgress        // Real-time progress
    findings: Finding[]           // Discovered vulnerabilities
    stats: ScanStats              // Summary statistics
    startedAt: Date               // Scan start time
    completedAt?: Date            // Scan completion time
    error?: string                // Error message if failed
}

export type ScanStatus = 'pending' | 'scanning' | 'completed' | 'failed' | 'cancelled'

/**
 * ScanProgress tracks real-time scan progress
 */
export interface ScanProgress {
    stage: ScanStage              // Current stage
    currentFile?: string          // File being processed
    filesProcessed: number        // Files completed
    totalFiles: number            // Total files to process
    percentage: number            // Overall progress (0-100)
    message: string               // Human-readable status
    eta?: number                  // Estimated time remaining (seconds)
}

export type ScanStage = 'upload' | 'parsing' | 'static' | 'llm' | 'report'

/**
 * ScanStats provides summary statistics
 */
export interface ScanStats {
    filesScanned: number          // Total files scanned
    linesScanned: number          // Total lines analyzed
    critical: number              // Critical vulnerabilities
    high: number                  // High severity
    medium: number                // Medium severity
    low: number                   // Low severity
    riskScore: number             // Overall risk score (0-10)
    duration: number              // Scan duration (seconds)
}

/**
 * Finding represents a discovered vulnerability
 */
export interface Finding {
    id: string                    // UUID
    scanId: string                // Reference to Scan
    status: FindingStatus         // Current status
    type: FindingType             // Detection method
    vulnerability: string         // Vulnerability name
    severity: Severity            // Severity level
    confidence: number            // Confidence score (0-1)

    // Classification
    cweId?: string                // CWE identifier (e.g., 'CWE-89')
    owaspCategory?: string        // OWASP category (e.g., 'A03:2021')

    // Location
    file: string                  // File path
    lineStart: number             // Starting line number
    lineEnd: number               // Ending line number
    code: string                  // Vulnerable code snippet

    // Details
    description: string           // What the vulnerability is
    risk: string                  // Why it's dangerous
    fix: string                   // How to remediate
    references?: string[]         // External references/links

    // Metadata
    detectedAt: Date              // Detection timestamp
    language?: string             // Programming language
}

export type FindingType = 'static' | 'llm'
export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type FindingStatus = 'open' | 'fixed' | 'ignored' | 'false_positive'

/**
 * FindingFilters for filtering findings in queries
 */
export interface FindingFilters {
    severity?: Severity           // Filter by severity
    type?: FindingType            // Filter by detection type
    file?: string                 // Filter by file path
    status?: string               // Filter by status
}

/**
 * Rule defines a static analysis rule
 */
export interface Rule {
    id: string                    // Rule identifier
    name: string                  // Rule name
    description: string           // What it detects
    severity: Severity            // Default severity
    cweId?: string                // Associated CWE
    owaspCategory?: string        // Associated OWASP category
    pattern: RegExp | string      // Detection pattern
    languages: string[]           // Applicable languages
    enabled: boolean              // Is rule active
}

/**
 * Report represents an exported security report
 */
export interface Report {
    id: string                    // UUID
    scanId: string                // Reference to Scan
    format: ReportFormat          // Export format
    generatedAt: Date             // Generation timestamp
    metadata: ReportMetadata      // Report metadata
    content: string | Buffer      // Report content
}

export type ReportFormat = 'pdf' | 'markdown' | 'json' | 'html'

export interface ReportMetadata {
    projectName: string
    scanDate: string
    riskScore: number
    totalFindings: number
    author?: string
    version: string               // CodeShield version
}