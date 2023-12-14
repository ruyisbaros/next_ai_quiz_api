import { getAuthSession } from "@/lib/nextAuth";
import React from "react";
import { redirect } from "next/navigation";
import QuizCard from "@/components/dashboard/QuizCard";
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import RecentActivities from "@/components/dashboard/RecentActivities";

type Props = {};

export const metadata = {
  title: "Dashboard",
};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-[50px] md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivities/>
      </div>
    </main>
  );
};

export default Dashboard;
