import { create } from 'zustand'

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

type NewProject = {
    name: string
}

type TaskStore = {
    tasks: Task[],
    projectsLoading: boolean,
    projects: Project[],
    selectedProject: string | null,
    newProject: NewProject

    // Actions
    setTasks: (tasks: Task[]) => void,
    setProjectsLoading: (projectsLoading: boolean) => void
    setProjects: (projects: Project[]) => void
    setSelectedProject: (selectedProject: string | null) => void,
    setNewProject: (newProject: NewProject) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    projectsLoading: false,
    projects: [],
    selectedProject: null,
    newProject: {name: ''},
    // State setters
    setTasks: (tasks) => set({ tasks }),
    setProjectsLoading: (projectsLoading) => set({projectsLoading}),
    setProjects: (projects) => set({ projects }),
    setSelectedProject: (selectedProject) => set({ selectedProject }),
    setNewProject: (newProject) => set({ newProject })
    
}))