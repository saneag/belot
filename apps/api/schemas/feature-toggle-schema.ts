import { FEATURE_TOGGLES } from "@belot/constants";

import mongoose from "mongoose";

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES);

const featureToggleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: FEATURE_TOGGLE_NAMES,
      required: true,
      unique: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

featureToggleSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
    return ret;
  },
});

const FeatureToggle = mongoose.model("FeatureToggle", featureToggleSchema);

export default FeatureToggle;
