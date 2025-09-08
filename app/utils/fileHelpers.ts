// File processing utilities

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  children?: FileNode[]
}

export interface ProjectStats {
  totalFiles: number
  totalSize: number
  fileTypes: Map<string, number>
  largestFile: { name: string; size: number }
}

// Build hierarchical file structure from flat file list
export function buildFileTree(files: File[]): FileNode {
  const root: FileNode = {
    name: 'root',
    path: '',
    type: 'directory',
    children: []
  }

  files.forEach(file => {
    const path = file.webkitRelativePath || file.name
    const parts = path.split('/')
    let current = root

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        current.children = current.children || []
        current.children.push({
          name: part,
          path: path,
          type: 'file',
          size: file.size
        })
      } else {
        // It's a directory
        current.children = current.children || []
        let dir = current.children.find(
          child => child.type === 'directory' && child.name === part
        )
        
        if (!dir) {
          dir = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: 'directory',
            children: []
          }
          current.children.push(dir)
        }
        current = dir
      }
    })
  })

  return root
}

// Generate ASCII tree representation
export function generateAsciiTree(node: FileNode, prefix = '', isLast = true): string {
  if (node.type === 'file') {
    const fileSize = node.size ? ` (${formatFileSize(node.size)})` : ''
    return prefix + (isLast ? '└── ' : '├── ') + node.name + fileSize + '\n'
  }

  let result = ''
  if (node.name !== 'root') {
    result = prefix + (isLast ? '└── ' : '├── ') + node.name + '/\n'
    prefix += isLast ? '    ' : '│   '
  }

  const children = node.children || []
  children.forEach((child, index) => {
    const isLastChild = index === children.length - 1
    result += generateAsciiTree(child, prefix, isLastChild)
  })

  return result
}

// Calculate project statistics
export function calculateProjectStats(files: File[]): ProjectStats {
  const stats: ProjectStats = {
    totalFiles: files.length,
    totalSize: 0,
    fileTypes: new Map(),
    largestFile: { name: '', size: 0 }
  }

  files.forEach(file => {
    // Total size
    stats.totalSize += file.size

    // File types
    const ext = getFileExtension(file.name)
    stats.fileTypes.set(ext, (stats.fileTypes.get(ext) || 0) + 1)

    // Largest file
    if (file.size > stats.largestFile.size) {
      stats.largestFile = { name: file.name, size: file.size }
    }
  })

  return stats
}

// Format file size to human readable
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

// Get file extension
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : 'no-ext'
}

// Estimate tokens (simplified - use proper tokenizer in production)
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  // This is a simplified version. In production, use tiktoken or similar
  return Math.ceil(text.length / 4)
}

// Filter files by extension
export function filterFilesByExtension(files: File[], extensions: string[]): File[] {
  return files.filter(file => {
    const ext = getFileExtension(file.name)
    return extensions.includes(ext)
  })
}

// Sort files by size
export function sortFilesBySize(files: File[], descending = true): File[] {
  return [...files].sort((a, b) => {
    return descending ? b.size - a.size : a.size - b.size
  })
}

// Check if file should be excluded
export function shouldExcludeFile(filename: string): boolean {
  const excludePatterns = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.DS_Store',
    'Thumbs.db',
    '.env.local',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml'
  ]
  
  return excludePatterns.some(pattern => filename.includes(pattern))
}

// Generate context package for AI
export function generateContextPackage(files: File[], options = {}): string {
  const tree = buildFileTree(files)
  const stats = calculateProjectStats(files)
  
  let context = `# Project Context\n\n`
  context += `## Statistics\n`
  context += `- Total Files: ${stats.totalFiles}\n`
  context += `- Total Size: ${formatFileSize(stats.totalSize)}\n`
  context += `- Largest File: ${stats.largestFile.name} (${formatFileSize(stats.largestFile.size)})\n\n`
  
  context += `## File Types\n`
  stats.fileTypes.forEach((count, type) => {
    context += `- ${type}: ${count} files\n`
  })
  
  context += `\n## File Structure\n\`\`\`\n`
  context += generateAsciiTree(tree)
  context += `\`\`\`\n`
  
  return context
}