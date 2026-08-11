import { NotFoundError } from "../errors/api-error.js";
import FeatureToggle from "../schemas/feature-toggle-schema.js";

export const FeatureToggleService = {
  createFeatureToggle: async (featureName: string): Promise<void> => {
    await FeatureToggle.create({ name: featureName, enabled: false });
  },

  isFeatureEnabled: async (featureName: string): Promise<boolean> => {
    const featureToggle = await FeatureToggle.findOne({ name: featureName });

    if (!featureToggle) {
      throw new NotFoundError(`Feature toggle '${featureName}' not found`);
    }

    return featureToggle.enabled;
  },

  toggleFeature: async (featureName: string, enabled: boolean): Promise<void> => {
    await FeatureToggle.updateOne({ name: featureName }, { $set: { enabled } });
  },

  getAllFeatureToggles: async (): Promise<{ name: string; enabled: boolean }[]> => {
    const featureToggles = await FeatureToggle.find();
    return featureToggles.map((toggle) => ({ name: toggle.name, enabled: toggle.enabled }));
  },

  getFeatureToggleByName: async (
    featureName: string,
  ): Promise<{ name: string; enabled: boolean } | null> => {
    const featureToggle = await FeatureToggle.findOne({ name: featureName });

    if (!featureToggle) {
      return null;
    }

    return { name: featureToggle.name, enabled: featureToggle.enabled };
  },
};
