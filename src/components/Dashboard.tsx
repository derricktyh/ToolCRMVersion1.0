import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, Wrench, Package, AlertCircle, Calendar, CheckCircle } from 'lucide-react'
import { useTools, ToolData } from '../contexts/ToolContext'
import { useConsumables } from '../contexts/ConsumableContext'
import { useHistory } from '../contexts/HistoryContext'
import HistoryModal from './HistoryModal'

const Dashboard: React.FC = () => {
  const { tools } = useTools()
  const { consumables } = useConsumables()
  const { historyItems } = useHistory()
  const [selectedTool, setSelectedTool] = useState<ToolData | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const consumablesNeedingReplacement = consumables.filter(
    consumable => consumable.currentHours && consumable.guaranteedHours && 
    consumable.currentHours >= consumable.guaranteedHours
  )

  const currentAndUpcomingMaintenance = historyItems
    .filter(item => 
      item.type === 'maintenance' && 
      !item.resolved &&
      new Date(item.date) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Include maintenance from the last 24 hours
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5) // Show only the next 5 current and upcoming maintenance events

  const getStatusDisplay = (tool: ToolData) => {
    const statusClass = {
      Up: 'bg-green-500 text-white',
      Down: 'bg-red-500 text-white',
      Maintenance: 'bg-blue-500 text-white'
    }[tool.status]

    return (
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClass}`}>
          {tool.status}
        </span>
        {tool.hasIssues && (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white">
            Issue
          </span>
        )}
        {tool.hasMaintenance && tool.status !== 'Maintenance' && (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-500 text-white">
            Maintenance
          </span>
        )}
      </div>
    )
  }

  const handleOpenHistoryModal = (tool: ToolData) => {
    setSelectedTool(tool)
    setIsHistoryModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
            <Wrench className="mr-2" /> Tool Status
          </h2>
          <ul className="space-y-4">
            {tools.map((tool, index) => (
              <li key={`tool-${tool.id || index}`} className="flex justify-between items-center">
                <button
                  onClick={() => handleOpenHistoryModal(tool)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {tool.name}
                </button>
                {getStatusDisplay(tool)}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
            <Package className="mr-2" /> Consumables Needing Replacement
          </h2>
          <ul className="space-y-2">
            {consumablesNeedingReplacement.map((consumable, index) => (
              <li key={`consumable-${consumable.id || index}`} className="flex justify-between items-center">
                <Link 
                  to={`/consumables?expandTool=${encodeURIComponent(consumable.toolName)}`} 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {consumable.name} ({consumable.toolName})
                </Link>
                <span className="text-red-500">To be replaced</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Calendar className="mr-2" /> Current and Upcoming Maintenance
        </h2>
        {currentAndUpcomingMaintenance.length > 0 ? (
          <ul className="space-y-2">
            {currentAndUpcomingMaintenance.map((maintenance) => (
              <li key={maintenance.id} className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{maintenance.toolName}</span>
                <span className="mx-2">-</span>
                <span className="text-gray-600 dark:text-gray-400">{formatDate(maintenance.date)}</span>
                {maintenance.endDate && (
                  <>
                    <span className="mx-2">to</span>
                    <span className="text-gray-600 dark:text-gray-400">{formatDate(maintenance.endDate)}</span>
                  </>
                )}
                <span className="mx-2">-</span>
                <span className="text-gray-600 dark:text-gray-400">{maintenance.description}</span>
                {new Date(maintenance.date) <= new Date() && (!maintenance.endDate || new Date(maintenance.endDate) > new Date()) ? (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                    Current
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                    Upcoming
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No current or upcoming maintenance scheduled.</p>
        )}
      </div>
      {selectedTool && (
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          tool={selectedTool}
          initialFilterType="issue"
        />
      )}
    </div>
  )
}

export default Dashboard