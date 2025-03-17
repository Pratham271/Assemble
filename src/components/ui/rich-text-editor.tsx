'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from './button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Heading1, 
  Heading2, 
  Strikethrough,
  Code
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const RichTextEditor = ({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ 
    isActive, 
    onClick, 
    children 
  }: { 
    isActive: boolean
    onClick: () => void
    children: React.ReactNode 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'p-2 h-8 w-8',
        isActive && 'bg-accent text-accent-foreground'
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )

  return (
    <div className="relative">
      <div className="border rounded-t-md p-2 flex gap-1 bg-muted/50 border-b-0">
        <ToolbarButton
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-full bg-border mx-1" />
        <ToolbarButton
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-full bg-border mx-1" />
        <ToolbarButton
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive('taskList')}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquare className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] rounded-b-md border bg-background p-3 focus-within:outline-none prose prose-sm max-w-none"
      />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'p-1 h-8 w-8',
                editor.isActive('bold') && 'bg-accent text-accent-foreground'
              )}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'p-1 h-8 w-8',
                editor.isActive('italic') && 'bg-accent text-accent-foreground'
              )}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'p-1 h-8 w-8',
                editor.isActive('strike') && 'bg-accent text-accent-foreground'
              )}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  )
}

export { RichTextEditor } 