'use client';
import React,{useState,useEffect}from 'react';
import {AppLayout}from '@/components/layout/AppLayout';
import FileUploader from '@/components/features/FileUploader';
import FileTreeDisplay from '@/components/features/FileTreeDisplay';
import TokenCounter from '@/components/features/TokenCounter';
import StatusGenerator from '@/components/features/StatusGenerator';
import {AIAssistant}from '@/components/features/AIAssistant';
import {useToast}from '@/components/ui/ToastProvider';
import {LoadingSpinner,LoadingOverlay}from '@/components/ui/LoadingSpinner';
import {useConfirmationDialog}from '@/components/ui/ConfirmationDialog';
import {useCommonShortcuts}from '@/hooks/useKeyboardShortcuts';
import {formatBytes,formatRelativeTime,copyToClipboard,downloadFile,}from '@/utils/helpers';
import {projectStorage}from '@/app/lib/storage/projectStorage';

export default function DashboardPage(){
  const[activeTab,setActiveTab]=useState<'upload'|'tree'|'tokens'|'status'|'ai'>('upload');
  const[uploadedFiles,setUploadedFiles]=useState<File[]>([]);
  const[projectName,setProjectName]=useState('My Project');
  const[fileTree,setFileTree]=useState('');
  const[tokenCount,setTokenCount]=useState(0);
  const[isLoading,setIsLoading]=useState(false);
  const[savedProjects,setSavedProjects]=useState<any[]>([]);
  const {showSuccess,showInfo,showError,showWarning}=useToast();
  const {showConfirmation,ConfirmationDialogComponent}=useConfirmationDialog();
  
  useCommonShortcuts();
  
  const tabs=[
    {id:'upload',label:'Upload Files',icon:'📁'},
    {id:'tree',label:'File Tree',icon:'🌳'},
    {id:'tokens',label:'Token Counter',icon:'🔢'},
    {id:'status',label:'Status Gen',icon:'📊'},
    {id:'ai',label:'AI Assistant',icon:'🤖'},
  ];
  
  useEffect(()=>{
    loadSavedProjects();
    showInfo('Welcome to ContextViber Dashboard!');
  },[]);
  
  const loadSavedProjects=async ()=>{
    try {
      const projects=await projectStorage.getAllProjects();
      setSavedProjects(projects);
    }catch (error){
      console.error('Failed to load projects:',error);
    }
  };
  
  const handleFilesUploaded=(files:File[])=>{
    setUploadedFiles(files);
    showSuccess(`${files.length} files uploaded successfully!`);
    const packageJson=files.find(f=>f.name==='package.json');
    if (packageJson){
      packageJson.text().then(content=>{
        try {
          const pkg=JSON.parse(content);
          if (pkg.name){
            setProjectName(pkg.name);
            showInfo(`Project name detected: ${pkg.name}`);
          }
        }catch (e){
          console.error('Failed to parse package.json:',e);
        }
      });
    }
  };
  
  const handleSaveProject=async ()=>{
    if (uploadedFiles.length===0){
      showWarning('No files to save. Please upload files first.');
      return;
    }
    setIsLoading(true);
    try {
      const serializedFiles=await projectStorage.serializeFiles(uploadedFiles);
      
      const project={
        id:projectStorage.generateProjectId(),
        name:projectName,
        description:'',
        files:serializedFiles,
        fileTree:fileTree,
        tokenCount:tokenCount,
        createdAt:new Date(),
        updatedAt:new Date(),
        metadata:{
          totalSize:uploadedFiles.reduce((sum,f)=>sum+f.size,0),
          fileCount:uploadedFiles.length,
        }
      };
      
      await projectStorage.saveProject(project);
      await loadSavedProjects();
      showSuccess(`Project "${projectName}" saved successfully!`);
    }catch (error){
      showError('Failed to save project. Please try again.');
      console.error('Save error:',error);
    }finally {
      setIsLoading(false);
    }
  };
  
  const handleExportAll=async ()=>{
    if (uploadedFiles.length===0){
      showWarning('No files to export. Please upload files first.');
      return;
    }
    try {
      const exportData={
        projectName,
        exportDate:new Date().toISOString(),
        files:uploadedFiles.map(f=>({
          name:f.name,
          size:f.size,
          type:f.type,
        })),
        fileCount:uploadedFiles.length,
        totalSize:uploadedFiles.reduce((sum,f)=>sum+f.size,0),
        fileTree:fileTree,
        tokenCount:tokenCount,
      };
      const content=JSON.stringify(exportData,null,2);
      downloadFile(content,`${projectName}-export.json`,'application/json');
      showSuccess('Project exported successfully!');
    }catch (error){
      showError('Failed to export project');
      console.error('Export error:',error);
    }
  };
  
  const handleClearAll=()=>{
    showConfirmation({
      title:'Clear Workspace',
      message:'Are you sure you want to clear all files? This action cannot be undone.',
      type:'warning',
      confirmText:'Clear All',
      onConfirm:async ()=>{
        setUploadedFiles([]);
        setProjectName('My Project');
        setFileTree('');
        setTokenCount(0);
        setActiveTab('upload');
        showInfo('Workspace cleared');
      },
    });
  };
  
  const handleTreeGenerated=(tree:string)=>{
    setFileTree(tree);
    console.log('Tree generated:',tree);
  };
  
  const handleTokenCountUpdate=(count:number)=>{
    setTokenCount(count);
    console.log('Token count:',count);
  };
  
  return (
    <AppLayout>
      <LoadingOverlay isLoading={isLoading}text="Processing...">
        <div className="space-y-6">
          {}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Manage your AI context and generate optimized packages
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Files uploaded:</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                  {uploadedFiles.length}
                </span>
              </div>
            </div>
          </div>
          
          {}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab)=>(
                  <button 
                    key={tab.id}
                    onClick={()=>setActiveTab(tab.id as any)}
                    className={`
                      flex-1 py-4 px-6 text-center font-medium text-sm transition-all
                      ${activeTab === tab.id
                        ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    data-shortcut={tab.id==='upload' ? 'upload':undefined}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {}
            <div className="p-6">
              {}
              {activeTab==='upload'&&(
                <FileUploader onFilesSelected={handleFilesUploaded}/>
              )}
              
              {}
              {activeTab==='tree'&&(
                <FileTreeDisplay 
                  files={uploadedFiles}
                  onTreeGenerated={handleTreeGenerated}
                />
              )}
              
              {}
              {activeTab==='tokens'&&(
                <TokenCounter 
                  files={uploadedFiles}
                  onCountUpdate={handleTokenCountUpdate}
                />
              )}
              
              {}
              {activeTab==='status'&&(
                <StatusGenerator 
                  files={uploadedFiles}
                  fileTree={fileTree}
                />
              )}
              
              {}
              {activeTab==='ai'&&(
                <AIAssistant 
                  files={uploadedFiles.map(f=>({
                    name:f.name,
                    content:'',
                    type:f.type,
                  }))}
                  projectName={projectName}
                  isProUser={false}
                />
              )}
            </div>
          </div>
          
          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleSaveProject}
              data-shortcut="save" 
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="text-purple-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                💾
              </div>
              <div className="font-semibold text-gray-900">Save Project</div>
              <div className="text-sm text-gray-600">Store in browser</div>
            </button>
            
            <button 
              onClick={handleExportAll}
              data-shortcut="export" 
              className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="text-blue-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                📤
              </div>
              <div className="font-semibold text-gray-900">Export All</div>
              <div className="text-sm text-gray-600">Download package</div>
            </button>
            
            <button 
              onClick={handleClearAll}
              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="text-green-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                🔄
              </div>
              <div className="font-semibold text-gray-900">Clear All</div>
              <div className="text-sm text-gray-600">Reset workspace</div>
            </button>
          </div>
          
          {}
          {savedProjects.length>0&&(
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedProjects.slice(0,3).map((project)=>(
                  <div 
                    key={project.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.files?.length||0} files • {formatRelativeTime(project.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </LoadingOverlay>
      
      {}
      <ConfirmationDialogComponent/>
    </AppLayout>
  );
}