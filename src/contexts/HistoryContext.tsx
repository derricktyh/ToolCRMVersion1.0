import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

export interface HistoryItem {
  id: number
  toolName: string
  type: 'issue' | 'maintenance' | 'recovery'
  description: string
  date: string
  endDate?: string
  user: string
  screenshots?: string[]
  resolved?: boolean
  resolutionSteps?: string
  resolvedBy?: string
}

interface HistoryContextType {
  historyItems: HistoryItem[]
  addHistoryItem: (item: Omit<HistoryItem, 'id'>) => void
  getToolHistory: (toolName: string) => HistoryItem[]
  resolveHistoryItem: (id: number, resolutionSteps: string, resolvedBy: string) => void
  deleteHistoryItem: (id: number) => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export const useHistory = () => {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('historyItems')
    const parsedHistory = savedHistory ? JSON.parse(savedHistory) : []
    console.log('Initial history items:', parsedHistory)
    return parsedHistory
  })

  useEffect(() => {
    localStorage.setItem('historyItems', JSON.stringify(historyItems))
    console.log('History items updated:', historyItems)
  }, [historyItems])

  const addHistoryItem = (newItem: Omit<HistoryItem, 'id'>) => {
    setHistoryItems(prevItems => {
      const updatedItems = [
        { ...newItem, id: Date.now() },
        ...prevItems
      ]
      console.log('Adding new history item:', newItem)
      console.log('Updated history items:', updatedItems)
      return updatedItems
    })
  }

  const getToolHistory = (toolName: string) => {
    const toolHistory = historyItems.filter(item => item.toolName === toolName)
    console.log(`Getting history for tool ${toolName}:`, toolHistory)
    return toolHistory
  }

  const resolveHistoryItem = (id: number, resolutionSteps: string, resolvedBy: string) => {
    setHistoryItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, resolved: true, resolutionSteps, resolvedBy } : item
      )
      console.log(`Resolving item ${id}:`, updatedItems.find(item => item.id === id))
      return updatedItems
    })
  }

  const deleteHistoryItem = (id: number) => {
    setHistoryItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id)
      console.log(`Deleting history item ${id}`)
      return updatedItems
    })
  }

  return (
    <HistoryContext.Provider value={{ historyItems, addHistoryItem, getToolHistory, resolveHistoryItem, deleteHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  )
}