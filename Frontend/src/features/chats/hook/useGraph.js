import { useDispatch } from "react-redux";
import {
  appendAi1Response,
  appendAi2Response,
  setAi1Response,
  setAi2Response,
  setError,
  setJudgeResult,
  setLoadingJudge,
  setLoadingResponses,
  setUserMessage,
} from "../chat.slice";
import { runGraphStream } from "../service/graph.api";

// 🔥 keep track of active stream globally inside hook file
let currentStream = null;

export function useGraph() {
  const dispatch = useDispatch();

  function handleUserMessageChange(message) {
    dispatch(setUserMessage(message));
  }

  async function handlerunGraph(userMessage) {
    try {
      // 🔥 Close previous stream (IMPORTANT)
      if (currentStream) {
        currentStream.close();
      }

      // 🔥 Reset state
      dispatch(setUserMessage(userMessage));
      dispatch(setLoadingResponses(true));
      dispatch(setLoadingJudge(true)); // 🔥 Judge will run automatically after solutions
      dispatch(setJudgeResult(null));
      dispatch(setAi1Response(""));
      dispatch(setAi2Response(""));
      dispatch(setError(null));

      const es = await runGraphStream(userMessage, {
        onEvent: (event) => {

          if (!event || typeof event !== "object") return;

          // =========================
          // 🔥 TOKEN STREAMING
          // =========================
          if (event.type === "token") {
            const node = String(event.node || "").toLowerCase();
            const content = event.content || "";

            if (node.includes("solution_1") || node.includes("ai1") || node.includes("ai-1")) {
              dispatch(appendAi1Response(content));
              return;
            }

            if (node.includes("solution_2") || node.includes("ai2") || node.includes("ai-2")) {
              dispatch(appendAi2Response(content));
              return;
            }

            // Fallback: check if it looks like solution content
            if (content.length > 5) {
              dispatch(appendAi1Response(content));
            }

            return;
          }

          // =========================
          // 🔥 FINAL JUDGE RESULT
          // =========================
          if (event.type === "final" || event.type === "judge") {
            const judge = event.content || event;

            const scoreAI1 = judge?.solution_1_score ?? null;
            const scoreAI2 = judge?.solution_2_score ?? null;

            const winner =
              scoreAI1 === null || scoreAI2 === null
                ? null
                : scoreAI1 === scoreAI2
                  ? "Tie"
                  : scoreAI1 > scoreAI2
                    ? "AI-1"
                    : "AI-2";

            const reasonParts = [];
            if (judge?.solution_1_reason) {
              reasonParts.push(`AI-1: ${judge.solution_1_reason}`);
            }
            if (judge?.solution_2_reason) {
              reasonParts.push(`AI-2: ${judge.solution_2_reason}`);
            }

            dispatch(
              setJudgeResult({
                scoreAI1,
                scoreAI2,
                winner,
                reason: reasonParts.join(" "),
              })
            );

            // 🔥 stop loading
            dispatch(setLoadingJudge(false));
            dispatch(setLoadingResponses(false));

            // 🔥 close stream
            es.close();
            currentStream = null;

            return;
          }

          // =========================
          // 🔥 STREAMING COMPLETE SIGNAL
          // =========================
          if (event.type === "done") {
            
            // 🔥 stop loading responses
            dispatch(setLoadingResponses(false));
            dispatch(setLoadingJudge(false));

            // 🔥 close stream
            es.close();
            currentStream = null;

            return;
          }

          // =========================
          // 🔥 FINAL SOLUTIONS
          // =========================
          if (event.type === "solution") {
            const solution = event.content || event;
            if (solution?.solution_1) {
              dispatch(setAi1Response(solution.solution_1));
            }
            if (solution?.solution_2) {
              dispatch(setAi2Response(solution.solution_2));
            }
            return;
          }

          if (event.solution_1 || event.solution_2) {
            if (event.solution_1) dispatch(setAi1Response(event.solution_1));
            if (event.solution_2) dispatch(setAi2Response(event.solution_2));
            return;
          }

          // =========================
          // 🔥 ERROR HANDLING
          // =========================
          if (event.type === "error") {
            dispatch(setError(event.message || "Something went wrong"));

            dispatch(setLoadingJudge(false));
            dispatch(setLoadingResponses(false));

            es.close();
            currentStream = null;

            return;
          }
        },
      });

      currentStream = es;

      return es; // optional (for manual cancel button)
    } catch (error) {
      dispatch(setError(error?.message || "Unknown error"));
      dispatch(setLoadingResponses(false));
      dispatch(setLoadingJudge(false));
      throw error;
    }
  }

  async function handleJudge() {
    // 🔥 DEPRECATED: Judge now runs automatically with solutions
    // This function is kept for backward compatibility but does nothing
    console.warn("handleJudge is deprecated. Judge results are now automatically included in the stream.");
  }

  return {
    handlerunGraph,
    handleUserMessageChange,
    handleJudge, // Kept for backward compatibility
  };
}