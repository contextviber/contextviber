'use client';

import React, { useState } from 'react';
import { AIAssistant } from '@/components/features/AIAssistant';

/**
 * Enhanced Dashboard with AI Integration
 * 
 * このファイルは既存のダッシュボードにAI機能を統合する例です。
 * AIAssistantコンポーネントをインポートして使用するだけで
 * Claude AI機能を追加できます。
 * 
 * 使用方法:
 * 1. このコードを既存のdashboard/page.tsxに統合
 * 2. AIAssistantコンポーネントを配置
 * 3. ファイルデータを渡す
 * 4. Pro版フラグで機能を制御
 */

export default function EnhancedDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('My Project');
  const [showAI, setShowAI] = useState(false);
  
  // ========================================
  // 実装予定: ユーザーのPro版ステータスをチェック
  // ========================================
  /*
  const { data: session } = useSession();
  const [isProUser, setIsProUser] = useState(false);
  
  useEffect(() => {
    // APIでPro版ステータスを確認
    checkProStatus(session?.user?.id).then(setIsProUser);
  }, [session]);
  */
  
  const isProUser = false; // 現在は全員無料ユーザーとして扱う
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your projects and use AI features</p>
        </div>
        
        {/* AI Toggle Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {showAI ? 'Hide AI Assistant' : 'Show AI Assistant'}
            {!isProUser && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                PRO
              </span>
            )}
          </button>
        </div>
        
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Project Files</h2>
              
              {/* File upload area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Drop files here or click to upload
                </p>
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Select Files
                </button>
              </div>
              
              {/* Files list */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">{file.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Status Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Project Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Files:</span>
                  <span className="font-medium">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Features:</span>
                  <span className={`font-medium ${isProUser ? 'text-green-600' : 'text-gray-400'}`}>
                    {isProUser ? 'Enabled' : 'Pro Required'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Status:</span>
                  <span className="font-medium text-green-600">Ready</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            {showAI ? (
              <AIAssistant
                files={uploadedFiles}
                projectName={projectName}
                isProUser={isProUser}
              />
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Assistant Available
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get intelligent code analysis, automated documentation, and more with Claude AI.
                  </p>
                  <button
                    onClick={() => setShowAI(true)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    Activate AI Assistant
                  </button>
                  {!isProUser && (
                    <p className="mt-3 text-xs text-gray-500">
                      Pro subscription required for full features
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Feature Status Card */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">🤖 Claude AI Integration Status</h3>
              <p className="text-white/90">
                {isProUser 
                  ? 'All AI features are active and ready to use!'
                  : 'AI features are in demo mode. Upgrade to Pro for full access.'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {isProUser ? '✅' : '🔒'}
              </div>
              <p className="text-sm mt-1">
                {isProUser ? 'Active' : 'Demo Mode'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};