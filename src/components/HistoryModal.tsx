import React, { useState, useEffect, useCallback } from 'react'
import { X, Search, Filter, Image, CheckCircle, Info, Trash2, Calendar, Clock, User } from 'lucide-react'
import { useHistory, HistoryItem } from '../contexts/HistoryContext'
import ResolveIssueModal from './ResolveIssueModal'
import { useTools, ToolData } from '../contexts/ToolContext'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  tool: ToolData | null
  initialFilterType?: 'all' | 'issue' | 'maintenance' | 'recovery'
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, tool, initialFilterType = 'all' }) => {
  const { historyItems, getToolHistory, resolveHistoryItem, deleteHistoryItem } = useHistory()
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'issue' | 'maintenance' | 'recovery'>(initialFilterType)
  const [showResolved, setShowResolved] = useState(false)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<HistoryItem | null>(null)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { updateTool, checkMaintenanceStatus } = useTools()

  useEffect(() => {
    if (isOpen && tool) {
      const toolHistory = getToolHistory(tool.name)
      filterItems(searchTerm, filterType, showResolved, toolHistory, startDate, endDate)
    }
  }, [isOpen, tool, getToolHistory, searchTerm, filterType, showResolved, startDate, endDate])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const handleFilterChange = useCallback((type: 'all' | 'issue' | 'maintenance' | 'recovery') => {
    setFilterType(type)
  }, [])

  const handleShowResolvedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setShowResolved(event.target.checked)
  }, [])

  const filterItems = useCallback((
    term: string,
    type: 'all' | 'issue' | 'maintenance' | 'recovery',
    showResolved: boolean,
    items: HistoryItem[],
    start: string,
    end: string
  ) => {
    const filtered = items.filter(item => {
      const matchesType = type === 'all' || item.type === type
      const matchesResolved = showResolved || !item.resolved
      const matchesSearch = term === '' || 
        item.description.toLowerCase().includes(term.toLowerCase()) ||
        item.date.includes(term) ||
        (item.endDate && item.endDate.includes(term)) ||
        item.user.toLowerCase().includes(term.toLowerCase()) ||
        (item.resolvedBy && item.resolvedBy.toLowerCase().includes(term.toLowerCase()))
      
      const itemDate = new Date(item.date)
      const matchesDateRange = (!start || itemDate >= new Date(start)) && 
                               (!end || itemDate <= new Date(end))

      return matchesType && matchesResolved && matchesSearch && matchesDateRange
    })
    setFilteredItems(filtered)
  }, [])

  const handleResolveIssue = (item: HistoryItem) => {
    setSelectedIssue(item)
    setIsResolveModalOpen(true)
  }

  const handleResolveConfirm = (steps: string, resolvedBy: string) => {
    if (selectedIssue && tool) {
      resolveHistoryItem(selectedIssue.id, steps, resolvedBy)
      checkMaintenanceStatus()
      setIsResolveModalOpen(false)
      setSelectedIssue(null)
      const updatedHistory = getToolHistory(tool.name)
      filterItems(searchTerm, filterType, showResolved, updatedHistory, startDate, endDate)
    }
  }

  const handleDeleteHistoryItem = (id: number) => {
    deleteHistoryItem(id)
    if (tool) {
      const updatedHistory = getToolHistory(tool.name)
      filterItems(searchTerm, filterType, showResolved, updatedHistory, startDate, endDate)
    }
  }

  const handleImagePreview = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewImage(imageUrl)
    setIsImagePreviewOpen(true)
  }

  const handleCloseImagePreview = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsImagePreviewOpen(false)
    setPreviewImage(null)
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

  const getTagColor = (type: string) => {
    switch (type) {
      case 'issue':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-blue-100 text-blue-800'
      case 'recovery':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen || !tool) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none modal-backdrop" onClick={onClose}>
      <div className="relative w-3/4 max-w-4xl mx-auto my-6" onClick={e => e.stopPropagation()}>
        <div className="relative modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">History for {tool.name}</h2>
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full border rounded px-3 py-2 pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value as 'all' | 'issue' | 'maintenance' | 'recovery')}
                className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="all">All</option>
                <option value="issue">Issues</option>
                <option value="maintenance">Maintenance</option>
                <option value="recovery">Recovery</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={handleShowResolvedChange}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Show Resolved</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <label className="mr-2 text-sm dark:text-gray-300">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-sm dark:text-gray-300">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          <ul className="space-y-4">
            {filteredItems.map((item) => (
              <li key={item.id} className="border-b pb-2 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium dark:text-gray-200">{formatDate(item.date)}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getTagColor(item.type)}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    {item.type === 'issue' && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${item.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.resolved ? 'Resolved' : 'Open'}
                      </span>
                    )}
                  </div>
                  <div>
                    {item.type === 'issue' && !item.resolved && (
                      <button
                        onClick={() => handleResolveIssue(item)}
                        className="text-blue-600 hover:text-blue-800 mr-2 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mt-1">
                  <User size={14} className="mr-1" />
                  <span className="mr-3">{item.user}</span>
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(item.date)}</span>
                  {item.endDate && (
                    <>
                      <span className="mx-1">-</span>
                      <span>{formatDate(item.endDate)}</span>
                    </>
                  )}
                </div>
                {item.screenshots && item.screenshots.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium dark:text-gray-300">Screenshots:</p>
                    <div className="flex space-x-2 mt-1">
                      {item.screenshots.map((screenshot, index) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-16 h-16 object-cover cursor-pointer rounded"
                          onClick={(e) => handleImagePreview(screenshot, e)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {item.resolved && (
                  <div className="mt-2">
                    <p className="text-sm font-medium dark:text-gray-300">Resolution:</p>
                    <p className="text-sm dark:text-gray-400">{item.resolutionSteps}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      <User size={14} className="inline mr-1" />
                      Resolved by: {item.resolvedBy}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isResolveModalOpen && selectedIssue && (
        <ResolveIssueModal
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          onResolve={handleResolveConfirm}
        />
      )}
      {isImagePreviewOpen && previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 cursor-pointer" 
          onClick={handleCloseImagePreview}
        >
          <div className="max-w-3xl max-h-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-full" />
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryModal