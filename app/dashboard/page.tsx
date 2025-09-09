'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { useConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { useCommonShortcuts } from '@/hooks/useKeyboardShortcuts';
import {
  formatBytes,
  formatRelativeTime,
  copyToClipboard,
  downloadFile,
  cn
} from '@/utils/helpers';

// Example Dashboard component using all improvements
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const { showConfirmation, ConfirmationDialogComponent } = useConfirmationDialog();
  
  // Enable keyboard shortcuts
  useCommonShortcuts();
  
  // Example: Load projects
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example data
      const mockProjects = [
        {
          id: '1',
          name: 'ContextViber',
          size: 1024000,
          createdAt: new Date(Date.now() - 86400000),
          files: 42,
        },
        {
          id: '2',
          name: 'Another Project',
          size: 2048000,
          createdAt: new Date(Date.now() - 172800000),
          files: 78,
        },
      ];
      
      setProjects(mockProjects);
      showSuccess('Projects loaded successfully!');
    } catch (error) {
      showError('Failed to load projects. Please try again.');
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProject = (projectId: string, projectName: string) => {
    showConfirmation({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${projectName}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      confirmWithInput: projectName, // User must type project name to confirm
      onConfirm: async () => {
        try {
          // Simulated deletion
          await new Promise(resolve => setTimeout(resolve, 500));
          setProjects(prev => prev.filter(p => p.id !== projectId));
          showSuccess(`Project "${projectName}" deleted successfully`);
        } catch (error) {
          showError('Failed to delete project');
        }
      },
    });
  };
  
  const handleExportProject = async (project: any) => {
    try {
      const content = JSON.stringify(project, null, 2);
      downloadFile(content, `${project.name}.json`, 'application/json');
      showSuccess('Project exported successfully!');
    } catch (error) {
      showError('Failed to export project');
    }
  };
  
  const handleCopyToClipboard = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showInfo('Copied to clipboard!');
    } else {
      showError('Failed to copy to clipboard');
    }
  };
  
  const handleCreateProject = () => {
    showWarning('Project creation feature coming soon!');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text">
              ContextViber Dashboard
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleCreateProject}
                data-shortcut="upload"
                className="btn-primary"
              >
                + New Project
              </button>
              <button
                onClick={loadProjects}
                className="btn-secondary"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Tips */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Pro Tip:</strong> Use keyboard shortcuts for faster navigation. 
            Press <kbd className="px-2 py-1 bg-white rounded text-xs">Shift + ?</kbd> to see all shortcuts.
          </p>
        </div>
        
        {/* Projects Grid */}
        <LoadingOverlay isLoading={isLoading} text="Loading projects...">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card-hover group animate-scale-in"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleExportProject(project)}
                      className="text-gray-500 hover:text-purple-600"
                      title="Export"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard(project.id)}
                      className="text-gray-500 hover:text-blue-600"
                      title="Copy ID"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Files:</span>
                    <span className="font-medium">{project.files}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{formatBytes(project.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{formatRelativeTime(project.createdAt)}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full btn-primary text-sm">
                    Open Project
                  </button>
                </div>
              </div>
            ))}
            
            {/* Empty State */}
            {!isLoading && projects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first project to get started
                </p>
                <button
                  onClick={handleCreateProject}
                  className="btn-primary"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        </LoadingOverlay>
      </main>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialogComponent />
    </div>
  );
}