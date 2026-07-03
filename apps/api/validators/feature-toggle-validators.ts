import { FEATURE_TOGGLES } from "@belot/constants";

import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES);

function sendValidationErrors(req: Request, res: Response, next: NextFunction): Response | void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const FeatureToggleValidators = {
  updateFeatureToggle: [
    param("name")
      .isString()
      .isIn(FEATURE_TOGGLE_NAMES)
      .withMessage("name must be a known feature toggle"),
    body().custom((bodyValue: Record<string, unknown>) => {
      const keys = Object.keys(bodyValue ?? {});
      const unknown = keys.filter((key) => key !== "enabled");
      if (unknown.length > 0) {
        throw new Error(`Unknown fields: ${unknown.join(", ")}`);
      }
      if (!keys.includes("enabled")) {
        throw new Error("enabled is required");
      }
      return true;
    }),
    body("enabled").isBoolean({ strict: true }).withMessage("enabled must be a boolean"),
    sendValidationErrors,
  ],
};
