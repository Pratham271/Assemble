'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  project: {
    id: string
    name: string
  }
}

type Project = {
  id: string
  name: string
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' })
  const [newProject, setNewProject] = useState({ name: '' })
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [selectedDate, selectedProject])

  const fetchTasks = async () => {
    const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
    const projectFilter = selectedProject ? `&projectId=${selectedProject}` : ''
    const res = await fetch(`/api/tasks?date=${date}${projectFilter}`)
    const data = await res.json()
    setTasks(data)
  }

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title || !selectedProject) return

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTask,
        projectId: selectedProject,
        dueDate: selectedDate,
      }),
    })

    if (res.ok) {
      setNewTask({ title: '', description: '', projectId: '' })
      fetchTasks()
    }
  }

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name) return

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    })

    if (res.ok) {
      setNewProject({ name: '' })
      fetchProjects()
    }
  }

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })

    if (res.ok) {
      fetchTasks()
    }
  }

  const deleteTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      fetchTasks()
    }
  }

  return (
    <div className="flex">
      <div className="w-64 bg-gray-100 p-4 h-screen">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`cursor-pointer p-2 rounded ${
                selectedProject === project.id ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedProject(project.id)}
            >
              {project.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Select Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            {selectedProject ? (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked as boolean)}
                    />
                    <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Select a project to view tasks</p>
            )}
            {selectedProject && (
              <form onSubmit={addTask} className="mt-4 space-y-2">
                <Input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <Button type="submit">Add Task</Button>
              </form>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Add New Project</h2>
            <form onSubmit={addProject} className="space-y-2">
              <Input
                type="text"
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ name: e.target.value })}
              />
              <Button type="submit">Add Project</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

