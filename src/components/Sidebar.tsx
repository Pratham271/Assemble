import { Check, Edit2, Loader, SquarePen, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useTaskStore } from '@/store/useTaskStore'
import AddProjectDialog from './Dialogs/AddProjectDialog'


const Sidebar = ({addProject, userId}:{addProject:(e:React.FormEvent)=>void, userId:string}) => {
  const { projects, setProjects, selectedProject, setSelectedProject, newProject, setNewProject, projectsLoading } = useTaskStore()
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("")

  const deleteProject = async(projectId: string) => {
    if (!userId) return
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      setProjects(projects.filter(project => project.id !== projectId))
    }
  }

  const startEditing = (projectId: string, currentName: string) => {
    setEditingProjectId(projectId)
    setEditedName(currentName)
  }

  const handleEditSubmit = async (projectId: string) => {
    if (!userId || !editedName.trim()) return
    
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editedName.trim() })
    })

    if (res.ok) {
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, name: editedName.trim() }
          : project
      ))
      setEditingProjectId(null)
      setEditedName("")
    }
  }

  const cancelEditing = () => {
    setEditingProjectId(null)
    setEditedName("")
  }

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <div className="flex justify-between items-center align-middle text-center">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      <AddProjectDialog/>
        
      
    </div>
      {projectsLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`cursor-pointer p-2 rounded flex justify-between ${
                selectedProject === project.id ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
            >
              {editingProjectId === project.id ? (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-8"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSubmit(project.id)}
                      className="p-1 h-8 hover:bg-green-100 text-green-500 transition-colors hover:text-green-500"
                    >
                      {/* ✓ */}
                      <Check/>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      className="p-1 h-8"
                    >
                      {/* ✕ */}
                      <X/>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <span onClick={() => setSelectedProject(project.id)}>
                    {project.name}
                  </span>
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(project.id, project.name)}
                      className="p-2 rounded-md"
                    >
                      <Edit2 className="h-4 w-4"/>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="p-2 rounded-md hover:bg-red-100 text-red-500 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
        <form onSubmit={addProject} className="space-y-2">
          <Input
            type="text"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ name: e.target.value })}
          />
          <Button type="submit">Add Project</Button>
        </form>
      </div> */}
    </div>
  )
}

export default Sidebar