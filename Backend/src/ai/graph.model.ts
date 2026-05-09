import {
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

const solutionNode: GraphNode<typeof State> = async (State, config) => {
  let sol1 = "";
  let sol2 = "";
  let sol1Complete = false;
  let sol2Complete = false;


  // Stream and emit tokens immediately for solution 1
  const mistralPromise = (async () => {
    try {
      const stream = await mistralModel.stream(State.problem, config);
      for await (const chunk of stream) {
        const token = chunk.content;
        sol1 += token;

        // Emit immediate update through config if available
        if (config?.callbacks?.on_llm_new_token) {
          config.callbacks.on_llm_new_token(token);
        }
      }
      sol1Complete = true;
    } catch (e) {
      console.error("❌ Mistral error:", e);
      sol1Complete = true;
    }
  })();

  // Stream and emit tokens immediately for solution 2
  const coherePromise = (async () => {
    try {
      const stream = await cohereModel.stream(State.problem, config);
      for await (const chunk of stream) {
        const token = chunk.content;
        sol2 += token;

        // Emit immediate update through config if available
        if (config?.callbacks?.on_llm_new_token) {
          config.callbacks.on_llm_new_token(token);
        }
      }
      sol2Complete = true;
    } catch (e) {
      console.error("❌ Cohere error:", e);
      sol2Complete = true;
    }
  })();

  await Promise.all([mistralPromise, coherePromise]);

  return {
    solution_1: sol1,
    solution_2: sol2,
  };
};

const judgeNode: GraphNode<typeof State> = async (State, config) => {
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

  const judgeResponse = await judge.invoke(
    {
      messages: [
        new HumanMessage(`
            Problem: ${problem}
            Solution 1: ${solution_1}
            Solution 2: ${solution_2}
            Please evaluate each solution on a scale of 0 to 10, where 0 is the worst and 10 is the best. 
            Provide a score for each solution along with a brief reason for the score.
          `),
      ],
    },
    config,
  );

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

// 🔥 TRUE REAL-TIME STREAMING - Both models stream concurrently from the start
export async function* runGraph(userMessages: string) {

  try {
    let sol1 = "";
    let sol2 = "";
    let mistralDone = false;
    let cohereDone = false;
    
    // Create queues to store tokens from both models
    const mistralQueue: any[] = [];
    const cohereQueue: any[] = [];
    let mistralStarted = false;
    let cohereStarted = false;

    // Start both streams immediately without waiting
    const mistralTask = (async () => {
      try {
        
        const stream = await mistralModel.stream(userMessages);
        mistralStarted = true;
        for await (const chunk of stream) {
          const token = chunk.content;
          sol1 += token;
          mistralQueue.push({ node: "solution_1", content: token });
        }
        mistralDone = true;
      } catch (e) {
        console.error("❌ Mistral error:", e);
        mistralDone = true;
      }
    })();

    const cohereTask = (async () => {
      try {
        const stream = await cohereModel.stream(userMessages);
        cohereStarted = true;
        for await (const chunk of stream) {
          const token = chunk.content;
          sol2 += token;
          cohereQueue.push({ node: "solution_2", content: token });
        }
        cohereDone = true;
      } catch (e) {
        console.error("❌ Cohere error:", e);
        cohereDone = true;
      }
    })();

    // 🔥 Emit tokens in a fair round-robin pattern with throttling to prevent dump-all-at-once
    const TOKEN_EMIT_DELAY = 5; // ms between each token emission to smooth streaming
    while (!mistralDone || !cohereDone || mistralQueue.length > 0 || cohereQueue.length > 0) {
      // Try to emit one token from each queue in alternating order
      let emittedThisRound = false;

      if (mistralQueue.length > 0) {
        const token = mistralQueue.shift();
        yield {
          type: "token",
          ...token,
        };
        emittedThisRound = true;
        // 🔥 Add small delay to throttle and smooth the stream
        await new Promise((resolve) => setTimeout(resolve, TOKEN_EMIT_DELAY));
      }

      if (cohereQueue.length > 0) {
        const token = cohereQueue.shift();
        yield {
          type: "token",
          ...token,
        };
        emittedThisRound = true;
        // 🔥 Add small delay to throttle and smooth the stream
        await new Promise((resolve) => setTimeout(resolve, TOKEN_EMIT_DELAY));
      }

      // If nothing was emitted this round and streams are still running, wait a bit
      if (!emittedThisRound && (!mistralDone || !cohereDone)) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      // If nothing to emit and both streams are done, break
      if (!emittedThisRound && mistralDone && cohereDone) {
        break;
      }
    }


    // 🔥 Emit completion signal so frontend knows streaming is done
    yield {
      type: "done",
      content: {
        message: "Solutions streaming complete",
      },
    };

  } catch (err) {
    console.error("🔴 Error in runGraph:", err);
    throw err;
  }
}

// 🔥 JUDGE-ONLY: Run just the judge without streaming solutions
export async function* runJudgeOnly(solution_1: string, solution_2: string, problem: string = "") {

  try {
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
      systemPrompt: `You are a fair judge. Evaluate these two solutions:

${problem ? `Problem: ${problem}\n\n` : ""}
Solution 1: ${solution_1}

Solution 2: ${solution_2}

Rate each 0-10 and explain briefly.`,
    });

    const judgeResponse = await judge.invoke({
      messages: [new HumanMessage("Please evaluate the solutions above.")],
    });

    const {
      solution_1_score,
      solution_2_score,
      solution_1_reason,
      solution_2_reason,
    } = judgeResponse.structuredResponse;

    yield {
      type: "final",
      content: {
        solution_1_score,
        solution_2_score,
        solution_1_reason,
        solution_2_reason,
      },
    };
  } catch (err) {
    console.error("🔴 Judge error:", err);
    yield {
      type: "final",
      content: {
        solution_1_score: null,
        solution_2_score: null,
        solution_1_reason: "Error",
        solution_2_reason: String(err),
      },
    };
  }
}
