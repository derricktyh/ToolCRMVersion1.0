import React, { useState } from 'react'
import { AlertCircle, Plus } from 'lucide-react'

interface Issue {
  id: number
  toolName: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved'
  dateLogged: string
}

const initialIssues: Issue[] = [
  { id: 1, toolName: 'Tool 2', description: 'Unexpected shutdown', status: 'Open', dateLogged: '2023-04-10' },
  { id: 2, toolName: 'Tool 3', description: 'Calibration required', status: 'In Progress', dateLogged: '2023-04-09' },
  { id: 3, toolName: 'Tool 1', description: 'Software update needed', status: 'Resolved', dateLogged: '2023-04-08' },
]

const IssueLogger: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [newIssue, setNewIssue] = useState<Partial<Issue>>({ toolName: '', description: '', status: 'Open' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewIssue((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const issueToAdd: Issue = {
      id: issues.length + 1,
      toolName: newIssue.toolName || '',
      description: newIssue.description || '',
      status: newIssue.status as 'Open' | 'In Progress' | 'Resolved',
      dateLogged: new Date().toISOString().split('T')[0],
    }
    setIssues((prev) => [...prev, issueToAdd])
    setNewIssue({ toolName: '', description: '', status: 'Open' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Issue Logger</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Log New Issue</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tool Name</label>
              <input
                type="text"
                name="toolName"
                value={newIssue.toolName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newIssue.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                rows={3}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={newIssue.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Plus className="inline-block mr-2" size={18} />
              Log Issue
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Issues</h2>
          <ul className="space-y-4">
            {issues.slice(0, 5).map((issue) => (
              <li key={issue.id} className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{issue.toolName}</span>
                  <span className={`text-sm ${issue.status === 'Open' ? 'text-red-500' : issue.status === 'In Progress' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{issue.description}</p>
                <p className="text-xs text-gray-400 mt-1">Logged on: {issue.dateLogged}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IssueLogger