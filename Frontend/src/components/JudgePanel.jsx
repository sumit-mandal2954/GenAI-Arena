const JudgePanel = ({ onJudge, loading, result, disabled }) => {
  const winnerStyles = (winner, current) =>
    winner === current
      ? 'border-emerald-500 text-emerald-300'
      : 'border-slate-800 text-slate-300'

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Judge Verdict</h2>
          <p className="mt-1 text-sm text-slate-400">
            The judge evaluates both responses and picks a winner.
          </p>
        </div>
        <button
          type="button"
          onClick={onJudge}
          disabled={disabled || loading}
          className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-2 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Judging...' : 'Judge'}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className={`rounded-xl border p-4 ${winnerStyles(result?.winner, 'AI-1')}`}>
          <p className="text-xs uppercase tracking-wide">Score AI-1</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {result ? result.scoreAI1 : '--'}
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${winnerStyles(result?.winner, 'AI-2')}`}>
          <p className="text-xs uppercase tracking-wide">Score AI-2</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {result ? result.scoreAI2 : '--'}
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${winnerStyles(result?.winner, result?.winner)}`}>
          <p className="text-xs uppercase tracking-wide">Winner</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {result ? result.winner : '--'}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Reason</p>
        <p className="mt-2 text-sm text-slate-200">
          {result?.reason || 'No verdict yet. Judge the responses to see the reasoning.'}
        </p>
      </div>
    </section>
  )
}

export default JudgePanel
