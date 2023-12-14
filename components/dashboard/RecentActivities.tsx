import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {};

const RecentActivities = (props: Props) => {
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
        <CardDescription>You have played a total 12 quizzes.</CardDescription>
      </CardHeader>
      <CardContent className="scrollBar max-h-[580px] overflow-y-scroll">
        Histories
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
