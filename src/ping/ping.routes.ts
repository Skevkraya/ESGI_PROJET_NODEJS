import { Router } from "express";
import { ping } from "./ping.controller.ts";

const router = Router();

router.get("/ping", ping);

export default router;
