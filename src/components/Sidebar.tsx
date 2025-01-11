import { Edit2, Loader, Trash, Trash2 } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useTaskStore } from '@/store/useTaskStore'

const Sidebar = ({addProject, userId}:{addProject:(e:React.FormEvent)=>void, userId:string}) => {
    const { projects, setProjects,  selectedProject, setSelectedProject, newProject, setNewProject, projectsLoading } = useTaskStore()


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


  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
    <h2 className="text-xl font-semibold mb-4">Projects</h2>
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
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}

            <div className="flex justify-between">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteProject(project.id)}
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
          </li>
        ))}
      </ul>
    )}
    <div className="mt-4">
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
    </div>
  </div>
  )
}

export default Sidebar
