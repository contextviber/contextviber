// Project storage using IndexedDB

export interface Project {
  id: string
  name: string
  description: string
  files: SerializedFile[]
  fileTree: string
  tokenCount: number
  createdAt: Date
  updatedAt: Date
  metadata?: {
    totalSize: number
    fileCount: number
    lastAnalysis?: Date
  }
}

export interface SerializedFile {
  name: string
  path: string
  size: number
  content?: string
  type: string
}

class ProjectStorageManager {
  private dbName = 'ContextViberDB'
  private dbVersion = 1
  private storeName = 'projects'
  private db: IDBDatabase | null = null

  // Initialize IndexedDB
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create projects store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('name', 'name', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
          store.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }
    })
  }

  // Save project
  async saveProject(project: Project): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      project.updatedAt = new Date()
      const request = store.put(project)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save project'))
    })
  }

  // Get project by ID
  async getProject(id: string): Promise<Project | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)
      
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(new Error('Failed to get project'))
    })
  }

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(new Error('Failed to get projects'))
    })
  }

  // Delete project
  async deleteProject(id: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete project'))
    })
  }

  // Get recent projects
  async getRecentProjects(limit = 5): Promise<Project[]> {
    const projects = await this.getAllProjects()
    return projects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }

  // Search projects by name
  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.getAllProjects()
    const lowerQuery = query.toLowerCase()
    return projects.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
    )
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      }
    }
    return { used: 0, quota: 0 }
  }

  // Export project as JSON
  exportProjectAsJSON(project: Project): string {
    return JSON.stringify(project, null, 2)
  }

  // Import project from JSON
  async importProjectFromJSON(jsonString: string): Promise<Project> {
    try {
      const project = JSON.parse(jsonString)
      project.id = this.generateProjectId() // Generate new ID to avoid conflicts
      project.createdAt = new Date(project.createdAt)
      project.updatedAt = new Date()
      await this.saveProject(project)
      return project
    } catch (error) {
      throw new Error('Invalid project JSON')
    }
  }

  // Generate unique project ID
  generateProjectId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Serialize files for storage
  async serializeFiles(files: File[]): Promise<SerializedFile[]> {
    const serialized: SerializedFile[] = []
    
    for (const file of files) {
      // Only store text content for small files (< 100KB)
      let content: string | undefined
      if (file.size < 100 * 1024 && file.type.startsWith('text/')) {
        content = await file.text()
      }
      
      serialized.push({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        content
      })
    }
    
    return serialized
  }

  // Clear all projects (use with caution)
  async clearAllProjects(): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to clear projects'))
    })
  }
}

// Export singleton instance
export const projectStorage = new ProjectStorageManager()

// Utility functions for localStorage (for settings)
export const localStorageUtils = {
  // Save user preferences
  savePreferences(prefs: any): void {
    localStorage.setItem('contextviber_preferences', JSON.stringify(prefs))
  },

  // Get user preferences
  getPreferences(): any {
    const prefs = localStorage.getItem('contextviber_preferences')
    return prefs ? JSON.parse(prefs) : null
  },

  // Save recent activity
  saveRecentActivity(activity: any[]): void {
    localStorage.setItem('contextviber_recent', JSON.stringify(activity))
  },

  // Get recent activity
  getRecentActivity(): any[] {
    const activity = localStorage.getItem('contextviber_recent')
    return activity ? JSON.parse(activity) : []
  },

  // Track API usage
  trackApiUsage(tokens: number): void {
    const usage = this.getApiUsage()
    const today = new Date().toISOString().split('T')[0]
    
    if (!usage[today]) {
      usage[today] = { tokens: 0, requests: 0 }
    }
    
    usage[today].tokens += tokens
    usage[today].requests += 1
    
    localStorage.setItem('contextviber_api_usage', JSON.stringify(usage))
  },

  // Get API usage
  getApiUsage(): Record<string, { tokens: number; requests: number }> {
    const usage = localStorage.getItem('contextviber_api_usage')
    return usage ? JSON.parse(usage) : {}
  }
}