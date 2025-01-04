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

    // Actions
    setTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],

    // State setters
    setTasks: (tasks) => set({ tasks }),
    
}))