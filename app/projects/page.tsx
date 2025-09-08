'use client'

import { useState, useEffect } from 'react'
import { projectStorage, Project } from '../lib/storage/projectStorage'
import { formatFileSize } from '../utils/fileHelpers'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const allProjects = await projectStorage.getAllProjects()
      setProjects(allProjects)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectStorage.deleteProject(id)
        await loadProjects()
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  const exportProject = (project: Project) => {
    const json = projectStorage.exportProjectAsJSON(project)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '_')}_export.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <h1 className="text-xl font-bold text-white">ContextViber</h1>
              </a>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/projects" className="text-white font-medium">Projects</a>
              <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition">
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
          <p className="text-gray-400">Manage and access your saved context packages</p>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition flex items-center gap-2"
          >
            <span>+</span> New Project
          </a>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              Create First Project
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white truncate">{project.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        exportProject(project)
                      }}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                      title="Export"
                    >
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProject(project.id)
                      }}
                      className="p-2 bg-white/10 rounded-lg hover:bg-red-500/20 transition"
                      title="Delete"
                    >
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description provided'}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Files</span>
                    <span className="text-gray-300">{project.metadata?.fileCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size</span>
                    <span className="text-gray-300">
                      {formatFileSize(project.metadata?.totalSize || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tokens</span>
                    <span className="text-gray-300">{project.tokenCount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500">
                    Updated {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setSelectedProject(null)}>
            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Project Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Files</span>
                      <span className="text-white">{selectedProject.metadata?.fileCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Size</span>
                      <span className="text-white">{formatFileSize(selectedProject.metadata?.totalSize || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Count</span>
                      <span className="text-white">{selectedProject.tokenCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Timestamps</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-white">{formatDate(selectedProject.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Updated</span>
                      <span className="text-white">{formatDate(selectedProject.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProject.fileTree && (
                <div className="bg-black/30 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">File Structure</h3>
                  <pre className="text-green-400 font-mono text-xs overflow-x-auto">
                    {selectedProject.fileTree}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Navigate to dashboard with this project loaded
                    window.location.href = `/dashboard?project=${selectedProject.id}`
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition"
                >
                  Open in Dashboard
                </button>
                <button
                  onClick={() => exportProject(selectedProject)}
                  className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedProject.fileTree || '')
                    alert('File tree copied to clipboard!')
                  }}
                  className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition"
                >
                  Copy Tree
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}