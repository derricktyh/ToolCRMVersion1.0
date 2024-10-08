import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useHistory } from './HistoryContext'

export interface ToolData {
  id: number
  name: string
  status: 'Up' | 'Down' | 'Maintenance'
  hasIssues: boolean
  hasMaintenance: boolean
  lastUpdated: string
  maintenanceStart?: string
  maintenanceEnd?: string
}

interface ToolContextType {
  tools: ToolData[]
  updateTool: (updatedTool: ToolData) => void
  addTool: (toolName: string) => void
  deleteTool: (id: number) => void
  checkMaintenanceStatus: () => void
}

const ToolContext = createContext<ToolContextType | undefined>(undefined)

export const useTools = () => {
  const context = useContext(ToolContext)
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolProvider')
  }
  return context
}

const initialTools: ToolData[] = [
  { id: 1, name: 'FIB-01: Helios 600i', status: 'Up', hasIssues: false, hasMaintenance: false, lastUpdated: '2023-04-10' },
  { id: 2, name: 'FIB-04: G4', status: 'Down', hasIssues: true, hasMaintenance: false, lastUpdated: '2023-04-09' },
  { id: 3, name: 'FIB-05: H5', status: 'Up', hasIssues: true, hasMaintenance: false, lastUpdated: '2023-04-08' },
  { id: 4, name: 'TEM02 - Talos01', status: 'Maintenance', hasIssues: false, hasMaintenance: true, lastUpdated: '2023-04-07', maintenanceStart: '2023-04-07T09:00:00', maintenanceEnd: '2023-04-14T17:00:00' },
  { id: 5, name: 'TEM03 - Talos02', status: 'Up', hasIssues: false, hasMaintenance: false, lastUpdated: '2023-04-11' },
]

export const ToolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<ToolData[]>(() => {
    const storedTools = localStorage.getItem('tools')
    return storedTools ? JSON.parse(storedTools) : initialTools
  })
  const { historyItems } = useHistory()

  useEffect(() => {
    localStorage.setItem('tools', JSON.stringify(tools))
  }, [tools])

  useEffect(() => {
    checkMaintenanceStatus()
    const interval = setInterval(checkMaintenanceStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [historyItems])

  const updateTool = (updatedTool: ToolData) => {
    setTools(prevTools => prevTools.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    ))
  }

  const addTool = (toolName: string) => {
    setTools(prevTools => {
      const newTool: ToolData = {
        id: Math.max(...prevTools.map(t => t.id), 0) + 1,
        name: toolName,
        status: 'Up',
        hasIssues: false,
        hasMaintenance: false,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      return [...prevTools, newTool]
    })
  }

  const deleteTool = (id: number) => {
    setTools(prevTools => prevTools.filter(tool => tool.id !== id))
  }

  const checkMaintenanceStatus = () => {
    const now = new Date()
    setTools(prevTools => prevTools.map(tool => {
      const maintenanceItems = historyItems.filter(
        item => item.type === 'maintenance' && 
                item.toolName === tool.name && 
                !item.resolved &&
                new Date(item.date) <= now &&
                (!item.endDate || new Date(item.endDate) > now)
      )
      const hasActiveMaintenance = maintenanceItems.length > 0
      const hasUnresolvedIssues = historyItems.some(
        item => item.type === 'issue' && 
                item.toolName === tool.name && 
                !item.resolved
      )
      
      let newStatus = tool.status
      if (hasActiveMaintenance) {
        newStatus = 'Maintenance'
      } else if (hasUnresolvedIssues) {
        newStatus = 'Down'
      } else {
        newStatus = 'Up'
      }

      return {
        ...tool,
        status: newStatus,
        hasIssues: hasUnresolvedIssues,
        hasMaintenance: hasActiveMaintenance,
        maintenanceStart: hasActiveMaintenance ? maintenanceItems[0].date : undefined,
        maintenanceEnd: hasActiveMaintenance ? maintenanceItems[0].endDate : undefined
      }
    }))
  }

  return (
    <ToolContext.Provider value={{ tools, updateTool, addTool, deleteTool, checkMaintenanceStatus }}>
      {children}
    </ToolContext.Provider>
  )
}