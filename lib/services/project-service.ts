import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import JSZip from 'jszip'
import { Project, FileNode } from '@/lib/types/models'
import { store } from '@/lib/store'
import { buildFileTree } from '@/lib/parser/file-tree'
import { generateId } from '@/lib/utils'

const TEMP_DIR = path.join(os.tmpdir(), 'codeshield')

export class ProjectService {

    async createProjectFromZip(file: File): Promise<Project> {
        const projectId = generateId()
        const projectDir = path.join(TEMP_DIR, projectId)

        // Ensure temp dir exists
        await fs.mkdir(projectDir, { recursive: true })

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Load ZIP
        const zip = await JSZip.loadAsync(buffer)

        // Extract all files
        const extractionPromises: Promise<void>[] = []

        zip.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir) {
                const dirPath = path.join(projectDir, relativePath)
                extractionPromises.push(fs.mkdir(dirPath, { recursive: true }).then(() => { }))
            } else {
                const filePath = path.join(projectDir, relativePath)
                const dirPath = path.dirname(filePath)

                extractionPromises.push(
                    fs.mkdir(dirPath, { recursive: true })
                        .then(() => zipEntry.async('nodebuffer'))
                        .then(content => fs.writeFile(filePath, content))
                )
            }
        })

        await Promise.all(extractionPromises)

        // Build file tree
        const tree = await buildFileTree(projectDir)

        // Calculate stats
        const { fileCount, totalLines, languages, size } = this.calculateStats(tree)

        // Create Project object
        const project: Project = {
            id: projectId,
            name: file.name.replace('.zip', ''),
            path: projectDir,
            uploadedAt: new Date(),
            fileCount,
            totalLines,
            languages,
            size,
            tree
        }

        // Save to store
        store.saveProject(project)

        return project
    }

    private calculateStats(nodes: FileNode[]) {
        let fileCount = 0
        let totalLines = 0
        let size = 0
        const languages = new Set<string>()

        function traverse(node: FileNode) {
            if (node.type === 'file') {
                fileCount++
                size += node.size
                if (node.lines) totalLines += node.lines
                if (node.language && node.language !== 'unknown') {
                    languages.add(node.language)
                }
            }

            if (node.children) {
                node.children.forEach(traverse)
            }
        }

        nodes.forEach(traverse)

        return {
            fileCount,
            totalLines,
            size,
            languages: Array.from(languages)
        }
    }

    async getProject(id: string): Promise<Project | undefined> {
        return store.getProject(id)
    }

    async deleteProject(id: string): Promise<void> {
        const project = store.getProject(id)
        if (project) {
            // Remove from disk
            try {
                await fs.rm(project.path, { recursive: true, force: true })
            } catch (error) {
                console.error(`Failed to delete project files for ${id}:`, error)
            }
            // Remove from store
            store.deleteProject(id)
        }
    }
}

export const projectService = new ProjectService()
