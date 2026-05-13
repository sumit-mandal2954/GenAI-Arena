import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { useEffect, useRef } from "react";

const ResponseCard = ({ title, content, loading }) => {
  const scrollContainerRef = useRef(null);

  // 🔥 Autoscroll to bottom when content updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [content, loading]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
      <div 
        ref={scrollContainerRef}
        className="mt-4 text-sm text-slate-100 overflow-y-auto max-h-[600px] scrollbar-hide"
      >
        {content ? (
          <ReactMarkdown 
            rehypePlugins={[rehypeHighlight]}
            className="prose prose-invert max-w-none"
          >
            {content}
          </ReactMarkdown>
        ) : null}
        {loading && <p className="mt-3 text-slate-400">Generating response...</p>}
        {!loading && !content && <p className="text-slate-500">No response yet.</p>}
      </div>
    </div>
  )
}

export default ResponseCard
