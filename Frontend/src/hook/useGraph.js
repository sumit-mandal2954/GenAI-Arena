import { useDispatch } from "react-redux";
import {
  setAi1Response,
  setAi2Response,
  setError,
  setJudgeResult,
  setLoadingJudge,
  setLoadingResponses,
  setUserMessage,
} from "../chat.slice";
import { runGraph } from "../service/graph.api";

export function useGraph() {
  const dispatch = useDispatch();

  function handleUserMessageChange(message) {
    dispatch(setUserMessage(message));
  }

  async function handlerunGraph(userMessage) {
    try {
      dispatch(setUserMessage(userMessage));
      dispatch(setLoadingResponses(true));
      dispatch(setJudgeResult(null));
      dispatch(setAi1Response(""));
      dispatch(setAi2Response(""));
      const response = await runGraph(userMessage);
      dispatch(setAi1Response(response?.solution_1 || ""));
      dispatch(setAi2Response(response?.solution_2 || ""));
      const scoreAI1 = response?.judge_recommendation?.solution_1_score ?? null;
      const scoreAI2 = response?.judge_recommendation?.solution_2_score ?? null;
      dispatch(setLoadingJudge(true));
      const winner =
        scoreAI1 === null || scoreAI2 === null
          ? null
          : scoreAI1 === scoreAI2
            ? "Tie"
            : scoreAI1 > scoreAI2
              ? "AI-1"
              : "AI-2";

      const reasonParts = [];
      if (response?.judge_recommendation?.solution_1_reason) {
        reasonParts.push(
          `AI-1: ${response.judge_recommendation.solution_1_reason}`,
        );
      }
      if (response?.judge_recommendation?.solution_2_reason) {
        reasonParts.push(
          `AI-2: ${response.judge_recommendation.solution_2_reason}`,
        );
      }

      dispatch(
        setJudgeResult({
          scoreAI1,
          scoreAI2,
          winner,
          reason: reasonParts.join(" "),
        }),
      );
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoadingResponses(false));
      dispatch(setLoadingJudge(false));
    }
  }
  return { handlerunGraph, handleUserMessageChange };
}
