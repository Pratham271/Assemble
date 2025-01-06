'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, ChevronDown, ChevronUp, Loader } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'



type Project = {
  id: string
  name: string
}

export default function TaskManager({userId}: {userId:string}) {
  
  const {tasks, setTasks, projectsLoading, setProjectsLoading} = useTaskStore() 
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [newProject, setNewProject] = useState({ name: '' })
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
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
  useEffect(() => {
    if (userId) {
      fetchTasks()
      
    }
  }, [selectedDate, selectedProject, userId])


  useEffect(() => {
    fetchProjects()
  },[userId])

  const fetchTasks = async () => {
    if (!userId) return
    const date = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
    const projectFilter = selectedProject ? `&projectId=${selectedProject}` : ''
    const res = await fetch(`/api/tasks?date=${date}${projectFilter}&userId=${userId}`)
    if (res.ok) {
      const data = await res.json()
      setTasks(data)
    }
  }


  const fetchProjects = async () => {
    try {
      if (!userId) return
      setProjectsLoading(true)
      const res = await fetch(`/api/projects?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      
    }
    finally{
      setProjectsLoading(false)
    }
  }

  

  // Modified addTask to handle bullet points
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title || !selectedProject || !userId) return

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskData: newTask,
        projectId: selectedProject,
        dueDate: selectedDate,
        userId:userId
      }),
    })

    if (res.ok) {
      setNewTask({ title: '', description: '' })
      fetchTasks()
    }
  }

  // Rest of the handler functions remain the same
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    if (!userId) return
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
    if (!newProject.name || !userId) return
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectData:newProject,
        userId
      }),
   
    })
  
    if (res.ok) {
      setNewProject({ name: '' })
      fetchProjects()
    }
   
  }

  const deleteTask = async (taskId: string) => {
    if (!userId) return
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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
          {projectsLoading? <div className="flex justify-center items-center h-screen">
              <Loader className="animate-spin" />
            </div>:projects.map((project) => (
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