'use client'

import { useState, useEffect } from 'react'

interface TokenCounterProps {
  files: File[]
  onCountUpdate: (count: number) => void
}

export default function TokenCounter({ files, onCountUpdate }: TokenCounterProps) {
  const [tokenCount, setTokenCount] = useState(0)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [isCalculating, setIsCalculating] = useState(false)

  const models = [
    { id: 'gpt-4', name: 'GPT-4', pricePerK: 0.03 },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', pricePerK: 0.002 },
    { id: 'claude-3', name: 'Claude 3 Opus', pricePerK: 0.015 },
    { id: 'claude-instant', name: 'Claude Instant', pricePerK: 0.0008 }
  ]

  useEffect(() => {
    if (files.length > 0) {
      calculateTokens()
    }
  }, [files, selectedModel])

  const calculateTokens = async () => {
    setIsCalculating(true)
    
    // Simple token estimation (roughly 1 token per 4 characters)
    let totalCharacters = 0
    
    for (const file of files) {
      const text = await file.text()
      totalCharacters += text.length
    }
    
    const estimatedTokens = Math.ceil(totalCharacters / 4)
    setTokenCount(estimatedTokens)
    onCountUpdate(estimatedTokens)
    setIsCalculating(false)
  }

  const getCurrentModel = () => models.find(m => m.id === selectedModel)
  const getCost = () => {
    const model = getCurrentModel()
    return ((tokenCount / 1000) * (model?.pricePerK || 0)).toFixed(4)
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <p className="text-gray-400">No files to analyze</p>
        <p className="text-gray-500 text-sm mt-2">Upload files to count tokens</p>
      </div>
    )
  }

  return (
    <div>
      {/* Model Selector */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm mb-2">Select AI Model</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
        >
          {models.map(model => (
            <option key={model.id} value={model.id} className="bg-gray-900">
              {model.name} (${model.pricePerK}/1K tokens)
            </option>
          ))}
        </select>
      </div>

      {/* Token Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Tokens</div>
          <div className="text-2xl font-bold text-white">
            {isCalculating ? (
              <span className="text-lg">Calculating...</span>
            ) : (
              tokenCount.toLocaleString()
            )}
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Estimated Cost</div>
          <div className="text-2xl font-bold text-green-400">
            ${getCost()}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-black/30 rounded-lg p-4 mb-6">
        <h4 className="text-white font-medium mb-3">Token Distribution</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Files analyzed</span>
            <span className="text-white">{files.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Average per file</span>
            <span className="text-white">
              {files.length > 0 ? Math.round(tokenCount / files.length).toLocaleString() : 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Context window usage</span>
            <span className="text-white">
              {((tokenCount / 128000) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <span>💡</span> Optimization Tips
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Remove comments to save ~20% tokens</li>
          <li>• Exclude test files for production context</li>
          <li>• Use file filtering to focus on relevant code</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button 
          onClick={calculateTokens}
          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition"
        >
          🔄 Recalculate
        </button>
        <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition">
          📊 Detailed Report
        </button>
      </div>
    </div>
  )
}