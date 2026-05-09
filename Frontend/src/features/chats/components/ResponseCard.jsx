import ReactMarkdown from "react-markdown";

const ResponseCard = ({ title, content, loading }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h3>
      <div className="mt-4 text-sm text-slate-100 overflow-y-auto max-h-[600px]">
        {content ? <ReactMarkdown>{content}</ReactMarkdown> : null}
        {loading && <p className="mt-3 text-slate-400">Generating response...</p>}
        {!loading && !content && <p className="text-slate-500">No response yet.</p>}
      </div>
    </div>
  )
}

export default ResponseCard
