import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { useHistory, HistoryItem } from '../contexts/HistoryContext'
import { useTools, ToolData } from '../contexts/ToolContext'

interface RecoveryModalProps {
  isOpen: boolean
  onClose: () => void
  tool: ToolData | null
}

const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, onClose, tool }) => {
  const [description, setDescription] = useState('')
  const [attendedBy, setAttendedBy] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [relevantItems, setRelevantItems] = useState<HistoryItem[]>([])
  const { historyItems, addHistoryItem, resolveHistoryItem } = useHistory()
  const { updateTool } = useTools()

  useEffect(() => {
    if (isOpen && tool) {
      const items = historyItems.filter(
        item => item.toolName === tool.name && 
                (item.type === 'issue' || item.type === 'maintenance') &&
                !item.resolved &&
                new Date(item.date) <= new Date()
      )
      setRelevantItems(items)
      setSelectedItems([])
      setDescription('')
      setAttendedBy('')
    }
  }, [isOpen, tool, historyItems])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length > 0 && tool) {
      selectedItems.forEach(itemId => {
        const recoveredItem = relevantItems.find(item => item.id === itemId)
        if (recoveredItem) {
          addHistoryItem({
            toolName: tool.name,
            type: 'recovery',
            description: `Recovery from ${recoveredItem.type}: ${description}`,
            date: new Date().toISOString(),
            user: attendedBy,
            resolvedItemId: recoveredItem.id
          })
          resolveHistoryItem(recoveredItem.id, description, attendedBy)
        }
      })

      // Update tool status
      const remainingIssues = historyItems.filter(
        item => item.toolName === tool.name && 
                item.type === 'issue' && 
                !item.resolved &&
                !selectedItems.includes(item.id)
      )
      const remainingMaintenance = historyItems.filter(
        item => item.toolName === tool.name && 
                item.type === 'maintenance' && 
                !item.resolved &&
                new Date(item.date) <= new Date() &&
                (!item.endDate || new Date(item.endDate) > new Date()) &&
                !selectedItems.includes(item.id)
      )

      let newStatus = 'Up'
      if (tool.status === 'Down' && !selectedItems.some(id => relevantItems.find(item => item.id === id)?.type === 'issue')) {
        newStatus = 'Down'
      }
      const hasActiveMaintenance = remainingMaintenance.length > 0

      updateTool({
        ...tool,
        status: hasActiveMaintenance ? 'Maintenance' : newStatus,
        hasIssues: remainingIssues.length > 0,
        hasMaintenance: hasActiveMaintenance,
        maintenanceStart: hasActiveMaintenance ? remainingMaintenance[0].date : undefined,
        maintenanceEnd: hasActiveMaintenance ? remainingMaintenance[0].endDate : undefined
      })
    }
    onClose()
  }

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  if (!isOpen || !tool) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none modal-backdrop" onClick={onClose}>
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative modal-content bg-gray-800 p-6 rounded-lg" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recovery for {tool.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Issues or Maintenance
              </label>
              <div className="max-h-40 overflow-y-auto">
                {relevantItems.map(item => (
                  <div key={item.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`item-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`item-${item.id}`} className="text-sm text-gray-300">
                      {item.type === 'issue' ? 'Issue' : 'Maintenance'}: {item.description}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Recovery Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-400"
                rows={4}
                required
                placeholder="Enter recovery description..."
              />
            </div>
            <div className="mb-4">
              <label htmlFor="attendedBy" className="block text-sm font-medium text-gray-300 mb-2">
                Attended By
              </label>
              <input
                type="text"
                id="attendedBy"
                value={attendedBy}
                onChange={(e) => setAttendedBy(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-400"
                required
                placeholder="Enter name..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
              disabled={selectedItems.length === 0}
            >
              <Check size={18} className="mr-2" />
              Submit Recovery
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RecoveryModal