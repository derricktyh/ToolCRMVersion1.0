import React, { useState } from 'react'
import { X } from 'lucide-react'

interface ResolveIssueModalProps {
  isOpen: boolean
  onClose: () => void
  onResolve: (steps: string, resolvedBy: string) => void
}

const ResolveIssueModal: React.FC<ResolveIssueModalProps> = ({ isOpen, onClose, onResolve }) => {
  const [steps, setSteps] = useState('')
  const [resolvedBy, setResolvedBy] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onResolve(steps, resolvedBy)
    setSteps('')
    setResolvedBy('')
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none modal-backdrop" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md mx-auto my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resolve Issue</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="steps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Steps taken to resolve the issue
              </label>
              <textarea
                id="steps"
                name="steps"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="resolvedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolved by
              </label>
              <input
                type="text"
                id="resolvedBy"
                name="resolvedBy"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                required
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResolveIssueModal