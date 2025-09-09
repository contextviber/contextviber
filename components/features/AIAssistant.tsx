'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * AI Assistant Component
 * 
 * Claude API統合のUIコンポーネント
 * 現在はPro版機能として表示のみ（モックモード）
 * 
 * 実装予定の機能:
 * - リアルタイムコード分析
 * - インテリジェント要約生成
 * - コンテキスト最適化
 * - 質問応答システム
 * - ドキュメント自動生成
 */

interface AIAssistantProps {
  files?: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  projectName?: string;
  isProUser?: boolean; // Pro版ユーザーかどうか
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  files = [],
  projectName = 'Current Project',
  isProUser = false, // デフォルトはfalse（無料ユーザー）
}) => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'ask' | 'generate'>('analyze');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [question, setQuestion] = useState('');
  const { showInfo, showWarning, showError } = useToast();
  
  /**
   * AI機能を実行
   * 現在はモックレスポンスを返す
   */
  const executeAIAction = async (action: string) => {
    // Pro版チェック（実装時はここでチェック）
    if (!isProUser) {
      showWarning('This feature requires a Pro subscription. Showing demo mode.');
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      // ========================================
      // 実装予定: 実際のAPI呼び出し
      // ========================================
      /*
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data: {
            files,
            projectName,
            prompt: question,
            options: {
              model: 'claude-3-haiku',
              maxTokens: 1000,
            },
          },
        }),
      });
      
      if (!res.ok) {
        throw new Error('AI request failed');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setResponse(data.data.summary || data.data.answer || data.data.documentation);
        showInfo(`Analysis complete! Used ${data.usage.tokens} tokens`);
      } else {
        throw new Error(data.error);
      }
      */
      
      // モックレスポンス（デモ用）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponses = {
        analyze: `
📊 **Project Analysis Results**

**Files Analyzed:** ${files.length}
**Project:** ${projectName}

**Key Findings:**
• Well-structured codebase with clear separation of concerns
• TypeScript usage detected but could be improved
• Good use of modern React patterns

**Recommendations:**
1. Add comprehensive error handling
2. Implement unit tests for critical functions
3. Consider adding loading states for better UX
4. Optimize bundle size with code splitting

**Security Status:** ✅ No critical issues found

*This is a demo response. Enable Claude API for real analysis.*
        `,
        ask: `
💬 **AI Response**

Based on your question: "${question}"

This is a demonstration of how the AI assistant would respond to your queries about the project. When the Claude API is enabled, you'll get:

• Context-aware answers based on your actual code
• Specific suggestions for your project
• Code examples tailored to your stack
• Best practices recommendations

*Upgrade to Pro for full AI capabilities.*
        `,
        generate: `
📝 **Generated Documentation**

\`\`\`markdown
# ${projectName} Documentation

## Overview
Your project contains ${files.length} files and appears to be a modern web application.

## Project Structure
- **/components** - React components
- **/lib** - Core business logic
- **/utils** - Helper functions
- **/app** - Next.js pages

## Getting Started
1. Install dependencies: \`npm install\`
2. Run development server: \`npm run dev\`
3. Build for production: \`npm run build\`

## Key Features
- File processing and analysis
- Token counting for AI models
- Export functionality
- Project management

*Full documentation generation available with Pro subscription.*
\`\`\`
        `,
      };
      
      setResponse(mockResponses[action as keyof typeof mockResponses] || 'Processing...');
      showInfo('Demo analysis complete! Upgrade to Pro for real AI analysis.');
      
    } catch (error) {
      console.error('AI Action Error:', error);
      showError('Failed to execute AI action. Please try again.');
      setResponse('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <p className="text-white/80 text-sm">Powered by Claude</p>
            </div>
          </div>
          {!isProUser && (
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
              PRO FEATURE
            </span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analyze'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔍 Analyze
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'ask'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Ask AI
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📝 Generate
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Analyze your project with AI to get insights, recommendations, and optimizations.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => executeAIAction('analyze')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">🎯 Full Analysis</div>
                <div className="text-sm text-gray-600">Complete project review</div>
              </button>
              <button
                onClick={() => executeAIAction('analyze')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">🔒 Security Check</div>
                <div className="text-sm text-gray-600">Find vulnerabilities</div>
              </button>
              <button
                onClick={() => executeAIAction('analyze')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">⚡ Performance</div>
                <div className="text-sm text-gray-600">Optimization tips</div>
              </button>
              <button
                onClick={() => executeAIAction('analyze')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">📊 Code Quality</div>
                <div className="text-sm text-gray-600">Best practices check</div>
              </button>
            </div>
          </div>
        )}
        
        {/* Ask Tab */}
        {activeTab === 'ask' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Ask questions about your code and get context-aware answers from Claude.
            </p>
            <div className="space-y-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about your project..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              <button
                onClick={() => executeAIAction('ask')}
                disabled={isLoading || !question.trim()}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Thinking...' : 'Ask Claude'}
              </button>
            </div>
          </div>
        )}
        
        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Generate documentation, tests, and other content using AI.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => executeAIAction('generate')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">📚 README</div>
                <div className="text-sm text-gray-600">Project documentation</div>
              </button>
              <button
                onClick={() => executeAIAction('generate')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">🧪 Tests</div>
                <div className="text-sm text-gray-600">Unit test generation</div>
              </button>
              <button
                onClick={() => executeAIAction('generate')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">📖 API Docs</div>
                <div className="text-sm text-gray-600">Endpoint documentation</div>
              </button>
              <button
                onClick={() => executeAIAction('generate')}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">💡 JSDoc</div>
                <div className="text-sm text-gray-600">Code comments</div>
              </button>
            </div>
          </div>
        )}
        
        {/* Response Area */}
        {(isLoading || response) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" text="Claude is thinking..." />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {response}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Pro Upgrade CTA */}
        {!isProUser && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">🚀 Unlock Full AI Power</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Get real-time code analysis, intelligent suggestions, and more with Pro.
                </p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};