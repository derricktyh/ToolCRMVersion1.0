import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Key, LogOut } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout, hasPermission } = useUser()

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold mr-4">CRM System</Link>
          {user && (
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/tool-status" className="hover:text-gray-300">Tool Status</Link>
              <Link to="/consumables" className="hover:text-gray-300">Consumables</Link>
              {hasPermission('view_user_management') && (
                <Link to="/user-management" className="hover:text-gray-300">User Management</Link>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {user && (
            <>
              <Link to="/password-preview" className="hover:text-gray-300">
                <Key size={20} />
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar