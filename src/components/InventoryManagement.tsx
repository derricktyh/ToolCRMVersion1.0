import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface InventoryItem {
  id: number
  name: string
  quantity: number
  purchaseDate: string
  storageLocation: string
  remarks: string
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const savedInventory = localStorage.getItem('consumablesInventory')
    return savedInventory ? JSON.parse(savedInventory) : []
  })
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    quantity: 0,
    purchaseDate: '',
    storageLocation: '',
    remarks: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNewItemForm, setShowNewItemForm] = useState(false)

  useEffect(() => {
    localStorage.setItem('consumablesInventory', JSON.stringify(inventory))
  }, [inventory])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number | null = null) => {
    const { name, value } = e.target
    if (id === null) {
      setNewItem(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) || 0 : value }))
    } else {
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, [name]: name === 'quantity' ? parseInt(value) || 0 : value } : item
      ))
    }
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      setInventory(prev => [...prev, { ...newItem, id: Date.now() }])
      setNewItem({ name: '', quantity: 0, purchaseDate: '', storageLocation: '', remarks: '' })
      setShowNewItemForm(false)
    }
  }

  const handleEditItem = (id: number) => {
    setEditingId(id)
  }

  const handleSaveEdit = (id: number) => {
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDeleteItem = (id: number) => {
    setInventory(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Storage Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Remarks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {inventory.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleInputChange(e, item.id)}
                      className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, item.id)}
                      className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="date"
                      name="purchaseDate"
                      value={item.purchaseDate}
                      onChange={(e) => handleInputChange(e, item.id)}
                      className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    item.purchaseDate
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      name="storageLocation"
                      value={item.storageLocation}
                      onChange={(e) => handleInputChange(e, item.id)}
                      className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    item.storageLocation
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <textarea
                      name="remarks"
                      value={item.remarks}
                      onChange={(e) => handleInputChange(e, item.id)}
                      className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    item.remarks
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === item.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(item.id)} className="text-blue-600 hover:text-blue-900 mr-2">
                        <Save size={18} />
                      </button>
                      <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditItem(item.id)} className="text-blue-600 hover:text-blue-900 mr-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
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
      {showNewItemForm ? (
        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Add New Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={(e) => handleInputChange(e)}
              placeholder="Name of Consumable"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={(e) => handleInputChange(e)}
              placeholder="Quantity"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="date"
              name="purchaseDate"
              value={newItem.purchaseDate}
              onChange={(e) => handleInputChange(e)}
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="storageLocation"
              value={newItem.storageLocation}
              onChange={(e) => handleInputChange(e)}
              placeholder="Storage Location"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            />
            <textarea
              name="remarks"
              value={newItem.remarks}
              onChange={(e) => handleInputChange(e)}
              placeholder="Remarks"
              className="w-full border rounded px-2 py-1 col-span-2 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
            <button
              onClick={() => setShowNewItemForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNewItemForm(true)}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <Plus size={18} className="mr-1" /> Add New Item
        </button>
      )}
    </div>
  )
}

export default InventoryManagement