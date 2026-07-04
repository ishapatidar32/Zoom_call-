import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video } from 'lucide-react'
import '../App.css'

export default function LandingPage() {
    const router = useNavigate()
    const [roomCode, setRoomCode] = useState('')

    return (
        <div className='landingPageContainer'>

            {/* ── NAVBAR ── */}
            <nav className='navbar'>
                <div className="nav-logo">
                    <div className="logo-icon">
                        <Video size={18} />
                    </div>
                    <span className="logo-text">StreamSync</span>
                </div>
                <div className='navlist'>
                    <p onClick={() => router("/aljk23")}>Join as Guest</p>
                    <p onClick={() => router("/auth")}>Register</p>
                    <button className='nav-btn-login' onClick={() => router("/auth")}>
                        Login
                    </button>
                </div>
            </nav>

            {/* ── HERO SECTION ── */}
            <div className="landingMainContainer">
                <div className="landing-content">
                    <h1 className="landing-title">
                        <span className="title-highlight">Connect</span> with your loved Ones
                    </h1>
                    <p className="landing-subtitle">
                        Stay close to the people who matter most. One click to start, no downloads required.
                    </p>
                    <div className="hero-actions">
                        <button className='cta-button' onClick={() => router("/auth")}>
                            Get Started
                        </button>
                        <button className='cta-button-outline' onClick={() => router("/aljk23")}>
                            Join as Guest
                        </button>
                    </div>
                </div>
                <div className="landing-image">
                    <img src="/image.png" alt="Video calling preview" />
                </div>
            </div>

            {/* ── SECURITY SECTION ── */}
            <section className="security-section">
                <div className="section-inner">
                    <h2 className="section-title">Security You Can Trust</h2>
                    <p className="section-sub">
                        Your privacy is paramount. We employ industry-leading security standards.
                    </p>
                    <div className="security-cards">
                        <div className="security-card">
                            <span className="security-icon">🔐</span>
                            <h3>256-bit Encryption</h3>
                            <p>End-to-end encryption ensures your calls are never intercepted</p>
                        </div>
                        <div className="security-card">
                            <span className="security-icon">🛡️</span>
                            <h3>No Data Logging</h3>
                            <p>We don't store your conversations or call metadata</p>
                        </div>
                        <div className="security-card">
                            <span className="security-icon">✓</span>
                            <h3>Open Standards</h3>
                            <p>Built on WebRTC and open protocols for transparency</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-grid">

                        {/* Brand */}
                        <div className="footer-brand">
                            <div className="nav-logo" style={{ marginBottom: "0.75rem" }}>
                                <div className="logo-icon">
                                    <Video size={16} />
                                </div>
                                <span className="logo-text">StreamSync</span>
                            </div>
                            <p className="footer-tagline">The future of video calling</p>
                        </div>

                        {/* Product */}
                        <div className="footer-col">
                            <h4 className="footer-heading">Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#security">Security</a>
                        </div>

                        {/* Resources */}
                        <div className="footer-col">
                            <h4 className="footer-heading">Resources</h4>
                            <a href="#docs">Documentation</a>
                            <a href="#blog">Blog</a>
                            <a href="#community">Community</a>
                        </div>

                        {/* Legal */}
                        <div className="footer-col">
                            <h4 className="footer-heading">Legal</h4>
                            <a href="#privacy">Privacy</a>
                            <a href="#terms">Terms</a>
                            <a href="#contact">Contact</a>
                        </div>

                    </div>

                    {/* Footer Bottom */}
                    <div className="footer-bottom">
                        <p>© 2024 StreamSync. All rights reserved.</p>
                        <div className="footer-socials">
                            <a href="#twitter">Twitter</a>
                            <a href="#github">GitHub</a>
                            <a href="#linkedin">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}