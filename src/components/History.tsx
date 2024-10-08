import React, { useState } from 'react'
import { AlertCircle, Wrench, Filter } from 'lucide-react'
import { useHistory, HistoryItem } from '../contexts/HistoryContext'

const History: React.FC = () => {
  const { historyItems } = useHistory()
  const [selectedTools, setSelectedTools] = useState<string[]>([])

  const uniqueTools = Array.from(new Set(historyItems.map(item => item.toolName)))

  const handleToolSelect = (toolName: string) => {
    setSelectedTools(prev => 
      prev.includes(toolName)
        ? prev.filter(t => t !== toolName)
        : [...prev, toolName]
    )
  }

  const filteredItems = selectedTools.length > 0
    ? historyItems.filter(item => selectedTools.includes(item.toolName))
    : historyItems

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Tool</h2>
        <div className="flex flex-wrap gap-2">
          {uniqueTools.map(tool => (
            <button
              key={tool}
              onClick={() => handleToolSelect(tool)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTools.includes(tool)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item: HistoryItem) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.date}
                  {item.endDate && ` - ${item.endDate}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.toolName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'issue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.type === 'issue' ? (
                      <><AlertCircle size={14} className="mr-1" /> Issue</>
                    ) : (
                      <><Wrench size={14} className="mr-1" /> Maintenance</>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default History