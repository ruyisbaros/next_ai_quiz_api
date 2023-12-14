"use client";
import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {};

const data = [
  {
    text: "HTML",
    value: 3,
  },
  {
    text: "CSS",
    value: 5,
  },
  {
    text: "React",
    value: 10,
  },
  {
    text: "Next Js",
    value: 8,
  },
  {
    text: "Typescript",
    value: 7,
  },
  {
    text: "C Sharp",
    value: 1,
  },
  {
    text: "Redux",
    value: 12,
  },
  {
    text: "Next-Auth",
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
