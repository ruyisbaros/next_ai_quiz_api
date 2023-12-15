import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(3, { message: "Topic must be min 3 chars long." })
    .max(50, { message: "Topic must be max 50 chars long." }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
});

export const checkAnswerSchema = z.object({
 questionId:z.string(),
 userAnswer:z.string()
});
