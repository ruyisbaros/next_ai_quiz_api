import { getAuthSession } from "@/lib/nextAuth";
import Link from "next/link";
import React from "react";
import SignInBtn from "./SigninBtn";
import UserAccount from "./UserAccount";

type Props = {};

const Navbar = async (props: Props) => {
   const session = await getAuthSession();

  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black dark:border-white px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:text-white">
            AI-Quiz
          </p>
        </Link>
        <div className="flex items-center ">
          {session?.user ? <UserAccount user={session?.user}/> : <SignInBtn text="Sign In" />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
