import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from '../ui/label'
import { Calendar } from '../ui/calendar'
import { useTaskStore } from '@/store/useTaskStore'
import { RichTextEditor } from '../ui/rich-text-editor'

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl h-[85vh] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Task</DialogTitle>
          <DialogDescription className="text-base">
            Create a new task for your project. Click save when you&apos;re done.
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
              <div className="col-span-3">
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Add your task description here..."
                />
              </div>
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

