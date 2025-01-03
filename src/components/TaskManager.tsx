'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeClosed, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

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

type User = {
  id: string
  email: string
  name: string | null
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' })
  const [newProject, setNewProject] = useState({ name: '' })
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])

  // Toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  // Format description to handle bullet points
  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => {
      const bulletPoint = line.trim().startsWith('•') || line.trim().startsWith('-')
      return (
        <div key={index} className={`${bulletPoint ? 'ml-4' : ''}`}>
          {line}
        </div>
      )
    })
  }

  // Rest of the fetch functions remain the same
  const fetchTasks = async () => {
    if (!user) return
    const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
    const projectFilter = selectedProject ? `&projectId=${selectedProject}` : ''
    const res = await fetch(`/api/tasks?date=${date}${projectFilter}`)
    if (res.ok) {
      const data = await res.json()
      setTasks(data)
    }
  }

  const fetchProjects = async () => {
    if (!user) return
    const res = await fetch('/api/projects')
    if (res.ok) {
      const data = await res.json()
      setProjects(data)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchProjects()
    }
  }, [selectedDate, selectedProject, user])

  // Modified addTask to handle bullet points
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title || !selectedProject || !user) return

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

  // Rest of the handler functions remain the same
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    if (!user) return
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })

    if (res.ok) {
      fetchTasks()
    }
  }



  const addProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name || !user) return
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

  const deleteTask = async (taskId: string) => {
    if (!user) return
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      fetchTasks()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })

    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      setLoginForm({ email: '', password: '' })
    } else {
      alert('Login failed')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setTasks([])
    setProjects([])
    setSelectedProject(null)
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="none"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    className="absolute right-2 top-2.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosed className="bg-transparent h-4 w-4"/> : <Eye className="bg-transparent h-4 w-4"/>}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Task Management App</h1>
          <div className="flex items-center space-x-2">
            <span>Welcome, {user.name || user.email}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
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
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked as boolean)}
                      />
                      <span className={`flex-grow ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        {expandedTasks.includes(task.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {expandedTasks.includes(task.id) && task.description && (
                      <div className="mt-2 pl-8 text-gray-600">
                        {formatDescription(task.description)}
                      </div>
                    )}
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
                <Textarea
                  placeholder="Task description (Use • or - for bullet points)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="min-h-24"
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