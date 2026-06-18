import mongoose, { Document, Model } from "mongoose";

export interface ISimulationAttempt extends Document {
  candidateId: mongoose.Schema.Types.ObjectId;
  status: "IN_PROGRESS" | "COMPLETED" | "TERMINATED";
  startedAt: Date;
  completedAt?: Date;
  warningCount: number;
  warningEvents: {
    timestamp: Date;
    reason: string;
  }[];
}

const SimulationAttemptSchema = new mongoose.Schema<ISimulationAttempt>(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "TERMINATED"],
      default: "IN_PROGRESS",
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    warningCount: { type: Number, default: 0 },
    warningEvents: [
      {
        timestamp: { type: Date, default: Date.now },
        reason: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const SimulationAttempt: Model<ISimulationAttempt> =
  mongoose.models.SimulationAttempt ||
  mongoose.model<ISimulationAttempt>("SimulationAttempt", SimulationAttemptSchema);
