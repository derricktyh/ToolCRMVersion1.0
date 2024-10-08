import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { ToolProvider } from './contexts/ToolContext'
import { ConsumableProvider } from './contexts/ConsumableContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ToolStatus from './components/ToolStatus'
import ConsumablesTracker from './components/ConsumablesTracker'
import UserManagement from './components/UserManagement'
import PasswordPreview from './components/PasswordPreview'
import PrivateRoute from './components/PrivateRoute'

const AppContent: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/tool-status" element={
                <PrivateRoute>
                  <ToolStatus />
                </PrivateRoute>
              } />
              <Route path="/consumables" element={
                <PrivateRoute>
                  <ConsumablesTracker />
                </PrivateRoute>
              } />
              <Route path="/user-management" element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              } />
              <Route path="/password-preview" element={
                <PrivateRoute>
                  <PasswordPreview />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <HistoryProvider>
          <ToolProvider>
            <ConsumableProvider>
              <AppContent />
            </ConsumableProvider>
          </ToolProvider>
        </HistoryProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App