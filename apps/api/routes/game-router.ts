import { Router } from "express";

const router = Router();

router.post("/init", (req, res) => {
  try {
    console.log(req.body);
    res.json({ message: "Game initialized" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
