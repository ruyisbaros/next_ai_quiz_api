import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/nextAuth";
import { quizCreationSchema } from "@/schema/form/quiz";
import { prisma } from "@/lib/db";
import axios from "axios";

// /api/game
export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must logged in to create a quiz!",
        },
        { status: 403 }
      );
    }
    const body = await req.json();
    const { amount, type, topic } = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        topic,
        timeStarted: new Date(),
        userId: session.user.id,
      },
    });
    await prisma.topic_count.upsert({
      where: { topic },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });
    const { data } = await axios.post(
      `${process.env.API_URL as string}/api/questions`,
      {
        amount,
        topic,
        type,
      }
    );

    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };
      let manyData = data.questions.map((question: mcqQuestion) => {
        let options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      type endedQuestion = {
        question: string;
        answer: string;
      };
      let manyData = data.questions.map((question: endedQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: "open_ended",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    }

    return NextResponse.json({
      gameId: game.id,
    });
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
