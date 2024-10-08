import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { LogIn, Key, AlertCircle } from 'lucide-react'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { login, changePassword } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const success = await login(username, password)
      if (success) {
        navigate('/')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    try {
      const success = await changePassword(username, currentPassword, newPassword)
      if (success) {
        setIsChangingPassword(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        alert('Password changed successfully')
      } else {
        setError('Failed to change password. Please check your current password.')
      }
    } catch (err) {
      setError('An error occurred while changing the password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-center text-3xl font-extrabold text-white mb-2">
              PFA Tools Management
            </h1>
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-200">
              {isChangingPassword ? 'Change Your Password' : 'Login'}
            </h2>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <AlertCircle className="fill-current h-6 w-6 text-red-500" />
              </span>
            </div>
          )}
          {isChangingPassword ? (
            <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="current-password" className="sr-only">Current Password</label>
                  <input
                    id="current-password"
                    name="current-password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="sr-only">New Password</label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <Key className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                  </span>
                  Change Password
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          )}
          <div className="text-center">
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isChangingPassword ? 'Back to Sign In' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login