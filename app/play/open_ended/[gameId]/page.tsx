import { prisma } from "@/lib/db";
import React from "react";
import { redirect } from "next/navigation";
import OpenEnded from "@/components/OpenEnded";

type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = async ({ params: { gameId } }: Props) => {
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });
  if (!game || game.gameType !== "open_ended") {
    return redirect("/quiz");
  }
  return <OpenEnded />;
};

export default OpenEndedPage;
