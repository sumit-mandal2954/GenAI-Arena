import type { Request, Response } from "express";
import { runGraph } from "../ai/graph.model.js";

export async function getGraphData(req: Request, res: Response) {
  try {
    const { userMessage } = req.body as { userMessage?: string };
    if (!userMessage) {
      res.status(400).json({ error: "userMessage is required" });
      return;
    }
    const result = await runGraph(userMessage);
    console.log(result)
    res.status(200).json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
