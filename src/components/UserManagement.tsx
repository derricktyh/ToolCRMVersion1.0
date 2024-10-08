import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { User, UserPlus, Edit2, Trash2, Save, X, RefreshCw, Eye, EyeOff } from 'lucide-react'

interface UserData {
  id: number
  username: string
  role: 'admin' | 'lead' | 'user'
  permissions: string[]
  password: string
}

const allPermissions = [
  'view_dashboard',
  'view_tool_status',
  'view_consumables',
  'edit_tools',
  'edit_consumables',
  'edit_password_manager',
  'manage_tools',
  'view_user_management',
  'edit_user_management'
]

const defaultPermissions = {
  admin: allPermissions,
  lead: ['view_dashboard', 'view_tool_status', 'view_consumables', 'edit_tools', 'edit_consumables', 'edit_password_manager'],
  user: ['view_dashboard', 'view_tool_status', 'view_consumables']
}

const UserManagement: React.FC = () => {
  const { user: currentUser, users, updateUser, addUser } = useUser()
  const [newUser, setNewUser] = useState<Omit<UserData, 'id'>>({
    username: '',
    role: 'user',
    permissions: defaultPermissions.user,
    password: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({})
  const [editedUsers, setEditedUsers] = useState<{ [key: number]: UserData }>({})

  useEffect(() => {
    const initialEditedUsers: { [key: number]: UserData } = {}
    users.forEach(user => {
      initialEditedUsers[user.id] = { ...user }
    })
    setEditedUsers(initialEditedUsers)
  }, [users])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number | null = null) => {
    const { name, value } = e.target
    if (id === null) {
      if (name === 'role') {
        setNewUser(prev => ({
          ...prev,
          [name]: value,
          permissions: defaultPermissions[value as keyof typeof defaultPermissions]
        }))
      } else {
        setNewUser(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setEditedUsers(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [name]: name === 'role' 
            ? value
            : name === 'permissions'
            ? defaultPermissions[value as keyof typeof defaultPermissions]
            : value
        }
      }))
    }
  }

  const handlePermissionChange = (permission: string, id: number | null = null) => {
    if (id === null) {
      setNewUser(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission]
      }))
    } else {
      setEditedUsers(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          permissions: prev[id].permissions.includes(permission)
            ? prev[id].permissions.filter(p => p !== permission)
            : [...prev[id].permissions, permission]
        }
      }))
    }
  }

  const handleAddUser = () => {
    if (newUser.username && newUser.password) {
      addUser(newUser)
      setNewUser({
        username: '',
        role: 'user',
        permissions: defaultPermissions.user,
        password: ''
      })
      setShowNewUserForm(false)
      console.log('Current users after adding:', users)
    }
  }

  const handleEditUser = (id: number) => {
    setEditingId(id)
  }

  const handleSaveEdit = (id: number) => {
    updateUser(editedUsers[id])
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDeleteUser = (id: number) => {
    updateUser({ ...users.find(u => u.id === id)!, deleted: true } as UserData)
  }

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (!currentUser || !currentUser.permissions.includes('view_user_management')) {
    return <div className="text-gray-100">You do not have permission to access this page.</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">User Management</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Users</h2>
          <button
            onClick={() => setShowNewUserForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <UserPlus size={18} className="mr-2" />
            Add New User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-100">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Permissions</th>
                <th className="px-4 py-2 text-left">Password</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        name="username"
                        value={editedUsers[user.id].username}
                        onChange={(e) => handleInputChange(e, user.id)}
                        className="bg-gray-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === user.id ? (
                      <select
                        name="role"
                        value={editedUsers[user.id].role}
                        onChange={(e) => handleInputChange(e, user.id)}
                        className="bg-gray-700 text-white px-2 py-1 rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="lead">Lead</option>
                        <option value="user">User</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === user.id ? (
                      <div className="flex flex-wrap gap-2">
                        {allPermissions.map(permission => (
                          <label key={permission} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editedUsers[user.id].permissions.includes(permission)}
                              onChange={() => handlePermissionChange(permission, user.id)}
                              className="mr-1"
                            />
                            <span className="text-sm">{permission}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      user.permissions.join(', ')
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === user.id ? (
                      <input
                        type={showPasswords[user.id] ? 'text' : 'password'}
                        name="password"
                        value={editedUsers[user.id].password}
                        onChange={(e) => handleInputChange(e, user.id)}
                        className="bg-gray-700 text-white px-2 py-1 rounded"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span>{showPasswords[user.id] ? user.password : '••••••••'}</span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="ml-2 text-gray-400 hover:text-gray-200"
                        >
                          {showPasswords[user.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === user.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(user.id)}
                          className="text-green-500 hover:text-green-400 mr-2"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-200"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="text-blue-500 hover:text-blue-400 mr-2"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showNewUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Add New User</h2>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={newUser.username}
              onChange={(e) => handleInputChange(e)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={(e) => handleInputChange(e)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
            >
              <option value="admin">Admin</option>
              <option value="lead">Lead</option>
              <option value="user">User</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={newUser.password}
              onChange={(e) => handleInputChange(e)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
            />
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {allPermissions.map(permission => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="mr-1"
                    />
                    <span className="text-sm text-gray-300">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewUserForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement