import React, { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

interface Password {
  id: number
  system: string
  username: string
  password: string
}

interface PasswordManagerProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
}

const PasswordManager: React.FC<PasswordManagerProps> = ({ isOpen, onClose, toolName }) => {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [newPassword, setNewPassword] = useState<Omit<Password, 'id'>>({ system: '', username: '', password: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({})
  const { user } = useUser()

  useEffect(() => {
    if (isOpen) {
      const storedPasswords = localStorage.getItem(`passwords_${toolName}`)
      setPasswords(storedPasswords ? JSON.parse(storedPasswords) : [])
    }
  }, [isOpen, toolName])

  useEffect(() => {
    if (passwords.length > 0) {
      localStorage.setItem(`passwords_${toolName}`, JSON.stringify(passwords))
    }
  }, [passwords, toolName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number | null = null) => {
    const { name, value } = e.target
    if (id === null) {
      setNewPassword(prev => ({ ...prev, [name]: value }))
    } else {
      setPasswords(prev => prev.map(pass => 
        pass.id === id ? { ...pass, [name]: value } : pass
      ))
    }
  }

  const handleAddPassword = () => {
    if (newPassword.system && newPassword.username && newPassword.password) {
      setPasswords(prev => [...prev, { ...newPassword, id: Date.now() }])
      setNewPassword({ system: '', username: '', password: '' })
    }
  }

  const handleEditPassword = (id: number) => {
    setEditingId(id)
  }

  const handleSaveEdit = (id: number) => {
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDeletePassword = (id: number) => {
    setPasswords(prev => prev.filter(pass => pass.id !== id))
  }

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const canEditPasswords = user && (user.role === 'admin' || user.permissions.includes('edit_password_manager'))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none" onClick={onClose}>
      <div className="relative w-full max-w-md mx-auto my-6" onClick={(e) => e.stopPropagation()}>
        <div className="relative modal-content bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              Password Manager for {toolName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6">
            {canEditPasswords && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="System"
                  name="system"
                  value={newPassword.system}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={newPassword.username}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white mb-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={newPassword.password}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white mb-2"
                />
                <button
                  onClick={handleAddPassword}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  <Plus size={18} className="inline-block mr-2" />
                  Add Password
                </button>
              </div>
            )}
            <ul className="space-y-2">
              {passwords.map((pass) => (
                <li key={pass.id} className="flex items-center justify-between">
                  {editingId === pass.id && canEditPasswords ? (
                    <>
                      <input
                        type="text"
                        name="system"
                        value={pass.system}
                        onChange={(e) => handleInputChange(e, pass.id)}
                        className="w-1/4 px-2 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        name="username"
                        value={pass.username}
                        onChange={(e) => handleInputChange(e, pass.id)}
                        className="w-1/4 px-2 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type={showPasswords[pass.id] ? 'text' : 'password'}
                        name="password"
                        value={pass.password}
                        onChange={(e) => handleInputChange(e, pass.id)}
                        className="w-1/4 px-2 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <div>
                        <button onClick={() => handleSaveEdit(pass.id)} className="text-blue-600 hover:text-blue-800 mr-2">
                          <Save size={18} />
                        </button>
                        <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800">
                          <X size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="w-1/4">{pass.system}</span>
                      <span className="w-1/4">{pass.username}</span>
                      <span className="w-1/4">
                        {showPasswords[pass.id] ? pass.password : '••••••••'}
                        <button
                          onClick={() => togglePasswordVisibility(pass.id)}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          {showPasswords[pass.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </span>
                      {canEditPasswords && (
                        <div>
                          <button onClick={() => handleEditPassword(pass.id)} className="text-blue-600 hover:text-blue-800 mr-2">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDeletePassword(pass.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordManager