# 🚀 ContextViber

> AI Context Management Tool for Vibe Coders - Smart context management solution for developers working with AI assistants

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

## ✨ Features

### 🆓 Free Tier
- **📁 Smart File Upload** - Drag & drop with automatic security filtering
- **🌳 File Tree Generator** - ASCII tree structure visualization
- **🔢 Token Counter** - Real-time token calculation for AI models
- **📊 Status.md Generator** - Customizable project status documentation
- **💾 Project Management** - Save and manage multiple projects
- **📋 Multiple Export Formats** - Markdown, JSON, Clipboard

### 💎 Pro Features (Coming Soon)
- **🤖 AI-Powered Enhancement** - Claude API integration
- **🔍 Smart File Selection** - AI-driven relevance scoring
- **📈 Advanced Analytics** - Detailed usage statistics
- **🔗 API Access** - Programmatic context generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/contextviber/contextviber.git
cd contextviber

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: React Hooks + IndexedDB
- **Deployment**: Vercel
- **Storage**: Client-side only (IndexedDB)

## 📝 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Required
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional - Simple Password Protection
NEXT_PUBLIC_SITE_PASSWORD=your_password_here

# Future - AI Features
ANTHROPIC_API_KEY=your_api_key_here
```

### Security Features

- ✅ Automatic filtering of sensitive files
- ✅ API key/secret detection
- ✅ Binary file exclusion
- ✅ File size limits (10MB)
- ✅ Entropy-based random string detection

## 📦 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/contextviber/contextviber)

1. Click the button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🗺️ Roadmap

- [x] MVP Release (v0.5.0)
- [ ] Mobile Responsive Design
- [ ] Dark Mode
- [ ] Claude API Integration
- [ ] VSCode Extension
- [ ] CLI Tool
- [ ] Team Collaboration
- [ ] Git Diff Integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 💬 Support

- Email: support@contextviber.com
- Documentation: [https://contextviber.com/docs](https://contextviber.com/docs)
- Discord: Coming soon

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and users

---

**Built with ❤️ by the ContextViber Team**