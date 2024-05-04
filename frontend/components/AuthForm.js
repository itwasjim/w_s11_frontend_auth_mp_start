import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AuthForm() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const toggleFormMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setMessage('')
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const loginUser = async (env) => {
    env.preventDefault()
    try {
      const { data } = await axios.post('api/auth/login', { username, password })
      localStorage.setItem('token', data.token)
      navigate('/stars')
      setMessage(data.message);
    } catch (err) {
      setError(err?.response?.message || "An error occured. Please try again!")
    }
  }

  const registerUser = async (env) => {
    env.preventDefault()
    const newUser = {
      username: username,
      password: password,
    }
    try {
      const { data } = await axios.post('api/auth/register', newUser)
      setMessage(data.message);
    } catch (err) {
      setError(err?.response?.message || "An error occured. Please try again!")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isLogin) {
      registerUser(e)
    } else {
      loginUser(e)
    }
  }

  return (
    <div className="container">
      <div aria-live="polite">{message}</div>
      <div aria-live="assertive" style={{ color: 'red' }}>{error}</div>
      <h3>{isLogin ? 'Login' : 'Register'}
        <button onClick={toggleFormMode}>
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
    </div>
  )
}