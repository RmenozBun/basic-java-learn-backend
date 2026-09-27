import mongoose from "mongoose";
import nowInBangkok from "../timezone.js";

const caseResultSchema = new mongoose.Schema(
  {
    stdin: { type: String, default: "" },
    expectedOutput: { type: String, default: "" },
    actualOutput: { type: String, default: "" },
    passed: { type: Boolean, default: false },
    statusDescription: { type: String, default: "" },
  },
  { _id: false },
);

const submissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true, index: true },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "ExerciseModel", required: true, index: true },
    code: { type: String, required: true },
    passed: { type: Boolean, default: false },
    totalCases: { type: Number, default: 0 },
    passedCases: { type: Number, default: 0 },
    caseResults: { type: [caseResultSchema], default: [] },
    createAt: { type: String, default: nowInBangkok },
  },
  { collection: "submissions", timestamps: false, versionKey: false },
);

submissionSchema.index({ studentEmail: 1, exerciseId: 1, createAt: -1 });

const SubmissionModel = mongoose.model("SubmissionModel", submissionSchema, "submissions");
export default SubmissionModel;
