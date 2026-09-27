import mongoose from "mongoose";
import resError from "http-errors";
import LessonModel from "../model/lesson.model.js";
import ExerciseModel from "../model/exercise.model.js";
import SubmissionModel from "../model/submission.model.js";

// MongoDB would sort the `level` string alphabetically (easy, hard, medium),
// not by actual difficulty — always resolve display order through this map.
const LEVEL_ORDER = { easy: 1, medium: 2, hard: 3 };

const sortByLevelThenOrder = (lessons) => {
  const byOrder = [...lessons].sort((a, b) => a.order - b.order);
  return byOrder.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
};

export default class LessonService {
  async list(level, studentEmail) {
    const filter = level ? { level } : {};
    const lessons = sortByLevelThenOrder(await LessonModel.find(filter).lean());
    if (!studentEmail) return lessons.map((lesson) => ({ ...lesson, completed: false }));

    const lessonIds = lessons.map((lesson) => lesson._id);
    const exercises = await ExerciseModel.find({ lessonId: { $in: lessonIds } })
      .select("_id lessonId")
      .lean();
    const passedSubmissions = await SubmissionModel.find({ studentEmail, passed: true })
      .select("exerciseId")
      .lean();
    const passedExerciseIds = new Set(passedSubmissions.map((submission) => String(submission.exerciseId)));

    const totalByLesson = new Map();
    const passedByLesson = new Map();
    exercises.forEach((exercise) => {
      const lessonId = String(exercise.lessonId);
      totalByLesson.set(lessonId, (totalByLesson.get(lessonId) || 0) + 1);
      if (passedExerciseIds.has(String(exercise._id))) {
        passedByLesson.set(lessonId, (passedByLesson.get(lessonId) || 0) + 1);
      }
    });

    return lessons.map((lesson) => {
      const id = String(lesson._id);
      const total = totalByLesson.get(id) || 0;
      const passed = passedByLesson.get(id) || 0;
      return { ...lesson, completed: total > 0 && passed === total };
    });
  }

  async getOne(slug, studentEmail) {
    const lesson = await LessonModel.findOne({ slug }).lean();
    if (!lesson) throw resError(404, "ไม่พบบทเรียนนี้");

    const exercises = await ExerciseModel.find({ lessonId: lesson._id })
      .sort({ order: 1 })
      .select("-testCases.expectedOutput")
      .lean();

    // Without this, revisiting an already-passed lesson shows no sign it was
    // ever completed — the "passed" state otherwise only exists as in-memory
    // Vue state set right after a submission, gone on the next page load.
    let passedExerciseIds = new Set();
    if (studentEmail) {
      const passedSubmissions = await SubmissionModel.find({
        studentEmail,
        passed: true,
        exerciseId: { $in: exercises.map((exercise) => exercise._id) },
      })
        .select("exerciseId")
        .lean();
      passedExerciseIds = new Set(passedSubmissions.map((submission) => String(submission.exerciseId)));
    }
    const exercisesWithStatus = exercises.map((exercise) => ({
      ...exercise,
      passed: passedExerciseIds.has(String(exercise._id)),
    }));

    const allLessons = sortByLevelThenOrder(await LessonModel.find().select("slug title level").lean());
    const currentIndex = allLessons.findIndex((item) => item.slug === slug);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return { ...lesson, exercises: exercisesWithStatus, prevLesson, nextLesson };
  }

  async getExercise(id) {
    if (!mongoose.isValidObjectId(id)) throw resError(404, "ไม่พบแบบฝึกหัดนี้");
    const exercise = await ExerciseModel.findById(id).select("-testCases.expectedOutput").lean();
    if (!exercise) throw resError(404, "ไม่พบแบบฝึกหัดนี้");
    return exercise;
  }
}
