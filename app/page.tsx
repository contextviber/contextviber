'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      title: 'File Tree Generator',
      description: 'Instantly generate ASCII file trees from your project. Perfect for documentation and AI context.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: 'Token Counter',
      description: 'Count tokens and estimate costs for GPT-4, Claude, and other models. Optimize your prompts efficiently.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Status Generator',
      description: 'Auto-generate status.md files to track project progress and maintain context across sessions.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['5 projects', 'Basic generators', 'Community support'],
      buttonText: 'Get Started',
      buttonStyle: 'bg-white/10 text-white hover:bg-white/20',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: ['Unlimited projects', 'AI-powered features', 'Priority support', 'API access'],
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25',
      popular: true,
    },
    {
      name: 'Team',
      price: '$99',
      period: '/month',
      features: ['Everything in Pro', '5 team members', 'Shared workspaces'],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-white/10 text-white hover:bg-white/20',
      popular: false,
    },
  ];

  const featurePills = ['File Tree Generator', 'Token Counter', 'Status.md Generator', 'Mermaid Diagrams'];

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent -z-10" />
      
      {/* Navigation */}
      <nav className="container mx-auto px-4 pt-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-white font-bold text-xl">ContextViber</span>
          </Link>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </a>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-purple-300 text-sm">AI Context Management for Vibe Coders</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Never Lose Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> AI Context </span>
            Again
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Smart context management that keeps your AI conversations flowing. 
            Generate file trees, count tokens, and package your project context in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-20">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-lg font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition transform hover:-translate-y-1"
            >
              Start Free
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition">
              View Demo
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {featurePills.map((feature) => (
              <div key={feature} className="px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-lg">
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for AI Context Management
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful tools to maintain conversation continuity with ChatGPT, Claude, and Cursor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-white/10 transition"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`
                  ${plan.popular 
                    ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20' 
                    : 'bg-white/5 border-white/10'
                  } 
                  backdrop-blur border rounded-xl p-8 relative
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-lg transition ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-gray-400">© 2025 ContextViber</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}