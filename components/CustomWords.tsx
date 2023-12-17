"use client";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  formattedTopics: {
    text: string;
    value: number;
  }[];
};

const data = [
  {
    text: "java development",
    value: 13,
  },
  {
    text: "calculus",
    value: 10,
  },
  {
    text: "java script",
    value: 8,
  },
  {
    text: "books",
    value: 12,
  },
  {
    text: "cats",
    value: 7,
  },
  {
    text: "C Sharp",
    value: 1,
  },
  {
    text: "Redux",
    value: 2,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const CustomWords = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
        data={data}
      />
    </>
  );
};

export default CustomWords;
