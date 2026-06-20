import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "AI-Powered Intelligence",
            desc: "Advanced RAG pipeline and semantic document search powered by Groq and Llama 3.",
            icon: "🤖",
            color: "var(--purple)"
        },
        {
            title: "Financial Control",
            desc: "Comprehensive financial tracking, cashflow analysis, and expense management.",
            icon: "⚖️",
            color: "var(--success)"
        },
        {
            title: "Workspace Orchestration",
            desc: "Unified HR, Leave management, and project tracking in one high-performance interface.",
            icon: "🎯",
            color: "var(--secondary)"
        }
    ];

    return (
        <div className="landing-container" style={{
            background: 'var(--bg-base)',
            minHeight: '100vh',
            color: 'var(--text-primary)',
            overflowX: 'hidden'
        }}>
            {/* Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 80px',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(13, 15, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, var(--primary), var(--purple))',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>O</div>
                    <span style={{ fontWeight: 700, fontSize: '18px' }}>Organi<span>Station</span></span>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '100px 80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '60px',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{ flex: 1 }}>
                    <div className="badge badge-primary" style={{ marginBottom: '20px' }}>Version 3.1.0 Live</div>
                    <h1 style={{ fontSize: '64px', lineHeight: 1.1, marginBottom: '24px', fontWeight: 800 }}>
                        The Future of <span style={{ color: 'var(--primary)', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern Workspace</span> Orchestration.
                    </h1>
                    <p style={{ fontSize: '18px', marginBottom: '40px', maxWidth: '600px' }}>
                        OrganiStation brings your entire microservices architecture into a single, unified, and AI-driven command center. Managed scaling, automated HR, and intelligent finance.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }} onClick={() => navigate('/login')}>
                            Get Started Now
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                            View Documentation
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-10%',
                        width: '120%',
                        height: '120%',
                        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                        zIndex: -1
                    }}></div>
                    <img
                        src="/landing_hero_asset.png"
                        alt="Workspace Preview"
                        style={{
                            width: '100%',
                            borderRadius: '24px',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border)',
                            transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                        }}
                    />
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '100px 80px', background: 'var(--bg-surface)' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Built for Complex Ecosystems</h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto' }}>Leverage our modular microservices to power every department of your organization with industrial-grade efficiency.</p>
                </div>
                <div className="grid-3">
                    {features.map((f, i) => (
                        <div key={i} className="card" style={{ padding: '40px', textAlign: 'left', position: 'relative' }}>
                            <div style={{
                                fontSize: '32px',
                                marginBottom: '24px',
                                width: '60px',
                                height: '60px',
                                background: f.color + '20',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '16px'
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ marginBottom: '12px' }}>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '120px 80px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, var(--bg-surface), var(--bg-base))'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--bg-card), var(--bg-base))',
                    padding: '80px',
                    borderRadius: '32px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>Ready to Scale?</h2>
                    <p style={{ marginBottom: '40px', fontSize: '18px' }}>Join the next generation of productive teams orchestrating their future with OrganiStation.</p>
                    <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '18px' }} onClick={() => navigate('/login')}>
                        Initialize Workspace
                    </button>
                </div>
            </section>

            <footer style={{
                padding: '40px 80px',
                borderTop: '1px solid var(--border)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '12px'
            }}>
                © 2026 OrganiStation Orchestration Suite. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
