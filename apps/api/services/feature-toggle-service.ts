import { pool } from "../config/postgres.js";
import { NotFoundError } from "../errors/api-error.js";

export const FeatureToggleService = {
  createFeatureToggle: async (name: string): Promise<void> => {
    await pool.query("INSERT INTO feature_toggles (name) VALUES ($1)", [name]);
  },
  isFeatureEnabled: async (name: string): Promise<boolean> => {
    const toggle = await FeatureToggleService.getFeatureToggleByName(name);
    if (!toggle) throw new NotFoundError(`Feature toggle '${name}' not found`);
    return toggle.enabled;
  },
  toggleFeature: async (name: string, enabled: boolean): Promise<void> => {
    await pool.query("UPDATE feature_toggles SET enabled = $2 WHERE name = $1", [name, enabled]);
  },
  getAllFeatureToggles: async (): Promise<{ name: string; enabled: boolean }[]> =>
    (
      await pool.query<{ name: string; enabled: boolean }>(
        "SELECT name, enabled FROM feature_toggles ORDER BY name",
      )
    ).rows,
  getFeatureToggleByName: async (
    name: string,
  ): Promise<{ name: string; enabled: boolean } | null> =>
    (
      await pool.query<{ name: string; enabled: boolean }>(
        "SELECT name, enabled FROM feature_toggles WHERE name = $1",
        [name],
      )
    ).rows[0] ?? null,
};
