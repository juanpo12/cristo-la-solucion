'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface ResourceContentProps {
  content: object
}

export function ResourceContent({ content }: ResourceContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc ml-6 space-y-1' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal ml-6 space-y-1' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-church-electric-400 pl-5 py-1 italic text-gray-600 bg-church-electric-50/50 rounded-r-lg' } },
        horizontalRule: { HTMLAttributes: { class: 'my-6 border-gray-200' } },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: { class: 'font-bold text-gray-900' },
        },
        code: { HTMLAttributes: { class: 'bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800' } },
        codeBlock: { HTMLAttributes: { class: 'bg-gray-900 text-gray-100 rounded-xl p-5 font-mono text-sm overflow-x-auto' } },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'text-church-electric-600 underline hover:text-church-electric-700', target: '_blank', rel: 'noopener noreferrer' },
      }),
    ],
    immediatelyRender: false,
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return <EditorContent editor={editor} />
}
