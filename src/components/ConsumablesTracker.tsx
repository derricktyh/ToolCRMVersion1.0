import React, { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { useConsumables } from '../contexts/ConsumableContext'
import { useTools } from '../contexts/ToolContext'
import { useLocation } from 'react-router-dom'
import InventoryManagement from './InventoryManagement'

const ConsumablesTracker: React.FC = () => {
  const { consumables, updateConsumable, addConsumable, deleteConsumable } = useConsumables()
  const { tools } = useTools()
  const [expandedTools, setExpandedTools] = useState<string[]>([])
  const [newConsumables, setNewConsumables] = useState<{ [key: string]: any }>({})
  const [showNewConsumableForm, setShowNewConsumableForm] = useState<{ [key: string]: boolean }>({})
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: number; name: string } | null>(null)
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const expandTool = params.get('expandTool')
    if (expandTool) {
      setExpandedTools(prev => [...prev, expandTool])
    }
  }, [location])

  const toggleToolExpansion = (toolName: string) => {
    setExpandedTools(prev =>
      prev.includes(toolName) ? prev.filter(t => t !== toolName) : [...prev, toolName]
    )
  }

  const handleInputChange = (consumableId: number, field: string, value: string | number) => {
    const updatedConsumable = consumables.find(c => c.id === consumableId)
    if (updatedConsumable) {
      updateConsumable({ ...updatedConsumable, [field]: value })
    }
  }

  const handleAddConsumable = (toolName: string) => {
    const newConsumable = newConsumables[toolName]
    if (newConsumable && newConsumable.name) {
      addConsumable({
        toolName,
        name: newConsumable.name,
        currentHours: parseInt(newConsumable.currentHours) || 0,
        guaranteedHours: parseInt(newConsumable.guaranteedHours) || 0,
        lastReplaced: newConsumable.lastReplaced || new Date().toISOString().split('T')[0],
        scheduledReplacement: newConsumable.scheduledReplacement || null,
        remark: newConsumable.remark || ''
      })
      setNewConsumables(prev => ({ ...prev, [toolName]: {} }))
      setShowNewConsumableForm(prev => ({ ...prev, [toolName]: false }))
    }
  }

  const handleDeleteConsumable = (consumableId: number, consumableName: string) => {
    setDeleteConfirmation({ id: consumableId, name: consumableName })
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteConsumable(deleteConfirmation.id)
      setDeleteConfirmation(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation(null)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Consumables Tracker</h1>
      {tools.map((tool) => (
        <div key={tool.name} className="mb-4 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleToolExpansion(tool.name)}
          >
            <h2 className="text-xl font-semibold">{tool.name}</h2>
            {expandedTools.includes(tool.name) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
          </div>
          {expandedTools.includes(tool.name) && (
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Current Hours</th>
                    <th className="text-left">Guaranteed Hours</th>
                    <th className="text-left">Last Replaced</th>
                    <th className="text-left">Scheduled Replacement</th>
                    <th className="text-left">Remark</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consumables
                    .filter(c => c.toolName === tool.name)
                    .map(consumable => (
                      <tr key={consumable.id} className={consumable.currentHours && consumable.guaranteedHours && consumable.currentHours >= consumable.guaranteedHours ? 'bg-red-100' : ''}>
                        <td>
                          <input
                            type="text"
                            value={consumable.name}
                            onChange={(e) => handleInputChange(consumable.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={consumable.currentHours || ''}
                            onChange={(e) => handleInputChange(consumable.id, 'currentHours', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={consumable.guaranteedHours || ''}
                            onChange={(e) => handleInputChange(consumable.id, 'guaranteedHours', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={consumable.lastReplaced}
                            onChange={(e) => handleInputChange(consumable.id, 'lastReplaced', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={consumable.scheduledReplacement || ''}
                            onChange={(e) => handleInputChange(consumable.id, 'scheduledReplacement', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={consumable.remark}
                            onChange={(e) => handleInputChange(consumable.id, 'remark', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteConsumable(consumable.id, consumable.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {showNewConsumableForm[tool.name] ? (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newConsumables[tool.name]?.name || ''}
                    onChange={(e) => setNewConsumables(prev => ({ ...prev, [tool.name]: { ...prev[tool.name], name: e.target.value } }))}
                    className="mr-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Current Hours"
                    value={newConsumables[tool.name]?.currentHours || ''}
                    onChange={(e) => setNewConsumables(prev => ({ ...prev, [tool.name]: { ...prev[tool.name], currentHours: e.target.value } }))}
                    className="mr-2 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Guaranteed Hours"
                    value={newConsumables[tool.name]?.guaranteedHours || ''}
                    onChange={(e) => setNewConsumables(prev => ({ ...prev, [tool.name]: { ...prev[tool.name], guaranteedHours: e.target.value } }))}
                    className="mr-2 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleAddConsumable(tool.name)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewConsumableForm(prev => ({ ...prev, [tool.name]: true }))}
                  className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
                >
                  <Plus size={18} className="mr-1" /> Add New Consumable
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <InventoryManagement />
      
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete {deleteConfirmation.name}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsumablesTracker