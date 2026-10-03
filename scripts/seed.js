import mongoose from "mongoose";
import { connectDB } from "../src/connect.js";
import LessonModel from "../src/model/lesson.model.js";
import ExerciseModel from "../src/model/exercise.model.js";
import { lessons, readFile, readExerciseTexts } from "./lessons.data.js";

const run = async () => {
  await connectDB();

  for (const lesson of lessons) {
    const { exercises, ...lessonData } = lesson;
    const savedLesson = await LessonModel.findOneAndUpdate(
      { slug: lessonData.slug },
      { ...lessonData, contentMarkdown: readFile(`${lessonData.slug}.md`) },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    // Upsert by (lesson, order) instead of delete + insert so exercise _ids stay
    // stable — submissions reference them, and re-seeding must not wipe students' progress.
    for (const exercise of exercises) {
      const { prompt, hint, explanation } = readExerciseTexts(lessonData.slug, exercise.order);
      await ExerciseModel.findOneAndUpdate(
        { lessonId: savedLesson._id, order: exercise.order },
        {
          ...exercise,
          lessonId: savedLesson._id,
          prompt,
          hint,
          solutionExplanation: explanation,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    await ExerciseModel.deleteMany({
      lessonId: savedLesson._id,
      order: { $nin: exercises.map((exercise) => exercise.order) },
    });

    console.log(`Seeded lesson: ${savedLesson.slug} (${exercises.length} exercises)`);
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
