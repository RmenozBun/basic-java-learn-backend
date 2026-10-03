import mongoose from "mongoose";
import nowInBangkok from "../timezone.js";

const lessonSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    level: { type: String, enum: ["easy", "medium", "hard"], required: true, index: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    icon: { type: String, default: "📘" },
    minutes: { type: Number, default: 10 },
    contentMarkdown: { type: String, required: true },
    createAt: { type: String, default: nowInBangkok },
    updateAt: { type: String, default: nowInBangkok },
  },
  { collection: "lessons", timestamps: false, versionKey: false },
);

lessonSchema.index({ level: 1, order: 1 });

lessonSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  this.set({ updateAt: nowInBangkok() });
});
lessonSchema.pre("save", function () {
  this.updateAt = nowInBangkok();
});

const LessonModel = mongoose.model("LessonModel", lessonSchema, "lessons");
export default LessonModel;
