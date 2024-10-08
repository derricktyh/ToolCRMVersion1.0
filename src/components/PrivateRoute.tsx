import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default PrivateRoute