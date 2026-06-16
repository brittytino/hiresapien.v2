import mongoose, { Document, Model } from "mongoose";

export interface ISimulationInteraction {
  taskId: string;
  missionId: string;
  interactionType: string;
  selectedOption?: string | string[];
  textValue?: string;
  sliderValue?: number;
  scoreEarned: number;
  maxScore: number;
  competenciesHit: string[];
}

export interface ISimulationAttempt extends Document {
  candidate: {
    name: string;
    email: string;
    phone: string;
    degree?: string;
    year?: string;
    skills?: string[];
    confidence?: number;
  };
  status: "IN_PROGRESS" | "COMPLETED" | "TERMINATED";
  interactions: ISimulationInteraction[];
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
  overallScore: number;
  readinessLevel: string;
  archetype?: string;
  strengths?: string[];
  improvements?: string[];
  startedAt: Date;
  completedAt?: Date;
  warningCount: number;
  warningEvents: {
    timestamp: Date;
    reason: string;
  }[];
}

const SimulationAttemptSchema = new mongoose.Schema<ISimulationAttempt>({
  candidate: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    degree: { type: String },
    year: { type: String },
    skills: [{ type: String }],
    confidence: { type: Number },
  },
  status: { type: String, enum: ["IN_PROGRESS", "COMPLETED", "TERMINATED"], default: "IN_PROGRESS" },
  interactions: [
    {
      taskId: { type: String, required: true },
      missionId: { type: String, required: true },
      interactionType: { type: String, required: true },
      selectedOption: { type: mongoose.Schema.Types.Mixed },
      textValue: { type: String },
      sliderValue: { type: Number },
      scoreEarned: { type: Number, required: true },
      maxScore: { type: Number, required: true },
      competenciesHit: [{ type: String }],
    },
  ],
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
  overallScore: { type: Number, default: 0 },
  readinessLevel: { type: String, default: "Explorer" },
  archetype: { type: String },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  warningCount: { type: Number, default: 0 },
  warningEvents: [
    {
      timestamp: { type: Date, default: Date.now },
      reason: { type: String, required: true },
    },
  ],
});

export const SimulationAttempt: Model<ISimulationAttempt> =
  mongoose.models.SimulationAttempt ||
  mongoose.model<ISimulationAttempt>("SimulationAttempt", SimulationAttemptSchema);
