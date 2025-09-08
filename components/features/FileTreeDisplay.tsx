'use client'

import { useState, useEffect } from 'react'

interface FileTreeDisplayProps {
  files: File[]
  onTreeGenerated: (tree: string) => void
}

export default function FileTreeDisplay({ files, onTreeGenerated }: FileTreeDisplayProps) {
  const [tree, setTree] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (files.length > 0) {
      generateTree()
    }
  }, [files])

  const generateTree = () => {
    // Build file structure
    const structure: any = {}
    
    files.forEach(file => {
      const path = file.webkitRelativePath || file.name
      const parts = path.split('/')
      
      let current = structure
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[`📄 ${part}`] = null
        } else {
          // It's a directory
          if (!current[`📁 ${part}`]) {
            current[`📁 ${part}`] = {}
          }
          current = current[`📁 ${part}`]
        }
      })
    })

    // Convert to tree string
    const treeString = buildTreeString(structure)
    setTree(treeString)
    onTreeGenerated(treeString)
  }

  const buildTreeString = (obj: any, prefix = '', isLast = true): string => {
    const entries = Object.entries(obj)
    let result = ''
    
    entries.forEach(([key, value], index) => {
      const isLastItem = index === entries.length - 1
      const connector = isLastItem ? '└── ' : '├── '
      const extension = isLastItem ? '    ' : '│   '
      
      result += prefix + connector + key + '\n'
      
      if (value && typeof value === 'object') {
        result += buildTreeString(value, prefix + extension, isLastItem)
      }
    })
    
    return result
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tree)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-400">No files uploaded yet</p>
        <p className="text-gray-500 text-sm mt-2">Upload files to generate a tree structure</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Generated Tree</h3>
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-lg transition ${
            copied
              ? 'bg-green-500/20 text-green-300'
              : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy Tree'}
        </button>
      </div>
      
      <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 font-mono text-sm whitespace-pre">
          {tree || 'Generating tree...'}
        </pre>
      </div>
      
      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition">
          🔄 Regenerate
        </button>
        <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition">
          ⚙️ Options
        </button>
      </div>
    </div>
  )
}