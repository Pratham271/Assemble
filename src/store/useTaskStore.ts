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
    setSelectedProject: (selectedProject: string | null) => void
    setNewProject: (newProject: NewProject) => void
    setSelectedDate: (selectedDate: Date | undefined) => void
    fetchProjects: (userId: string) => Promise<void>
    addProject: (userId:string) => Promise<void>
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
    setSelectedDate: (selectedDate) => set({ selectedDate }),
    fetchProjects: async (userId) => {
        // const res = await fetch(`/api/projects?userId=${userId}`)
        // if (res.ok) {
        //   const data = await res.json()
        //   set({ projects: data })
        // }
        try {
                if (!userId) return
                set({projectsLoading: true})
                const res = await fetch(`/api/projects?userId=${userId}`)
                if (res.ok) {
                  const data = await res.json()
                  set({projects:data})
                }
              } catch (error) {
                
              }
              finally{
                set({projectsLoading: false})
              }
      },
    addProject: async (userId) => {
        const state = get()
        if (!state.newProject.name || !userId) return
    
        // const res = await fetch('/api/projects', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ...state.newProject, userId }),
        // })
        const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  projectData:state.newProject,
                  userId
                }),
             
              })
    
        if (res.ok) {
          set({ newProject: { name: '' } })
          get().fetchProjects(userId)
        }
      },
    
}))