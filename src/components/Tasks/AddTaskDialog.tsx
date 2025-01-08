import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '../ui/label'
import { Calendar } from '../ui/calendar'
import { useTaskStore } from '@/store/useTaskStore'

interface AddTaskDialogProps {
  onAddTask: (title: string, description: string) => void
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const {selectedDate, setSelectedDate} = useTaskStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTask(title, description)
    setTitle('')
    setDescription('')
    setOpen(false)
  }

  return (
    // <Dialog open={open} onOpenChange={setOpen}>
    //   <Button onClick={() => setOpen(true)}>Add New Task</Button>
    //   <DialogContent className="sm:max-w-7xl w-full sm:h-[calc(100vh-4rem)] sm:max-h-full mx-12 my-2 p-6">
    //     <div className="flex flex-col h-full">
    //       <DialogHeader className="px-4 py-2 border-b">
    //         <div className="flex justify-between items-center">
    //           <DialogTitle>Add New Task</DialogTitle>
    //         </div>
    //       </DialogHeader>
    //       <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-4 space-y-4">
    //         <Input
    //           placeholder="Task title"
    //           value={title}
    //           onChange={(e) => setTitle(e.target.value)}
    //         />
    //         <Textarea
    //           placeholder="Task description (Use • or - for bullet points)"
    //           value={description}
    //           onChange={(e) => setDescription(e.target.value)}
    //           className="min-h-[200px]"
    //         />
        
              

             
    //             <Calendar
    //               mode="single"
               
    //               className="rounded-md border"
    //             />
              
    //         <Button type="submit" className="w-full">Add Task</Button>
    //       </form>
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="default">Add Task</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-3xl h-[85vh] max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Add New Task</DialogTitle>
        <DialogDescription className="text-base">
          Create a new task for your project. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="">
        <div className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="title" className="text-right font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-6">
            <Label htmlFor="description" className="text-right font-medium pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Task description (Use • or - for bullet points)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[200px]"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-6">
            <Label htmlFor="dueDate" className="text-right font-medium pt-2">
              Due Date
            </Label>
            <div className="col-span-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border bg-white p-3"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-8">
          <Button type="submit" size="lg">Save Task</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  )
}

