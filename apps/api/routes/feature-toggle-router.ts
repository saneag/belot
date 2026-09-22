import { type IRouter, Router } from "express";

import { HttpStatus } from "../constants/http-status.js";
import { BadRequestError } from "../errors/api-error.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { sendApiError } from "../middleware/error-handler.js";
import { FeatureToggleService } from "../services/feature-toggle-service.js";

const router: IRouter = Router();

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

router.get("/", async (_req, res) => {
  try {
    const featureToggles = await FeatureToggleService.getAllFeatureToggles();
    res.status(HttpStatus.OK).json(featureToggles);
  } catch (error) {
    sendApiError(error, res);
  }
});

router.get("/isEnabled", async (req, res) => {
  try {
    const featureName = req.query.name;

    if (typeof featureName !== "string" || !featureName.trim()) {
      throw new BadRequestError("Feature name is required");
    }

    const normalizedFeatureName = featureName.trim();
    const isEnabled = await FeatureToggleService.isFeatureEnabled(normalizedFeatureName);
    res.status(HttpStatus.OK).json({ feature: normalizedFeatureName, enabled: isEnabled });
  } catch (error) {
    sendApiError(error, res);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!isJsonObject(req.body)) {
      throw new BadRequestError("Request body must be a valid JSON object");
    }

    if (!("name" in req.body)) {
      throw new BadRequestError("Feature name is required");
    }

    const { name, enabled } = req.body as { name: string; enabled?: boolean };

    if (typeof name !== "string" || !name.trim()) {
      throw new BadRequestError("Feature name must be a non-empty string");
    }

    const normalizedFeatureName = name.trim();
    const featureToggle = await FeatureToggleService.getFeatureToggleByName(normalizedFeatureName);

    if (featureToggle) {
      throw new BadRequestError(`Feature toggle '${normalizedFeatureName}' already exists`);
    }

    if (enabled === undefined) {
      await FeatureToggleService.createFeatureToggle(normalizedFeatureName);
    } else {
      await FeatureToggleService.createFeatureToggle(normalizedFeatureName, enabled);
    }
    res
      .status(HttpStatus.CREATED)
      .json({ message: `Feature '${normalizedFeatureName}' has been created` });
  } catch (error) {
    sendApiError(error, res);
  }
});

router.post("/toggle", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!isJsonObject(req.body)) {
      throw new BadRequestError("Request body must be a valid JSON object");
    }

    const { name, enabled } = req.body as { name: string; enabled: boolean };

    if (typeof name !== "string" || !name.trim()) {
      throw new BadRequestError("Feature name must be a non-empty string");
    }

    if (typeof enabled !== "boolean") {
      throw new BadRequestError("Enabled must be a boolean value");
    }

    const normalizedFeatureName = name.trim();
    const featureToggle = await FeatureToggleService.getFeatureToggleByName(normalizedFeatureName);

    if (!featureToggle) {
      throw new BadRequestError(`Feature toggle '${normalizedFeatureName}' does not exist`);
    }

    if (featureToggle.enabled === enabled) {
      res.status(HttpStatus.OK).json({
        message: `Feature '${normalizedFeatureName}' is already ${
          enabled ? "enabled" : "disabled"
        }`,
      });
      return;
    }

    await FeatureToggleService.toggleFeature(normalizedFeatureName, enabled);
    res.status(HttpStatus.OK).json({
      message: `Feature '${normalizedFeatureName}' has been ${enabled ? "enabled" : "disabled"}`,
    });
  } catch (error) {
    sendApiError(error, res);
  }
});

export default router;
