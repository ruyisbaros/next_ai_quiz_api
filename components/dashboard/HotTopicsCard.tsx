"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomWords from "../CustomWords";

type Props = {};

const HotTopicsCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="col-span-4"
      onClick={() => {
        router.push("/history");
      }}
    >
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold">Hot Topics!</CardTitle>
        <CardDescription>
          Click on a topic which subject you want to test yourself!
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWords/>
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
