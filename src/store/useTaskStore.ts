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
    newProject: NewProject,
    selectedDate: Date | undefined

    // Actions
    setTasks: (tasks: Task[]) => void,
    setProjectsLoading: (projectsLoading: boolean) => void
    setProjects: (projects: Project[]) => void
    setSelectedProject: (selectedProject: string | null) => void,
    setNewProject: (newProject: NewProject) => void
    setSelectedDate: (selectedDate: Date | undefined) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    projectsLoading: false,
    projects: [],
    selectedProject: null,
    newProject: {name: ''},
    selectedDate: new Date(),
    // State setters
    setTasks: (tasks) => set({ tasks }),
    setProjectsLoading: (projectsLoading) => set({projectsLoading}),
    setProjects: (projects) => set({ projects }),
    setSelectedProject: (selectedProject) => set({ selectedProject }),
    setNewProject: (newProject) => set({ newProject }),
    setSelectedDate: (selectedDate) => set({ selectedDate })
    
}))