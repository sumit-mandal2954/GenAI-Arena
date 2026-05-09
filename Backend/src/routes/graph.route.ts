import { Router } from "express";
import { getGraphData, judgeOnly } from "../controller/graph.controller.js";

const graphRouter = Router();

graphRouter.post('/', getGraphData);
graphRouter.post('/judge', judgeOnly);

export default graphRouter;