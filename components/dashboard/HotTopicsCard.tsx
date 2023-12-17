import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomWords from "../CustomWords";
import { prisma } from "@/lib/db";

type Props = {};

const HotTopicsCard = async (props: Props) => {
  const topics = await prisma.topic_count.findMany({});
  const formattedTopics = topics.map((top) => {
    return {
      text: top.topic,
      value: top.count,
    };
  });
  return (
    <Card className="col-span-4">
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold">Hot Topics!</CardTitle>
        <CardDescription>
          Click on a topic which subject you want to test yourself!
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <CustomWords formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
