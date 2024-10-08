import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react'
import { useTools, ToolData } from '../contexts/ToolContext'
import { useConsumables } from '../contexts/ConsumableContext'

interface ManageToolsModalProps {
  isOpen: boolean
  onClose: () => void
}

const ManageToolsModal: React.FC<ManageToolsModalProps> = ({ isOpen, onClose }) => {
  const { tools, addTool, deleteTool, updateTool } = useTools()
  const { updateToolName, deleteTool: deleteConsumableTool } = useConsumables()
  const [newToolName, setNewToolName] = useState('')
  const [toolToDelete, setToolToDelete] = useState<ToolData | null>(null)
  const [editingTool, setEditingTool] = useState<ToolData | null>(null)
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setNewToolName('')
      setToolToDelete(null)
      setEditingTool(null)
      setEditedName('')
    }
  }, [isOpen])

  const handleAddNewTool = () => {
    if (newToolName.trim()) {
      addTool(newToolName.trim())
      setNewToolName('')
    }
  }

  const handleRemoveTool = (tool: ToolData) => {
    setToolToDelete(tool)
  }

  const confirmRemoveTool = () => {
    if (toolToDelete) {
      deleteTool(toolToDelete.id)
      deleteConsumableTool(toolToDelete.name)
      setToolToDelete(null)
    }
  }

  const handleEditTool = (tool: ToolData) => {
    setEditingTool(tool)
    setEditedName(tool.name)
  }

  const handleSaveEdit = () => {
    if (editingTool && editedName.trim()) {
      const oldName = editingTool.name
      const newName = editedName.trim()
      updateTool({ ...editingTool, name: newName })
      updateToolName(oldName, newName)
      setEditingTool(null)
      setEditedName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingTool(null)
    setEditedName('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Tools</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={newToolName}
            onChange={(e) => setNewToolName(e.target.value)}
            placeholder="Enter new tool name"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
          />
          <button
            onClick={handleAddNewTool}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" /> Add New Tool
          </button>
        </div>
        <ul className="space-y-2">
          {tools.map((tool) => (
            <li key={tool.id} className="flex justify-between items-center">
              {editingTool && editingTool.id === tool.id ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-grow px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <div>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-500 hover:text-green-400 mr-2"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{tool.name}</span>
                  <div>
                    <button
                      onClick={() => handleEditTool(tool)}
                      className="text-blue-500 hover:text-blue-400 mr-2"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleRemoveTool(tool)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {toolToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the tool "{toolToDelete.name}"? This will also remove all associated consumables.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setToolToDelete(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveTool}
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

export default ManageToolsModal