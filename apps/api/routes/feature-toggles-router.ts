import { type FeatureToggleName } from "@belot/constants";

import { type IRouter, Router } from "express";

import { FeatureToggleService } from "../services/feature-toggle-service";
import { FeatureToggleValidators } from "../validators/feature-toggle-validators";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  try {
    const toggles = await FeatureToggleService.listFeatureToggles();
    res.json({ toggles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:name", ...FeatureToggleValidators.updateFeatureToggle, async (req, res) => {
  try {
    const body = req.body as { enabled: boolean };
    const toggle = await FeatureToggleService.setFeatureToggle(
      req.params.name as FeatureToggleName,
      body.enabled,
    );
    res.json(toggle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
