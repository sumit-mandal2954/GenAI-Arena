import {
    CompiledStateGraph,
  END,
  START,
  StateGraph,
  StateSchema,
  type GraphNode,
} from "@langchain/langgraph";
import { z } from "zod";
import { cohereModel, googleModel, mistralModel } from "./ai.model.js";
import { createAgent, HumanMessage, providerStrategy } from "langchain";

const State = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge_recommendation: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_reason: z.string().default(""),
    solution_2_reason: z.string().default(""),
  }),
});

const solutionNode: GraphNode<typeof State> = async (State) => {
  const [mistralSolution, cohereSolution] = await Promise.all([
    mistralModel.invoke(State.problem),
    cohereModel.invoke(State.problem),
  ]);

  return {
    solution_1: mistralSolution.text,
    solution_2: cohereSolution.text,
  };
};

const judgeNode: GraphNode<typeof State> = async (State) => {
  const { problem, solution_1, solution_2 } = State;

  const judge = createAgent({
    model: googleModel,
    tools: [],
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reason: z.string(),
        solution_2_reason: z.string(),
      }),
    ),

    systemPrompt: `You are a judge tasked with evaluating two solutions to a problem.
                    The problem is: ${State.problem} 
                    Here are the two solutions:
                    Solution 1: ${solution_1}
                    Solution 2: ${solution_2}
                    Please evaluate each solution on a scale of 0 to 10, where 0 is the worst and 10 is the best. 
                    Provide a score for each solution along with a brief reason for the score.`,
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
            Problem: ${problem}
            Solution 1: ${solution_1}
            Solution 2: ${solution_2}
            Please evaluate each solution on a scale of 0 to 10, where 0 is the worst and 10 is the best. 
            Provide a score for each solution along with a brief reason for the score.
          `),
    ],
  });

  const {
    solution_1_score,
    solution_2_score,
    solution_1_reason,
    solution_2_reason,
  } = judgeResponse.structuredResponse;

  return {
    judge_recommendation: {
      solution_1_score,
      solution_2_score,
      solution_1_reason,
      solution_2_reason,
    },
  };
};

const graph = new StateGraph(State)
  .addNode("solutionNode", solutionNode)
  .addNode("judgeNode", judgeNode)
  .addEdge(START, "solutionNode")
  .addEdge("solutionNode", "judgeNode")
  .addEdge("judgeNode", END)
  .compile();

export default graph;

export async function runGraph(userMessages: string) {
  const result = await graph.invoke({
    problem: userMessages,
  });
  return result;
}
