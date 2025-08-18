'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, Strikethrough } from 'lucide-react';

const TiptapEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (reason: string) => void;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class:
          'rounded-md border min-h-[150px] border-input bg-back p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]">
      <div className="flex items-center gap-4 rounded-t-lg border bg-card p-4">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive('strike') ? 'is-active' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
