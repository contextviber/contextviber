// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 拡張性を考慮した設定
  reactStrictMode: true,
  swcMinify: true,
  
  // 画像の最適化設定
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  // 後で追加できるように準備
  env: {
    // 環境変数をここに追加可能
  },
  
  // Vercelでのビルド最適化
  experimental: {
    // 実験的機能は使わない
  }
}

module.exports = nextConfig