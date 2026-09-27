import mongoose from "mongoose";
import nowInBangkok from "../timezone.js";

const testCaseSchema = new mongoose.Schema(
  {
    stdin: { type: String, default: "" },
    expectedOutput: { type: String, required: true },
  },
  { _id: false },
);

const exerciseSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "LessonModel", required: true, index: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    starterCode: { type: String, required: true },
    testCases: { type: [testCaseSchema], default: [] },
    createAt: { type: String, default: nowInBangkok },
    updateAt: { type: String, default: nowInBangkok },
  },
  { collection: "exercises", timestamps: false, versionKey: false },
);

exerciseSchema.index({ lessonId: 1, order: 1 });

exerciseSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  this.set({ updateAt: nowInBangkok() });
});
exerciseSchema.pre("save", function () {
  this.updateAt = nowInBangkok();
});

const ExerciseModel = mongoose.model("ExerciseModel", exerciseSchema, "exercises");
export default ExerciseModel;
