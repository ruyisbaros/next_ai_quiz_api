"use client";
import React, { useMemo } from "react";
import keyword_extractor from "keyword-extractor";

type Props = {
  answer: string;
  setBlankAnswer:React.Dispatch<React.SetStateAction<string>>
};
const BLANKS = "-----";
const BlankAnswerInput = ({ answer,setBlankAnswer }: Props) => {
  const keywords = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    //console.log(words)
    const shuffled = words.sort(() => Math.random() - 0.5);
    //console.log(shuffled)
    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = useMemo(() => {
    const withBlanks = keywords.reduce((ac, val) => {
      return ac.replaceAll(val, BLANKS);
    }, answer);
    setBlankAnswer(withBlanks)
    return withBlanks;
  }, [keywords, answer]);

  //console.log(answerWithBlanks);

  return (
    <div className="flex justify-start w-full my-4 ">
      <h1 className="text-xl font-semibold">
        {answerWithBlanks.split(BLANKS).map((part, index) => {
          return (
            <>
              {part}
              {answerWithBlanks.split(BLANKS).length - 1 === index ? null : (
                <input
                  key={index}
                  id="user-blank-input"
                  type="text"
                  className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focuc:border-b-4 focus:outline-none"
                />
              )}
            </>
          );
        })}
      </h1>
    </div>
  );
};

export default BlankAnswerInput;
