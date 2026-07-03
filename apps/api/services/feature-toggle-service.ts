import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";

import type mongoose from "mongoose";

import FeatureToggle from "../schemas/feature-toggle-schema";

export type FeatureToggleOutput = {
  name: FeatureToggleName;
  enabled: boolean;
};

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES) as FeatureToggleName[];

const toPublicFeatureToggle = (doc: mongoose.Document): FeatureToggleOutput => {
  const json = doc.toJSON() as FeatureToggleOutput;
  return {
    name: json.name,
    enabled: json.enabled,
  };
};

export const FeatureToggleService = {
  listFeatureToggles: async (): Promise<FeatureToggleOutput[]> => {
    const docs = await FeatureToggle.find({ name: { $in: FEATURE_TOGGLE_NAMES } });
    const storedByName = new Map(
      docs.map((doc) => {
        const toggle = toPublicFeatureToggle(doc);
        return [toggle.name, toggle.enabled] as const;
      }),
    );

    return FEATURE_TOGGLE_NAMES.map((name) => ({
      name,
      enabled: storedByName.get(name) ?? FEATURE_TOGGLES[name],
    }));
  },

  setFeatureToggle: async (
    name: FeatureToggleName,
    enabled: boolean,
  ): Promise<FeatureToggleOutput> => {
    const doc = await FeatureToggle.findOneAndUpdate(
      { name },
      { $set: { enabled } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return toPublicFeatureToggle(doc);
  },
};
