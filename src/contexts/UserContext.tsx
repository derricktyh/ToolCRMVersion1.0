import React, { createContext, useState, useContext, useEffect } from 'react'

interface User {
  id: number
  username: string
  role: 'admin' | 'lead' | 'user'
  permissions: string[]
  password: string
}

interface UserContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  changePassword: (username: string, currentPassword: string, newPassword: string) => Promise<boolean>
  users: User[]
  updateUser: (updatedUser: User) => void
  addUser: (newUser: Omit<User, 'id'>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    role: 'admin',
    permissions: ['view_dashboard', 'view_tool_status', 'view_consumables', 'edit_tools', 'edit_consumables', 'edit_password_manager', 'manage_tools', 'view_user_management', 'edit_user_management'],
    password: 'admin123'
  },
  {
    id: 2,
    username: 'lead',
    role: 'lead',
    permissions: ['view_dashboard', 'view_tool_status', 'view_consumables', 'edit_tools', 'edit_consumables', 'edit_password_manager'],
    password: 'lead123'
  },
  {
    id: 3,
    username: 'user',
    role: 'user',
    permissions: ['view_dashboard', 'view_tool_status', 'view_consumables'],
    password: 'user123'
  }
]

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users')
    return storedUsers ? JSON.parse(storedUsers) : initialUsers
  })

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.username === username && u.password === password)
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const changePassword = async (username: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    const userIndex = users.findIndex(u => u.username === username && u.password === currentPassword)
    if (userIndex !== -1) {
      const updatedUsers = [...users]
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword }
      setUsers(updatedUsers)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      return true
    }
    return false
  }

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      localStorage.setItem('users', JSON.stringify(newUsers))
      return newUsers
    })
  }

  const addUser = (newUser: Omit<User, 'id'>) => {
    setUsers(prevUsers => {
      const userWithId = { ...newUser, id: prevUsers.length + 1 }
      const newUsers = [...prevUsers, userWithId]
      localStorage.setItem('users', JSON.stringify(newUsers))
      console.log('New user added:', userWithId)
      console.log('Updated users:', newUsers)
      return newUsers
    })
  }

  return (
    <UserContext.Provider value={{ user, login, logout, hasPermission, changePassword, users, updateUser, addUser }}>
      {children}
    </UserContext.Provider>
  )
}