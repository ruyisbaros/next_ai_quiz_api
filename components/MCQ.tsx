"use client";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { checkAnswerSchema } from "@/schema/form/quiz";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

type Props = {
  game: Game & { questions: Question[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const { toast } = useToast();
  let endedTime: Date;
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];

    return JSON.parse(currentQuestion.options as string);
  }, [currentQuestion]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const { data } = await axios.post("/api/checkAnswer", payload);
      return data;
    },
  });

  const handleNext = useCallback(async () => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Super! Answer is correct!",
            variant: "success",
          });
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: "Unfortunately, Answer is wrong!",
            variant: "destructive",
          });
          setWrongAnswers((prev) => prev + 1);
        }
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
      if (e.key === "1") {
        setSelectedChoice(0);
      } else if (e.key === "2") {
        setSelectedChoice(1);
      } else if (e.key === "3") {
        setSelectedChoice(2);
      } else if (e.key === "4") {
        setSelectedChoice(3);
      } else if (e.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    endedTime = new Date();
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
        <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
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
        {options.map((option: string, index: number) => {
          return (
            <Button
              key={index}
              className="w-full justify-start py-8 mb-4"
              variant={selectedChoice === index ? "default" : "secondary"}
              onClick={() => {
                setSelectedChoice(index);
              }}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option.slice(0, 120)}...</div>
              </div>
            </Button>
          );
        })}

        <Button className="mt-2" onClick={handleNext} disabled={isChecking}>
          {isChecking && <Loader2 className="mr-3 w-4 h-4 animate-spin" />}
          Next <ChevronRight className="ml-3 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
