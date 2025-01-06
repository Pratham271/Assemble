import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddTaskDialogProps {
  onAddTask: (title: string, description: string) => void
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTask(title, description)
    setTitle('')
    setDescription('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Add New Task</Button>
      <DialogContent className="sm:max-w-7xl w-full sm:h-[calc(100vh-4rem)] sm:max-h-full mx-12 my-2 p-6">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 py-2 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle>Add New Task</DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-4 space-y-4">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task description (Use • or - for bullet points)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[200px]"
            />
            <Button type="submit" className="w-full">Add Task</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

