import { useSelector } from "react-redux";
import Header from "./components/Header";
import ProblemInput from "./components/ProblemInput";
import ResponseCard from "./components/ResponseCard";
import JudgePanel from "./components/JudgePanel";
import { useGraph } from "./hook/useGraph";

const App = () => {
  const {
    userMessage,
    ai1Response,
    ai2Response,
    judgeResult,
    loadingResponses,
    loadingJudge,
  } = useSelector((state) => state.chat);

  const chat = useGraph();

  const handleStartBattle = async () => {
    if (!userMessage.trim()) return;

    await chat.handlerunGraph(userMessage.trim());
  };

  const handleJudge = async () => {
    if (!ai1Response || !ai2Response || judgeResult) return;

    return;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <Header />

        <ProblemInput
          problem={userMessage}
          onChange={(value) => chat.handleUserMessageChange(value)}
          onSubmit={handleStartBattle}
          loading={loadingResponses}
        />

        <section className="grid gap-6 lg:grid-cols-2">
          <ResponseCard
            title="AI-1 Response"
            content={ai1Response}
            loading={loadingResponses}
          />
          <ResponseCard
            title="AI-2 Response"
            content={ai2Response}
            loading={loadingResponses}
          />
        </section>

        <JudgePanel
          onJudge={handleJudge}
          loading={loadingJudge}
          result={judgeResult}
          disabled={loadingResponses || !ai1Response || !ai2Response}
        />
      </div>
    </div>
  );
};

export default App;
