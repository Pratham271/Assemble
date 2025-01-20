import { Pencil } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '../ui/label'
import { Calendar } from '../ui/calendar'
import { useTaskStore } from '@/store/useTaskStore'




const EditTaskDialog = () => {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const {selectedDate, setSelectedDate} = useTaskStore()


    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Add edit functionality here */}}
            className="p-2 rounded-md hover:bg-blue-100 text-blue-500 transition-colors hover:text-blue-600"
        >
            <Pencil className="h-4 w-4"/>
        </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-3xl h-[85vh] max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Update Task</DialogTitle>
        <DialogDescription className="text-base">
         Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <form  className="">
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

export default EditTaskDialog
