import { Router } from "express";
import { getGraphData } from "../controller/graph.controller.js";

const graphRouter = Router();

graphRouter.post('/', getGraphData);

export default graphRouter;
