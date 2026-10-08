import mongoose from "mongoose";

interface SessionFields {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionFields>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const SessionModel =
  (mongoose.models.Session as mongoose.Model<SessionFields> | undefined) ??
  mongoose.model<SessionFields>("Session", sessionSchema);
export default SessionModel;
