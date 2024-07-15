import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/a", (req, res) => res.status(201));
router.get("/b", (req, res) => res.status(202));
router.get("/c", (req, res) => res.status(203));
router.get("/d", (req, res) => res.status(204));
router.get("/e", (req, res) => res.status(205));
router.get("/f", (req, res) => res.status(206));

api.use("/api/", router);

export const handler = serverless(api);