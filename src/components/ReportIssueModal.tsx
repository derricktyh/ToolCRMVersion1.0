import React, { useState, useCallback, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react'
import { useTools } from '../contexts/ToolContext'
import { useDropzone } from 'react-dropzone'
import { useHistory } from '../contexts/HistoryContext'

interface ReportIssueModalProps {
  isOpen: boolean
  onClose: () => void
  tool: { id: number; name: string; status: string }
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose, tool }) => {
  const [description, setDescription] = useState('')
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [setToolDown, setSetToolDown] = useState(false)
  const { updateTool } = useTools()
  const { addHistoryItem } = useHistory()

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setDescription('')
      setScreenshots([])
      setSetToolDown(false)
    }
  }, [isOpen])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setScreenshots(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newStatus = setToolDown ? 'Down' : tool.status
    updateTool({ 
      ...tool, 
      hasIssues: true, 
      status: newStatus 
    })
    addHistoryItem({
      toolName: tool.name,
      type: 'issue',
      description,
      date: new Date().toISOString(),
      user: 'Current User', // Replace with actual user info
      screenshots: screenshots.map(file => URL.createObjectURL(file))
    })
    onClose()
  }

  const handleDeleteScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none modal-backdrop" onClick={handleClose}>
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative modal-content bg-gray-800 p-6 rounded-lg" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Report Issue for {tool.name}</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Issue Description
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={setToolDown}
                  onChange={(e) => setSetToolDown(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-300">Set tool status to "Down"</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Screenshots
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <input {...getInputProps()} />
                <p className="text-gray-400">Drag 'n' drop screenshots here, or click to select files</p>
                <Upload className="mx-auto mt-2 text-gray-400" size={24} />
              </div>
            </div>
            {screenshots.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Uploaded Screenshots:</h3>
                <ul className="list-disc pl-5">
                  {screenshots.map((file, index) => (
                    <li key={index} className="text-sm text-gray-400 flex justify-between items-center">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteScreenshot(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit Issue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportIssueModal