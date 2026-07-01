import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import '../styles/authstyle.css'

export default function Authentication() {
    const [tab, setTab] = useState('login')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const { handleLogin, handleRegister } = useContext(AuthContext)
    const router = useNavigate()

    const handleLoginSubmit = async () => {
        setError('')
        try {
            await handleLogin(username, password)
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Check your credentials.')
        }
    }

    const handleRegisterSubmit = async () => {
        setError('')
        setMessage('')
        try {
            const msg = await handleRegister(name, username, password)
            setMessage(msg)
            setTab('login')
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed. Try again.')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <div className="logo-icon">
                        <Video size={18} />
                    </div>
                    <span className="logo-text">StreamSync</span>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => { setTab('login'); setError(''); setMessage('') }}
                    >
                        Sign in
                    </button>
                    <button
                        className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => { setTab('register'); setError(''); setMessage('') }}
                    >
                        Sign up
                    </button>
                </div>

                {/* Feedback */}
                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-success">{message}</p>}

                {/* Login Form */}
                {tab === 'login' && (
                    <div className="auth-form">
                        <p className="auth-title">Welcome back</p>
                        <p className="auth-sub">Sign in to your account</p>

                        <div className="auth-field">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="your_username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLoginSubmit()}
                            />
                        </div>

                        <button className="auth-btn" onClick={handleLoginSubmit}>
                            Sign in
                        </button>

                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <span onClick={() => setTab('register')}>Register</span>
                        </p>
                    </div>
                )}

                {/* Register Form */}
                {tab === 'register' && (
                    <div className="auth-form">
                        <p className="auth-title">Create account</p>
                        <p className="auth-sub">Join StreamSync today</p>

                        <div className="auth-field">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Alex Johnson"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="auth-field">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="alex_j"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRegisterSubmit()}
                            />
                        </div>

                        <button className="auth-btn" onClick={handleRegisterSubmit}>
                            Create account
                        </button>

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <span onClick={() => setTab('login')}>Sign in</span>
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}