"use client";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { checkAnswerSchema } from "@/schema/form/quiz";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import BlankAnswerInput from "./BlankAnswerInput";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [now, setNow] = useState<Date>(new Date());
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [blankAnswer, setBlankAnswer] = useState<string>("");
  const { toast } = useToast();

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll("#user-blank-input").forEach((input: any) => {
        filledAnswer = filledAnswer.replace("-----", input.value);
        input.value = "";
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      const { data } = await axios.post("/api/checkAnswer", payload);
      return data;
    },
  });

  const handleNext = useCallback(async () => {
    if (isChecking) return;
    //console.log(blankAnswer);
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
          description: "Answers checked based on similarities!",
        });
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, isChecking, game.questions.length, questionIndex]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEnded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="absoluteCenter flex flex-col justify-center">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), "mt-4")}
        >
          View Statistics
          <BarChart className="ml-3 w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absoluteCenter max-w-4xl sm:w-[90vw] md:w-[80vw] ">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400 ">Topic:</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800 ml-3">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            <span>
              {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
            </span>
          </div>
        </div>
        {/* <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        /> */}
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex items-center flex-row ">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswerInput
          answer={currentQuestion.answer}
          setBlankAnswer={setBlankAnswer}
        />
        <Button className="mt-2" onClick={handleNext} disabled={isChecking}>
          {isChecking && <Loader2 className="mr-3 w-4 h-4 animate-spin" />}
          Next <ChevronRight className="ml-3 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
