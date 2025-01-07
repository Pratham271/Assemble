import { Loader } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useTaskStore } from '@/store/useTaskStore'

const Sidebar = ({addProject}:{addProject:(e:React.FormEvent)=>void}) => {
    const { projects, setProjects,  selectedProject, setSelectedProject, newProject, setNewProject, projectsLoading } = useTaskStore()

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
            className={`cursor-pointer p-2 rounded ${
              selectedProject === project.id ? 'bg-blue-200' : 'hover:bg-gray-200'
            }`}
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}
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
