'use client'

import { useState, useEffect } from 'react'
import FileUploader from '../../components/features/FileUploader'
import FileTreeDisplay from '../../components/features/FileTreeDisplay'
import TokenCounter from '../../components/features/TokenCounter'
import StatusGenerator from '../../components/features/StatusGenerator'
import { projectStorage } from '../lib/storage/projectStorage'
import { 
  copyToClipboard, 
  exportAsMarkdown, 
  exportAsJSON, 
  generateAIContext 
} from '../utils/exportHelpers'
import {
  buildFileTree,
  generateAsciiTree
} from '../utils/fileHelpers'

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState('upload')
  const [fileTree, setFileTree] = useState('')
  const [tokenCount, setTokenCount] = useState(0)
  const [projectName, setProjectName] = useState('Untitled Project')
  const [projectDescription, setProjectDescription] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [copyStatus, setCopyStatus] = useState(false)

  // Load project if ID is in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const projectId = params.get('project')
    if (projectId) {
      loadProject(projectId)
    }
  }, [])

  const loadProject = async (id: string) => {
    try {
      const project = await projectStorage.getProject(id)
      if (project) {
        setProjectName(project.name)
        setProjectDescription(project.description)
        setFileTree(project.fileTree)
        setTokenCount(project.tokenCount)
        // Note: Actual files can't be restored, only metadata
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }

  // ファイルアップロード時の自動処理
  const handleFilesSelected = async (newFiles: File[]) => {
    setFiles(newFiles)
    
    // プロジェクト名を自動推測
    if (newFiles.length > 0) {
      // package.jsonを探す
      const packageJson = newFiles.find(f => f.name === 'package.json')
      if (packageJson) {
        try {
          const content = await packageJson.text()
          const pkg = JSON.parse(content)
          if (pkg.name) {
            setProjectName(pkg.name)
          }
        } catch (e) {
          // package.json読み込みエラーは無視
        }
      }
      
      // ファイルツリーを自動生成
      const tree = buildFileTree(newFiles)
      const asciiTree = generateAsciiTree(tree)
      setFileTree(asciiTree)
      
      // トークン数を自動計算（最初の10ファイルのみサンプリング）
      let totalChars = 0
      const textFileExtensions = /\.(ts|tsx|js|jsx|json|md|txt|css|scss|html|xml|yaml|yml)$/
      
      for (const file of newFiles) {
        if (file.type.startsWith('text/') || file.name.match(textFileExtensions)) {
          try {
            // 100KB以下のファイルのみ読み込む
            if (file.size < 100 * 1024) {
              const text = await file.text()
              totalChars += text.length
            } else {
              // 大きいファイルは推定
              totalChars += file.size * 0.7 // バイト数の70%を文字数と推定
            }
          } catch (e) {
            // ファイル読み込みエラーは無視
          }
        }
      }
      
      const estimatedTokens = Math.ceil(totalChars / 4)
      setTokenCount(estimatedTokens)
    }
  }

  const handleCopyToClipboard = async () => {
    const context = generateAIContext({
      projectName,
      projectDescription,
      files,
      fileTree,
      tokenCount
    })
    
    const success = await copyToClipboard(context)
    if (success) {
      setCopyStatus(true)
      setTimeout(() => setCopyStatus(false), 2000)
    }
  }

  const handleExportMarkdown = () => {
    exportAsMarkdown({
      projectName,
      projectDescription,
      files,
      fileTree,
      tokenCount
    })
  }

  const handleExportJSON = () => {
    exportAsJSON({
      projectName,
      projectDescription,
      files,
      fileTree,
      tokenCount
    })
  }

  const saveProject = async () => {
    setSaveStatus('saving')
    try {
      const serializedFiles = await projectStorage.serializeFiles(files)
      const project = {
        id: projectStorage.generateProjectId(),
        name: projectName,
        description: projectDescription,
        files: serializedFiles,
        fileTree,
        tokenCount,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          totalSize: files.reduce((acc, file) => acc + file.size, 0),
          fileCount: files.length,
          lastAnalysis: new Date()
        }
      }
      
      await projectStorage.saveProject(project)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save project:', error)
      setSaveStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-xl font-bold text-white">ContextViber</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
              <a href="/projects" className="text-gray-300 hover:text-white transition">Projects</a>
              <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition">
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'upload', label: 'Upload Files', icon: '📁' },
            { id: 'tree', label: 'File Tree', icon: '🌳' },
            { id: 'tokens', label: 'Token Counter', icon: '🏷️' },
            { id: 'status', label: 'Status Generator', icon: '📝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Main Work Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 min-h-[600px]">
              {activeTab === 'upload' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Upload Your Project Files</h2>
                  <p className="text-gray-400 mb-6">
                    Drag and drop your project folder or select files to analyze
                  </p>
                  <FileUploader onFilesSelected={handleFilesSelected} />
                  
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Selected Files ({files.length})
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-300 text-sm truncate">{file.name}</span>
                            <span className="text-gray-500 text-xs">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tree' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">File Tree Generator</h2>
                  <p className="text-gray-400 mb-6">
                    Generate an ASCII tree structure from your uploaded files
                  </p>
                  <FileTreeDisplay files={files} onTreeGenerated={setFileTree} />
                </div>
              )}

              {activeTab === 'tokens' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Token Counter</h2>
                  <p className="text-gray-400 mb-6">
                    Calculate token usage and estimate costs for AI models
                  </p>
                  <TokenCounter files={files} onCountUpdate={setTokenCount} />
                </div>
              )}

              {activeTab === 'status' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Status.md Generator</h2>
                  <p className="text-gray-400 mb-6">
                    Generate a comprehensive status document for your project
                  </p>
                  <StatusGenerator files={files} fileTree={fileTree} />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Info & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Files Uploaded</span>
                  <span className="text-white font-medium">{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Size</span>
                  <span className="text-white font-medium">
                    {(files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token Count</span>
                  <span className="text-white font-medium">{tokenCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Management</h3>
              
              {/* Project Name Input */}
              <div className="mb-3">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
                  placeholder="Project name..."
                />
              </div>
              
              {/* Save Button */}
              <button
                onClick={saveProject}
                disabled={files.length === 0 || saveStatus === 'saving'}
                className={`w-full px-4 py-2 rounded-lg transition mb-3 ${
                  saveStatus === 'saved' 
                    ? 'bg-green-500/20 text-green-300'
                    : saveStatus === 'saving'
                    ? 'bg-purple-500/30 text-purple-300 opacity-50'
                    : files.length === 0
                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                }`}
              >
                {saveStatus === 'saved' ? '✓ Saved!' : saveStatus === 'saving' ? 'Saving...' : '💾 Save Project'}
              </button>

              <div className="space-y-3">
                <button 
                  onClick={handleCopyToClipboard}
                  disabled={files.length === 0}
                  className={`w-full px-4 py-2 rounded-lg transition ${
                    copyStatus
                      ? 'bg-green-500/20 text-green-300'
                      : files.length === 0
                      ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  {copyStatus ? '✓ Copied!' : '📋 Copy to Clipboard'}
                </button>
                <button 
                  onClick={handleExportMarkdown}
                  disabled={files.length === 0}
                  className={`w-full px-4 py-2 rounded-lg transition ${
                    files.length === 0
                      ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  💾 Download as Markdown
                </button>
                <button 
                  onClick={handleExportJSON}
                  disabled={files.length === 0}
                  className={`w-full px-4 py-2 rounded-lg transition ${
                    files.length === 0
                      ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  📦 Export as JSON
                </button>
              </div>
            </div>

            {/* Pro Features */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Pro Features</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                  Upgrade
                </span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-purple-400">✨</span> AI-Powered Analysis
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-purple-400">🤖</span> Claude Integration
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-purple-400">📊</span> Advanced Metrics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}