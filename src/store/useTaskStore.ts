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

type TaskStore = {
    tasks: Task[],
    projectsLoading: boolean,
    // Actions
    setTasks: (tasks: Task[]) => void,
    setProjectsLoading: (projectsLoading: boolean) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    projectsLoading: false,
    // State setters
    setTasks: (tasks) => set({ tasks }),
    setProjectsLoading: (projectsLoading) => set({projectsLoading})
    
}))