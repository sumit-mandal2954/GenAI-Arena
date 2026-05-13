import type { Request, Response } from "express";
import { runGraph } from "../ai/graph.model.js";

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
    res.status(500).json({ error: message });
  }
}

