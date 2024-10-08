import React, { useState } from 'react'
import { Wrench, AlertCircle, CheckCircle, X, Key, Settings } from 'lucide-react'
import ReportIssueModal from './ReportIssueModal'
import MaintenanceModal from './MaintenanceModal'
import RecoveryModal from './RecoveryModal'
import HistoryModal from './HistoryModal'
import PasswordManager from './PasswordManager'
import ManageToolsModal from './ManageToolsModal'
import { useHistory } from '../contexts/HistoryContext'
import { useUser } from '../contexts/UserContext'
import { useTools, ToolData } from '../contexts/ToolContext'

const ToolStatus: React.FC = () => {
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false)
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isPasswordManagerOpen, setIsPasswordManagerOpen] = useState(false)
  const [isManageToolsModalOpen, setIsManageToolsModalOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<ToolData | null>(null)
  const { user, hasPermission } = useUser()
  const { tools } = useTools()

  const getStatusDisplay = (tool: ToolData) => {
    const statusClasses = {
      Up: 'bg-green-500 text-white',
      Down: 'bg-red-500 text-white',
      Maintenance: 'bg-blue-500 text-white'
    }

    return (
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[tool.status]}`}>
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

  const handleReportIssue = (tool: ToolData) => {
    setSelectedTool(tool)
    setIsReportIssueModalOpen(true)
  }

  const handleScheduleMaintenance = (tool: ToolData) => {
    setSelectedTool(tool)
    setIsMaintenanceModalOpen(true)
  }

  const handleRecovery = (tool: ToolData) => {
    setSelectedTool(tool)
    setIsRecoveryModalOpen(true)
  }

  const handleViewHistory = (tool: ToolData) => {
    setSelectedTool(tool)
    setIsHistoryModalOpen(true)
  }

  const handlePasswordManager = (tool: ToolData) => {
    setSelectedTool(tool)
    setIsPasswordManagerOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Tool Status</h1>
      {hasPermission('manage_tools') && (
        <div className="mb-4">
          <button
            onClick={() => setIsManageToolsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <Settings className="mr-2" size={18} />
            Manage Tools
          </button>
        </div>
      )}
      {tools.map((tool) => (
        <div key={tool.id} className="mb-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h2>
            {getStatusDisplay(tool)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last updated: {tool.lastUpdated}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleReportIssue(tool)}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 flex items-center"
            >
              <AlertCircle className="mr-2" size={16} /> Report Issue
            </button>
            <button
              onClick={() => handleScheduleMaintenance(tool)}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center"
            >
              <Wrench className="mr-2" size={16} /> Schedule Maintenance
            </button>
            <button
              onClick={() => handleRecovery(tool)}
              className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center"
            >
              <CheckCircle className="mr-2" size={16} /> Recovery
            </button>
            <button
              onClick={() => handleViewHistory(tool)}
              className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600 flex items-center"
            >
              View History
            </button>
            {hasPermission('edit_password_manager') && (
              <button
                onClick={() => handlePasswordManager(tool)}
                className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 flex items-center"
              >
                <Key className="mr-2" size={16} /> Passwords
              </button>
            )}
          </div>
        </div>
      ))}
      
      {selectedTool && (
        <>
          <ReportIssueModal
            isOpen={isReportIssueModalOpen}
            onClose={() => setIsReportIssueModalOpen(false)}
            tool={selectedTool}
          />
          <MaintenanceModal
            isOpen={isMaintenanceModalOpen}
            onClose={() => setIsMaintenanceModalOpen(false)}
            tool={selectedTool}
          />
          <RecoveryModal
            isOpen={isRecoveryModalOpen}
            onClose={() => setIsRecoveryModalOpen(false)}
            tool={selectedTool}
          />
          <HistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            tool={selectedTool}
          />
          <PasswordManager
            isOpen={isPasswordManagerOpen}
            onClose={() => setIsPasswordManagerOpen(false)}
            toolName={selectedTool.name}
          />
        </>
      )}
      {hasPermission('manage_tools') && (
        <ManageToolsModal
          isOpen={isManageToolsModalOpen}
          onClose={() => setIsManageToolsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ToolStatus