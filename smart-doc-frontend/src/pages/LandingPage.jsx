import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Zap, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="logo">
          <FileText size={24} color="#2563eb" />
          <span>SmartDoc AI</span>
        </div>
        <div className="nav-links">
          <button className="btn-ghost" onClick={() => navigate('/auth')}>Log In</button>
          <button className="btn-primary" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Chat with your Documents <br /> <span className="highlight">in Seconds.</span></h1>
        <p className="hero-sub">
          Stop scrolling through 100-page PDFs. Just upload, ask, and get instant answers powered by AI. 
          Secure, private, and fast.
        </p>
        <button className="btn-hero" onClick={() => navigate('/auth')}>Try It Free</button>
      </header>

      {/* Features Grid */}
      <section className="features">
        <div className="feature-card">
          <Zap className="icon" color="#eab308" />
          <h3>Instant Answers</h3>
          <p>Powered by Groq LPU inference, get answers in milliseconds, not seconds.</p>
        </div>
        <div className="feature-card">
          <Shield className="icon" color="#22c55e" />
          <h3>Bank-Grade Security</h3>
          <p>Your documents are isolated. No one else can see your data.</p>
        </div>
        <div className="feature-card">
          <MessageSquare className="icon" color="#3b82f6" />
          <h3>Smart Context</h3>
          <p>Our Vector DB remembers the context of your entire conversation.</p>
        </div>
      </section>
    </div>
  );
}