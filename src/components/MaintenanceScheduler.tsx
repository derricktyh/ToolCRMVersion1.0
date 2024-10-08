import React, { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Wrench } from 'lucide-react'

interface MaintenanceEvent {
  id: number
  toolName: string
  description: string
  date: string
  time: string
}

const initialEvents: MaintenanceEvent[] = [
  { id: 1, toolName: 'Tool 1', description: 'Regular checkup', date: '2023-04-15', time: '09:00' },
  { id: 2, toolName: 'Tool 3', description: 'Software update', date: '2023-04-18', time: '14:00' },
  { id: 3, toolName: 'Tool 2', description: 'Calibration', date: '2023-04-20', time: '10:30' },
]

const MaintenanceScheduler: React.FC = () => {
  const [events, setEvents] = useState<MaintenanceEvent[]>(initialEvents)
  const [newEvent, setNewEvent] = useState<Partial<MaintenanceEvent>>({ toolName: '', description: '', date: '', time: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventToAdd: MaintenanceEvent = {
      id: events.length + 1,
      toolName: newEvent.toolName || '',
      description: newEvent.description || '',
      date: newEvent.date || '',
      time: newEvent.time || '',
    }
    setEvents((prev) => [...prev, eventToAdd])
    setNewEvent({ toolName: '', description: '', date: '', time: '' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Maintenance Scheduler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Schedule Maintenance</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tool Name</label>
              <input
                type="text"
                name="toolName"
                value={newEvent.toolName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                rows={3}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={newEvent.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <CalendarIcon className="inline-block mr-2" size={18} />
              Schedule Maintenance
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Maintenance</h2>
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{event.toolName}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="mr-1" size={14} />
                    {event.date}
                    <Clock className="ml-2 mr-1" size={14} />
                    {event.time}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceScheduler