import resError from "http-errors";
import ExerciseModel from "../model/exercise.model.js";
import LessonModel from "../model/lesson.model.js";
import SubmissionModel from "../model/submission.model.js";

export default class ProgressService {
  async getByEmail(studentEmail) {
    if (!studentEmail) throw resError(400, "กรุณาระบุอีเมล");

    const [lessons, exercises, passedSubmissions] = await Promise.all([
      LessonModel.find().select("_id level").lean(),
      ExerciseModel.find().select("_id lessonId").lean(),
      SubmissionModel.find({ studentEmail, passed: true }).select("exerciseId").lean(),
    ]);

    const exerciseToLevel = new Map();
    const lessonLevelById = new Map(lessons.map((lesson) => [String(lesson._id), lesson.level]));
    exercises.forEach((exercise) => {
      exerciseToLevel.set(String(exercise._id), lessonLevelById.get(String(exercise.lessonId)));
    });

    const totalByLevel = { easy: 0, medium: 0, hard: 0 };
    exercises.forEach((exercise) => {
      const level = exerciseToLevel.get(String(exercise._id));
      if (level) totalByLevel[level] += 1;
    });

    const passedExerciseIds = new Set(passedSubmissions.map((submission) => String(submission.exerciseId)));
    const completedByLevel = { easy: 0, medium: 0, hard: 0 };
    passedExerciseIds.forEach((exerciseId) => {
      const level = exerciseToLevel.get(exerciseId);
      if (level) completedByLevel[level] += 1;
    });

    return {
      totalByLevel,
      completedByLevel,
      completedExerciseIds: [...passedExerciseIds],
    };
  }
}
