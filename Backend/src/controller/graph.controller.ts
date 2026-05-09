import type { Request, Response } from "express";
import { runGraph, runJudgeOnly } from "../ai/graph.model.js";

export async function getGraphData(req: Request, res: Response) {
  try {
    const { userMessage } = req.body as { userMessage?: string };

    if (!userMessage) {
      res.status(400).json({ error: "userMessage is required" });
      return;
    }

    // ✅ SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable proxy buffering

    console.log("🔥 Starting graph stream for:", userMessage);
    const stream = runGraph(userMessage);

    let chunkCount = 0;
    for await (const chunk of stream) {
      chunkCount++;
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      
      // 🔥 Flush immediately to ensure data reaches client
      if (res.flush) {
        res.flush();
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("🔴 Error in getGraphData:", message, error);
    res.status(500).json({ error: message });
  }
}

export async function judgeOnly(req: Request, res: Response) {
  try {
    const { solution_1, solution_2, userMessage } = req.body as { 
      solution_1?: string; 
      solution_2?: string;
      userMessage?: string;
    };

    if (!solution_1 || !solution_2) {
      res.status(400).json({ error: "solution_1 and solution_2 are required" });
      return;
    }

    // ✅ SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable proxy buffering

    console.log("🏛️ Starting judge-only for solutions");
    const stream = runJudgeOnly(solution_1, solution_2, userMessage || "");

    let chunkCount = 0;
    for await (const chunk of stream) {
      chunkCount++;
      console.log(`📊 Judge Chunk ${chunkCount}:`, JSON.stringify(chunk).substring(0, 100));
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      
      // 🔥 Flush immediately
      if (res.flush) {
        res.flush();
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("🔴 Error in judgeOnly:", message, error);
    res.status(500).json({ error: message });
  }
}