import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Shield, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="logo">
          <FileText size={24} color="#3b82f6" />
          <span>SmartDoc AI</span>
        </div>
        <div className="nav-links">
          <button className="btn-ghost" onClick={() => navigate('/auth')}>Sign In</button>
          <button className="btn-primary" onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px', color: 'var(--accent)' }}>
          <Sparkles size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Powered by Advanced AI</span>
        </div>
        
        <h1>
          Chat with your Documents 
          <br /> 
          <span className="highlight">in Seconds</span>
        </h1>
        
        <p className="hero-sub">
          Stop scrolling through endless pages. Upload your documents and get instant, accurate answers powered by cutting-edge AI. Secure, private, and incredibly fast.
        </p>
        
        <button className="btn-hero" onClick={() => navigate('/auth')}>
          Start Free <ArrowRight size={18} />
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          ✓ No credit card required • ✓ Instant setup • ✓ Free to try
        </p>
      </header>

      {/* Features Grid */}
      <section className="features">
        <div className="feature-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Zap size={40} color="#f59e0b" />
          </div>
          <h3>Lightning Fast</h3>
          <p>Get answers in milliseconds, not seconds. Our AI processes documents instantly, giving you real-time insights.</p>
        </div>

        <div className="feature-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Shield size={40} color="#10b981" />
          </div>
          <h3>Bank-Grade Security</h3>
          <p>Your documents stay private. End-to-end encryption ensures your data is protected at all times.</p>
        </div>

        <div className="feature-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <MessageSquare size={40} color="#3b82f6" />
          </div>
          <h3>Smart Context</h3>
          <p>Our AI remembers the conversation context, making interactions more natural and helpful.</p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-light)', marginTop: '60px' }}>
        <h2 style={{ marginBottom: '40px', color: 'var(--text-primary)' }}>Trusted by professionals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { name: 'Analytics Expert', quote: 'Saved me hours on data analysis.' },
            { name: 'Student', quote: 'Perfect for studying and research.' },
            { name: 'Business Owner', quote: 'Makes reviewing contracts super easy.' }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '20px', background: 'var(--bg-white)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '12px' }}>"{item.quote}"</p>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>— {item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent) 0%, #1d4ed8 100%)', color: 'white' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '2.2em' }}>Ready to get started?</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '40px', opacity: 0.95 }}>Join thousands of professionals using SmartDoc AI</p>
        <button 
          onClick={() => navigate('/auth')}
          style={{
            background: 'white',
            color: 'var(--accent)',
            padding: '14px 40px',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Get Started Now <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '30px 40px', textAlign: 'center', background: 'var(--bg-light)', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
        <p>© 2024 SmartDoc AI. Built with ❤️ for document lovers.</p>
      </footer>
    </div>
  );
}