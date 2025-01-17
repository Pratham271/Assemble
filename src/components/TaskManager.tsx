'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import { AddTaskDialog } from './Dialogs/AddTaskDialog'
import Sidebar from './Sidebar'
import { DatePickerDemo } from './ui/date-picker'


export default function TaskManager({userId}: {userId:string}) {
  
  const {tasks, setTasks, setProjectsLoading, setProjects, selectedProject, newProject, setNewProject, selectedDate } = useTaskStore() 
  const [newTask, setNewTask] = useState({ title: '', description: '' })
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
  const addTask = async (title:string, description:string) => {
    if (!title || !selectedProject || !userId) return

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskData: {title, description},
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
    <div className="flex h-screen">
      <Sidebar addProject={addProject} userId={userId}/>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-3">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            {selectedProject ? (
              <>
                <AddTaskDialog onAddTask={addTask} />
                <ul className="mt-4 space-y-4">
                  {tasks.filter(task => task.project.id === selectedProject).map((task) => (
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
                          className="p-2 rounded-md hover:bg-red-100 text-red-500 transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4"/>
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
              </>
            ) : (
              <p>Select a project to view tasks</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-0">Select Date</h2>
            <DatePickerDemo/>
          </div>
        </div>
      </div>
    </div>
  )
}