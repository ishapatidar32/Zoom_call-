import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import {  Video } from 'lucide-react';
export default function LandingPage() {


    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            {/*Navigation */}
            <nav className='navbar'>
                <div className="nav-logo">
              <div className="logo-icon">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="logo-text">
                StreamSync
              </span>
               </div>
                <div className='navlist'>
                    <p onClick={() => {
                        router("/aljk23")
                    }}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")
                    }}>Register</p>
                    <div className="nav-btn-login" onClick={() => {
                        router("/auth")
                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>


            <div className="landingMainContainer">
                
                <div className="landing-content">
                    <h1 className="landing-title"><span className="title-highlight" style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>
                    <p className="landing-subtitle">Crystal clear video calls , no downloads needed</p>
                    <button className='cat-button' onClick={()=> router("/auth")}>Get Started </button>
                </div>
            </div>
        </div>
    )
}
