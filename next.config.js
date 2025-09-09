/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Modeを有効化（開発時のバグ検出）
  reactStrictMode: true,
  
  // SWCによる高速ビルド
  swcMinify: true,
  
  // 画像最適化の設定
  images: {
    domains: ['localhost', 'contextviber.vercel.app'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  // 拡張性を考慮した設定
  env: {
    // 環境変数をここに追加可能
    NEXT_PUBLIC_APP_VERSION: '0.5.0-beta',
    NEXT_PUBLIC_MAX_FILE_SIZE: '10485760', // 10MB in bytes
  },
  

  
  // ヘッダー設定（セキュリティ）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },
  
  // Vercelでのビルド最適化
  experimental: {
    // 実験的機能は使わない（安定性重視）
  },
  
  // TypeScript設定
  typescript: {
    // ビルド時の型エラーを無視しない
    ignoreBuildErrors: false,
  },
  
  // ESLint設定
  eslint: {
    // ビルド時のESLintエラーを無視しない
    ignoreDuringBuilds: false,
  }
}

module.exports = nextConfig