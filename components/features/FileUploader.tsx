'use client'

import { useState, useRef, DragEvent } from 'react'

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
}

interface FileValidationResult {
  valid: File[]
  excluded: { file: File; reason: string }[]
  warnings: string[]
}

export default function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [validationReport, setValidationReport] = useState<FileValidationResult | null>(null)
  const [showReport, setShowReport] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Patterns to exclude
  const excludePatterns = [
    // Package managers
    'node_modules',
    'vendor',
    'bower_components',
    '.pnpm',
    '.yarn',
    
    // Build outputs
    '.next',
    'dist',
    'build',
    'out',
    '.cache',
    'coverage',
    
    // Version control
    '.git',
    '.svn',
    '.hg',
    
    // IDE
    '.vscode',
    '.idea',
    '.vs',
    
    // OS files
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini',
    
    // Lock files (large)
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'composer.lock',
    'Gemfile.lock',
    
    // Sensitive files
    '.env',
    '.env.local',
    '.env.production',
    '.env.development',
    'secrets.json',
    'credentials.json',
    'private.key',
    '.pem',
    '.key',
    '.cert',
    '.p12',
    '.pfx'
  ]

  // Check if content contains potential secrets
  const containsPotentialSecret = async (file: File): Promise<boolean> => {
    // Only check text files under 1MB
    if (file.size > 1024 * 1024 || !file.type.startsWith('text/')) {
      return false
    }

    try {
      const content = await file.text()
      
      // Patterns that might indicate secrets
      const secretPatterns = [
        /(?:api[_-]?key|apikey|api_secret|secret[_-]?key|private[_-]?key|access[_-]?token|auth[_-]?token|bearer)\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{20,}/gi,
        /(?:password|passwd|pwd)\s*[:=]\s*['"]?.{8,}/gi,
        /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/,
        /[a-zA-Z0-9+\/]{40,}={0,2}/, // Base64 encoded strings
        /[a-f0-9]{64}/i, // SHA256 hashes
        /sk_live_[a-zA-Z0-9]{24,}/, // Stripe keys
        /AIza[0-9A-Za-z_-]{35}/, // Google API keys
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, // UUIDs
      ]

      // Check for random character sequences (potential keys)
      const randomPatterns = /[a-zA-Z0-9]{32,}/g
      const matches = content.match(randomPatterns)
      
      if (matches) {
        for (const match of matches) {
          // Check entropy (randomness) of the string
          const entropy = calculateEntropy(match)
          if (entropy > 4.5) { // High entropy suggests random/encrypted content
            return true
          }
        }
      }

      // Check against secret patterns
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          return true
        }
      }
    } catch (error) {
      console.error('Error checking file content:', error)
    }

    return false
  }

  // Calculate Shannon entropy
  const calculateEntropy = (str: string): number => {
    const len = str.length
    const frequencies: { [key: string]: number } = {}
    
    for (const char of str) {
      frequencies[char] = (frequencies[char] || 0) + 1
    }
    
    let entropy = 0
    for (const freq of Object.values(frequencies)) {
      const p = freq / len
      entropy -= p * Math.log2(p)
    }
    
    return entropy
  }

  const validateFiles = async (files: File[]): Promise<FileValidationResult> => {
    const result: FileValidationResult = {
      valid: [],
      excluded: [],
      warnings: []
    }

    for (const file of files) {
      const path = file.webkitRelativePath || file.name
      
      // Check if file should be excluded
      let shouldExclude = false
      let excludeReason = ''

      // Check against exclude patterns
      for (const pattern of excludePatterns) {
        if (path.toLowerCase().includes(pattern.toLowerCase())) {
          shouldExclude = true
          excludeReason = `Excluded pattern: ${pattern}`
          break
        }
      }

      // Check file extension for common binary/large files
      const binaryExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.exe', '.dll', '.so', '.dylib', '.bin', '.dat', '.db', '.sqlite']
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      if (binaryExtensions.includes(ext)) {
        shouldExclude = true
        excludeReason = `Binary/Archive file: ${ext}`
      }

      // Check file size (exclude files > 10MB)
      if (file.size > 10 * 1024 * 1024) {
        shouldExclude = true
        excludeReason = `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      }

      // Check for potential secrets
      if (!shouldExclude && await containsPotentialSecret(file)) {
        shouldExclude = true
        excludeReason = 'Potential secret/key detected'
        result.warnings.push(`⚠️ ${file.name} was excluded due to potential sensitive content`)
      }

      if (shouldExclude) {
        result.excluded.push({ file, reason: excludeReason })
      } else {
        result.valid.push(file)
      }
    }

    // Add summary warnings
    if (result.excluded.length > 0) {
      result.warnings.push(`📊 ${result.excluded.length} files were excluded for security/performance`)
    }

    if (result.valid.length === 0 && files.length > 0) {
      result.warnings.push('⚠️ All files were excluded. Try uploading source code files only.')
    }

    return result
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const items = e.dataTransfer.items
    const files: File[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry) {
          const entryFiles = await traverseFileTree(entry)
          files.push(...entryFiles)
        }
      }
    }

    if (files.length > 0) {
      const validation = await validateFiles(files)
      setValidationReport(validation)
      setShowReport(true)
      
      if (validation.valid.length > 0) {
        onFilesSelected(validation.valid)
      }
    }
  }

  const traverseFileTree = async (entry: any): Promise<File[]> => {
    const files: File[] = []
    
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        entry.file((file: File) => resolve(file))
      })
      files.push(file)
    } else if (entry.isDirectory) {
      // Skip certain directories entirely
      const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build', 'vendor']
      if (skipDirs.some(dir => entry.name.toLowerCase() === dir.toLowerCase())) {
        return files
      }

      const reader = entry.createReader()
      const entries = await new Promise<any[]>((resolve) => {
        reader.readEntries((entries: any[]) => resolve(entries))
      })
      
      for (const childEntry of entries) {
        const childFiles = await traverseFileTree(childEntry)
        files.push(...childFiles)
      }
    }
    
    return files
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const validation = await validateFiles(files)
      setValidationReport(validation)
      setShowReport(true)
      
      if (validation.valid.length > 0) {
        onFilesSelected(validation.valid)
      }
    }
  }

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/20 hover:border-white/40 bg-white/5'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          webkitdirectory=""
          onChange={handleFileSelect}
          className="hidden"
          {...{ directory: "", mozdirectory: "" } as any}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isDragging ? 'bg-purple-500' : 'bg-white/10'
          }`}>
            <svg
              className={`w-10 h-10 transition-all ${
                isDragging ? 'text-white scale-110' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragging ? 'Drop your files here!' : 'Drag & Drop Your Project'}
            </h3>
            <p className="text-gray-400 mb-4">
              Drop files or folders here, or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              Select Files
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            Supported: Source code files • Max: 10MB per file • Auto-excludes: node_modules, secrets
          </div>
        </div>
      </div>

      {/* Validation Report */}
      {showReport && validationReport && (
        <div className="mt-6 bg-black/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-medium">Upload Report</h4>
            <button
              onClick={() => setShowReport(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* Warnings */}
          {validationReport.warnings.length > 0 && (
            <div className="mb-3 space-y-1">
              {validationReport.warnings.map((warning, idx) => (
                <div key={idx} className="text-yellow-400 text-sm">
                  {warning}
                </div>
              ))}
            </div>
          )}
          
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Accepted:</span>
              <span className="text-green-400 ml-2">{validationReport.valid.length} files</span>
            </div>
            <div>
              <span className="text-gray-400">Excluded:</span>
              <span className="text-red-400 ml-2">{validationReport.excluded.length} files</span>
            </div>
          </div>
          
          {/* Show excluded files (first 5) */}
          {validationReport.excluded.length > 0 && (
            <details className="mt-3">
              <summary className="text-gray-400 text-sm cursor-pointer hover:text-white">
                View excluded files
              </summary>
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {validationReport.excluded.slice(0, 50).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-500">
                    {item.file.name} - {item.reason}
                  </div>
                ))}
                {validationReport.excluded.length > 50 && (
                  <div className="text-xs text-gray-600">
                    ...and {validationReport.excluded.length - 50} more
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  )
}