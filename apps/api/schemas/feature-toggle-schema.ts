import mongoose from "mongoose";

const featureToggleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  enabled: { type: Boolean, required: true },
});

const FeatureToggle = mongoose.model("FeatureToggle", featureToggleSchema);

export default FeatureToggle;
