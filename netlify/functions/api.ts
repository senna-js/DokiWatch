import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/a", (req, res) => res.send("api/a/master.m3u8"));
router.get("/b", (req, res) => res.send("api/b/master.m3u8"));
router.get("/c", (req, res) => res.send("api/c/master.m3u8"));
router.get("/d", (req, res) => res.send("api/d/master.m3u8"));
router.get("/e", (req, res) => res.send("api/e/master.m3u8"));
router.get("/f", (req, res) => res.send("api/f/master.m3u8"));

api.use("/api/", router);

export const handler = serverless(api);