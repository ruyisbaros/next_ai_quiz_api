"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

type Props = {
  text: string;
};

const SignInBtn = ({ text }: Props) => {
  return (
    <Button
      onClick={() => {
        signIn("google").catch((error) => console.log(error));
      }}
      className="dark:text-white dark:bg-gray-700"
    >
      {text}
    </Button>
  );
};

export default SignInBtn;
