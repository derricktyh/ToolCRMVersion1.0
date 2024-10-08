import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useHistory } from '../contexts/HistoryContext'
import { useTools, ToolData } from '../contexts/ToolContext'

interface MaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
  tool: ToolData | null
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, tool }) => {
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { addHistoryItem } = useHistory()
  const { updateTool, checkMaintenanceStatus } = useTools()

  useEffect(() => {
    if (isOpen && tool) {
      setDescription('')
      setStartDate('')
      setEndDate('')
    }
  }, [isOpen, tool])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tool) {
      const newItem = {
        toolName: tool.name,
        type: 'maintenance' as const,
        description: `Scheduled maintenance: ${description}`,
        date: startDate,
        endDate: endDate,
        user: 'Current User', // Replace with actual user info
        resolved: false
      }
      addHistoryItem(newItem)
      updateTool({
        ...tool,
        hasMaintenance: true,
        maintenanceStart: startDate,
        maintenanceEnd: endDate
      })
      checkMaintenanceStatus()
      onClose()
    }
  }

  if (!isOpen || !tool) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none modal-backdrop" onClick={onClose}>
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative modal-content bg-gray-800 p-6 rounded-lg" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Schedule Maintenance for {tool.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Maintenance Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Schedule Maintenance
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceModal