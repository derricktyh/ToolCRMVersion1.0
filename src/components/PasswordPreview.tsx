import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Key } from 'lucide-react'

interface Password {
  id: number
  toolName: string
  system: string
  username: string
  password: string
}

const PasswordPreview: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passwords, setPasswords] = useState<Password[]>([])
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    // Load passwords from localStorage
    const allPasswords: Password[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('passwords_')) {
        const toolName = key.replace('passwords_', '')
        const toolPasswords = JSON.parse(localStorage.getItem(key) || '[]')
        allPasswords.push(...toolPasswords.map((p: Omit<Password, 'toolName'>) => ({ ...p, toolName })))
      }
    }
    setPasswords(allPasswords)
  }, [])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Password Preview</h1>
      <button
        onClick={openModal}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <Key className="inline-block mr-2" size={18} />
        View All Passwords
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-2xl leading-6 font-medium text-gray-100" id="modal-title">
                      All Passwords
                    </h3>
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tool</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">System</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Password</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                          {passwords.map(password => (
                            <tr key={password.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{password.toolName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{password.system}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{password.username}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                                <span className="mr-2">
                                  {showPasswords[password.id] ? password.password : '••••••••'}
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(password.id)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  {showPasswords[password.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordPreview