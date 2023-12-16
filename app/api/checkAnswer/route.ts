import { checkAnswerSchema } from "@/schema/form/quiz";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/nextAuth";
import { prisma } from "@/lib/db";
import axios from "axios";
import { compareTwoStrings } from "string-similarity";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { userAnswer, questionId } = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          error: "No question found!",
        },
        { status: 400 }
      );
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { userAnswer },
    });

    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();
      await prisma.question.update({
        where: { id: questionId },
        data: { isCorrect },
      });
      return NextResponse.json({ isCorrect }, { status: 200 });
    } else if (question.questionType === "open_ended") {
      let percentageSimilar = compareTwoStrings(
        userAnswer.toLowerCase().trim(),
        question.answer.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);
      await prisma.question.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar },
      });
      return NextResponse.json({ percentageSimilar }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Something went wrong with AI",
      },
      { status: 400 }
    );
  }
}
