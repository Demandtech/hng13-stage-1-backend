import { Router } from "express";
import {
  handleNewString,
  handleGetStringByValue,
  handleDeleteString,
  handleGetAllStrings,
  handleNaturalLanguageFilter,
} from "../controllers/string.controller.js";

const stringRouter = Router();

stringRouter.post("/", handleNewString);
stringRouter.get("/filter-by-natural-language", handleNaturalLanguageFilter);
stringRouter.get("/", handleGetAllStrings);
stringRouter.get("/:value", handleGetStringByValue);
stringRouter.delete("/:value", handleDeleteString);


export default stringRouter;
