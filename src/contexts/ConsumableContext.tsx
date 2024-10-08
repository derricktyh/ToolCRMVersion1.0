import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

interface Consumable {
  id: number
  toolName: string
  name: string
  currentHours: number | null
  guaranteedHours: number | null
  lastReplaced: string
  scheduledReplacement: string | null
  remark: string
}

interface ConsumableContextType {
  consumables: Consumable[]
  updateConsumable: (updatedConsumable: Consumable) => void
  addConsumable: (newConsumable: Omit<Consumable, 'id'>) => void
  deleteConsumable: (id: number) => void
  tools: string[]
  addTool: (toolName: string) => void
  updateToolName: (oldName: string, newName: string) => void
  deleteTool: (toolName: string) => void
}

const ConsumableContext = createContext<ConsumableContextType | undefined>(undefined)

export const useConsumables = () => {
  const context = useContext(ConsumableContext)
  if (context === undefined) {
    throw new Error('useConsumables must be used within a ConsumableProvider')
  }
  return context
}

const initialConsumables: Consumable[] = [
  { id: 1, toolName: 'FIB-01: Helios 600i', name: 'Ion Source', currentHours: 450, guaranteedHours: 500, lastReplaced: '2023-03-15', scheduledReplacement: '2023-05-15', remark: '' },
  { id: 2, toolName: 'FIB-01: Helios 600i', name: 'Electron Source', currentHours: 1800, guaranteedHours: 2000, lastReplaced: '2022-12-01', scheduledReplacement: '2023-06-01', remark: '' },
  { id: 3, toolName: 'FIB-04: G4', name: 'Ion Source', currentHours: 480, guaranteedHours: 500, lastReplaced: '2023-02-01', scheduledReplacement: '2023-04-20', remark: '' },
  { id: 4, toolName: 'FIB-05: H5', name: 'Ion Source', currentHours: 300, guaranteedHours: 500, lastReplaced: '2023-03-01', scheduledReplacement: '2023-07-01', remark: '' },
  { id: 5, toolName: 'TEM02 - Talos01', name: 'Electron Source', currentHours: 1950, guaranteedHours: 2000, lastReplaced: '2022-11-15', scheduledReplacement: '2023-05-01', remark: '' },
  { id: 6, toolName: 'TEM03 - Talos02', name: 'Electron Source', currentHours: 1700, guaranteedHours: 2000, lastReplaced: '2022-12-15', scheduledReplacement: '2023-06-15', remark: '' },
]

const initialTools = Array.from(new Set(initialConsumables.map(c => c.toolName)))

export const ConsumableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consumables, setConsumables] = useState<Consumable[]>(() => {
    const storedConsumables = localStorage.getItem('consumables')
    return storedConsumables ? JSON.parse(storedConsumables) : initialConsumables
  })

  const [tools, setTools] = useState<string[]>(() => {
    const storedTools = localStorage.getItem('consumableTools')
    return storedTools ? JSON.parse(storedTools) : initialTools
  })

  useEffect(() => {
    localStorage.setItem('consumables', JSON.stringify(consumables))
    localStorage.setItem('consumableTools', JSON.stringify(tools))
  }, [consumables, tools])

  const updateConsumable = (updatedConsumable: Consumable) => {
    setConsumables(prevConsumables => 
      prevConsumables.map(consumable => 
        consumable.id === updatedConsumable.id ? updatedConsumable : consumable
      )
    )
  }

  const addConsumable = (newConsumable: Omit<Consumable, 'id'>) => {
    setConsumables(prevConsumables => [
      ...prevConsumables,
      { ...newConsumable, id: Math.max(...prevConsumables.map(c => c.id), 0) + 1 }
    ])
    if (!tools.includes(newConsumable.toolName)) {
      setTools(prevTools => [...prevTools, newConsumable.toolName])
    }
  }

  const deleteConsumable = (id: number) => {
    setConsumables(prevConsumables => prevConsumables.filter(consumable => consumable.id !== id))
  }

  const addTool = (toolName: string) => {
    if (!tools.includes(toolName)) {
      setTools(prevTools => [...prevTools, toolName])
    }
  }

  const updateToolName = (oldName: string, newName: string) => {
    setTools(prevTools => prevTools.map(tool => tool === oldName ? newName : tool))
    setConsumables(prevConsumables => 
      prevConsumables.map(consumable => 
        consumable.toolName === oldName ? { ...consumable, toolName: newName } : consumable
      )
    )
  }

  const deleteTool = (toolName: string) => {
    setTools(prevTools => prevTools.filter(tool => tool !== toolName))
    setConsumables(prevConsumables => prevConsumables.filter(consumable => consumable.toolName !== toolName))
  }

  return (
    <ConsumableContext.Provider value={{ 
      consumables, 
      updateConsumable, 
      addConsumable, 
      deleteConsumable, 
      tools, 
      addTool, 
      updateToolName,
      deleteTool 
    }}>
      {children}
    </ConsumableContext.Provider>
  )
}