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
  };
  status: "IN_PROGRESS" | "COMPLETED";
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
  startedAt: Date;
  completedAt?: Date;
}

const SimulationAttemptSchema = new mongoose.Schema<ISimulationAttempt>({
  candidate: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  status: { type: String, enum: ["IN_PROGRESS", "COMPLETED"], default: "IN_PROGRESS" },
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
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

export const SimulationAttempt: Model<ISimulationAttempt> =
  mongoose.models.SimulationAttempt ||
  mongoose.model<ISimulationAttempt>("SimulationAttempt", SimulationAttemptSchema);
