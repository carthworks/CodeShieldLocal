import fs from 'fs/promises'
import path from 'path'
import { FileNode } from '@/lib/types/models'

const IGNORED_DIRS = new Set([
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.vscode',
    '.idea',
    '__pycache__',
    'venv',
    '.env'
])

const IGNORED_EXTENSIONS = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.mp4', '.mov', '.avi',
    '.pdf', '.doc', '.docx',
    '.zip', '.tar', '.gz',
    '.exe', '.dll', '.so', '.dylib',
    '.class', '.pyc'
])

export async function buildFileTree(rootPath: string): Promise<FileNode[]> {
    try {
        const stats = await fs.stat(rootPath)
        if (!stats.isDirectory()) {
            throw new Error('Root path must be a directory')
        }
        return await traverseDirectory(rootPath, rootPath)
    } catch (error) {
        console.error('Error building file tree:', error)
        return []
    }
}

async function traverseDirectory(currentPath: string, rootPath: string): Promise<FileNode[]> {
    const nodes: FileNode[] = []

    try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name)
            const relativePath = path.relative(rootPath, fullPath)

            if (entry.isDirectory()) {
                if (IGNORED_DIRS.has(entry.name)) continue

                const children = await traverseDirectory(fullPath, rootPath)
                // Only add directory if it has relevant children (optional optimization)
                // For now, we add all non-ignored directories

                nodes.push({
                    path: relativePath,
                    name: entry.name,
                    type: 'directory',
                    size: 0, // Directories don't have size in this context usually, or sum of children
                    children
                })
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase()
                if (IGNORED_EXTENSIONS.has(ext)) continue

                const stats = await fs.stat(fullPath)

                nodes.push({
                    path: relativePath,
                    name: entry.name,
                    type: 'file',
                    extension: ext.replace('.', ''),
                    size: stats.size,
                    language: detectLanguage(ext)
                })
            }
        }
    } catch (error) {
        console.error(`Error traversing ${currentPath}:`, error)
    }

    return nodes
}

function detectLanguage(ext: string): string | undefined {
    const map: Record<string, string> = {
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.go': 'go',
        '.rs': 'rust',
        '.c': 'c',
        '.cpp': 'cpp',
        '.h': 'c',
        '.hpp': 'cpp',
        '.rb': 'ruby',
        '.php': 'php',
        '.html': 'html',
        '.css': 'css',
        '.json': 'json',
        '.md': 'markdown',
        '.sql': 'sql',
        '.sh': 'shell',
        '.yaml': 'yaml',
        '.yml': 'yaml'
    }
    return map[ext] || 'unknown'
}
