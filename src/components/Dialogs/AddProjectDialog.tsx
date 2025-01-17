'use client';
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { SquarePen } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import { useSession } from 'next-auth/react';

const AddProjectDialog = () => {
    const {addProject, newProject, setNewProject} = useTaskStore() 
    const session = useSession()
  
    const onSubmit = (e:React.FormEvent) => {
        e.preventDefault()
        // @ts-ignore
        addProject(session.data?.user?.id)
        
    }
  return (
    <Dialog>
    <DialogTrigger asChild>
      <button 
        className="p-0 h-auto w-auto hover:bg-transparent"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-md hover:bg-gray-200">
                <SquarePen className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input 
            id="name" 
            placeholder="Pedro Duarte" 
            className="col-span-3" 
            value={newProject.name}
            onChange={(e) => setNewProject({ name: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter className="flex justify-between">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={onSubmit}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default AddProjectDialog
