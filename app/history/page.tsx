import { getAuthSession } from "@/lib/nextAuth";
import React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LucideLayoutDashboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import HistoryComponent from "@/components/HistoryComponent";

type Props = {};

const HistoryPage = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className="absoluteCenter w-[500px]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="scrollBar max-h-[580px] overflow-y-scroll">
          <HistoryComponent limit={50} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
