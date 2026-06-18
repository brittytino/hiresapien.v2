import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISimulationResult extends Document {
  candidateId: mongoose.Schema.Types.ObjectId;
  attemptId: mongoose.Schema.Types.ObjectId;
  overallScore: number;
  competencyScores: {
    ProblemFraming: number;
    DataLiteracy: number;
    AnalyticalReasoning: number;
    RootCauseAnalysis: number;
    Prioritization: number;
    BusinessThinking: number;
    DataQualityAwareness: number;
    Communication: number;
  };
  readinessLevel: string;
  archetype?: string;
  strengths?: string[];
  improvements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SimulationResultSchema = new Schema<ISimulationResult>(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
      index: true,
    },
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SimulationAttempt",
      required: true,
      unique: true,
    },
    overallScore: { type: Number, default: 0 },
    competencyScores: {
      ProblemFraming: { type: Number, default: 0 },
      DataLiteracy: { type: Number, default: 0 },
      AnalyticalReasoning: { type: Number, default: 0 },
      RootCauseAnalysis: { type: Number, default: 0 },
      Prioritization: { type: Number, default: 0 },
      BusinessThinking: { type: Number, default: 0 },
      DataQualityAwareness: { type: Number, default: 0 },
      Communication: { type: Number, default: 0 },
    },
    readinessLevel: { type: String, default: "Explorer" },
    archetype: { type: String },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
  },
  { timestamps: true }
);

export const SimulationResult: Model<ISimulationResult> =
  mongoose.models.SimulationResult ||
  mongoose.model<ISimulationResult>("SimulationResult", SimulationResultSchema);
