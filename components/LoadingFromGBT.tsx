import React, { useState } from "react";
import Image from "next/image";
import { Progress } from "./ui/progress";
type Props = { finished: boolean };

const loadingTexts = [
  "Generating questions...",
  "Unleashing the power of curiosity...",
  "Diving deep into the ocean of questions..",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

const LoadingFromGBT = ({ finished }: Props) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) {
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 1;
        }
        return prev + 0.25;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);
  return (
    <div className="w-[70vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[60vw] flex flex-col items-center">
      <Image src="/loading.gif" alt="Loading Image" width={400} height={400} />
      <Progress value={progress} className="w-full mt-4" />
      <h1 className="mt-2 text-xl">{loadingText}</h1>
    </div>
  );
};

export default LoadingFromGBT;
