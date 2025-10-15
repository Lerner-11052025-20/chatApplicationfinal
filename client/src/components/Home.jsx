import React from 'react'
import {useNavigate} from 'react-router'
import { NavLink } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const signup = (e)=>{
    navigate('/signup')
  }
  const login = (e)=>{
    navigate('/login')
  }
  return (
    <div className="center-screen">
      <div className="card hero">
        <h1 className="title">Welcome to ChatSystem</h1>
        <p className="muted">Secure chat with a clean, modern interface. Login or create an account to get started.</p>
        <div className="btn-group" style={{justifyContent:'center', marginTop: 16}}>
          <button className="btn btn-primary" onClick={login}>Log In</button>
          <button className="btn btn-ghost" onClick={signup}>Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default Home