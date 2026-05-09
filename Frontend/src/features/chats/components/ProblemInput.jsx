const ProblemInput = ({ problem, onChange, onSubmit, loading }) => {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <label className="block text-sm font-medium text-slate-200" htmlFor="problem">
        Problem Statement
      </label>
      <textarea
        id="problem"
        value={problem}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe the problem you want the AIs to solve..."
        className="mt-3 min-h-[180px] w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-700"
      />
      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !problem.trim()}
          className="rounded-xl border border-slate-700 bg-white px-5 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Start Battle'}
        </button>
      </div>
    </section>
  )
}

export default ProblemInput
