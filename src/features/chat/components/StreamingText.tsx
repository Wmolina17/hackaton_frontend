import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
}


const MARKDOWN_COMPONENTS: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold" style={{ color: '#0f172a' }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: 'rgba(15,23,42,0.8)' }}>{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <pre className="rounded-lg p-3 overflow-x-auto text-xs" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
          <code>{children}</code>
        </pre>
      )
    }
    return (
      <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}>
        {children}
      </code>
    )
  },
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="text-sm">{children}</li>,
  h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold mb-1.5">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
}

export function StreamingText({ content }: StreamingTextProps) {
  if (!content) return null

  const hasMarkdown = /[*_`#\[\]>-]/.test(content)

  if (!hasMarkdown) {
    return (
      <span className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#0f172a' }}>
        {content}
      </span>
    )
  }

  return (
    <div
      className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed"
      style={{ color: '#0f172a' }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
