const JudgePanel = ({ loading, result }) => {
  const winnerStyles = (winner, current) =>
    winner === current
      ? 'border-emerald-500 text-emerald-300'
      : 'border-slate-800 text-slate-300'

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
          loading 
            ? 'bg-amber-950 border border-amber-700' 
            : result 
              ? 'bg-emerald-950 border border-emerald-700'
              : 'bg-slate-800 border border-slate-700'
        }`}>
          <span className={`text-xl ${
            loading 
              ? 'animate-spin' 
              : result 
                ? 'text-emerald-400' 
                : 'text-slate-400'
          }`}>
            {loading ? '⚖️' : result ? '✓' : '⚖️'}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white tracking-wide">JUDGE VERDICT</h2>
          <p className="mt-1 text-xs text-slate-400 uppercase tracking-widest">
            {loading ? 'Evaluating responses...' : result ? 'Evaluation complete' : 'Awaiting evaluation'}
          </p>
        </div>
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
        <p className="text-xs uppercase tracking-wide text-slate-400">Reasoning</p>
        <p className="mt-2 text-sm text-slate-200">
          {result?.reason || 'Submit a problem and wait for the AI responses. The judge will automatically evaluate and provide verdicts.'}
        </p>
      </div>
    </section>
  )
}

export default JudgePanel
